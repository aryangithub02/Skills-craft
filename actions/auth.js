"use server";

import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Register a new user with the provided name, email, and password.
 *
 * @param {Object} data - User registration data.
 * @param {string} data.name - The user's full name.
 * @param {string} data.email - The user's email address (used as unique identifier).
 * @param {string} data.password - The user's plaintext password.
 * @returns {{success: true, user: Object}} An object containing `success: true` and the created user record.
 * @throws {Error} If any required field is missing.
 * @throws {Error} If a user with the given email already exists.
 * @throws {Error} If user creation fails.
 */
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