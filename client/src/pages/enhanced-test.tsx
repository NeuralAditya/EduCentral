import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, Video, Clock, CheckCircle, ArrowRight, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { EnhancedTestInterface } from "@/components/ui/enhanced-test-interface";

interface EnhancedAssessmentResult {
  overall_score: number;
  content_analysis: {
    content_score: number;
    accuracy: number;
    completeness: number;
    relevance: number;
    feedback: string;
    suggestions: string[];
  };
  emotion_analysis: {
    emotion: string;
    confidence: number;
    facial_score: number;
  };
  speech_analysis: {
    transcript: string;
    sentiment: string;
    tone_analysis: {
      tone: string;
      confidence: number;
    };
    speech_quality: {
      clarity: number;
      pace: string;
      volume: string;
    };
  };
  assessment_timestamp: string;
  feedback: string;
}

export default function EnhancedTest() {
  const [, params] = useRoute("/enhanced-test/:testId");
  const testId = params?.testId;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAttemptId, setCurrentAttemptId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Map<number, any>>(new Map());
  const [assessmentResults, setAssessmentResults] = useState<Map<number, EnhancedAssessmentResult>>(new Map());
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [overallResults, setOverallResults] = useState<any>(null);
  
  const { toast } = useToast();

  const { data: test, isLoading } = useQuery({
    queryKey: ["/api/tests", testId],
    enabled: !!testId,
  });

  const startAttemptMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/attempts", {
        testId: parseInt(testId!),
        userId: 2, // Using demo user ID
      });
      return response.json();
    },
    onSuccess: (attempt) => {
      setCurrentAttemptId(attempt.id);
      setIsTestStarted(true);
      toast({
        title: "Enhanced AI Assessment Started",
        description: "Your responses will be analyzed using advanced AI technology.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start enhanced test. Please try again.",
        variant: "destructive",
      });
    },
  });

  const analyzeResponseMutation = useMutation({
    mutationFn: async ({ answer, questionId, question }: any) => {
      const formData = new FormData();
      
      if (answer.videoBlob) {
        formData.append('video', answer.videoBlob, 'response.webm');
      }
      
      formData.append('questionId', questionId.toString());
      formData.append('transcript', answer.speechAnalysis?.transcript || '');
      formData.append('emotionData', JSON.stringify(answer.emotionAnalysis));
      formData.append('facialData', JSON.stringify(answer.facialData));
      formData.append('duration', answer.timeSpent?.toString() || '60');
      formData.append('question', question.question);

      const response = await fetch("/api/enhanced-assessment/analyze-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze response");
      }

      return response.json();
    },
    onSuccess: (result, variables) => {
      const newResults = new Map(assessmentResults);
      newResults.set(variables.questionId, result);
      setAssessmentResults(newResults);

      toast({
        title: "Response Analyzed",
        description: `Score: ${result.overall_score}/100 - AI analysis complete!`,
      });
    },
    onError: () => {
      toast({
        title: "Analysis Error",
        description: "Failed to analyze your response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const completeTestMutation = useMutation({
    mutationFn: async () => {
      if (!currentAttemptId) throw new Error("No active attempt");

      // Calculate overall scores from all assessments
      const allResults = Array.from(assessmentResults.values());
      const avgScore = allResults.reduce((sum, result) => sum + result.overall_score, 0) / allResults.length;
      
      const response = await apiRequest("PATCH", `/api/attempts/${currentAttemptId}`, {
        status: "completed",
        completedAt: new Date().toISOString(),
        totalScore: Math.round(avgScore),
        maxScore: 100,
      });

      return response.json();
    },
    onSuccess: () => {
      setIsTestCompleted(true);
      generateOverallResults();
      toast({
        title: "Test Completed",
        description: "Your enhanced AI assessment is complete!",
      });
    },
  });

  const generateOverallResults = () => {
    const allResults = Array.from(assessmentResults.values());
    
    if (allResults.length === 0) return;

    const avgContentScore = allResults.reduce((sum, r) => sum + r.content_analysis.content_score, 0) / allResults.length;
    const avgEmotionConfidence = allResults.reduce((sum, r) => sum + r.emotion_analysis.facial_score, 0) / allResults.length;
    const avgSpeechClarity = allResults.reduce((sum, r) => sum + (r.speech_analysis.speech_quality.clarity * 100), 0) / allResults.length;
    
    const dominantEmotion = getMostCommonEmotion(allResults);
    const avgTone = getMostCommonTone(allResults);
    
    setOverallResults({
      overall_score: Math.round((avgContentScore + avgEmotionConfidence + avgSpeechClarity) / 3),
      content_performance: Math.round(avgContentScore),
      delivery_performance: Math.round(avgSpeechClarity),
      confidence_level: Math.round(avgEmotionConfidence),
      dominant_emotion: dominantEmotion,
      speaking_tone: avgTone,
      total_questions: allResults.length,
      strengths: extractStrengths(allResults),
      improvements: extractImprovements(allResults),
    });
  };

  const getMostCommonEmotion = (results: EnhancedAssessmentResult[]) => {
    const emotions = results.map(r => r.emotion_analysis.emotion);
    return emotions.sort((a, b) =>
      emotions.filter(v => v === a).length - emotions.filter(v => v === b).length
    ).pop() || 'neutral';
  };

  const getMostCommonTone = (results: EnhancedAssessmentResult[]) => {
    const tones = results.map(r => r.speech_analysis.tone_analysis.tone);
    return tones.sort((a, b) =>
      tones.filter(v => v === a).length - tones.filter(v => v === b).length
    ).pop() || 'neutral';
  };

  const extractStrengths = (results: EnhancedAssessmentResult[]) => {
    const strengths = [];
    const avgClarity = results.reduce((sum, r) => sum + r.speech_analysis.speech_quality.clarity, 0) / results.length;
    const avgConfidence = results.reduce((sum, r) => sum + r.emotion_analysis.confidence, 0) / results.length;
    const avgContent = results.reduce((sum, r) => sum + r.content_analysis.content_score, 0) / results.length;

    if (avgClarity > 0.8) strengths.push("Excellent speech clarity and articulation");
    if (avgConfidence > 0.8) strengths.push("High confidence and composure");
    if (avgContent > 80) strengths.push("Strong technical knowledge and understanding");
    
    return strengths.length > 0 ? strengths : ["Good effort in completing the assessment"];
  };

  const extractImprovements = (results: EnhancedAssessmentResult[]) => {
    const improvements = [];
    const avgClarity = results.reduce((sum, r) => sum + r.speech_analysis.speech_quality.clarity, 0) / results.length;
    const avgContent = results.reduce((sum, r) => sum + r.content_analysis.content_score, 0) / results.length;

    if (avgClarity < 0.7) improvements.push("Focus on clearer speech delivery and pronunciation");
    if (avgContent < 70) improvements.push("Strengthen technical knowledge with more study");
    improvements.push("Practice with more examples and use cases");
    
    return improvements;
  };

  const handleAnswerSubmit = async (answer: any) => {
    if (!test || !currentAttemptId) return;

    const currentQuestion = test.questions[currentQuestionIndex];
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, answer);
    setAnswers(newAnswers);

    // Analyze the response using AI
    await analyzeResponseMutation.mutateAsync({
      answer,
      questionId: currentQuestion.id,
      question: currentQuestion,
    });
  };

  const handleNextQuestion = () => {
    if (!test) return;

    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete the test
      completeTestMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Enhanced AI Assessment...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Not Found</h2>
        <p className="text-gray-600">The requested test could not be found.</p>
      </div>
    );
  }

  if (isTestCompleted && overallResults) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <BarChart3 className="h-8 w-8 text-green-600" />
              Enhanced AI Assessment Complete
            </CardTitle>
            <p className="text-muted-foreground">
              Advanced analysis of your performance across multiple dimensions
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold mb-4">
                {overallResults.overall_score}
              </div>
              <h3 className="text-xl font-semibold">Overall Performance Score</h3>
            </div>

            {/* Performance Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{overallResults.content_performance}%</div>
                    <p className="text-sm text-muted-foreground">Content Quality</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{overallResults.delivery_performance}%</div>
                    <p className="text-sm text-muted-foreground">Speech Delivery</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{overallResults.confidence_level}%</div>
                    <p className="text-sm text-muted-foreground">Confidence Level</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Strengths Identified</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {overallResults.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-700">Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {overallResults.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Emotional & Behavioral Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Dominant Emotion</p>
                    <p className="font-semibold capitalize">{overallResults.dominant_emotion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Speaking Tone</p>
                    <p className="font-semibold capitalize">{overallResults.speaking_tone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-6">
              <Button onClick={() => window.location.href = "/dashboard"} size="lg">
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Brain className="h-8 w-8 text-blue-600" />
              Enhanced AI Assessment
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {test.title}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 justify-center">
                  <Video className="h-4 w-4 text-blue-600" />
                  <span>Video Analysis</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span>AI Assessment</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>Real-time Feedback</span>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-blue-800 mb-2">What makes this assessment special:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Real-time facial expression and emotion analysis</li>
                  <li>• Speech-to-text conversion with tone assessment</li>
                  <li>• AI-powered content evaluation and feedback</li>
                  <li>• Comprehensive performance scoring</li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>Questions: {test.questions?.length || 0}</span>
                <span>•</span>
                <span>Duration: {test.duration} minutes</span>
                <span>•</span>
                <span>Total Points: {test.totalPoints || 100}</span>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => startAttemptMutation.mutate()}
                disabled={startAttemptMutation.isPending}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {startAttemptMutation.isPending ? "Starting..." : "Begin Enhanced Assessment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Progress Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold">Enhanced AI Assessment</h1>
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Enhanced Test Interface */}
      <EnhancedTestInterface
        question={currentQuestion}
        onAnswer={handleAnswerSubmit}
        onNext={handleNextQuestion}
      />
    </div>
  );
}