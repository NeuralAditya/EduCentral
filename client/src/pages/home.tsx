import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Brain, Trophy, Zap, Target, Users, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <GraduationCap className="h-16 w-16 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold">EduCentral</h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Master programming concepts through gamified learning and AI-powered assessments
            </p>
            
            {/* Main Choice Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Learn Mode */}
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Learn & Practice</h3>
                  <p className="text-blue-100 mb-6">
                    Gamified learning modules for DSA, algorithms, and programming concepts with XP, badges, and streaks
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      <span>Interactive Lessons</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      <span>XP & Badges</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      <span>Progress Tracking</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>Skill Building</span>
                    </div>
                  </div>
                  <Link href="/learn">
                    <Button size="lg" className="w-full bg-secondary hover:bg-green-700 text-white">
                      Start Learning Journey
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Test Mode */}
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Test & Assess</h3>
                  <p className="text-blue-100 mb-6">
                    AI-powered mock tests with video, photo, and text assessments for comprehensive evaluation
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      <span>AI Assessment</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Mock Tests</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      <span>Performance Analytics</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>Detailed Feedback</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/dashboard" className="flex-1">
                      <Button size="lg" className="w-full bg-accent hover:bg-orange-700 text-white">
                        AI Assessment
                      </Button>
                    </Link>
                    <Link href="/quiz/topics" className="flex-1">
                      <Button size="lg" variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50">
                        Quiz Challenge
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Video Chat Mode */}
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">1:1 AI Tutoring</h3>
                  <p className="text-blue-100 mb-6">
                    Interactive video sessions with AI tutors for real-time Q&A and personalized guidance
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      <span>AI Tutor Chat</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      <span>Video Interaction</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Real-time Help</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>Instant Feedback</span>
                    </div>
                  </div>
                  <Link href="/video-chat">
                    <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Start AI Tutoring
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="absolute bottom-4 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-6 text-sm text-blue-200">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="bg-gray-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2025 EduCentral. All rights reserved.</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Learning Ecosystem
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're learning new concepts or testing your knowledge, EduCentral provides the tools you need to succeed
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gamified Learning</h3>
              <p className="text-gray-600">
                Earn XP, unlock badges, and maintain learning streaks while mastering programming concepts
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Assessment</h3>
              <p className="text-gray-600">
                Get intelligent feedback on video explanations, diagram submissions, and written responses
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed analytics and performance insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of learners mastering programming through interactive education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/learn">
              <Button size="lg" className="bg-secondary hover:bg-green-700 text-white">
                Start Learning Now
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Try Mock Tests
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}