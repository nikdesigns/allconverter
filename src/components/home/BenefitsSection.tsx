import { Shield, Zap, Globe, Lock, LayoutGrid, Sparkles, Check, X } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Tools load instantly and run in your browser — no upload queues, no server lag. Most operations finish in under two seconds.",
    color: "text-amber-500",
    gradient: "from-amber-500/10 to-yellow-500/10",
  },
  {
    icon: Lock,
    title: "Private by Design",
    description:
      "Your files never leave your device. All processing happens locally in your browser, so we never see what you work on.",
    color: "text-emerald-500",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    icon: Globe,
    title: "100% Free, Always",
    description:
      "Every one of our 250+ tools is free with no hidden limits, no watermarks, and no subscription fees — ever.",
    color: "text-sky-500",
    gradient: "from-sky-500/10 to-blue-500/10",
  },
  {
    icon: Shield,
    title: "No Account Needed",
    description:
      "Open any tool and start immediately. No sign-up, no email verification, no personal data required.",
    color: "text-violet-500",
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    icon: LayoutGrid,
    title: "250+ Tools, 13 Categories",
    description:
      "PDF, images, audio, AI content, SEO, developer utilities, business documents, calculators, and more — all in one place.",
    color: "text-rose-500",
    gradient: "from-rose-500/10 to-pink-500/10",
  },
  {
    icon: Sparkles,
    title: "Professional Quality",
    description:
      "Built to the same standard as paid software. Output you can use directly in professional and business workflows.",
    color: "text-indigo-500",
    gradient: "from-indigo-500/10 to-blue-500/10",
  },
];

// ── Comparison table data ──────────────────────────────────────────────────────

const compareRows = [
  {
    feature:  "Price",
    us:       "Free, always",
    small:    "Freemium (2/day)",
    ilove:    "Freemium (limited)",
    usGood:   true,
  },
  {
    feature:  "File privacy",
    us:       "Stays on your device",
    small:    "Uploaded to servers",
    ilove:    "Uploaded to servers",
    usGood:   true,
  },
  {
    feature:  "Sign-up required",
    us:       "Never",
    small:    "For most features",
    ilove:    "No",
    usGood:   true,
  },
  {
    feature:  "Daily limits",
    us:       "None",
    small:    "Yes",
    ilove:    "Yes",
    usGood:   true,
  },
  {
    feature:  "Categories",
    us:       "PDF, Image, Audio, AI, Dev, Business, SEO +6",
    small:    "PDF only",
    ilove:    "PDF only",
    usGood:   true,
  },
  {
    feature:  "Works offline",
    us:       "Yes (browser-based)",
    small:    "No",
    ilove:    "No",
    usGood:   true,
  },
];

function Tick({ good }: { good: boolean }) {
  return good
    ? <Check className="w-4 h-4 text-emerald-500 mx-auto" />
    : <X     className="w-4 h-4 text-red-400 mx-auto" />;
}

export function BenefitsSection() {
  return (
    <section className="py-16 lg:py-24 border-t border-(--border-default)">
      <div className="container-xl space-y-16">

        {/* ── Benefits grid ──────────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
              Why choose <span className="gradient-text">AllConverter.tools</span>?
            </h2>
            <p className="text-(--body-subtle) text-base max-w-xl mx-auto">
              250+ tools across 13 categories — built to be fast, private, and professional. No trade-offs, no paywalls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="group relative rounded-lg border border-(--border-default) bg-(--neutral-primary-soft) p-6 hover:border-border-brand hover:bg-(--neutral-secondary-medium) hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 bg-gradient-to-br ${benefit.gradient}`}
                  />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-[var(--radius-default)] flex items-center justify-center mb-4 bg-[var(--neutral-secondary-soft)] border border-(--border-default)">
                      <Icon className={`w-5 h-5 ${benefit.color}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-(--heading) mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-[var(--body-subtle)] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Comparison table ───────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              How we compare
            </h2>
            <p className="text-(--body-subtle) text-sm max-w-lg mx-auto">
              See why users switch from paid tools to AllConverter.tools
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-(--border-default)">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border-default) bg-(--neutral-secondary-soft)">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-(--body-subtle) uppercase tracking-wider w-[35%]">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-center w-[21%]">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-fg-brand">
                      <span className="w-2 h-2 rounded-full bg-fg-brand inline-block" />
                      AllConverter.tools
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-(--body-subtle) w-[22%]">
                    Smallpdf
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-(--body-subtle) w-[22%]">
                    ILovePDF
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-(--border-default) last:border-0 ${i % 2 === 0 ? "bg-(--neutral-primary-soft)" : "bg-(--neutral-primary)"}`}
                  >
                    <td className="px-4 py-3 text-xs font-medium text-(--heading)">
                      {row.feature}
                    </td>
                    {/* Us — highlighted column */}
                    <td className="px-4 py-3 text-center bg-(--brand-soft)/40">
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {row.us}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-(--body-subtle)">
                      {row.small}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-(--body-subtle)">
                      {row.ilove}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-(--body-subtle) text-center mt-3">
            Competitor info based on publicly available free-tier limitations as of 2025. Subject to change.
          </p>
        </div>

      </div>
    </section>
  );
}
