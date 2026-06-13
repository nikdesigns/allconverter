import Link from "next/link";
import { Lock, Users, RefreshCw, CheckCircle2 } from "lucide-react";

const principles = [
  {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "from-emerald-500/10 to-teal-500/10",
    title: "Free. Actually free.",
    body: "No premium tier, no watermarks, no usage limits hidden behind a sign-up. Every one of 250+ tools works in full, at no cost, with no conditions.",
  },
  {
    icon: Lock,
    color: "text-violet-500",
    bg: "from-violet-500/10 to-purple-500/10",
    title: "Private by default.",
    body: "The vast majority of tools process files entirely in your browser. Your documents, images, and data stay on your device. We never see them.",
  },
  {
    icon: Users,
    color: "text-sky-500",
    bg: "from-sky-500/10 to-blue-500/10",
    title: "Built for real people.",
    body: "Clear interfaces, plain language, zero jargon. Tools should solve a problem quickly — not require a tutorial. That's the standard every new feature is held to.",
  },
  {
    icon: RefreshCw,
    color: "text-amber-500",
    bg: "from-amber-500/10 to-yellow-500/10",
    title: "Always improving.",
    body: "New tools are added every week based on what users request. If something doesn't work well or could work better, I fix it. This platform is never finished.",
  },
];

const trustStats = [
  { value: "250+", label: "Free tools" },
  { value: "0", label: "Files uploaded to our servers" },
  { value: "0", label: "Accounts required" },
  { value: "12", label: "Tool categories" },
];

export function FounderSection() {
  return (
    <section
      className="py-16 lg:py-24 border-t border-[var(--border-default)]"
      aria-labelledby="founder-heading"
    >
      <div className="container-xl">

        {/* Section label + headline */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--fg-brand)] mb-3">
            From the Founder
          </p>
          <h2
            id="founder-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--heading)] max-w-2xl"
          >
            Built by a developer.{" "}
            <span className="gradient-text">Designed for everyone.</span>
          </h2>
        </div>

        {/* Two-column grid: founder card + mission/principles */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-8 mb-12">

          {/* ── Founder Card ── */}
          <div className="rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-7 flex flex-col gap-6">

            {/* Avatar + identity */}
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 rounded-full bg-gradient-to-br from-[var(--fg-brand)] to-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0 select-none"
                aria-hidden="true"
              >
                NK
              </div>
              <div>
                <p className="font-semibold text-[var(--heading)] text-base leading-snug">
                  Nitin Kaushik
                </p>
                <p className="text-xs text-[var(--body-subtle)] mt-0.5">
                  Frontend Developer · Founder, AllConverter.tools
                </p>
              </div>
            </div>

            {/* Pull quote */}
            <blockquote className="border-l-2 border-[var(--fg-brand)] pl-4">
              <p className="text-sm text-[var(--body-subtle)] leading-relaxed italic">
                "I built AllConverter.tools because the best tools I found were either paywalled, privacy-invasive, or simply too slow for what people actually needed. I wanted to fix that — and keep it free."
              </p>
            </blockquote>

            {/* Story */}
            <p className="text-sm text-[var(--body-subtle)] leading-relaxed">
              I'm a frontend developer with a focus on web applications and productivity tools. For years I'd reach for an online tool — to compress a PDF, format some JSON, generate an invoice — and hit the same wall: a paywall, a forced account, or a slow server upload. I started building my own versions, sharing them publicly, and the response told me this gap was real. AllConverter.tools is the result: a single platform where useful tools are genuinely accessible.
            </p>

            {/* Founder CTA */}
            <div className="mt-auto pt-2 border-t border-[var(--border-default)]">
              <Link
                href="/about/"
                className="text-xs font-medium text-[var(--fg-brand)] hover:underline"
              >
                More about the project →
              </Link>
            </div>
          </div>

          {/* ── Mission + Principles ── */}
          <div className="flex flex-col gap-6">

            {/* Mission box */}
            <div className="rounded-[var(--radius-base)] border border-[var(--border-brand)] bg-gradient-to-br from-[var(--fg-brand)]/5 to-violet-500/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--fg-brand)] mb-2">
                Mission
              </p>
              <p className="text-lg font-semibold text-[var(--heading)] leading-snug">
                Make powerful tools accessible to everyone — regardless of budget, technical background, or location.
              </p>
              <p className="text-sm text-[var(--body-subtle)] mt-3 leading-relaxed">
                That means free to use, fast to load, private by default, and available without creating an account. Not as a marketing promise — as a technical requirement for every tool that ships.
              </p>
            </div>

            {/* Principles grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {principles.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="group rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-5 hover:border-[var(--border-brand)] transition-colors duration-200 relative overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300 bg-gradient-to-br ${p.bg}`}
                    />
                    <div className="relative z-10">
                      <Icon className={`w-4 h-4 ${p.color} mb-3`} />
                      <p className="text-sm font-semibold text-[var(--heading)] mb-1">{p.title}</p>
                      <p className="text-xs text-[var(--body-subtle)] leading-relaxed">{p.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Trust Stats Strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-[var(--radius-base)] overflow-hidden border border-[var(--border-default)] bg-[var(--border-default)] mb-10">
          {trustStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--neutral-primary-soft)] px-6 py-5 flex flex-col items-center text-center gap-1"
            >
              <span className="text-2xl font-bold text-[var(--heading)] tabular-nums">
                {stat.value}
              </span>
              <span className="text-xs text-[var(--body-subtle)] leading-snug">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* ── CTA Bar ── */}
        <div className="rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[var(--heading)] text-sm">
              Start using any tool — no sign-up, no payment, no catch.
            </p>
            <p className="text-xs text-[var(--body-subtle)] mt-0.5">
              250+ tools available right now. New tools added every week.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/tools/"
              className="rounded-[var(--radius-default)] bg-[var(--fg-brand)] text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 transition-opacity"
            >
              Browse all tools
            </Link>
            <Link
              href="/about/"
              className="rounded-[var(--radius-default)] border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] text-sm font-medium px-5 py-2.5 text-[var(--heading)] hover:border-[var(--border-brand)] transition-colors"
            >
              About the project
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
