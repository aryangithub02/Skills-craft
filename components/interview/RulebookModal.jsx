"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Video,
  Eye,
  UserCheck,
  Monitor,
  Lock,
  Copy,
  Smartphone,
  Brain,
  Mic,
  AlertTriangle,
  Award,
  Wifi,
  Zap,
  PauseCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function RulebookModal({ isOpen, onClose, onAccept, accepted }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden rounded-3xl shadow-2xl z-50">
        {/* Header */}
        <DialogHeader className="p-6 bg-gradient-to-r from-cyan-950/80 via-zinc-950 to-violet-950/80 border-b border-zinc-800 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-extrabold uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" /> Official Protocol &amp; Proctoring Rules
            </div>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-white via-zinc-100 to-cyan-300 bg-clip-text text-transparent">
              SkillsCraft AI Mock Interview Rulebook
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Version 1.0 — Applies to all proctored AI Mock Interview sessions
            </DialogDescription>
          </div>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 text-xs px-3 py-1 bg-cyan-950/40">
            Integrity System Active
          </Badge>
        </DialogHeader>

        {/* Scrollable Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-xs text-zinc-300 leading-relaxed font-normal">
          {/* Purpose Notice */}
          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-zinc-100 text-sm">Purpose &amp; Objective</h4>
              <p className="text-zinc-400 mt-1">
                The AI Mock Interview is designed to simulate a real hiring interview. To ensure accurate evaluation and meaningful feedback, every candidate must adhere to the proctoring standards below.
              </p>
            </div>
          </div>

          {/* Section: Pre-Interview Requirements */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-extrabold text-cyan-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 1. Pre-Interview Requirements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-800/80">
                <span className="font-bold text-zinc-200 block mb-1">⚡ Device &amp; Connection</span>
                <ul className="list-disc list-inside text-zinc-400 space-y-1">
                  <li>Stable internet connection</li>
                  <li>Device battery &gt; 30% or connected to power</li>
                </ul>
              </div>
              <div className="bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-800/80">
                <span className="font-bold text-zinc-200 block mb-1">🎥 Audio &amp; Video Setup</span>
                <ul className="list-disc list-inside text-zinc-400 space-y-1">
                  <li>Working microphone &amp; front camera</li>
                  <li>Quiet environment &amp; good face lighting</li>
                  <li>One person only in the camera frame</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section: Proctored Rules During Interview */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-extrabold text-cyan-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-violet-400" /> 2. Rules During the Interview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rule 1 */}
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-100 font-bold">
                  <Video className="w-4 h-4 text-cyan-400" /> Rule 1: Camera Must Remain On
                </div>
                <p className="text-zinc-400">
                  Camera must stay enabled throughout the session. Face must not leave frame for &gt; 5 seconds. Continued camera failure may invalidate the session.
                </p>
              </div>

              {/* Rule 2 */}
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-100 font-bold">
                  <Eye className="w-4 h-4 text-cyan-400" /> Rule 2: Eye Contact &amp; Focus
                </div>
                <p className="text-zinc-400">
                  Maintain focus on screen. Looking away continuously (&gt;5s) or reading off another device reduces your Attention &amp; Focus Score.
                </p>
              </div>

              {/* Rule 3 */}
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-100 font-bold">
                  <UserCheck className="w-4 h-4 text-violet-400" /> Rule 3: Single Person Only
                </div>
                <p className="text-zinc-400">
                  Only the candidate should appear. Multiple faces detected or outside verbal assistance will trigger immediate integrity failure.
                </p>
              </div>

              {/* Rule 4 */}
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-100 font-bold">
                  <Monitor className="w-4 h-4 text-rose-400" /> Rule 4: Window Focus Monitored
                </div>
                <p className="text-zinc-400">
                  Switching tabs, opening applications, minimizing browser, or using ChatGPT/Google during behavioral/technical questions is strictly monitored.
                </p>
              </div>

              {/* Rule 6 & 7 */}
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-100 font-bold">
                  <Copy className="w-4 h-4 text-amber-400" /> Rule 6 &amp; 7: No Copy / Paste &amp; Shortcuts
                </div>
                <p className="text-zinc-400">
                  Ctrl+C, Ctrl+V, right-click paste, Alt+Tab, Cmd+Tab, Ctrl+Shift+Esc, Ctrl+T, Ctrl+N are disabled/logged as security violations.
                </p>
              </div>

              {/* Rule 8 & 9 */}
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-100 font-bold">
                  <Brain className="w-4 h-4 text-emerald-400" /> Rule 8 &amp; 9: No Phones or External AI
                </div>
                <p className="text-zinc-400">
                  Usage of external AI tools (ChatGPT, Gemini, Claude, Copilot, Perplexity) or mobile phones is prohibited and compromises evaluation.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Integrity Score Policy */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-violet-950/40 p-5 rounded-3xl border border-cyan-500/30 space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-extrabold text-cyan-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" /> Integrity Score System (Base: 100)
            </h3>
            <p className="text-zinc-300">
              Every interview starts with <strong className="text-cyan-300">Integrity Score = 100</strong>. Automatic point deductions occur for recorded violations:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
              <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 text-center">
                <span className="text-amber-400 font-bold block">-5 Points</span>
                <span className="text-zinc-400 text-[10px]">Looking Away &gt;5s</span>
              </div>
              <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 text-center">
                <span className="text-amber-400 font-bold block">-10 Points</span>
                <span className="text-zinc-400 text-[10px]">Tab / Window Switch</span>
              </div>
              <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 text-center">
                <span className="text-rose-400 font-bold block">-15 Points</span>
                <span className="text-zinc-400 text-[10px]">Face Missing / Camera Off</span>
              </div>
              <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 text-center">
                <span className="text-rose-500 font-bold block">Immediate Fail</span>
                <span className="text-zinc-400 text-[10px]">Multiple People / AI Assist</span>
              </div>
            </div>
          </div>

          {/* Section: Interruption & Pause Policy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-zinc-200">
                <Wifi className="w-4 h-4 text-cyan-400" /> Network &amp; Power Disconnect
              </div>
              <p className="text-zinc-400 text-[11px]">
                If internet drops, session pauses automatically and answers are stored locally. Reconnect within 5 minutes to resume without progress loss.
              </p>
            </div>

            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-zinc-200">
                <PauseCircle className="w-4 h-4 text-violet-400" /> Emergency Pause Feature
              </div>
              <p className="text-zinc-400 text-[11px]">
                You get <strong>1 emergency pause</strong> of up to <strong>2 minutes (120s)</strong> during the interview. The pause duration is logged in your final report.
              </p>
            </div>
          </div>

          {/* Section: Privacy Notice */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
            <strong className="text-zinc-200 block mb-1">🔒 Privacy Notice</strong>
            SkillsCraft collects only essential proctoring telemetry (window focus events, audio levels, face presence metadata, and transcript history) to calculate your final Integrity &amp; Technical report. No personal desktop files are ever accessed.
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-6 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Proctoring compliance required for certification
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs"
            >
              Close
            </Button>
            {onAccept && (
              <Button
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold px-6 py-2.5 shadow-lg"
              >
                Accept &amp; Continue
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
