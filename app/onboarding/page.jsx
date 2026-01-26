import { industries } from "@/data/industries";
import OnboardingForm from "./onboarding-form";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Render the onboarding page or redirect users depending on authentication and profile state.
 *
 * If there is no authenticated user, redirects to `/api/auth/signin`. If the authenticated user's
 * profile already has an `industry`, redirects to `/dashboard`.
 *
 * @returns {JSX.Element} The onboarding page containing the OnboardingForm when no redirect occurs.
 */
export default async function OnboardingPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { industry: true }
    });

    if (user?.industry) {
        redirect("/dashboard");
    }

    return (
        <main>
           <OnboardingForm industries={industries} />
        </main>
    )
}