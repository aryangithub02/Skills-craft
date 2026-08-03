# 🛠️ SkillsCraft Core Feature Components Specification & Implementation Guide

This document provides a comprehensive technical specification and detailed source code walkthrough of the 8 core feature components powering **SkillsCraft**.

---

## 📑 Table of Contents
1. [📝 1. Resume Builder Engine](#1-resume-builder-engine)
2. [🎯 2. Resume AI Enhancer](#2-resume-ai-enhancer)
3. [⏱️ 3. Interview Assessment Quiz](#3-interview-assessment-quiz)
4. [🎤 4. Speech Interview Studio](#4-speech-interview-studio)
5. [✉️ 5. Cover Letter Generator](#5-cover-letter-generator)
6. [📈 6. Industry Insights View](#6-industry-insights-view)
7. [🔍 7. Opportunity Finder Grid](#7-opportunity-finder-grid)
8. [🚀 8. Onboarding Wizard](#8-onboarding-wizard)

---

## 1. Resume Builder Engine

- **Primary Path**: [`app/(main)/resume/_components/ResumeBuilder.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/resume/_components/ResumeBuilder.jsx)
- **Role**: Multi-tab form builder for experience, education, skills, projects, and real-time Markdown preview.

### Technical Details & Responsibilities
- **Form Management & Schema**: Uses `react-hook-form` coupled with `zod` for real-time schema validation (`contactInfo`, `summary`, `experience`, `education`, `projects`, `skills`).
- **Live Dual-Pane Layout**: Splits screen into an interactive multi-step entry form pane (`EntryForm.jsx`) and a real-time reactive markdown preview pane (`ResumePreview.jsx`).
- **AI Bullet Enhancements**: Integrates with Gemini AI via `improveWithAI` client utility to rewrite bullet points for high impact.

### 💻 Source Code Implementation Snippet

```jsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveResume } from "@/actions/resume";
import ResumePreview from "./ResumePreview";
import EntryForm from "./EntryForm";

const resumeSchema = z.object({
  contactInfo: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  summary: z.string().min(1, "Summary is required"),
  skills: z.string().optional(),
  experience: z.array(z.object({
    title: z.string().optional(),
    organization: z.string().optional(),
    bullets: z.array(z.string()).optional(),
  })).optional(),
});

export default function ResumeBuilder({ initialData }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [resumeData, setResumeData] = useState(initialData);

  const { register, handleSubmit, control, watch } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data) => {
    try {
      await saveResume(data);
      toast.success("Resume saved successfully!");
    } catch (error) {
      toast.error("Failed to save resume");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Entry Column */}
      <EntryForm register={register} control={control} onSubmit={handleSubmit(onSubmit)} />

      {/* Live Preview Column */}
      <ResumePreview data={watch()} />
    </div>
  );
}
```

---

## 2. Resume AI Enhancer

- **Primary Path**: [`components/resume/ResumeIntelligenceDashboard.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/components/resume/ResumeIntelligenceDashboard.jsx)
- **Role**: Triggers AI ATS score calculation, keyword gap extraction, bullet point rewriting, and resume parse validation.

### Technical Details & Responsibilities
- **ATS Match Engine**: Connects to [`actions/resume-intelligence.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/resume-intelligence.js) (`analyzeResumeIntelligence`), running Gemini 1.5 Flash against target job descriptions.
- **Document Parser Integration**: Accepts PDF and DOCX uploads via `parseDocumentAction` ([`actions/parse-document.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/parse-document.js)).
- **Score Breakdown**: Displays overall ATS Score gauge, quantified impact score, keyword match rates, and side-by-side original vs. AI improved resume diffs.

### 💻 Source Code Implementation Snippet

```jsx
"use client";

import { useState } from "react";
import { analyzeResumeIntelligence, improveWholeResumeAction } from "@/actions/resume-intelligence";
import { parseDocumentAction } from "@/actions/parse-document";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ResumeIntelligenceDashboard() {
  const [resumeText, setResumeText] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const parsedText = await parseDocumentAction(formData);
    setResumeText(parsedText);
    toast.success("Document parsed successfully!");
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeResumeIntelligence({ resumeText, targetJob });
      setAnalysis(result);
      toast.success("ATS Analysis completed!");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <input type="file" onChange={handleFileUpload} accept=".pdf,.docx" />
      <Button onClick={handleAnalyze} disabled={analyzing}>
        {analyzing ? "Analyzing ATS Score..." : "Run AI ATS Scanner"}
      </Button>
      {analysis && (
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="text-2xl font-bold">ATS Score: {analysis.atsScore}/100</h3>
          <p>{analysis.summaryFeedback}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 3. Interview Assessment Quiz

- **Primary Path**: [`app/(main)/interview/session/[assessmentId]/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/interview/session/\[assessmentId\]/page.jsx)
- **Role**: Dynamic quiz UI with question navigation, timer countdown, radio option selection, and score submit.

### Technical Details & Responsibilities
- **Dynamic Assessment Loader**: Fetches user's quiz session state via `getAssessmentById(assessmentId)`.
- **Timer & Local Cache**: Tracks active elapsed seconds (`elapsedTime`) and buffers question choices in React state (`localAnswers`) before committing.
- **Evaluation Trigger**: Invokes `evaluateAssessment` Server Action to compute final score percentages and category improvement feedback.

### 💻 Source Code Implementation Snippet

```jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getAssessmentById, evaluateAssessment } from "@/actions/assessment";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

export default function InterviewSessionPage() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState({});

  useEffect(() => {
    getAssessmentById(assessmentId).then(setAssessment);
  }, [assessmentId]);

  const handleAnswerSelect = (answer) => {
    setLocalAnswers({ ...localAnswers, [currentQuestionIndex]: answer });
  };

  const handleSubmitQuiz = async () => {
    await evaluateAssessment({
      assessmentId,
      answers: localAnswers,
    });
    window.location.reload();
  };

  if (!assessment) return <div>Loading Assessment...</div>;

  const currentQ = assessment.questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1} of {assessment.questions.length}</h2>
      <p className="text-lg">{currentQ.question}</p>

      <RadioGroup onValueChange={handleAnswerSelect} value={localAnswers[currentQuestionIndex]}>
        {currentQ.options.map((option, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`opt-${idx}`} />
            <label htmlFor={`opt-${idx}`}>{option}</label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-between mt-6">
        <Button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(i => i - 1)}>Previous</Button>
        {currentQuestionIndex === assessment.questions.length - 1 ? (
          <Button onClick={handleSubmitQuiz} className="bg-green-600">Submit Quiz</Button>
        ) : (
          <Button onClick={() => setCurrentQuestionIndex(i => i + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
}
```

---

## 4. Speech Interview Studio

- **Primary Path**: [`components/interview/ai-video-mock-interview.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/components/interview/ai-video-mock-interview.jsx) & [`hooks/useSpeechRecognition.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/hooks/useSpeechRecognition.js)
- **Role**: Audio recording component supporting live speech-to-text, wave animation, and voice interview evaluation.

### Technical Details & Responsibilities
- **Dual STT Engine**: Connects to WebSocket Proxy (`ws://localhost:8080`) for live text streaming and posts audio buffers to FastAPI Faster-Whisper (`/api/transcribe`).
- **Web Audio Visualization**: Captures mic input using `MediaRecorder` API and computes decibel levels for real-time visualizer canvas rendering (`FrequencyVisualizer.jsx`).
- **Transcript Panel**: Displays user transcript alongside AI feedback in real-time.

### 💻 Source Code Implementation Snippet

```jsx
"use client";

import { useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Button } from "@/components/ui/button";

export default function SpeechInterviewStudio() {
  const [transcript, setTranscript] = useState("");
  
  const { isRecording, startRecording, stopRecording } = useSpeechRecognition({
    onTranscriptChange: (text) => setTranscript(text),
  });

  return (
    <div className="p-6 border rounded-xl space-y-4">
      <h3 className="text-xl font-semibold">🎤 AI Voice Interview Studio</h3>
      
      <div className="p-4 bg-muted rounded-lg min-h-[120px]">
        <p className="text-sm font-mono">{transcript || "Click record and speak your answer..."}</p>
      </div>

      <Button onClick={isRecording ? stopRecording : startRecording} variant={isRecording ? "destructive" : "default"}>
        {isRecording ? "Stop Recording" : "Start Voice Answer"}
      </Button>
    </div>
  );
}
```

---

## 5. Cover Letter Generator

- **Primary Path**: [`app/(main)/cover-letter/new/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/cover-letter/new/page.jsx)
- **Role**: Form collecting job details, generating AI cover letter drafts, and managing saved letters.

### Technical Details & Responsibilities
- **Zod Form Schema**: Captures `jobTitle`, `companyName`, and `jobDescription`.
- **Server Action Generator**: Calls `createCoverLetter` ([`actions/cover-letter.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/cover-letter.js)), combining candidate profile with target job requirements.
- **Markdown Export**: Passes output to [`CoverLetterPreview.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/cover-letter/_components/CoverLetterPreview.jsx) for editing and PDF export.

### 💻 Source Code Implementation Snippet

```jsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  jobTitle: z.string().min(1, "Job Title is required"),
  companyName: z.string().min(1, "Company Name is required"),
  jobDescription: z.string().min(1, "Job Description is required"),
});

export default function NewCoverLetterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    const response = await createCoverLetter(data);
    router.push(`/cover-letter/${response.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold">New Cover Letter</h2>
      <Input placeholder="Job Title" {...register("jobTitle")} />
      <Input placeholder="Company Name" {...register("companyName")} />
      <Textarea placeholder="Job Description" rows={6} {...register("jobDescription")} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Generating AI Draft..." : "Generate Cover Letter"}
      </Button>
    </form>
  );
}
```

---

## 6. Industry Insights View

- **Primary Path**: [`components/industry/SalaryChart.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/components/industry/SalaryChart.jsx) & [`components/dashboard/industry-insights-card.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/components/dashboard/industry-insights-card.jsx)
- **Role**: Data visualization charts showing salary ranges, demand levels, and trending tech skills.

### Technical Details & Responsibilities
- **Recharts Integration**: Renders minimum, median, and maximum salary distributions by role in Lakhs Per Annum (LPA).
- **Trend Badges**: Renders active market growth rates, demand levels, and top in-demand skills.

### 💻 Source Code Implementation Snippet

```jsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function SalaryChart({ salaryRanges, topSkills }) {
  const salaryData = salaryRanges.map(item => ({
    role: item.role,
    min: item.min / 100000,
    median: item.median / 100000,
    max: item.max / 100000,
  }));

  return (
    <div className="space-y-6">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salaryData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="role" />
            <YAxis tickFormatter={(val) => `₹${val}L`} />
            <Tooltip />
            <Bar dataKey="min" fill="#94a3b8" name="Min Salary" />
            <Bar dataKey="median" fill="#64748b" name="Median Salary" />
            <Bar dataKey="max" fill="#3b82f6" name="Max Salary" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-2">
        {topSkills.map((skill) => (
          <Badge key={skill} variant="secondary">{skill}</Badge>
        ))}
      </div>
    </div>
  );
}
```

---

## 7. Opportunity Finder Grid

- **Primary Path**: [`app/(main)/opportunities/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/opportunities/page.jsx)
- **Role**: Filterable card grid for jobs, internships, hackathons, and open source programs with search.

### Technical Details & Responsibilities
- **Dynamic Filters**: Filters list by type (`all`, `internship`, `job`, `hackathon`, `open_source`), remote status, and paid status.
- **Bookmark & Save Action**: Calls `toggleSaveOpportunity` Server Action to persist saved opportunities to `UserOpportunity` model.
- **Live Sync Trigger**: Calls `triggerLiveSyncAction` to pull fresh opportunities from LeetCode, RemoteOK, and Devpost.

### 💻 Source Code Implementation Snippet

```jsx
"use client";

import { useState, useEffect } from "react";
import { getOpportunities, toggleSaveOpportunity } from "@/actions/opportunities";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getOpportunities({ search: searchQuery }).then(setOpportunities);
  }, [searchQuery]);

  const handleSave = async (id) => {
    await toggleSaveOpportunity(id);
    setOpportunities(ops => ops.map(o => o.id === id ? { ...o, isSaved: !o.isSaved } : o));
  };

  return (
    <div className="space-y-6 container mx-auto py-6">
      <Input 
        placeholder="Search jobs, hackathons, open-source..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{item.organization}</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Badge>{item.type}</Badge>
                {item.isRemote && <Badge variant="outline">Remote</Badge>}
              </div>
              <Button onClick={() => handleSave(item.id)} variant={item.isSaved ? "secondary" : "outline"}>
                {item.isSaved ? "Saved" : "Save Opportunity"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 8. Onboarding Wizard

- **Primary Path**: [`app/onboarding/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/onboarding/page.jsx) & [`app/onboarding/_components/onboarding-form.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/onboarding/_components/onboarding-form.jsx)
- **Role**: Guided multi-step onboarding wizard collecting user bio, experience level, industry, and skills.

### Technical Details & Responsibilities
- **Server Guard**: Redirects user to `/dashboard` if onboarding is already complete (`user.industry` present).
- **Multi-step Selection Form**: Collects broad industry category, specialized sub-industry, years of experience, and skills array.
- **Server Action Submission**: Calls `updateUserOnboarding` ([`actions/user.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/user.js)) to save user profile and enable dashboard features.

### 💻 Source Code Implementation Snippet

```jsx
// app/onboarding/page.jsx (Server Component)
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OnboardingForm from "./_components/onboarding-form";
import { industries } from "@/data/industries";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { industry: true },
  });

  if (user?.industry) redirect("/dashboard");

  return (
    <main className="flex justify-center items-center min-h-screen py-12">
      <OnboardingForm industries={industries} />
    </main>
  );
}
```

---

## 📌 Summary Matrix of Core Components

| Component Unit | Route / Path | Key Dependencies | Primary Output |
| :--- | :--- | :--- | :--- |
| **Resume Builder** | `app/(main)/resume/` | `react-hook-form`, `zod`, `actions/resume.js` | Dual-pane Markdown & PDF resume |
| **Resume AI Enhancer** | `components/resume/` | `actions/resume-intelligence.js`, Gemini AI | ATS Score breakdown & Diff rewrite |
| **Interview Quiz** | `app/(main)/interview/session/` | `actions/assessment.js`, Radio Group UI | Technical quiz score & category feedback |
| **Speech Interview** | `components/interview/` | `hooks/useSpeechRecognition.js`, WebSocket | Real-time speech transcript & wave UI |
| **Cover Letter** | `app/(main)/cover-letter/new` | `actions/cover-letter.js`, Zod | Tailored markdown cover letter draft |
| **Industry Insights** | `components/industry/` | `Recharts`, `actions/dashboard.js` | Salary bar charts & skill demand badges |
| **Opportunity Grid** | `app/(main)/opportunities/` | `actions/opportunities.js`, Prisma DB | Filterable card grid for jobs & hackathons |
| **Onboarding Wizard** | `app/onboarding/` | `actions/user.js`, Auth Guard | Saved user industry profile & skills vector |

