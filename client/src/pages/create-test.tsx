import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Save, FileText, Video, Camera, List } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Question {
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  timeLimit: number;
  orderIndex: number;
}

export default function CreateTest() {
  const [testData, setTestData] = useState({
    title: "",
    description: "",
    subject: "",
    duration: 60,
    difficulty: "intermediate",
    createdBy: 1, // Using user ID 1 for demo
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "mcq",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 5,
    timeLimit: 60,
  });

  const { toast } = useToast();

  const createTestMutation = useMutation({
    mutationFn: async () => {
      // First create the test
      const testResponse = await apiRequest("POST", "/api/tests", testData);
      const test = await testResponse.json();

      // Then add all questions
      for (let index = 0; index < questions.length; index++) {
        const question = questions[index];
        await apiRequest("POST", `/api/tests/${test.id}/questions`, {
          ...question,
          orderIndex: index + 1,
        });
      }

      return test;
    },
    onSuccess: () => {
      toast({
        title: "Test Created",
        description: "Your test has been created successfully!",
      });
      // Reset form
      setTestData({
        title: "",
        description: "",
        subject: "",
        duration: 60,
        difficulty: "intermediate",
        createdBy: 1,
      });
      setQuestions([]);
      setCurrentQuestion({
        type: "mcq",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 5,
        timeLimit: 60,
      });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create test. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addQuestion = () => {
    if (!currentQuestion.question?.trim()) {
      toast({
        title: "Invalid Question",
        description: "Please enter a question before adding it.",
        variant: "destructive",
      });
      return;
    }

    const newQuestion: Question = {
      type: currentQuestion.type || "mcq",
      question: currentQuestion.question,
      options: currentQuestion.type === "mcq" ? currentQuestion.options : undefined,
      correctAnswer: currentQuestion.type === "mcq" ? currentQuestion.correctAnswer : undefined,
      points: currentQuestion.points || 5,
      timeLimit: currentQuestion.timeLimit || 60,
      orderIndex: questions.length + 1,
    };

    setQuestions([...questions, newQuestion]);
    
    // Reset current question
    setCurrentQuestion({
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 5,
      timeLimit: 60,
    });

    toast({
      title: "Question Added",
      description: "Question has been added to the test.",
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionTypeChange = (type: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      type,
      options: type === "mcq" ? ["", "", "", ""] : undefined,
      correctAnswer: type === "mcq" ? "" : undefined,
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "mcq": return <List className="h-4 w-4" />;
      case "short_answer": return <FileText className="h-4 w-4" />;
      case "video_response": return <Video className="h-4 w-4" />;
      case "photo_upload": return <Camera className="h-4 w-4" />;
      default: return <List className="h-4 w-4" />;
    }
  };

  const questionTypes = [
    { value: "mcq", label: "Multiple Choice", icon: List },
    { value: "short_answer", label: "Short Answer", icon: FileText },
    { value: "video_response", label: "Video Response", icon: Video },
    { value: "photo_upload", label: "Photo Upload", icon: Camera },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Create New Test</h2>
        <p className="text-neutral-600">Design comprehensive assessments with AI-powered evaluation</p>
      </div>

      <Card className="shadow-material-lg">
        <CardContent className="p-8">
          {/* Test Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <Label htmlFor="title">Test Title</Label>
              <Input
                id="title"
                value={testData.title}
                onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                placeholder="Enter test title"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={testData.subject}
                onValueChange={(value) => setTestData({ ...testData, subject: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={testData.duration}
                onChange={(e) => setTestData({ ...testData, duration: parseInt(e.target.value) })}
                placeholder="90"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={testData.difficulty}
                onValueChange={(value) => setTestData({ ...testData, difficulty: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-8">
            <Label htmlFor="description">Test Description</Label>
            <Textarea
              id="description"
              value={testData.description}
              onChange={(e) => setTestData({ ...testData, description: e.target.value })}
              placeholder="Describe the test objectives and content..."
              className="mt-2 h-32"
            />
          </div>

          {/* Question Builder */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold mb-6">Questions ({questions.length})</h3>
            
            {/* Question Type Selector */}
            <div className="flex flex-wrap gap-4 mb-6">
              {questionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={currentQuestion.type === type.value ? "default" : "outline"}
                    onClick={() => handleQuestionTypeChange(type.value)}
                    className="flex items-center"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {type.label}
                  </Button>
                );
              })}
            </div>

            {/* Question Builder */}
            <div className="bg-neutral-50 rounded-xl p-6 mb-6">
              <div className="mb-4">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  placeholder="Enter your question..."
                  className="mt-2 h-24"
                />
              </div>
              
              {/* MCQ Options */}
              {currentQuestion.type === "mcq" && (
                <div className="space-y-3 mb-4">
                  <Label>Answer Options</Label>
                  <RadioGroup
                    value={currentQuestion.correctAnswer}
                    onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                  >
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="font-medium">
                          {String.fromCharCode(65 + index)}.
                        </Label>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={currentQuestion.points}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) })}
                    placeholder="5"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={currentQuestion.timeLimit}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, timeLimit: parseInt(e.target.value) })}
                    placeholder="60"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Added Questions List */}
            {questions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold mb-4">Added Questions</h4>
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                      <div className="flex items-center">
                        {getQuestionTypeIcon(question.type)}
                        <div className="ml-3">
                          <p className="font-medium">Question {index + 1}</p>
                          <p className="text-sm text-neutral-600 truncate max-w-96">
                            {question.question}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {question.points} points • {question.timeLimit}s • {question.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button onClick={addQuestion} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  disabled={!testData.title || questions.length === 0}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => createTestMutation.mutate()}
                  disabled={!testData.title || questions.length === 0 || createTestMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createTestMutation.isPending ? "Publishing..." : "Publish Test"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
