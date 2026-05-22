from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, text
from datetime import datetime
from .config import DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    extracted_skills = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String(255))
    raw_text = Column(Text, nullable=False)
    extracted_skills = Column(Text)  # JSON string
    filename = Column(String(255))
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class MatchScore(Base):
    __tablename__ = "match_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    score = Column(Float, nullable=False)
    matched_skills = Column(Text)  # JSON string
    missing_skills = Column(Text)   # JSON string
    summary = Column(Text)         # JSON string (ContextualResumeSummarizer output)
    created_at = Column(DateTime, default=datetime.utcnow)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # Attempt to add 'summary' column if it does not exist
        try:
            await conn.execute(text("ALTER TABLE match_scores ADD COLUMN summary TEXT"))
            print("Successfully added summary column to match_scores table via alter table.")
        except Exception as e:
            # Usually fails if column already exists
            print(f"Alter table migration status: {e}")

async def get_db():
    async with async_session() as session:
        yield session

