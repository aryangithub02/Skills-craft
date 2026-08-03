"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { 
  Moon, 
  Sun, 
  Menu, 
  Sparkles,
  FileText, 
  Video, 
  BarChart3, 
  ArrowRight,
  LayoutDashboard,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { checkUser } from "@/lib/checkUser";
import UserButton from "@/components/user-button";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const syncUser = async () => {
      try {
        if (session?.user?.email) {
          await checkUser();
        }
      } catch (error) {
        console.error("User sync failed:", error);
      }
    };
    syncUser();
  }, [session]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0c0d15]/90 backdrop-blur-md transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#3F7D58] flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">
            Skills<span className="text-[#3F7D58] dark:text-[#4E8D72]">Craft</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-3.5 lg:gap-5">
          <Link
            href="/dashboard"
            className="text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#3F7D58] dark:hover:text-[#4E8D72] transition-colors flex items-center gap-1"
          >
            <LayoutDashboard className="w-4 h-4 text-[#3F7D58]" />
            Dashboard
          </Link>
          <Link
            href="/opportunities"
            className="text-xs lg:text-sm font-extrabold text-[#3F7D58] dark:text-[#4E8D72] hover:text-[#35694A] transition-colors flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E6F4EA] dark:bg-emerald-950/60 border border-[#B1D3B9] dark:border-emerald-800"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#3F7D58]" />
            Career Opportunities
          </Link>
          <Link
            href="/resume"
            className="text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#3F7D58] dark:hover:text-[#4E8D72] transition-colors flex items-center gap-1"
          >
            <FileText className="w-4 h-4 text-[#3F7D58]" />
            Resume Intelligence
          </Link>
          <Link
            href="/interview"
            className="text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#3F7D58] dark:hover:text-[#4E8D72] transition-colors flex items-center gap-1"
          >
            <Video className="w-4 h-4 text-[#3F7D58]" />
            AI Mock Interview
          </Link>
          <Link
            href="/#insights"
            className="text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#3F7D58] dark:hover:text-[#4E8D72] transition-colors flex items-center gap-1"
          >
            <BarChart3 className="w-4 h-4 text-[#3F7D58]" />
            Industry Insights
          </Link>
          <Link
            href="/#pricing"
            className="text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#3F7D58] dark:hover:text-[#4E8D72] transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Theme Toggle & Auth */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#3F7D58] transition-colors"
            aria-label="Toggle Theme"
          >
            {mounted && (theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#3F7D58]" />)}
          </button>

          {mounted && (
            <>
              {!session ? (
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#3F7D58]"
                  >
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#3F7D58] hover:bg-[#35694A] text-white text-sm font-bold rounded-xl px-5 h-9"
                  >
                    <Link href="/sign-in" className="flex items-center gap-1.5">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <UserButton />
              )}

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl">
                      <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] bg-white dark:bg-[#0c0d15] border-slate-200 dark:border-slate-800">
                    <SheetHeader className="text-left border-b border-slate-100 dark:border-slate-800 pb-4">
                      <SheetTitle className="flex items-center gap-2 text-lg font-black">
                        Skills<span className="text-[#3F7D58]">Craft</span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 py-6">
                      <Link href="/dashboard" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#3F7D58]">
                        Dashboard
                      </Link>
                      <Link href="/opportunities" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#3F7D58] flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#3F7D58]" /> Career Opportunities
                      </Link>
                      <Link href="/resume" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#3F7D58]">
                        Resume Intelligence
                      </Link>
                      <Link href="/interview" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#3F7D58]">
                        AI Mock Interview
                      </Link>
                      <Link href="/#insights" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#3F7D58]">
                        Industry Insights
                      </Link>
                      <Link href="/#pricing" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#3F7D58]">
                        Pricing
                      </Link>

                      {!session && (
                        <Button asChild className="bg-[#3F7D58] hover:bg-[#35694A] text-white w-full rounded-xl mt-4 font-bold">
                          <Link href="/sign-in">Get Started Free</Link>
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
