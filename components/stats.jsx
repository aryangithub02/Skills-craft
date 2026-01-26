import { getLandingPageStats } from "@/actions/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, LineChart, Brain } from "lucide-react";

/**
 * Renders a responsive stats section displaying four landing-page metrics.
 *
 * @returns {JSX.Element} A section element containing four metric cards (Industries Tracked, Avg. Growth Rate, Market Demand, Top In-Demand Skill) populated with current landing-page statistics.
 */
export default async function StatsSection() {
  const stats = await getLandingPageStats();

  return (
    <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Real-Time Industry Insights
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Our AI analyzes thousands of job market data points weekly to give you the competitive edge.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="bg-card border-none ring-1 ring-muted shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Industries Tracked
                        </CardTitle>
                        <LineChart className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.industries}+</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Across all major sectors
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-none ring-1 ring-muted shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Avg. Growth Rate
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.growthRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Year-over-year projection
                        </p>
                    </CardContent>
                </Card>

                 <Card className="bg-card border-none ring-1 ring-muted shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Market Demand
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground capitalize">{stats.demandLevel}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Current aggregate status
                        </p>
                    </CardContent>
                </Card>

                 <Card className="bg-card border-none ring-1 ring-muted shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Top In-Demand Skill
                        </CardTitle>
                        <Brain className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground truncate" title={stats.topSkill}>{stats.topSkill}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Most cited in job descriptions
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </section>
  );
}