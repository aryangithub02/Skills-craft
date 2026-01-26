const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

/**
 * Seed industry insights from data/insights.json into the database.
 *
 * Reads ../data/insights.json, upserts each insight into the Prisma `industryInsight`
 * table keyed by `industry`, and sets `lastUpdated` to the current time and
 * `nextUpdate` to 30 days from now for both create and update paths.
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