
import HeroSection from "@/components/hero";
import FeaturesSection from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import TestimonialsSection from "@/components/testimonials";
import CTASection from "@/components/cta";
import StatsSection from "@/components/stats";
import FAQSection from "@/components/faq";

export default function LandingPage() {
  return (
    <>
      <div className="grid-background" />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
