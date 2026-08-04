import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "complex_fallback_secret_for_build_phase_32chars",
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        ...authConfig.providers,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (session.user) {
                if (token.sub) {
                    session.user.id = token.sub;
                }
                // Sync updated fields from token
                if (token.name) {
                    session.user.name = token.name;
                }
                if (token.image) {
                    session.user.image = token.image;
                }
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
            }
            if (trigger === "update" && session) {
                return { ...token, ...session }
            }
            return token
        }
    },
    pages: {
        signIn: "/sign-in",
    }
});
