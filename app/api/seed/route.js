import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
    if (process.env.NODE_ENV === "production") {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get("secret");
        if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        // 1. Create an Industry Insight (related data)
        await db.industryInsight.upsert({
            where: { industry: "Tech" },
            update: {},
            create: {
                industry: "Tech",
                salaryRanges: [
                    { role: "Junior Dev", min: 50000, max: 80000 },
                    { role: "Senior Dev", min: 100000, max: 150000 },
                ],
                growthRate: 15.5,
                demandLevel: "High",
                topSkills: ["AI", "Cloud", "Security"],
                marketOutlook: "High",
                keyTrends: ["Remote Work", "AI Integration"],
                recommendedSkills: ["Python", "TensorFlow"],
                lastUpdated: new Date(),
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            },
        });

        // 2. Create a User manually
        const user = await db.user.upsert({
            where: { email: "web-test@example.com" },
            update: {},
            create: {
                email: "web-test@example.com",
                name: "Web Test User",
                image: "https://github.com/shadcn.png",
                industry: "Tech",
                skills: ["React", "Next.js", "Prisma"],
            },
        });

        return NextResponse.json({ success: true, message: "Data seeded successfully", userId: user.id });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
