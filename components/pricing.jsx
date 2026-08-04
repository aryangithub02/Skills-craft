"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for students & job seekers preparing for their first interviews.",
    features: [
      "2 AI Mock Interviews / mo",
      "Basic ATS Resume Score",
      "Standard Cover Letter Generator",
      "Access to Industry Salary Data",
      "Community Prep Forum",
    ],
    cta: "Start Free",
    popular: false,
    href: "/interview",
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Our most popular plan for active job hunters targeting top tech companies.",
    features: [
      "Unlimited AI Mock Interviews",
      "Live Voice Persona (Maya)",
      "Proctoring & Facial Telemetry",
      "Unlimited ATS Resume Scans",
      "Tailored STAR Cover Letters",
      "Full Industry Market Analytics",
      "Priority AI API Response Speed",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    href: "/sign-in",
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "per month / seat",
    description: "For coding bootcamps, universities, and recruiting teams.",
    features: [
      "Everything in Pro Plan",
      "Custom AI Recruiter Personas",
      "Multi-User Admin Dashboard",
      "Cohort Candidate Scoring",
      "Dedicated Account Manager",
      "Custom API Integrations",
      "SLA 99.9% Uptime Guarantee",
    ],
    cta: "Contact Enterprise",
    popular: false,
    href: "/sign-in",
  },
];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-[#F5F7FB] dark:bg-[#0F101A] relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neo-surface text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
            <Zap className="w-4 h-4 text-indigo-500 fill-current" />
            <span>Simple Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Invest in Your Career <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Growth Today
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Choose the plan that fits your job search goals. Cancel or upgrade anytime with a 14-day money-back guarantee.
          </p>
        </div>

        {/* 3 Neo-Neumorphic Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative flex flex-col justify-between"
            >
              <div
                className={`neo-surface rounded-3xl p-8 h-full flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? "border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 bg-gradient-to-b from-white to-indigo-50/20 dark:from-slate-900 dark:to-indigo-950/20"
                    : "border border-white/90 dark:border-slate-800 shadow-xl"
                }`}
              >
                {/* Popular Highlight Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full neo-button-primary text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" /> Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="py-2 border-y border-slate-100 dark:border-slate-800">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 font-mono">{plan.price}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold ml-1.5">/ {plan.period}</span>
                  </div>

                  {/* Features Checklist */}
                  <ul className="space-y-3 pt-2">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-8">
                  <Button
                    asChild
                    size="lg"
                    className={`w-full rounded-full text-xs font-black h-12 ${
                      plan.popular
                        ? "neo-button-primary text-white shadow-xl shadow-indigo-500/25"
                        : "neo-button-secondary text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <Link href={plan.href} className="flex items-center justify-center gap-2">
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
