"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Sparkles, 
  Award, 
  Layers,
  ArrowUpRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const SALARY_DATA = [
  { level: "Entry (0-1 yrs)", salary: 95000, maxSalary: 120000 },
  { level: "Junior (2-3 yrs)", salary: 125000, maxSalary: 150000 },
  { level: "Mid-Level (4-6 yrs)", salary: 165000, maxSalary: 195000 },
  { level: "Senior (7+ yrs)", salary: 215000, maxSalary: 260000 },
  { level: "Lead / Staff", salary: 265000, maxSalary: 320000 },
];

const TOP_SKILLS = [
  { name: "React / Next.js", demand: "96% High", growth: "+32%" },
  { name: "System Design", demand: "94% High", growth: "+28%" },
  { name: "Node.js & Microservices", demand: "91% High", growth: "+24%" },
  { name: "Cloud & Kubernetes", demand: "88% High", growth: "+30%" },
  { name: "AI Integration (LLMs)", demand: "99% Peak", growth: "+145%" },
];

export default function IndustryPreview() {
  const [activeTab, setActiveTab] = useState("salary");

  return (
    <section id="insights" className="py-24 sm:py-32 bg-[#F5F7FB] dark:bg-[#0F101A] relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neo-surface text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
            <BarChart3 className="w-4 h-4 text-cyan-500" />
            <span>Real-Time Market Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Data-Driven Career <br />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Industry Insights
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Stay ahead of the hiring curve with live compensation benchmarks, skill demand velocity, and AI hiring trends.
          </p>
        </div>

        {/* Neo-Neumorphic Insights Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Interactive Chart Box (8 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 neo-surface rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-white/90 dark:border-slate-800"
          >
            {/* Chart Header & Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-500" /> Software Engineering Compensation Spectrum
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Aggregated across top US tech hubs (SF, NYC, Austin, Remote)</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl neo-inset">
                <button
                  type="button"
                  onClick={() => setActiveTab("salary")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeTab === "salary"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Salary Bands
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("growth")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeTab === "growth"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Growth Velocity
                </button>
              </div>
            </div>

            {/* Recharts Salary Graph */}
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === "salary" ? (
                  <AreaChart data={SALARY_DATA}>
                    <defs>
                      <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B5CEB" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#5B5CEB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="level" tick={{ fontSize: 11, fill: "#64748B" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(val) => `$${val / 1000}k`} />
                    <Tooltip
                      formatter={(val) => [`$${val.toLocaleString()}`, "Base Compensation"]}
                      contentStyle={{
                        backgroundColor: "#181926",
                        borderColor: "#334155",
                        borderRadius: "16px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Area type="monotone" dataKey="salary" stroke="#5B5CEB" strokeWidth={3} fillOpacity={1} fill="url(#colorSalary)" />
                  </AreaChart>
                ) : (
                  <BarChart data={SALARY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="level" tick={{ fontSize: 11, fill: "#64748B" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(val) => `$${val / 1000}k`} />
                    <Tooltip
                      formatter={(val) => [`$${val.toLocaleString()}`, "Total Compensation (TC)"]}
                      contentStyle={{
                        backgroundColor: "#181926",
                        borderColor: "#334155",
                        borderRadius: "16px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="maxSalary" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Bottom Key Metric Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Median Salary</span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">$165,000</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Yearly Growth</span>
                <span className="text-lg font-black text-emerald-600 font-mono">+18.4%</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Hiring Velocity</span>
                <span className="text-lg font-black text-indigo-600 font-mono">High 🔥</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Remote Roles</span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">64%</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Demand Meter & Top Skills (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Demand Meter Card */}
            <div className="neo-surface rounded-3xl p-6 space-y-4 shadow-xl border border-white/90 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Market Demand Meter
                </h4>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  88% Very High
                </span>
              </div>

              {/* Progress bar meter */}
              <div className="space-y-1.5">
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden neo-inset">
                  <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full w-[88%]" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>Low Demand</span>
                  <span>Moderate</span>
                  <span className="text-emerald-600 font-black">Peak Demand</span>
                </div>
              </div>
            </div>

            {/* Top Skills List Card */}
            <div className="neo-surface rounded-3xl p-6 space-y-4 shadow-xl border border-white/90 dark:border-slate-800">
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" /> Top In-Demand Skills
              </h4>

              <div className="space-y-3">
                {TOP_SKILLS.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">{skill.name}</span>
                      <span className="text-[10px] text-indigo-500 font-bold">{skill.demand}</span>
                    </div>
                    <span className="text-xs font-black text-emerald-600 font-mono bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                      {skill.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-3xl text-white space-y-3 shadow-xl shadow-indigo-500/20">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-200">
                <Sparkles className="w-4 h-4" /> AI Recruiter Insight
              </div>
              <p className="text-xs leading-relaxed font-medium">
                &ldquo;Engineering candidates with System Design proficiency and Full Stack Next.js experience receive 2.4x more interview callbacks.&rdquo;
              </p>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
