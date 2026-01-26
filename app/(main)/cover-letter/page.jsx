import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetters } from "@/actions/cover-letter";
import CoverLetterList from "./_components/CoverLetterList";

/**
 * Render the Cover Letters page with fetched cover letters and a "Create New" action.
 *
 * The component fetches cover letter data and renders a page containing a header,
 * a button linking to the creation page, and a list of cover letters.
 *
 * @returns {JSX.Element} The React element for the cover letters page.
 */
export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Cover Letters</h1>
          <p className="text-muted-foreground">
            Manage your tailored cover letters for different job applications.
          </p>
        </div>
        <Link href="/cover-letter/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}