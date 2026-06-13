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
      "Yes — every one of our 250+ tools is 100% free with no hidden costs, watermarks, or usage limits. The platform is supported by non-intrusive advertising so everything stays free.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No registration required. All tools are available instantly — just open the tool and start working. No account, no email, no personal information needed.",
  },
  {
    question: "Are my files safe and private?",
    answer:
      "Yes. The vast majority of our tools process everything locally in your browser using client-side JavaScript. Your files never leave your device and are never uploaded to our servers. A small number of tools (like the Website Speed Checker) call external APIs — but those only transmit the URL you enter, never your files.",
  },
  {
    question: "What kinds of tools are available?",
    answer:
      "We cover 12 categories: PDF tools (compress, merge, split, convert), image tools (resize, compress, convert HEIC/WebP/AVIF), audio tools (cut, convert, normalise), AI content tools (cover letters, emails, blog outlines), SEO tools (meta tags, schema generators, redirect checkers), developer tools (JSON formatter, hash generators, regex tester), business tools (invoice generators, expense tracker), financial calculators (EMI, SIP, GST, CAGR), text utilities, unit converters, color and CSS tools, and network tools.",
  },
  {
    question: "Do the AI tools require an API key?",
    answer:
      "No. Our AI tools use template-based generation that runs entirely in your browser — no external AI API calls, no key required. Results are structured, professional outputs you can customise.",
  },
  {
    question: "What file size limits are there?",
    answer:
      "Since processing happens in your browser, limits depend on your device's available RAM rather than a server-side cap. Most users process files up to 50–100 MB without issues. Very large files may be slower on older or low-memory devices.",
  },
  {
    question: "Do tools work on mobile devices?",
    answer:
      "Yes. All tools are fully responsive and tested on smartphones and tablets. The interface adapts to smaller screens for a comfortable, usable experience.",
  },
  {
    question: "Can I suggest a new tool?",
    answer:
      "Absolutely — user suggestions are how most of our tools get built. Head to the Contact page or email feedback@allconverter.tools with your idea and use case. Popular requests are prioritised.",
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
