"use server";

import { db } from "@/lib/prisma";

export async function generateIndustryInsights(industry: string) {
    console.log(`🌽 Generating insights for: ${industry}`);
    const prompt = `
    Analyze the current state of the "${industry}" industry IN INDIA and return ONLY valid JSON. DO NOT return any preamble or explanations.
    
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
    
    IMPORTANT: 
    - Salary figures MUST be in annual Indian Rupees (INR).
    - EXTREMELY IMPORTANT: The numbers must be realistic annual salaries for INDIA. 
      - Focus on a mix of Entry-Level (0-3 years) to Mid-Senior (5-8 years) roles.
      - Example Range: 3,00,000 to 25,00,000 (3 Lakhs to 25 Lakhs). 
      - Do NOT inflate the numbers. Provide conservative, market-standard figures.
      - Do NOT return USD-like numbers (e.g., 100000 is too low). ensure Min is at least 300000.
    - Growth Rate: Return a realistic annual growth percentage (e.g. 10.5, 15, 20). Do not use % symbol in the number.
    - Return at least 5 common roles.
    `;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`,
                "X-Title": "AI Career Coach",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3-8b-instruct",
                "messages": [
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API Error: ${response.statusText} (${response.status})`);
        }

        const result = await response.json();
        const text = result.choices[0].message.content;

        // Clean JSON
        const cleanedText = text
            .replace(/```(?:json)?/g, "")
            .replace(/```/g, "")
            .trim();

        // FIX: Remove commas from numbers (e.g. 1,00,000 -> 100000)
        // This handles standard Indian number formatting (lakhs/crores) correctly
        const fixedJsonText = cleanedText.replace(/(\d),\s*(?=\d)/g, '$1');

        let insights;
        try {
            insights = JSON.parse(fixedJsonText);
        } catch (jsonError) {
            console.error("❌ JSON Parse Failed. Raw text:", text);
            throw new Error("Failed to parse AI response as JSON");
        }

        // Validate and sanitize Enums
        const validLevels = ["High", "Medium", "Low"];
        const sanitizeEnum = (val) => {
            // Capitalize first letter, lower case rest (e.g., "HIGH" -> "High", "high" -> "High")
            if (!val) return "Medium";
            const formatted = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
            return validLevels.includes(formatted) ? formatted : "Medium";
        };

        insights.demandLevel = sanitizeEnum(insights.demandLevel);
        insights.marketOutlook = sanitizeEnum(insights.marketOutlook);

        console.log("✅ Insights generated & sanitized:", {
            industry,
            demand: insights.demandLevel,
            salaryCount: insights.salaryRanges?.length
        });

        return await db.industryInsight.upsert({
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
    } catch (error) {
        console.error(`❌ Error generating insights for ${industry}:`, error);
        return null;
    }
}
