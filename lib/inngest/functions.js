import { inngest } from "./client";
import { db } from "@/lib/prisma";
import { generateIndustryInsights } from "@/actions/industry";

export const updateIndustryInsights = inngest.createFunction(
    { id: "weekly-industry-updates" },
    { cron: "0 0 * * 0" }, // Weekly on Sunday at Midnight
    async ({ step }) => {
        // 1. Fetch all industries
        const industries = await step.run("fetch-industries", async () => {
            return await db.industryInsight.findMany({
                select: { industry: true },
            });
        });

        // 2. Process each industry
        for (const { industry } of industries) {
            await step.run(`update-${industry}`, async () => {
                await generateIndustryInsights(industry);
            });
        }

        return { success: true, count: industries.length };
    }
);
