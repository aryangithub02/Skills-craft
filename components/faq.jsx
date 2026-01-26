import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI career coach work?",
    answer:
      "Our AI analyzes your skills, experience, and career goals to provide personalized guidance. It uses advanced language models to review your resume, generate interview questions specific to your industry, and offer actionable advice to improve your professional profile.",
  },
  {
    question: "Is SkillsCraft free to use?",
    answer:
      "Yes, we offer a free tier that gives you access to basic resume analysis and a limited number of mock interview questions. For unlimited access to specialized industry insights, advanced resume improvements, and unlimited practice sessions, we offer a premium subscription.",
  },
  {
    question: "Can I download my resume and cover letter?",
    answer:
      "Absolutely. Any resume or cover letter you create or improve within the platform can be exported as a PDF or standard text format, ready to be submitted to applications.",
  },
  {
    question: "How accurate are the industry insights?",
    answer:
      "We aggregate data from multiple reputable sources and job markets weekly. Our backend systems process this data to spot trends, salary changes, and emerging skill demands, ensuring you have the most up-to-date information.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, your data security is our top priority. We use industry-standard encryption and do not share your personal information with third parties without your explicit consent. You can delete your account and data at any time.",
  },
];

/**
 * Render a responsive FAQ section containing a collapsible accordion of predefined question-and-answer pairs.
 *
 * @returns {JSX.Element} The FAQ section element.
 */
export default function FAQSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}