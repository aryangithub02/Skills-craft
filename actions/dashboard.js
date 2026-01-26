"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { generateIndustryInsights } from "./industry";
import { mapToInsightCategory } from "@/lib/industry-mapper";
import { industries } from "@/data/industries";

export async function getIndustryInsights() {
    try {
        const session = await auth();
        if (!session?.user) return null;

        const userId = session.user.id;

        const user = await db.user.findUnique({
            where: { id: userId }, // Changed from clerkUserId to id
            select: { industry: true },
        });

        if (!user || !user.industry) {
            return null;
        }

        // Map user's specific industry to broad category for insights lookup
        // e.g., "tech-software-development" → "Technology"
        const insightCategory = mapToInsightCategory(user.industry);

        if (!insightCategory) {
            return null;
        }

        const insights = await db.industryInsight.findUnique({
            where: { industry: insightCategory },
        });

        // If no insights, trigger generation in background and return null immediately
        // This prevents the dashboard from hanging for 5-10s
        if (!insights) {
            // Fire and forget - do not await
            generateIndustryInsights(insightCategory)
                .then(() => console.log(`Background generation started for ${insightCategory}`))
                .catch(err => console.error(`Background generation failed for ${insightCategory}`, err));

            return null;
        }

        // If stale, update in background but return existing data immediately
        if (insights.nextUpdate < new Date()) {
            generateIndustryInsights(insightCategory);
        }

        // Parse user industry for routing
        // Correctly handle industry IDs with dashes (e.g. "real-estate")
        const industryObj = industries.find(i => i.name === insightCategory);
        const industryId = industryObj ? industryObj.id : user.industry.split('-')[0];

        const subIndustrySlug = user.industry.replace(`${industryId}-`, '');

        return {
            ...insights,
            routing: {
                industryId,
                subIndustrySlug
            }
        };
    } catch (error) {
        console.error("Error fetching industry insights:", error);
        return null;
    }
}
