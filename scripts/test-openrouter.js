require("dotenv").config({ path: ".env.local" });

/**
 * Tests connectivity to the OpenRouter chat completions API using the OPENROUTER_API_KEY environment variable.
 *
 * If OPENROUTER_API_KEY is not set, the process exits with code 1. On success, prints the full JSON response and, if present, the first choice's message content. Errors encountered during the request are logged.
 */
async function testOpenRouter() {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error("❌ Error: OPENROUTER_API_KEY is not defined in .env.local");
        process.exit(1);
    }

    console.log("🔑 API Key found. Testing OpenRouter connection...");

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001", // Using a Gemini model via OpenRouter
                messages: [
                    { role: "user", content: "Hello! Are you working? Reply with JSON: { \"status\": \"online\" }" }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Request failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log("\n✅ Response received:");
        console.log(JSON.stringify(data, null, 2));

        if (data.choices && data.choices.length > 0) {
            console.log("\n💬 Content:");
            console.log(data.choices[0].message.content);
        }

    } catch (error) {
        console.error("\n❌ Error testing OpenRouter API:");
        console.error(error.message);
    }
}

testOpenRouter();