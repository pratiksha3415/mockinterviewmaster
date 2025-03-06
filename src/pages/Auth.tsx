
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import AuthForm from '@/components/auth/AuthForm';
import BlurContainer from '@/components/ui/BlurContainer';

const Auth = () => {
  return (
    <div className="min-h-screen bg-interview-slate-light">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <BlurContainer 
            className="p-8" 
            intensity="heavy"
            animate={true}
          >
            <AuthForm />
          </BlurContainer>
          
          <motion.div 
            className="text-center mt-6 text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Practice with confidence and improve your interview skills
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
