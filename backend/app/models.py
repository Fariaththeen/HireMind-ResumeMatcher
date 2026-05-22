from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Job schemas
class JobCreate(BaseModel):
    title: str
    description: str

class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    extracted_skills: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Resume schemas
class ResumeResponse(BaseModel):
    id: int
    candidate_name: Optional[str]
    extracted_skills: Optional[List[str]] = None
    filename: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

# Matching schemas
class MatchRequest(BaseModel):
    job_id: int
    resume_id: int

class MatchResponse(BaseModel):
    job_id: int
    resume_id: int
    score: float
    matched_skills: List[str]
    missing_skills: List[str]
    
# Health check
class HealthResponse(BaseModel):
    status: str
    version: str
