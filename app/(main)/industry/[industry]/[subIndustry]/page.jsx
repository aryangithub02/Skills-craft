import { getSubIndustryData } from "@/actions/industry-page";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SalaryChart from "@/components/industry/SalaryChart";
import { Calendar, TrendingUp, Code, Wrench, Award, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export async function generateMetadata({ params }) {
    const { industry, subIndustry } = await params;
    const data = await getSubIndustryData(industry, subIndustry);
    
    if (!data) {
        return {
            title: "Sub-Industry Not Found",
        };
    }

    return {
        title: `${data.subIndustryName} in ${data.industryName} | AI Career Coach`,
        description: `Explore ${data.subIndustryName} career insights, required skills, tools, and certifications.`,
    };
}

export default async function SubIndustryDetailPage({ params }) {
    const { industry, subIndustry } = await params;
    console.log(`DEBUG PAGE: industry=${industry}, subIndustry=${subIndustry}`);
    
    const data = await getSubIndustryData(industry, subIndustry);
    console.log(`DEBUG PAGE: data found? ${!!data}`);

    if (!data) {
        console.log("DEBUG PAGE: Data is null/undefined, triggering notFound()");
        // Temporary debug return
        return (
            <div className="p-10">
                <h1>Debug Info</h1>
                <pre>Params: {JSON.stringify({ industry, subIndustry }, null, 2)}</pre>
                <pre>Data is null</pre>
            </div>
        );
    }

    const { insights, techStack } = data;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
                <div className="container mx-auto py-12 px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                            <Link href="/industry" className="hover:text-primary">Industries</Link>
                            <span>/</span>
                            <Link href={`/industry/${data.industryId}`} className="hover:text-primary">
                                {data.industryName}
                            </Link>
                            <span>/</span>
                            <span>{data.subIndustryName}</span>
                        </div>

                        {/* Back Button */}
                        <Link 
                            href={`/industry/${data.industryId}`}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to {data.industryName}</span>
                        </Link>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {data.subIndustryName}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-6">
                            {data.industryName} Specialization
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <Badge 
                                className={`text-white ${
                                    insights.demandLevel === 'High' ? 'bg-green-500 hover:bg-green-600' :
                                    insights.demandLevel === 'Medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                    'bg-red-500 hover:bg-red-600'
                                }`}
                            >
                                {insights.demandLevel} Demand
                            </Badge>
                            <Badge 
                                variant="outline"
                                className={
                                    insights.marketOutlook === 'High' ? 'border-green-500 text-green-600' :
                                    insights.marketOutlook === 'Medium' ? 'border-yellow-500 text-yellow-600' :
                                    'border-red-500 text-red-600'
                                }
                            >
                                Outlook: {insights.marketOutlook}
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{insights.growthRate}% Growth</span>
                            </Badge>
                        </div>

                        {/* Last Updated */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Updated {formatDistanceToNow(new Date(insights.lastUpdated))} ago</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Primary Skills */}
                    {techStack?.primarySkills && (
                        <section>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">Essential Skills</h2>
                                <p className="text-muted-foreground">
                                    Core competencies required for this specialization
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {techStack.primarySkills.map((skill, index) => (
                                    <Badge key={index} variant="default" className="text-base py-2 px-4">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Salary Chart */}
                    <section>
                        <SalaryChart salaryRanges={insights.salaryRanges} />
                    </section>

                    {/* Tech Stack & Tools Grid */}
                    {techStack && (
                        <section>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">Tech Stack & Tools</h2>
                                <p className="text-muted-foreground">
                                    Technologies and tools you'll work with
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Technologies */}
                                {techStack.techStack && techStack.techStack.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Code className="h-5 w-5 text-primary" />
                                                <span>Technologies</span>
                                            </CardTitle>
                                            <CardDescription>Languages, frameworks, databases</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {techStack.techStack.map((tech, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Tools */}
                                {techStack.tools && techStack.tools.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Wrench className="h-5 w-5 text-green-500" />
                                                <span>Tools & Software</span>
                                            </CardTitle>
                                            <CardDescription>Development and productivity tools</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {techStack.tools.map((tool, index) => (
                                                    <Badge key={index} variant="outline">
                                                        {tool}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Certifications */}
                                {techStack.certifications && techStack.certifications.length > 0 && (
                                    <Card className="md:col-span-2">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Award className="h-5 w-5 text-yellow-500" />
                                                <span>Valuable Certifications</span>
                                            </CardTitle>
                                            <CardDescription>Professional credentials that boost your career</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {techStack.certifications.map((cert, index) => (
                                                    <Badge key={index} variant="outline" className="border-yellow-500 text-yellow-600">
                                                        {cert}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Key Trends */}
                    {insights.keyTrends && insights.keyTrends.length > 0 && (
                        <section>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">Industry Trends</h2>
                                <p className="text-muted-foreground">
                                    What's shaping the future of this field
                                </p>
                            </div>
                            <Card>
                                <CardContent className="pt-6">
                                    <ul className="space-y-3">
                                        {insights.keyTrends.map((trend, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <span className="text-primary text-xl mt-1">•</span>
                                                <span className="text-lg">{trend}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </section>
                    )}

                    {/* CTA Section */}
                    <section className="text-center p-8 bg-gradient-to-br from-primary/10 to-background rounded-lg border">
                        <h2 className="text-2xl font-bold mb-4">
                            Ready to pursue a career in {data.subIndustryName}?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Start building your skills and preparing for interviews with AI-powered tools.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <a href="/resume">
                                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
                                    Create Resume
                                </button>
                            </a>
                            <a href="/interview">
                                <button className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10">
                                    Practice Interview
                                </button>
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
