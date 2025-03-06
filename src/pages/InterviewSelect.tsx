
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import InterviewCard from '@/components/interviews/InterviewCard';

const interviewTypes = [
  {
    type: 'technical',
    title: 'Technical Interview',
    description: 'Practice coding, system design, and technical questions with AI-powered feedback.'
  },
  {
    type: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Master STAR method responses for leadership and problem-solving scenarios.'
  },
  {
    type: 'hr',
    title: 'HR Interview',
    description: 'Prepare for common HR questions, salary negotiations, and cultural fit discussions.'
  }
];

const InterviewSelect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/auth?type=login');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-interview-slate-light">
      <Navbar />
      
      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h1 className="text-3xl font-bold mb-2">Choose Interview Type</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the type of interview you want to practice. Each interview is designed to help you master different aspects of the interview process.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {interviewTypes.map((interview, index) => (
              <InterviewCard
                key={interview.type}
                type={interview.type as 'technical' | 'behavioral' | 'hr'}
                title={interview.title}
                description={interview.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSelect;
