"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#EEF1F6] dark:bg-[#090A10] border-t border-slate-200/80 dark:border-slate-800/80 py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
                Skills<span className="text-indigo-600 dark:text-indigo-400 font-black">Craft</span> AI
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
              The next-generation AI Career Coach platform helping job seekers build ATS-optimized resumes, practice live voice AI mock interviews, and land dream roles.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full neo-button-secondary flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full neo-button-secondary flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full neo-button-secondary flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 font-heading">Product</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <li><Link href="/opportunities" className="hover:text-[#3F7D58] text-[#3F7D58] font-bold transition-colors">Career Opportunities Hub</Link></li>
              <li><Link href="/resume" className="hover:text-[#3F7D58] transition-colors">Resume Builder</Link></li>
              <li><Link href="/interview" className="hover:text-[#3F7D58] transition-colors">AI Mock Interview</Link></li>
              <li><Link href="/cover-letter" className="hover:text-[#3F7D58] transition-colors">Cover Letter AI</Link></li>
              <li><Link href="#insights" className="hover:text-[#3F7D58] transition-colors">Industry Insights</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#3F7D58] transition-colors">Career Analytics</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">Resources</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <li><Link href="#features" className="hover:text-indigo-600 transition-colors">Feature Guide</Link></li>
              <li><Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing Plans</Link></li>
              <li><Link href="#testimonials" className="hover:text-indigo-600 transition-colors">Success Stories</Link></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">ATS Keyword Database</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">Company</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">About SkillsCraft</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} SkillsCraft AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for job seekers worldwide.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
