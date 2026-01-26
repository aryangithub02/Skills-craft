import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

/**
 * Handle GET requests to test the Gemini model and return its generated reply.
 *
 * Generates a test prompt against the "gemini-2.0-flash-exp" model and returns a JSON response containing the model name and the generated message on success.
 *
 * @returns {Response} A JSON response:
 * - On success: `{ success: true, model: "gemini-2.0-flash-exp", message: string }`.
 * - If `GEMINI_API_KEY` is missing: `{ error: "GEMINI_API_KEY is not defined" }` with HTTP status 500.
 * - On error: `{ success: false, error: string, details: string }` with HTTP status 500.
 */
export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const result = await model.generateContent("Hello! Are you working correctly? Reply with 'Yes, connected!'.");
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            success: true,
            model: "gemini-2.0-flash-exp",
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