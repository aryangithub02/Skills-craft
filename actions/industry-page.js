"use server";

import { db } from "@/lib/prisma";
import { industries } from "@/data/industries";
import { getSubIndustryTechStack } from "@/lib/industry-mapper";

/**
 * Produce the landing-page list of industries merged with any stored insights.
 * @returns {Promise<Array<{id: string, name: string, slug: string, growthRate: number|null, demandLevel: string|null, marketOutlook: string|null}>>} An array of industry objects where each item contains `id`, `name`, `slug` (same as `id`), and insight fields `growthRate`, `demandLevel`, and `marketOutlook`; insight fields are `null` when no stored insight exists.
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
 * Retrieve an overview for a broad industry category identified by its slug.
 * @param {string} industrySlug - The industry identifier/slug (e.g., "tech", "healthcare").
 * @returns {object|null} An object containing `id`, `name`, `slug`, `subIndustries`, and an `insights` object with `salaryRanges`, `growthRate`, `demandLevel`, `topSkills`, `marketOutlook`, `keyTrends`, `recommendedSkills`, `lastUpdated`, and `nextUpdate`, or `null` if the industry or its insights are not found.
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
 * Retrieve details, insights, and tech stack for a specific sub-industry.
 *
 * @param {string} industrySlug - Parent industry identifier (e.g., "tech").
 * @param {string} subIndustrySlug - Sub-industry identifier (e.g., "software-development").
 * @returns {Object|null} An object containing sub-industry data or `null` if the parent industry, sub-industry, or insights cannot be resolved.
 *
 * Returned object shape:
 * {
 *   industryId: string,
 *   industryName: string,
 *   subIndustrySlug: string,
 *   subIndustryName: string,
 *   insights: {
 *     salaryRanges: any,
 *     growthRate: any,
 *     demandLevel: any,
 *     marketOutlook: any,
 *     keyTrends: any,
 *     lastUpdated: any
 *   },
 *   techStack: {
 *     primarySkills: any,
 *     techStack: any,
 *     tools: any,
 *     frameworks: any,
 *     certifications: any
 *   } | null
 * }
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
 * Retrieve sub-industry summaries for a given industry.
 * @param {string} industrySlug - The industry's id/slug to look up.
 * @returns {Array<{name: string, slug: string, growth: number|null, demand: string|null, industrySlug: string}>} An array of sub-industry objects each with `name`, `slug`, `growth`, `demand`, and `industrySlug`; returns an empty array if the industry is not found.
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