"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import "./globals.css";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global Layout Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 antialiased font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Application Exception</h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              A critical global error occurred. Click below to reload the page or return to safety.
            </p>
          </div>

          {error?.message && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left">
              <p className="text-xs font-mono text-rose-400 break-words">{error.message}</p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-6 h-11 rounded-xl shadow-md inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <a
              href="/"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-5 h-11 rounded-xl inline-flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" /> Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
