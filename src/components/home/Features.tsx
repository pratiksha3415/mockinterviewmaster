
import React from 'react';
import { motion } from 'framer-motion';
import { Code, Users, Briefcase, MessageSquare, AudioLines, Webcam } from 'lucide-react';
import BlurContainer from '@/components/ui/BlurContainer';

const features = [
  {
    title: 'Technical Interviews',
    description: 'Practice coding, system design, and technical questions with AI-powered feedback.',
    icon: Code,
    delay: 0.1,
  },
  {
    title: 'Behavioral Interviews',
    description: 'Master STAR method responses for leadership and problem-solving scenarios.',
    icon: Users,
    delay: 0.2,
  },
  {
    title: 'HR Interviews',
    description: 'Prepare for common HR questions, salary negotiations, and cultural fit discussions.',
    icon: Briefcase,
    delay: 0.3,
  },
  {
    title: 'Text Response Mode',
    description: 'Type your answers and receive detailed feedback on content and clarity.',
    icon: MessageSquare,
    delay: 0.4,
  },
  {
    title: 'Audio Response Mode',
    description: 'Speak your answers naturally and get feedback on tone and delivery.',
    icon: AudioLines,
    delay: 0.5,
  },
  {
    title: 'Video Response Mode',
    description: 'Practice with your camera to improve body language and eye contact.',
    icon: Webcam,
    delay: 0.6,
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-interview-slate-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              viewport={{ once: true }}
            >
              <BlurContainer className="h-full p-8 card-hover">
                <div className="flex flex-col h-full">
                  <div className="mb-4 p-3 rounded-full bg-interview-blue-light w-fit">
                    <feature.icon className="h-6 w-6 text-interview-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 flex-grow">{feature.description}</p>
                </div>
              </BlurContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
