
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import InterviewSession from '@/components/interviews/InterviewSession';
import InterviewModeSelector from '@/components/interviews/InterviewModeSelector';
import BlurContainer from '@/components/ui/BlurContainer';
import { toast } from 'sonner';

const Interview = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [responseMode, setResponseMode] = useState<'text' | 'audio' | 'video'>('text');
  const [sessionStarted, setSessionStarted] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/auth?type=login');
      return;
    }
    
    // Validate interview type
    if (!type || !['technical', 'behavioral', 'hr'].includes(type)) {
      navigate('/interviews');
    }
  }, [navigate, type]);
  
  // Handle invalid type
  if (!type || !['technical', 'behavioral', 'hr'].includes(type)) {
    return null;
  }
  
  // Type assertion to satisfy TypeScript
  const interviewType = type as 'technical' | 'behavioral' | 'hr';
  
  // Title mapping
  const titleMap = {
    technical: 'Technical Interview',
    behavioral: 'Behavioral Interview',
    hr: 'HR Interview'
  };
  
  const handleModeSelect = (mode: 'text' | 'audio' | 'video') => {
    if (mode !== 'text') {
      toast.info('Coming soon! This feature is under development. Using text mode for now.');
    }
    setResponseMode(mode);
  };
  
  const startSession = () => {
    setSessionStarted(true);
  };
  
  return (
    <div className="min-h-screen bg-interview-slate-light">
      <Navbar />
      
      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{titleMap[interviewType]}</h1>
            <p className="text-gray-600">
              Answer the questions as you would in a real interview. The AI will provide feedback on your responses.
            </p>
          </div>
          
          {!sessionStarted ? (
            <div className="max-w-4xl mx-auto">
              <InterviewModeSelector 
                selectedMode={responseMode}
                onSelectMode={handleModeSelect}
              />
              
              <BlurContainer className="p-8 mb-8 text-center">
                <h3 className="text-xl font-bold mb-4">Ready to begin your {titleMap[interviewType]}?</h3>
                <p className="mb-6 text-gray-600">
                  You'll be presented with a series of questions. Take your time to provide thoughtful answers.
                </p>
                <button
                  onClick={startSession}
                  className="px-8 py-3 bg-interview-blue text-white rounded-md hover:bg-interview-blue-dark transition-colors"
                >
                  Start Interview
                </button>
              </BlurContainer>
            </div>
          ) : (
            <InterviewSession type={interviewType} responseMode={responseMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
