"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileText, 
  Video, 
  ShieldCheck, 
  PenBox, 
  BarChart3, 
  Brain, 
  Briefcase,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2
} from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Build ATS-optimized, high-impact resumes tailored to your target job role in seconds using AI bullet point generation and STAR formulas.",
    gradient: "from-[#3F7D58] to-[#4E8D72]",
    shadowColor: "rgba(63, 125, 88, 0.25)",
    tag: "AI Content Engine",
    href: "/resume",
  },
  {
    icon: Video,
    title: "AI Mock Interview",
    description: "Practice live verbal technical and behavioral interviews with persona Maya. Receive instant score breakdowns, facial telemetry, and STAR feedback.",
    gradient: "from-[#3F7D58] to-[#22C55E]",
    shadowColor: "rgba(34, 197, 94, 0.25)",
    tag: "Voice + Proctoring",
    href: "/interview",
  },
  {
    icon: Briefcase,
    title: "Career Opportunities Hub",
    description: "Discover live internships, jobs, hackathons, coding contests, open-source programs, and tech events matched to your profile.",
    gradient: "from-[#3F7D58] to-[#35694A]",
    shadowColor: "rgba(63, 125, 88, 0.3)",
    tag: "Live API Discovery",
    href: "/opportunities",
  },
  {
    icon: ShieldCheck,
    title: "ATS Checker",
    description: "Scan your resume against real job descriptions to identify missing keywords, formatting errors, and exact match percentages before applying.",
    gradient: "from-emerald-600 to-teal-600",
    shadowColor: "rgba(34, 197, 94, 0.25)",
    tag: "99.4% Pass Rate",
    href: "/resume",
  },
  {
    icon: PenBox,
    title: "Cover Letter Generator",
    description: "Generate highly targeted, persuasive cover letters matching your background to specific job openings with one-click personalization.",
    gradient: "from-emerald-700 to-green-600",
    shadowColor: "rgba(16, 185, 129, 0.25)",
    tag: "1-Click Customization",
    href: "/cover-letter",
  },
  {
    icon: BarChart3,
    title: "Industry Insights",
    description: "Access real-time market data on salary ranges, top required skills, hiring growth trends, and tech industry demand across global markets.",
    gradient: "from-teal-600 to-[#3F7D58]",
    shadowColor: "rgba(6, 182, 212, 0.25)",
    tag: "Live Market Data",
    href: "#insights",
  },
  {
    icon: Brain,
    title: "Career Analytics",
    description: "Track your interview readiness over time with multi-assessment telemetry radar charts, weakness diagnostics, and personalized prep roadmaps.",
    gradient: "from-amber-600 to-[#3F7D58]",
    shadowColor: "rgba(245, 158, 11, 0.25)",
    tag: "Telemetry Scoring",
    href: "/dashboard",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-[#F8FBF8] dark:bg-[#0C1412] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F4EA] border border-[#B1D3B9] text-xs font-extrabold text-[#3F7D58]">
            <Sparkles className="w-4 h-4 text-[#3F7D58]" />
            <span>Comprehensive Suite</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tight">
            Everything You Need to Land <br />
            <span className="brand-gradient-text">
              Your Dream Job
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Powered by enterprise-grade AI algorithms designed to coach, analyze, and elevate every stage of your career search.
          </p>
        </div>

        {/* 6 Core Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  rotateZ: idx % 2 === 0 ? 1.5 : -1.5,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                <div className="neo-surface rounded-3xl p-8 h-full flex flex-col justify-between transition-all duration-300 border border-white/90 dark:border-slate-800 shadow-xl group-hover:shadow-2xl">
                  <div className="space-y-6">
                    
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 shadow-lg shadow-indigo-500/10`}>
                        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                          <Icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </div>

                      <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                        {feature.tag}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom CTA Link */}
                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80">
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors group-hover:translate-x-1 transition-transform"
                    >
                      <span>Explore Feature</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
