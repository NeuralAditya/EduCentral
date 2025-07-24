import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Trophy, Clock, Medal, History, PlayCircle } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/1"], // Using user ID 1 for demo
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white animate-pulse">
          <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
          <div className="h-6 bg-white/20 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-material animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { stats, recentAttempts, availableTests } = dashboardData || { stats: null, recentAttempts: [], availableTests: [] };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2">Welcome to EduCentral</h2>
            <p className="text-blue-100 text-lg">AI-powered mock tests with video and photo assessment</p>
          </div>
          <div className="rounded-lg shadow-lg w-80 h-48 bg-white/10 flex items-center justify-center">
            <div className="text-center">
              <ClipboardList className="h-16 w-16 mx-auto mb-2" />
              <p>Digital Learning Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-material">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <ClipboardList className="text-primary h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-neutral-600 text-sm">Tests Taken</p>
                <p className="text-2xl font-bold">{stats?.testsTaken || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-material">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Trophy className="text-secondary h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-neutral-600 text-sm">Average Score</p>
                <p className="text-2xl font-bold">{stats?.avgScore || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-material">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="text-accent h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-neutral-600 text-sm">Study Time</p>
                <p className="text-2xl font-bold">{stats?.totalStudyTime || 0}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-material">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Medal className="text-purple-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-neutral-600 text-sm">Rank</p>
                <p className="text-2xl font-bold">#{stats?.rank || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tests & Available Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tests */}
        <Card className="shadow-material">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <History className="text-primary mr-2" />
              Recent Tests
            </h3>
            
            {!recentAttempts?.length ? (
              <div className="text-center py-8 text-neutral-600">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tests taken yet</p>
                <p className="text-sm">Start your first test to see results here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAttempts.map((attempt: any) => (
                  <div key={attempt.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {attempt.test?.title?.charAt(0) || 'T'}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{attempt.test?.title || 'Test'}</p>
                        <p className="text-sm text-neutral-600">
                          {new Date(attempt.startedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-secondary">
                        {attempt.totalScore && attempt.maxScore 
                          ? Math.round((attempt.totalScore / attempt.maxScore) * 100) + '%'
                          : 'In Progress'
                        }
                      </p>
                      <p className="text-xs text-neutral-600">
                        {attempt.status === 'completed' ? 'Completed' : 'In Progress'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Tests */}
        <Card className="shadow-material">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <PlayCircle className="text-accent mr-2" />
              Available Tests
            </h3>
            
            {!availableTests?.length ? (
              <div className="text-center py-8 text-neutral-600">
                <PlayCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tests available</p>
                <p className="text-sm">Check back later for new tests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableTests.map((test: any) => (
                  <div 
                    key={test.id} 
                    className="border-2 border-dashed border-primary/30 rounded-lg p-4 hover:border-primary/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-primary">{test.title}</h4>
                        <p className="text-sm text-neutral-600">
                          {test.duration} minutes • {test.difficulty}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-neutral-600">AI Assessment Available</span>
                        </div>
                      </div>
                      <Link href={`/take-test/${test.id}`}>
                        <Button className="bg-primary hover:bg-blue-700">
                          Start Test
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
