import os
from pathlib import Path

# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "app" / "data"
SKILLS_FILE = DATA_DIR / "skills.json"
DATABASE_URL = f"sqlite+aiosqlite:///{BASE_DIR}/resume_matcher.db"

# File upload settings
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".pdf", ".docx"}

# NLP settings
SPACY_MODEL = "en_core_web_lg"
MIN_SKILL_LENGTH = 2
