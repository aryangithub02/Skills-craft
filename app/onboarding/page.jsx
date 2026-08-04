import { industries } from "@/data/industries";
import OnboardingForm from "./onboarding-form";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/sign-in");
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
