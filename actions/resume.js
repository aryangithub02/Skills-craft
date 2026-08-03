"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Saves or updates a user's resume content and structured data
 * @param {string} content - The markdown content of the resume
 * @param {object} resumeData - The structured form data (JSON) for re-editing
 */
export async function saveResume(content, resumeData) {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    const userId = session.user.id;

    // Find the database user first using the ID
    const user = await db.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const resume = await db.resume.upsert({
            where: {
                userId: user.id
            },
            update: {
                content: content,
                resumeData: resumeData // Persist form data
            },
            create: {
                userId: user.id,
                content: content,
                resumeData: resumeData // Persist form data
            }
        });

        revalidatePath("/resume");
        return resume;
    } catch (error) {
        console.error("Error saving resume:", error);
        throw new Error("Failed to save resume");
    }
}

/**
 * Fetches the current user's resume
 */
export async function getResume() {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    const userId = session.user.id;

    let user;
    try {
        user = await db.user.findUnique({
            where: { id: userId },
        });
    } catch (e) {
        console.error("getResume: Error finding user");
        throw e;
    }

    if (!user) {
        return null;
    }

    const resume = await db.resume.findUnique({
        where: {
            userId: user.id
        }
    });

    return resume;
}
