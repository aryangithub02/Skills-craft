import { generateIndustryInsights } from "@/actions/industry";
import { NextResponse } from "next/server";
import pLimit from "p-limit";
import { getAllInsightCategories } from "@/lib/industry-mapper";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Get all insight categories from the industries definition
const allIndustries = getAllInsightCategories();

export async function GET(request) {
    try {
        // Support selective retry via query param: ?retry=Healthcare,Retail,Legal
        const { searchParams } = new URL(request.url);
        const retryParam = searchParams.get('retry');

        const industries = retryParam
            ? retryParam.split(',').map(i => i.trim())
            : allIndustries;

        console.log(`🚀 Starting parallel generation for ${industries.length} industries...`);

        // Use parallel processing with concurrency limit
        const limit = pLimit(3);

        const promises = industries.map((industry) =>
            limit(async () => {
                try {
                    console.log(`📊 Generating insights for: ${industry}...`);
                    const insight = await generateIndustryInsights(industry);

                    console.log(`✅ Successfully generated insights for ${industry}`);

                    return {
                        industry,
                        success: true,
                        data: {
                            growthRate: insight.growthRate,
                            demandLevel: insight.demandLevel,
                            topSkills: insight.topSkills.slice(0, 3),
                        }
                    };
                } catch (error) {
                    console.error(`❌ Error for ${industry}:`, error.message);
                    return {
                        industry,
                        success: false,
                        error: error.message,
                    };
                }
            })
        );

        const results = await Promise.all(promises);
        const successCount = results.filter(r => r.success).length;

        return NextResponse.json({
            message: `Generated insights for ${successCount}/${industries.length} industries`,
            results,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
