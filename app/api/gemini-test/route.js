import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key is not defined" }, { status: 500 });
    }

    try {
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
        });

        const response = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "user", content: "Hello! Are you working correctly? Reply with 'Yes, connected!'." }
            ],
        });

        const text = response.choices[0].message.content;

        return NextResponse.json({
            success: true,
            model: "google/gemini-2.0-flash-001",
            message: text
        });
    } catch (error) {
        console.error("Gemini Test Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.toString()
        }, { status: 500 });
    }
}
