import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterGenerator from "../_components/CoverLetterGenerator";
import { notFound } from "next/navigation";

export default async function CoverLetterBuilderPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  if (!coverLetter) {
      notFound();
  }

  return (
    <div className="container mx-auto py-6 px-4 h-screen flex flex-col">
       <CoverLetterGenerator coverLetter={coverLetter} />
    </div>
  );
}
