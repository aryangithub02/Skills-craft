"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Video, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  Brain, 
  ShieldCheck, 
  Award, 
  Mic, 
  Star,
  Zap,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section className="relative w-full pt-28 md:pt-40 pb-20 md:pb-32 overflow-hidden bg-[#F5F7FB] dark:bg-[#0F101A]">
      {/* Neo Ambient Soft Light Background Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#E6F4EA] dark:bg-emerald-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-8 text-center lg:text-left"
          >
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6F4EA] border border-[#B1D3B9] text-xs sm:text-sm font-extrabold text-[#3F7D58]"
            >
              <Sparkles className="w-4 h-4 text-[#3F7D58] animate-pulse" />
              <span>Next-Gen Enterprise AI Career Platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tight leading-[1.08]"
            >
              Ace Your Next <br />
              Interview{" "}
              <span className="brand-gradient-text">
                with AI
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              The all-in-one AI Career Coach platform providing Resume Builder, AI Mock Interviews, Cover Letter Generator, Industry Insights, ATS Resume Analysis, and Career Opportunities Hub.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Button
                asChild
                size="lg"
                className="bg-[#3F7D58] hover:bg-[#35694A] text-white text-base font-extrabold rounded-full px-8 h-14 w-full sm:w-auto shadow-xl shadow-emerald-700/20 flex items-center gap-2 group border-0"
              >
                <Link href="/interview">
                  Start Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                type="button"
                size="lg"
                onClick={() => setShowDemoModal(true)}
                className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 hover:bg-[#F2F7F3] text-slate-800 dark:text-slate-200 text-base font-extrabold rounded-full px-8 h-14 w-full sm:w-auto flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#3F7D58]">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </Button>
            </motion.div>

            {/* Social Proof Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3F7D58]" />
                <span>99.4% ATS Compatibility</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>4.9/5 Rating (12,000+ Offers)</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Multi-Card Overlapping Floating Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative w-full max-w-xl mx-auto py-8">
              
              {/* Main Card: AI Mock Interview Studio */}
              <motion.div 
                whileHover={{ y: -4, rotate: -0.5 }}
                className="glass-card-white rounded-3xl p-6 sm:p-7 relative z-20 space-y-6 shadow-2xl border border-[#E5E7EB] dark:border-slate-800"
              >
                {/* Interview Room Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-[#3F7D58] p-0.5 shadow-md flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-base font-black font-heading text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Maya <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#3F7D58] border border-[#B1D3B9]">AI Recruiter</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Senior Tech Recruiter Persona • Q2 of 5</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#E6F4EA] px-3 py-1.5 rounded-full border border-[#B1D3B9] text-[#3F7D58] text-xs font-black">
                    <Zap className="w-3.5 h-3.5 fill-current" /> 98% Confidence
                  </div>
                </div>

                {/* AI Question & Live Transcript */}
                <div className="bg-[#F8FBF8] dark:bg-slate-900/60 p-4 rounded-2xl border border-[#E5E7EB] dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Question</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    &ldquo;Can you explain how you optimized database queries to handle 100k requests/sec in your last architecture?&rdquo;
                  </p>
                </div>

                {/* Live Speech Waveform & Timer */}
                <div className="flex items-center justify-between bg-[#E6F4EA]/60 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-[#B1D3B9]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#3F7D58] text-white flex items-center justify-center shadow-md">
                      <Mic className="w-4 h-4 animate-bounce" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-[#3F7D58] dark:text-emerald-300 block">Listening to your answer...</span>
                      <span className="text-[10px] text-[#4E8D72] font-medium">Auto-capturing transcript</span>
                    </div>
                  </div>

                  {/* Animated Waveform Visualizer */}
                  <div className="flex items-center gap-1">
                    {[12, 24, 36, 18, 30, 14, 28, 16].map((height, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-[#3F7D58] rounded-full"
                        animate={{ height: [8, height, 8] }}
                        transition={{ repeat: Infinity, duration: 0.6 + i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>

                {/* AI Live Feedback Badge */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Great STAR Method structure! Technical depth: 95%</span>
                  </div>
                  <span className="font-extrabold font-mono text-emerald-600">Score: +18 pts</span>
                </div>
              </motion.div>

              {/* Floating Overlapping Card 1: Resume Score Gauge (Top Right) */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card-white rounded-2xl p-4 absolute -top-8 -right-4 sm:-right-8 z-30 w-52 shadow-xl border border-[#E5E7EB] dark:border-slate-800 animate-float-slow"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" className="text-[#3F7D58]" strokeDasharray="125" strokeDashoffset="10" strokeLinecap="round" fill="transparent" />
                    </svg>
                    <span className="absolute text-xs font-black font-heading text-slate-900 dark:text-slate-100">94</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold font-heading text-slate-900 dark:text-slate-100 block">Resume Score</span>
                    <span className="text-[10px] text-[#3F7D58] font-bold bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#B1D3B9]">
                      Top 2% Candidate
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Overlapping Card 2: Industry Insights Snippet (Bottom Left) */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card-white rounded-2xl p-4 absolute -bottom-8 -left-4 sm:-left-8 z-30 w-60 shadow-xl border border-[#E5E7EB] dark:border-slate-800 animate-float-reverse"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold font-heading text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#3F7D58]" /> Tech Market Demand
                    </span>
                    <span className="text-[10px] font-black text-[#3F7D58] bg-[#E6F4EA] px-2 py-0.5 rounded-full">+24% YoY</span>
                  </div>
                  <div className="text-base font-black text-slate-900 dark:text-slate-100 font-mono">
                    $145k – $185k <span className="text-[10px] text-slate-400 font-sans font-medium">Avg Salary</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {["React", "Next.js", "System Design"].map((tag) => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Watch Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card-white rounded-3xl p-6 w-full max-w-2xl space-y-4 relative border border-[#E5E7EB]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-black font-heading text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Play className="w-4 h-4 text-[#3F7D58] fill-current" /> SkillsCraft AI Interactive Walkthrough
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-slate-950 rounded-2xl flex items-center justify-center text-white relative overflow-hidden border border-slate-800 shadow-inner">
              <div className="text-center space-y-3 p-6">
                <div className="w-16 h-16 rounded-full bg-[#3F7D58] text-white flex items-center justify-center mx-auto shadow-xl animate-pulse">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h4 className="text-lg font-bold">SkillsCraft AI Interactive Demo</h4>
                <p className="text-xs text-slate-400 max-w-md">Experience real-time AI interview practice, ATS resume parsing, and salary analytics in action.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
