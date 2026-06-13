import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Eye,
  Database,
  Users,
  Share2,
  Clock,
  Lock,
  Globe,
  UserCheck,
  Bell,
  Mail,
  Info,
  Cookie,
  BarChart2,
  Megaphone,
  FileText,
} from "lucide-react";
import { siteConfig } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for AllConverter.tools — how we collect, use, and protect your data. Covers Google Analytics, Google AdSense, cookies, your rights under Indian privacy law, and data retention.",
  alternates: { canonical: `${siteConfig.url}/privacy/` },
};

const EFFECTIVE_DATE = "1 June 2025";
const CONTACT_EMAIL = "privacy@allconverter.tools";
const CONTROLLER_NAME = "AllConverter.tools";
const CONTROLLER_ADDRESS = "Mumbai, Maharashtra, India";
const DPO_EMAIL = "dpo@allconverter.tools";

const TOC: [string, string][] = [
  ["#who-we-are", "1. Who We Are"],
  ["#what-we-collect", "2. What We Collect"],
  ["#how-we-use", "3. How We Use Your Data"],
  ["#legal-basis", "4. Legal Basis for Processing"],
  ["#cookies", "5. Cookies & Tracking"],
  ["#third-party", "6. Third-Party Services"],
  ["#data-sharing", "7. Data Sharing"],
  ["#retention", "8. Data Retention"],
  ["#security", "9. Security Practices"],
  ["#international", "10. International Transfers"],
  ["#your-rights", "11. Your Rights"],
  ["#children", "12. Children's Privacy"],
  ["#changes", "13. Policy Changes"],
  ["#contact", "14. Contact Us"],
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
  return <p className="font-semibold text-[var(--heading)] mt-5 mb-1.5">{children}</p>;
}

function BulletList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--fg-brand)] mt-1.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-[var(--border-brand)] bg-[var(--brand-soft)] p-4 text-sm text-[var(--body-subtle)]">
      <Info className="w-4 h-4 text-[var(--fg-brand)] shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border-default)] mt-3">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[var(--neutral-secondary-soft)] border-b border-[var(--border-default)]">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-2.5 font-semibold text-[var(--heading)] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--neutral-secondary-soft)] transition-colors"
            >
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? "font-medium text-[var(--heading)] whitespace-nowrap" : "text-[var(--body-subtle)]"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-12">
        <div className="container-xl max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[var(--fg-brand)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-brand)]">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)] mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--body-subtle)] leading-relaxed max-w-2xl mb-5">
            This Privacy Policy explains how AllConverter.tools collects, uses, discloses, and protects
            information about you when you use our platform. We are committed to handling your data
            transparently and in compliance with the Digital Personal Data Protection Act, 2023 (DPDPA),
            the Information Technology Act, 2000, and other applicable Indian privacy laws.
          </p>
          <div className="flex flex-wrap gap-5 text-xs text-[var(--body-subtle)]">
            <span>Effective date: <strong className="text-[var(--heading)]">{EFFECTIVE_DATE}</strong></span>
            <span>Data controller: <strong className="text-[var(--heading)]">{CONTROLLER_NAME}</strong></span>
            <span>Contact: <strong className="text-[var(--heading)]">{CONTACT_EMAIL}</strong></span>
          </div>
        </div>
      </section>

      <div className="container-xl max-w-4xl py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 items-start">

        {/* Sidebar TOC */}
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

          <Section id="who-we-are" number="01" icon={<Users className="w-5 h-5" />} title="Who We Are">
            <p>
              <strong className="text-[var(--heading)]">{CONTROLLER_NAME}</strong> operates the website
              located at <strong className="text-[var(--heading)]">allconverter.tools</strong> — a free
              online platform providing browser-based utility tools including PDF conversion and editing,
              image processing, text utilities, developer tools, SEO analysis, business document
              generation, AI-assisted content creation, and financial calculators.
            </p>
            <p>
              For the purposes of the Digital Personal Data Protection Act, 2023 (DPDPA) and the
              Information Technology Act, 2000, {CONTROLLER_NAME} is the <strong className="text-[var(--heading)]">Data Fiduciary</strong> responsible
              for personal data collected through this website.
            </p>
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] p-4 space-y-1 text-xs">
              <p><span className="font-medium text-[var(--heading)]">Controller:</span> {CONTROLLER_NAME}</p>
              <p><span className="font-medium text-[var(--heading)]">Address:</span> {CONTROLLER_ADDRESS}</p>
              <p><span className="font-medium text-[var(--heading)]">Privacy contact:</span> {CONTACT_EMAIL}</p>
              <p><span className="font-medium text-[var(--heading)]">Data Protection Officer:</span> {DPO_EMAIL}</p>
            </div>
          </Section>

          <Section id="what-we-collect" number="02" icon={<Eye className="w-5 h-5" />} title="What Data We Collect">

            <InfoBox>
              <strong className="text-[var(--heading)]">Core principle:</strong> Our tools process all files
              and content locally in your browser. No file content, document text, or uploaded data is
              transmitted to our servers. What we collect is limited to technical interaction data and
              is described in full below.
            </InfoBox>

            <SubHeading>Data we collect automatically</SubHeading>
            <p>
              When you visit AllConverter.tools, our web infrastructure and analytics providers collect
              certain technical data automatically:
            </p>
            <Table
              headers={["Data type", "Details", "Collected by"]}
              rows={[
                ["IP address", "Anonymised to city/region level before storage — full IP is not retained", "Google Analytics 4"],
                ["Browser & device type", "Browser name, version, operating system, screen resolution, device category", "Google Analytics 4"],
                ["Pages visited", "Which pages and tools you accessed, in what sequence, and for how long", "Google Analytics 4"],
                ["Referrer URL", "The website or search engine that directed you to AllConverter.tools", "Google Analytics 4"],
                ["Geographic location", "Country and approximate city derived from anonymised IP data", "Google Analytics 4"],
                ["Session data", "Session duration, bounce rate, pages per session — aggregated metrics only", "Google Analytics 4"],
                ["Ad interactions", "Whether ads were displayed, viewed, or clicked — used for billing between Google and advertisers", "Google AdSense"],
              ]}
            />

            <SubHeading>Data you provide directly</SubHeading>
            <p>
              AllConverter.tools does not require user registration. We have no sign-up forms, login
              systems, or account infrastructure. The only data you may voluntarily provide is:
            </p>
            <BulletList items={[
              "An API key for the Google PageSpeed Insights API, if you choose to enter one in the Website Speed Checker tool — this is stored only in your browser's local storage and is never transmitted to our servers",
              "Contact information if you email us directly at our support or legal addresses — retained only for the purpose of responding to your enquiry",
            ]} />

            <SubHeading>Data we do not collect</SubHeading>
            <BulletList items={[
              "The content of any files you process using our tools (PDFs, images, audio files, documents)",
              "Text, code, or data you enter into any tool input fields",
              "AI-generated outputs you receive or download",
              "Financial figures or personal details entered into calculators",
              "Names, email addresses, or any personally identifiable information beyond what is noted above",
            ]} />
          </Section>

          <Section id="how-we-use" number="03" icon={<Database className="w-5 h-5" />} title="How We Use Your Data">
            <p>We use the limited data we collect for the following purposes:</p>
            <Table
              headers={["Purpose", "Data used", "Basis"]}
              rows={[
                ["Platform analytics", "Anonymised usage metrics — page views, tool usage counts, session data", "Legitimate interest / Consent"],
                ["Service improvement", "Aggregate data on which tools are used, performance patterns, error rates", "Legitimate interest"],
                ["Advertising delivery", "AdSense cookie data for contextual or personalised ad serving", "Consent"],
                ["Security & fraud prevention", "IP-level patterns used to detect abnormal traffic or abuse", "Legitimate interest"],
                ["Legal compliance", "Retaining records necessary to comply with applicable law or legal process", "Legal obligation"],
                ["Responding to enquiries", "Email address and message content when you contact us directly", "Contract / Legitimate interest"],
              ]}
            />
            <p className="mt-2">
              We do not use your data for automated decision-making or profiling that produces legal or
              similarly significant effects. We do not sell your data to any third party. We do not use
              data collected on AllConverter.tools to build individual user profiles for commercial purposes.
            </p>
          </Section>

          <Section id="legal-basis" number="04" icon={<FileText className="w-5 h-5" />} title="Legal Basis for Processing">
            <p>
              Under the Digital Personal Data Protection Act, 2023 (DPDPA) and the Information Technology
              Act, 2000, we are required to have a lawful basis for processing personal data. Our bases
              for each processing activity are as follows:
            </p>
            <Table
              headers={["Processing activity", "Legal basis", "Applicable law"]}
              rows={[
                ["Google Analytics 4 — usage analytics", "Consent (where obtained); Legitimate use — anonymised aggregate statistics", "DPDPA 2023, S. 4 & 7"],
                ["Google AdSense — advertising", "Consent", "DPDPA 2023, S. 6"],
                ["Security monitoring and abuse prevention", "Legitimate use — protecting platform integrity and safety", "IT Act 2000, S. 43A"],
                ["Responding to direct enquiries", "Contractual necessity / Legitimate use", "DPDPA 2023, S. 4"],
                ["Legal and regulatory compliance", "Legal obligation under applicable Indian law", "DPDPA 2023, S. 7(b)"],
              ]}
            />
            <p className="mt-2">
              Where we rely on <strong className="text-[var(--heading)]">consent</strong> as our legal basis
              — principally for analytics and advertising cookies — you have the right to withdraw that
              consent at any time without detriment. Withdrawal does not affect the lawfulness of
              processing that occurred before withdrawal. See Section 11 for how to exercise this right.
            </p>
            <p>
              Where we rely on <strong className="text-[var(--heading)]">legitimate use</strong>, we have
              assessed that our interests do not override your rights as a Data Principal, given the
              minimal and anonymised nature of the data involved and the reasonable expectations of users
              of a free online tools platform.
            </p>
          </Section>

          <Section id="cookies" number="05" icon={<Cookie className="w-5 h-5" />} title="Cookies &amp; Tracking Technologies">
            <p>
              AllConverter.tools uses cookies and similar tracking technologies. A full description of
              each cookie, its purpose, type, and retention period is provided in our{" "}
              <Link href="/cookies/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                Cookie Policy
              </Link>
              . The summary below covers the three categories of cookies in use on this platform.
            </p>

            <SubHeading>Essential cookies</SubHeading>
            <p>
              Strictly necessary for the platform to function — including theme preferences and Next.js
              session state. These do not require consent and cannot be disabled while using the site.
            </p>

            <SubHeading>Analytics cookies (Google Analytics 4)</SubHeading>
            <div className="flex gap-3 p-3 rounded-lg border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
              <BarChart2 className="w-4 h-4 text-[var(--fg-brand)] shrink-0 mt-0.5" />
              <p>
                GA4 cookies (<code className="text-xs font-mono bg-[var(--neutral-secondary-soft)] px-1 py-0.5 rounded">_ga</code>,{" "}
                <code className="text-xs font-mono bg-[var(--neutral-secondary-soft)] px-1 py-0.5 rounded">_gid</code>) collect
                anonymised usage data. IP anonymisation is enabled. We have not activated advertising
                features, remarketing, or cross-site tracking within GA4. Analytics cookies require your
                consent where mandated by applicable law.
              </p>
            </div>

            <SubHeading>Advertising cookies (Google AdSense)</SubHeading>
            <div className="flex gap-3 p-3 rounded-lg border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
              <Megaphone className="w-4 h-4 text-[var(--fg-brand)] shrink-0 mt-0.5" />
              <p>
                AdSense may set cookies to serve contextually relevant or personalised advertisements.
                If you have not consented to personalised advertising, Google will serve non-personalised
                ads using page context only — no cross-site tracking occurs. You can manage your
                advertising preferences at{" "}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                  Google Ad Settings
                </a>.
              </p>
            </div>

            <p className="mt-2">
              For detailed cookie tables, opt-out instructions, and browser-level controls, see our{" "}
              <Link href="/cookies/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                Cookie Policy
              </Link>.
            </p>
          </Section>

          <Section id="third-party" number="06" icon={<Share2 className="w-5 h-5" />} title="Third-Party Services">
            <p>
              We work with a small number of trusted third-party services. Each is listed below with a
              description of what data they receive and a link to their own privacy documentation.
            </p>

            {[
              {
                icon: <BarChart2 className="w-4 h-4 text-[var(--fg-brand)]" />,
                name: "Google Analytics 4",
                operator: "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland",
                purpose: "Anonymised usage analytics — page views, session data, geographic region, device type.",
                data: "Anonymised IP, browser/device info, pages visited, session metrics.",
                basis: "Consent / Legitimate interest",
                link: "https://policies.google.com/privacy",
                linkLabel: "Google Privacy Policy",
              },
              {
                icon: <Megaphone className="w-4 h-4 text-[var(--fg-brand)]" />,
                name: "Google AdSense",
                operator: "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland",
                purpose: "Display advertising — contextual and (with consent) personalised ads.",
                data: "AdSense cookies, ad-view and click data, approximate location for ad targeting.",
                basis: "Consent",
                link: "https://policies.google.com/privacy",
                linkLabel: "Google Privacy Policy",
              },
              {
                icon: <Globe className="w-4 h-4 text-[var(--fg-brand)]" />,
                name: "Google PageSpeed Insights API",
                operator: "Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
                purpose: "Powers the Website Speed Checker tool — analyses the URL you submit.",
                data: "Only the URL you enter. No personal data or file content is transmitted.",
                basis: "Legitimate interest — tool functionality",
                link: "https://developers.google.com/terms/api-services-user-data-policy",
                linkLabel: "Google API Terms",
              },
              {
                icon: <Globe className="w-4 h-4 text-[var(--fg-brand)]" />,
                name: "Microlink API",
                operator: "Microlink (microlink.io)",
                purpose: "Powers the Redirect Checker and Canonical Tag Checker tools.",
                data: "Only the URL you submit. No personal data or file content is transmitted.",
                basis: "Legitimate interest — tool functionality",
                link: "https://microlink.io/privacy",
                linkLabel: "Microlink Privacy Policy",
              },
            ].map(({ icon, name, operator, purpose, data, basis, link, linkLabel }) => (
              <div
                key={name}
                className="rounded-lg border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] overflow-hidden"
              >
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)]">
                  {icon}
                  <span className="font-semibold text-sm text-[var(--heading)]">{name}</span>
                </div>
                <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div><span className="font-medium text-[var(--heading)]">Operator: </span>{operator}</div>
                  <div><span className="font-medium text-[var(--heading)]">Legal basis: </span>{basis}</div>
                  <div className="sm:col-span-2"><span className="font-medium text-[var(--heading)]">Purpose: </span>{purpose}</div>
                  <div className="sm:col-span-2"><span className="font-medium text-[var(--heading)]">Data transmitted: </span>{data}</div>
                  <div>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                      {linkLabel} →
                    </a>
                  </div>
                </div>
              </div>
            ))}

            <p className="mt-2">
              We do not embed social media plugins, comment platforms, chat widgets, or any other
              third-party service beyond those listed above. If additional integrations are introduced,
              this policy will be updated before deployment.
            </p>
          </Section>

          <Section id="data-sharing" number="07" icon={<Share2 className="w-5 h-5" />} title="Data Sharing &amp; Disclosure">
            <p>
              We do not sell, rent, trade, or otherwise commercially transfer your personal data to
              any third party. Data is shared only in the limited circumstances described below.
            </p>
            <BulletList items={[
              <span key="svc"><strong className="text-[var(--heading)]">Service providers:</strong> Google Analytics and Google AdSense receive anonymised analytics and advertising data as described in Section 6. They act as independent data controllers under their own policies.</span>,
              <span key="legal"><strong className="text-[var(--heading)]">Legal obligations:</strong> We may disclose data where required to do so by law, court order, regulatory authority, or to protect the rights, property, or safety of AllConverter.tools, its users, or the public.</span>,
              <span key="biz"><strong className="text-[var(--heading)]">Business transfers:</strong> In the event of a merger, acquisition, or sale of all or part of our business, personal data may be transferred to the acquiring entity. We will notify users via a notice on this website before data becomes subject to a different privacy policy.</span>,
              <span key="consent"><strong className="text-[var(--heading)]">With your consent:</strong> We may share data in other ways if you have given specific prior consent for a clearly identified purpose.</span>,
            ]} />
          </Section>

          <Section id="retention" number="08" icon={<Clock className="w-5 h-5" />} title="Data Retention">
            <p>
              We retain personal data only for as long as necessary to fulfil the purpose for which
              it was collected, or as required by applicable law.
            </p>
            <Table
              headers={["Data category", "Retention period", "Rationale"]}
              rows={[
                ["Google Analytics data", "14 months (GA4 default)", "Standard analytics data expiry set in GA4 account settings"],
                ["Google AdSense data", "Governed by Google", "AdSense data retention is managed entirely by Google under their policies"],
                ["Email enquiries", "3 years from last contact", "Reasonable limitation period for dispute resolution"],
                ["Server access logs", "30 days", "Short-term security monitoring only; auto-purged by hosting infrastructure"],
                ["Browser local storage (API keys)", "Until you clear browser storage", "Stored only on your device — we have no access or control"],
              ]}
            />
            <p className="mt-2">
              We do not retain any file content, document data, calculator inputs, or tool-generated
              outputs — these exist only in your browser session and are never transmitted to us.
            </p>
            <p>
              When data is no longer required, it is securely deleted or anonymised so that it can
              no longer be associated with an individual. You may request early deletion of any personal
              data we hold about you — see Section 11.
            </p>
          </Section>

          <Section id="security" number="09" icon={<Lock className="w-5 h-5" />} title="Security Practices">
            <p>
              We take the security of your data seriously and implement appropriate technical and
              organisational measures to protect it against unauthorised access, alteration, disclosure,
              or destruction.
            </p>

            <SubHeading>Technical measures</SubHeading>
            <BulletList items={[
              "All connections to AllConverter.tools are encrypted using TLS 1.2 or higher, with TLS 1.3 preferred",
              "HTTP Strict Transport Security (HSTS) prevents protocol downgrade attacks",
              "Static assets are delivered via a CDN with edge-level DDoS protection",
              "All tool processing occurs client-side in your browser — no file data touches our infrastructure",
              "We do not operate databases containing personal data beyond what third-party analytics services collect under their own security controls",
            ]} />

            <SubHeading>Organisational measures</SubHeading>
            <BulletList items={[
              "Access to platform infrastructure is restricted to authorised personnel only",
              "Third-party services are selected based on their own security and privacy standards",
              "We maintain a responsible disclosure process for security vulnerabilities — see our Security page",
            ]} />

            <p>
              No method of data transmission over the internet or electronic storage is 100% secure.
              While we use commercially reasonable means to protect your data, we cannot guarantee
              absolute security. In the event of a personal data breach that is likely to result in
              harm to Data Principals, we will notify the Data Protection Board of India and affected
              individuals as required under the Digital Personal Data Protection Act, 2023, and any
              rules or directions issued thereunder. For more detail, see our{" "}
              <Link href="/security/" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
                Security page
              </Link>.
            </p>
          </Section>

          <Section id="international" number="10" icon={<Globe className="w-5 h-5" />} title="International Data Transfers">
            <p>
              AllConverter.tools is operated from India. Some of our third-party service providers —
              principally Google LLC (United States) for Analytics and AdSense — process data outside
              India. Under the Digital Personal Data Protection Act, 2023, cross-border transfers of
              personal data are permitted to countries notified by the Central Government as providing
              adequate protection.
            </p>
            <p>
              Until the Government of India publishes the finalised list of permitted transfer
              destinations, we rely on the following safeguards for data transferred to Google:
            </p>
            <BulletList items={[
              "Google LLC's contractual data processing terms, which impose obligations on Google consistent with applicable privacy law",
              "Google's adherence to the EU–US Data Privacy Framework provides an additional layer of independent certification for data flows to the United States",
              "Anonymisation of analytics data before transmission — full IP addresses are never sent to Google",
            ]} />
            <p>
              All tool processing occurs locally in your browser — no file content or tool input is
              transferred internationally or to any server. You can obtain further information about
              our international transfer safeguards by contacting us at {CONTACT_EMAIL}.
            </p>
          </Section>

          <Section id="your-rights" number="11" icon={<UserCheck className="w-5 h-5" />} title="Your Rights">
            <p>
              As a Data Principal under the Digital Personal Data Protection Act, 2023, and as a user
              protected by the Information Technology Act, 2000, you have the following rights with
              respect to your personal data. We will respond to all valid requests within{" "}
              <strong className="text-[var(--heading)]">30 days</strong> of receipt.
            </p>
            <Table
              headers={["Right", "What it means", "How to exercise"]}
              rows={[
                ["Right to access (DPDPA S. 11)", "Obtain a summary of personal data we hold about you and the purposes for which it is being processed.", `Email ${CONTACT_EMAIL}`],
                ["Right to correction (DPDPA S. 12)", "Request correction or completion of inaccurate, incomplete, or outdated personal data.", `Email ${CONTACT_EMAIL}`],
                ["Right to erasure (DPDPA S. 12)", "Request deletion of personal data that is no longer necessary for the purpose it was collected, subject to legal retention obligations.", `Email ${CONTACT_EMAIL}`],
                ["Right to grievance redressal (DPDPA S. 13)", "Raise a grievance regarding processing of your personal data and receive a response within the prescribed period.", `Email ${CONTACT_EMAIL}`],
                ["Right to nominate (DPDPA S. 14)", "Nominate another individual to exercise your data rights on your behalf in the event of your death or incapacity.", `Email ${CONTACT_EMAIL}`],
                ["Right to withdraw consent", "Withdraw consent for analytics or advertising cookies at any time without penalty. Withdrawal does not affect prior lawful processing.", "Use browser settings or cookie controls"],
                ["Right to complain to the Data Protection Board", "If your grievance is not resolved, you may file a complaint with the Data Protection Board of India.", "Via the Board's official portal once operational"],
              ]}
            />
            <p className="mt-3">
              Some rights apply only in specific circumstances and are subject to exemptions under the
              DPDPA and IT Act. Where data is held by third-party processors such as Google, we will
              direct you to their tools and contact points to exercise your rights with those processors
              directly.
            </p>
            <p>
              We will not charge a fee for handling rights requests unless they are repetitive or
              manifestly unfounded, in which case we may charge a reasonable administrative fee or
              decline to act, with written reasons provided.
            </p>
          </Section>

          <Section id="children" number="12" icon={<ShieldCheck className="w-5 h-5" />} title="Children's Privacy">
            <p>
              AllConverter.tools is not directed at children under the age of 13 (or a higher minimum
              age as required by local law). We do not knowingly collect personal data from children.
              If we become aware that we have inadvertently collected personal data from a child below
              the applicable minimum age, we will take prompt steps to delete that data.
            </p>
            <p>
              If you are a parent or guardian and believe that your child has provided personal data
              to us, please contact us at {CONTACT_EMAIL} and we will take appropriate action.
            </p>
          </Section>

          <Section id="changes" number="13" icon={<Bell className="w-5 h-5" />} title="Changes to This Policy">
            <p>
              We review and update this Privacy Policy periodically to reflect changes in our practices,
              services, or applicable law. When we make material changes, we will:
            </p>
            <BulletList items={[
              "Update the effective date at the top of this page",
              "Display a prominent notice on the homepage for a reasonable period following material changes",
              "Where required by law, seek fresh consent for any new processing activities",
            ]} />
            <p>
              We encourage you to review this page periodically. Your continued use of AllConverter.tools
              after changes are posted constitutes acceptance of the updated policy, to the extent permitted
              by applicable law.
            </p>
          </Section>

          {/* Contact section */}
          <section id="contact" className="scroll-mt-24 py-9">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-[var(--radius-base)] bg-[var(--brand-soft)] border border-[var(--border-brand)] flex items-center justify-center text-[var(--fg-brand)] mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xs font-mono text-[var(--body-subtle)]">14</span>
                  <h2 className="text-lg font-semibold text-[var(--heading)]">Contact Us</h2>
                </div>
                <p className="text-sm text-[var(--body-subtle)] leading-relaxed mb-5">
                  For any questions, concerns, or requests relating to this Privacy Policy or the
                  processing of your personal data, please contact us using the details below. We aim
                  to acknowledge all privacy-related enquiries within{" "}
                  <strong className="text-[var(--heading)]">5 business days</strong> and resolve them
                  within 30 days.
                </p>
                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] divide-y divide-[var(--border-default)]">
                  {[
                    { label: "General privacy enquiries", email: CONTACT_EMAIL },
                    { label: "Data Protection Officer", email: DPO_EMAIL },
                    { label: "Legal & compliance", email: "legal@allconverter.tools" },
                  ].map(({ label, email }) => (
                    <div key={email} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-4">
                      <span className="text-sm text-[var(--body-subtle)]">{label}</span>
                      <a
                        href={`mailto:${email}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fg-brand)] hover:opacity-80 transition-opacity"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {email}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-4 rounded-lg border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
                  <p className="text-xs font-semibold text-[var(--heading)] mb-2">Related policies</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      ["/cookies/", "Cookie Policy"],
                      ["/disclaimer/", "Disclaimer"],
                      ["/terms/", "Terms & Conditions"],
                      ["/security/", "Security"],
                    ].map(([href, label]) => (
                      <Link
                        key={href}
                        href={href}
                        className="text-xs text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80"
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
