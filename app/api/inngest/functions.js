import { db } from "@/lib/prisma";
import { inngest } from "@/lib/inngest/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pLimit from "p-limit";
import { getAllInsightCategories } from "@/lib/industry-mapper";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 1500,
  },
});

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { event: "insight/generate" },
  async ({ event, step }) => {
    const { industry } = event.data;

    // 1. Check if update is needed (redundant check for safety, though trigger should handle this)
    const existingInsight = await step.run("Check Existing Insights", async () => {
      const insight = await db.industryInsight.findUnique({
        where: { industry },
      });

      // If valid insight exists and nextUpdate is in the future, skip
      if (insight && insight.nextUpdate > new Date()) {
        return "SKIP";
      }
      return null;
    });

    if (existingInsight === "SKIP") {
      return { message: "Insights already fresh" };
    }

    // 2. Call Gemini
    const insights = await step.run("Generate Insights from AI", async () => {
      const prompt = `
          Analyze the current state of the "${industry}" industry IN INDIA and provide insights in ONLY the following JSON format. DO NOT return markdown blocks or text, just the JSON object.
          
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
          Salary figures MUST be in annual Indian Rupees (INR).
          Growth rate should be a realistic percentage (e.g., 5.2).
          Ensure all enums match exactly: High, Medium, Low.
        `;

      // Add timeout protection (20 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20_000);

      try {
        const result = await model.generateContent(prompt, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const response = result.response;
        const text = response.text();
        // Clean up markdown blocks if Gemini adds them (```json ... ```)
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanedText);
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error(`AI generation timeout for ${industry}`);
        }
        throw error;
      }
    });

    // 3. Save to DB
    await step.run("Save Insights to DB", async () => {
      await db.industryInsight.upsert({
        where: { industry },
        update: {
          ...insights,
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Days
        },
        create: {
          industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
      });
    });

    return { success: true, industry };
  }
);

// ✅ Batch Processing Function for Multiple Industries (PARALLEL)
export const generateBatchIndustryInsights = inngest.createFunction(
  { name: "Generate Batch Industry Insights" },
  { event: "insight/generate-batch" },
  async ({ event, step }) => {
    const { industries } = event.data; // Array of industry names

    if (!industries || !Array.isArray(industries)) {
      throw new Error("industries must be an array");
    }

    // Process industries in parallel with concurrency limit of 3
    const results = await step.run("Generate All Insights in Parallel", async () => {
      const limit = pLimit(3); // Max 3 concurrent requests

      const promises = industries.map((industry) =>
        limit(async () => {
          try {
            const prompt = `
Analyze the current state of the "${industry}" industry IN INDIA and provide insights in ONLY the following JSON format. DO NOT return markdown blocks or text, just the JSON object.

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
Salary figures MUST be in annual Indian Rupees (INR).
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
              console.error(`Error generating insights for ${industry}:`, error);
              return { industry, success: false, error: error.message };
            }
          } catch (error) {
            console.error(`Failed to process ${industry}:`, error);
            return { industry, success: false, error: error.message };
          }
        })
      );

      return Promise.all(promises);
    });

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return {
      total: industries.length,
      successful: successCount,
      failed: failureCount,
      results,
    };
  }
);