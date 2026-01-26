// Add to the end of industry-mapper.js

import { getTechStack, getPrimarySkills } from "@/data/tech-stacks";

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
