"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Create a new draft cover letter for the authenticated user.
 * @param {Object} data - Cover letter input.
 * @param {string} data.jobTitle - Job title for the cover letter.
 * @param {string} data.companyName - Company name for the cover letter.
 * @param {string} data.jobDescription - Job description or details to reference.
 * @returns {Object} The created cover letter record.
 * @throws {Error} "Unauthorized" if there is no authenticated user session.
 * @throws {Error} "User not found" if the authenticated user does not exist.
 */
export async function createCoverLetter(data) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) throw new Error("User not found");

    const coverLetter = await db.coverLetter.create({
        data: {
            userId: user.id,
            jobTitle: data.jobTitle,
            companyName: data.companyName,
            jobDescription: data.jobDescription,
            content: "", // Initial content empty
            status: "draft",
        },
    });

    revalidatePath("/cover-letter");
    return coverLetter;
}

/**
 * Update the content of an existing cover letter and mark it as completed.
 *
 * @param {string} id - The ID of the cover letter to update.
 * @param {string} content - The new content for the cover letter.
 * @returns {object} The updated cover letter record.
 * @throws {Error} If the request is unauthorized (no authenticated user).
 * @throws {Error} If the cover letter does not exist or is not owned by the authenticated user.
 */
export async function updateCoverLetter(id, content) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const coverLetter = await db.coverLetter.findUnique({
        where: { id },
    });

    if (!coverLetter || coverLetter.userId !== session.user.id) {
        throw new Error("Cover letter not found or unauthorized");
    }

    const updated = await db.coverLetter.update({
        where: { id },
        data: {
            content,
            status: "completed"
        },
    });

    return updated;
}

/**
 * Retrieve all cover letters belonging to the authenticated user, ordered by newest first.
 *
 * @returns {Promise<Array<Object>>} An array of cover letter records ordered by creation date descending.
 * @throws {Error} If there is no authenticated user (message: "Unauthorized").
 */
export async function getCoverLetters() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    return await db.coverLetter.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    });
}

/**
 * Retrieve a cover letter by ID for the authenticated user.
 * @param {string} id - The cover letter ID to fetch.
 * @returns {object|null} The cover letter object if it exists and belongs to the authenticated user, otherwise `null`.
 * @throws {Error} If the request is made by an unauthenticated user.
 */
export async function getCoverLetter(id) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const coverLetter = await db.coverLetter.findUnique({
        where: { id },
    });

    if (!coverLetter || coverLetter.userId !== session.user.id) {
        return null;
    }

    return coverLetter;
}

/**
 * Delete a cover letter owned by the authenticated user and revalidate the cover-letter page.
 *
 * @param {string} id - The ID of the cover letter to delete.
 * @throws {Error} "Unauthorized" if there is no authenticated user session.
 * @throws {Error} "Cover letter not found or unauthorized" if the cover letter does not exist or is not owned by the authenticated user.
 */
export async function deleteCoverLetter(id) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const coverLetter = await db.coverLetter.findUnique({
        where: { id },
    });

    if (!coverLetter || coverLetter.userId !== session.user.id) {
        throw new Error("Cover letter not found or unauthorized");
    }

    await db.coverLetter.delete({
        where: { id },
    });

    revalidatePath("/cover-letter");
}