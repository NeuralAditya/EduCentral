import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Trophy, 
  Zap, 
  Target, 
  Clock, 
  Star, 
  ArrowRight, 
  Award,
  TrendingUp,
  Calendar,
  Flame,
  Home
} from "lucide-react";
import type { LearningModule, UserStats } from "@shared/schema";

export default function Learn() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: modules = [], isLoading: modulesLoading } = useQuery<LearningModule[]>({
    queryKey: ["/api/learning/modules"],
  });

  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/learning/stats"],
  });

  const filteredModules = modules.filter((module: LearningModule) => 
    selectedCategory === "all" || module.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "dsa": return <Target className="h-4 w-4" />;
      case "algorithms": return <Zap className="h-4 w-4" />;
      case "data_structures": return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  if (modulesLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
          </div>
        </div>

        {/* User Stats Dashboard */}
        {userStats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total XP</p>
                    <p className="text-2xl font-bold">{userStats.totalXp}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Level</p>
                    <p className="text-2xl font-bold">{userStats.level}</p>
                  </div>
                  <Star className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Streak</p>
                    <p className="text-2xl font-bold">{userStats.streak}</p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Badges</p>
                    <p className="text-2xl font-bold">{userStats.badges?.length || 0}</p>
                  </div>
                  <Award className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Category Filter Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
              All Categories
            </TabsTrigger>
            <TabsTrigger value="dsa" onClick={() => setSelectedCategory("dsa")}>
              DSA
            </TabsTrigger>
            <TabsTrigger value="algorithms" onClick={() => setSelectedCategory("algorithms")}>
              Algorithms
            </TabsTrigger>
            <TabsTrigger value="data_structures" onClick={() => setSelectedCategory("data_structures")}>
              Data Structures
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module: LearningModule) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dsa" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module: LearningModule) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="algorithms" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module: LearningModule) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="data_structures" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module: LearningModule) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Achievements */}
        {userStats?.achievements && Array.isArray(userStats.achievements) && userStats.achievements.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userStats.achievements.map((achievement: string, index: number) => (
                  <Badge key={index} variant="secondary" className="capitalize">
                    {achievement.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ModuleCard({ module }: { module: LearningModule }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "dsa": return <Target className="h-4 w-4" />;
      case "algorithms": return <Zap className="h-4 w-4" />;
      case "data_structures": return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(module.category)}
            <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
              {module.difficulty}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {module.estimatedTime}m
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {module.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-1" />
            {module.totalLessons} lessons
          </div>
          <div className="flex items-center text-amber-600">
            <Trophy className="h-4 w-4 mr-1" />
            {module.xpReward} XP
          </div>
        </div>

        <Progress value={0} className="h-2" />
        
        <Link href={`/learn/module/${module.id}`}>
          <Button className="w-full group">
            Start Learning
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}