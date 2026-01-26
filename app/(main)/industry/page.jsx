import { getAllIndustries } from "@/actions/industry-page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TrendingUp, Briefcase } from "lucide-react";

export const metadata = {
    title: "Industry Insights | AI Career Coach",
    description: "Explore comprehensive industry insights, salary trends, and skill requirements across 15+ industries.",
};

/**
 * Render the Industry Insights landing page displaying a responsive grid of industry cards and a call-to-action to start a career assessment.
 * @returns {JSX.Element} The React element for the Industry Insights landing page.
 */
export default async function IndustryLandingPage() {
    const industries = await getAllIndustries();

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Industry Insights
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Make informed career decisions with comprehensive market data, salary trends, and skill requirements.
                    </p>
                </div>

                {/* Industry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industries.map((industry) => (
                        <Link 
                            key={industry.id} 
                            href={`/industry/${industry.slug}`}
                            className="block transition-transform hover:scale-105"
                        >
                            <Card className="h-full hover:border-primary">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{industry.name}</span>
                                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {/* Demand Level */}
                                    {industry.demandLevel && (
                                        <div className="flex items-center gap-2">
                                            <Badge 
                                                variant={
                                                    industry.demandLevel === 'High' ? 'default' :
                                                    industry.demandLevel === 'Medium' ? 'secondary' :
                                                    'outline'
                                                }
                                                className={
                                                    industry.demandLevel === 'High' ? 'bg-green-500 hover:bg-green-600' :
                                                    industry.demandLevel === 'Medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                                    'bg-red-500 hover:bg-red-600 text-white'
                                                }
                                            >
                                                {industry.demandLevel} Demand
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Growth Rate */}
                                    {industry.growthRate !== null && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                            <span className="font-semibold text-green-600">
                                                {industry.growthRate}% Growth
                                            </span>
                                        </div>
                                    )}

                                    {/* Market Outlook */}
                                    {industry.marketOutlook && (
                                        <div className="text-sm text-muted-foreground">
                                            Outlook: <span className="font-medium">{industry.marketOutlook}</span>
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <span className="text-sm text-primary font-medium">
                                            Explore Industry →
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center p-8 bg-muted rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">
                        Not sure which industry to choose?
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Take our AI-powered career assessment to discover the best fit for your skills and interests.
                    </p>
                    <Link href="/onboarding">
                        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
                            Start Career Assessment
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}