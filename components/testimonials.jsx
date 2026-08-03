"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, Award } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    initials: "SJ",
    role: "Senior Frontend Engineer",
    company: "Landed offer at Meta ($285k TC)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    gradient: "from-indigo-500 to-purple-600",
    review: "SkillsCraft AI Mock Interviews completely eliminated my interview anxiety. Maya's system design questions were nearly identical to my actual Meta onsite interview!",
    rating: 5,
  },
  {
    name: "Marcus Vance",
    initials: "MV",
    role: "Full Stack Developer",
    company: "Hired at Stripe ($210k TC)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    gradient: "from-blue-500 to-cyan-600",
    review: "The ATS Resume Scanner identified 14 missing keywords in my resume. Within 3 days of updating my bullet points with SkillsCraft AI, I got 4 FAANG callback emails.",
    rating: 5,
  },
  {
    name: "Elena Rostova",
    initials: "ER",
    role: "Product Designer & Architect",
    company: "Landed offer at Linear ($195k TC)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    gradient: "from-purple-500 to-pink-600",
    review: "The live verbal speech feedback and STAR structure scoring gave me the exact confidence boost I needed. Highly recommend to any tech professional!",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-[#F5F7FB] dark:bg-[#0F101A] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neo-surface text-xs font-extrabold text-amber-600 dark:text-amber-400">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Loved by 12,000+ Engineers &amp; <br />
            <span className="bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Tech Professionals
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            See how job seekers used SkillsCraft AI to land top engineering, product, and data roles at leading tech companies.
          </p>
        </div>

        {/* Floating Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="neo-surface rounded-3xl p-8 flex flex-col justify-between shadow-xl border border-white/90 dark:border-slate-800 relative group"
            >
              <div className="space-y-6">
                
                {/* Top Row: Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors" />
                </div>

                {/* Review Text */}
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>

              {/* User Avatar & Details */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
                <div className={`relative w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30 shrink-0 bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="absolute">{t.initials}</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">{t.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.role}</p>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{t.company}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
