const { OpenAI } = require("openai");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

async function verify() {
    console.log("🚀 Starting Verification Process...\n");

    let openAiSuccess = false;
    let dbSuccess = false;

    // 1. Verify OpenRouter
    console.log("🤖 Checking OpenRouter Connectivity...");
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ API Key missing. Set GEMINI_API_KEY or OPENROUTER_API_KEY.");
    } else {
        try {
            const openai = new OpenAI({
                baseURL: "https://openrouter.ai/api/v1",
                apiKey: apiKey,
            });

            const response = await openai.chat.completions.create({
                model: "meta-llama/llama-3.3-70b-instruct",
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
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    let prisma;
    let pool;
    try {
        const connectionString = process.env.DATABASE_URL;
        pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
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
