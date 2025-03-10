# Frontend Integration Guide

This guide explains how to connect your React frontend to the Interview AI backend.

## Authentication

### Registration
```javascript
// Example using fetch API
const registerUser = async (username, email, password) => {
  try {
    const response = await fetch('http://localhost:8000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};
```

### Login
```javascript
// Example using fetch API
const loginUser = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append('username', email); // OAuth2 expects username field
    formData.append('password', password);
    
    const response = await fetch('http://localhost:8000/users/token', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    // Store the token in localStorage or a secure cookie
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
```

## Making Authenticated Requests

```javascript
// Example helper function for authenticated requests
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/login';
    throw new Error('Authentication token expired');
  }
  
  return response;
};

// Example: Fetch user interviews
const fetchInterviews = async () => {
  try {
    const response = await authFetch('http://localhost:8000/interviews/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch interviews');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching interviews:', error);
    throw error;
  }
};
```

## Speech and Video Analysis

### Speech Analysis
```javascript
// Example: Send audio for transcription
const transcribeAudio = async (audioBlob) => {
  try {
    // Convert blob to base64
    const audioBase64 = await blobToBase64(audioBlob);
    
    const response = await authFetch('http://localhost:8000/speech-analysis/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_base64: audioBase64,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Transcription failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error during transcription:', error);
    throw error;
  }
};

// Helper function to convert blob to base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
```

### Video Analysis
```javascript
// Example: Send video for analysis
const analyzeVideo = async (videoBlob) => {
  try {
    // Convert blob to base64
    const videoBase64 = await blobToBase64(videoBlob);
    
    const response = await authFetch('http://localhost:8000/video-analysis/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_base64: videoBase64,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Video analysis failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error during video analysis:', error);
    throw error;
  }
};
```

## AI Feedback

```javascript
// Example: Generate AI feedback for an interview
const generateFeedback = async (interviewId) => {
  try {
    const response = await authFetch(`http://localhost:8000/ai-feedback/generate?interview_id=${interviewId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate feedback');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw error;
  }
};

// Example: Poll for feedback completion
const pollForFeedback = async (interviewId, maxAttempts = 10) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await authFetch(`http://localhost:8000/interviews/${interviewId}`);
      const interviewData = await response.json();
      
      if (interviewData.feedbacks && interviewData.feedbacks.length > 0) {
        const feedback = interviewData.feedbacks[0];
        if (!feedback.feedback_text.includes('in progress')) {
          return feedback;
        }
      }
      
      // Wait for 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error polling for feedback:', error);
    }
  }
  
  throw new Error('Feedback generation timed out');
};
```

## CORS Settings

Remember that your React frontend needs to be allowed in the CORS settings of the backend. The current configuration allows requests from:

- http://localhost:5173 (Vite development server)
- http://localhost:3000 (Alternative frontend server)

If your frontend is running on a different port or domain, you'll need to update the CORS settings in the backend's `main.py` file.
