import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Play,
  Clock,
  Trophy,
  Star,
  Lock,
  CheckCircle,
  Target
} from "lucide-react";

const levelInfo = {
  beginner: {
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200", 
    description: "Perfect for getting started with the basics"
  },
  intermediate: {
    color: "text-orange-600", 
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "Build on your foundation with more challenging concepts"
  },
  advanced: {
    color: "text-red-600",
    bgColor: "bg-red-50", 
    borderColor: "border-red-200",
    description: "Master complex topics and advanced techniques"
  }
};

export default function TopicLevels() {
  const params = useParams();
  const topicId = params.topicId;

  const { data: topic, isLoading: topicLoading } = useQuery({
    queryKey: [`/api/quiz/topics/${topicId}`],
  });

  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: [`/api/quiz/topics/${topicId}/quizzes`],
  });

  const { data: progress } = useQuery({
    queryKey: [`/api/quiz/topics/${topicId}/progress`],
  });

  if (topicLoading || quizzesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  const groupedQuizzes = quizzes?.reduce((acc: any, quiz: any) => {
    if (!acc[quiz.level]) acc[quiz.level] = [];
    acc[quiz.level].push(quiz);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/quiz/topics">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Button>
          </Link>
          
          <div className="flex items-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">{topic?.name} Quizzes</h1>
          </div>
          <p className="text-xl text-blue-100">{topic?.description}</p>
          
          {/* Progress Overview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">8/15</div>
              <div className="text-sm text-blue-100">Quizzes Completed</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">650</div>
              <div className="text-sm text-blue-100">Points Earned</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">85%</div>
              <div className="text-sm text-blue-100">Average Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Difficulty Levels */}
        {Object.entries(groupedQuizzes || {}).map(([level, levelQuizzes]: [string, any]) => {
          const info = levelInfo[level as keyof typeof levelInfo];
          const isLocked = level === 'advanced' && (!progress?.intermediateCompleted);
          
          return (
            <div key={level} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${info.bgColor} mr-4`}>
                    {isLocked ? (
                      <Lock className={`h-6 w-6 ${info.color}`} />
                    ) : (
                      <Target className={`h-6 w-6 ${info.color}`} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold capitalize">{level}</h2>
                    <p className="text-neutral-600">{info.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`${info.color} ${info.borderColor}`}>
                  {levelQuizzes.length} quizzes
                </Badge>
              </div>

              {isLocked ? (
                <Card className="opacity-60">
                  <CardContent className="p-8 text-center">
                    <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Level Locked</h3>
                    <p className="text-gray-500">
                      Complete all intermediate quizzes to unlock advanced level
                    </p>
                    <div className="mt-4">
                      <Progress value={75} className="w-full max-w-xs mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">3/4 intermediate quizzes completed</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {levelQuizzes.map((quiz: any, index: number) => {
                    const isCompleted = Math.random() > 0.5; // Mock completion status
                    const score = isCompleted ? Math.floor(Math.random() * 30) + 70 : null;
                    
                    return (
                      <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                            {isCompleted && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-neutral-600">{quiz.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Quiz Stats */}
                            <div className="flex items-center justify-between text-sm text-neutral-600">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{quiz.timeLimit} min</span>
                              </div>
                              <div className="flex items-center">
                                <Target className="h-4 w-4 mr-1" />
                                <span>{quiz.totalQuestions} questions</span>
                              </div>
                              <div className="flex items-center">
                                <Trophy className="h-4 w-4 mr-1" />
                                <span>{quiz.pointsPerQuestion * quiz.totalQuestions} pts</span>
                              </div>
                            </div>

                            {/* Score Display */}
                            {isCompleted && (
                              <div className={`p-3 rounded-lg ${info.bgColor} ${info.borderColor} border`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Best Score</span>
                                  <span className={`font-bold ${info.color}`}>{score}%</span>
                                </div>
                                <Progress value={score} className="mt-2 h-2" />
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button asChild className="flex-1">
                                <Link href={`/quiz/${quiz.id}`}>
                                  <Play className="h-4 w-4 mr-2" />
                                  {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                                </Link>
                              </Button>
                              {isCompleted && (
                                <Button variant="outline" asChild>
                                  <Link href={`/quiz/${quiz.id}/results`}>
                                    View Results
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}