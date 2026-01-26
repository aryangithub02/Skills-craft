import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function SubIndustryGrid({ industrySlug, subIndustries, demandLevel, growthRate }) {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Explore Specializations</h2>
                <p className="text-muted-foreground">
                    Discover specific career paths within this industry
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subIndustries.map((sub) => (
                    <Link
                        key={sub.slug}
                        href={`/industry/${industrySlug}/${sub.slug}`}
                        className="block group"
                    >
                        <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                    {sub.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Demand Badge */}
                                <div className="flex items-center gap-2">
                                    <Badge 
                                        className={`text-white ${
                                            sub.demand === 'High' ? 'bg-green-500' :
                                            sub.demand === 'Medium' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}
                                        variant="default"
                                    >
                                        {sub.demand} Demand
                                    </Badge>
                                </div>

                                {/* Growth Indicator */}
                                {sub.growth !== undefined && (
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="font-semibold">{sub.growth > 0 ? "+" : ""}{sub.growth}% Growth</span>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-sm text-primary font-medium pt-2">
                                    <span>Learn more</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
