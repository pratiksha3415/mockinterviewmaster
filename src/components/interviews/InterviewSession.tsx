
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import BlurContainer from '@/components/ui/BlurContainer';
import { MessageSquare, Mic, Webcam, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// Enhanced mock questions with more detailed prompts
const mockQuestions = {
  technical: [
    "Explain the concept of RESTful APIs and their key principles. Include examples of HTTP methods and their purposes.",
    "What are closures in JavaScript and how would you use them? Provide a practical example of their application.",
    "Describe the difference between useMemo and useCallback in React. When would you use one over the other?",
    "How would you implement a basic caching mechanism in a web application? Discuss trade-offs between different caching strategies."
  ],
  behavioral: [
    "Tell me about a time when you faced a significant challenge in a project. How did you handle it? What was the outcome?",
    "Describe a situation where you had to work with a difficult team member. How did you manage the relationship and what did you learn?",
    "Give an example of a goal you achieved and what steps you took to reach it. What obstacles did you overcome?",
    "How do you handle feedback, particularly constructive criticism? Share a specific example where feedback helped you improve."
  ],
  hr: [
    "Why are you interested in this position and how does it align with your career goals?",
    "Where do you see yourself in 5 years? How does this role help you get there?",
    "What are your salary expectations? How did you arrive at this range?",
    "What do you consider your greatest professional achievement and why? What did you learn from this experience?"
  ]
};

// Enhanced keyword-based analysis
const keywordAnalysis = {
  technical: {
    "RESTful APIs": ["stateless", "client-server", "cacheable", "layered", "uniform interface", "HTTP methods", "GET", "POST", "PUT", "DELETE", "resource", "URI", "representation"],
    "closures": ["scope", "lexical environment", "encapsulation", "private variables", "function factory", "memory management", "variable access", "outer function"],
    "useMemo useCallback": ["memoization", "performance", "referential equality", "dependencies", "optimization", "prevent rerenders", "function reference", "value reference"],
    "caching": ["browser cache", "memory cache", "redis", "performance", "stale data", "cache invalidation", "cache-control", "etag", "service worker"]
  },
  behavioral: {
    "challenge": ["problem", "solution", "action", "result", "learning", "initiative", "teamwork", "obstacle", "outcome", "success", "failure", "adaptation"],
    "difficult team member": ["conflict", "resolution", "communication", "understanding", "compromise", "empathy", "perspective", "mediation", "relationship", "improvement"],
    "goal achievement": ["planning", "strategy", "execution", "milestones", "measurement", "persistence", "adaptation", "success", "failure", "learning"],
    "feedback": ["receptive", "implementation", "growth", "improvement", "reflection", "action", "change", "communication", "criticism", "development"]
  },
  hr: {
    "position interest": ["alignment", "career", "growth", "skills", "culture", "contribution", "passion", "research", "company values", "industry", "role"],
    "5 years": ["growth", "leadership", "learning", "development", "goals", "ambition", "realistic", "progression", "skills", "advancement"],
    "salary expectations": ["research", "market rate", "experience", "skills", "negotiable", "flexible", "value", "compensation", "benefits", "total package"],
    "achievement": ["impact", "metrics", "results", "leadership", "initiative", "challenge", "learning", "growth", "success", "pride", "contribution"]
  }
};

// Enhanced feedback generation based on keyword analysis
const generateEnhancedFeedback = (response, question, type, questionIndex) => {
  const questionType = Object.keys(mockQuestions).find(key => mockQuestions[key].includes(question));
  const questionTopic = Object.keys(keywordAnalysis[type])[questionIndex];
  const keywords = keywordAnalysis[type][questionTopic];
  
  const responseLower = response.toLowerCase();
  const keywordsFound = keywords.filter(keyword => responseLower.includes(keyword.toLowerCase()));
  const keywordCoverage = keywordsFound.length / keywords.length;
  
  // Analysis components
  const contentScore = Math.min(keywordCoverage * 1.5, 1); // Content relevance (0-1)
  const structureScore = response.length > 100 ? Math.min((response.length / 500) * 1.2, 1) : 0.3; // Structure and completeness
  const clarityScore = Math.random() * 0.3 + 0.7; // Randomized clarity score (for demo)
  
  // Overall score (weighted average)
  const overallScore = (contentScore * 0.5) + (structureScore * 0.3) + (clarityScore * 0.2);
  
  // Generate feedback based on scores
  let feedback = "";
  
  if (overallScore >= 0.8) {
    feedback = `Excellent response! You covered ${keywordsFound.length} key concepts including ${keywordsFound.slice(0, 3).join(", ")}. `;
    feedback += `Your answer demonstrates strong knowledge and clarity. `;
    
    if (keywordCoverage < 1) {
      const missingKeywords = keywords.filter(kw => !keywordsFound.includes(kw)).slice(0, 2);
      feedback += `Consider also mentioning ${missingKeywords.join(" and ")} to make your answer even more comprehensive.`;
    } else {
      feedback += `Your answer was comprehensive and well-structured.`;
    }
  } else if (overallScore >= 0.6) {
    feedback = `Good response. You addressed ${keywordsFound.length} important points including ${keywordsFound.slice(0, 2).join(" and ")}. `;
    
    if (response.length < 150) {
      feedback += `Your answer could benefit from more elaboration and detail. `;
    }
    
    const missingKeywords = keywords.filter(kw => !keywordsFound.includes(kw)).slice(0, 3);
    feedback += `To strengthen your answer, consider discussing ${missingKeywords.join(", ")}.`;
  } else {
    feedback = `Your response addresses some aspects of the question, but could be more comprehensive. `;
    
    if (keywordsFound.length > 0) {
      feedback += `You mentioned ${keywordsFound.slice(0, 2).join(" and ")}, which is good. `;
    }
    
    feedback += `To improve, focus on key concepts like ${keywords.slice(0, 4).join(", ")}. `;
    feedback += `Also consider structuring your answer with specific examples and clearer explanations.`;
  }
  
  return {
    feedback,
    metrics: {
      relevance: Math.round(contentScore * 100),
      structure: Math.round(structureScore * 100),
      clarity: Math.round(clarityScore * 100),
      overall: Math.round(overallScore * 100)
    }
  };
};

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
    if (mode !== 'text') {
      toast.info(`${mode.charAt(0).toUpperCase() + mode.slice(1)} response mode is coming soon!`);
      return;
    }
    setResponseMode(mode);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  const questionVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
  };
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };
  
  const ProgressIndicator = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
      <div 
        className="h-2 rounded-full bg-interview-blue transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
  
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
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-32 p-4 text-lg transition-all duration-200 focus:border-interview-blue focus:ring-1 focus:ring-interview-blue"
            disabled={showFeedback || isAnalyzing}
          />
        </div>
        
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 rounded-lg bg-interview-blue/10 border border-interview-blue/20">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 border-2 border-interview-blue border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium text-interview-blue">Analyzing your response...</span>
                </div>
                <div className="mt-3 space-y-3">
                  {["Content relevance", "Structure analysis", "Clarity assessment", "Feedback generation"].map((step, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${i <= analysisStage ? 'bg-interview-blue' : 'bg-gray-200'}`} />
                      <span className={i <= analysisStage ? 'text-gray-800' : 'text-gray-400'}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showFeedback && metrics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 overflow-hidden"
            >
              <h2 className="text-xl font-bold mb-2">AI Feedback:</h2>
              <div className="p-4 border rounded-lg border-interview-blue-light bg-interview-blue/5 space-y-4">
                <p className="text-lg">{feedback}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold mb-3">Response Metrics:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Content Relevance</span>
                        <span>{metrics.relevance}%</span>
                      </div>
                      <ProgressIndicator value={metrics.relevance} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Structure</span>
                        <span>{metrics.structure}%</span>
                      </div>
                      <ProgressIndicator value={metrics.structure} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Clarity</span>
                        <span>{metrics.clarity}%</span>
                      </div>
                      <ProgressIndicator value={metrics.clarity} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Overall</span>
                        <span>{metrics.overall}%</span>
                      </div>
                      <ProgressIndicator value={metrics.overall} />
                    </div>
                  </div>
                </div>
                
                {metrics.overall < 60 && (
                  <div className="flex items-start space-x-2 p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 mt-4">
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Your response could use improvement in key areas. Consider addressing the suggested concepts in your answer.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
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
