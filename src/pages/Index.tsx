
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background animated video */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-10"
          style={{ filter: 'blur(8px)' }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-white-and-blue-particles-floating-on-a-black-background-46868-large.mp4" type="video/mp4" />
        </video>
      </div>
      
      <Navbar />
      
      <motion.div style={{ opacity }} className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
        <Link to="/auth?type=register">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 rounded-full p-4 md:p-6 shadow-lg transition-all duration-300 hover:shadow-blue-400/20 hover:shadow-xl text-sm md:text-base">
            Get Started
          </Button>
        </Link>
      </motion.div>
      
      <Hero />
      <Features />
      
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background gradient for this section */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-interview-blue/5"></div>
        
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Ready to master your interviews?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8"
          >
            Create an account today and start practicing with our AI-powered interview platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link to="/auth?type=register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 md:px-8 py-4 md:py-6 rounded-lg text-base md:text-lg h-auto font-medium hover-lift">
                Start Free Practice
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      <footer className="py-6 md:py-8 bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-lg md:text-xl font-semibold mb-4 md:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">MockMaster</div>
            <div className="text-xs md:text-sm text-gray-600">© {new Date().getFullYear()} MockMaster. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
