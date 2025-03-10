from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from database import get_db
from models import User, Interview, InterviewQuestion
from schemas import Interview as InterviewSchema, InterviewCreate, Question, QuestionCreate
from auth import get_current_active_user

router = APIRouter(
    prefix="/interviews",
    tags=["interviews"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=InterviewSchema)
def create_interview(
    interview: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_interview = Interview(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        interview_type=interview.interview_type,
        status=interview.status
    )
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview

@router.get("/", response_model=List[InterviewSchema])
def read_interviews(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    interviews = db.query(Interview).filter(
        Interview.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return interviews

@router.get("/{interview_id}", response_model=InterviewSchema)
def read_interview(
    interview_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user.id
    ).first()
    if db_interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")
    return db_interview

@router.post("/questions/", response_model=Question)
def create_question(
    question: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify that the interview belongs to the current user
    interview = db.query(Interview).filter(
        Interview.id == question.interview_id,
        Interview.user_id == current_user.id
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    db_question = InterviewQuestion(
        id=str(uuid.uuid4()),
        interview_id=question.interview_id,
        question_text=question.question_text,
        question_order=question.question_order
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question
