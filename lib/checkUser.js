"use server";

import { auth } from "@/auth"; // Correct import path
import { db } from "@/lib/prisma"; // Assuming db is exported from here

export const checkUser = async () => {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const user = session.user;

    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                email: user.email,
            },
            include: {
                resumes: true,
            },
        });

        if (loggedInUser) {
            return loggedInUser;
        }

        const newUser = await db.user.create({
            data: {
                name: user.name,
                email: user.email,
                image: user.image,
            },
        });

        return newUser;
    } catch (error) {
        console.error("Error creating/checking user:", error.message);
        return null;
    }
};
