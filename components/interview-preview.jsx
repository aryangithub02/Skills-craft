"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Video, 
  Mic, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Award,
  Maximize2,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InterviewPreview() {
  const [activeQuestion, setActiveQuestion] = useState(1);

  return (
    <section className="py-24 sm:py-32 bg-[#F5F7FB] dark:bg-[#0F101A] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neo-surface text-xs font-extrabold text-purple-600 dark:text-purple-400">
            <Video className="w-4 h-4 text-purple-500" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Real-Time Voice & Video <br />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              AI Mock Interview Studio
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Simulate real hiring interviews with AI Recruiter persona Maya. Receive immediate feedback on speech tone, technical accuracy, and STAR structure.
          </p>
        </div>

        {/* AI Mock Interview Studio Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="neo-surface rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/90 dark:border-slate-800 space-y-8"
        >
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Live Mock Interview Session #8429
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Senior Full Stack Developer • Technical &amp; System Design</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-xs font-mono text-slate-700 dark:text-slate-200">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> 01:42 / 02:00
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                <Zap className="w-3.5 h-3.5 fill-current" /> 98% AI Confidence
              </div>
            </div>
          </div>

          {/* Main Studio Grid: Left Avatar & Camera, Right Live Transcript & Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: AI Recruiter Avatar & Candidate Webcam (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* AI Persona Avatar Box */}
              <div className="relative aspect-video rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group">
                {/* Ambient Glowing Ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-purple-900/20 to-slate-950" />
                
                {/* AI Recruiter Maya Avatar */}
                <div className="relative z-10 text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
                      <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                        <Brain className="w-12 h-12 text-indigo-400" />
                      </div>
                    </div>
                    {/* Pulse Ring */}
                    <span className="absolute inset-0 rounded-full border-2 border-indigo-400/40 animate-ping" />
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-white flex items-center justify-center gap-2">
                      Maya <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </h4>
                    <span className="text-xs text-indigo-300 font-medium">AI Technical Recruiter Persona</span>
                  </div>
                </div>

                {/* Candidate Camera Overlay Preview (Bottom Right) */}
                <div className="absolute bottom-4 right-4 w-36 aspect-video rounded-2xl bg-slate-900 border-2 border-indigo-500/50 shadow-2xl overflow-hidden flex items-center justify-center">
                  <div className="text-center space-y-1">
                    <Video className="w-5 h-5 text-indigo-400 mx-auto" />
                    <span className="text-[10px] text-slate-300 font-bold block">Cam Active (720p)</span>
                  </div>
                </div>

                {/* Question Progress Badge (Top Left) */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 text-xs font-black text-white">
                  Question 2 of 5
                </div>
              </div>

              {/* Live Voice Frequency Spectrum Visualizer */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider text-[10px]">
                    <Mic className="w-4 h-4 text-indigo-500" /> Real-Time Voice Waveform &amp; Audio Input
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold">Gain: 48%</span>
                </div>
                <div className="h-10 flex items-center justify-center gap-1">
                  {[20, 45, 80, 60, 30, 90, 70, 40, 65, 85, 50, 75, 35, 95, 60, 40, 70, 85, 30, 50].map((val, idx) => (
                    <motion.div
                      key={idx}
                      className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-purple-500"
                      animate={{ height: [8, val * 0.35, 8] }}
                      transition={{ repeat: Infinity, duration: 0.5 + (idx % 5) * 0.1 }}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Live Speech Transcript & AI Feedback Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Live Transcript Box */}
              <div className="neo-surface rounded-2xl p-5 space-y-3 border border-white/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Live Speech Recognition Transcript
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    Streaming
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl neo-inset text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  &ldquo;In my previous role, I refactored our GraphQL caching layer and introduced Redis cluster replicas. This reduced p99 latency from 450ms down to 85ms under high concurrency.&rdquo;
                </div>
              </div>

              {/* AI Real-Time Feedback Panel */}
              <div className="neo-surface rounded-2xl p-5 space-y-4 border border-white/80 dark:border-slate-800">
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" /> AI Feedback Breakdown
                </h4>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-400">STAR Structure (Situation / Task / Result)</span>
                      <span className="text-indigo-600 font-mono">94%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden neo-inset">
                      <div className="h-full bg-indigo-600 rounded-full w-[94%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-400">Technical Depth &amp; Metrics</span>
                      <span className="text-emerald-600 font-mono">96%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden neo-inset">
                      <div className="h-full bg-emerald-500 rounded-full w-[96%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-400">Verbal Clarity &amp; Confidence</span>
                      <span className="text-purple-600 font-mono">92%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden neo-inset">
                      <div className="h-full bg-purple-600 rounded-full w-[92%]" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Recommendation: Mention specific database indexing strategies used.</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
