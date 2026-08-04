"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

/**
 * VoiceIndicator
 * Animated indicator for mic/AI speaking state.
 *
 * Props:
 *   mode        – "listening" | "speaking" | "idle"
 *   audioLevel  – 0-100 (drives bar heights when listening)
 *   className   – extra wrapper classes
 */
export function VoiceIndicator({ mode = "idle", audioLevel = 0, className = "" }) {
  const bars = 7;

  return (
    <div className={"flex items-center gap-2 " + className}>
      <AnimatePresence mode="wait">
        {mode === "speaking" && (
          <motion.div
            key="speaking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EA] dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 backdrop-blur-sm"
          >
            {Array.from({ length: bars }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-[#3F7D58] to-[#4E8D72]"
                animate={{ height: ["6px", (14 + Math.sin(i * 0.9) * 8) + "px", "6px"] }}
                transition={{ repeat: Infinity, duration: 0.8 + i * 0.07, ease: "easeInOut" }}
              />
            ))}
            <span className="text-[11px] text-[#3F7D58] dark:text-emerald-300 font-extrabold ml-1">AI Speaking</span>
          </motion.div>
        )}

        {mode === "listening" && (
          <motion.div
            key="listening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EA] dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 backdrop-blur-sm"
          >
            {Array.from({ length: bars }).map((_, i) => {
              const barH = Math.max(4, Math.min(24, (audioLevel / 100) * 24 + 4));
              return (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-[#22C55E] to-[#4ADE80]"
                  animate={{ height: [barH + "px", (barH * 0.6) + "px", barH + "px"] }}
                  transition={{ repeat: Infinity, duration: 0.6 + i * 0.08, ease: "easeInOut" }}
                />
              );
            })}
            <Mic className="w-3.5 h-3.5 text-[#22C55E] ml-1 animate-pulse" />
            <span className="text-[11px] text-[#3F7D58] dark:text-emerald-300 font-extrabold">Listening</span>
          </motion.div>
        )}

        {mode === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
          >
            {Array.from({ length: bars }).map((_, i) => (
              <div key={i} className="w-1 h-1.5 rounded-full bg-gray-400 dark:bg-slate-500" />
            ))}
            <MicOff className="w-3.5 h-3.5 text-gray-500 ml-1" />
            <span className="text-[11px] text-gray-500 font-medium">Idle</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
