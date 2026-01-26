import { generateIndustryInsights } from '../actions/industry.js';

const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Marketing',
    'Consulting',
    'Real Estate',
    'Hospitality',
    'Transportation',
    'Energy',
    'Agriculture',
    'Media & Entertainment',
    'Legal',
];

/**
 * Iterate over the predefined industries, generate insights for each using Gemini AI, log key fields, and exit the process when complete.
 *
 * For each industry this function logs the growth rate, demand level, and the first three top skills; it pauses briefly between requests to mitigate rate limiting and continues to the next industry on per-industry errors.
 */
async function seedIndustryInsights() {
    console.log('🌱 Starting industry insights generation with Gemini AI...\n');

    for (const industry of industries) {
        try {
            console.log(`📊 Generating insights for: ${industry}...`);
            const insight = await generateIndustryInsights(industry);
            console.log(`✅ Successfully generated insights for ${industry}`);
            console.log(`   - Growth Rate: ${insight.growthRate}%`);
            console.log(`   - Demand Level: ${insight.demandLevel}`);
            console.log(`   - Top Skills: ${insight.topSkills.slice(0, 3).join(', ')}\n`);

            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`❌ Error generating insights for ${industry}:`, error.message);
            console.log('   Continuing with next industry...\n');
        }
    }

    console.log('✨ Industry insights generation complete!');
    process.exit(0);
}

seedIndustryInsights().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});