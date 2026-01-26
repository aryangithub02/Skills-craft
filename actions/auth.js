"use server";

import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(data) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new Error("Missing required fields");
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    try {
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return { success: true, user };
    } catch (error) {
        console.error("Registration error:", error);
        throw new Error("Failed to register user");
    }
}
