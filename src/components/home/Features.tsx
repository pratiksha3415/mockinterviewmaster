
import React from 'react';
import { motion } from 'framer-motion';
import { Code, Users, Briefcase, MessageSquare, AudioLines, Webcam, Sparkles } from 'lucide-react';
import BlurContainer from '@/components/ui/BlurContainer';

const features = [
  {
    title: 'Technical Interviews',
    description: 'Practice coding, system design, and technical questions with AI-powered feedback.',
    icon: Code,
    delay: 0.1,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Behavioral Interviews',
    description: 'Master STAR method responses for leadership and problem-solving scenarios.',
    icon: Users,
    delay: 0.2,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'HR Interviews',
    description: 'Prepare for common HR questions, salary negotiations, and cultural fit discussions.',
    icon: Briefcase,
    delay: 0.3,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Text Response Mode',
    description: 'Type your answers and receive detailed feedback on content and clarity.',
    icon: MessageSquare,
    delay: 0.4,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Audio Response Mode',
    description: 'Speak your answers naturally and get feedback on tone and delivery.',
    icon: AudioLines,
    delay: 0.5,
    color: 'bg-rose-100 text-rose-600',
  },
  {
    title: 'Video Response Mode',
    description: 'Practice with your camera to improve body language and eye contact.',
    icon: Webcam,
    delay: 0.6,
    color: 'bg-indigo-100 text-indigo-600',
  },
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-interview-slate-light relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-blue-300/10 rounded-full filter blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
          className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] bg-indigo-300/10 rounded-full filter blur-3xl" 
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-interview-blue-light text-interview-blue text-sm font-medium mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Features</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Comprehensive Interview Preparation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Our platform offers multiple ways to practice and improve your interview skills.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <BlurContainer className="h-full p-8 card-hover-shine transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="flex flex-col h-full">
                  <div className={`mb-4 p-3 rounded-full ${feature.color} w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-interview-blue transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 flex-grow">{feature.description}</p>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: feature.delay + 0.5 }}
                    viewport={{ once: true }}
                    className="mt-4 h-1 w-12 bg-interview-blue/30 rounded-full group-hover:w-20 transition-all duration-300"
                  />
                </div>
              </BlurContainer>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Floating elements for visual interest */}
      <motion.div
        className="absolute bottom-10 right-10 w-2 h-2 rounded-full bg-interview-blue"
        animate={{
          y: [0, -8, 0],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-3 h-3 rounded-full bg-interview-blue/60"
        animate={{
          y: [0, -12, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute bottom-15 right-32 w-1.5 h-1.5 rounded-full bg-interview-blue/40"
        animate={{
          y: [0, -6, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
    </section>
  );
};

export default Features;
