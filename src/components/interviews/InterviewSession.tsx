import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import BlurContainer from '@/components/ui/BlurContainer';
import { MessageSquare, Mic, Webcam, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import AudioRecorder from './AudioRecorder';

// ... keep existing code (Enhanced mock questions with more detailed prompts and keywordAnalysis constants)

interface InterviewSessionProps {
  type: 'technical' | 'behavioral' | 'hr';
  responseMode: 'text' | 'audio' | 'video';
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ type, responseMode: initialResponseMode }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [response, setResponse] = useState('');
  const [responseMode, setResponseMode] = useState<'text' | 'audio' | 'video'>(initialResponseMode);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [metrics, setMetrics] = useState<{
    relevance: number;
    structure: number;
    clarity: number;
    overall: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  
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
    setIsAnalyzing(true);
    
    // Simulate multi-stage analysis with progress updates
    const analyzeStages = [
      "Processing response...",
      "Evaluating content relevance...",
      "Analyzing structure and clarity...",
      "Generating feedback..."
    ];
    
    // Simulate progressive analysis steps
    let stage = 0;
    const analysisInterval = setInterval(() => {
      if (stage < analyzeStages.length) {
        toast.info(analyzeStages[stage]);
        setAnalysisStage(stage);
        stage++;
      } else {
        clearInterval(analysisInterval);
        
        // Generate enhanced feedback based on response analysis
        const result = generateEnhancedFeedback(
          response, 
          questions[currentQuestion],
          type,
          currentQuestion % Object.keys(keywordAnalysis[type]).length
        );
        
        setFeedback(result.feedback);
        setMetrics(result.metrics);
        setShowFeedback(true);
        setIsSubmitting(false);
        setIsAnalyzing(false);
        setAnalysisStage(0);
      }
    }, 700);
  };
  
  const handleNext = () => {
    if (isLastQuestion) {
      // End the interview and go to results
      navigate('/results', { 
        state: { 
          type,
          questionsAnswered: questions.length,
          metrics: metrics
        } 
      });
      return;
    }
    
    // Move to next question
    setCurrentQuestion(prev => prev + 1);
    setResponse('');
    setShowFeedback(false);
    setMetrics(null);
  };
  
  const handleChangeMode = (mode: 'text' | 'audio' | 'video') => {
    setResponseMode(mode);
  };

  const handleTranscription = (transcription: string) => {
    setResponse(transcription);
  };
  
  // ... keep existing code (Animation variants and ProgressIndicator component)
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
    >
      <BlurContainer className="p-6 md:p-8" intensity="heavy">
        <div className="mb-4 flex justify-between items-center">
          <motion.div 
            className="font-medium text-gray-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Question {currentQuestion + 1} of {questions.length}
          </motion.div>
          <motion.div 
            className="flex space-x-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
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
          </motion.div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Question:</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              variants={questionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-xl p-4 bg-interview-blue-light rounded-lg"
            >
              {questions[currentQuestion]}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Your Response:</h2>
          
          {responseMode === 'text' && (
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-32 p-4 text-lg transition-all duration-200 focus:border-interview-blue focus:ring-1 focus:ring-interview-blue"
              disabled={showFeedback || isAnalyzing}
            />
          )}
          
          {responseMode === 'audio' && (
            <div className="mb-4">
              <AudioRecorder 
                onTranscriptionComplete={handleTranscription}
                disabled={showFeedback || isAnalyzing}
              />
              {response && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-2">Transcribed Text:</h3>
                  <div className="p-3 bg-gray-50 border rounded-md text-gray-800">
                    {response}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {responseMode === 'video' && (
            <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
                <div className="text-center">
                  <Webcam className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Video response mode is coming soon</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {/* ... keep existing code (isAnalyzing state UI) */}
        </AnimatePresence>
        
        <AnimatePresence>
          {/* ... keep existing code (showFeedback state UI) */}
        </AnimatePresence>
        
        <div className="flex justify-end space-x-3">
          {!showFeedback ? (
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
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
            </motion.div>
          ) : (
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                onClick={handleNext}
                className="bg-interview-blue hover:bg-interview-blue-dark"
              >
                {isLastQuestion ? 'Finish Interview' : 'Next Question'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      </BlurContainer>
    </motion.div>
  );
};

export default InterviewSession;
