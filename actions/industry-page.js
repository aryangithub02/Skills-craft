"use server";

import { db } from "@/lib/prisma";
import { industries } from "@/data/industries";
import { getSubIndustryTechStack } from "@/lib/industry-mapper";

/**
 * Get all industries for the landing page
 */
export async function getAllIndustries() {
    const allInsights = await db.industryInsight.findMany({
        select: {
            industry: true,
            growthRate: true,
            demandLevel: true,
            marketOutlook: true,
        },
    });

    // Map industries with their insights
    return industries.map(ind => {
        const insights = allInsights.find(i => i.industry === ind.name);
        return {
            id: ind.id,
            name: ind.name,
            slug: ind.id,
            growthRate: insights?.growthRate || null,
            demandLevel: insights?.demandLevel || null,
            marketOutlook: insights?.marketOutlook || null,
        };
    });
}

/**
 * Get overview for a broad industry category
 * @param {string} industrySlug - e.g., "tech", "healthcare"
 */
export async function getIndustryOverview(industrySlug) {
    // Find industry by slug
    const industry = industries.find(i => i.id === industrySlug);

    if (!industry) {
        return null;
    }

    // Get insights from database
    const insights = await db.industryInsight.findUnique({
        where: { industry: industry.name },
    });

    if (!insights) {
        return null;
    }

    return {
        id: industry.id,
        name: industry.name,
        slug: industry.id,
        subIndustries: industry.subIndustries,
        insights: {
            salaryRanges: insights.salaryRanges,
            growthRate: insights.growthRate,
            demandLevel: insights.demandLevel,
            topSkills: insights.topSkills,
            marketOutlook: insights.marketOutlook,
            keyTrends: insights.keyTrends,
            recommendedSkills: insights.recommendedSkills,
            lastUpdated: insights.lastUpdated,
            nextUpdate: insights.nextUpdate,
        },
    };
}

/**
 * Get data for a specific sub-industry
 * @param {string} industrySlug - e.g., "tech"
 * @param {string} subIndustrySlug - e.g., "software-development"
 */
import { generateIndustryInsights } from "@/actions/industry";

/**
 * Get data for a specific sub-industry
 * @param {string} industrySlug - e.g., "tech"
 * @param {string} subIndustrySlug - e.g., "software-development"
 */
export async function getSubIndustryData(industrySlug, subIndustrySlug) {
    // Get broad industry insights
    const industry = industries.find(i => i.id === industrySlug);

    if (!industry) {
        return null;
    }

    // Find sub-industry object matching the slug
    const subIndustryObj = industry.subIndustries.find(sub => sub.slug === subIndustrySlug);

    if (!subIndustryObj) {
        return null;
    }

    const subIndustryName = subIndustryObj.name;

    // Check for specific insights for this sub-industry
    // e.g., "Software Development"
    let insights = await db.industryInsight.findUnique({
        where: { industry: subIndustryName },
    });

    // If not found, generate them specifically for this sub-industry (lazy load)
    if (!insights) {
        console.log(`⚡ Generating fresh insights for Sub-Industry: ${subIndustryName}`);
        insights = await generateIndustryInsights(subIndustryName);
    }

    // If still null (API failure), fallback to broad insights? 
    // Or just return null? Let's fallback to broad to update UI, but preferably explicit.
    if (!insights) {
        const broadInsights = await db.industryInsight.findUnique({
            where: { industry: industry.name },
        });
        if (broadInsights) {
            insights = broadInsights; // Fallback
        } else {
            return null;
        }
    }

    // Get tech stack for this specific sub-industry
    const formattedIndustry = `${industrySlug}-${subIndustrySlug}`;
    const techStack = getSubIndustryTechStack(formattedIndustry);

    return {
        industryId: industry.id,
        industryName: industry.name,
        subIndustrySlug,
        subIndustryName: subIndustryName,
        insights: {
            salaryRanges: insights.salaryRanges,
            growthRate: insights.growthRate,
            demandLevel: insights.demandLevel,
            marketOutlook: insights.marketOutlook,
            keyTrends: insights.keyTrends,
            lastUpdated: insights.lastUpdated,
        },
        // Tech stack specific to this sub-industry
        techStack: techStack ? {
            primarySkills: techStack.primarySkills,
            techStack: techStack.techStack,
            tools: techStack.tools,
            frameworks: techStack.frameworks,
            certifications: techStack.certifications,
        } : null,
    };
}

/**
 * Get sub-industries for an industry (for explorer grid)
 * @param {string} industrySlug
 */
export async function getSubIndustries(industrySlug) {
    const industry = industries.find(i => i.id === industrySlug);

    if (!industry) {
        return [];
    }

    return industry.subIndustries.map(sub => ({
        name: sub.name,
        slug: sub.slug,
        growth: sub.growth,
        demand: sub.demand,
        industrySlug: industry.id,
    }));
}
