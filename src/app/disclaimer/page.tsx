import type { Metadata } from "next";
import {
  AlertTriangle,
  BadgeDollarSign,
  Scale,
  BrainCircuit,
  CircleSlash,
  ShieldAlert,
  UserCheck,
  Wrench,
  Mail,
  Info,
} from "lucide-react";
import { siteConfig } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important disclaimers for AllConverter.tools — no financial, legal, or professional advice. AI-generated content, accuracy limitations, and user responsibilities explained.",
  alternates: { canonical: `${siteConfig.url}/disclaimer/` },
};

const EFFECTIVE_DATE = "1 June 2025";
const CONTACT_EMAIL = "legal@allconverter.tools";

interface SectionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
}

function Section({ id, icon, title, badge, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-8 border-b border-[var(--border-default)] last:border-0">
      <div className="flex gap-4">
        <div className="shrink-0 w-10 h-10 rounded-[var(--radius-base)] bg-[var(--brand-soft)] border border-[var(--border-brand)] flex items-center justify-center text-[var(--fg-brand)] mt-0.5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-3">
            <h2 className="text-lg font-semibold text-[var(--heading)]">{title}</h2>
            {badge && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--danger-soft)] text-[var(--fg-danger-strong)] border border-[var(--border-danger)]">
                {badge}
              </span>
            )}
          </div>
          <div className="text-sm text-[var(--body-subtle)] leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-[var(--border-warning)] bg-[var(--danger-soft)] p-4 text-sm text-[var(--body-subtle)]">
      <AlertTriangle className="w-4 h-4 text-[var(--fg-danger-strong)] shrink-0 mt-0.5" />
      <p>{children}</p>
    </div>
  );
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-12">
        <div className="container-xl max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[var(--fg-brand)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-brand)]">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)] mb-3">
            Disclaimer
          </h1>
          <p className="text-sm text-[var(--body-subtle)] leading-relaxed max-w-2xl mb-5">
            Please read this disclaimer carefully before using any tool on AllConverter.tools. By accessing
            or using this platform, you acknowledge that you have read, understood, and agreed to the
            limitations and conditions described below.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-[var(--body-subtle)]">
            <span>Effective date: <strong className="text-[var(--heading)]">{EFFECTIVE_DATE}</strong></span>
            <span>Applies to: <strong className="text-[var(--heading)]">allconverter.tools and all tools therein</strong></span>
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      <div className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] sticky top-16 z-10">
        <div className="container-xl max-w-3xl py-2 overflow-x-auto">
          <div className="flex gap-1 text-xs whitespace-nowrap">
            {[
              ["#general", "General"],
              ["#financial", "Financial"],
              ["#legal", "Legal & Professional"],
              ["#ai-content", "AI Content"],
              ["#accuracy", "Accuracy"],
              ["#liability", "Liability"],
              ["#user-responsibility", "Your Responsibility"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-md text-[var(--body-subtle)] hover:text-[var(--fg-brand)] hover:bg-[var(--brand-soft)] transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-xl max-w-3xl py-2">

        <Section id="general" icon={<Info className="w-5 h-5" />} title="General Disclaimer">
          <p>
            AllConverter.tools is a free online utility platform providing browser-based tools for file
            conversion, text processing, calculations, developer utilities, SEO analysis, business document
            generation, and AI-assisted content creation. All tools are provided on an <strong className="text-[var(--heading)]">"as is" and "as available" basis</strong>, without warranty of any kind, express or implied.
          </p>
          <p>
            We make reasonable efforts to ensure that our tools are functional, accurate, and fit for general
            use. However, we do not warrant that any tool will be error-free, uninterrupted, or suitable for
            your specific purpose. The outputs generated by our tools are intended for general informational
            and practical purposes only.
          </p>
          <p>
            Nothing on this website constitutes professional advice of any kind. Where professional guidance
            is required — financial, legal, medical, or otherwise — you should always consult a qualified
            practitioner.
          </p>
        </Section>

        <Section
          id="financial"
          icon={<BadgeDollarSign className="w-5 h-5" />}
          title="No Financial Advice"
          badge="Important"
        >
          <Callout>
            The financial calculators on this platform — including EMI calculators, SIP calculators, GST
            calculators, compound interest tools, CAGR calculators, salary calculators, and all similar
            tools — do not constitute financial advice.
          </Callout>
          <p>
            All outputs produced by our financial calculators are <strong className="text-[var(--heading)]">estimates based on the inputs you provide</strong> and standard mathematical formulae. They are intended solely to assist
            with preliminary personal planning and general understanding. They do not account for your
            complete financial situation, tax obligations, investment risk profile, inflation, market
            conditions, regulatory changes, or any other factors that a qualified financial advisor would
            consider.
          </p>
          <p>
            Results should not be relied upon to make investment decisions, loan commitments, retirement
            plans, insurance choices, tax filings, or any other financial decision. Figures may differ
            from those provided by banks, financial institutions, or government authorities due to rounding,
            differing rate conventions, or changes in policy.
          </p>
          <p>
            <strong className="text-[var(--heading)]">Always consult a registered financial advisor, chartered accountant, or equivalent qualified
            professional</strong> before making any significant financial decision.
          </p>
        </Section>

        <Section
          id="legal"
          icon={<Scale className="w-5 h-5" />}
          title="No Legal or Professional Advice"
          badge="Important"
        >
          <Callout>
            No content, output, or document generated by any tool on this platform — including NDA generators,
            contract summarisers, proposal generators, invoice templates, or business document tools —
            constitutes legal, regulatory, tax, accounting, medical, or any other professional advice.
          </Callout>
          <p>
            Documents produced by business and document tools on this platform are provided as <strong className="text-[var(--heading)]">starting-point templates only</strong>. They have not been reviewed, approved, or verified by
            legal counsel. They may not be suitable for your jurisdiction, industry, or specific
            circumstances. Laws governing contracts, invoicing obligations, NDAs, and business documentation
            vary significantly across countries and regions and change over time.
          </p>
          <p>
            Do not use any document generated on this platform as a substitute for advice from a qualified
            solicitor, barrister, attorney, accountant, or other licensed professional. We accept no
            responsibility for any loss, liability, or consequence arising from reliance on documents or
            content produced by these tools.
          </p>
          <p>
            <strong className="text-[var(--heading)]">Consult a qualified legal or professional advisor</strong> before executing, distributing,
            or relying on any document created using tools on this platform.
          </p>
        </Section>

        <Section
          id="ai-content"
          icon={<BrainCircuit className="w-5 h-5" />}
          title="AI-Generated Content Disclaimer"
          badge="Important"
        >
          <Callout>
            AI tools on this platform generate content using language models. All AI-generated output must
            be independently reviewed and verified before use. Do not publish, submit, or act on
            AI-generated content without applying your own judgment and, where appropriate, professional
            review.
          </Callout>
          <p>
            Our AI tools — including but not limited to the AI Cover Letter Generator, AI LinkedIn Profile
            Optimizer, Blog Outline Generator, Grammar Checker, Text Summariser, Email Generator, SQL
            Generator, Code Explainer, Proposal Generator, Business Plan Generator, and all related
            content-generation tools — produce outputs based on patterns in training data and the context
            you provide.
          </p>
          <p>
            AI-generated content may:
          </p>
          <ul className="space-y-1.5 list-none mt-1">
            {[
              "Contain factual inaccuracies, outdated information, or fabricated details presented as fact",
              "Reflect biases present in underlying training data",
              "Produce outputs that are grammatically plausible but semantically incorrect for your context",
              "Generate code, SQL queries, or technical content that contains errors or security vulnerabilities",
              "Create content that inadvertently resembles existing copyrighted material",
              "Vary in quality and relevance depending on the specificity of inputs provided",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--fg-brand)] mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            You are solely responsible for reviewing, editing, and verifying any AI-generated content
            before use. AllConverter.tools accepts no liability for consequences arising from the use of
            AI-generated outputs, including professional, legal, financial, or reputational harm.
          </p>
        </Section>

        <Section id="accuracy" icon={<Wrench className="w-5 h-5" />} title="Accuracy &amp; Tool Reliability">
          <p>
            While we strive to ensure that every tool on this platform performs as described, we make no
            guarantees regarding the <strong className="text-[var(--heading)]">completeness, accuracy, timeliness, or fitness for purpose</strong> of
            any tool output.
          </p>
          <p>
            Specific accuracy considerations by tool category:
          </p>
          <div className="space-y-3 mt-2">
            {[
              {
                category: "PDF & File Tools",
                note: "Document conversion quality depends on the complexity and formatting of the source file. Converted outputs may not perfectly preserve all formatting, fonts, tables, or embedded elements from the original.",
              },
              {
                category: "SEO Tools",
                note: "SEO metrics, scores, and recommendations are based on publicly available algorithms and general best practices. Search engine ranking factors change frequently and vary by engine. No SEO tool output guarantees improved search rankings.",
              },
              {
                category: "Developer Tools",
                note: "Code formatters, validators, and query optimisers apply heuristic rules that may not be appropriate for every codebase or framework. Always test generated or modified code in a safe environment before deploying to production.",
              },
              {
                category: "Business & Invoice Tools",
                note: "Invoice and business document templates use standard field layouts. Tax rates, regulatory requirements, and legally required document fields differ by jurisdiction and change over time. Verify compliance with local regulations before use.",
              },
              {
                category: "Network & Speed Tools",
                note: "Results from network tools such as website speed checkers, DNS lookups, and SSL checkers reflect conditions at the time of the request and may vary between measurements due to network variability, caching, and infrastructure differences.",
              },
            ].map(({ category, note }) => (
              <div
                key={category}
                className="rounded-lg border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] p-4"
              >
                <p className="font-semibold text-[var(--heading)] text-sm mb-1">{category}</p>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="liability"
          icon={<CircleSlash className="w-5 h-5" />}
          title="Limitation of Liability"
          badge="Important"
        >
          <p>
            To the fullest extent permitted by applicable law, AllConverter.tools, its operators, contributors,
            and service providers shall not be liable for any:
          </p>
          <ul className="space-y-1.5 list-none mt-2">
            {[
              "Direct, indirect, incidental, special, consequential, or punitive damages",
              "Loss of data, revenue, profit, business opportunity, or goodwill",
              "Financial loss arising from reliance on calculator outputs or AI-generated content",
              "Legal consequences arising from documents, templates, or content produced by any tool",
              "Damage to devices, software, or data resulting from file processing operations",
              "Service interruptions, errors, or downtime — tools are provided without uptime guarantees",
              "Actions taken or decisions made in reliance on any tool output",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--fg-brand)] mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2">
            This limitation applies regardless of the legal theory under which the claim is brought —
            contract, tort, negligence, strict liability, or otherwise — and even if AllConverter.tools has
            been advised of the possibility of such damages.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion or limitation of certain types of liability.
            In such jurisdictions, our liability is limited to the maximum extent permitted by law.
            Where mandatory statutory rights apply — such as those under consumer protection legislation —
            nothing in this disclaimer overrides or restricts those rights.
          </p>
        </Section>

        <Section id="user-responsibility" icon={<UserCheck className="w-5 h-5" />} title="User Responsibility">
          <p>
            By using AllConverter.tools, you accept full responsibility for:
          </p>
          <ul className="space-y-1.5 list-none mt-2">
            {[
              "Verifying the accuracy and suitability of all tool outputs before acting on them",
              "Ensuring that any documents, content, or code generated by our tools comply with the laws and regulations of your jurisdiction",
              "Reviewing AI-generated content for accuracy, appropriateness, and originality before publication or submission",
              "Maintaining backups of original files before processing them with any conversion or editing tool",
              "Ensuring you have the legal right to process any files, data, or content you upload or input into our tools",
              "Using tool outputs only for lawful purposes and in accordance with our Terms of Service",
              "Seeking independent professional advice wherever your use case carries legal, financial, medical, or regulatory implications",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--fg-brand)] mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            We provide these tools in good faith to assist with everyday tasks. In return, we ask that you
            exercise your own judgment, verify outputs that matter, and treat the platform as a starting
            point rather than a final authority.
          </p>
        </Section>

        <Section icon={<ShieldAlert className="w-5 h-5" />} id="changes" title="Changes to This Disclaimer">
          <p>
            We reserve the right to amend this disclaimer at any time to reflect changes in our services,
            applicable law, or operational practice. The effective date at the top of this page will be
            updated when material changes are made. Continued use of the platform after changes are posted
            constitutes your acceptance of the revised disclaimer.
          </p>
          <p>
            If you have questions about this disclaimer or wish to raise a concern, contact us at:
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 mt-2 text-[var(--fg-brand)] font-medium hover:opacity-80 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            {CONTACT_EMAIL}
          </a>
        </Section>

      </div>

      {/* Footer note */}
      <div className="border-t border-[var(--border-default)] bg-[var(--neutral-primary-soft)] mt-6">
        <div className="container-xl max-w-3xl py-6">
          <p className="text-xs text-[var(--body-subtle)] leading-relaxed">
            This disclaimer does not constitute legal advice. It has been written to provide clear, plain-language
            notice of the limitations of this platform. If you require legal guidance specific to your use of
            this site, consult a qualified legal professional.
          </p>
        </div>
      </div>

    </div>
  );
}
