import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import VideoRecorder from "./video-recorder";
import PhotoCapture from "./photo-capture";
import { Question } from "@shared/schema";

interface QuestionRendererProps {
  question: Question;
  onAnswerSubmit: (answer: any) => void;
  currentIndex: number;
  totalQuestions: number;
}

export default function QuestionRenderer({ 
  question, 
  onAnswerSubmit, 
  currentIndex, 
  totalQuestions 
}: QuestionRendererProps) {
  const [mcqAnswer, setMcqAnswer] = useState("");
  const [textAnswer, setTextAnswer] = useState("");

  const handleMCQSubmit = () => {
    if (mcqAnswer) {
      onAnswerSubmit({ type: "mcq", answer: mcqAnswer });
    }
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      onAnswerSubmit({ type: "text", answer: textAnswer });
    }
  };

  const handleVideoSubmit = (blob: Blob) => {
    onAnswerSubmit({ type: "video", file: blob });
  };

  const handlePhotoSubmit = (file: File) => {
    onAnswerSubmit({ type: "photo", file });
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case "mcq":
        return (
          <div className="space-y-4">
            <RadioGroup value={mcqAnswer} onValueChange={setMcqAnswer}>
              {(question.options as string[])?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={handleMCQSubmit} 
              disabled={!mcqAnswer}
              className="w-full"
            >
              Submit Answer
            </Button>
          </div>
        );

      case "short_answer":
        return (
          <div className="space-y-4">
            <Textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              className="min-h-32"
            />
            <Button 
              onClick={handleTextSubmit} 
              disabled={!textAnswer.trim()}
              className="w-full"
            >
              Submit Answer
            </Button>
          </div>
        );

      case "video_response":
        return (
          <VideoRecorder 
            onRecordingComplete={handleVideoSubmit}
            maxDuration={question.timeLimit || 120}
          />
        );

      case "photo_upload":
        return (
          <PhotoCapture onPhotoComplete={handlePhotoSubmit} />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Question {currentIndex + 1}</h3>
          <span className="text-sm text-neutral-600">
            {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
        <p className="text-lg leading-relaxed mb-6">{question.question}</p>
        
        {question.points && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-blue-700">
              <strong>Points:</strong> {question.points} | 
              <strong> Time Limit:</strong> {question.timeLimit ? `${question.timeLimit}s` : 'No limit'}
            </p>
          </div>
        )}
      </div>
      
      {renderQuestionContent()}
    </div>
  );
}
