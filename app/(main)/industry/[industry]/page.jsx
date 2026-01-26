import { getIndustryOverview, getSubIndustries } from "@/actions/industry-page";
import { notFound } from "next/navigation";
import IndustryHero from "@/components/industry/IndustryHero";
import SalaryChart from "@/components/industry/SalaryChart";
import SkillsSection from "@/components/industry/SkillsSection";
import SubIndustryGrid from "@/components/industry/SubIndustryGrid";

export async function generateMetadata({ params }) {
    const { industry: industrySlug } = await params;
    const industry = await getIndustryOverview(industrySlug);
    
    if (!industry) {
        return {
            title: "Industry Not Found",
        };
    }

    return {
        title: `${industry.name} Industry Insights | AI Career Coach`,
        description: `Explore ${industry.name} industry insights, salary trends, top skills, and career opportunities.`,
    };
}

export default async function IndustryOverviewPage({ params }) {
    const { industry: industrySlug } = await params;
    const industryData = await getIndustryOverview(industrySlug);

    if (!industryData) {
        notFound();
    }

    const subIndustries = await getSubIndustries(industrySlug);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <IndustryHero 
                industry={industryData} 
                insights={industryData.insights} 
            />

            {/* Main Content */}
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Salary Insights Chart */}
                    <section>
                        <SalaryChart salaryRanges={industryData.insights.salaryRanges} />
                    </section>

                    {/* Skills & Trends */}
                    <section>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Skills & Market Trends</h2>
                            <p className="text-muted-foreground">
                                What you need to succeed in this industry
                            </p>
                        </div>
                        <SkillsSection insights={industryData.insights} />
                    </section>

                    {/* Sub-Industries Explorer */}
                    <section>
                        <SubIndustryGrid 
                            industrySlug={industryData.slug}
                            subIndustries={subIndustries}
                            demandLevel={industryData.insights.demandLevel}
                            growthRate={industryData.insights.growthRate}
                        />
                    </section>

                    {/* CTA Section */}
                    <section className="mt-16 text-center p-8 bg-gradient-to-br from-primary/10 to-background rounded-lg border">
                        <h2 className="text-2xl font-bold mb-4">
                            Ready to start your {industryData.name} career?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Build your resume, practice interviews, and get personalized career guidance with AI.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <a href="/resume">
                                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
                                    Build Resume
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
