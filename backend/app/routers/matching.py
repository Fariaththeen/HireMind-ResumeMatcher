from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json

from ..database import get_db, Job, Resume, MatchScore
from ..models import MatchRequest, MatchResponse
from ..services.matcher import SkillMatcher
from ..services import resume_summarizer

router = APIRouter()
matcher = SkillMatcher(fuzzy_threshold=85)

@router.post("/score", response_model=dict)
async def calculate_match_score(
    match_request: MatchRequest,
    db: AsyncSession = Depends(get_db)
):
    """Calculate match score between a resume and job"""
    
    # Get job
    result = await db.execute(select(Job).where(Job.id == match_request.job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get resume
    result = await db.execute(select(Resume).where(Resume.id == match_request.resume_id))
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Parse skills
    job_skills = json.loads(job.extracted_skills) if job.extracted_skills else []
    resume_skills = json.loads(resume.extracted_skills) if resume.extracted_skills else []
    
    # Calculate match
    match_result = matcher.calculate_score(
        job_skills=job_skills,
        resume_skills=resume_skills
    )
    
    # Generate contextual resume summary
    summary_result = await resume_summarizer.generate_role_specific_summary(
        resume_text=resume.raw_text,
        job_description=job.description,
        job_title=job.title
    )
    
    # Save score to database
    db_score = MatchScore(
        job_id=job.id,
        resume_id=resume.id,
        score=match_result["score"],
        matched_skills=json.dumps(match_result["matched_skills"]),
        missing_skills=json.dumps(match_result["missing_skills"]),
        summary=json.dumps(summary_result)
    )
    
    db.add(db_score)
    await db.commit()
    
    # Return result with additional info
    return {
        "job_id": job.id,
        "job_title": job.title,
        "resume_id": resume.id,
        "candidate_name": resume.candidate_name,
        "summary": summary_result,
        **match_result
    }

@router.get("/history")
async def get_match_history(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    """Get history of all match calculations"""
    result = await db.execute(
        select(MatchScore, Job.title, Resume.candidate_name)
        .join(Job, MatchScore.job_id == Job.id)
        .join(Resume, MatchScore.resume_id == Resume.id)
        .offset(skip)
        .limit(limit)
    )
    
    matches = result.all()
    return [
        {
            "id": match.id,
            "job_title": title,
            "candidate_name": candidate_name,
            "score": match.score,
            "matched_skills": json.loads(match.matched_skills),
            "missing_skills": json.loads(match.missing_skills),
            "summary": json.loads(match.summary) if match.summary else None,
            "created_at": match.created_at
        }
        for match, title, candidate_name in matches
    ]

