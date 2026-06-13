import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart, Server, Code2, Sparkles, RefreshCw,
  ShieldCheck, CreditCard, Eye, ArrowRight,
  CheckCircle2, Zap,
} from "lucide-react";
import { siteConfig } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: `Support the Project | ${siteConfig.name}`,
  description:
    "AllConverter.tools is free for everyone, forever. If it's saved you time, consider a one-time contribution to help cover hosting, AI API costs, and new tool development.",
  alternates: { canonical: `${siteConfig.url}/support/` },
  openGraph: {
    title: `Support AllConverter.tools`,
    description:
      "Built by one developer, kept free for everyone. A contribution of any size helps keep the lights on.",
    url: `${siteConfig.url}/support/`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const PAYPAL_URL = "https://www.paypal.com/paypalme/NitinKaushik";

const PayPalLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.67a.77.77 0 0 1 .76-.654h6.585c2.27 0 3.904.53 4.846 1.573.447.496.733 1.017.875 1.59.149.607.15 1.33.003 2.211l-.004.024v.656l.002.002c.406.209.77.476 1.083.796.524.539.858 1.213.993 2.004.138.805.104 1.762-.103 2.847-.24 1.271-.634 2.374-1.17 3.278a6.585 6.585 0 0 1-1.865 1.975 7.17 7.17 0 0 1-2.438.997 12.76 12.76 0 0 1-2.994.32H9.33a.77.77 0 0 0-.76.654l-.957 5.354a.641.641 0 0 1-.633.54H7.08l-.004-.003Zm9.705-14.3c-.03.189-.063.38-.102.577-.883 4.526-3.9 6.094-7.758 6.094H6.83a.951.951 0 0 0-.94.805L4.89 21.29h2.186l.717-4.032a.77.77 0 0 1 .76-.654h1.587c3.427 0 6.11-1.392 6.892-5.42.327-1.677.158-3.076-.251-4.147Z" />
  </svg>
);

const costs = [
  {
    icon: Server,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    title: "Hosting & Infrastructure",
    description: "Server costs, CDN delivery, SSL certificates, and domain registration to keep 342+ pages fast and reliably available worldwide.",
  },
  {
    icon: Code2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    title: "New Tool Development",
    description: "Research, design, and engineering time for every new tool — typically several additions each week across PDF, image, developer, and AI categories.",
  },
  {
    icon: Sparkles,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    title: "AI Service Costs",
    description: "Third-party API usage for AI-powered tools: cover letter generator, SQL builder, LinkedIn optimiser, code explainer, and resume analyser.",
  },
  {
    icon: RefreshCw,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "Maintenance & Compatibility",
    description: "Ongoing updates for browser compatibility, performance improvements, and bug fixes across all tools as web standards evolve.",
  },
];

const promises = [
  "All 250+ tools remain completely free — no paywalls, ever",
  "No premium tier. No freemium tricks. No feature locks",
  "Your files never leave your device — privacy by design",
  "No account required for any tool on this platform",
  "Ads will always be non-intrusive and clearly separated from content",
];

const trustIndicators = [
  { icon: ShieldCheck, color: "text-emerald-500", text: "All tools stay free. No premium tier, no paywall — ever." },
  { icon: CreditCard, color: "text-sky-500",     text: "One-time only. No recurring charges, no subscription." },
  { icon: Eye,        color: "text-violet-500",  text: "Contributions go to running costs and development only." },
];

const faqs = [
  {
    q: "Is AllConverter.tools really free?",
    a: "Yes, completely. Every tool on the platform is free with no hidden limits, no watermarks, and no sign-up required. That's not changing.",
  },
  {
    q: "What does my contribution actually pay for?",
    a: "Hosting, CDN bandwidth, AI API costs for the AI-powered tools, domain renewal, and engineering time for new features. No money goes to advertising, investors, or a team — it's a one-person project.",
  },
  {
    q: "Is there a minimum contribution amount?",
    a: "No minimum. PayPal allows any amount from $1 upward. Even a small contribution genuinely helps offset the monthly infrastructure costs.",
  },
  {
    q: "Will you add a premium tier in the future?",
    a: "No. The intent from day one has been to keep every tool free. A premium tier would conflict with the core reason this platform exists.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes. Contributions are processed entirely by PayPal — one of the world's most trusted payment platforms. AllConverter.tools never sees or stores your payment details.",
  },
  {
    q: "Can I get a receipt for my contribution?",
    a: "PayPal sends a receipt to your email automatically after every transaction.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen pt-20">

      {/* ── Hero ── */}
      <section className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-14 lg:py-20">
        <div className="container-xl max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-500">
              Support the Project
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--heading)] mb-5 leading-tight">
            Built free.{" "}
            <span className="gradient-text">Kept free.</span>
          </h1>
          <p className="text-[var(--body-subtle)] text-lg leading-relaxed max-w-2xl mb-8">
            AllConverter.tools is maintained by a single developer — no team, no VC funding, no premium
            tier. If the platform has saved you time, a one-time contribution helps keep it running and
            growing.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={PAYPAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-[var(--radius-default)] bg-[#FFC439] px-7 py-3.5 text-sm font-bold text-[#003087] hover:bg-[#f0b429] active:bg-[#e0a41e] transition-colors shadow-sm"
            >
              <PayPalLogo />
              Contribute via PayPal
            </a>
            <p className="text-xs text-[var(--body-subtle)]">
              Secure · One-time · Any amount
            </p>
          </div>
        </div>
      </section>

      <div className="container-xl max-w-5xl py-14 lg:py-20 space-y-20">

        {/* ── Cost Breakdown + Donation Card ── */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">

          {/* Left */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--body-subtle)] mb-5">
              What your contribution goes toward
            </p>
            <div className="space-y-3">
              {costs.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] px-5 py-4"
                  >
                    <div className={`mt-0.5 w-8 h-8 rounded-[var(--radius-default)] ${item.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--heading)] mb-0.5">{item.title}</p>
                      <p className="text-xs text-[var(--body-subtle)] leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Donation card */}
          <div>
            <div className="rounded-[var(--radius-base)] border border-[var(--border-brand)] bg-[var(--neutral-secondary-soft)] p-7 flex flex-col gap-6 sticky top-24">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--fg-brand)] mb-3">
                  One-time contribution
                </p>
                <h2 className="text-lg font-bold text-[var(--heading)] leading-snug">
                  Support ongoing development
                </h2>
                <p className="text-sm text-[var(--body-subtle)] mt-3 leading-relaxed">
                  No minimum amount, no recurring charge, no expectation. If this platform has been
                  useful to you, any contribution is genuinely appreciated.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={PAYPAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-default)] bg-[#FFC439] px-6 py-3.5 text-sm font-bold text-[#003087] hover:bg-[#f0b429] active:bg-[#e0a41e] transition-colors shadow-sm"
                >
                  <PayPalLogo />
                  Contribute via PayPal
                </a>
                <p className="text-center text-xs text-[var(--body-subtle)]">
                  Processed securely by PayPal · No account required
                </p>
              </div>

              <div className="pt-5 border-t border-[var(--border-default)]">
                <blockquote>
                  <p className="text-xs text-[var(--body-subtle)] leading-relaxed italic">
                    "I don't have a premium plan to sell you. This is an independent project I maintain
                    because people find it genuinely useful. Every tool stays free — that's not changing."
                  </p>
                  <footer className="mt-2 text-xs font-medium text-[var(--heading)]">
                    — Nitin Kaushik, Founder
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* ── Our Promises ── */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[var(--fg-brand)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--fg-brand)]">
              Our Commitment
            </p>
          </div>
          <h2 className="text-xl font-bold text-[var(--heading)] mb-6">
            What we promise, regardless of contributions
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {promises.map((promise) => (
              <div
                key={promise}
                className="flex items-start gap-3 rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] px-5 py-4"
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                <p className="text-sm text-[var(--body-subtle)] leading-relaxed">{promise}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Trust Indicators ── */}
        <div className="grid sm:grid-cols-3 gap-3">
          {trustIndicators.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                className="flex items-start gap-3 rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] px-5 py-4"
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                <p className="text-xs text-[var(--body-subtle)] leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>

        {/* ── FAQ ── */}
        <section>
          <h2 className="text-xl font-bold text-[var(--heading)] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] px-5 py-4"
              >
                <p className="text-sm font-semibold text-[var(--heading)] mb-1.5">{faq.q}</p>
                <p className="text-sm text-[var(--body-subtle)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="rounded-[var(--radius-base)] border border-[var(--border-brand)] bg-[var(--brand-soft)] px-8 py-10 text-center">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[var(--heading)] mb-2">
            Thank you for using AllConverter.tools
          </h2>
          <p className="text-sm text-[var(--body-subtle)] max-w-lg mx-auto mb-6 leading-relaxed">
            Whether you contribute or not, every tool on this platform will always be free. If you'd like
            to help keep it that way, we'd be genuinely grateful.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              href={PAYPAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-[var(--radius-default)] bg-[#FFC439] px-7 py-3 text-sm font-bold text-[#003087] hover:bg-[#f0b429] transition-colors shadow-sm"
            >
              <PayPalLogo />
              Contribute via PayPal
            </a>
            <Link
              href="/tools/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--fg-brand)] hover:underline"
            >
              Browse all tools
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
