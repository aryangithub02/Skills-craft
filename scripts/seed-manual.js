const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' }); // Load env vars
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

/**
 * Seed industry insights from the project's data/insights.json into the database via Prisma.
 *
 * Reads ../data/insights.json, upserts each insight into the `industryInsight` model keyed by `industry`,
 * and sets `lastUpdated` to the current date and `nextUpdate` to 30 days from now for both create and update.
 * Logs progress for each item. On error the process logs the failure and exits with code 1.
 * Always disconnects the Prisma client when finished.
 */
async function main() {
    try {
        const filePath = path.join(__dirname, '../data/insights.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const insightsData = JSON.parse(rawData);

        console.log(`📦 Found ${insightsData.length} industry insights to seed.`);

        for (const data of insightsData) {
            console.log(`Processing ${data.industry}...`);
            await prisma.industryInsight.upsert({
                where: { industry: data.industry },
                update: {
                    ...data,
                    lastUpdated: new Date(),
                    nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Lock for 30 days
                },
                create: {
                    ...data,
                    lastUpdated: new Date(),
                    nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });
        }

        console.log('✅ Successfully seeded all industry insights from file!');
    } catch (e) {
        console.error('❌ Error seeding insights:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();