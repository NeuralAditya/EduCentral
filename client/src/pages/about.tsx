import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, ArrowLeft, Users, Target, Award, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Home className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold text-primary">EduCentral</span>
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About EduCentral</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing education through AI-powered learning and assessment technologies
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              At EduCentral, we believe that learning should be personalized, engaging, and accessible to everyone. 
              Our platform combines cutting-edge artificial intelligence with gamified learning experiences to help 
              students master programming concepts, data structures, and algorithms while providing educators with 
              powerful assessment tools.
            </p>
          </CardContent>
        </Card>

        {/* Company Background */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-blue-900">From the Creators of SnackStack™</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                EduCentral is proudly developed by the same innovative team behind <strong>SnackStack™</strong>, 
                a revolutionary campus meal ordering system that transformed how students access food services.
              </p>
              <p className="text-gray-600 mb-6">
                Building on our success in streamlining campus life through technology, we've now turned our 
                attention to revolutionizing education with AI-powered learning platforms.
              </p>
              <a 
                href="https://snackstack.onrender.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <span className="mr-2">🍕</span>
                Visit SnackStack™
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </a>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">What is SnackStack™?</h4>
              <p className="text-gray-600">
                SnackStack™ was our flagship campus meal ordering system that allowed students to seamlessly 
                order food from campus restaurants, track deliveries in real-time, and manage their meal plans 
                digitally. The platform served thousands of students and demonstrated our commitment to 
                improving student life through innovative technology solutions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Learning</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI algorithms analyze your learning patterns and provide personalized feedback
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Comprehensive Assessment</h3>
              <p className="text-gray-600 text-sm">
                Multi-modal assessment including video, audio, and text analysis with real-time feedback
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gamified Experience</h3>
              <p className="text-gray-600 text-sm">
                Earn XP, unlock badges, and compete on leaderboards while mastering new skills
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1:1 AI Tutoring</h3>
              <p className="text-gray-600 text-sm">
                Interactive video sessions with AI tutors for personalized learning support
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technology Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">AI & Machine Learning</h4>
                  <p className="text-gray-600 text-sm">OpenAI GPT-4o for intelligent content assessment and personalized tutoring</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Computer Vision</h4>
                  <p className="text-gray-600 text-sm">MediaPipe for real-time facial expression analysis and engagement tracking</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Speech Processing</h4>
                  <p className="text-gray-600 text-sm">HuggingFace APIs for speech-to-text conversion and emotion analysis</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Modern Web Technologies</h4>
                  <p className="text-gray-600 text-sm">React, TypeScript, and real-time WebSocket connections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Data Structures & Algorithms</h4>
                  <p className="text-gray-600 text-sm">Comprehensive coverage from basic arrays to advanced graph algorithms</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Programming Languages</h4>
                  <p className="text-gray-600 text-sm">In-depth modules for Java, Python, and other popular languages</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">System Design</h4>
                  <p className="text-gray-600 text-sm">Scalable architecture patterns and distributed systems concepts</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Interview Preparation</h4>
                  <p className="text-gray-600 text-sm">Mock interviews and coding challenges based on industry standards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously push the boundaries of educational technology to create more effective learning experiences.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  Quality education should be available to everyone, regardless of background or financial situation.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Privacy</h3>
                <p className="text-gray-600">
                  We protect your data and privacy while delivering personalized learning experiences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Have questions about EduCentral or want to learn more about our platform?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div>
                  <p className="font-semibold">General Inquiries</p>
                  <p className="text-gray-600">info@educentral.com</p>
                </div>
                <div>
                  <p className="font-semibold">Technical Support</p>
                  <p className="text-gray-600">support@educentral.com</p>
                </div>
                <div>
                  <p className="font-semibold">Partnerships</p>
                  <p className="text-gray-600">partners@educentral.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-gray-600">
            © 2025 EduCentral. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}