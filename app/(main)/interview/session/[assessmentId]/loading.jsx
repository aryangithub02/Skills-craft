import { Loader2 } from "lucide-react";

/**
 * Render a fullscreen centered loading view for an interview session.
 *
 * Displays a spinning Loader2 icon with a primary message ("Loading interview session...")
 * and a secondary subtext ("Preparing your personalized questions").
 * @returns {JSX.Element} A React element containing a fullscreen centered loader and two lines of descriptive text.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-4 text-lg text-gray-700">Loading interview session...</p>
        <p className="text-gray-500">Preparing your personalized questions</p>
      </div>
    </div>
  );
}