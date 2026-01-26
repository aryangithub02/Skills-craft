import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterGenerator from "../_components/CoverLetterGenerator";
import { notFound } from "next/navigation";

/**
 * Renders the cover letter builder page for a given cover letter id.
 *
 * @param {Object} params - Route parameters object.
 * @param {string|number} params.id - The id of the cover letter to load.
 * @returns {JSX.Element} The page element that displays the CoverLetterGenerator; if the cover letter is not found, triggers a 404 response.
 */
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