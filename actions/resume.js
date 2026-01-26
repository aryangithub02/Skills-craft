"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Upserts the authenticated user's resume with the provided markdown content and structured form data.
 * @param {string} content - The resume content in markdown.
 * @param {object} resumeData - The structured JSON form data used for re-editing the resume.
 * @returns {object} The upserted resume record.
 * @throws {Error} "Unauthorized" when there is no authenticated user.
 * @throws {Error} "User not found" when the authenticated user does not exist in the database.
 * @throws {Error} "Failed to save resume" when the database upsert fails.
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
 * Retrieve the authenticated user's resume record.
 *
 * Looks up the current session's user, finds the corresponding user in the database,
 * and returns the resume associated with that user. If the user exists but has no resume,
 * returns `null`.
 * @returns {Object|null} The resume record for the authenticated user, or `null` if not found.
 * @throws {Error} "Unauthorized" if there is no authenticated user in the session.
 * @throws {Error} If a database lookup fails.
 */
export async function getResume() {
    const session = await auth();

    console.log("getResume: Checking auth...");
    if (!session?.user) {
        console.log("getResume: No user found");
        throw new Error("Unauthorized");
    }
    const userId = session.user.id;
    console.log("getResume: userId found:", userId);

    let user;
    try {
        user = await db.user.findUnique({
            where: { id: userId },
        });
        console.log("getResume: User found in DB:", user ? user.id : "null");
    } catch (e) {
        console.error("getResume: Error finding user:", e);
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