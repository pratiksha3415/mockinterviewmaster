
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Trophy, Activity, Brain } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import BlurContainer from '@/components/ui/BlurContainer';

interface LocationState {
  type: 'technical' | 'behavioral' | 'hr';
  questionsAnswered: number;
  metrics?: {
    relevance: number;
    structure: number;
    clarity: number;
    overall: number;
  } | null;
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
      return;
    }
    
    // Save this interview to user's history
    try {
      const userData = JSON.parse(user);
      const userId = userData.id;
      const historyKey = `interview_history_${userId}`;
      
      // Get existing history or create new array
      const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      // Add this interview to history
      existingHistory.push({
        type: state.type,
        questionsAnswered: state.questionsAnswered,
        metrics: state.metrics || null,
        timestamp: new Date().toISOString(),
      });
      
      // Save updated history
      localStorage.setItem(historyKey, JSON.stringify(existingHistory));
    } catch (error) {
      console.error('Error saving interview history:', error);
    }
  }, [navigate, state]);
  
  if (!state) return null;
  
  // Use metrics from state if available, otherwise use a default score
  const score = state.metrics?.overall || Math.floor(Math.random() * 21) + 70;
  
  const titleMap = {
    technical: 'Technical Interview',
    behavioral: 'Behavioral Interview',
    hr: 'HR Interview'
  };
  
  // Generate personalized strengths based on metrics
  const generateStrengths = () => {
    const strengths = [];
    
    if (state.metrics) {
      if (state.metrics.relevance >= 80) {
        strengths.push("Strong content relevance and technical knowledge");
      }
      if (state.metrics.structure >= 80) {
        strengths.push("Well-structured and comprehensive responses");
      }
      if (state.metrics.clarity >= 80) {
        strengths.push("Clear and concise communication");
      }
      if (state.metrics.overall >= 85) {
        strengths.push("Excellent overall interview performance");
      }
    }
    
    // Add default strengths if needed
    if (strengths.length < 3) {
      const defaultStrengths = [
        "Clear and concise explanations",
        "Strong technical knowledge",
        "Good problem-solving approach",
        "Effective communication style"
      ];
      
      while (strengths.length < 3 && defaultStrengths.length > 0) {
        const randomIndex = Math.floor(Math.random() * defaultStrengths.length);
        const strength = defaultStrengths.splice(randomIndex, 1)[0];
        if (!strengths.includes(strength)) {
          strengths.push(strength);
        }
      }
    }
    
    return strengths;
  };
  
  // Generate improvement areas based on metrics
  const generateImprovements = () => {
    const improvements = [];
    
    if (state.metrics) {
      if (state.metrics.relevance < 75) {
        improvements.push("Focus more on key concepts relevant to the questions");
      }
      if (state.metrics.structure < 75) {
        improvements.push("Improve answer structure with clearer beginning, middle, and conclusion");
      }
      if (state.metrics.clarity < 75) {
        improvements.push("Enhance clarity by using more precise language and terminology");
      }
      if (state.metrics.overall < 70) {
        improvements.push("Practice more with similar interview questions to build confidence");
      }
    }
    
    // Add default improvements if needed
    if (improvements.length < 3) {
      const defaultImprovements = [
        "Add more specific examples to your answers",
        "Elaborate on technical implementations",
        "Provide more context in your answers",
        "Use more industry-specific terminology"
      ];
      
      while (improvements.length < 3 && defaultImprovements.length > 0) {
        const randomIndex = Math.floor(Math.random() * defaultImprovements.length);
        const improvement = defaultImprovements.splice(randomIndex, 1)[0];
        if (!improvements.includes(improvement)) {
          improvements.push(improvement);
        }
      }
    }
    
    return improvements;
  };
  
  const strengths = generateStrengths();
  const improvements = generateImprovements();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };
  
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
          
          <BlurContainer className="p-8 mb-8" animate={true}>
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delayChildren: 0.3,
                staggerChildren: 0.2 
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="bg-interview-blue-light p-6 rounded-xl text-center relative overflow-hidden shadow-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-interview-blue/10 to-interview-blue/0 z-0"></div>
                  <div className="relative z-10">
                    <div className="mb-2 inline-flex items-center justify-center p-2 bg-white/50 rounded-full">
                      <Trophy className="h-6 w-6 text-interview-blue" />
                    </div>
                    <div className="text-4xl font-bold text-interview-blue mb-2">{score}%</div>
                    <div className="text-gray-700">Overall Score</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 p-6 rounded-xl text-center relative overflow-hidden shadow-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50/0 z-0"></div>
                  <div className="relative z-10">
                    <div className="mb-2 inline-flex items-center justify-center p-2 bg-white/50 rounded-full">
                      <Brain className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="text-4xl font-bold text-gray-800 mb-2">{state.questionsAnswered}</div>
                    <div className="text-gray-700">Questions Answered</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 p-6 rounded-xl text-center relative overflow-hidden shadow-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50/0 z-0"></div>
                  <div className="relative z-10">
                    <div className="mb-2 inline-flex items-center justify-center p-2 bg-white/50 rounded-full">
                      <Activity className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="text-4xl font-bold text-gray-800 mb-2">{Math.floor(state.questionsAnswered * 3.5)}</div>
                    <div className="text-gray-700">Minutes Spent</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {state.metrics && (
              <motion.div 
                variants={itemVariants}
                className="mb-8 bg-white/50 p-5 rounded-xl border border-gray-100"
              >
                <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Content Relevance</div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="h-3 rounded-full bg-interview-blue"
                        initial={{ width: 0 }}
                        animate={{ width: `${state.metrics.relevance}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <div className="text-right text-sm mt-1">{state.metrics.relevance}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Structure</div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="h-3 rounded-full bg-interview-blue"
                        initial={{ width: 0 }}
                        animate={{ width: `${state.metrics.structure}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                    <div className="text-right text-sm mt-1">{state.metrics.structure}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Clarity</div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="h-3 rounded-full bg-interview-blue"
                        initial={{ width: 0 }}
                        animate={{ width: `${state.metrics.clarity}%` }}
                        transition={{ duration: 1, delay: 0.9 }}
                      />
                    </div>
                    <div className="text-right text-sm mt-1">{state.metrics.clarity}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Overall</div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="h-3 rounded-full bg-interview-blue"
                        initial={{ width: 0 }}
                        animate={{ width: `${state.metrics.overall}%` }}
                        transition={{ duration: 1, delay: 1.1 }}
                      />
                    </div>
                    <div className="text-right text-sm mt-1">{state.metrics.overall}%</div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                variants={itemVariants}
              >
                <h2 className="text-xl font-bold mb-4">Your Strengths</h2>
                <ul className="space-y-3">
                  {strengths.map((strength, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
              >
                <h2 className="text-xl font-bold mb-4">Areas for Improvement</h2>
                <ul className="space-y-3">
                  {improvements.map((improvement, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <ArrowRight className="h-5 w-5 text-interview-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>{improvement}</span>
                    </motion.li>
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
              <Button variant="outline" className="px-8 py-2 hover-lift">
                Back to Dashboard
              </Button>
            </Link>
            <Link to={`/interviews/${state.type}`}>
              <Button className="px-8 py-2 bg-interview-blue hover:bg-interview-blue-dark hover-lift">
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
