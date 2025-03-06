
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import BlurContainer from '@/components/ui/BlurContainer';

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-interview-blue/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-interview-blue-light text-interview-blue text-sm font-medium mb-4">
                  AI-Powered Interview Practice
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                Master Your <span className="text-interview-blue">Interviews</span> With AI
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-4 text-xl text-gray-600 max-w-lg"
              >
                Practice and perfect your interview skills with our AI-powered platform. Get real-time feedback and improve with every session.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mt-4"
            >
              <Link to="/auth?type=register">
                <Button className="bg-interview-blue hover:bg-interview-blue-dark text-white px-8 py-6 rounded-lg text-lg h-auto font-medium hover-lift">
                  Get Started
                </Button>
              </Link>
              <Link to="/auth?type=login">
                <Button variant="outline" className="px-8 py-6 rounded-lg text-lg h-auto font-medium hover-lift">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative mx-auto max-w-md lg:max-w-none"
          >
            <BlurContainer className="p-6 md:p-8 w-full">
              <div className="space-y-6 relative">
                <div className="h-10 flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-4 h-6 w-64 bg-gray-100 rounded-md" />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-28 bg-interview-blue-light rounded-md" />
                      <div className="h-6 w-20 bg-gray-100 rounded-md" />
                    </div>
                    <div className="h-24 bg-gray-100 rounded-lg w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-6 w-28 bg-interview-blue-light rounded-md" />
                    <div className="h-24 bg-gray-100 rounded-lg w-full" />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <div className="h-10 w-28 bg-gray-200 rounded-md" />
                    <div className="h-10 w-28 bg-interview-blue rounded-md" />
                  </div>
                </div>
              </div>
            </BlurContainer>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-interview-blue/10 rounded-full filter blur-xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-400/10 rounded-full filter blur-xl" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
