import { db } from "../lib/prisma.js";

async function checkInsights() {
    const allIndustries = [
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

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📊 INDUSTRY INSIGHTS STATUS REPORT`);
    console.log(`${'='.repeat(70)}\n`);

    const insights = await db.industryInsight.findMany({
        select: {
            industry: true,
            growthRate: true,
            demandLevel: true,
            lastUpdated: true,
        },
        orderBy: {
            industry: 'asc',
        }
    });

    const existingIndustries = insights.map(i => i.industry);
    const missing = allIndustries.filter(i => !existingIndustries.includes(i));

    console.log(`✅ Generated (${insights.length}/${allIndustries.length}):\n`);
    insights.forEach(insight => {
        console.log(`   ✓ ${insight.industry.padEnd(30)} Growth: ${insight.growthRate}% | Demand: ${insight.demandLevel}`);
    });

    if (missing.length > 0) {
        console.log(`\n❌ Missing (${missing.length}):\n`);
        missing.forEach(industry => {
            console.log(`   ✗ ${industry}`);
        });
    }

    console.log(`\n${'='.repeat(70)}\n`);

    await db.$disconnect();
}

checkInsights().catch(console.error);
