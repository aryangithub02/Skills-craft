"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, LayoutDashboard, ArrowLeft } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 select-none">
      <div className="max-w-xl w-full bg-white dark:bg-[#13141f] rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900 shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Header Title & Subtitle */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Something Went Wrong
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
            An unexpected server-side or runtime exception occurred while processing your request. Don&apos;t worry, your data is safe!
          </p>
        </div>

        {/* Error Details Box (collapsible / readable) */}
        {error?.message && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-left space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Diagnostic Details
            </span>
            <p className="text-xs font-mono text-rose-600 dark:text-rose-400 break-words font-semibold">
              {error.message || "An unexpected error occurred."}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl px-6 h-12 shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 font-extrabold text-xs sm:text-sm rounded-xl px-6 h-12 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" /> Go to Dashboard
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-slate-600 dark:text-slate-400 font-bold text-xs sm:text-sm rounded-xl px-4 h-12 flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" /> Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
