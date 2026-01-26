"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserAssessments, getUserAssessmentStats } from "@/actions/assessment";
import { useSession } from "next-auth/react";
import { Loader2, FileText, TrendingUp, Target, RotateCcw, Play } from "lucide-react";

export default function InterviewPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";
  
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({ totalAssessments: 0, completedAssessments: 0, averageScore: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSetupLoading, setIsSetupLoading] = useState(false);

  useEffect(() => {
    if (!loadingSession) {
      if (session) {
        loadInterviewData();
      } else {
        // Optional: Redirect or handle unauthenticated state?
        // Since this page is likely protected by middleware, we might just stop loading
        setLoading(false);
      }
    }
  }, [session, loadingSession]);

  const loadInterviewData = async () => {
    try {
      setLoading(true);
      
      // Load assessments and stats in parallel
      const [assessmentsData, statsData] = await Promise.all([
        getUserAssessments(),
        getUserAssessmentStats()
      ]);
      
      setAssessments(assessmentsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading interview data:", err);
      setError(err.message || "Failed to load interview data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Loading interview data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Mock Interview System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice for real interviews with AI-generated questions tailored to your industry and experience level
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow border-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Interviews
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssessments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Completed sessions
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow border-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all assessments
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow border-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAssessments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Fully evaluated
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Start New Interview Section */}
          <div className="lg:col-span-1">
            <Card className="h-full border-muted/50 hover:shadow-lg transition-all hover:border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 bg-clip-text text-transparent">
                  Start New Interview
                </CardTitle>
                <CardDescription>
                  Configure a personalized interview experience
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-8">
                <div className="bg-primary/10 p-6 rounded-full mb-6 ring-4 ring-primary/5 animate-pulse-slow">
                  <Play className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground text-center mb-8 px-4">
                  Tailor your interview to your industry, role, and experience level for optimal practice.
                </p>
                <Button 
                  onClick={() => {
                    setIsSetupLoading(true);
                    router.push("/interview/setup");
                  }}
                  className="w-full py-6 text-lg font-semibold shadow-md hover:shadow-xl transition-all"
                  size="lg"
                  disabled={isSetupLoading}
                >
                  {isSetupLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Starting Setup...
                    </>
                  ) : (
                    "Begin Interview Setup"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Interviews Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle>Recent Interviews</CardTitle>
                    <CardDescription>
                    Review your past interview sessions
                    </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => loadInterviewData()}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {assessments.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No interviews yet</h3>
                    <p className="text-sm text-muted-foreground/70 mt-1">Practice session results will appear here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                <th className="pb-4 pt-2 font-semibold">Date</th>
                                <th className="pb-4 pt-2 font-semibold">Industry / Domain</th>
                                <th className="pb-4 pt-2 font-semibold">Type</th>
                                <th className="pb-4 pt-2 font-semibold text-center">Score</th>
                                <th className="pb-4 pt-2 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {assessments.map((assessment) => (
                                <tr key={assessment.id} className="group hover:bg-muted/50 transition-colors">
                                    <td className="py-4 text-sm text-muted-foreground font-medium whitespace-nowrap">
                                        {new Date(assessment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="py-4">
                                        <div className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                            {assessment.category}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold">
                                            {assessment.interviewType || 'Mixed'}
                                        </Badge>
                                    </td>
                                    <td className="py-4 text-center">
                                        {assessment.quizScore !== null ? (
                                            <span className={`text-sm font-bold ${
                                                assessment.quizScore >= 70 ? 'text-green-500' : 
                                                assessment.quizScore >= 40 ? 'text-yellow-500' : 
                                                'text-red-500'
                                            }`}>
                                                {Math.round(assessment.quizScore)}%
                                            </span>
                                        ) : (
                                            <span className="text-xs font-medium text-muted-foreground italic">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => router.push(`/interview/session/${assessment.id}`)}
                                            className="hover:text-primary hover:bg-primary/5 font-medium"
                                        >
                                            View Report
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                )}
                
                {assessments.length > 5 && (
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>
                      View All Interviews
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">Why Practice Mock Interviews?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <Card className="hover:shadow-md transition-shadow border-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Target className="h-6 w-6 mr-3 text-primary" />
                  Industry-Specific
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Questions tailored to your specific industry and role, helping you practice relevant scenarios.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow border-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <TrendingUp className="h-6 w-6 mr-3 text-primary" />
                  Track Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor your improvement over time with detailed scoring and feedback.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow border-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <FileText className="h-6 w-6 mr-3 text-primary" />
                  AI-Powered Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive detailed, personalized feedback to help you improve your interview skills.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}