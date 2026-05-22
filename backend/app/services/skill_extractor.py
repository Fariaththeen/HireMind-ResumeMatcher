import spacy
import json
from spacy.matcher import PhraseMatcher
from pathlib import Path
from typing import List, Dict, Set
import logging

logger = logging.getLogger(__name__)

class SkillExtractor:
    """Extract skills from text using spaCy PhraseMatcher"""
    
    def __init__(self, skills_file: Path):
        # Load spaCy model
        self.nlp = spacy.load("en_core_web_lg")
        
        # Load skills
        with open(skills_file, 'r') as f:
            skills_data = json.load(f)
        
        # Flatten skills list
        self.skills_list = []
        if isinstance(skills_data, dict):
            for category, skills in skills_data.items():
                self.skills_list.extend(skills)
        else:
            self.skills_list = skills_data
        
        # Remove duplicates and sort by length (longer phrases first for matching)
        self.skills_list = list(set(self.skills_list))
        self.skills_list.sort(key=len, reverse=True)
        
        # Build PhraseMatcher
        self.matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        patterns = [self.nlp.make_doc(skill) for skill in self.skills_list]
        self.matcher.add("SKILLS", patterns)
        
        # Build lookup for canonical casing
        self.skills_lookup = {skill.lower(): skill for skill in self.skills_list}
        
        logger.info(f"Loaded {len(self.skills_list)} skills for matching")
    
    async def extract_skills(self, text: str) -> List[str]:
        """
        Extract skills from text using PhraseMatcher
        
        Args:
            text: Input text (resume or job description)
            
        Returns:
            List of extracted skills (unique, sorted alphabetically)
        """
        if not text or not text.strip():
            return []
        
        # Process text with spaCy
        doc = self.nlp(text[:1000000])  # Limit to 1M chars for performance
        
        # Find matches
        matches = self.matcher(doc)
        
        # Extract matched spans mapped to canonical skills
        extracted = set()
        for match_id, start, end in matches:
            span = doc[start:end]
            canonical = self.skills_lookup.get(span.text.lower())
            if canonical:
                extracted.add(canonical)
        
        # Convert to sorted list
        result = sorted(list(extracted))
        
        logger.info(f"Extracted {len(result)} skills from text")
        return result
    
    async def extract_skills_with_metadata(self, text: str) -> Dict:
        """
        Extract skills and provide additional metadata
        
        Returns:
            Dictionary with skills list and counts
        """
        skills = await self.extract_skills(text)
        
        # Count word frequency (for potential weighting)
        doc = self.nlp(text[:1000000])
        word_freq = {}
        for token in doc:
            if token.text in skills:
                word_freq[token.text] = word_freq.get(token.text, 0) + 1
        
        return {
            "skills": skills,
            "count": len(skills),
            "frequency": word_freq
        }
