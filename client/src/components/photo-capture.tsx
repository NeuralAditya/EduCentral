import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoCaptureProps {
  onPhotoComplete: (file: File) => void;
}

export default function PhotoCapture({ onPhotoComplete }: PhotoCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      setStream(mediaStream);
      setIsCapturing(true);
      
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
      setIsCapturing(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
          onPhotoComplete(file);
        }
      }, 'image/jpeg', 0.8);
    }
  }, [capturedImage, onPhotoComplete]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  return (
    <div className="bg-neutral-50 rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors">
          {capturedImage ? (
            <div className="mb-4">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="max-w-full max-h-64 mx-auto rounded-lg"
              />
            </div>
          ) : isCapturing && stream ? (
            <div className="mb-4">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="max-w-full max-h-64 mx-auto rounded-lg"
              />
            </div>
          ) : (
            <div className="mb-4">
              <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600">Click to capture or upload photo</p>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="flex justify-center space-x-4">
            {!capturedImage && !isCapturing && (
              <>
                <Button onClick={startCamera} className="bg-primary hover:bg-blue-700">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Photo
                </Button>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-secondary hover:bg-green-700"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </>
            )}
            
            {isCapturing && (
              <Button onClick={capturePhoto} className="bg-red-500 hover:bg-red-600">
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
            )}
            
            {capturedImage && (
              <>
                <Button onClick={handleRetake} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
                <Button onClick={handleSubmit} className="bg-primary hover:bg-blue-700">
                  Submit Photo
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">AI Assessment Criteria:</h4>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>• Diagram accuracy and completeness</li>
          <li>• Proper force vector representation</li>
          <li>• Correct labeling and annotations</li>
          <li>• Overall clarity and presentation</li>
        </ul>
      </div>
    </div>
  );
}
