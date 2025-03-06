
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Users, Briefcase } from 'lucide-react';
import BlurContainer from '@/components/ui/BlurContainer';

interface InterviewCardProps {
  type: 'technical' | 'behavioral' | 'hr';
  title: string;
  description: string;
  index: number;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ type, title, description, index }) => {
  const icons = {
    technical: Code,
    behavioral: Users,
    hr: Briefcase,
  };
  
  const Icon = icons[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/interviews/${type}`}>
        <BlurContainer className="h-full p-6 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
          <div className="flex flex-col h-full">
            <div className="mb-4 p-3 rounded-full bg-interview-blue-light w-fit">
              <Icon className="h-6 w-6 text-interview-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-interview-blue transition-colors">{title}</h3>
            <p className="text-gray-600 flex-grow">{description}</p>
            <div className="mt-4 text-interview-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <span>Start Practice</span>
              <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </BlurContainer>
      </Link>
    </motion.div>
  );
};

export default InterviewCard;
