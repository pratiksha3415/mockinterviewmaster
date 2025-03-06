
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import BlurContainer from '@/components/ui/BlurContainer';
import { MessageSquare, Mic, Webcam, ChevronRight, Check } from 'lucide-react';
import { toast } from 'sonner';

// Mock interview questions
const mockQuestions = {
  technical: [
    "Explain the concept of RESTful APIs and their key principles.",
    "What are closures in JavaScript and how would you use them?",
    "Describe the difference between useMemo and useCallback in React.",
    "How would you implement a basic caching mechanism?"
  ],
  behavioral: [
    "Tell me about a time when you faced a significant challenge in a project. How did you handle it?",
    "Describe a situation where you had to work with a difficult team member. How did you manage the relationship?",
    "Give an example of a goal you achieved and what steps you took to reach it.",
    "How do you handle feedback, particularly constructive criticism?"
  ],
  hr: [
    "Why are you interested in this position?",
    "Where do you see yourself in 5 years?",
    "What are your salary expectations?",
    "What do you consider your greatest professional achievement?"
  ]
};

// Mock feedback responses
const mockFeedback = [
  "Your answer demonstrates good knowledge of the core concepts. Consider providing more specific examples to strengthen your response.",
  "Well-structured response! You covered the key points effectively. To improve, try to be more concise in your explanations.",
  "Good start, but your answer could benefit from more technical details and real-world applications.",
  "Strong response with clear reasoning. Consider adding a brief summary at the end to reinforce your main points."
];

interface InterviewSessionProps {
  type: 'technical' | 'behavioral' | 'hr';
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ type }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [response, setResponse] = useState('');
  const [responseMode, setResponseMode] = useState<'text' | 'audio' | 'video'>('text');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  
  const questions = mockQuestions[type];
  
  useEffect(() => {
    setIsLastQuestion(currentQuestion === questions.length - 1);
  }, [currentQuestion, questions.length]);
  
  const handleSubmit = () => {
    if (!response.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to get feedback
    setTimeout(() => {
      // Get random feedback
      const randomFeedback = mockFeedback[Math.floor(Math.random() * mockFeedback.length)];
      setFeedback(randomFeedback);
      setShowFeedback(true);
      setIsSubmitting(false);
    }, 1500);
  };
  
  const handleNext = () => {
    if (isLastQuestion) {
      // End the interview and go to results
      navigate('/results', { 
        state: { 
          type,
          questionsAnswered: questions.length
        } 
      });
      return;
    }
    
    // Move to next question
    setCurrentQuestion(prev => prev + 1);
    setResponse('');
    setShowFeedback(false);
  };
  
  const handleChangeMode = (mode: 'text' | 'audio' | 'video') => {
    if (mode !== 'text') {
      toast.info("This feature is coming soon!");
      return;
    }
    setResponseMode(mode);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <BlurContainer className="p-6 md:p-8">
        <div className="mb-4 flex justify-between items-center">
          <div className="font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="flex space-x-2">
            <Button
              variant={responseMode === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChangeMode('text')}
              className={responseMode === 'text' ? 'bg-interview-blue hover:bg-interview-blue-dark' : ''}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Text
            </Button>
            <Button
              variant={responseMode === 'audio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChangeMode('audio')}
              className={responseMode === 'audio' ? 'bg-interview-blue hover:bg-interview-blue-dark' : ''}
            >
              <Mic className="h-4 w-4 mr-2" />
              Audio
            </Button>
            <Button
              variant={responseMode === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChangeMode('video')}
              className={responseMode === 'video' ? 'bg-interview-blue hover:bg-interview-blue-dark' : ''}
            >
              <Webcam className="h-4 w-4 mr-2" />
              Video
            </Button>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Question:</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xl p-4 bg-interview-blue-light rounded-lg"
            >
              {questions[currentQuestion]}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Your Response:</h2>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-32 p-4 text-lg"
            disabled={showFeedback}
          />
        </div>
        
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <h2 className="text-xl font-bold mb-2">AI Feedback:</h2>
              <div className="p-4 border rounded-lg border-interview-blue-light bg-interview-blue/5">
                <p className="text-lg">{feedback}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-end space-x-3">
          {!showFeedback ? (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || response.trim() === ''}
              className="bg-interview-blue hover:bg-interview-blue-dark"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Submit Answer
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              className="bg-interview-blue hover:bg-interview-blue-dark"
            >
              {isLastQuestion ? 'Finish Interview' : 'Next Question'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </BlurContainer>
    </motion.div>
  );
};

export default InterviewSession;
