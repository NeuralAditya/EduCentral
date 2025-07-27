import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import Home from "@/pages/home";
import Learn from "@/pages/learn";
import Module from "@/pages/module";
import Dashboard from "@/pages/dashboard";
import TakeTest from "@/pages/take-test";
import EnhancedTest from "@/pages/enhanced-test";
import CreateTest from "@/pages/create-test";
import Results from "@/pages/results";
import QuizTopics from "@/pages/quiz-topics";
import TopicLevels from "@/pages/topic-levels";
import QuizTake from "@/pages/quiz-take";
import QuizResults from "@/pages/quiz-results";
import VideoChat from "@/pages/video-chat";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import About from "@/pages/about";
import Login from "@/pages/login";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/learn" component={Learn} />
      <Route path="/learn/module/:id" component={Module} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/take-test" component={TakeTest} />
      <Route path="/take-test/:testId" component={TakeTest} />
      <Route path="/enhanced-test/:testId" component={EnhancedTest} />
      <Route path="/create-test" component={CreateTest} />
      <Route path="/results" component={Results} />
      <Route path="/quiz/topics" component={QuizTopics} />
      <Route path="/quiz/topic/:topicId" component={TopicLevels} />
      <Route path="/quiz/:quizId" component={QuizTake} />
      <Route path="/quiz/:quizId/results" component={QuizResults} />
      <Route path="/video-chat" component={VideoChat} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
