import { getResume } from "@/actions/resume";
import ResumeClientView from "./_components/ResumeClientView";

export default async function ResumePage() {
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
