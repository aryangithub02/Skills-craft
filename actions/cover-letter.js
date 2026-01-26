"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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

export async function getCoverLetters() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    return await db.coverLetter.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    });
}

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
