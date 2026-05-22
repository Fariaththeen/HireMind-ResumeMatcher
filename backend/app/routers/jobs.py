from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import json

from ..database import get_db, Job
from ..models import JobCreate, JobResponse
from ..services import skill_extractor

router = APIRouter()

@router.post("/", response_model=JobResponse, status_code=201)
async def create_job(job: JobCreate, db: AsyncSession = Depends(get_db)):
    """Create a new job posting and extract skills"""
    try:
        # Extract skills from job description
        extracted_skills = await skill_extractor.extract_skills(job.description)
        
        # Create job record
        db_job = Job(
            title=job.title,
            description=job.description,
            extracted_skills=json.dumps(extracted_skills)
        )
        
        db.add(db_job)
        await db.commit()
        await db.refresh(db_job)
        
        # Prepare response
        return JobResponse(
            id=db_job.id,
            title=db_job.title,
            description=db_job.description,
            extracted_skills=extracted_skills,
            created_at=db_job.created_at
        )
    
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[JobResponse])
async def list_jobs(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    """List all job postings"""
    result = await db.execute(select(Job).offset(skip).limit(limit))
    jobs = result.scalars().all()
    
    return [
        JobResponse(
            id=job.id,
            title=job.title,
            description=job.description,
            extracted_skills=json.loads(job.extracted_skills) if job.extracted_skills else [],
            created_at=job.created_at
        )
        for job in jobs
    ]

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific job posting"""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return JobResponse(
        id=job.id,
        title=job.title,
        description=job.description,
        extracted_skills=json.loads(job.extracted_skills) if job.extracted_skills else [],
        created_at=job.created_at
    )

@router.delete("/{job_id}", status_code=204)
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a job posting"""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    await db.delete(job)
    await db.commit()

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(job_id: int, job_update: JobCreate, db: AsyncSession = Depends(get_db)):
    """Update a job posting and re-extract skills if description changes"""
    try:
        result = await db.execute(select(Job).where(Job.id == job_id))
        db_job = result.scalar_one_or_none()
        
        if not db_job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        db_job.title = job_update.title
        
        # If the description changed, re-extract skills
        if db_job.description != job_update.description:
            db_job.description = job_update.description
            extracted_skills = await skill_extractor.extract_skills(job_update.description)
            db_job.extracted_skills = json.dumps(extracted_skills)
        else:
            extracted_skills = json.loads(db_job.extracted_skills) if db_job.extracted_skills else []
            
        await db.commit()
        await db.refresh(db_job)
        
        return JobResponse(
            id=db_job.id,
            title=db_job.title,
            description=db_job.description,
            extracted_skills=extracted_skills,
            created_at=db_job.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

