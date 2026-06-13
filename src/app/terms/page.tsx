import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  CheckSquare,
  ThumbsUp,
  ShieldAlert,
  Copyright,
  CircleSlash,
  AlertTriangle,
  BrainCircuit,
  BadgeDollarSign,
  WifiOff,
  LogOut,
  Globe,
  Mail,
  Info,
} from "lucide-react";
import { siteConfig } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and Conditions for AllConverter.tools — permitted use, intellectual property, limitation of liability, AI content disclaimer, and your rights when using our free online tools.",
  alternates: { canonical: `${siteConfig.url}/terms/` },
};

const EFFECTIVE_DATE = "1 June 2025";
const CONTACT_EMAIL = "legal@allconverter.tools";

const TOC = [
  ["#acceptance", "1. Acceptance of Terms"],
  ["#permitted-use", "2. Permitted Use"],
  ["#responsibilities", "3. User Responsibilities"],
  ["#ip", "4. Intellectual Property"],
  ["#warranties", "5. Disclaimer of Warranties"],
  ["#liability", "6. Limitation of Liability"],
  ["#third-party", "7. Third-Party Services"],
  ["#ai-content", "8. AI-Generated Content"],
  ["#calculators", "9. Calculator Accuracy"],
  ["#availability", "10. Tool Availability"],
  ["#termination", "11. Termination of Access"],
  ["#governing-law", "12. Governing Law"],
];

interface SectionProps {
  id: string;
  number: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ id, number, icon, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-9 border-b border-[var(--border-default)] last:border-0">
      <div className="flex gap-4">
        <div className="shrink-0 w-10 h-10 rounded-[var(--radius-base)] bg-[var(--brand-soft)] border border-[var(--border-brand)] flex items-center justify-center text-[var(--fg-brand)] mt-0.5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xs font-mono text-[var(--body-subtle)]">{number}</span>
            <h2 className="text-lg font-semibold text-[var(--heading)]">{title}</h2>
          </div>
          <div className="text-sm text-[var(--body-subtle)] leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-semibold text-[var(--heading)] mt-5 mb-1">{children}</p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--fg-brand)] mt-1.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({ variant = "warning", children }: { variant?: "warning" | "info"; children: React.ReactNode }) {
  const isWarning = variant === "warning";
  return (
    <div
      className={`flex gap-3 rounded-lg border p-4 text-sm ${
        isWarning
          ? "border-[var(--border-warning)] bg-[var(--danger-soft)] text-[var(--body-subtle)]"
          : "border-[var(--border-brand)] bg-[var(--brand-soft)] text-[var(--body-subtle)]"
      }`}
    >
      {isWarning
        ? <AlertTriangle className="w-4 h-4 text-[var(--fg-danger-strong)] shrink-0 mt-0.5" />
        : <Info className="w-4 h-4 text-[var(--fg-brand)] shrink-0 mt-0.5" />
      }
      <p>{children}</p>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-12">
        <div className="container-xl max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[var(--fg-brand)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-brand)]">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)] mb-3">
            Terms and Conditions
          </h1>
          <p className="text-sm text-[var(--body-subtle)] leading-relaxed max-w-2xl mb-5">
            These Terms and Conditions govern your access to and use of AllConverter.tools and all tools,
            features, and content available on the platform. By using this website you agree to be bound
            by these terms. If you do not agree, please discontinue use immediately.
          </p>
          <div className="flex flex-wrap gap-5 text-xs text-[var(--body-subtle)]">
            <span>Effective date: <strong className="text-[var(--heading)]">{EFFECTIVE_DATE}</strong></span>
            <span>Platform: <strong className="text-[var(--heading)]">AllConverter.tools</strong></span>
            <span>Operator: <strong className="text-[var(--heading)]">AllConverter.tools</strong></span>
          </div>
        </div>
      </section>

      <div className="container-xl max-w-4xl py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 items-start">

        {/* Sidebar TOC — desktop */}
        <aside className="hidden lg:block sticky top-24 rounded-xl border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--body-subtle)] mb-3">Contents</p>
          <nav className="space-y-0.5">
            {TOC.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="block text-xs text-[var(--body-subtle)] hover:text-[var(--fg-brand)] py-1.5 px-2 rounded-md hover:bg-[var(--brand-soft)] transition-colors leading-snug"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main>

          <Section id="acceptance" number="01" icon={<CheckSquare className="w-5 h-5" />} title="Acceptance of Terms">
            <p>
              By accessing, browsing, or using AllConverter.tools — whether as a guest or registered user —
              you confirm that you are at least <strong className="text-[var(--heading)]">13 years of age</strong> (or
              the minimum digital age of consent in your jurisdiction, whichever is higher), and that you
              have read, understood, and agree to be legally bound by these Terms and Conditions, our{" "}
              <Link href="/privacy/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">Privacy Policy</Link>,{" "}
              <Link href="/cookies/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">Cookie Policy</Link>, and{" "}
              <Link href="/disclaimer/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">Disclaimer</Link>, each
              of which is incorporated into these Terms by reference.
            </p>
            <p>
              If you are using this platform on behalf of an organisation, you represent and warrant that
              you have the authority to bind that organisation to these Terms, and the term "you" refers
              to both you and that organisation.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. Changes take effect upon posting to
              this page. Continued use of the platform after changes are posted constitutes acceptance of
              the revised Terms. We will update the effective date above when material changes are made.
              For significant changes, we may also display a notice on the homepage.
            </p>
          </Section>

          <Section id="permitted-use" number="02" icon={<ThumbsUp className="w-5 h-5" />} title="Permitted Use">
            <p>
              AllConverter.tools grants you a limited, non-exclusive, non-transferable, revocable licence
              to access and use the platform for your personal and internal business purposes, subject to
              these Terms.
            </p>

            <SubHeading>You may:</SubHeading>
            <BulletList items={[
              "Use any tool for personal, educational, or internal business purposes",
              "Download or export outputs generated by our tools for lawful purposes",
              "Share links to tool pages for informational or referral purposes",
              "Access the platform from any device or geographic location where use is not restricted by applicable law",
            ]} />

            <SubHeading>You may not:</SubHeading>
            <BulletList items={[
              "Reproduce, redistribute, resell, or commercially exploit any part of the platform or its underlying tools without prior written permission",
              "Scrape, crawl, or systematically harvest content, tool outputs, or data from the platform using automated means",
              "Attempt to reverse engineer, decompile, disassemble, or extract source code from any tool or component",
              "Use the platform to process files or data belonging to third parties without their consent",
              "Circumvent, disable, or interfere with any security, access control, or rate-limiting mechanism on the platform",
              "Use the platform in any way that violates applicable local, national, or international laws or regulations",
              "Submit or process content that is unlawful, harmful, defamatory, obscene, or infringes the rights of any third party",
              "Use the platform in any manner that could damage, overburden, or impair its servers or infrastructure",
              "Attempt to gain unauthorised access to any system, account, or data connected to this platform",
              "Frame, mirror, or embed the platform within another website or application without prior written consent",
            ]} />
          </Section>

          <Section id="responsibilities" number="03" icon={<ShieldAlert className="w-5 h-5" />} title="User Responsibilities">
            <p>
              You are solely responsible for your use of the platform and any outputs you generate,
              download, or act upon. Specifically, you accept responsibility for:
            </p>
            <BulletList items={[
              "Ensuring that any files, data, or content you process using our tools are owned by you or that you have full legal authority to process them",
              "Verifying the accuracy, completeness, and legal compliance of all tool outputs before relying on them or sharing them with third parties",
              "Maintaining independent backups of original files before submitting them to any conversion or editing tool",
              "Ensuring that documents, invoices, contracts, or other outputs comply with the laws and regulations of your jurisdiction",
              "Reviewing AI-generated content for accuracy, originality, and appropriateness before publication or commercial use",
              "Keeping any API keys or access credentials you choose to enter into tools (such as the Google PageSpeed API key field) confidential and secure",
              "Not inputting personally identifiable information, sensitive personal data, financial credentials, or health information into any tool on this platform",
            ]} />
            <p>
              We process no files on our servers — all tool operations occur locally in your browser.
              Nonetheless, you remain responsible for the sensitivity and legality of the content you choose
              to process.
            </p>
          </Section>

          <Section id="ip" number="04" icon={<Copyright className="w-5 h-5" />} title="Intellectual Property">
            <SubHeading>Our intellectual property</SubHeading>
            <p>
              All content on AllConverter.tools — including but not limited to the website design,
              user interface, tool logic, source code, graphics, text, icons, and branding — is the
              exclusive property of AllConverter.tools or its licensors and is protected by applicable
              copyright, trademark, and intellectual property laws. No part of this platform may be
              reproduced, modified, or distributed without prior written permission.
            </p>

            <SubHeading>Your content and outputs</SubHeading>
            <p>
              You retain full ownership of any files you process and any outputs you generate using
              our tools. We do not claim any intellectual property rights over content you input into
              or export from our tools.
            </p>
            <p>
              By using this platform, you grant AllConverter.tools a limited, royalty-free licence to
              process your inputs solely for the purpose of delivering the requested tool functionality
              within your browser session. This licence terminates when your session ends. We do not
              store, analyse, share, or use your content for any other purpose.
            </p>

            <SubHeading>AI-generated outputs and copyright</SubHeading>
            <p>
              The copyright status of AI-generated content varies by jurisdiction and continues to
              evolve. You are responsible for assessing whether AI outputs are subject to copyright
              protections and for ensuring that outputs do not infringe the intellectual property
              rights of third parties before publishing or commercially exploiting them.
            </p>

            <SubHeading>Third-party trademarks</SubHeading>
            <p>
              References to third-party products, services, or organisations — such as Google, Microsoft,
              or Adobe — are for descriptive purposes only. Their trademarks and brand names remain the
              property of their respective owners. Such references do not imply endorsement or affiliation.
            </p>
          </Section>

          <Section id="warranties" number="05" icon={<AlertTriangle className="w-5 h-5" />} title="Disclaimer of Warranties">
            <Callout variant="warning">
              AllConverter.tools is provided strictly on an "as is" and "as available" basis. We make no
              representations or warranties of any kind, express or implied, regarding the platform or
              its outputs.
            </Callout>
            <p>
              To the fullest extent permitted by applicable law, we expressly disclaim all warranties,
              including but not limited to:
            </p>
            <BulletList items={[
              "Implied warranties of merchantability, fitness for a particular purpose, and non-infringement",
              "Warranties that the platform will be available continuously, error-free, or free of viruses or harmful components",
              "Warranties that tool outputs will be accurate, complete, timely, or suitable for your intended use",
              "Warranties that defects will be corrected or that the platform is free from bugs or vulnerabilities",
              "Warranties regarding the results that may be obtained from use of the platform",
            ]} />
            <p>
              No advice, output, or information — whether written or oral — obtained from AllConverter.tools
              constitutes a warranty beyond what is explicitly stated in these Terms.
            </p>
          </Section>

          <Section id="liability" number="06" icon={<CircleSlash className="w-5 h-5" />} title="Limitation of Liability">
            <Callout variant="warning">
              To the maximum extent permitted by law, AllConverter.tools and its operators shall not be
              liable for any indirect, incidental, special, consequential, exemplary, or punitive damages
              — even if advised of the possibility of such damages.
            </Callout>
            <p>
              Our total aggregate liability for any claim arising out of or related to your use of this
              platform shall not exceed <strong className="text-[var(--heading)]">the greater of ₹1,000 (Indian Rupees one thousand) or the amount you paid
              to access the platform in the twelve months preceding the claim</strong>. As the platform
              is provided free of charge, this will typically be zero.
            </p>
            <p>This limitation applies to all claims arising under any legal theory, including:</p>
            <BulletList items={[
              "Financial loss resulting from reliance on calculator outputs, business tools, or AI-generated content",
              "Loss of data, files, revenue, profits, business opportunity, or reputation",
              "Legal or regulatory consequences arising from documents generated by our tools",
              "Damage to hardware, software, or data caused by file conversion or processing operations",
              "Costs of substitute services or tools following platform unavailability",
              "Any third-party claims arising from your use of outputs generated on this platform",
            ]} />
            <p>
              Certain jurisdictions do not permit the exclusion or limitation of liability for consequential
              or incidental damages. In such jurisdictions, our liability is limited to the maximum extent
              permitted by applicable law. Nothing in these Terms limits or excludes liability for death or
              personal injury caused by negligence, fraud, fraudulent misrepresentation, or any other
              liability that cannot be excluded by law.
            </p>
          </Section>

          <Section id="third-party" number="07" icon={<Globe className="w-5 h-5" />} title="Third-Party Services">
            <p>
              AllConverter.tools integrates with or makes reference to third-party services in certain
              tools. These integrations are provided for convenience and do not constitute endorsement
              of those services.
            </p>

            <SubHeading>Third-party APIs</SubHeading>
            <p>
              Specific tools on this platform make outbound requests to third-party APIs to deliver their
              functionality — including the Google PageSpeed Insights API (Website Speed Checker) and
              the Microlink API (Redirect Checker, Canonical Tag Checker). Use of these tools is also
              subject to the terms and privacy policies of the respective API providers. We transmit only
              the minimum data required — typically the URL you enter — and do not pass personal data
              or file content to third-party APIs.
            </p>

            <SubHeading>Google AdSense and Analytics</SubHeading>
            <p>
              This platform uses Google AdSense to display advertisements and Google Analytics 4 to
              collect anonymised usage statistics. Both services operate under Google's own Terms of
              Service and Privacy Policy. We are not responsible for the content of advertisements served
              by Google or for Google's data processing practices, which are governed by Google's policies.
            </p>

            <SubHeading>External links</SubHeading>
            <p>
              The platform may contain links to external websites or resources. These links are provided
              for informational purposes only. We have no control over the content, availability, or
              practices of external sites and accept no responsibility for them. Accessing external links
              is at your own risk and subject to the terms of those websites.
            </p>
          </Section>

          <Section id="ai-content" number="08" icon={<BrainCircuit className="w-5 h-5" />} title="AI-Generated Content">
            <Callout variant="warning">
              Outputs produced by AI tools on this platform are machine-generated and may contain
              inaccuracies, errors, or content unsuitable for your context. Always review and verify
              AI outputs before use.
            </Callout>
            <p>
              AI tools on AllConverter.tools — including content generators, resume builders, proposal
              generators, email writers, code explainers, grammar checkers, summarisers, and all similar
              tools — produce outputs based on language model inference. These outputs:
            </p>
            <BulletList items={[
              "Do not constitute professional, legal, medical, financial, or expert advice of any kind",
              "May contain factual errors, outdated information, or fabricated details stated with apparent confidence",
              "May reflect biases present in the underlying training data",
              "May generate code, SQL queries, or technical content that contains errors, vulnerabilities, or is unsuitable for production use without review",
              "May produce text that resembles existing copyrighted works — you are responsible for verifying originality before publication",
              "Are not guaranteed to meet accuracy, tone, compliance, or quality standards required for professional or regulated use cases",
            ]} />
            <p>
              You accept full responsibility for reviewing, editing, fact-checking, and appropriately
              using any AI-generated output. AllConverter.tools is not liable for any professional,
              financial, legal, reputational, or other harm arising from reliance on AI-generated content
              without adequate independent review.
            </p>
          </Section>

          <Section id="calculators" number="09" icon={<BadgeDollarSign className="w-5 h-5" />} title="Calculator Accuracy Disclaimer">
            <p>
              Financial, business, and statistical calculators on this platform — including EMI
              calculators, SIP calculators, GST tools, compound interest calculators, CAGR tools,
              salary calculators, burn rate tools, LTV/CAC calculators, and all similar tools —
              produce <strong className="text-[var(--heading)]">estimates only</strong>.
            </p>
            <p>
              Calculator outputs:
            </p>
            <BulletList items={[
              "Are based solely on the values you input and standard mathematical formulae — they do not account for your complete financial situation",
              "Do not constitute financial, tax, investment, accounting, or any other professional advice",
              "May differ from figures provided by banks, government bodies, or financial institutions due to differing rate conventions, rounding methods, or regulatory changes",
              "Do not account for inflation, market volatility, changes in tax law, fees, penalties, or other real-world variables",
              "Should not be used as the basis for investment decisions, loan commitments, tax filings, or any significant financial transaction without independent professional verification",
            ]} />
            <p>
              Always consult a qualified financial advisor, chartered accountant, or equivalent regulated
              professional before making decisions based on calculator outputs.
            </p>
          </Section>

          <Section id="availability" number="10" icon={<WifiOff className="w-5 h-5" />} title="Tool Availability">
            <p>
              We aim to keep AllConverter.tools accessible around the clock, but we make no commitment
              to continuous, uninterrupted availability. We reserve the right to:
            </p>
            <BulletList items={[
              "Suspend, restrict, or discontinue any tool or the entire platform at any time, with or without notice",
              "Modify, update, replace, or remove tools and features without prior notice",
              "Perform scheduled or emergency maintenance that temporarily affects availability",
              "Rate-limit or throttle access from specific IP addresses, regions, or user patterns that affect platform stability",
            ]} />
            <p>
              We will make reasonable efforts to provide advance notice of planned maintenance where
              practicable. We are not liable for any loss, inconvenience, or damage resulting from
              platform downtime, tool unavailability, or changes to tool functionality.
            </p>
            <p>
              Certain tools depend on third-party APIs or libraries that may themselves be subject to
              availability constraints, deprecation, or rate limiting outside our control. We cannot
              guarantee uninterrupted operation of tools that rely on external services.
            </p>
          </Section>

          <Section id="termination" number="11" icon={<LogOut className="w-5 h-5" />} title="Termination of Access">
            <p>
              We reserve the right to suspend or permanently restrict your access to AllConverter.tools,
              with or without notice, if we reasonably believe that you have:
            </p>
            <BulletList items={[
              "Violated any provision of these Terms and Conditions",
              "Engaged in scraping, automated access, or systematic harvesting of platform content",
              "Attempted to compromise the security, performance, or integrity of the platform",
              "Used the platform for any unlawful purpose or in a manner harmful to other users",
              "Provided false information in connection with your use of the platform",
            ]} />
            <p>
              Upon termination or suspension of access, all rights and licences granted to you under
              these Terms cease immediately. Provisions of these Terms that by their nature should
              survive termination — including intellectual property rights, limitation of liability,
              disclaimers, and governing law — will continue to apply.
            </p>
            <p>
              You may cease use of the platform at any time. As we do not maintain user accounts or
              store personal data beyond standard analytics, no formal account deletion process is
              required.
            </p>
          </Section>

          <Section id="governing-law" number="12" icon={<Globe className="w-5 h-5" />} title="Governing Law &amp; Jurisdiction">
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of
              <strong className="text-[var(--heading)]"> India</strong>, including but not limited to the
              Information Technology Act, 2000, the Information Technology (Amendment) Act, 2008, the
              Digital Personal Data Protection Act, 2023, and the Indian Contract Act, 1872, without
              regard to conflict of law principles.
            </p>
            <p>
              Any dispute, claim, or controversy arising out of or relating to these Terms or your use
              of AllConverter.tools — including questions of validity, interpretation, breach, or
              termination — shall be subject to the <strong className="text-[var(--heading)]">exclusive
              jurisdiction of the courts located in Mumbai, Maharashtra, India</strong>. You irrevocably
              consent to the personal jurisdiction of those courts and waive any objection to venue.
            </p>
            <p>
              If you access AllConverter.tools from outside India, you do so on your own initiative and
              are solely responsible for compliance with local laws to the extent applicable. We make no
              representation that the platform or its content is appropriate or available for use in all
              jurisdictions.
            </p>
            <p>
              Where mandatory statutory rights under applicable Indian law — including rights under the
              Consumer Protection Act, 2019 — cannot be excluded by contract, those rights are not
              affected or limited by these Terms.
            </p>
          </Section>

          {/* Contact + updates */}
          <section className="py-9">
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] divide-y divide-[var(--border-default)]">

              <div className="p-5 flex gap-3">
                <Mail className="w-4 h-4 text-[var(--fg-brand)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[var(--heading)] text-sm mb-1">Questions about these Terms?</p>
                  <p className="text-sm text-[var(--body-subtle)] mb-2">
                    If you have questions, concerns, or requests relating to these Terms and Conditions,
                    contact us at:
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-2 text-[var(--fg-brand)] font-medium text-sm hover:opacity-80 transition-opacity"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="p-5 flex gap-3">
                <Info className="w-4 h-4 text-[var(--fg-brand)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[var(--heading)] text-sm mb-1">Related policies</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {[
                      ["/privacy/", "Privacy Policy"],
                      ["/cookies/", "Cookie Policy"],
                      ["/disclaimer/", "Disclaimer"],
                      ["/security/", "Security"],
                    ].map(([href, label]) => (
                      <Link
                        key={href}
                        href={href}
                        className="text-xs text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80 transition-opacity"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
