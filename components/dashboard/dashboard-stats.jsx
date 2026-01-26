"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Brain } from "lucide-react";

/**
 * Render a dashboard card summarizing assessment progress.
 *
 * Displays the average score, the latest score, the number of attempts, and an optional AI coach tip;
 * if `assessments` is empty or falsy, renders a prompt encouraging the user to complete a mock interview.
 *
 * @param {Array<Object>} assessments - Array of assessment objects. Each object may include:
 *   - {number} quizScore - The score for the assessment (percentage).
 *   - {string} improvementTip - Optional AI coach tip for the assessment.
 * @returns {JSX.Element} A Card element showing progress statistics or a prompt when no assessments are available.
 */
export default function DashboardStats({ assessments }) {
  const getStats = () => {
    if (!assessments || assessments.length === 0) {
      return null;
    }

    const totalScore = assessments.reduce(
      (acc, curr) => acc + (curr.quizScore || 0),
      0
    );
    const average = (totalScore / assessments.length).toFixed(1);
    const latest = assessments[0];
    
    return {
      average,
      count: assessments.length,
      latestTip: latest.improvementTip,
      latestScore: latest.quizScore,
    };
  };

  const stats = getStats();

  if (!stats) {
    return (
      <Card className="hover:border-primary transition-colors h-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            🎯 Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Complete a mock interview to track your progress and get personalized feedback.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:border-primary transition-colors h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          🎯 Your Progress
          <span className="text-sm font-normal text-muted-foreground">
             Last {stats.count} attempt{stats.count > 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                     <p className="text-xs text-muted-foreground">Average Score</p>
                    <p className="text-xl font-bold">{stats.average}%</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                     <p className="text-xs text-muted-foreground">Latest</p>
                    <p className="text-xl font-bold">{stats.latestScore}%</p>
                </div>
            </div>
        </div>
      
        {stats.latestTip && (
             <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">AI Coach Tip</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {stats.latestTip}
                </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}