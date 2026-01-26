import { db } from "../lib/prisma.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pLimit from "p-limit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
    },
});

const failedIndustries = [
    'Healthcare',
    'Retail',
    'Consulting',
    'Media & Entertainment',
    'Legal'
];

async function generateInsight(industry) {
    const prompt = `
Analyze the current state of the "${industry}" industry and provide insights in ONLY the following JSON format. DO NOT return markdown blocks or text, just the JSON object.

{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string (optional)" }
  ],
  "growthRate": number (percentage),
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["string", "string"],
  "marketOutlook": "High" | "Medium" | "Low",
  "keyTrends": ["string", "string"],
  "recommendedSkills": ["string", "string"]
}

IMPORTANT: Return at least 5 common roles for salary ranges.
Growth rate should be a realistic percentage (e.g., 5.2).
Ensure all enums match exactly: High, Medium, Low.
  `;

    // Add timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);

    try {
        const result = await model.generateContent(prompt, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const text = result.response.text();
        const cleanedText = text
            .replace(/```(?:json)?\n?/g, "")
            .replace(/```/g, "")
            .trim();

        const insights = JSON.parse(cleanedText);

        // Save to DB
        await db.industryInsight.upsert({
            where: { industry },
            update: {
                ...insights,
                lastUpdated: new Date(),
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            create: {
                industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return { industry, success: true };
    } catch (error) {
        clearTimeout(timeoutId);
        return { industry, success: false, error: error.message };
    }
}

async function retryFailed() {
    console.log(`🚀 Retrying ${failedIndustries.length} failed industries with parallel processing...\n`);

    const limit = pLimit(3);

    const promises = failedIndustries.map((industry) =>
        limit(async () => {
            console.log(`📊 Processing: ${industry}...`);
            const result = await generateInsight(industry);

            if (result.success) {
                console.log(`✅ SUCCESS: ${industry}`);
            } else {
                console.log(`❌ FAILED: ${industry}`);
                console.log(`   Error: ${result.error}\n`);
            }

            return result;
        })
    );

    const results = await Promise.all(promises);

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✨ RETRY COMPLETE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Successful: ${successCount}/${failedIndustries.length}`);
    console.log(`❌ Failed: ${failedCount}/${failedIndustries.length}`);

    if (failedCount > 0) {
        console.log(`\n❌ Failed industries:`);
        results.filter(r => !r.success).forEach(r => {
            console.log(`   - ${r.industry}: ${r.error}`);
        });
    }

    await db.$disconnect();
}

retryFailed().catch(console.error);
