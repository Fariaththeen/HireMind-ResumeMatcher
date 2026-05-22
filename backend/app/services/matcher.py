from typing import List, Dict, Tuple
from rapidfuzz import fuzz, process
import logging

logger = logging.getLogger(__name__)

class SkillMatcher:
    """Match resume skills with job requirements and calculate scores"""
    
    def __init__(self, fuzzy_threshold: int = 85):
        self.fuzzy_threshold = fuzzy_threshold
    
    def fuzzy_match_skills(self, 
                          resume_skills: List[str], 
                          job_skills: List[str]) -> Tuple[List[str], List[str], List[Tuple]]:
        """
        Match skills using fuzzy matching to handle variations
        
        Returns:
            - matched_skills: Skills from job found in resume
            - missing_skills: Skills from job NOT found in resume  
            - match_details: List of (job_skill, resume_skill, confidence)
        """
        matched = []
        missing = []
        match_details = []
        
        # Create lowercase versions for case-insensitive matching
        resume_lower = [s.lower() for s in resume_skills]
        
        for job_skill in job_skills:
            job_lower = job_skill.lower()
            
            # First try exact match
            if job_lower in resume_lower:
                matched.append(job_skill)
                idx = resume_lower.index(job_lower)
                match_details.append((job_skill, resume_skills[idx], 100))
            else:
                # Try fuzzy matching
                best_match = None
                best_score = 0
                
                for resume_skill in resume_skills:
                    score = fuzz.ratio(job_lower, resume_skill.lower())
                    if score > best_score:
                        best_score = score
                        best_match = resume_skill
                
                if best_score >= self.fuzzy_threshold:
                    matched.append(job_skill)
                    match_details.append((job_skill, best_match, best_score))
                else:
                    missing.append(job_skill)
        
        return matched, missing, match_details
    
    def calculate_score(self, 
                       job_skills: List[str], 
                       resume_skills: List[str],
                       required_skills: List[str] = None) -> Dict:
        """
        Calculate match score between job requirements and resume skills
        
        Args:
            job_skills: All skills mentioned in job description
            resume_skills: Skills found in resume
            required_skills: Subset of job_skills that are "required" (higher weight)
            
        Returns:
            Dictionary with score, matched, missing, and detailed analysis
        """
        if not job_skills:
            return {
                "score": 0.0,
                "matched_skills": [],
                "missing_skills": [],
                "match_details": [],
                "analysis": "No job skills defined"
            }
        
        if required_skills is None:
            required_skills = job_skills
        
        # Match skills
        matched, missing, match_details = self.fuzzy_match_skills(
            resume_skills, job_skills
        )
        
        # Separate required vs preferred matches
        matched_required = [s for s in matched if s in required_skills]
        missing_required = [s for s in missing if s in required_skills]
        matched_preferred = [s for s in matched if s not in required_skills]
        missing_preferred = [s for s in missing if s not in required_skills]
        
        # Calculate weighted score
        # Required skills have double weight
        required_weight = 2
        preferred_weight = 1
        
        total_weighted = len(required_skills) * required_weight + \
                        (len(job_skills) - len(required_skills)) * preferred_weight
        
        achieved_weighted = len(matched_required) * required_weight + \
                           len(matched_preferred) * preferred_weight
        
        if total_weighted == 0:
            score = 0.0
        else:
            score = (achieved_weighted / total_weighted) * 100
        
        # Generate analysis
        analysis = self._generate_analysis(
            score, matched, missing, 
            matched_required, missing_required
        )
        
        return {
            "score": round(score, 2),
            "matched_skills": matched,
            "missing_skills": missing,
            "matched_required": matched_required,
            "missing_required": missing_required,
            "matched_preferred": matched_preferred,
            "missing_preferred": missing_preferred,
            "match_details": match_details,
            "analysis": analysis
        }
    
    def _generate_analysis(self, score: float, 
                          matched: List[str], 
                          missing: List[str],
                          matched_required: List[str],
                          missing_required: List[str]) -> str:
        """Generate human-readable analysis of the match"""
        if score >= 80:
            level = "Excellent match"
        elif score >= 60:
            level = "Good match"
        elif score >= 40:
            level = "Average match"
        else:
            level = "Poor match"
        
        analysis = f"{level} ({score:.2f}%)\n"
        
        if matched_required:
            analysis += f"✅ Has {len(matched_required)} required skills: {', '.join(matched_required[:5])}"
            if len(matched_required) > 5:
                analysis += f"... and {len(matched_required) - 5} more"
            analysis += "\n"
        
        if missing_required:
            analysis += f"❌ Missing {len(missing_required)} required skills: {', '.join(missing_required[:5])}"
            if len(missing_required) > 5:
                analysis += f"... and {len(missing_required) - 5} more"
            analysis += "\n"
        
        return analysis
