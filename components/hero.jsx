"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <section className="w-full pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-background relative" ref={containerRef}>
        {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl z-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 hover:bg-primary/30 rounded-[100%] blur-[100px] opacity-70 transition-all duration-700" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background/50 backdrop-blur-md border-primary/20 text-primary"
          >
            ✨ AI-Powered Career Coaching
          </motion.div>
          
          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Your Personal AI Coach for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Professional Success
            </span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-[700px] text-lg text-muted-foreground md:text-xl leading-relaxed"
          >
            Advance your career with personalized guidance, interview prep, and AI-optimized resumes. 
            The future of your career starts here.
          </motion.p>
          
          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* 3D Dashboard Preview */}
        <motion.div 
            className="mt-20 relative mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ 
                perspective: "1000px",
            }}
        >
            <motion.div
                style={{
                    rotateX,
                    scale,
                    opacity,
                    transformStyle: "preserve-3d"
                }}
                className="rounded-xl border border-border/50 bg-background shadow-2xl shadow-primary/10 p-2"
            >
                <div className="rounded-lg overflow-hidden relative aspect-video bg-muted/20 ring-1 ring-border/50">
                     <Image
                        src="/Landing-Page-Main.jpg"
                        alt="SkillsCraft Dashboard Preview"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                </div>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
