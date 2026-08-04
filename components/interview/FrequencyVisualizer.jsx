"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

const BAR_COUNT = 32;
const MIN_HEIGHT = 3;
const MAX_HEIGHT = 80;

/**
 * FrequencyVisualizer
 *
 * An animated equaliser‑style visualiser that renders an array of
 * frequency amplitude values (0‑255) as colour‑gradient bars.
 *
 * Props:
 *   data       – Uint8Array of frequency values (default: all zeros)
 *   barCount   – how many bars to display (default 32)
 *   className  – extra wrapper classes
 *   colorMode  – "spectrum" | "voice" | "energy" (default "spectrum")
 *   showLabels – show low/mid/high labels (default false)
 */
export function FrequencyVisualizer({
  data,
  barCount = BAR_COUNT,
  className = "",
  colorMode = "spectrum",
  showLabels = false,
}) {
  // Decimate the raw FFT data down to barCount bars
  const bars = useMemo(() => {
    if (!data || data.length === 0) {
      return Array.from({ length: barCount }, () => 0);
    }
    const step = data.length / barCount;
    const result = [];
    for (let i = 0; i < barCount; i++) {
      const start = Math.floor(i * step);
      const end = Math.floor((i + 1) * step);
      let sum = 0;
      let count = 0;
      for (let j = start; j < end && j < data.length; j++) {
        sum += data[j];
        count++;
      }
      // Normalise to 0‑100 %
      const avg = count > 0 ? sum / count : 0;
      result.push(Math.min(100, Math.round((avg / 255) * 100)));
    }
    return result;
  }, [data, barCount]);

  const getColor = (index, value) => {
    if (colorMode === "energy") {
      // Single‑colour intensity (green)
      const intensity = value / 100;
      return `rgba(52, 211, 153, ${0.3 + intensity * 0.7})`;
    }
    if (colorMode === "voice") {
      // Purple → pink gradient (voice‑friendly)
      const t = value / 100;
      const r = Math.round(139 + t * 116);  // 139 → 255
      const g = Math.round(92 + t * (t < 0.5 ? 100 : -80)); // dynamic
      const b = Math.round(246 - t * 46);   // 246 → 200
      return `rgb(${r}, ${Math.max(0, g)}, ${b})`;
    }
    // spectrum: blue → cyan → green → yellow → red
    if (value < 20) {
      return `rgba(99, 102, 241, ${0.3 + (value / 20) * 0.7})`; // indigo
    } else if (value < 40) {
      return `rgba(52, 211, 153, ${0.5 + ((value - 20) / 20) * 0.5})`; // emerald
    } else if (value < 60) {
      return `rgba(250, 204, 21, ${0.6 + ((value - 40) / 20) * 0.4})`; // amber
    } else if (value < 80) {
      return `rgba(251, 146, 60, ${0.7 + ((value - 60) / 20) * 0.3})`; // orange
    } else {
      return `rgba(239, 68, 68, ${0.8 + ((value - 80) / 20) * 0.2})`; // red
    }
  };

  const activeBars = bars.filter((v) => v > 0).length;
  const overallLevel = bars.reduce((a, b) => a + b, 0) / barCount;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Bar container */}
      <div className="flex items-end gap-[3px] h-[90px] px-1 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
        {bars.map((value, i) => {
          const height = Math.max(MIN_HEIGHT, (value / 100) * MAX_HEIGHT);
          return (
            <motion.div
              key={i}
              layout
              animate={{ height: `${height}px` }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 22,
                mass: 0.5,
              }}
              className="flex-1 rounded-t-sm rounded-b-none min-w-[3px]"
              style={{
                backgroundColor: getColor(i, value),
                boxShadow: value > 10
                  ? `0 0 6px ${getColor(i, value).replace(/[\d.]+\)$/, "0.35)")}`
                  : "none",
              }}
            />
          );
        })}
      </div>

      {/* Labels row */}
      {showLabels && (
        <div className="flex justify-between text-[9px] text-slate-600 font-mono px-1">
          <span>Low</span>
          <span>Mid</span>
          <span>High</span>
        </div>
      )}

      {/* Compact status row */}
      {activeBars > 0 && (
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {activeBars} bands active
          </span>
          <span className="font-mono tabular-nums">{Math.round(overallLevel)}%</span>
        </div>
      )}
    </div>
  );
}
