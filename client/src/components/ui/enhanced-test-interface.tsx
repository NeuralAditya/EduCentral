import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, Mic, MicOff, Video, VideoOff, Play, Square, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// MediaPipe Face Mesh integration
interface FaceMeshResult {
  landmarks: Array<{ x: number; y: number; z: number }>;
  boundingBox: { x: number; y: number; width: number; height: number };
}

interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  facial_score: number;
}

interface SpeechAnalysis {
  transcript: string;
  confidence: number;
  tone: string;
  speech_rate: number;
}

interface EnhancedTestInterfaceProps {
  question: {
    id: number;
    question: string;
    type: string;
    timeLimit?: number;
  };
  onAnswer: (answer: any) => void;
  onNext: () => void;
}

export function EnhancedTestInterface({ question, onAnswer, onNext }: EnhancedTestInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeLimit] = useState(question.timeLimit || 300); // 5 minutes default
  const [emotionData, setEmotionData] = useState<EmotionAnalysis | null>(null);
  const [speechData, setSpeechData] = useState<SpeechAnalysis | null>(null);
  const [faceMeshResult, setFaceMeshResult] = useState<FaceMeshResult | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);
  
  const { toast } = useToast();

  // Initialize camera and microphone
  useEffect(() => {
    initializeMedia();
    return () => {
      cleanup();
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= timeLimit) {
          handleTimeUp();
          return timeLimit;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCameraOn(true);
      setIsMicOn(true);
      
      // Initialize speech recognition
      initializeSpeechRecognition();
      
      // Start facial expression analysis
      if (stream.getVideoTracks().length > 0) {
        startFacialAnalysis();
      }
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Media Access Error",
        description: "Please allow camera and microphone access for the enhanced test experience.",
        variant: "destructive",
      });
    }
  };

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      
      // Analyze speech for tone and confidence
      analyzeSpeech(transcript, event.results[event.results.length - 1][0].confidence);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
    
    speechRecognitionRef.current = recognition;
  };

  const startFacialAnalysis = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const analyzeFace = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Simulate facial expression analysis (in real implementation, use MediaPipe)
        simulateFacialAnalysis();
      }
      
      if (isCameraOn) {
        requestAnimationFrame(analyzeFace);
      }
    };
    
    analyzeFace();
  };

  const simulateFacialAnalysis = () => {
    // This would integrate with MediaPipe Face Mesh in a real implementation
    const emotions = ['confident', 'nervous', 'focused', 'uncertain', 'calm'];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 0.7 + Math.random() * 0.3;
    const facial_score = confidence * 100;
    
    setEmotionData({ emotion, confidence, facial_score });
  };

  const analyzeSpeech = async (transcript: string, confidence: number) => {
    // Analyze speech rate and tone
    const words = transcript.split(' ').length;
    const speech_rate = words / (currentTime / 60) || 0; // words per minute
    
    // Simulate tone analysis (would use HuggingFace API in real implementation)
    const tones = ['confident', 'hesitant', 'clear', 'mumbled', 'enthusiastic'];
    const tone = tones[Math.floor(Math.random() * tones.length)];
    
    setSpeechData({
      transcript,
      confidence,
      tone,
      speech_rate: Math.min(speech_rate, 200) // Cap at reasonable WPM
    });
  };

  const startRecording = () => {
    if (!mediaStream) return;
    
    recordedChunks.current = [];
    
    const mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      handleRecordingComplete(blob);
    };
    
    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    
    // Start speech recognition
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.start();
    }
    
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Answer the question while we analyze your response.",
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    
    setIsRecording(false);
  };

  const handleRecordingComplete = (videoBlob: Blob) => {
    const answer = {
      type: 'video_analysis',
      videoBlob,
      emotionAnalysis: emotionData,
      speechAnalysis: speechData,
      facialData: faceMeshResult,
      timeSpent: currentTime,
      timestamp: new Date().toISOString()
    };
    
    onAnswer(answer);
  };

  const handleTimeUp = () => {
    if (isRecording) {
      stopRecording();
    }
    
    toast({
      title: "Time's Up!",
      description: "Moving to the next question.",
      variant: "destructive",
    });
    
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const toggleCamera = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMicrophone = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const cleanup = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeRemaining = timeLimit - currentTime;
  const progressPercentage = (currentTime / timeLimit) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Question Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI-Enhanced Assessment</span>
            <div className="flex items-center gap-4">
              <Badge variant={timeRemaining > 60 ? "default" : "destructive"}>
                {formatTime(timeRemaining)} remaining
              </Badge>
              <Progress value={progressPercentage} className="w-32" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">{question.question}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Answer while we analyze your facial expressions, tone, and confidence level.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Video Feed</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleCamera}
                  disabled={!mediaStream}
                >
                  {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMicrophone}
                  disabled={!mediaStream}
                >
                  {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 bg-gray-100 rounded-lg object-cover"
              />
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className="hidden"
              />
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  RECORDING
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Real-time Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Emotion Analysis */}
            {emotionData && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Facial Expression</h4>
                <div className="flex justify-between items-center">
                  <span className="capitalize">{emotionData.emotion}</span>
                  <Badge variant="secondary">
                    {Math.round(emotionData.facial_score)}% confidence
                  </Badge>
                </div>
              </div>
            )}

            {/* Speech Analysis */}
            {speechData && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Speech Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tone:</span>
                    <span className="capitalize font-medium">{speechData.tone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speech Rate:</span>
                    <span className="font-medium">{Math.round(speechData.speech_rate)} WPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clarity:</span>
                    <span className="font-medium">{Math.round(speechData.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Live Transcript */}
            {speechData?.transcript && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Live Transcript</h4>
                <p className="text-sm text-gray-600 max-h-20 overflow-y-auto">
                  {speechData.transcript}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recording Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={!isCameraOn || !isMicOn}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Recording Answer
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop & Submit Answer
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={onNext}
              disabled={isRecording}
            >
              Skip Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}