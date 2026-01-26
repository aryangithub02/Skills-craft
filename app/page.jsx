import HeroSection from "@/components/hero";
import FeaturesSection from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import TestimonialsSection from "@/components/testimonials";
import CTASection from "@/components/cta";
import StatsSection from "@/components/stats";
import FAQSection from "@/components/faq";

/**
 * Compose the landing page by assembling the decorative background and all page sections.
 *
 * Renders the grid background and the page's sections in order: hero, stats, features,
 * how-it-works, testimonials, FAQ, and call-to-action.
 * @returns {JSX.Element} The landing page element containing the assembled sections.
 */
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