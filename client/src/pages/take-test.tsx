import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import TestTimer from "@/components/test-timer";
import QuestionRenderer from "@/components/question-renderer";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TakeTest() {
  const [, params] = useRoute("/take-test/:testId");
  const testId = params?.testId;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAttemptId, setCurrentAttemptId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Map<number, any>>(new Map());
  const [isTestStarted, setIsTestStarted] = useState(false);
  
  const { toast } = useToast();

  const { data: test, isLoading } = useQuery({
    queryKey: ["/api/tests", testId],
    enabled: !!testId,
  });

  const startAttemptMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/attempts", {
        testId: parseInt(testId!),
        userId: 1, // Using user ID 1 for demo
      });
      return response.json();
    },
    onSuccess: (attempt) => {
      setCurrentAttemptId(attempt.id);
      setIsTestStarted(true);
      toast({
        title: "Test Started",
        description: "Good luck with your test!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start test. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ answer, questionId }: { answer: any; questionId: number }) => {
      if (!currentAttemptId) throw new Error("No active attempt");

      const formData = new FormData();
      formData.append("questionId", questionId.toString());
      formData.append("timeSpent", "60"); // Simplified time tracking

      let endpoint = "";
      
      if (answer.type === "mcq" || answer.type === "text") {
        endpoint = `/api/attempts/${currentAttemptId}/answers`;
        return apiRequest("POST", endpoint, {
          questionId,
          answerData: { answer: answer.answer },
          timeSpent: 60,
        });
      } else if (answer.type === "video") {
        endpoint = `/api/attempts/${currentAttemptId}/video`;
        formData.append("video", answer.file);
        
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Failed to submit video");
        }
        return response;
      } else if (answer.type === "photo") {
        endpoint = `/api/attempts/${currentAttemptId}/photo`;
        formData.append("photo", answer.file);
        
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Failed to submit photo");
        }
        return response;
      }
    },
    onSuccess: (_, { questionId }) => {
      toast({
        title: "Answer Submitted",
        description: "Your answer has been saved and assessed.",
      });
      
      // Move to next question
      if (test && test.questions && currentQuestionIndex < test.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    },
    onError: () => {
      toast({
        title: "Submission Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const completeTestMutation = useMutation({
    mutationFn: async () => {
      if (!currentAttemptId) throw new Error("No active attempt");
      
      return apiRequest("PATCH", `/api/attempts/${currentAttemptId}/complete`, {
        timeSpent: 4800, // 80 minutes in seconds (simplified)
      });
    },
    onSuccess: () => {
      toast({
        title: "Test Completed",
        description: "Your test has been submitted successfully!",
      });
      // Redirect to results
      window.location.href = "/results";
    },
  });

  const handleAnswerSubmit = (answer: any) => {
    const currentQuestion = test?.questions?.[currentQuestionIndex];
    if (!currentQuestion) return;

    setAnswers(prev => new Map(prev.set(currentQuestion.id, answer)));
    submitAnswerMutation.mutate({ answer, questionId: currentQuestion.id });
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "The test time has expired. Submitting your answers...",
      variant: "destructive",
    });
    completeTestMutation.mutate();
  };

  const handleCompleteTest = () => {
    if (answers.size < (test?.questions?.length || 0)) {
      toast({
        title: "Incomplete Test",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    completeTestMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Test Not Found</h2>
        <p className="text-neutral-600">The test you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <Card className="shadow-material-lg max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{test.title}</h2>
          <p className="text-neutral-600 mb-6">{test.description}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <p className="font-bold text-2xl">{test.questions?.length || 0}</p>
              <p className="text-sm text-neutral-600">Questions</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <p className="font-bold text-2xl">{test.duration}</p>
              <p className="text-sm text-neutral-600">Minutes</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <p className="font-bold text-2xl capitalize">{test.difficulty}</p>
              <p className="text-sm text-neutral-600">Difficulty</p>
            </div>
          </div>
          
          <Button 
            onClick={() => startAttemptMutation.mutate()}
            disabled={startAttemptMutation.isPending}
            size="lg"
            className="w-full"
          >
            {startAttemptMutation.isPending ? "Starting Test..." : "Start Test"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = test.questions?.[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / (test.questions?.length || 1)) * 100;

  return (
    <Card className="shadow-material-lg overflow-hidden">
      {/* Test Header */}
      <div className="bg-primary text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{test.title}</h2>
            <p className="text-blue-100">{test.description}</p>
          </div>
          <div className="text-right">
            <TestTimer
              durationMinutes={test.duration}
              onTimeUp={handleTimeUp}
              isActive={isTestStarted}
            />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestionIndex + 1} of {test.questions?.length || 0}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-8">
        {currentQuestion && (
          <QuestionRenderer
            question={currentQuestion}
            onAnswerSubmit={handleAnswerSubmit}
            currentIndex={currentQuestionIndex}
            totalQuestions={test.questions?.length || 0}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex space-x-4">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save & Continue Later
            </Button>
            
            {currentQuestionIndex === (test.questions?.length || 0) - 1 ? (
              <Button 
                onClick={handleCompleteTest}
                disabled={completeTestMutation.isPending}
                className="bg-secondary hover:bg-green-700"
              >
                {completeTestMutation.isPending ? "Submitting..." : "Complete Test"}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                disabled={!answers.has(currentQuestion?.id || 0)}
              >
                Next Question
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
