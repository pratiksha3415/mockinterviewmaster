/**
 * API service for connecting to the FastAPI backend
 */

const API_BASE_URL = 'http://localhost:8000';

// Helper for making authenticated requests
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/auth?type=login';
    throw new Error('Authentication token expired');
  }
  
  return response;
};

// Authentication services
export const authService = {
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Registration failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email); // OAuth2 expects username field
      formData.append('password', password);
      
      const response = await fetch(`${API_BASE_URL}/users/token`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth?type=login';
  }
};

// Interview services
export const interviewService = {
  getInterviews: async () => {
    try {
      const response = await authFetch('/interviews/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching interviews:', error);
      throw error;
    }
  },
  
  getInterview: async (interviewId: string) => {
    try {
      const response = await authFetch(`/interviews/${interviewId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch interview');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching interview:', error);
      throw error;
    }
  },
  
  createInterview: async (interviewType: string) => {
    try {
      const response = await authFetch('/interviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interview_type: interviewType,
          status: 'scheduled'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create interview');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating interview:', error);
      throw error;
    }
  }
};

// Speech and video analysis services
export const analysisService = {
  transcribeAudio: async (audioBlob: Blob) => {
    try {
      const audioBase64 = await blobToBase64(audioBlob);
      
      const response = await authFetch('/speech-analysis/transcribe', {
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
  },
  
  analyzeVideo: async (videoBlob: Blob) => {
    try {
      const videoBase64 = await blobToBase64(videoBlob);
      
      const response = await authFetch('/video-analysis/analyze', {
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
  }
};

// AI feedback services
export const feedbackService = {
  generateFeedback: async (interviewId: string) => {
    try {
      const response = await authFetch(`/ai-feedback/generate?interview_id=${interviewId}`, {
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
  },
  
  pollForFeedback: async (interviewId: string, maxAttempts = 10) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await authFetch(`/interviews/${interviewId}`);
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
  }
};

// Helper function to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default {
  auth: authService,
  interviews: interviewService,
  analysis: analysisService,
  feedback: feedbackService
};
