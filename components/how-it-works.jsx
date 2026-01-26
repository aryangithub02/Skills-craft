import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-8 h-8 text-primary" />,
    title: "Onboard & Define Profile",
    description: "Start by setting up your industry and career goals.",
  },
  {
    icon: <FileEdit className="w-8 h-8 text-primary" />,
    title: "Build Professional Documents",
    description: "Create ATS-optimised resumes and cover letters in seconds.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Ace the Interview",
    description: "Practice with AI-tailored mock interviews and get feedback.",
  },
  {
    icon: <LineChart className="w-8 h-8 text-primary" />,
    title: "Track & Improve",
    description: "Get insights and improve your profile continuously.",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Four simple steps to accelerate your career journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center p-4">
                {step.icon}
              </div>
              <h3 className="font-semibold text-xl">{step.title}</h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
