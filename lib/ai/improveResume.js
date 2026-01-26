"use server";

import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Improves summary or other resume sections to be ATS-friendly.
 * @param {Object} params
 * @param {string} params.currentText - The text to improve
 * @param {string} params.type - The type of section (e.g., "Professional Summary", "Work Experience", "Education")
 */
export async function improveWithAI({ currentText, type }) {
    if (!currentText || currentText.trim() === '') {
        throw new Error("No text provided to improve");
    }

    console.log(`🤖 Improving ${type} content...`);

    const systemPrompt = `
    You are an expert resume writer and career coach specializing in ATS-optimized resumes.
    Your goal is to improve the user's ${type} description to be more professional, impactful, and quantitative.
    
    Instructions:
    - Use strong action verbs.
    - Focus on achievements and results (quantifiable metrics).
    - Remove weak language or passive voice.
    - Check for spelling and grammar errors.
    - Keep the tone professional and concise.
    - For "Professional Summary", make it a powerful elevator pitch.
    - For "Work Experience", focus on what was improved, managed, or achieved.
    - For "Project Bullet" or "Experience Bullet", return a single, concise sentence. Start with a strong action verb. Focus on the specific impact or technical implementation. Do NOT return multiple bullets.

    Return ONLY the improved text. Do not add any conversational filler or "Here is the improved text" preamble. Just the refined content.
  `;

    const userPrompt = `
    Here is the current text:
    "${currentText}"
    
    Improve this text for a resume.
  `;

    try {
        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3-8b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
        });

        const detailedText = completion.choices[0].message.content.trim();

        // Cleanup if LLM adds quotes despite instructions
        const cleanText = detailedText.replace(/^"|"$/g, '');

        return cleanText;

    } catch (error) {
        console.error("Error improving content with AI:", error);
        throw new Error("Failed to improve content via AI");
    }
}
