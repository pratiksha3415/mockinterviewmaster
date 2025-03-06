
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import InterviewSession from '@/components/interviews/InterviewSession';

const Interview = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
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
          
          <InterviewSession type={interviewType} />
        </div>
      </div>
    </div>
  );
};

export default Interview;
