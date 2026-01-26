import { db } from "@/lib/prisma";
import { OpenAI } from "openai";

// OpenAI client initialized lazily inside function

export async function generateIndustryInsights(industry) {
    console.log(`🤖 Generating insights for: ${industry}`);

    // 1. Fetch existing data
    const oldInsights = await db.industryInsight.findUnique({
        where: { industry },
    });

    // 2. Construct Prompt
    const prompt = `
    Analyze the current state of the "${industry}" industry IN INDIA and return ONLY valid JSON.
    
    Here is the PREVIOUS data (if any):
    ${JSON.stringify(oldInsights || {}, null, 2)}

    Create UPDATED insights. 
    IMPORTANT RULES:
    1. Salary figures MUST be in annual Indian Rupees (INR).
    2. Growth rate should not fluctuate more than 15% from previous value (if exists).
    3. Demand level and Market Outlook should be stable unless there is a major shift.
    4. Return at least 5 common roles.
    
    JSON Format:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["string"],
      "marketOutlook": "High" | "Medium" | "Low",
      "keyTrends": ["string"],
      "recommendedSkills": ["string"]
    }
    `;

    try {
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "system", content: "You are an expert industry analyst." },
                { role: "user", content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 1500,
        });

        const text = response.choices[0].message.content;
        const cleanedText = text.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
        const newInsights = JSON.parse(cleanedText);

        // 3. Validation & Capping (Safety Layer)
        if (oldInsights) {
            // Cap Growth Rate
            const oldGrowth = oldInsights.growthRate || 0;
            const diff = newInsights.growthRate - oldGrowth;
            if (Math.abs(diff) > 2) { // Cap absolute change to 2% points
                newInsights.growthRate = oldGrowth + (diff > 0 ? 2 : -2);
            }

            // Ensure salary doesn't jump irrationally (simple check, can be more complex)
            // For now, we trust the prompt but could add heavy logic here if requested.
        }

        // 4. Save to DB
        return await db.industryInsight.upsert({
            where: { industry },
            update: {
                ...newInsights,
                lastUpdated: new Date(),
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            create: {
                industry,
                ...newInsights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

    } catch (error) {
        console.error(`Error generating insights for ${industry}:`, error);
        throw error; // Let Inngest handle retries
    }
}
