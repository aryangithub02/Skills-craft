import { generateIndustryInsights } from "@/actions/industry";
import { NextResponse } from "next/server";

/**
 * Trigger a real-time industry insights fetch for a test industry and return the result as JSON.
 *
 * @returns {NextResponse} JSON response with:
 * - On success: `{ success: true, message: string, data: any }`.
 * - On error: `{ success: false, error: string }` and HTTP status 500.
 */
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