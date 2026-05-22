from app.config import SKILLS_FILE
from .skill_extractor import SkillExtractor
from .text_extractor import TextExtractor
from .matcher import SkillMatcher
from .summarizer import ContextualResumeSummarizer

# Create single instance to be used across app
skill_extractor = SkillExtractor(SKILLS_FILE)
matcher = SkillMatcher()
resume_summarizer = ContextualResumeSummarizer()

