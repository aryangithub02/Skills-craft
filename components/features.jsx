import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Target, PenTool, TrendingUp } from "lucide-react";

const features = [
  {
    title: "AI Resume Builder",
    description: "Create ATS-optimized resumes in minutes. Our AI analyzes your experience and tailors it to job descriptions for maximum visibility.",
    icon: FileText,
    color: "text-blue-500",
    gradient: "from-blue-500/10 to-transparent",
  },
  {
    title: "Smart Cover Letters",
    description: "Generate compelling, personalized cover letters that match your tone and the company's culture at the click of a button.",
    icon: PenTool,
    color: "text-orange-500",
    gradient: "from-orange-500/10 to-transparent",
  },
  {
    title: "Mock Interview Coach",
    description: "Practice with realistic, AI-generated questions tailored to your industry. Get real-time feedback on your answers.",
    icon: Target,
    color: "text-green-500",
    gradient: "from-green-500/10 to-transparent",
  },
  {
    title: "Industry Insights",
    description: "Stay ahead with real-time analysis of salary trends, in-demand skills, and market growth for your specific career path.",
    icon: TrendingUp,
    color: "text-purple-500",
    gradient: "from-purple-500/10 to-transparent",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background" id="features">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Everything You Need to Succeed
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our platform combines advanced AI with deep industry knowledge to provide a comprehensive career toolkit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border bg-card hover:bg-muted/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group">
               <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <CardHeader className="relative z-10">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-background border mb-4 shadow-sm ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};


