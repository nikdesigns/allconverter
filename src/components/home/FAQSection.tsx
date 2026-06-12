"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Are all tools completely free?",
    answer:
      "Yes, every tool on AllConverter.tools is 100% free with no hidden costs, watermarks, or usage limits. We're supported by non-intrusive advertising to keep everything free.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No registration is required. All tools are available instantly without creating an account or providing any personal information.",
  },
  {
    question: "Are my files safe and private?",
    answer:
      "Absolutely. All file processing happens directly in your browser using client-side JavaScript. Your files never leave your device and are never uploaded to our servers.",
  },
  {
    question: "What file size limits are there?",
    answer:
      "Since processing happens in your browser, limits depend on your device's RAM. Most users can process files up to 50–100MB without issues. Large files may process slower on older devices.",
  },
  {
    question: "Do tools work on mobile devices?",
    answer:
      "Yes, all tools are fully responsive and work on smartphones and tablets. The interface adapts to smaller screens for a comfortable experience.",
  },
  {
    question: "How often are new tools added?",
    answer:
      "We add new tools regularly based on user requests and trending needs. Follow us on Twitter or subscribe to our newsletter to stay updated.",
  },
  {
    question: "Can I suggest a new tool?",
    answer:
      "Absolutely! We love user suggestions. Use the Contact page to request new tools or improvements to existing ones. Many of our current tools were user-requested.",
  },
  {
    question: "Do tools work offline?",
    answer:
      "Once the page is loaded, most tools work without an internet connection since processing happens in your browser. However, initial page load requires internet access.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--neutral-secondary-soft)]">
      <div className="container-xl">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-[var(--heading)]">
              Frequently asked questions
            </h2>
            <p className="text-[var(--body-subtle)] text-sm">
              Everything you need to know about AllConverter.tools.
            </p>
          </div>

          <Accordion className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                className="border border-[var(--border-default)] rounded-[var(--radius-base)] bg-[var(--neutral-primary-soft)] px-5 py-1"
              >
                <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4 text-[var(--heading)]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[var(--body-subtle)] leading-relaxed pb-4">
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
