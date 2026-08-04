"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  Layers,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  { text: "Add quantified impact metrics (e.g. 'reduced latency by 45%')", type: "warning" },
  { text: "Include Cloud Architecture keywords (AWS, Docker, Kubernetes)", type: "suggestion" },
  { text: "Optimized STAR technique formatting across work experience", type: "success" },
  { text: "Zero formatting or parse errors detected by ATS scanners", type: "success" },
];

const MATCHING_SKILLS = [
  { name: "Frontend Architecture (React, Next.js)", match: 98 },
  { name: "Backend APIs & Microservices (Node.js)", match: 92 },
  { name: "Database Optimization (PostgreSQL, Redis)", match: 88 },
  { name: "CI/CD & Cloud Infrastructure (Docker, AWS)", match: 85 },
];

const KEYWORD_HEATMAP = [
  { word: "React.js", count: "12x", heat: "high" },
  { word: "TypeScript", count: "9x", heat: "high" },
  { word: "Next.js App Router", count: "8x", heat: "high" },
  { word: "System Design", count: "6x", heat: "mid" },
  { word: "PostgreSQL", count: "5x", heat: "mid" },
  { word: "Microservices", count: "4x", heat: "mid" },
  { word: "Docker", count: "4x", heat: "mid" },
];

export default function ResumePreview() {
  return (
    <section className="py-24 sm:py-32 bg-[#F5F7FB] dark:bg-[#0F101A] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neo-surface text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Smart Resume Optimization</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            ATS Scanner &amp; AI Resume <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Score Intelligence
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Ensure your resume bypasses Applicant Tracking Systems with precision keyword matching, formatting audits, and automated content enhancement.
          </p>
        </div>

        {/* Neo-Neumorphic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Mock Resume Card Preview (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 neo-surface rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-white/90 dark:border-slate-800"
          >
            {/* Resume Header Card */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Alex Morgan</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Senior Full Stack Engineer • 6 yrs exp</p>
                </div>
              </div>

              <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                ✅ ATS Verified
              </span>
            </div>

            {/* Resume Content Snippet Box */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl neo-inset space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Professional Experience</span>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Lead Software Engineer — TechCorp Inc.</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  &bull; Spearheaded microservices migration using Next.js 15 App Router &amp; Redis, improving page load speed by 52% across 2M monthly active users.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  &bull; Architected automated CI/CD pipeline in Docker &amp; AWS EKS, cutting deployment cycle times from 4 hours to 12 minutes.
                </p>
              </div>

              {/* Keyword Heatmap Chips */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Detected Keyword Heatmap</span>
                <div className="flex flex-wrap gap-1.5">
                  {KEYWORD_HEATMAP.map((item) => (
                    <span key={item.word} className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {item.word} ({item.count})
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: ATS Gauge & Improvement Suggestions (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* ATS Score Gauge Card */}
            <div className="neo-surface rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl border border-white/90 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Overall ATS Score</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Evaluated against Senior Full Stack Engineer job profiles</p>
                </div>
                <div className="text-3xl font-black text-emerald-600 font-mono">92/100</div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden neo-inset">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-[92%]" />
              </div>
            </div>

            {/* Skills Matching Breakdown Card */}
            <div className="neo-surface rounded-3xl p-6 space-y-4 shadow-xl border border-white/90 dark:border-slate-800">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> Skill Match Breakdown
              </h4>

              <div className="space-y-3">
                {MATCHING_SKILLS.map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">{skill.name}</span>
                      <span className="text-indigo-600 font-mono">{skill.match}% Match</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden neo-inset">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${skill.match}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Improvement Suggestions List */}
            <div className="neo-surface rounded-3xl p-6 space-y-3 shadow-xl border border-white/90 dark:border-slate-800">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Recommendations
              </h4>

              <div className="space-y-2">
                {SUGGESTIONS.map((sug, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    {sug.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{sug.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
