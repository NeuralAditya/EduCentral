import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Trophy, Clock, Medal, History, PlayCircle, Calendar, Star, TrendingUp, User, Home, LogOut } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/components/auth-guard";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [realTimeData, setRealTimeData] = useState<any>(null);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/student-dashboard/1"],
  });

  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({
        type: 'auth',
        user: user
      }));
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'dashboard_update') {
        setRealTimeData(message.data);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWebsocket(null);
    };

    return () => {
      ws.close();
    };
  }, [user]);

  const handleTestStart = (testTitle: string) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: 'test_started',
        testTitle: testTitle
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white animate-pulse">
            <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
            <div className="h-6 bg-white/20 rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { stats, recentTests, upcomingTests, achievements } = dashboardData || { 
    stats: { testsTaken: 0, averageScore: 0, totalTimeSpent: 0, rank: 0 }, 
    recentTests: [], 
    upcomingTests: [],
    achievements: []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Home className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold text-primary">EduCentral</span>
              </Link>
              <Badge className="ml-4 bg-green-100 text-green-800 border-green-200">
                Student Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-blue-100 text-lg">Continue your learning journey with AI-powered assessments</p>
              {websocket && (
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-blue-100">Connected to live dashboard</span>
                </div>
              )}
            </div>
            <div className="rounded-lg shadow-lg w-80 h-48 bg-white/10 flex items-center justify-center">
              <div className="text-center">
                <User className="h-16 w-16 mx-auto mb-2" />
                <p className="text-lg font-semibold">Rank #{stats.rank}</p>
                <p className="text-sm text-blue-100">Keep climbing!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <ClipboardList className="text-primary h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Tests Taken</p>
                  <p className="text-2xl font-bold">{stats.testsTaken}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="text-secondary h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Average Score</p>
                  <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="text-accent h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Study Time</p>
                  <p className="text-2xl font-bold">{stats.totalTimeSpent}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Medal className="text-purple-600 h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Rank</p>
                  <p className="text-2xl font-bold">#{stats.rank}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tests & Upcoming Tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tests */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="text-primary mr-2" />
                Recent Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!recentTests?.length ? (
                <div className="text-center py-8 text-gray-600">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tests taken yet</p>
                  <p className="text-sm">Start your first test to see results here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTests.map((test: any) => (
                    <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {test.title.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{test.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(test.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-secondary">{test.score}%</p>
                        <p className="text-xs text-gray-600">{test.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tests */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="text-primary mr-2" />
                Upcoming Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!upcomingTests?.length ? (
                <div className="text-center py-8 text-gray-600">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming tests</p>
                  <p className="text-sm">Check back later for new assessments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTests.map((test: any) => (
                    <div key={test.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {test.title.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{test.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(test.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={test.difficulty === 'Hard' ? 'destructive' : test.difficulty === 'Medium' ? 'secondary' : 'outline'}>
                          {test.difficulty}
                        </Badge>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleTestStart(test.title)}
                        >
                          Start Test
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="text-primary mr-2" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!achievements?.length ? (
              <div className="text-center py-8 text-gray-600">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No achievements yet</p>
                <p className="text-sm">Complete tests to earn your first badge!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement: any) => (
                  <div key={achievement.id} className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl mr-3">{achievement.icon}</div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(achievement.earnedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/quiz-topics">
              <Button className="w-full h-16 text-lg">
                <PlayCircle className="h-6 w-6 mr-2" />
                Take Quiz
              </Button>
            </Link>
            <Link href="/learn">
              <Button variant="outline" className="w-full h-16 text-lg">
                <TrendingUp className="h-6 w-6 mr-2" />
                Learn & Practice
              </Button>
            </Link>
            <Link href="/video-chat">
              <Button variant="secondary" className="w-full h-16 text-lg">
                <User className="h-6 w-6 mr-2" />
                AI Tutor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}