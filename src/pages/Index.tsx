
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
    <div className="min-h-screen">
      <Navbar />
      
      <motion.div style={{ opacity }} className="fixed bottom-8 right-8 z-40">
        <Link to="/auth?type=register">
          <Button className="bg-interview-blue hover:bg-interview-blue-dark rounded-full p-6 shadow-lg">
            Get Started
          </Button>
        </Link>
      </motion.div>
      
      <Hero />
      <Features />
      
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to master your interviews?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
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
              <Button className="bg-interview-blue hover:bg-interview-blue-dark text-white px-8 py-6 rounded-lg text-lg h-auto font-medium hover-lift">
                Start Free Practice
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      <footer className="py-8 bg-interview-slate">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-semibold mb-4 md:mb-0">MockMaster</div>
            <div className="text-sm text-gray-600">© {new Date().getFullYear()} MockMaster. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
