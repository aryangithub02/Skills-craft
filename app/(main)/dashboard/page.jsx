import { getIndustryInsights } from "@/actions/dashboard";
import { getResume } from "@/actions/resume";
import IndustryInsightsCard from "@/components/dashboard/industry-insights-card";
import { checkUser } from "@/lib/checkUser";
import { auth } from "@/auth";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Render the dashboard page for an authenticated, onboarded user.
 *
 * If no authenticated user exists, redirects to the sign-in route; if the user
 * exists but has not selected an industry, redirects to onboarding. When rendered,
 * fetches industry insights, the user's resume, and the latest five assessments,
 * then displays a responsive dashboard with resume, interview, cover letter,
 * industry insights, profile, and progress cards.
 *
 * @returns {JSX.Element|void} The dashboard page React element, or performs a redirect to sign-in or onboarding. 
 */
export default async function DashboardPage() {
  // Check if user is in DB and onboarded using checkUser
  const user = await checkUser();

  if (!user) {
    return redirect("/api/auth/signin");
  }

  if (!user.industry) {
    return redirect("/onboarding");
  }

  // Optimize: Run independent data fetches in parallel
  const [insights, resume, assessments] = await Promise.all([
    getIndustryInsights(),
    getResume(),
    db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || "there"}! 👋
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resume Card */}
          <Link href="/resume" className="block">
            <div className={`border rounded-lg p-6 hover:border-primary transition-colors h-full ${resume ? 'border-primary/50' : ''}`}>
              <h3 className="text-xl font-semibold mb-2">
                  {resume ? "My Resume" : "Create Resume"}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {resume 
                    ? "Edit and update your existing resume."
                    : "Create and optimize your resume with AI assistance."}
              </p>
              <span className="text-primary text-sm font-medium">
                {resume ? "Edit Resume →" : "Build Resume →"}
              </span>
            </div>
          </Link>

          {/* Interview Card */}
          <Link href="/interview" className="block">
            <div className="border rounded-lg p-6 hover:border-primary transition-colors h-full">
              <h3 className="text-xl font-semibold mb-2">🎤 Mock Interview</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Practice with AI-generated interview questions.
              </p>
              <span className="text-primary text-sm font-medium">
                Start Practice →
              </span>
            </div>
          </Link>

          {/* Cover Letter Card */}
          <Link href="/cover-letter" className="block">
            <div className="border rounded-lg p-6 hover:border-primary transition-colors h-full">
              <h3 className="text-xl font-semibold mb-2">✉️ Cover Letter</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Generate tailored cover letters for job applications.
              </p>
              <span className="text-primary text-sm font-medium">
                Generate Letter →
              </span>
            </div>
          </Link>

          {/* Industry Insights Card */}
          <div className="h-full">
            <IndustryInsightsCard insights={insights} />
          </div>

          {/* Profile Card */}
          <Link href="/account" className="block">
            <div className="border rounded-lg p-6 hover:border-primary transition-colors h-full">
                <h3 className="text-xl font-semibold mb-2">👤 Your Profile</h3>
                <p className="text-muted-foreground text-sm mb-4">
                Update your personal information, industry, and bio.
                </p>
                <span className="text-primary text-sm font-medium">Edit Profile →</span>
            </div>
          </Link>

          {/* Progress Card */}
            <DashboardStats assessments={assessments} />
        </div>
      </div>
  </div>
  );
}