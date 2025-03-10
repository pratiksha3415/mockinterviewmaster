from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Interview schemas
class InterviewBase(BaseModel):
    interview_type: str
    status: str = "scheduled"

class InterviewCreate(InterviewBase):
    pass

class Interview(InterviewBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Question schemas
class QuestionBase(BaseModel):
    question_text: str
    question_order: int

class QuestionCreate(QuestionBase):
    interview_id: str

class Question(QuestionBase):
    id: str
    interview_id: str
    created_at: datetime

    class Config:
        orm_mode = True

# Answer schemas
class AnswerBase(BaseModel):
    answer_text: str
    audio_url: Optional[str] = None
    video_url: Optional[str] = None

class AnswerCreate(AnswerBase):
    question_id: str

class Answer(AnswerBase):
    id: str
    question_id: str
    created_at: datetime

    class Config:
        orm_mode = True

# Feedback schemas
class FeedbackBase(BaseModel):
    feedback_text: str
    confidence_score: Optional[float] = None
    technical_score: Optional[float] = None
    communication_score: Optional[float] = None

class FeedbackCreate(FeedbackBase):
    interview_id: str

class Feedback(FeedbackBase):
    id: str
    interview_id: str
    created_at: datetime

    class Config:
        orm_mode = True

# AI Analysis schemas
class SpeechAnalysisRequest(BaseModel):
    audio_base64: str

class SpeechAnalysisResponse(BaseModel):
    transcription: str
    confidence: float

class VideoAnalysisRequest(BaseModel):
    video_base64: str

class VideoAnalysisResponse(BaseModel):
    facial_expressions: dict
    eye_contact: float
    posture_score: float
