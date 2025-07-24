import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Code2, 
  Database, 
  Brain, 
  Trophy, 
  Star, 
  Clock,
  Target,
  ArrowRight
} from "lucide-react";

const topicIcons = {
  DSA: Database,
  Java: Code2,
  Python: Brain,
};

const topicColors = {
  DSA: "bg-blue-500",
  Java: "bg-orange-500", 
  Python: "bg-green-500",
};

export default function QuizTopics() {
  const { data: topics, isLoading } = useQuery({
    queryKey: ['/api/quiz/topics'],
  });

  const { data: userProgress } = useQuery({
    queryKey: ['/api/quiz/user-progress'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading quiz topics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Quiz Challenge</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Test your programming knowledge across different topics and difficulty levels. 
            Earn points, unlock badges, and climb the leaderboard!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-neutral-600">Quizzes Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">1,250</div>
              <div className="text-sm text-neutral-600">Total Points</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-neutral-600">Badges Earned</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">#15</div>
              <div className="text-sm text-neutral-600">Global Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topics?.map((topic: any) => {
            const IconComponent = topicIcons[topic.name as keyof typeof topicIcons] || Code2;
            const colorClass = topicColors[topic.name as keyof typeof topicColors] || "bg-gray-500";
            
            return (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full ${colorClass} text-white mr-4`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{topic.name}</CardTitle>
                        <p className="text-sm text-neutral-600 mt-1">{topic.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>

                  {/* Difficulty Levels */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-green-700 border-green-300 mr-3">
                          Beginner
                        </Badge>
                        <span className="text-sm">5/5 completed</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <Trophy className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">250 pts</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-orange-700 border-orange-300 mr-3">
                          Intermediate
                        </Badge>
                        <span className="text-sm">3/5 completed</span>
                      </div>
                      <div className="flex items-center text-orange-600">
                        <Trophy className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">180 pts</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-gray-700 border-gray-300 mr-3">
                          Advanced
                        </Badge>
                        <span className="text-sm text-gray-500">Locked</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Trophy className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">500 pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button asChild className="w-full">
                    <Link href={`/quiz/topic/${topic.id}`}>
                      <span>Continue Learning</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Achievements */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-medium">First Steps</div>
                  <div className="text-sm text-neutral-600">Complete your first quiz</div>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-medium">Quick Learner</div>
                  <div className="text-sm text-neutral-600">Score 90%+ on 3 quizzes</div>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-medium">Consistent</div>
                  <div className="text-sm text-neutral-600">Complete quizzes 5 days in a row</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}