const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Retrieve industry entries and the "Technology" industry insight from the database and log them.
 *
 * Queries all industryInsight records selecting only the `industry` field, then queries for the record
 * whose `industry` is "Technology", and logs both results to the console.
 */
async function check() {
    const industries = await prisma.industryInsight.findMany({
        select: { industry: true }
    });
    console.log("Existing industries in DB:", industries);

    const tech = await prisma.industryInsight.findUnique({
        where: { industry: "Technology" }
    });
    console.log("Technology insight:", tech);
}

check()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });