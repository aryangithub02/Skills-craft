const { OpenAI } = require("openai");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config({ path: ".env.local" });

async function verify() {
    console.log("🚀 Starting Verification Process...\n");

    let openAiSuccess = false;
    let dbSuccess = false;

    // 1. Verify OpenRouter
    console.log("🤖 Checking OpenRouter Connectivity...");
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error("❌ API Key missing. Set GEMINI_API_KEY or OPENROUTER_API_KEY.");
    } else {
        try {
            const openai = new OpenAI({
                baseURL: "https://openrouter.ai/api/v1",
                apiKey: apiKey,
            });

            const response = await openai.chat.completions.create({
                model: "google/gemini-2.0-flash-001",
                messages: [{ role: "user", content: "Ping" }],
            });

            console.log(`✅ OpenRouter Connected! Response: ${response.choices[0].message.content}`);
            openAiSuccess = true;
        } catch (error) {
            console.error(`❌ OpenRouter Failed: ${error.message}`);
        }
    }

    console.log("\n--------------------------------------------------\n");

    // 2. Verify Database
    console.log("🗄️ Checking Database Connectivity...");
    let prisma;
    try {
        prisma = new PrismaClient();
        await prisma.$connect();
        const count = await prisma.industryInsight.count();
        console.log(`✅ Database Connected! Found ${count} existing insights.`);
        dbSuccess = true;
    } catch (error) {
        console.error(`❌ Database Failed: ${error.message}`);
    } finally {
        if (prisma) await prisma.$disconnect();
    }

    console.log("\n--------------------------------------------------\n");
    console.log("🏁 Summary:");
    console.log(`   OpenRouter: ${openAiSuccess ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`   Database:   ${dbSuccess ? "✅ PASS" : "❌ FAIL"}`);

    if (!openAiSuccess || !dbSuccess) {
        process.exit(1);
    }
}

verify();
