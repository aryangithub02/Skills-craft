const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ Error: GEMINI_API_KEY is not defined in .env.local");
        process.exit(1);
    }

    console.log("🔑 API Key found. Initializing Gemini client...");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        console.log("🤖 Sending test prompt to gemini-2.0-flash-exp...");
        const result = await model.generateContent("Hello! Are you working correctly? Please reply with a short JSON object: { \"status\": \"online\", \"message\": \"Yes!\" }");
        const response = await result.response;
        const text = response.text();

        console.log("\n✅ Response received:");
        console.log(text);
    } catch (error) {
        console.error("\n❌ Error testing Gemini API:");
        console.error(error.message);
    }
}

testGemini();
