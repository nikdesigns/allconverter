import { Shield, Zap, Globe, Lock, RefreshCw, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "All tools are optimized for speed. Most operations complete in under 2 seconds, even for large files.",
    color: "text-amber-500",
    gradient: "from-amber-500/10 to-yellow-500/10",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description:
      "Your files are processed entirely in your browser. Nothing is ever uploaded to our servers.",
    color: "text-emerald-500",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    icon: Globe,
    title: "100% Free",
    description:
      "Every tool is completely free to use with no hidden limits, watermarks, or subscription fees.",
    color: "text-sky-500",
    gradient: "from-sky-500/10 to-blue-500/10",
  },
  {
    icon: Shield,
    title: "No Registration",
    description:
      "Start using any tool instantly. No accounts, no email verification, no personal data required.",
    color: "text-violet-500",
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    icon: RefreshCw,
    title: "Always Updated",
    description:
      "Tools are continuously improved with new features and optimizations based on user feedback.",
    color: "text-rose-500",
    gradient: "from-rose-500/10 to-pink-500/10",
  },
  {
    icon: Sparkles,
    title: "Professional Quality",
    description:
      "Built to the same standard as paid tools. Output quality you can use in professional workflows.",
    color: "text-indigo-500",
    gradient: "from-indigo-500/10 to-blue-500/10",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
            Why choose <span className="gradient-text">AllConverter.tools</span>?
          </h2>
          <p className="text-[var(--body-subtle)] text-base max-w-xl mx-auto">
            We built the conversion experience we always wanted — fast, private, and
            professional quality. No trade-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group relative rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 hover:border-[var(--border-brand)] hover:bg-[var(--neutral-secondary-medium)] hover:shadow-[var(--shadow-md)] transition-all duration-200 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 bg-gradient-to-br ${benefit.gradient}`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-10 h-10 rounded-[var(--radius-default)] flex items-center justify-center mb-4 bg-[var(--neutral-secondary-soft)] border border-[var(--border-default)]`}
                  >
                    <Icon className={`w-5 h-5 ${benefit.color}`} />
                  </div>
                  <h3 className="font-semibold text-[var(--heading)] mb-2">
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
    </section>
  );
}
