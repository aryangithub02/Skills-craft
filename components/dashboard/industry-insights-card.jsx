"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, MapPin, Briefcase, Users } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from "recharts";

export default function IndustryInsightsCard({ insights }) {
  if (!insights) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl">Industry Insights</CardTitle>
          <CardDescription>Stay updated with market trends</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
          No insights available for your industry yet.
        </CardContent>
      </Card>
    );
  }

  // Calculate random progress for visual effect if not present
  const demandScore =
    insights.demandLevel === "High" ? 85 :
    insights.demandLevel === "Medium" ? 60 : 40;

  // Format salary data for chart
  const salaryData = insights.salaryRanges.map(item => ({
    role: item.role,
    min: item.min / 100000, // Convert to LPA
    max: item.max / 100000,
    median: item.median / 100000,
  }));

  const CardBody = (
    <Card className={`h-full transition-all ${insights.routing ? 'hover:border-primary hover:shadow-md cursor-pointer' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1 flex items-center gap-2">
              {insights.industry} Insights
              <Badge variant="secondary" className="text-xs font-normal">
                Live
              </Badge>
            </CardTitle>
            <CardDescription>
              Market outlook: <span className="font-medium text-foreground">{insights.marketOutlook}</span>
            </CardDescription>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
             <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics Row */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Growth Rate
                </p>
                <div className="text-2xl font-bold flex items-end gap-1">
                     {insights.growthRate}%
                </div>
            </div>
             <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> Demand Level
                </p>
                <div className="flex items-center gap-2">
                     <Progress value={demandScore} className="h-2 w-20" />
                     <span className="text-sm font-medium">{insights.demandLevel}</span>
                </div>
            </div>
        </div>

        {/* Salary Chart */}
        <div className="space-y-2">
            <h4 className="text-sm font-medium">Average Salaries (LPA)</h4>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={salaryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                        <XAxis 
                            dataKey="role" 
                            hide 
                        />
                        <YAxis 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `₹${value}L`}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-background border rounded-lg p-2 shadow-md text-xs sm:text-sm max-w-[200px]">
                                            <p className="font-bold mb-1">{label}</p>
                                            {payload.map((entry, index) => (
                                                <p key={index} className="flex items-center gap-2 mb-0.5">
                                                    <span 
                                                        className="w-2 h-2 rounded-full" 
                                                        style={{ backgroundColor: entry.color }}
                                                    />
                                                    <span className="capitalize text-muted-foreground">{entry.name}:</span>
                                                    <span className="font-medium">₹{entry.value}L</span>
                                                </p>
                                            ))}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="min" fill="#94a3b8" radius={[0, 0, 4, 4]} name="Min Salary" />
                        <Bar dataKey="median" fill="#64748b" radius={[0, 0, 0, 0]} name="Median Salary" />
                        <Bar dataKey="max" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Max Salary" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Top Skills */}
        <div className="space-y-2">
             <h4 className="text-sm font-medium">In-Demand Skills</h4>
             <div className="flex flex-wrap gap-2">
                {insights.topSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                        {skill}
                    </Badge>
                ))}
             </div>
        </div>
      </CardContent>
    </Card>
  );

  if (insights.routing) {
      return (
          <Link href={`/industry/${insights.routing.industryId}/${insights.routing.subIndustrySlug}`} className="block h-full">
              {CardBody}
          </Link>
      );
  }

  return CardBody;
}
