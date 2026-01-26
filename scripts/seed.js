const { PrismaClient } = require("@prisma/client");
require("dotenv").config({ path: ".env.local" }); // Load environment variables explicitly

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    try {
        // 1. Create an Industry Insight (related data)
        const insight = await prisma.industryInsight.upsert({
            where: { industry: "Tech" },
            update: {},
            create: {
                industry: "Tech",
                salaryRanges: [
                    { role: "Junior Dev", min: 50000, max: 80000 },
                    { role: "Senior Dev", min: 100000, max: 150000 },
                ],
                growthRate: 15.5,
                demandLevel: "High",
                topSkills: ["AI", "Cloud", "Security"],
                marketOutlook: "High",
                keyTrends: ["Remote Work", "AI Integration"],
                recommendedSkills: ["Python", "TensorFlow"],
            },
        });

        console.log("✅ Created Industry Insight:", insight.id);

        // 2. Create a User manually
        const user = await prisma.user.upsert({
            where: { email: "test@example.com" },
            update: {},
            create: {
                clerkUserId: "manual-test-user-01",
                email: "test@example.com",
                name: "Test User",
                imageUrl: "https://github.com/shadcn.png",
                industry: "Tech",
                skills: ["React", "Next.js", "Prisma"],
            },
        });

        console.log("✅ Created User:", user.id);

    } catch (error) {
        if (error.code === 'P2002') {
            console.log("⚠️  Data already exists (Unique constraint violation)");
        } else {
            console.error("❌ Error creating data:", error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
