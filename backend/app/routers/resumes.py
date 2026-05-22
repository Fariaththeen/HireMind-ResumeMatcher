from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import json
import shutil
from pathlib import Path

from ..database import get_db, Resume
from ..models import ResumeResponse
from ..services.text_extractor import TextExtractor
from ..services import skill_extractor
from ..config import BASE_DIR, MAX_UPLOAD_SIZE

router = APIRouter()

# Create upload directory
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload", response_model=ResumeResponse, status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    candidate_name: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """Upload a resume, extract text and skills"""
    
    # Validate file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ['.pdf', '.docx']:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files allowed")
    
    try:
        # Save uploaded file
        file_path = UPLOAD_DIR / f"{Path(file.filename).stem}_{hash(file.filename)}{file_ext}"
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract text
        text_extractor = TextExtractor()
        raw_text = await text_extractor.extract_text(file_path)
        
        # Extract skills
        skills = await skill_extractor.extract_skills(raw_text)
        
        # Save to database
        db_resume = Resume(
            candidate_name=candidate_name,
            raw_text=raw_text,
            extracted_skills=json.dumps(skills),
            filename=file.filename
        )
        
        db.add(db_resume)
        await db.commit()
        await db.refresh(db_resume)
        
        return ResumeResponse(
            id=db_resume.id,
            candidate_name=db_resume.candidate_name,
            extracted_skills=skills,
            filename=db_resume.filename,
            uploaded_at=db_resume.uploaded_at
        )
    
    except Exception as e:
        await db.rollback()
        # Clean up uploaded file on error
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ResumeResponse])
async def list_resumes(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    """List all uploaded resumes"""
    result = await db.execute(select(Resume).offset(skip).limit(limit))
    resumes = result.scalars().all()
    
    return [
        ResumeResponse(
            id=resume.id,
            candidate_name=resume.candidate_name,
            extracted_skills=json.loads(resume.extracted_skills) if resume.extracted_skills else [],
            filename=resume.filename,
            uploaded_at=resume.uploaded_at
        )
        for resume in resumes
    ]

@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(resume_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific resume"""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return ResumeResponse(
        id=resume.id,
        candidate_name=resume.candidate_name,
        extracted_skills=json.loads(resume.extracted_skills) if resume.extracted_skills else [],
        filename=resume.filename,
        uploaded_at=resume.uploaded_at
    )

@router.delete("/{resume_id}", status_code=204)
async def delete_resume(resume_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a resume"""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    await db.delete(resume)
    await db.commit()
