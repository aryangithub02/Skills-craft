import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Checks the database for industryInsight records, logs the list of industries, and logs whether a "Technology" entry exists.
 *
 * Ensures the Prisma client is disconnected after the check and logs any encountered errors.
 */
async function check() {
    try {
        const industries = await prisma.industryInsight.findMany({
            select: { industry: true }
        });
        console.log("Existing industries in DB:", industries);

        const tech = await prisma.industryInsight.findUnique({
            where: { industry: "Technology" }
        });

        if (tech) {
            console.log("Technology insight: FOUND");
        } else {
            console.log("Technology insight: NOT FOUND");
        }

    } catch (e) {
        console.error("Error checking DB:", e);
    } finally {
        await prisma.$disconnect();
    }
}

check();