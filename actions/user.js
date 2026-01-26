"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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
