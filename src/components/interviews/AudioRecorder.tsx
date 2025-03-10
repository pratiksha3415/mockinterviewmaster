import React, { useEffect } from 'react';
import { Mic, Square, Volume2, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useAudioRecorder from '@/hooks/useAudioRecorder';

interface AudioRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onTranscriptionComplete, 
  disabled = false 
}) => {
  const {
    isRecording,
    recordingTime,
    audioUrl,
    audioBlob,
    isProcessing,
    startRecording,
    stopRecording,
    resetRecording,
    transcribeAudio
  } = useAudioRecorder();

  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleStartRecording = async () => {
    if (disabled) return;
    await startRecording();
  };

  const handleStopRecording = async () => {
    if (disabled) return;
    await stopRecording();
  };

  const handleReset = () => {
    resetRecording();
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleSubmit = async () => {
    if (disabled || !audioBlob) return;
    
    try {
      const result = await transcribeAudio();
      
      if (result && result.transcription) {
        onTranscriptionComplete(result.transcription);
        toast.success('Audio transcribed successfully');
      } else {
        toast.error('Failed to transcribe audio');
      }
    } catch (error) {
      console.error('Error submitting audio:', error);
      toast.error('Failed to process audio response');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Audio Response</h3>
        <div className="text-sm text-muted-foreground">
          {isRecording && <span className="text-red-500 flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
            Recording: {formatTime(recordingTime)}
          </span>}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {!isRecording && !audioUrl && (
          <Button 
            onClick={handleStartRecording} 
            disabled={disabled || isProcessing}
            variant="default" 
            className="bg-interview-blue hover:bg-interview-blue-dark"
          >
            <Mic className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        )}
        
        {isRecording && (
          <Button 
            onClick={handleStopRecording} 
            disabled={disabled}
            variant="destructive"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        )}
        
        {audioUrl && (
          <>
            <Button onClick={handlePlay} variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Play
            </Button>
            
            <Button 
              onClick={handleSubmit} 
              disabled={disabled || isProcessing}
              variant="default" 
              className="bg-interview-blue hover:bg-interview-blue-dark"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {isProcessing ? 'Transcribing...' : 'Submit Audio'}
            </Button>
            
            <Button onClick={handleReset} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </>
        )}
      </div>
      
      {isProcessing && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 rounded-full border-2 border-interview-blue border-t-transparent animate-spin"></div>
          <span>Processing audio...</span>
        </div>
      )}
      
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} className="w-full mt-2" controls />
      )}
    </div>
  );
};

export default AudioRecorder;
