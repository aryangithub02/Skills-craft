// Add to the end of industry-mapper.js

import { getTechStack, getPrimarySkills } from "@/data/tech-stacks";

/**
 * Retrieve the complete tech stack for a sub-industry.
 * @param {string} formattedIndustry - Sub-industry identifier formatted as a hyphen-separated string (e.g., "tech-software-development").
 * @returns {object|null} The tech stack object containing skills, tools, frameworks, and certifications, or `null` if not found.
 */
export function getSubIndustryTechStack(formattedIndustry) {
    return getTechStack(formattedIndustry);
}

/**
 * Return the primary skills for a sub-industry.
 * @param {string} formattedIndustry - Sub-industry identifier formatted for lookup.
 * @returns {string[]} The primary skills for the given sub-industry, or an empty array if unavailable.
 */
export function getSubIndustryPrimarySkills(formattedIndustry) {
    return getPrimarySkills(formattedIndustry);
}

/**
 * Provides recommended tech stack items for a sub-industry.
 * @param {string} formattedIndustry - The formatted sub-industry identifier.
 * @returns {string[]} The tech stack items for the sub-industry; an empty array if unavailable.
 */
export function getRecommendedTechStack(formattedIndustry) {
    const stack = getTechStack(formattedIndustry);
    return stack?.techStack || [];
}

/**
 * Get recommended tools for the specified sub-industry.
 * @param {string} formattedIndustry - Sub-industry identifier in the expected formatted form.
 * @returns {string[]} The recommended tools for the sub-industry, or an empty array if none are available.
 */
export function getRecommendedTools(formattedIndustry) {
    const stack = getTechStack(formattedIndustry);
    return stack?.tools || [];
}

/**
 * Retrieve recommended certifications for a sub-industry.
 * @param {string} formattedIndustry - Sub-industry identifier formatted for tech-stack lookup.
 * @returns {string[]} Array of certification names for the sub-industry; empty array if none are available.
 */
export function getRecommendedCertifications(formattedIndustry) {
    const stack = getTechStack(formattedIndustry);
    return stack?.certifications || [];
}