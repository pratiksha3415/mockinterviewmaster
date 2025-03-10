from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import base64
import os
import json
import io
from google.cloud import speech
from google.cloud.speech import RecognitionConfig, RecognitionAudio

from database import get_db
from models import User
from schemas import SpeechAnalysisRequest, SpeechAnalysisResponse
from auth import get_current_active_user

router = APIRouter(
    prefix="/speech-analysis",
    tags=["speech-analysis"],
    responses={404: {"description": "Not found"}},
)

# Initialize Google Cloud Speech client
try:
    speech_client = speech.SpeechClient()
except Exception as e:
    print(f"Warning: Google Speech-to-Text client initialization failed: {e}")
    speech_client = None

@router.post("/transcribe", response_model=SpeechAnalysisResponse)
async def transcribe_audio(
    request: SpeechAnalysisRequest,
    current_user: User = Depends(get_current_active_user)
):
    if not speech_client:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Speech-to-Text service not available"
        )
    
    try:
        # Decode the base64 audio
        audio_content = base64.b64decode(request.audio_base64)
        
        # Configure the request
        audio = RecognitionAudio(content=audio_content)
        config = RecognitionConfig(
            encoding=RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US",
            enable_automatic_punctuation=True,
            model="default",
        )
        
        # Send the request to Google Speech-to-Text API
        response = speech_client.recognize(config=config, audio=audio)
        
        transcription = ""
        confidence = 0.0
        
        if response.results:
            transcription = response.results[0].alternatives[0].transcript
            confidence = response.results[0].alternatives[0].confidence
        
        return SpeechAnalysisResponse(
            transcription=transcription,
            confidence=confidence
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing audio: {str(e)}"
        )

@router.post("/upload-audio")
async def upload_audio(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    try:
        contents = await file.read()
        audio_base64 = base64.b64encode(contents).decode("utf-8")
        
        # Here you would typically save the file to a storage service
        # For now, we'll just return the base64 which can be used with the transcribe endpoint
        
        return {
            "filename": file.filename,
            "audio_base64": audio_base64[:50] + "..." # Truncated for response size
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading audio: {str(e)}"
        )
