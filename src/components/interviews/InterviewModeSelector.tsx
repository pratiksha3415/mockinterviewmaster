
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, Video } from 'lucide-react';
import BlurContainer from '@/components/ui/BlurContainer';

interface InterviewModeSelectorProps {
  selectedMode: 'text' | 'audio' | 'video';
  onSelectMode: (mode: 'text' | 'audio' | 'video') => void;
}

const InterviewModeSelector: React.FC<InterviewModeSelectorProps> = ({ 
  selectedMode, 
  onSelectMode 
}) => {
  const modes = [
    {
      id: 'text',
      title: 'Text Response Mode',
      description: 'Type your answers and receive detailed feedback on content and clarity.',
      icon: <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-interview-blue" />,
      bgColor: 'bg-yellow-100',
      iconContainer: 'bg-yellow-50',
      colorVariant: 'yellow'
    },
    {
      id: 'audio',
      title: 'Audio Response Mode',
      description: 'Speak your answers naturally and get feedback on tone and delivery.',
      icon: <Mic className="h-6 w-6 md:h-8 md:w-8 text-rose-500" />,
      bgColor: 'bg-rose-100',
      iconContainer: 'bg-rose-50',
      colorVariant: 'rose'
    },
    {
      id: 'video',
      title: 'Video Response Mode',
      description: 'Practice with your camera to improve body language and eye contact.',
      icon: <Video className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />,
      bgColor: 'bg-blue-100',
      iconContainer: 'bg-blue-50',
      colorVariant: 'blue'
    }
  ];

  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Select Response Mode</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {modes.map((mode) => (
          <motion.div
            key={mode.id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => onSelectMode(mode.id as 'text' | 'audio' | 'video')}
            className="cursor-pointer"
          >
            <BlurContainer 
              className={`p-4 md:p-6 ${selectedMode === mode.id ? 'ring-2 ring-interview-blue' : ''}`}
              colorVariant={mode.colorVariant as 'blue' | 'purple' | 'teal' | 'default' | 'rose'}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 md:w-16 md:h-16 ${mode.iconContainer} rounded-full flex items-center justify-center mb-3 md:mb-4`}>
                  {mode.icon}
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{mode.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{mode.description}</p>
                
                {selectedMode === mode.id && (
                  <motion.div 
                    className="w-16 md:w-24 h-1 bg-interview-blue mt-3 md:mt-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '6rem' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </BlurContainer>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterviewModeSelector;
