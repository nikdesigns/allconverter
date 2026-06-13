import { Server, Code2, Sparkles, RefreshCw, ShieldCheck, CreditCard, Eye } from "lucide-react";

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
    description:
      "Server costs, CDN delivery, SSL certificates, and domain registration to keep 319 pages fast and reliably available worldwide.",
  },
  {
    icon: Code2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    title: "New Tool Development",
    description:
      "Research, design, and engineering time for every new tool added to the platform — typically several new tools each week.",
  },
  {
    icon: Sparkles,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    title: "AI Service Costs",
    description:
      "Third-party API usage for AI-powered tools including the cover letter generator, SQL builder, LinkedIn optimiser, and code explainer.",
  },
  {
    icon: RefreshCw,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "Maintenance & Compatibility",
    description:
      "Ongoing updates for browser compatibility, performance improvements, and bug fixes across all tools as web standards evolve.",
  },
];

const trustIndicators = [
  {
    icon: ShieldCheck,
    color: "text-emerald-500",
    text: "All 250+ tools stay free. No premium tier, no paywall — ever.",
  },
  {
    icon: CreditCard,
    color: "text-sky-500",
    text: "One-time only. No recurring charges, no subscription.",
  },
  {
    icon: Eye,
    color: "text-violet-500",
    text: "Contributions go to running costs and development. Nothing else.",
  },
];

export function SupportSection() {
  return (
    <section
      className="py-16 lg:py-24 bg-[var(--neutral-secondary-soft)] border-t border-[var(--border-default)]"
      aria-labelledby="support-heading"
    >
      <div className="container-xl">

        {/* ── Section Header ── */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--fg-brand)] mb-3">
            Support the Project
          </p>
          <h2
            id="support-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--heading)] max-w-2xl"
          >
            Built free.{" "}
            <span className="gradient-text">Kept free.</span>
          </h2>
          <p className="mt-4 text-[var(--body-subtle)] text-base max-w-2xl leading-relaxed">
            AllConverter.tools is maintained by a single developer, without a team, VC funding, or a
            premium tier. Ads offset some costs — and if the platform has saved you time, a
            contribution goes directly toward keeping it running and shipping new tools.
          </p>
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 mb-12">

          {/* Left: Cost Breakdown */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--body-subtle)] mb-5">
              What contributions go toward
            </p>
            <div className="space-y-3">
              {costs.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-5 py-4"
                  >
                    <div
                      className={`mt-0.5 w-8 h-8 rounded-[var(--radius-default)] ${item.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--heading)] mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--body-subtle)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Donation Card */}
          <div className="flex flex-col">
            <div className="rounded-[var(--radius-base)] border border-[var(--border-brand)] bg-[var(--neutral-primary-soft)] p-7 flex flex-col gap-6 h-full">

              {/* Card header */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--fg-brand)] mb-3">
                  One-time contribution
                </p>
                <h3 className="text-lg font-bold text-[var(--heading)] leading-snug">
                  Support ongoing development
                </h3>
                <p className="text-sm text-[var(--body-subtle)] mt-3 leading-relaxed">
                  There's no minimum amount, no recurring charge, and no expectation. If the platform
                  has been useful to you, a contribution of any size is genuinely appreciated and
                  goes directly toward the costs above.
                </p>
              </div>

              {/* PayPal CTA */}
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
                  Processed securely by PayPal · No account required · One-time only
                </p>
              </div>

              {/* Divider + founder note */}
              <div className="mt-auto pt-5 border-t border-[var(--border-default)]">
                <blockquote>
                  <p className="text-xs text-[var(--body-subtle)] leading-relaxed italic">
                    "I don't have a premium plan to sell you. This is an independent project I
                    maintain because people find it genuinely useful. Every tool on this site stays
                    free — that's not going to change."
                  </p>
                  <footer className="mt-2 text-xs font-medium text-[var(--heading)]">
                    — Nitin Kaushik, Founder
                  </footer>
                </blockquote>
              </div>

            </div>
          </div>
        </div>

        {/* ── Trust Indicators ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trustIndicators.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                className="flex items-start gap-3 rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-5 py-4"
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                <p className="text-xs text-[var(--body-subtle)] leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
