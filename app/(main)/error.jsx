"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, LayoutDashboard, Home } from "lucide-react";

export default function MainError({ error, reset }) {
  useEffect(() => {
    console.error("Main Route Error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 select-none">
      <div className="max-w-lg w-full bg-white dark:bg-[#13141f] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-900 shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Unexpected Route Error
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            We encountered a problem loading this feature. You can retry or navigate back to your dashboard.
          </p>
        </div>

        {error?.message && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">Error Diagnostic</span>
            <p className="text-xs font-mono text-rose-600 dark:text-rose-400 break-words font-semibold">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl px-6 h-12 shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reload Feature
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 font-extrabold text-xs sm:text-sm rounded-xl px-6 h-12 flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" /> Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
