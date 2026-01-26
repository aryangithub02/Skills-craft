const OpenAI = require("openai");
require("dotenv").config({ path: ".env.local" });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error("❌ Error: API Key is not defined in .env.local");
        process.exit(1);
    }

    console.log("🔑 API Key found. Initializing OpenAI (OpenRouter) client...");

    try {
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
        });

        console.log("🤖 Sending test prompt to google/gemini-2.0-flash-001...");
        const response = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "user", content: "Hello! Are you working correctly? Please reply with a short JSON object: { \"status\": \"online\", \"message\": \"Yes!\" }" }
            ],
        });

        const text = response.choices[0].message.content;

        console.log("\n✅ Response received:");
        console.log(text);
    } catch (error) {
        console.error("\n❌ Error testing OpenRouter API:");
        console.error(error.message);
    }
}

testGemini();
