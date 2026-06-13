import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Briefcase,
  Handshake,
  Bug,
  Lightbulb,
  Clock,
  MessageSquare,
  ChevronDown,
  Zap,
  ExternalLink,
} from "lucide-react";
import { siteConfig } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the AllConverter.tools team — support, business inquiries, partnerships, bug reports, and feature requests. We respond within 1–2 business days.",
  alternates: { canonical: `${siteConfig.url}/contact/` },
};

const contacts = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "General Support",
    email: "support@allconverter.tools",
    description: "Tool issues, usage questions, account help",
    response: "1–2 business days",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    label: "Business Inquiries",
    email: "business@allconverter.tools",
    description: "Licensing, enterprise use, white-label enquiries",
    response: "2–3 business days",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: <Handshake className="w-5 h-5" />,
    label: "Partnerships",
    email: "partnerships@allconverter.tools",
    description: "Integrations, co-marketing, tool collaborations",
    response: "3–5 business days",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: <Bug className="w-5 h-5" />,
    label: "Bug Reports",
    email: "bugs@allconverter.tools",
    description: "Tool errors, broken outputs, unexpected behaviour",
    response: "Within 24 hours",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    label: "Feature Requests",
    email: "feedback@allconverter.tools",
    description: "Suggest new tools, improvements, integrations",
    response: "2–3 business days",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
];

const faqs = [
  {
    q: "Are all tools completely free?",
    a: "Yes — every tool on AllConverter.tools is free to use with no sign-up, no subscription, and no limits. We sustain the platform through non-intrusive advertising.",
  },
  {
    q: "Do you store the files I process?",
    a: "No. All processing happens locally in your browser. Your files never leave your device and are never uploaded to our servers. When you close the tab, everything is cleared.",
  },
  {
    q: "A tool is giving me the wrong output. What should I do?",
    a: "Please email bugs@allconverter.tools with a description of the tool, the file or input you used, what you expected, and what you got instead. Screenshots help. We prioritise bug reports.",
  },
  {
    q: "Can I request a new tool or feature?",
    a: "Absolutely — we build based on what users actually need. Send your idea to feedback@allconverter.tools. Include your use case so we understand the context. Popular requests get prioritised.",
  },
  {
    q: "I want to use AllConverter.tools for my business or embed it in my product. Is that allowed?",
    a: "Commercial and enterprise use cases vary. Email business@allconverter.tools with details about how you intend to use the platform and we will advise on whether it falls within our Terms or requires a separate arrangement.",
  },
  {
    q: "How do I report a security vulnerability?",
    a: "Please email security@allconverter.tools with a clear description of the issue and steps to reproduce it. We acknowledge all reports within 48 hours and aim to resolve confirmed vulnerabilities within 14 days.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-14">
        <div className="container-xl max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-[var(--radius-base)] bg-[var(--brand)] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-brand)]">Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)] mb-4">
            We&apos;re here to help.
          </h1>
          <p className="text-base text-[var(--body-subtle)] leading-relaxed max-w-xl">
            Whether you have a question about a tool, spotted a bug, have a partnership idea, or just
            want to say hello — drop us a line. A real person reads every message.
          </p>
        </div>
      </section>

      {/* Response time banner */}
      <div className="border-b border-[var(--border-default)] bg-[var(--brand-soft)]">
        <div className="container-xl max-w-3xl py-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--fg-brand)] shrink-0" />
          <p className="text-xs text-[var(--body-subtle)]">
            <strong className="text-[var(--heading)]">Response times:</strong> Support &amp; bugs within 24 hours &nbsp;·&nbsp; Business &amp; partnerships within 3–5 business days &nbsp;·&nbsp; Monday–Friday, IST
          </p>
        </div>
      </div>

      <div className="container-xl max-w-3xl py-12 space-y-14">

        {/* Contact cards */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--heading)] mb-1">Choose the right inbox</h2>
          <p className="text-sm text-[var(--body-subtle)] mb-6">
            Routing your message correctly gets you a faster, more useful reply.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contacts.map((c) => (
              <a
                key={c.email}
                href={`mailto:${c.email}`}
                className="group flex flex-col gap-3 p-5 rounded-xl border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] hover:border-[var(--border-brand)] hover:bg-[var(--brand-soft)] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-9 h-9 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center ${c.color} shrink-0`}>
                    {c.icon}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--body-subtle)] opacity-0 group-hover:opacity-60 transition-opacity mt-0.5 shrink-0" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--heading)] mb-0.5">{c.label}</p>
                  <p className="text-xs text-[var(--body-subtle)] mb-2">{c.description}</p>
                  <p className="text-xs font-mono text-[var(--fg-brand)]">{c.email}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-auto pt-1 border-t border-[var(--border-default)]">
                  <Clock className="w-3 h-3 text-[var(--body-subtle)]" />
                  <span className="text-[11px] text-[var(--body-subtle)]">Typically replies in {c.response}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Bug reporting */}
        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)]">
            <Bug className="w-4 h-4 text-red-500" />
            <h2 className="font-semibold text-[var(--heading)]">Reporting a Bug</h2>
          </div>
          <div className="px-6 py-5 text-sm text-[var(--body-subtle)] space-y-3">
            <p>
              Found something broken? We take bug reports seriously — they directly improve the experience
              for every user. To help us reproduce and fix the issue quickly, please include:
            </p>
            <ul className="space-y-2">
              {[
                "The name of the tool (e.g. \"PDF Compressor\" or the URL of the tool page)",
                "A brief description of what you were trying to do",
                "What you expected to happen vs. what actually happened",
                "Your browser name and version (e.g. Chrome 124, Safari 17)",
                "A screenshot or screen recording if the issue is visual",
                "The file type you were processing, if relevant (no need to send the actual file)",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <a
                href="mailto:bugs@allconverter.tools?subject=Bug Report"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fg-brand)] hover:opacity-80 transition-opacity"
              >
                <Mail className="w-4 h-4" />
                Send a bug report →
              </a>
            </div>
          </div>
        </section>

        {/* Feature requests */}
        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)]">
            <Lightbulb className="w-4 h-4 text-violet-500" />
            <h2 className="font-semibold text-[var(--heading)]">Suggesting a Feature or New Tool</h2>
          </div>
          <div className="px-6 py-5 text-sm text-[var(--body-subtle)] space-y-3">
            <p>
              AllConverter.tools grows because of suggestions from people who actually use it. Every
              feature request is read, logged, and weighed against demand. The clearer your pitch,
              the more likely it gets built. Tell us:
            </p>
            <ul className="space-y-2">
              {[
                "What tool or feature you want — be specific (\"a HEIC to WebP converter\" rather than \"more image tools\")",
                "What problem it solves for you — context helps us prioritise accurately",
                "How often you would use it — daily driver vs. occasional need both matter",
                "Any tools or examples you've seen elsewhere that do it well",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <a
                href="mailto:feedback@allconverter.tools?subject=Feature Request"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fg-brand)] hover:opacity-80 transition-opacity"
              >
                <Mail className="w-4 h-4" />
                Submit a feature request →
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-[var(--fg-brand)]" />
            <h2 className="text-lg font-semibold text-[var(--heading)]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-xl border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none hover:bg-[var(--brand-soft)] transition-colors">
                  <span className="text-sm font-medium text-[var(--heading)]">{q}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--body-subtle)] shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-4 text-sm text-[var(--body-subtle)] leading-relaxed border-t border-[var(--border-default)] pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Closing note */}
        <section className="rounded-xl border border-[var(--border-brand)] bg-[var(--brand-soft)] p-6 flex gap-4">
          <div className="shrink-0 w-9 h-9 rounded-[var(--radius-base)] bg-[var(--brand)] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-current" />
          </div>
          <div>
            <p className="font-semibold text-[var(--heading)] mb-1">Not finding what you need?</p>
            <p className="text-sm text-[var(--body-subtle)] leading-relaxed">
              Browse our{" "}
              <Link href="/tools/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                full tools directory
              </Link>{" "}
              or check our{" "}
              <Link href="/disclaimer/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                Disclaimer
              </Link>{" "}
              and{" "}
              <Link href="/privacy/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                Privacy Policy
              </Link>{" "}
              for answers to legal and data questions. For everything else —{" "}
              <a href="mailto:support@allconverter.tools" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                just email us
              </a>.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
