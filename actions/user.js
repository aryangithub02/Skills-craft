"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Update the authenticated user's profile fields and revalidate affected routes.
 *
 * @param {Object} data - Profile values to update.
 * @param {string} [data.name] - New display name.
 * @param {string} [data.bio] - New biography text.
 * @param {string} [data.industry] - New industry value.
 * @param {string} [data.image] - New image URL; applied only when provided.
 * @returns {{success: true, user: Object}} An object with `success: true` and the updated user record.
 * @throws {Error} If the request is unauthenticated ("Unauthorized") or the update fails ("Failed to update profile").
 */
export async function updateUser(data) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const { name, bio, industry, image } = data;

    try {
        const user = await db.user.update({
            where: { id: session.user.id },
            data: {
                name,
                bio,
                industry,
                // Only update image if provided (handle empty string check if needed)
                ...(image && { image }),
            },
        });

        revalidatePath("/account");
        revalidatePath("/dashboard");

        return { success: true, user };
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update profile");
    }
}