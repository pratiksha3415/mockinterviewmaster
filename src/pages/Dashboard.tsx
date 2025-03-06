
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import BlurContainer from '@/components/ui/BlurContainer';
import { Code, Users, Briefcase, TrendingUp, History, FileText } from 'lucide-react';

const data = [
  { day: 'Mon', score: 68 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 75 },
  { day: 'Thu', score: 70 },
  { day: 'Fri', score: 80 },
  { day: 'Sat', score: 82 },
  { day: 'Sun', score: 85 },
];

interface User {
  name: string;
  email: string;
  id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <BlurContainer className="p-6 h-full card-hover">
                <div className="flex flex-col h-full">
                  <div className="p-3 rounded-full bg-interview-blue-light w-fit mb-4">
                    <TrendingUp className="h-6 w-6 text-interview-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Progress</h3>
                  <p className="text-gray-600 mb-4">Your interview skill improvement over time.</p>
                  <div className="h-40 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#2196F3" 
                          strokeWidth={2} 
                          dot={{ r: 4 }} 
                          activeDot={{ r: 6 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </BlurContainer>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BlurContainer className="p-6 h-full card-hover">
                <div className="flex flex-col h-full">
                  <div className="p-3 rounded-full bg-interview-blue-light w-fit mb-4">
                    <History className="h-6 w-6 text-interview-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Recent Activity</h3>
                  <p className="text-gray-600 mb-4">Your recent interview sessions.</p>
                  <div className="space-y-3 mt-2 flex-grow">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="font-medium">Technical Interview</div>
                      <div className="text-sm text-gray-500">Completed 2 days ago • Score: 82%</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="font-medium">HR Interview</div>
                      <div className="text-sm text-gray-500">Completed 5 days ago • Score: 75%</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link to="/history">
                      <Button variant="outline" className="w-full">View All History</Button>
                    </Link>
                  </div>
                </div>
              </BlurContainer>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <BlurContainer className="p-6 h-full card-hover">
                <div className="flex flex-col h-full">
                  <div className="p-3 rounded-full bg-interview-blue-light w-fit mb-4">
                    <FileText className="h-6 w-6 text-interview-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your Stats</h3>
                  <p className="text-gray-600 mb-4">Your interview practice statistics.</p>
                  <div className="space-y-4 mt-2 flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Interviews Completed</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Questions Answered</span>
                      <span className="font-medium">48</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Score</span>
                      <span className="font-medium">76%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Strongest Category</span>
                      <span className="font-medium">Technical</span>
                    </div>
                  </div>
                </div>
              </BlurContainer>
            </motion.div>
          </div>
          
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
