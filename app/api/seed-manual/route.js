import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data/insights.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const insightsData = JSON.parse(fileContent);

        console.log(`📦 Found ${insightsData.length} industry insights to seed.`);

        let count = 0;
        for (const data of insightsData) {
            await db.industryInsight.upsert({
                where: { industry: data.industry },
                update: {
                    ...data,
                    lastUpdated: new Date(),
                    nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Lock for 30 days
                },
                create: {
                    ...data,
                    lastUpdated: new Date(),
                    nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });
            count++;
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${count} industry insights from manual file.`
        });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            cwd: process.cwd(),
            pathAttempted: path.join(process.cwd(), 'data/insights.json')
        }, { status: 200 });
    }
}
