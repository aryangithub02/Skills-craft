"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function generateCoverLetter(data) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) throw new Error("User not found");

    // Fetch the user's resume to provide context
    // We assume the user has one resume or the latest one
    const resume = await db.resume.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }
    });

    const resumeContent = resume ? resume.content : "User has no resume content.";

    const prompt = `
    You are a professional career coach and expert resume writer.
    Your task is to write a compelling, professional cover letter for the following job application.
    
    JOB TITLE: ${data.jobTitle}
    COMPANY: ${data.companyName}
    
    JOB DESCRIPTION:
    ${data.jobDescription}
    
    CANDIDATE'S RESUME CONTENT:
    ${resumeContent}
    
    INSTRUCTIONS:
    1. Write a professional cover letter linking the candidate's skills (from resume) to the job requirements.
    2. Maintain a professional, confident, and enthusiastic tone.
    3. Use standard business letter formatting (keep the markdown simple).
    4. Do not include placeholders like "[Your Name]" if possible, try to infer from resume, otherwise use generic placeholders that are easy to spot.
    5. Return ONLY the markdown content of the letter. No explanations.
  `;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`, // Optional
                "X-Title": "AI Career Coach", // Optional
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
            throw new Error(`OpenRouter API Error: ${response.statusText}`);
        }

        const result = await response.json();
        return result.choices[0].message.content;

    } catch (error) {
        console.error("Error generating cover letter:", error);
        throw new Error("Failed to generate cover letter");
    }
}
