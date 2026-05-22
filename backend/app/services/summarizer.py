import os
import json
import logging
from typing import Dict, List, Any
import spacy
from groq import AsyncGroq
from dotenv import load_dotenv
from rapidfuzz import fuzz

from app.config import DATA_DIR

logger = logging.getLogger(__name__)
load_dotenv()

class ContextualResumeSummarizer:
    """
    Generates role-specific resume summaries by retrieving relevant
    context from job descriptions and industry standards using Groq API.
    """
    
    def __init__(self, nlp=None):
        groq_api_key = os.environ.get("GROQ_API_KEY")
        if groq_api_key:
            self.client = AsyncGroq(api_key=groq_api_key)
            logger.info("Groq client initialized for resume summarization.")
            self.nlp = nlp or spacy.load("en_core_web_lg")
            self.knowledge_base_path = DATA_DIR / "industry_knowledge_base.json"
            self.knowledge_base = []
            self._load_knowledge_base()
        else:
            self.client = None
            self.nlp = None
            self.knowledge_base_path = None
            self.knowledge_base = []
            logger.warning("No GROQ_API_KEY found. Resume summarization is disabled.")
            
    def _load_knowledge_base(self):
        if self.knowledge_base_path.exists():
            try:
                with open(self.knowledge_base_path, 'r') as f:
                    self.knowledge_base = json.load(f)
                logger.info(f"Loaded {len(self.knowledge_base)} items from industry knowledge base.")
            except Exception as e:
                logger.error(f"Error loading knowledge base: {e}")
                self._create_default_knowledge_base()
        else:
            self._create_default_knowledge_base()
            
    def _create_default_knowledge_base(self):
        self.knowledge_base = [
            {"category": "industry_benchmarks", "role_keyword": "python", "content": "For a strong Python Developer candidate, look for deep understanding of asyncio, PEP 8 code compliance, testing practices using pytest, SQL/NoSQL databases, microservices architecture, and backend frameworks like FastAPI or Django."},
            {"category": "industry_benchmarks", "role_keyword": "react", "content": "For Frontend/React developers, industry benchmarks prioritize state management (Zustand, Redux, Context API), responsive layouts, TailwindCSS, performance optimization (lazy loading, virtual lists), and clean TypeScript practices."},
            {"category": "industry_benchmarks", "role_keyword": "devops", "content": "DevOps roles require experience with containerization (Docker), orchestration (Kubernetes), Infrastructure as Code (Terraform), CI/CD pipelines (GitHub Actions, GitLab CI), and cloud provider administration (AWS, Azure, GCP)."},
            {"category": "industry_benchmarks", "role_keyword": "mechanical", "content": "For Mechanical Engineers, industry benchmarks require strong knowledge of CAD/CAM systems (SolidWorks, AutoCAD), thermodynamics, structural mechanics, finite element analysis (FEA), materials science, and product design lifecycles."},
            {"category": "industry_benchmarks", "role_keyword": "general", "content": "A high-quality software candidate demonstrates clean coding standards, robust unit testing coverage, familiarity with version control via Git, documentation quality, and API design principles."},
            {"category": "company_context", "role_keyword": "general", "content": "Recruiters and hiring managers highly value rapid prototyping capability, remote/hybrid team collaboration, agile delivery frameworks (Scrum/Kanban), clear written communication, and growth mindset."},
            {"category": "company_context", "role_keyword": "engineering", "content": "Engineering team standards emphasize code review participation, scalability awareness, active system debugging, and a focus on product security best practices."},
            {"category": "career_path", "role_keyword": "senior", "content": "Typical career progression to a Senior Engineer role requires moving from individual feature delivery to system architecture design, database performance optimization, mentoring junior staff, and leading project releases."},
            {"category": "career_path", "role_keyword": "general", "content": "Standard professional career growth displays progressive increase in responsibilities, leading technical initiatives, owning key code repositories, and showing deep business/domain impact."},
            {"category": "red_flags", "role_keyword": "general", "content": "Recruiter-reported red flags include keyword stuffing without context, high job-hopping history (less than 6 months per role repeatedly) without context, lack of quantifiable impact metrics, and unexplained multi-year gaps."},
            {"category": "red_flags", "role_keyword": "technical", "content": "Technical resume concerns include lack of familiarity with modern tools, claiming expert-level skill without professional project application, and neglecting to mention testing or code quality frameworks."}
        ]
        try:
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            with open(self.knowledge_base_path, 'w') as f:
                json.dump(self.knowledge_base, f, indent=2)
            logger.info("Written default knowledge base items to disk.")
        except Exception as e:
            logger.error(f"Failed to write default knowledge base: {e}")

    def _extract_role_patterns(self, job_description: str) -> List[str]:
        """
        Extract role-critical information patterns from the Job Description
        """
        if not job_description:
            return []
        doc = self.nlp(job_description[:1000000])
        patterns = []
        for sent in doc.sents:
            text = sent.text.strip()
            if any(kw in text.lower() for kw in ['must', 'required', 'responsible for', 'experience with', 'skills', 'qualification']):
                patterns.append(text)
                if len(patterns) >= 5:
                    break
        return patterns

    def _retrieve_evaluation_perspectives(self, resume_text: str, jd: Dict[str, Any]) -> Dict[str, List[str]]:
        """
        Retrieve multiple perspectives for evaluation using SpaCy document similarity
        """
        role = jd.get('role', 'Developer')
        queries = {
            'industry_benchmarks': f"What makes a strong {role} candidate? Core skills, certifications, and technical standards.",
            'company_context': f"Hiring patterns, team culture fit, and soft skills for {role} roles.",
            'career_path': f"Typical career progression, growth paths, and seniority expectations for a {role}.",
            'red_flags': f"Common resume red flags, gaps, and issues in {role} applications."
        }
        
        query_docs = {cat: self.nlp(q) for cat, q in queries.items()}
        perspectives = {cat: [] for cat in queries}
        
        if not self.knowledge_base:
            return perspectives
            
        kb_docs = [(item, self.nlp(item.get('content', ''))) for item in self.knowledge_base]
            
        for cat, query_doc in query_docs.items():
            scored_items = [
                (item, query_doc.similarity(doc))
                for item, doc in kb_docs
                if not item.get('category') or item.get('category') == cat
            ]
            scored_items.sort(key=lambda x: x[1], reverse=True)
            k = 3 if cat in ('industry_benchmarks', 'red_flags') else 2
            perspectives[cat] = [item['content'] for item, _ in scored_items[:k]]
            
        return perspectives

    async def generate_role_specific_summary(self, resume_text: str, job_description: str, job_title: str = "Candidate") -> Dict[str, Any]:
        """
        Create summary focused on what matters for this specific role.
        """
        if not self.client:
            logger.warning("Groq API key not configured. Skipping resume summarization.")
            return None
            
        jd = {"role": job_title, "requirements": job_description}
        role_patterns = self._extract_role_patterns(job_description)
        perspectives = self._retrieve_evaluation_perspectives(resume_text, jd)
        return await self._generate_structured_summary(resume_text, jd, perspectives, role_patterns)

    async def _generate_structured_summary(self, resume: str, jd: Dict[str, Any], perspectives: Dict[str, List[str]], patterns: List[str]) -> Dict[str, Any]:
        """
        Generate multi-section summary with confidence indicators (using Groq)
        """
        if not self.client:
            raise ValueError("Groq API key not configured. Resume summarization requires GROQ_API_KEY.")
            
        prompt = f"""
        Create a structured summary of this resume for a {jd['role']} position.
        
        Original Resume (truncated): {resume[:4000]}
        Job Requirements: {jd['requirements']}
        
        Industry Context: {json.dumps(perspectives['industry_benchmarks'])}
        Career Patterns: {json.dumps(perspectives['career_path'])}
        Company Context: {json.dumps(perspectives['company_context'])}
        Red Flag Benchmarks: {json.dumps(perspectives['red_flags'])}
        
        Return a structured JSON object containing exactly the following schema. Make sure to only return valid JSON. Do not include markdown code block syntax.
        
        Required JSON Structure:
        {{
          "executive_summary": {{
            "text": "2-3 sentence overview of fit, standouts, and overall summary.",
            "confidence": "HIGH" | "MEDIUM" | "LOW"
          }},
          "skills_alignment": [
            {{
              "skill": "Skill Name",
              "candidate_level": "Expert" | "Intermediate" | "Familiar" | "None",
              "evidence": "Concrete proof or sentence from the resume, or gap statement",
              "confidence": "HIGH" | "MEDIUM" | "LOW",
              "gap_severity": "HIGH" | "MODERATE" | null,
              "mitigation": "For gaps, how they might adapt or transferable skills, or null"
            }}
          ],
          "potential_concerns": [
            {{
              "concern": "Description of skill gap or pattern concern",
              "severity": "High" | "Medium" | "Low",
              "mitigating_factors": ["Mitigating factor 1", "Mitigating factor 2"]
            }}
          ],
          "recommended_next_steps": {{
            "proceed_to_interview": true | false,
            "interview_focus": [
              "Technical assessment focus area",
              "Behavioral check topic"
            ]
          }}
        }}
        
        Guidelines:
        - Be specific with evidence from resume.
        - Use confidence levels (HIGH/MEDIUM/LOW).
        - Keep descriptions concise yet high quality.
        """
        
        try:
            response = await self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a professional recruiting assistant that outputs strictly structured JSON summaries."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                temperature=0.2
            )
            
            summary = json.loads(response.choices[0].message.content)
            return self._add_citation_anchors(summary, resume)
        except Exception as e:
            logger.error(f"Groq API call failed: {e}")
            raise RuntimeError(f"Failed to generate resume summary: {e}") from e

    def _add_citation_anchors(self, summary: Dict[str, Any], resume_text: str) -> Dict[str, Any]:
        """
        Add clickable citations and line locations to the original resume text
        """
        if 'skills_alignment' in summary:
            for item in summary['skills_alignment']:
                if item.get('candidate_level') == 'None' or not item.get('evidence'):
                    item['resume_location'] = None
                else:
                    item['resume_location'] = self._find_text_span(item.get('evidence', ''), resume_text)
        return summary

    def _find_text_span(self, evidence: str, resume_text: str) -> str:
        """
        Find the closest matching line or segment in the resume text for the evidence
        """
        if not evidence or not resume_text:
            return "Resume document"
            
        lines = resume_text.split('\n')
        best_line = -1
        best_ratio = 0
        
        for idx, line in enumerate(lines):
            ratio = fuzz.partial_ratio(evidence.lower(), line.lower())
            if ratio > best_ratio and ratio > 65:
                best_ratio = ratio
                best_line = idx + 1
                
        if best_line != -1:
            return f"Line {best_line}, Experience/Details"
            
        return "Skills / Summary section"
