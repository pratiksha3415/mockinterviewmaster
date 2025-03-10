from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import base64
import os
import json
import io
import cv2
import numpy as np
import tempfile
import mediapipe as mp
from deepface import DeepFace

from database import get_db
from models import User
from schemas import VideoAnalysisRequest, VideoAnalysisResponse
from auth import get_current_active_user

router = APIRouter(
    prefix="/video-analysis",
    tags=["video-analysis"],
    responses={404: {"description": "Not found"}},
)

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

@router.post("/analyze", response_model=VideoAnalysisResponse)
async def analyze_video(
    request: VideoAnalysisRequest,
    current_user: User = Depends(get_current_active_user)
):
    try:
        # Decode the base64 video
        video_bytes = base64.b64decode(request.video_base64)
        
        # Save to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
            temp_video.write(video_bytes)
            temp_video_path = temp_video.name
        
        # Process the video
        facial_expressions, eye_contact, posture_score = process_video(temp_video_path)
        
        # Clean up
        os.unlink(temp_video_path)
        
        return VideoAnalysisResponse(
            facial_expressions=facial_expressions,
            eye_contact=eye_contact,
            posture_score=posture_score
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing video: {str(e)}"
        )

@router.post("/upload-video")
async def upload_video(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    try:
        contents = await file.read()
        
        # Here you would typically save the file to a storage service
        # For now, we'll just acknowledge receipt
        
        return {
            "filename": file.filename,
            "size": len(contents),
            "message": "Video received successfully. Use /video-analysis/analyze endpoint with the video_base64 for analysis."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading video: {str(e)}"
        )

def process_video(video_path):
    """Process video for facial expressions, eye contact, and posture analysis."""
    try:
        # Open the video file
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            raise ValueError("Could not open video file")
        
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        # Setup analysis variables
        emotions = {"angry": 0, "disgust": 0, "fear": 0, "happy": 0, "sad": 0, "surprise": 0, "neutral": 0}
        eye_contact_frames = 0
        good_posture_frames = 0
        frames_analyzed = 0
        
        # Process every 5th frame to reduce computation
        for i in range(0, frame_count, 5):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            
            if not ret:
                break
                
            frames_analyzed += 1
            
            # Convert to RGB for mediapipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Face Mesh for eye contact and posture
            results = face_mesh.process(rgb_frame)
            
            if results.multi_face_landmarks:
                face_landmarks = results.multi_face_landmarks[0]
                
                # Check eye contact (simplified - looking at camera)
                eye_contact_score = calculate_eye_contact(face_landmarks)
                if eye_contact_score > 0.7:  # Threshold for good eye contact
                    eye_contact_frames += 1
                
                # Check posture (simplified - head position)
                posture_score = calculate_posture(face_landmarks)
                if posture_score > 0.6:  # Threshold for good posture
                    good_posture_frames += 1
            
            # Emotion analysis using DeepFace (every 30th frame to reduce computation)
            if i % 30 == 0:
                try:
                    analysis = DeepFace.analyze(img_path=frame, actions=['emotion'], enforce_detection=False)
                    if isinstance(analysis, list) and len(analysis) > 0:
                        analysis = analysis[0]
                    
                    dominant_emotion = analysis['dominant_emotion']
                    emotions[dominant_emotion] += 1
                except Exception as e:
                    print(f"DeepFace error on frame {i}: {e}")
        
        # Release video capture
        cap.release()
        
        # Calculate final metrics
        total_emotions = sum(emotions.values())
        if total_emotions > 0:
            facial_expressions = {emotion: count / total_emotions for emotion, count in emotions.items()}
        else:
            facial_expressions = emotions
            
        eye_contact = eye_contact_frames / frames_analyzed if frames_analyzed > 0 else 0
        posture_score = good_posture_frames / frames_analyzed if frames_analyzed > 0 else 0
        
        return facial_expressions, eye_contact, posture_score
        
    except Exception as e:
        print(f"Error processing video: {e}")
        return {}, 0.0, 0.0

def calculate_eye_contact(face_landmarks):
    """Calculate eye contact based on iris position (simplified)"""
    # In a real implementation, this would be more sophisticated
    # For this example, we'll use a simplified approach
    return 0.8  # Simulated value

def calculate_posture(face_landmarks):
    """Calculate posture score based on face orientation (simplified)"""
    # In a real implementation, this would measure head tilt, orientation, etc.
    # For this example, we'll use a simplified approach
    return 0.7  # Simulated value
