# 📊 Dashboard Layout & View Guide (`app/(main)/dashboard/page.jsx`)

This guide provides a complete architectural and technical explanation of the **Dashboard Page Component** in SkillsCraft, including authentication guards, parallel data fetching optimizations, non-blocking background workers, layout structure, and full source code listings.

---

## 📑 Table of Contents
1. [🌟 Component Overview & Purpose](#-component-overview--purpose)
2. [🏗️ Architectural & Performance Patterns](#️-architectural--performance-patterns)
3. [💻 Full Source Code: Dashboard Page (`app/(main)/dashboard/page.jsx`)](#-full-source-code-dashboard-page)
4. [🖼️ Layout Wrapper (`app/(main)/layout.js`)](#️-layout-wrapper)
5. [⚙️ Server Action Data Fetcher (`actions/dashboard.js`)](#️-server-action-data-fetcher)
6. [🎨 UI Sub-component (`components/dashboard/industry-insights-card.jsx`)](#-ui-sub-component)
7. [📌 Key Takeaways for Developers](#-key-takeaways-for-developers)

---

## 🌟 Component Overview & Purpose

The **Dashboard Page** ([`app/(main)/dashboard/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/dashboard/page.jsx)) serves as the main authenticated hub for users logging into SkillsCraft. 

It consolidates key user statistics, AI tool navigation shortcuts (Resume Builder, Voice Mock Interview, Cover Letter Generator), account profile settings, and live market industry insights into a unified **3-column responsive grid layout**.

---

## 🏗️ Architectural & Performance Patterns

### 1. Zero-Waterfall Parallel Data Fetching (`Promise.all`)
Instead of fetching user data sequentially (which would block the page render time by adding up latency), the page executes three independent server-side data fetches in parallel using JavaScript's `Promise.all()`:

```javascript
const [insights, resume, assessments] = await Promise.all([
  getIndustryInsights(),
  getResume(),
  db.assessment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  }),
]);
```

### 2. Multi-tier Onboarding & Authentication Guard
Before rendering UI elements or fetching metrics, the page enforces strict authentication and profile completion checks:
- **Unauthenticated User** $\rightarrow$ Redirect to `/api/auth/signin`.
- **User missing Industry configuration** $\rightarrow$ Redirect to `/onboarding` wizard.

### 3. Non-blocking Background Insight Generation
If industry insights are missing or stale, `getIndustryInsights()` triggers a background generation task (fire-and-forget) without `await`ing it, returning `null` immediately. This prevents the server component from hanging for 5–10 seconds while AI generates fresh insights.

---

## 💻 Full Source Code: Dashboard Page

### Path: [`app/(main)/dashboard/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/dashboard/page.jsx)

```jsx
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

export default async function DashboardPage() {
  // 1. Check if user exists in DB and is authenticated using checkUser helper
  const user = await checkUser();

  if (!user) {
    return redirect("/api/auth/signin");
  }

  // 2. Enforce onboarding completion before allowing access to dashboard
  if (!user.industry) {
    return redirect("/onboarding");
  }

  // 3. Performance Optimization: Run independent data fetches in parallel
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
        {/* Welcome Banner */}
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || "there"}! 👋
        </h1>

        {/* Responsive Dashboard Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Resume Builder */}
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

          {/* Card 2: AI Voice Mock Interview */}
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

          {/* Card 3: Cover Letter Generator */}
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

          {/* Card 4: Live Market Industry Insights */}
          <div className="h-full">
            <IndustryInsightsCard insights={insights} />
          </div>

          {/* Card 5: Profile & Account Settings */}
          <Link href="/account" className="block">
            <div className="border rounded-lg p-6 hover:border-primary transition-colors h-full">
              <h3 className="text-xl font-semibold mb-2">👤 Your Profile</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Update your personal information, industry, and bio.
              </p>
              <span className="text-primary text-sm font-medium">Edit Profile →</span>
            </div>
          </Link>

          {/* Card 6: User Assessment Progress & Performance Metrics */}
          <DashboardStats assessments={assessments} />
        </div>
      </div>
    </div>
  );
}
```

---

## 🖼️ Layout Wrapper

### Path: [`app/(main)/layout.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/%28main%29/layout.js)

The `(main)` route group uses a lightweight container layout wrapper. Authentication checks are deliberately omitted from the shared layout to prevent duplicated DB queries across nested sub-routes:

```jsx
export default async function MainLayout({ children }) {
    // Note: checkUser is handled inside specific protected pages (e.g. /dashboard)
    // to optimize page rendering performance.
    return (
        <div className="container mx-auto px-4 py-8">
            {children}
        </div>
    );
}
```

---

## ⚙️ Server Action Data Fetcher

### Path: [`actions/dashboard.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/dashboard.js)

This Server Action resolves the user's specific industry category, checks cache freshness, and returns structured insight objects:

```javascript
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { generateIndustryInsights } from "./industry";
import { mapToInsightCategory } from "@/lib/industry-mapper";
import { industries } from "@/data/industries";

export async function getIndustryInsights() {
    try {
        const session = await auth();
        if (!session?.user) return null;

        const userId = session.user.id;

        const user = await db.user.findUnique({
            where: { id: userId },
            select: { industry: true },
        });

        if (!user || !user.industry) return null;

        // Map sub-industry slug to broad category (e.g., "tech-software-development" -> "Technology")
        const insightCategory = mapToInsightCategory(user.industry);
        if (!insightCategory) return null;

        const insights = await db.industryInsight.findUnique({
            where: { industry: insightCategory },
        });

        // Background Generation Trigger: If no insight data exists, do not block page load!
        if (!insights) {
            generateIndustryInsights(insightCategory)
                .then(() => console.log(`Background generation started for ${insightCategory}`))
                .catch(err => console.error(`Background generation failed for ${insightCategory}`, err));

            return null;
        }

        // Background Refresh Trigger: If cached insight is stale, refresh asynchronously
        if (insights.nextUpdate < new Date()) {
            generateIndustryInsights(insightCategory);
        }

        const industryObj = industries.find(i => i.name === insightCategory);
        const industryId = industryObj ? industryObj.id : user.industry.split('-')[0];
        const subIndustrySlug = user.industry.replace(`${industryId}-`, '');

        return {
            ...insights,
            routing: {
                industryId,
                subIndustrySlug
            }
        };
    } catch (error) {
        console.error("Error fetching industry insights:", error);
        return null;
    }
}
```

---

## 🎨 UI Sub-component: Industry Insights Card

### Path: [`components/dashboard/industry-insights-card.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/components/dashboard/industry-insights-card.jsx)

Renders real-time salary distribution charts using **Recharts**, skill badges, demand level progress bars, and market outlook indicators:

```jsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function IndustryInsightsCard({ insights }) {
  if (!insights) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl">Industry Insights</CardTitle>
          <CardDescription>Stay updated with market trends</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
          No insights available for your industry yet.
        </CardContent>
      </Card>
    );
  }

  const demandScore = insights.demandLevel === "High" ? 85 : insights.demandLevel === "Medium" ? 60 : 40;

  // Format salary ranges to Lakhs Per Annum (LPA)
  const salaryData = insights.salaryRanges.map(item => ({
    role: item.role,
    min: item.min / 100000,
    max: item.max / 100000,
    median: item.median / 100000,
  }));

  const CardBody = (
    <Card className={`h-full transition-all ${insights.routing ? 'hover:border-primary hover:shadow-md cursor-pointer' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1 flex items-center gap-2">
              {insights.industry} Insights
              <Badge variant="secondary" className="text-xs font-normal">Live</Badge>
            </CardTitle>
            <CardDescription>
              Market outlook: <span className="font-medium text-foreground">{insights.marketOutlook}</span>
            </CardDescription>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
             <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics Metric Row */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Growth Rate
                </p>
                <div className="text-2xl font-bold flex items-end gap-1">
                     {insights.growthRate}%
                </div>
            </div>
             <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> Demand Level
                </p>
                <div className="flex items-center gap-2">
                     <Progress value={demandScore} className="h-2 w-20" />
                     <span className="text-sm font-medium">{insights.demandLevel}</span>
                </div>
            </div>
        </div>

        {/* Salary Bar Chart */}
        <div className="space-y-2">
            <h4 className="text-sm font-medium">Average Salaries (LPA)</h4>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                        <XAxis dataKey="role" hide />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}L`} />
                        <Tooltip />
                        <Bar dataKey="min" fill="#94a3b8" radius={[0, 0, 4, 4]} name="Min Salary" />
                        <Bar dataKey="median" fill="#64748b" radius={[0, 0, 0, 0]} name="Median Salary" />
                        <Bar dataKey="max" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Max Salary" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Top Skills Badges */}
        <div className="space-y-2">
             <h4 className="text-sm font-medium">In-Demand Skills</h4>
             <div className="flex flex-wrap gap-2">
                {insights.topSkills.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
             </div>
        </div>
      </CardContent>
    </Card>
  );

  if (insights.routing) {
      return (
          <Link href={`/industry/${insights.routing.industryId}/${insights.routing.subIndustrySlug}`} className="block h-full">
              {CardBody}
          </Link>
      );
  }

  return CardBody;
}
```

---

## 📌 Key Takeaways for Developers

1. **Async React Server Components**: `DashboardPage` is an `async` React Server Component. It performs server-side database access directly without client-side `useEffect` or state fetching overhead.
2. **Resilient Data Loading**: Even if AI industry insights are missing from PostgreSQL, the non-blocking fire-and-forget pattern ensures the rest of the dashboard loads immediately.
3. **Modular Sub-components**: Interactive UI elements (charts, badges) are extracted into Client Components (`"use client"`) like [`IndustryInsightsCard`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/components/dashboard/industry-insights-card.jsx) to keep the root dashboard page lightweight and server-rendered.
