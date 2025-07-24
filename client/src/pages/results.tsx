import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Bot, History, Eye, Download, Star } from "lucide-react";

export default function Results() {
  const { data: results, isLoading } = useQuery({
    queryKey: ["/api/users/1/results"], // Using user ID 1 for demo
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-material animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const latestResult = results && Array.isArray(results) ? results[0] : null;
  const completedResults = results && Array.isArray(results) ? results.filter((r: any) => r.status === 'completed') : [];

  // Calculate stats from results
  const avgScore = completedResults.length > 0 
    ? Math.round(completedResults.reduce((sum: number, r: any) => {
        const percentage = r.maxScore ? (r.totalScore / r.maxScore) * 100 : 0;
        return sum + percentage;
      }, 0) / completedResults.length)
    : 0;

  const improvement = completedResults.length >= 2 
    ? Math.round(
        ((completedResults[0].totalScore / completedResults[0].maxScore) * 100) -
        ((completedResults[1].totalScore / completedResults[1].maxScore) * 100)
      )
    : 0;

  const avgAiRating = completedResults.length > 0
    ? completedResults.reduce((sum: number, r: any) => sum + (r.aiOverallRating || 7), 0) / completedResults.length
    : 7;

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Test Results & Analytics</h2>
        <p className="text-neutral-600">Comprehensive analysis of test performance with AI insights</p>
      </div>

      {/* Results Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-material">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Latest Test Score</h3>
                <p className="text-3xl font-bold text-secondary">
                  {latestResult && latestResult.maxScore 
                    ? Math.round((latestResult.totalScore / latestResult.maxScore) * 100) + '%'
                    : 'N/A'
                  }
                </p>
                <p className="text-sm text-neutral-600">
                  {latestResult?.test?.title || 'No tests taken'}
                </p>
              </div>
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <Trophy className="text-secondary h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-material">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Average Score</h3>
                <p className="text-3xl font-bold text-secondary">{avgScore}%</p>
                <p className="text-sm text-neutral-600">
                  {improvement !== 0 && (
                    <span className={improvement > 0 ? "text-green-600" : "text-red-600"}>
                      {improvement > 0 ? '+' : ''}{improvement}% from last test
                    </span>
                  )}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-secondary h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-material">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">AI Feedback</h3>
                <p className="text-3xl font-bold text-primary">{avgAiRating.toFixed(1)}/10</p>
                <p className="text-sm text-neutral-600">Overall quality</p>
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="text-primary h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Breakdown */}
        <Card className="shadow-material">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <History className="text-primary mr-2" />
              Performance Breakdown
            </h3>
            
            {!latestResult?.answers?.length ? (
              <div className="text-center py-8 text-neutral-600">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No detailed performance data available</p>
                <p className="text-sm">Take a test to see performance breakdown</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Question type breakdown */}
                {['mcq', 'video_response', 'photo_upload', 'short_answer'].map((type, index) => {
                  const typeAnswers = latestResult.answers.filter((a: any) => a.question.type === type);
                  if (typeAnswers.length === 0) return null;
                  
                  const typeScore = typeAnswers.reduce((sum: number, a: any) => sum + (a.score || 0), 0);
                  const typeMaxScore = typeAnswers.reduce((sum: number, a: any) => sum + (a.maxScore || 0), 0);
                  const percentage = typeMaxScore > 0 ? (typeScore / typeMaxScore) * 100 : 0;
                  
                  const colors = ['primary', 'accent', 'secondary', 'purple-600'];
                  const typeNames = {
                    mcq: 'Multiple Choice',
                    video_response: 'Video Responses',
                    photo_upload: 'Photo Submissions',
                    short_answer: 'Short Answers'
                  };
                  
                  return (
                    <div key={type} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 bg-${colors[index]} rounded-full mr-3`}></div>
                        <span className="font-medium">{typeNames[type as keyof typeof typeNames]}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-${colors[index]} h-2 rounded-full`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className={`font-bold text-${colors[index]}`}>
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Time Analysis */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-bold mb-4">Time Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {latestResult.timeSpent ? Math.floor(latestResult.timeSpent / 60) : 0}
                      </p>
                      <p className="text-sm text-neutral-600">Minutes Used</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-secondary">
                        {latestResult.test?.duration 
                          ? latestResult.test.duration - Math.floor((latestResult.timeSpent || 0) / 60)
                          : 0
                        }
                      </p>
                      <p className="text-sm text-neutral-600">Remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Feedback & Recommendations */}
        <Card className="shadow-material">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Bot className="text-primary mr-2" />
              AI Feedback & Insights
            </h3>
            
            {!latestResult?.answers?.length ? (
              <div className="text-center py-8 text-neutral-600">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No AI feedback available</p>
                <p className="text-sm">Complete a test to receive AI-powered insights</p>
              </div>
            ) : (
              <>
                {/* Strengths */}
                <div className="mb-6">
                  <h4 className="font-bold text-secondary mb-3 flex items-center">
                    <Trophy className="mr-2 h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-secondary mr-2 mt-1">✓</span>
                      <span>Strong performance on multiple choice questions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2 mt-1">✓</span>
                      <span>Good time management skills demonstrated</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2 mt-1">✓</span>
                      <span>Clear understanding of fundamental concepts</span>
                    </li>
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="mb-6">
                  <h4 className="font-bold text-accent mb-3 flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-accent mr-2 mt-1">↗</span>
                      <span>Consider more detailed explanations in responses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2 mt-1">↗</span>
                      <span>Include more real-world examples in answers</span>
                    </li>
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-bold mb-3 flex items-center">
                    <Bot className="text-primary mr-2 h-4 w-4" />
                    Study Recommendations
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Review challenging topics from recent tests</li>
                    <li>• Practice more multimedia-based questions</li>
                    <li>• Focus on time management for complex problems</li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test History Table */}
      <Card className="shadow-material">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <History className="text-primary mr-2" />
            Test History
          </h3>
          
          {!completedResults.length ? (
            <div className="text-center py-8 text-neutral-600">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed tests found</p>
              <p className="text-sm">Your test history will appear here once you complete tests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium text-neutral-600">Test Name</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Date</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Score</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Time</th>
                    <th className="text-left py-3 font-medium text-neutral-600">AI Rating</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {completedResults.map((result: any) => {
                    const percentage = result.maxScore ? Math.round((result.totalScore / result.maxScore) * 100) : 0;
                    const timeUsed = result.timeSpent ? Math.floor(result.timeSpent / 60) : 0;
                    
                    return (
                      <tr key={result.id} className="border-b hover:bg-neutral-50">
                        <td className="py-4 font-medium">{result.test?.title || 'Unknown Test'}</td>
                        <td className="py-4 text-neutral-600">
                          {new Date(result.completedAt || result.startedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-sm font-bold text-white ${
                            percentage >= 90 ? 'bg-secondary' : 
                            percentage >= 70 ? 'bg-primary' : 'bg-accent'
                          }`}>
                            {percentage}%
                          </span>
                        </td>
                        <td className="py-4 text-neutral-600">{timeUsed} min</td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <Star className="text-yellow-400 mr-1 h-4 w-4" />
                            <span>{result.aiOverallRating || 7}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
