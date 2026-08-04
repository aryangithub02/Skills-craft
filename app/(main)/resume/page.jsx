import { getResume } from "@/actions/resume";
import ResumeClientView from "./_components/ResumeClientView";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ResumePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const resume = await getResume();

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-8">
      <ResumeClientView 
        initialContent={resume?.content} 
        initialData={resume?.resumeData} 
      />
    </div>
  );
}
