import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { analysisService } from '@/services/api';

export interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  isProcessing: boolean;
}

export interface AudioRecorderHook extends AudioRecorderState {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetRecording: () => void;
  transcribeAudio: () => Promise<{transcription: string, confidence: number} | null>;
}

const useAudioRecorder = (): AudioRecorderHook => {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    audioBlob: null,
    audioUrl: null,
    isProcessing: false
  });

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  const timerInterval = useRef<number | null>(null);
  const stream = useRef<MediaStream | null>(null);

  const clearTimerInterval = () => {
    if (timerInterval.current) {
      window.clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const startRecording = useCallback(async () => {
    try {
      audioChunks.current = [];
      
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recorder = new MediaRecorder(stream.current);
      
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      });
      
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setState(prevState => ({
          ...prevState,
          audioBlob,
          audioUrl,
          isRecording: false
        }));
        
        // Clear the timer
        clearTimerInterval();
        
        // Clean up the stream
        if (stream.current) {
          stream.current.getTracks().forEach(track => track.stop());
        }
      });
      
      // Start recording
      recorder.start();
      mediaRecorder.current = recorder;
      
      // Start timer
      let recordingTime = 0;
      timerInterval.current = window.setInterval(() => {
        recordingTime += 1;
        setState(prevState => ({
          ...prevState,
          recordingTime
        }));
      }, 1000);
      
      setState({
        isRecording: true,
        isPaused: false,
        recordingTime: 0,
        audioBlob: null,
        audioUrl: null,
        isProcessing: false
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (mediaRecorder.current && state.isRecording) {
      mediaRecorder.current.stop();
    }
    
    return new Promise<void>((resolve) => {
      // Wait for the 'stop' event to fire and process the audio
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }, [state.isRecording]);

  const resetRecording = useCallback(() => {
    clearTimerInterval();
    
    // Cleanup
    if (stream.current) {
      stream.current.getTracks().forEach(track => track.stop());
    }
    
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    
    setState({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      audioBlob: null,
      audioUrl: null,
      isProcessing: false
    });
  }, [state.audioUrl]);

  const transcribeAudio = useCallback(async () => {
    if (!state.audioBlob) {
      toast.error('No audio recording found to transcribe');
      return null;
    }

    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      
      const result = await analysisService.transcribeAudio(state.audioBlob);
      
      return result;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error('Failed to transcribe audio. Please try again.');
      return null;
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [state.audioBlob]);

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    transcribeAudio
  };
};

export default useAudioRecorder;
