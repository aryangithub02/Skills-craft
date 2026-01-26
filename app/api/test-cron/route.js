import { generateIndustryInsights } from "@/actions/industry";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const testIndustry = "Technology";
        console.log(`🌽 Testing 'Corn Function' for: ${testIndustry}`);

        // This forces a call to OpenRouter
        const insights = await generateIndustryInsights(testIndustry);

        return NextResponse.json({
            success: true,
            message: "Real-time data fetched from OpenRouter",
            data: insights
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
