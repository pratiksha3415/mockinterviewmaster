
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import AuthForm from '@/components/auth/AuthForm';
import BlurContainer from '@/components/ui/BlurContainer';

const Auth = () => {
  return (
    <div className="min-h-screen bg-interview-slate-light overflow-hidden relative">
      {/* Animated background video */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover scale-110 opacity-20"
          style={{ filter: 'blur(4px)' }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-network-connection-31978-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-1/3 -right-20 w-80 h-80 bg-purple-400/10 rounded-full filter blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse", 
          }}
          className="absolute top-10 right-1/4 w-64 h-64 bg-teal-300/10 rounded-full filter blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse", 
          }}
          className="absolute bottom-10 left-1/3 w-72 h-72 bg-rose-300/10 rounded-full filter blur-3xl"
        />
      </div>

      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <BlurContainer 
            className="p-8 shadow-xl" 
            intensity="heavy"
            animate={true}
            colorVariant="purple"
          >
            <AuthForm />
          </BlurContainer>
          
          <motion.div 
            className="text-center mt-6 text-gray-600 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Practice with confidence and improve your interview skills
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements with colors */}
      <motion.div
        className="absolute bottom-10 right-10 w-3 h-3 rounded-full bg-blue-500"
        animate={{
          y: [0, -10, 0],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-4 h-4 rounded-full bg-purple-500/60"
        animate={{
          y: [0, -15, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute bottom-15 right-32 w-2 h-2 rounded-full bg-teal-400/40"
        animate={{
          y: [0, -8, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-30 left-10 w-3 h-3 rounded-full bg-pink-500/50"
        animate={{
          y: [0, -12, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.8
        }}
      />
    </div>
  );
};

export default Auth;
