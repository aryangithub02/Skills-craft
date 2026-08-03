"use client";

import HeroSection from "@/components/hero";
import FeaturesSection from "@/components/features";
import OpportunitiesPreview from "@/components/opportunities-preview";
import InterviewPreview from "@/components/interview-preview";
import IndustryPreview from "@/components/industry-preview";
import ResumePreview from "@/components/resume-preview";
import PricingSection from "@/components/pricing";
import TestimonialsSection from "@/components/testimonials";

export default function LandingPage() {
  return (
    <div className="bg-[#F5F7FB] dark:bg-[#0F101A] text-slate-900 dark:text-slate-100 min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Core Feature Cards */}
      <FeaturesSection />

      {/* 3. Live Career Opportunities Section */}
      <OpportunitiesPreview />

      {/* 4. AI Mock Interview Studio Section */}
      <InterviewPreview />

      {/* 5. Industry Insights Section */}
      <IndustryPreview />

      {/* 6. Resume & ATS Analysis Section */}
      <ResumePreview />

      {/* 7. Pricing Plans Section */}
      <PricingSection />

      {/* 8. Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}
