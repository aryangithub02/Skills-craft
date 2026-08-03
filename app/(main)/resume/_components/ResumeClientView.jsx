"use client";

import React, { useState } from "react";
import ResumeIntelligenceDashboard from "@/components/resume/ResumeIntelligenceDashboard";
import ResumeBuilder from "./ResumeBuilder";
import { Brain, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ResumeClientView({ initialContent, initialData }) {
  const [viewMode, setViewMode] = useState("intelligence"); // "intelligence" | "builder"

  return (
    <div className="space-y-8 select-none">
      {/* View Mode Toggle Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#13141f] p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("intelligence")}
            className={`px-6 py-3 rounded-xl text-sm font-extrabold transition-all flex items-center gap-2.5 ${
              viewMode === "intelligence"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <Brain className="w-4 h-4 text-amber-300 fill-current" />
            <span>AI Resume Intelligence &amp; ATS Audit</span>
            <Badge className="bg-amber-400 text-slate-950 text-[11px] font-black">PRO</Badge>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("builder")}
            className={`px-6 py-3 rounded-xl text-sm font-extrabold transition-all flex items-center gap-2.5 ${
              viewMode === "builder"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Markdown Resume Editor &amp; Form</span>
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden lg:inline-block pr-3">
          Powered by DeepSeek &amp; LLaMA 3.3 70B ATS Simulator
        </span>
      </div>

      {/* Render Selected Mode */}
      {viewMode === "intelligence" ? (
        <ResumeIntelligenceDashboard initialContent={initialContent} initialData={initialData} />
      ) : (
        <ResumeBuilder initialContent={initialContent} initialData={initialData} />
      )}
    </div>
  );
}
