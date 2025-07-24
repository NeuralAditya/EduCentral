import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { VideoIcon, Square, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number; // in seconds
}

export default function VideoRecorder({ onRecordingComplete, maxDuration = 120 }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startRecording = useCallback(() => {
    if (!stream) return;

    chunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      setIsPreviewing(true);
      stopCamera();
    };

    mediaRecorder.start();
    setIsRecording(true);

    // Auto-stop after maxDuration
    setTimeout(() => {
      if (mediaRecorderRef.current && isRecording) {
        stopRecording();
      }
    }, maxDuration * 1000);
  }, [stream, maxDuration, isRecording, stopCamera]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleSubmit = useCallback(() => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob);
      setRecordedBlob(null);
      setIsPreviewing(false);
    }
  }, [recordedBlob, onRecordingComplete]);

  const handleRetake = useCallback(() => {
    setRecordedBlob(null);
    setIsPreviewing(false);
    startCamera();
  }, [startCamera]);

  // Initialize camera on mount
  useState(() => {
    startCamera();
    return () => stopCamera();
  });

  return (
    <div className="bg-neutral-50 rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="w-full max-w-md mx-auto bg-black rounded-lg aspect-video flex items-center justify-center mb-4 overflow-hidden">
          {isPreviewing && recordedBlob ? (
            <video
              ref={videoRef}
              src={URL.createObjectURL(recordedBlob)}
              controls
              className="w-full h-full"
            />
          ) : stream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white text-center">
              <VideoIcon className="mx-auto mb-4 h-16 w-16" />
              <p>Camera Preview</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          {!isPreviewing && !isRecording && (
            <Button 
              onClick={startRecording}
              disabled={!stream}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <VideoIcon className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          )}
          
          {isRecording && (
            <Button 
              onClick={stopRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          )}
          
          {isPreviewing && (
            <>
              <Button onClick={handleRetake} variant="outline">
                Retake
              </Button>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-blue-700">
                Submit Video
              </Button>
            </>
          )}
        </div>
        
        <p className="text-sm text-neutral-600 mt-2">
          Maximum recording time: {Math.floor(maxDuration / 60)} minutes
        </p>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">AI Assessment Criteria:</h4>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>• Speech clarity and pronunciation</li>
          <li>• Content accuracy and completeness</li>
          <li>• Use of appropriate examples</li>
          <li>• Overall presentation quality</li>
        </ul>
      </div>
    </div>
  );
}
