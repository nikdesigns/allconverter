import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  Target,
  LayoutGrid,
  ShieldCheck,
  Telescope,
  Star,
  MonitorSmartphone,
  Timer,
  Accessibility,
  Lock,
  ArrowRight,
} from "lucide-react";
import { siteConfig } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "About Us — Who We Are & Our Mission",
  description:
    "Learn about AllConverter.tools — a free browser-based platform with 100+ online tools for PDF conversion, image editing, developer utilities, SEO, business documents, AI content, and more. No sign-up. No uploads. Just results.",
  alternates: { canonical: `${siteConfig.url}/about/` },
};

const pillars = [
  {
    icon: <Timer className="w-5 h-5" />,
    title: "Fast by design",
    body: "Tools load in under a second and run entirely in your browser. There is no upload queue, no server processing delay, and no waiting. You open the tool and it is ready.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Private by architecture",
    body: "Because processing happens locally, your files and data never reach our servers. We cannot see what you convert, compress, or create. Privacy is not a policy — it is the technical reality.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: <MonitorSmartphone className="w-5 h-5" />,
    title: "Simple by intention",
    body: "Every tool is a single focused interface. No unnecessary settings, no feature bloat, no account walls. You arrive, you do the task, you move on. That is the entire experience.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: <Accessibility className="w-5 h-5" />,
    title: "Accessible to everyone",
    body: "Free, always. No credit card, no trial period, no usage cap. Whether you are a student, a freelancer, a developer, or running a business — every tool is open to you on equal terms.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

const categories = [
  { label: "PDF Tools", href: "/pdf-tools/", desc: "Convert, compress, merge, split, watermark, and extract text from PDF files." },
  { label: "Image Tools", href: "/image-tools/", desc: "Resize, compress, convert, crop, and optimise images in every major format." },
  { label: "Developer Tools", href: "/developer-tools/", desc: "Format JSON, encode Base64, generate UUIDs, test regex, hash strings, and more." },
  { label: "SEO Tools", href: "/seo-tools/", desc: "Analyse meta tags, generate schema markup, check redirects, and preview SERP snippets." },
  { label: "Business Tools", href: "/business-tools/", desc: "Create invoices, proposals, purchase orders, and run financial calculations." },
  { label: "AI Tools", href: "/ai-tools/", desc: "Generate cover letters, blog outlines, SQL queries, email copy, and more." },
  { label: "Calculators", href: "/calculators/", desc: "EMI, SIP, CAGR, GST, compound interest, BMI, and date-time utilities." },
  { label: "Audio Tools", href: "/audio-tools/", desc: "Convert, cut, join, normalise, and process audio files in your browser." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-16">
        <div className="container-xl max-w-3xl">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-[var(--radius-base)] bg-[var(--brand)] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-brand)]">About Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)] mb-5 leading-tight">
            Built to make everyday<br className="hidden sm:block" /> digital tasks effortless.
          </h1>
          <p className="text-base text-[var(--body-subtle)] leading-relaxed max-w-2xl">
            AllConverter.tools is a free online platform with 100+ browser-based utilities — from PDF
            conversion and image editing to developer tools, SEO analysis, business documents, and
            AI-powered content generation. No installation. No account. No file uploads. Just open a
            tool and get things done.
          </p>
        </div>
      </section>

      <div className="container-xl max-w-3xl py-12 space-y-16">

        {/* Who We Are */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Star className="w-5 h-5 text-[var(--fg-brand)]" />
            <h2 className="text-xl font-bold text-[var(--heading)]">Who We Are</h2>
          </div>
          <div className="text-sm text-[var(--body-subtle)] leading-relaxed space-y-4">
            <p>
              AllConverter.tools is an independent online tools platform built for the people who
              constantly hit friction in their daily digital work — the professional who needs a PDF
              converted before a meeting, the developer who wants a quick JSON formatter without
              installing an extension, the business owner generating an invoice on the go, the content
              creator running a keyword check between drafts.
            </p>
            <p>
              We are a small, focused team with a specific conviction: the most useful software is
              the kind that gets out of your way. The internet is full of tools that make you register,
              wait, pay, or share your files with servers you know nothing about. We built this platform
              as a deliberate alternative — fast, private, open, and permanently free.
            </p>
            <p>
              Headquartered in Mumbai, India, we serve users across the world. Every tool on the
              platform is designed with the same philosophy: do one thing, do it well, and add
              zero friction between the person and the result.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-[var(--fg-brand)]" />
            <h2 className="text-xl font-bold text-[var(--heading)]">Our Mission</h2>
          </div>
          <div className="rounded-xl border border-[var(--border-brand)] bg-[var(--brand-soft)] p-6 text-sm text-[var(--body-subtle)] leading-relaxed space-y-4">
            <p className="text-base font-semibold text-[var(--heading)]">
              &ldquo;To give every person on the internet access to professional-grade utility tools — for free, without compromise.&rdquo;
            </p>
            <p>
              Professional software has always been expensive, siloed, or overbuilt for the task at
              hand. A freelancer should not need an Adobe subscription to compress a PDF. A startup
              founder should not need enterprise software to generate a GST invoice. A developer
              should not need to find a library just to validate a JSON string.
            </p>
            <p>
              Our mission is to close that gap — to make capable, reliable tools available to anyone
              with a browser, regardless of their budget, technical skill level, or location.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid className="w-5 h-5 text-[var(--fg-brand)]" />
            <h2 className="text-xl font-bold text-[var(--heading)]">What We Offer</h2>
          </div>
          <p className="text-sm text-[var(--body-subtle)] mb-6 leading-relaxed">
            The platform currently covers 100+ tools across 12 categories — and grows based on what
            users ask for. Here is what you will find today:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map(({ label, href, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-1.5 p-4 rounded-xl border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] hover:border-[var(--border-brand)] hover:bg-[var(--brand-soft)] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--heading)] group-hover:text-[var(--fg-brand)] transition-colors">
                    {label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--body-subtle)] opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </div>
                <span className="text-xs text-[var(--body-subtle)] leading-snug">{desc}</span>
              </Link>
            ))}
          </div>
          <p className="text-xs text-[var(--body-subtle)] mt-4">
            Looking for something specific?{" "}
            <Link href="/tools/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
              Browse all tools →
            </Link>
          </p>
        </section>

        {/* Why Choose Us */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-[var(--fg-brand)]" />
            <h2 className="text-xl font-bold text-[var(--heading)]">Why Choose AllConverter.tools</h2>
          </div>
          <p className="text-sm text-[var(--body-subtle)] mb-6 leading-relaxed">
            There are other tool sites. Here is what makes ours worth returning to.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map(({ icon, title, body, color, bg, border }) => (
              <div
                key={title}
                className="flex flex-col gap-3 p-5 rounded-xl border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]"
              >
                <div className={`w-9 h-9 rounded-lg ${bg} border ${border} flex items-center justify-center ${color} shrink-0`}>
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--heading)] mb-1">{title}</p>
                  <p className="text-xs text-[var(--body-subtle)] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy & Security */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-[var(--fg-brand)]" />
            <h2 className="text-xl font-bold text-[var(--heading)]">Privacy &amp; Security</h2>
          </div>
          <div className="text-sm text-[var(--body-subtle)] leading-relaxed space-y-4">
            <p>
              Most online tools work by uploading your file to a remote server, processing it there,
              and sending it back. That means your documents, images, and data pass through
              infrastructure you have no visibility into. AllConverter.tools works differently.
            </p>
            <p>
              The large majority of our tools use your browser as the processing engine — the same
              browser you are reading this in right now. When you convert a PDF, compress an image,
              format a JSON file, or run a calculator, that operation happens on your device using
              standard web APIs. Nothing leaves your machine. We have no access to the content, and
              we retain nothing after your session ends.
            </p>
            <p>
              For tools that call external APIs — such as the Website Speed Checker, which uses the
              Google PageSpeed Insights API — only the URL you enter is transmitted. No files, no
              personal data. We are transparent about which tools use external services, and we
              describe each one in our{" "}
              <Link href="/privacy/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                Privacy Policy
              </Link>.
            </p>
            <p>
              The platform is served over HTTPS with TLS 1.3 and HTTP Strict Transport Security
              enabled. We do not sell user data, we do not build advertising profiles, and we have no
              user account system — so there are no passwords to breach and no personal records to leak.
              For a full technical breakdown, see our{" "}
              <Link href="/security/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                Security page
              </Link>.
            </p>
          </div>
        </section>

        {/* Future Vision */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Telescope className="w-5 h-5 text-[var(--fg-brand)]" />
            <h2 className="text-xl font-bold text-[var(--heading)]">Where We Are Headed</h2>
          </div>
          <div className="text-sm text-[var(--body-subtle)] leading-relaxed space-y-4">
            <p>
              The platform you see today is a foundation, not a ceiling. The roadmap is shaped
              entirely by what users ask for — and the requests keep coming. Upcoming focus areas include
              deeper AI integration across existing tools, batch processing for power users, a
              progressive web app for offline use, and continued expansion of the developer and
              business tool libraries.
            </p>
            <p>
              We also intend to make AllConverter.tools fully accessible — meeting WCAG 2.1 AA
              standards across every tool — because useful software should be usable by everyone,
              including people who rely on screen readers, keyboard navigation, or high-contrast modes.
            </p>
            <p>
              The core commitment will not change: free, private, browser-first, and built around
              the people using it. If there is a tool you need that is not here yet, we genuinely want
              to hear about it.
            </p>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/tools/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4 fill-current" />
              Explore all tools
            </Link>
            <a
              href="mailto:feedback@allconverter.tools"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] text-sm font-medium text-[var(--heading)] hover:border-[var(--border-brand)] hover:text-[var(--fg-brand)] transition-colors"
            >
              Suggest a tool
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] text-sm font-medium text-[var(--heading)] hover:border-[var(--border-brand)] hover:text-[var(--fg-brand)] transition-colors"
            >
              Contact us
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
