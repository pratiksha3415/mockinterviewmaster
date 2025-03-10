from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import uuid
import os
import openai

from database import get_db
from models import User, Interview, InterviewFeedback, InterviewQuestion, InterviewAnswer
from schemas import Feedback, FeedbackCreate
from auth import get_current_active_user

router = APIRouter(
    prefix="/ai-feedback",
    tags=["ai-feedback"],
    responses={404: {"description": "Not found"}},
)

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

@router.post("/generate", response_model=Feedback)
async def generate_ai_feedback(
    interview_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify that the interview belongs to the current user
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user.id
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Get all questions and answers for this interview
    questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.interview_id == interview_id
    ).order_by(InterviewQuestion.question_order).all()
    
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this interview")
    
    # Process in background to not block the response
    background_tasks.add_task(
        process_interview_feedback,
        db,
        interview_id,
        questions,
        current_user.id
    )
    
    # Create a pending feedback entry
    db_feedback = InterviewFeedback(
        id=str(uuid.uuid4()),
        interview_id=interview_id,
        feedback_text="Feedback generation in progress...",
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return db_feedback

async def process_interview_feedback(db: Session, interview_id: str, questions, user_id: str):
    try:
        # Prepare context for OpenAI
        interview_context = []
        
        for question in questions:
            # Get the answer for this question
            answer = db.query(InterviewAnswer).filter(
                InterviewAnswer.question_id == question.id
            ).first()
            
            if answer:
                interview_context.append({
                    "question": question.question_text,
                    "answer": answer.answer_text
                })
        
        if not interview_context:
            update_feedback_error(db, interview_id, "No answers found for interview questions")
            return
        
        # Generate AI feedback using OpenAI
        feedback_text, scores = await generate_openai_feedback(interview_context)
        
        # Update the feedback in the database
        db_feedback = db.query(InterviewFeedback).filter(
            InterviewFeedback.interview_id == interview_id
        ).first()
        
        if db_feedback:
            db_feedback.feedback_text = feedback_text
            db_feedback.technical_score = scores.get("technical", None)
            db_feedback.communication_score = scores.get("communication", None)
            db_feedback.confidence_score = scores.get("confidence", None)
            db.commit()
    
    except Exception as e:
        update_feedback_error(db, interview_id, str(e))

def update_feedback_error(db: Session, interview_id: str, error_message: str):
    db_feedback = db.query(InterviewFeedback).filter(
        InterviewFeedback.interview_id == interview_id
    ).first()
    
    if db_feedback:
        db_feedback.feedback_text = f"Error generating feedback: {error_message}"
        db.commit()

async def generate_openai_feedback(interview_context):
    # Prepare the prompt for GPT-4
    prompt = "You are an expert interview coach providing feedback on a technical interview. "
    prompt += "Please analyze the following interview questions and answers, then provide detailed feedback "
    prompt += "on technical accuracy, communication skills, and overall confidence. "
    prompt += "Also rate each area on a scale of 1-10.\n\n"
    
    for item in interview_context:
        prompt += f"Question: {item['question']}\n"
        prompt += f"Answer: {item['answer']}\n\n"
    
    prompt += "Please provide detailed feedback and suggestions for improvement."
    
    try:
        response = await openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert interview coach providing detailed feedback."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        feedback_text = response.choices[0].message.content
        
        # Extract scores using another GPT call for consistency
        scores_response = await openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Extract numerical scores from interview feedback."},
                {"role": "user", "content": "Based on the interview feedback below, provide only numerical scores (1-10) for technical accuracy, communication skills, and confidence. Return as JSON with keys 'technical', 'communication', and 'confidence'.\n\n" + feedback_text}
            ],
            temperature=0.3,
            max_tokens=100
        )
        
        scores_text = scores_response.choices[0].message.content
        
        # Parse scores from the response
        import json
        import re
        
        # Try to extract JSON
        json_match = re.search(r'\{.*\}', scores_text, re.DOTALL)
        
        if json_match:
            try:
                scores = json.loads(json_match.group(0))
            except:
                # Fallback to estimated scores
                scores = {
                    "technical": 7,
                    "communication": 7,
                    "confidence": 7
                }
        else:
            # Fallback to estimated scores
            scores = {
                "technical": 7,
                "communication": 7,
                "confidence": 7
            }
        
        return feedback_text, scores
        
    except Exception as e:
        print(f"Error in OpenAI API: {e}")
        return f"Error generating feedback: {str(e)}", {"technical": None, "communication": None, "confidence": None}
