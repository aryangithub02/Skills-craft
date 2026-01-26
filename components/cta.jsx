import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="w-full py-24 bg-background relative overflow-hidden">
       <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none -z-10 w-full h-full transform scale-150" />
      
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
            Ready to Accelerate Your Career?
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Join thousands of professionals who are advancing their careers with AI-powered guidance.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 text-base animate-pulse hover:animate-none">
              Start For Free Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
