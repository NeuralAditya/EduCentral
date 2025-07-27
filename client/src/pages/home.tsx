import { Link } from "wouter";
import { useAuth } from "@/components/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  Brain, 
  Trophy, 
  Zap, 
  Target, 
  Users, 
  TrendingUp,
  Play,
  CheckCircle,
  Star,
  ArrowRight,
  User,
  LogIn,
  Code,
  Cpu,
  Lightbulb,
  Rocket,
  Monitor
} from "lucide-react";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary mr-3" />
              <span className="text-2xl font-bold text-gray-900">EduCentral</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-600/10">
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 animate-bounce delay-1000">
            <div className="w-12 h-12 bg-blue-200 rounded-full opacity-60 flex items-center justify-center">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="absolute top-32 right-20 animate-bounce delay-2000">
            <div className="w-10 h-10 bg-green-200 rounded-full opacity-60 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="absolute bottom-40 left-20 animate-bounce delay-3000">
            <div className="w-14 h-14 bg-purple-200 rounded-full opacity-60 flex items-center justify-center">
              <Brain className="h-7 w-7 text-purple-600" />
            </div>
          </div>
          <div className="absolute top-40 right-40 animate-pulse">
            <div className="w-8 h-8 bg-orange-200 rounded-full opacity-60 flex items-center justify-center">
              <Zap className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          
          {/* Floating Books */}
          <div className="absolute top-24 left-1/4 animate-float">
            <div className="w-16 h-12 bg-gradient-to-r from-red-400 to-red-500 rounded-sm shadow-lg transform rotate-12 opacity-70">
              <div className="w-full h-2 bg-red-600 rounded-t-sm"></div>
            </div>
          </div>
          <div className="absolute bottom-32 right-1/4 animate-float delay-1000">
            <div className="w-14 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-sm shadow-lg transform -rotate-12 opacity-70">
              <div className="w-full h-2 bg-blue-600 rounded-t-sm"></div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 animate-pulse">
              <Rocket className="h-4 w-4 mr-2" />
              Next-Generation Learning Platform
            </Badge>
            
            {/* AI Robot Character */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl shadow-2xl animate-bounce-slow flex items-center justify-center">
                  {/* Robot Face */}
                  <div className="relative">
                    {/* Eyes */}
                    <div className="flex space-x-3 mb-2">
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse">
                        <div className="w-2 h-2 bg-blue-600 rounded-full m-1"></div>
                      </div>
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-500">
                        <div className="w-2 h-2 bg-blue-600 rounded-full m-1"></div>
                      </div>
                    </div>
                    {/* Mouth */}
                    <div className="w-8 h-2 bg-white rounded-full opacity-80"></div>
                  </div>
                </div>
                {/* Robot Antenna */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                </div>
                {/* Speech Bubble */}
                <div className="absolute -right-20 top-4 bg-white rounded-lg p-2 shadow-lg animate-fade-in-out">
                  <div className="text-xs text-gray-700 whitespace-nowrap">Let's learn together!</div>
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white"></div>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
              Master Programming
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent block animate-gradient">
                Through AI & Gamification
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-300">
              Experience the future of education with personalized AI tutoring, interactive assessments, 
              and gamified learning that adapts to your pace and style.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up delay-500">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-glow">
                  <Play className="h-5 w-5 mr-2 animate-spin-slow" />
                  Try Mock Tests
                </Button>
              </Link>
              <Link href="/learn">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Start Learning
                </Button>
              </Link>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Gamified Learning */}
              <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:-translate-y-4 animate-fade-in-up delay-700">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-pulse-ring">
                    <BookOpen className="h-8 w-8 text-white group-hover:animate-bounce" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">Gamified Learning</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Interactive lessons with XP points, badges, and streaks. Master DSA, algorithms, and programming concepts.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>XP & Level System</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Achievement Badges</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Learning Streaks</span>
                    </div>
                  </div>
                  <Link href="/learn">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold">
                      Start Learning
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* AI Assessment */}
              <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:-translate-y-4 animate-fade-in-up delay-900">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-pulse-ring">
                    <Brain className="h-8 w-8 text-white group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">AI-Powered Assessment</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Advanced AI evaluates your video responses, coding solutions, and provides detailed feedback.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Video Analysis</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Facial Recognition</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Instant Feedback</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/dashboard" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-semibold">
                        Mock Tests
                      </Button>
                    </Link>
                    <Link href="/quiz/topics" className="flex-1">
                      <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg">
                        Quizzes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* 1:1 AI Tutoring */}
              <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:-translate-y-4 animate-fade-in-up delay-1100">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-pulse-ring">
                    <Users className="h-8 w-8 text-white group-hover:animate-wiggle" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">1:1 AI Tutoring</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Interactive video sessions with AI tutors for personalized guidance and real-time Q&A support.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                      <span>Live Video Chat</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                      <span>AI Tutor Response</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                      <span>24/7 Availability</span>
                    </div>
                  </div>
                  <Link href="/video-chat">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-semibold">
                      Start Tutoring
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white relative overflow-hidden">
        {/* Background Tech Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 animate-spin-slow">
            <Cpu className="h-20 w-20 text-gray-400" />
          </div>
          <div className="absolute bottom-10 right-10 animate-pulse">
            <Monitor className="h-24 w-24 text-gray-400" />
          </div>
          <div className="absolute top-1/2 left-1/4 animate-bounce delay-1000">
            <Code className="h-16 w-16 text-gray-400" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Learning Ecosystem
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're learning new concepts or testing your knowledge, EduCentral provides the tools you need to succeed
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group animate-fade-in-up delay-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 animate-pulse-ring">
                <BookOpen className="h-8 w-8 text-primary group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Gamified Learning</h3>
              <p className="text-gray-600">
                Earn XP, unlock badges, and maintain learning streaks while mastering programming concepts
              </p>
            </div>
            
            <div className="text-center group animate-fade-in-up delay-500">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 animate-pulse-ring">
                <Brain className="h-8 w-8 text-secondary group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">AI-Powered Assessment</h3>
              <p className="text-gray-600">
                Get intelligent feedback on video explanations, diagram submissions, and written responses
              </p>
            </div>
            
            <div className="text-center group animate-fade-in-up delay-700">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 animate-pulse-ring">
                <TrendingUp className="h-8 w-8 text-accent group-hover:animate-wiggle" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed analytics and performance insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 animate-float">
            <Trophy className="h-12 w-12 text-yellow-400" />
          </div>
          <div className="absolute bottom-8 right-8 animate-float delay-1000">
            <Star className="h-10 w-10 text-yellow-400" />
          </div>
          <div className="absolute top-1/2 left-12 animate-pulse delay-2000">
            <Target className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl font-bold mb-4 animate-slide-up">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-gray-300 mb-8 animate-fade-in delay-300">
            Join thousands of learners mastering programming through interactive education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-500">
            <Link href="/learn">
              <Button size="lg" className="bg-secondary hover:bg-green-700 text-white hover:scale-105 transition-all duration-300 animate-glow">
                <Rocket className="h-5 w-5 mr-2" />
                Start Learning Now
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 hover:scale-105 transition-all duration-300">
                <Play className="h-5 w-5 mr-2" />
                Try Mock Tests
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 mb-4">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy</Link>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">© 2025 EduCentral. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}