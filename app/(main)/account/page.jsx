import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./_components/profile-form";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Account Settings</h1>
      
      <ProfileForm user={user} />
    </div>
  );
}
