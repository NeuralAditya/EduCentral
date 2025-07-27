import { useState, useEffect } from "react";
import { Link } from "wouter";
import AuthGuard, { useAuth } from "@/components/auth-guard";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  BarChart3,
  Settings,
  FileText,
  Video,
  MessageSquare
} from "lucide-react";

// Mock data for admin dashboard
const mockStats = {
  totalUsers: 1247,
  activeTests: 23,
  completedAssessments: 892,
  avgScore: 78.5
};

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", score: 85, testsCompleted: 12, status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", score: 92, testsCompleted: 15, status: "active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", score: 76, testsCompleted: 8, status: "inactive" },
];

const mockTests = [
  { id: 1, title: "JavaScript Fundamentals", type: "AI Assessment", students: 45, avgScore: 82, status: "published" },
  { id: 2, title: "React Components", type: "Quiz", students: 32, avgScore: 78, status: "published" },
  { id: 3, title: "Python Basics", type: "Video Response", students: 28, avgScore: 85, status: "draft" },
];

function AdminContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [liveData, setLiveData] = useState<any>(null);
  const { user, logout } = useAuth();

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard-stats"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Admin WebSocket connected');
      ws.send(JSON.stringify({
        type: 'auth',
        user: user
      }));
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'dashboard_update') {
        setLiveData(message.data);
      }
    };

    ws.onclose = () => {
      console.log('Admin WebSocket disconnected');
      setWebsocket(null);
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <GraduationCap className="h-8 w-8 text-primary mr-3" />
                <span className="text-2xl font-bold text-gray-900">EduCentral</span>
              </Link>
              <Badge className="ml-4 bg-orange-100 text-orange-800 border-orange-200">
                Admin Panel
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button size="sm" onClick={logout}>
                <Settings className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, tests, and monitor platform performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Live Users</p>
                  <p className="text-2xl font-bold text-gray-900">{liveData?.totalUsers || dashboardStats?.liveUsers || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">
                  {websocket && <span className="animate-pulse">● </span>}
                  Currently online
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tests Today</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats?.testsCompletedToday || 24}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">↗ +3 new this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assessments</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.completedAssessments}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">↗ +25 today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.avgScore}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">↗ +2.3% improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tests
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">User Management</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tests</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant={user.score >= 80 ? "default" : "secondary"}>
                              {user.score}%
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.testsCompleted}</td>
                          <td className="py-3 px-4">
                            <Badge variant={user.status === "active" ? "default" : "secondary"}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Test Management</CardTitle>
                  <div className="flex items-center space-x-4">
                    <Link href="/create-test">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Test
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockTests.map((test) => (
                    <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{test.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              {test.type === "AI Assessment" && <Brain className="h-4 w-4 mr-1" />}
                              {test.type === "Quiz" && <BookOpen className="h-4 w-4 mr-1" />}
                              {test.type === "Video Response" && <Video className="h-4 w-4 mr-1" />}
                              {test.type}
                            </span>
                            <span>{test.students} students</span>
                            <span>Avg: {test.avgScore}%</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={test.status === "published" ? "default" : "secondary"}>
                            {test.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Daily Active Users</span>
                      <span className="font-semibold">342</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tests Completed Today</span>
                      <span className="font-semibold">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Session Time</span>
                      <span className="font-semibold">24 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-semibold text-green-600">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">New user registration: john@example.com</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Test completed: JavaScript Fundamentals</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">New quiz created: React Hooks</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600">High score achieved: 95% on Python Basics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Learning Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium">Data Structures & Algorithms</span>
                      <Badge>12 lessons</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium">JavaScript Fundamentals</span>
                      <Badge>8 lessons</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium">Python Programming</span>
                      <Badge>15 lessons</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quiz Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium">DSA Challenges</span>
                      <Badge>25 quizzes</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium">Java Concepts</span>
                      <Badge>18 quizzes</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium">Python Basics</span>
                      <Badge>22 quizzes</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2025 EduCentral Admin Panel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AuthGuard requireAdmin={true}>
      <AdminContent />
    </AuthGuard>
  );
}