import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy,
  Star,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Award,
  TrendingUp
} from "lucide-react";

export default function QuizResults() {
  const params = useParams();
  const quizId = params.quizId;
  const attemptId = new URLSearchParams(window.location.search).get('attemptId');

  const { data: attempt, isLoading } = useQuery({
    queryKey: [`/api/quiz/attempts/${attemptId}`],
    enabled: !!attemptId,
  });

  const { data: quiz } = useQuery({
    queryKey: [`/api/quiz/${quizId}`],
    enabled: !!quizId,
  });

  const { data: leaderboard } = useQuery({
    queryKey: [`/api/quiz/${quizId}/leaderboard`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-neutral-600">Results not found.</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);
  const isPassed = percentage >= (quiz?.passingScore || 70);
  const totalPoints = attempt.correctAnswers * (quiz?.pointsPerQuestion || 10);

  const getBadgeInfo = () => {
    if (percentage >= 95) return { name: "Perfect Score", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: Trophy };
    if (percentage >= 90) return { name: "Excellent", color: "text-purple-600", bgColor: "bg-purple-50", icon: Star };
    if (percentage >= 80) return { name: "Great Job", color: "text-blue-600", bgColor: "bg-blue-50", icon: Award };
    if (percentage >= 70) return { name: "Well Done", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle };
    return { name: "Keep Trying", color: "text-gray-600", bgColor: "bg-gray-50", icon: Target };
  };

  const badge = getBadgeInfo();
  const BadgeIcon = badge.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Results Header */}
      <div className={`py-16 ${isPassed ? 'bg-gradient-to-r from-green-500 to-blue-600' : 'bg-gradient-to-r from-orange-500 to-red-600'} text-white`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6">
            {isPassed ? (
              <Trophy className="h-16 w-16 mx-auto mb-4" />
            ) : (
              <Target className="h-16 w-16 mx-auto mb-4" />
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {isPassed ? "Congratulations!" : "Good Effort!"}
            </h1>
            <p className="text-xl opacity-90">
              {isPassed 
                ? `You passed ${quiz?.title} with flying colors!`
                : `You can retake ${quiz?.title} to improve your score.`
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold">{percentage}%</div>
              <div className="text-sm opacity-90">Final Score</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold">{attempt.correctAnswers}/{attempt.totalQuestions}</div>
              <div className="text-sm opacity-90">Correct Answers</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold">{totalPoints}</div>
              <div className="text-sm opacity-90">Points Earned</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold">{Math.floor(attempt.timeSpent / 60)}m</div>
              <div className="text-sm opacity-90">Time Taken</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Badge */}
            <Card>
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center px-6 py-4 rounded-full ${badge.bgColor} ${badge.color} mb-4`}>
                  <BadgeIcon className="h-6 w-6 mr-2" />
                  <span className="font-bold text-lg">{badge.name}</span>
                </div>
                <Progress value={percentage} className="w-full max-w-md mx-auto h-3" />
                <p className="text-sm text-neutral-600 mt-4">
                  {isPassed 
                    ? `You exceeded the passing score of ${quiz?.passingScore || 70}%!`
                    : `You need ${(quiz?.passingScore || 70)}% to pass. You can retake this quiz anytime.`
                  }
                </p>
              </CardContent>
            </Card>

            {/* Question Review */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Question Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attempt.answers?.map((answer: any, index: number) => (
                    <div key={index} className="flex items-start justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="font-medium mr-2">Q{index + 1}:</span>
                          {answer.isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-neutral-700 mb-2">{answer.question}</p>
                        
                        <div className="space-y-1 text-sm">
                          <div className={`${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            Your answer: {answer.userAnswer}
                          </div>
                          {!answer.isCorrect && (
                            <div className="text-green-600">
                              Correct answer: {answer.correctAnswer}
                            </div>
                          )}
                          {answer.explanation && (
                            <div className="text-neutral-600 bg-blue-50 p-2 rounded mt-2">
                              <strong>Explanation:</strong> {answer.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={answer.isCorrect ? "default" : "destructive"} className="ml-4">
                        {answer.isCorrect ? '+' + (quiz?.pointsPerQuestion || 10) : '0'} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href={`/quiz/${quizId}`}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake Quiz
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/quiz/topics">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Topics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Personal Best */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Best Score</span>
                    <span className="font-bold">{Math.max(percentage, 85)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Attempts</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Total Points</span>
                    <span className="font-bold">250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Rank</span>
                    <span className="font-bold">#12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-2 bg-yellow-50 rounded-lg">
                    <Trophy className="h-6 w-6 text-yellow-600 mr-3" />
                    <div>
                      <div className="font-medium text-sm">First Quiz</div>
                      <div className="text-xs text-neutral-600">Complete your first quiz</div>
                    </div>
                  </div>
                  {isPassed && percentage >= 90 && (
                    <div className="flex items-center p-2 bg-purple-50 rounded-lg border border-purple-200">
                      <Star className="h-6 w-6 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-sm">High Scorer</div>
                        <div className="text-xs text-neutral-600">Score 90% or higher</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}