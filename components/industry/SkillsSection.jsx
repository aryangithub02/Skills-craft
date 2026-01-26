import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Target } from "lucide-react";

/**
 * Render a three-panel skills overview showing top skills, key trends, and recommended skills.
 *
 * @param {{topSkills?: string[], keyTrends?: string[], recommendedSkills?: string[]}} insights - Collections used to populate each panel: `topSkills` and `recommendedSkills` are arrays of skill strings, and `keyTrends` is an array of trend strings. Each property is optional.
 * @returns {JSX.Element} A React element containing three Card panels populated from the provided insights.
 */
export default function SkillsSection({ insights }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Skills */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        <span>Top Skills</span>
                    </CardTitle>
                    <CardDescription>Most in-demand skills</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {insights.topSkills?.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Key Trends */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <span>Key Trends</span>
                    </CardTitle>
                    <CardDescription>Industry movements</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {insights.keyTrends?.map((trend, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{trend}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Recommended Skills */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        <span>Recommended Skills</span>
                    </CardTitle>
                    <CardDescription>Skills to develop</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {insights.recommendedSkills?.map((skill, index) => (
                            <Badge key={index} variant="outline" className="border-primary text-primary">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}