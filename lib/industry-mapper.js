/**
 * Industry Mapper Utility
 * Maps user-selected formatted industries to broad insight categories
 */

import { industries, getInsightCategory } from "@/data/industries";
import { getTechStack, getPrimarySkills } from "@/data/tech-stacks";

/**
 * Maps a formatted industry string to its insight category
 * @param {string} formattedIndustry - Industry in format: "industryId-sub-industry" (e.g., "tech-software-development")
 * @returns {string|null} - Insight category name (e.g., "Technology") or null if not found
 * 
 * @example
 * mapToInsightCategory("tech-software-development") // → "Technology"
 * mapToInsightCategory("healthcare-nursing") // → "Healthcare"
 * mapToInsightCategory("finance-investment-banking") // → "Finance"
 */
export function mapToInsightCategory(formattedIndustry) {
    return getInsightCategory(formattedIndustry);
}

/**
 * Get all available insight categories
 * @returns {string[]} - Array of all insight category names
 */
export function getAllInsightCategories() {
    return industries.map(ind => ind.name);
}

/**
 * Check if a formatted industry is valid
 * @param {string} formattedIndustry - Industry to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidIndustry(formattedIndustry) {
    if (!formattedIndustry) return false;
    const industryId = formattedIndustry.split('-')[0];
    return industries.some(i => i.id === industryId);
}

/**
 * Get the industry display name from formatted string
 * @param {string} formattedIndustry - Industry in format: "industryId-sub-industry"
 * @returns {object|null} - Object with industry and subIndustry names, or null
 * 
 * @example
 * getIndustryDisplayName("tech-software-development")
 * // → { industry: "Technology", subIndustry: "Software Development" }
 */
export function getIndustryDisplayName(formattedIndustry) {
    if (!formattedIndustry) return null;

    const parts = formattedIndustry.split('-');
    const industryId = parts[0];
    const subIndustrySlug = parts.slice(1).join('-');

    const industry = industries.find(i => i.id === industryId);
    if (!industry) return null;

    // Convert slug back to display name (e.g., "software-development" → "Software Development")
    const subIndustry = industry.subIndustries.find(sub => sub.slug === subIndustrySlug);

    return {
        industry: industry.name,
        subIndustry: subIndustry ? subIndustry.name : subIndustrySlug,
    };
}

/**
 * Get complete tech stack for a sub-industry
 * @param {string} formattedIndustry - e.g., "tech-software-development"
 * @returns {object|null} Complete tech stack with skills, tools, frameworks, certifications
 */
export function getSubIndustryTechStack(formattedIndustry) {
    return getTechStack(formattedIndustry);
}

/**
 * Get only primary skills for a sub-industry
 * @param {string} formattedIndustry
 * @returns {string[]} Array of 3-5 primary skills
 */
export function getSubIndustryPrimarySkills(formattedIndustry) {
    return getPrimarySkills(formattedIndustry);
}

/**
 * Get recommended tech stack items
 * @param {string} formattedIndustry
 * @returns {string[]} Array of tech stack items
 */
export function getRecommendedTechStack(formattedIndustry) {
    const stack = getTechStack(formattedIndustry);
    return stack?.techStack || [];
}

/**
 * Get recommended tools
 * @param {string} formattedIndustry
 * @returns {string[]} Array of tools
 */
export function getRecommendedTools(formattedIndustry) {
    const stack = getTechStack(formattedIndustry);
    return stack?.tools || [];
}

/**
 * Get recommended certifications
 * @param {string} formattedIndustry
 * @returns {string[]} Array of certifications
 */
export function getRecommendedCertifications(formattedIndustry) {
    const stack = getTechStack(formattedIndustry);
    return stack?.certifications || [];
}
