import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Flag,
  Trophy,
  Star
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function QuizTake() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const quizId = params.quizId;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: quiz, isLoading } = useQuery({
    queryKey: [`/api/quiz/${quizId}`],
  });

  const { data: questions } = useQuery({
    queryKey: [`/api/quiz/${quizId}/questions`],
    enabled: !!quiz,
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (answers: Record<number, string>) => {
      return apiRequest(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz'] });
      setLocation(`/quiz/${quizId}/results?attemptId=${result.attemptId}`);
    },
  });

  // Initialize timer when quiz loads
  useEffect(() => {
    if (quiz?.timeLimit && timeRemaining === null) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert to seconds
    }
  }, [quiz, timeRemaining]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          // Auto-submit when time runs out
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await submitQuizMutation.mutateAsync(selectedAnswers);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-neutral-600">No questions found for this quiz.</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Quiz
              </Button>
              <div className="ml-6">
                <h1 className="text-xl font-bold">{quiz.title}</h1>
                <p className="text-sm text-neutral-600">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timer */}
              {timeRemaining !== null && (
                <div className="flex items-center text-orange-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-mono font-bold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              
              {/* Progress */}
              <div className="text-sm text-neutral-600">
                {answeredCount}/{questions.length} answered
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    Question {currentQuestion + 1}
                  </Badge>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Trophy className="h-4 w-4 mr-1" />
                    {quiz.pointsPerQuestion} points
                  </div>
                </div>
                <CardTitle className="text-lg leading-relaxed">
                  {currentQ.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAnswers[currentQ.id] || ""}
                  onValueChange={(value) => handleAnswerSelect(currentQ.id, value)}
                  className="space-y-4"
                >
                  {currentQ.options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-neutral-50 cursor-pointer">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Mark for review functionality
                  }}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Flag for Review
                </Button>

                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {questions.map((_, index) => {
                    const isAnswered = selectedAnswers[questions[index].id];
                    const isCurrent = index === currentQuestion;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`
                          w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors
                          ${isCurrent 
                            ? 'border-primary bg-primary text-white' 
                            : isAnswered
                              ? 'border-green-300 bg-green-50 text-green-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-primary/50'
                          }
                        `}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-50 border-2 border-green-300 rounded mr-2"></div>
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded mr-2"></div>
                    <span>Not answered ({questions.length - answeredCount})</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="w-full mt-6"
                >
                  Submit Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}