import Google from "next-auth/providers/google";

export default {
    trustHost: true,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "complex_fallback_secret_for_build_phase_32chars",
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        // These callbacks run in middleware too, so keep them light/edge-safe if needed
        // logic here...
    },
}
