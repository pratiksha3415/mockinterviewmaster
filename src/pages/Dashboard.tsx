
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import BlurContainer from '@/components/ui/BlurContainer';
import { Code, Users, Briefcase, FileText } from 'lucide-react';

interface User {
  name: string;
  email: string;
  id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [hasHistory, setHasHistory] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/auth?type=login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Check if user has any interview history
      const userHistory = localStorage.getItem(`interview_history_${parsedUser.id}`);
      setHasHistory(!!userHistory && JSON.parse(userHistory).length > 0);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate('/auth?type=login');
    }
  }, [navigate]);
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-interview-slate-light">
      <Navbar />
      
      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
            <p className="text-gray-600">Track your progress and continue practicing your interview skills.</p>
          </motion.div>
          
          {hasHistory ? (
            // Only show this section if user has interview history
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <BlurContainer className="p-6 h-full card-hover">
                  <div className="flex flex-col h-full">
                    <div className="p-3 rounded-full bg-interview-blue-light w-fit mb-4">
                      <FileText className="h-6 w-6 text-interview-blue" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Your Stats</h3>
                    <p className="text-gray-600 mb-4">Your interview practice statistics.</p>
                    <div className="flex justify-center items-center h-40 text-center">
                      <p>Your interview statistics will appear here after completing interviews.</p>
                    </div>
                  </div>
                </BlurContainer>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-2"
              >
                <BlurContainer className="p-6 h-full card-hover">
                  <div className="flex flex-col h-full">
                    <div className="p-3 rounded-full bg-interview-blue-light w-fit mb-4">
                      <FileText className="h-6 w-6 text-interview-blue" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Recent Activity</h3>
                    <p className="text-gray-600 mb-4">Your recent interview sessions.</p>
                    <div className="flex justify-center items-center h-40 text-center">
                      <p>Your recent interview activities will appear here after completing interviews.</p>
                    </div>
                  </div>
                </BlurContainer>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10"
            >
              <BlurContainer className="p-6 h-full">
                <div className="flex flex-col items-center text-center py-6">
                  <div className="p-3 rounded-full bg-interview-blue-light w-fit mb-4">
                    <FileText className="h-6 w-6 text-interview-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Interview History Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md">Complete your first interview to start building your performance statistics and history.</p>
                  <Link to="/interviews">
                    <Button className="bg-interview-blue hover:bg-interview-blue-dark">
                      Start Your First Interview
                    </Button>
                  </Link>
                </div>
              </BlurContainer>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Start a New Interview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/interviews/technical" className="block">
                <BlurContainer className="p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="p-3 rounded-full bg-interview-blue-light w-fit mb-4">
                    <Code className="h-6 w-6 text-interview-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Technical Interview</h3>
                  <p className="text-gray-600">Practice coding, algorithms, and technical questions.</p>
                </BlurContainer>
              </Link>
              
              <Link to="/interviews/behavioral" className="block">
                <BlurContainer className="p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="p-3 rounded-full bg-interview-blue-light w-fit mb-4">
                    <Users className="h-6 w-6 text-interview-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Behavioral Interview</h3>
                  <p className="text-gray-600">Prepare for leadership and teamwork scenarios.</p>
                </BlurContainer>
              </Link>
              
              <Link to="/interviews/hr" className="block">
                <BlurContainer className="p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="p-3 rounded-full bg-interview-blue-light w-fit mb-4">
                    <Briefcase className="h-6 w-6 text-interview-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">HR Interview</h3>
                  <p className="text-gray-600">Master common HR and salary negotiation questions.</p>
                </BlurContainer>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
