import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The AI resume builder is incredibly intuitive. It helped me highlight the right skills and I got a callback within a week!",
    author: "Sarah Chen",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    role: "Software Engineer",
    company: "Tech Giant Co.",
  },
  {
    quote:
      "I was struggling with interviews, but the AI mock interview feature gave me the confidence I needed to ace my technical rounds.",
    author: "Michael Rodriguez",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Product Manager",
    company: "StartUp Inc.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "The industry insights are a game-changer. Knowing exact salary ranges and in-demand skills helped me negotiate a 20% raise.",
    author: "Priya Patel",
    role: "Data Scientist",
    image: "https://randomuser.me/api/portraits/women/42.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 sm:text-4xl md:text-5xl">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-none ring-1 ring-border shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-4">
                <Quote className="h-8 w-8 text-primary/40 mb-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground italic leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={testimonial.image} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

