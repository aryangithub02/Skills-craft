"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  Moon, 
  Sun, 
  Menu, 
  ChevronDown, 
  FileText, 
  GraduationCap, 
  LayoutDashboard, 
  PenBox,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkUser } from "@/lib/checkUser";
import UserButton from "@/components/user-button";

export default function Header() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync user data on load
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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const GrowthToolsMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 font-medium text-muted-foreground hover:text-primary">
          Growth Tools <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/resume" className="flex items-center cursor-pointer">
            <FileText className="mr-2 h-4 w-4 text-blue-500" />
            Resume Builder
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/cover-letter" className="flex items-center cursor-pointer">
            <PenBox className="mr-2 h-4 w-4 text-orange-500" />
            Cover Letter
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/interview" className="flex items-center cursor-pointer">
            <GraduationCap className="mr-2 h-4 w-4 text-green-500" />
            Interview Prep
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled ? "bg-background/80 dark:bg-black backdrop-blur-md shadow-sm" : "bg-transparent dark:bg-black border-transparent"}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
            <Image 
              src={mounted && (theme === "dark" || resolvedTheme === "dark") ? "/logo-dark-v2.png" : "/favicon.png"} 
              alt="SkillsCraft Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            <span className="text-primary">Skills</span>Craft
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center">
            <LayoutDashboard className="h-4 w-4 mr-1.5" />
            Dashboard
          </Link>
          
          <GrowthToolsMenu />
        </nav>

        {/* Theme Toggle & Auth */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-muted transition-all duration-300 transform hover:rotate-12"
            aria-label="Toggle theme"
          >
            {!mounted ? null : theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600" />
            )}
          </button>

          {mounted && (
            <>
              {!session ? (
                <Button asChild size="sm" className="hidden sm:flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              ) : (
                <UserButton />
              )}

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px]">
                    <SheetHeader className="text-left border-b pb-4 mb-4">
                      <SheetTitle className="flex items-center gap-2">
                         <span className="font-bold text-xl">
                          <span className="text-primary">Skills</span>Craft
                        </span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4">
                      <Link href="/dashboard" className="flex items-center gap-2 text-lg font-medium hover:text-primary">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Link>
                      
                      <div className="pt-2 pb-2">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Growth Tools</p>
                        <div className="pl-4 border-l-2 border-muted space-y-3">
                            <Link href="/resume" className="flex items-center gap-2 text-base font-medium hover:text-primary">
                                <FileText className="h-5 w-5" />
                                Resume Builder
                            </Link>
                            <Link href="/cover-letter" className="flex items-center gap-2 text-base font-medium hover:text-primary">
                                <PenBox className="h-5 w-5" />
                                Cover Letter
                            </Link>
                             <Link href="/interview" className="flex items-center gap-2 text-base font-medium hover:text-primary">
                                <GraduationCap className="h-5 w-5" />
                                Interview Prep
                            </Link>
                        </div>
                      </div>

                      {!session && (
                         <Button asChild className="mt-4 w-full">
                           <Link href="/sign-in">Sign In</Link>
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
