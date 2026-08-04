import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, LayoutDashboard, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full bg-white dark:bg-[#13141f] rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-900 shadow-inner">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-indigo-600 font-mono block">404</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            The page or route you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              type="button"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl px-6 h-12 shadow-md flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 font-bold text-xs sm:text-sm rounded-xl px-5 h-12 flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" /> Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
