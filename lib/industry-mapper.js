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
 * List all insight category display names.
 * @returns {string[]} An array of insight category names.
 */
export function getAllInsightCategories() {
    return industries.map(ind => ind.name);
}

/**
 * Determine whether a formatted industry identifier corresponds to a known industry.
 * @param {string} formattedIndustry - Formatted industry string whose leading segment before `-` is treated as the industry id (e.g. `healthcare-telemedicine`).
 * @returns {boolean} `true` if the leading segment matches a known industry id, `false` otherwise.
 */
export function isValidIndustry(formattedIndustry) {
    if (!formattedIndustry) return false;
    const industryId = formattedIndustry.split('-')[0];
    return industries.some(i => i.id === industryId);
}

/**
 * Resolve a formatted industry string into human-readable industry and sub-industry names.
 * @param {string} formattedIndustry - Formatted as "industryId-sub-industry" (e.g., "tech-software-development").
 * @returns {{industry: string, subIndustry: string}|null} Object with `industry` and `subIndustry` display names, or `null` if the industry id is not found or the input is empty.
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
 * Retrieve the complete tech stack for a sub-industry.
 * @param {string} formattedIndustry - Formatted industry identifier (e.g., "tech-software-development").
 * @returns {object|null} The tech stack object containing `techStack`, `tools`, `skills`, and `certifications`, or `null` if no data exists.
 */
export function getSubIndustryTechStack(formattedIndustry) {
    return getTechStack(formattedIndustry);
}

/**
 * Retrieve the primary skills for the specified sub-industry.
 * @param {string} formattedIndustry - Formatted industry identifier (e.g., "industry-sub-industry-slug").
 * @returns {string[]} Primary skill names for the sub-industry (typically 3–5 items).
 */
export function getSubIndustryPrimarySkills(formattedIndustry) {
    return getPrimarySkills(formattedIndustry);
}

/**
 * Return the recommended tech stack items for the given formatted industry.
 * @param {string} formattedIndustry - Formatted industry identifier (e.g., "industryId-subIndustrySlug").
 * @returns {string[]} The recommended tech stack item names for the sub-industry, or an empty array if none are available.
 */
export function getRecommendedTechStack(formattedIndustry) {
    const stack = getTechStack(formattedIndustry);
    return stack?.techStack || [];
}

/**
 * Retrieve recommended tools for the specified sub-industry.
 * @param {string} formattedIndustry - Formatted industry identifier (e.g., "industryId-sub-industry-slug").
 * @returns {string[]} An array of recommended tools for the sub-industry, or an empty array if none are available.
 */
export function getRecommendedTools(formattedIndustry) {
    const stack = getTechStack(formattedIndustry);
    return stack?.tools || [];
}

/**
 * Retrieves the recommended certifications for the given formatted industry.
 * @param {string} formattedIndustry - Formatted industry identifier (e.g., "industry-subindustry").
 * @returns {string[]} The recommended certifications for the sub-industry, or an empty array if none are available.
 */
export function getRecommendedCertifications(formattedIndustry) {
    const stack = getTechStack(formattedIndustry);
    return stack?.certifications || [];
}