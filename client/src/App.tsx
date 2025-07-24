import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import Dashboard from "@/pages/dashboard";
import TakeTest from "@/pages/take-test";
import CreateTest from "@/pages/create-test";
import Results from "@/pages/results";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/take-test" component={TakeTest} />
          <Route path="/take-test/:testId" component={TakeTest} />
          <Route path="/create-test" component={CreateTest} />
          <Route path="/results" component={Results} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
