import { useState } from "react";
import { Link, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Star, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Lock,
  Play,
  Home,
  Target,
  Zap,
  Brain
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { ModuleWithLessons, LessonWithProgress, UserProgress } from "@shared/schema";

export default function Module() {
  const [match, params] = useRoute("/learn/module/:id");
  const moduleId = params?.id ? parseInt(params.id) : 0;
  const queryClient = useQueryClient();

  const { data: module, isLoading: moduleLoading } = useQuery<ModuleWithLessons>({
    queryKey: ["/api/learning/modules", moduleId],
    enabled: !!moduleId,
  });

  const { data: progress = [], isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ["/api/learning/progress", 1, moduleId], // Using user ID 1 for demo
    enabled: !!moduleId,
  });

  const completeLessonMutation = useMutation({
    mutationFn: (lessonData: { userId: number; moduleId: number; lessonId: number; isCompleted: boolean; timeSpent: number }) =>
      apiRequest("/api/learning/progress", {
        method: "POST",
        body: JSON.stringify(lessonData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning/progress", 1, moduleId] });
      queryClient.invalidateQueries({ queryKey: ["/api/learning/stats"] });
    },
  });

  const handleCompleteLesson = (lessonId: number, timeSpent: number = 300) => {
    completeLessonMutation.mutate({
      userId: 1, // Demo user ID
      moduleId,
      lessonId,
      isCompleted: true,
      timeSpent,
    });
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress.some(p => p.lessonId === lessonId && p.isCompleted);
  };

  const isLessonUnlocked = (lesson: any, index: number) => {
    if (index === 0) return true; // First lesson is always unlocked
    
    if (lesson.unlockCondition?.prerequisite) {
      return isLessonCompleted(lesson.unlockCondition.prerequisite);
    }
    
    return isLessonCompleted(module?.lessons[index - 1]?.id || 0);
  };

  const getCompletedLessonsCount = () => {
    return progress.filter(p => p.isCompleted).length;
  };

  const getProgressPercentage = () => {
    if (!module?.totalLessons) return 0;
    return Math.round((getCompletedLessonsCount() / module.totalLessons) * 100);
  };

  const getLessonIcon = (lessonType: string) => {
    switch (lessonType) {
      case "theory": return <BookOpen className="h-4 w-4" />;
      case "practice": return <Target className="h-4 w-4" />;
      case "challenge": return <Zap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getLessonTypeColor = (lessonType: string) => {
    switch (lessonType) {
      case "theory": return "bg-blue-100 text-blue-800";
      case "practice": return "bg-green-100 text-green-800";
      case "challenge": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (moduleLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <Link href="/learn">
            <Button>Back to Learning Hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/learn">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Learning
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Module Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {module.category.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {module.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{module.title}</CardTitle>
                <p className="text-muted-foreground">{module.description}</p>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {module.estimatedTime}m
                </div>
                <div className="flex items-center text-amber-600">
                  <Trophy className="h-4 w-4 mr-1" />
                  {module.xpReward} XP
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {getCompletedLessonsCount()} of {module.totalLessons} lessons completed
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <div className="space-y-4">
          {module.lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            const unlocked = isLessonUnlocked(lesson, index);
            
            return (
              <Card 
                key={lesson.id} 
                className={`transition-all duration-200 ${
                  completed 
                    ? "border-green-200 bg-green-50" 
                    : unlocked 
                    ? "hover:shadow-md border-blue-200" 
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border-2">
                        {completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : unlocked ? (
                          getLessonIcon(lesson.lessonType)
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!unlocked ? "text-gray-400" : ""}`}>
                            {lesson.title}
                          </h3>
                          <Badge variant="outline" className={getLessonTypeColor(lesson.lessonType)}>
                            {lesson.lessonType}
                          </Badge>
                        </div>
                        <p className={`text-sm ${!unlocked ? "text-gray-400" : "text-muted-foreground"}`}>
                          {lesson.content.slice(0, 100)}...
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center text-amber-600 text-sm">
                          <Star className="h-4 w-4 mr-1" />
                          {lesson.xpReward} XP
                        </div>
                      </div>
                      
                      {completed ? (
                        <Button variant="outline" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      ) : unlocked ? (
                        <Button 
                          onClick={() => handleCompleteLesson(lesson.id)}
                          disabled={completeLessonMutation.isPending}
                        >
                          {completeLessonMutation.isPending ? (
                            "Completing..."
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Start Lesson
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          <Lock className="h-4 w-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Module Completion */}
        {getCompletedLessonsCount() === module.totalLessons && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Congratulations! Module Completed!
              </h3>
              <p className="text-green-700 mb-4">
                You've successfully completed all lessons in {module.title}
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span className="font-semibold">+{module.xpReward} XP Earned</span>
              </div>
              <Link href="/learn">
                <Button>
                  Continue Learning
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}