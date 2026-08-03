import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function IndustryHero({ industry, insights }) {
    return (
        <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="text-sm text-muted-foreground mb-4">
                        <Link href="/industry" className="hover:text-primary">Industries</Link>
                        <span className="mx-2">/</span>
                        <span>{industry.name}</span>
                    </div>

                    {/* Title  */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {industry.name}
                    </h1>

                    {/* Badges Row */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {/* Demand Level */}
                        <Badge 
                            className={`text-white ${
                                insights.demandLevel === 'High' ? 'bg-green-500 hover:bg-green-600' :
                                insights.demandLevel === 'Medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                'bg-red-500 hover:bg-red-600'
                            }`}
                        >
                            {insights.demandLevel} Demand
                        </Badge>

                        {/* Market Outlook */}
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

                        {/* Growth Rate */}
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{insights.growthRate}% Growth</span>
                        </Badge>
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Updated {formatDistanceToNow(new Date(insights.lastUpdated))} ago
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
