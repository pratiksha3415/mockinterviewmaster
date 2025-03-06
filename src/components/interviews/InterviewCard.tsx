
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
  
  const colors = {
    technical: {
      bg: 'bg-blue-500',
      light: 'bg-blue-100',
      text: 'text-blue-600',
      gradient: 'from-blue-500 to-indigo-600',
      container: 'blue'
    },
    behavioral: {
      bg: 'bg-purple-500',
      light: 'bg-purple-100',
      text: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-600',
      container: 'purple'
    },
    hr: {
      bg: 'bg-teal-500',
      light: 'bg-teal-100',
      text: 'text-teal-600',
      gradient: 'from-teal-500 to-emerald-600',
      container: 'teal'
    },
  };
  
  const Icon = icons[type];
  const color = colors[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/interviews/${type}`}>
        <BlurContainer 
          className="h-full p-6 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
          colorVariant={color.container as any}
        >
          <div className="flex flex-col h-full">
            <div className={`mb-4 p-3 rounded-full ${color.light} w-fit group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`h-6 w-6 ${color.text}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 group-hover:${color.text} transition-colors`}>{title}</h3>
            <p className="text-gray-600 flex-grow">{description}</p>
            <div className={`mt-4 ${color.text} font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center`}>
              <span>Start Practice</span>
              <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className={`mt-4 h-1 w-0 bg-gradient-to-r ${color.gradient} rounded-full group-hover:w-full transition-all duration-500`} />
          </div>
        </BlurContainer>
      </Link>
    </motion.div>
  );
};

export default InterviewCard;
