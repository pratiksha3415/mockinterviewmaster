
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import BlurContainer from '@/components/ui/BlurContainer';

interface LocationState {
  type: 'technical' | 'behavioral' | 'hr';
  questionsAnswered: number;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/auth?type=login');
      return;
    }
    
    // Make sure we have results data
    if (!state) {
      navigate('/dashboard');
    }
  }, [navigate, state]);
  
  if (!state) return null;
  
  // Mock results data
  const score = Math.floor(Math.random() * 21) + 70; // Random score between 70-90
  const titleMap = {
    technical: 'Technical Interview',
    behavioral: 'Behavioral Interview',
    hr: 'HR Interview'
  };
  
  const strengths = [
    'Clear and concise explanations',
    'Strong technical knowledge',
    'Good problem-solving approach'
  ];
  
  const improvements = [
    'Add more specific examples',
    'Elaborate on technical implementations',
    'Provide more context in your answers'
  ];
  
  return (
    <div className="min-h-screen bg-interview-slate-light">
      <Navbar />
      
      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Interview Completed!</h1>
            <p className="text-gray-600">
              You've completed the {titleMap[state.type]} session. Here's how you did.
            </p>
          </motion.div>
          
          <BlurContainer className="p-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-interview-blue-light p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-interview-blue mb-2">{score}%</div>
                  <div className="text-gray-700">Overall Score</div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-gray-800 mb-2">{state.questionsAnswered}</div>
                  <div className="text-gray-700">Questions Answered</div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-gray-800 mb-2">{Math.floor(state.questionsAnswered * 3.5)}</div>
                  <div className="text-gray-700">Minutes Spent</div>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold mb-4">Your Strengths</h2>
                <ul className="space-y-3">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-xl font-bold mb-4">Areas for Improvement</h2>
                <ul className="space-y-3">
                  {improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-interview-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </BlurContainer>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col md:flex-row justify-center gap-4"
          >
            <Link to="/dashboard">
              <Button variant="outline" className="px-8 py-2">
                Back to Dashboard
              </Button>
            </Link>
            <Link to={`/interviews/${state.type}`}>
              <Button className="px-8 py-2 bg-interview-blue hover:bg-interview-blue-dark">
                Practice Again
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Results;
