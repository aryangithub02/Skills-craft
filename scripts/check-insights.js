const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

// Load envs
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Checks the database for industry insights and logs either a guidance message when none exist or a summary for each found insight.
 *
 * The summary includes the total count and, for each insight, logs the industry, lastUpdated, a truncated JSON representation of salaryRanges, and topSkills.
 */
async function main() {
    console.log("🔍 Checking Industry Insights in Database...");

    const insights = await prisma.industryInsight.findMany();

    if (insights.length === 0) {
        console.log("❌ No insights found. Try visiting the test route first: /api/test-cron");
    } else {
        console.log(`✅ Found ${insights.length} insights:`);
        insights.forEach(i => {
            console.log(`\n📌 Industry: ${i.industry}`);
            console.log(`   Updated: ${i.lastUpdated}`);
            console.log(`   Salary Ranges: ${JSON.stringify(i.salaryRanges).substring(0, 100)}...`);
            console.log(`   Top Skills: ${i.topSkills}`);
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());