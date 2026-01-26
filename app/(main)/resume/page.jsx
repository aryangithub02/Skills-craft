import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/ResumeBuilder";

/**
 * Load resume data and render the resume page containing the ResumeBuilder.
 * @returns {JSX.Element} The page layout with ResumeBuilder initialized from fetched resume data.
 */
export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className="container mx-auto py-6 px-4">
      <ResumeBuilder initialContent={resume?.content} initialData={resume?.resumeData} />
    </div>
  );
}