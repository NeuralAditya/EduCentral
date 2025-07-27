import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  User, 
  Phone,
  MessageSquare,
  Settings,
  Home
} from "lucide-react";
import { Link } from "wouter";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
  type: "text" | "audio";
}

export default function VideoChat() {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      content: "Hello! I'm your AI tutor. I can help you with programming concepts, data structures, algorithms, and answer any questions you have. How can I assist you today?",
      timestamp: new Date(),
      type: "text"
    }
  ]);
  const [isConnected, setIsConnected] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsVideoOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopVideo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsVideoOn(false);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: generateAIResponse(message),
        timestamp: new Date(),
        type: "text"
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("array") || input.includes("data structure")) {
      return "Arrays are fundamental data structures that store elements in contiguous memory locations. They provide O(1) access time by index but O(n) for insertion/deletion at the beginning. Would you like me to explain specific array operations or algorithms?";
    }
    
    if (input.includes("algorithm") || input.includes("sorting")) {
      return "There are many sorting algorithms with different time complexities. Quick sort has O(n log n) average case, Bubble sort is O(n²), and Merge sort is always O(n log n). Which specific algorithm would you like to explore?";
    }
    
    if (input.includes("java") || input.includes("python")) {
      return "Both Java and Python are excellent programming languages! Java is statically typed and runs on the JVM, while Python is dynamically typed and known for its simplicity. What specific concept would you like to learn about?";
    }
    
    if (input.includes("hello") || input.includes("hi")) {
      return "Hello! I'm here to help you learn programming concepts. Feel free to ask me about data structures, algorithms, programming languages, or any coding questions you have.";
    }
    
    return "That's an interesting question! I can help explain programming concepts, solve coding problems, or discuss algorithms and data structures. Could you provide more specific details about what you'd like to learn?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
            <div className="flex items-center space-x-4">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Video Call
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Student Video */}
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {!isVideoOn && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-center text-white">
                          <User className="h-12 w-12 mx-auto mb-2" />
                          <p>Camera Off</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary">You</Badge>
                    </div>
                  </div>

                  {/* AI Tutor Avatar */}
                  <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center text-white">
                      <Bot className="h-16 w-16 mx-auto mb-2" />
                      <p className="font-semibold">AI Tutor</p>
                      <p className="text-sm opacity-90">Ready to help</p>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary">AI Tutor</Badge>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant={isVideoOn ? "default" : "outline"}
                      size="sm"
                      onClick={isVideoOn ? stopVideo : startVideo}
                    >
                      {isVideoOn ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <VideoOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant={isAudioOn ? "default" : "outline"}
                      size="sm"
                      onClick={toggleAudio}
                    >
                      {isAudioOn ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <MicOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat with AI Tutor
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            {msg.sender === "ai" ? (
                              <Bot className="h-4 w-4 mr-2" />
                            ) : (
                              <User className="h-4 w-4 mr-2" />
                            )}
                            <span className="text-xs opacity-70">
                              {msg.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center">
                            <Bot className="h-4 w-4 mr-2" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about programming..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Topics */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Quick Topics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Data Structures",
              "Algorithms",
              "Java Basics",
              "Python Fundamentals",
              "System Design",
              "Database Concepts",
              "Web Development",
              "Problem Solving"
            ].map((topic) => (
              <Button
                key={topic}
                variant="outline"
                className="text-sm"
                onClick={() => setMessage(`Tell me about ${topic}`)}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            © 2025 EduCentral. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}