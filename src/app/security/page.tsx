import type { Metadata } from "next";
import {
  ShieldCheck,
  MonitorSmartphone,
  LockKeyhole,
  FolderX,
  Eye,
  BadgeCheck,
  Server,
  Globe,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { siteConfig } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Security — How We Protect Your Data",
  description:
    "AllConverter.tools processes everything in your browser. No file uploads, no servers, no data retention. Learn how we keep your data private and secure.",
  alternates: { canonical: `${siteConfig.url}/security/` },
};

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="flex gap-5 py-8 border-b border-[var(--border-default)] last:border-0">
      <div className="shrink-0 w-11 h-11 rounded-[var(--radius-base)] bg-[var(--brand-soft)] border border-[var(--border-brand)] flex items-center justify-center text-[var(--fg-brand)]">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[var(--heading)] mb-2">{title}</h2>
        <div className="text-[var(--body-subtle)] text-sm leading-relaxed space-y-3">{children}</div>
      </div>
    </div>
  );
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="border-b border-[var(--border-default)] bg-[var(--brand-softer,var(--brand-soft))] py-14">
        <div className="container-xl max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-[var(--radius-base)] bg-[var(--brand)] flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-brand)]">Security &amp; Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)] mb-4">
            Your files never leave your device.
          </h1>
          <p className="text-base text-[var(--body-subtle)] leading-relaxed max-w-2xl">
            Every tool on AllConverter.tools runs entirely inside your browser. There are no upload servers, no
            cloud pipelines, and no data retention — because we architected the platform so those things are
            simply not needed. This page explains exactly what that means for you and your data.
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)]">
        <div className="container-xl max-w-3xl py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "No file uploads" },
            { label: "No account required" },
            { label: "No data retention" },
            { label: "HTTPS everywhere" },
          ].map(({ label }) => (
            <div key={label} className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[var(--fg-brand)] shrink-0" />
              <span className="text-xs font-medium text-[var(--heading)]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="container-xl max-w-3xl py-4">

        <Section icon={<MonitorSmartphone className="w-5 h-5" />} title="Browser-Based Processing">
          <p>
            All computation happens locally in your browser using standard Web APIs — the Canvas API for images,
            Web Audio API for audio files, the File API for reading documents, and JavaScript libraries like
            PDF.js and pdf-lib for PDF manipulation. When you convert, compress, or analyse a file, your browser
            is doing the work directly, not a remote server.
          </p>
          <p>
            This means there is no upload step, no queue, and no third-party cloud service processing your
            documents. The data path is: your device → your browser → your device. Full stop.
          </p>
        </Section>

        <Section icon={<FolderX className="w-5 h-5" />} title="No Storage, No Retention">
          <p>
            We have no infrastructure capable of storing user files because we deliberately built none. Files
            you open in our tools are read via the browser's File API and held temporarily in browser memory for
            the duration of the operation. When you close the tab or navigate away, that memory is released by
            the browser's garbage collector.
          </p>
          <p>
            We do not log file names, file sizes, file contents, or any metadata about the documents you process.
            There are no databases, object-storage buckets, or logging pipelines attached to our tools.
          </p>
        </Section>

        <Section icon={<LockKeyhole className="w-5 h-5" />} title="Encryption in Transit">
          <p>
            AllConverter.tools is served exclusively over HTTPS. We enforce TLS 1.2 as a minimum, with TLS 1.3
            preferred. HTTP Strict Transport Security (HSTS) is enabled to prevent protocol downgrade attacks,
            ensuring your browser will always connect over an encrypted channel — even if you manually type
            <code className="mx-1 px-1 py-0.5 rounded bg-[var(--neutral-secondary-soft)] font-mono text-xs">http://</code>
            by mistake.
          </p>
          <p>
            Static assets are delivered via a CDN with edge certificates, ensuring low-latency encrypted
            connections regardless of your geographic location.
          </p>
        </Section>

        <Section icon={<Server className="w-5 h-5" />} title="Third-Party API Usage">
          <p>
            A small number of tools make outbound requests to third-party APIs to provide their functionality.
            The Website Speed Checker calls the Google PageSpeed Insights API — only the URL you enter is sent,
            never any file or personal information. The Redirect Checker and Canonical Tag Checker use the
            Microlink API, which similarly receives only the URL you submit.
          </p>
          <p>
            No tool on this platform sends your files, document content, or personally identifiable information
            to any external service. When an API is involved, the tool interface makes that clear.
          </p>
        </Section>

        <Section icon={<Eye className="w-5 h-5" />} title="Analytics &amp; Advertising Transparency">
          <p>
            We use Google Analytics 4 to understand aggregate usage — which tools are popular, how visitors
            navigate the site. GA4 collects anonymised page-view and event data. No PII is included in these
            events and IP anonymisation is enabled.
          </p>
          <p>
            Google AdSense is used to display advertising. AdSense may set cookies on your device in accordance
            with Google's own privacy policy to serve contextually relevant ads. You can opt out of personalised
            advertising via{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Google's Ad Settings
            </a>
            . We do not sell your data. We do not build individual user profiles. We have no user account system
            and therefore hold no passwords, email addresses, or personal records of any kind.
          </p>
        </Section>

        <Section icon={<Globe className="w-5 h-5" />} title="Security Best Practices for Users">
          <p>
            To get the most secure experience when using AllConverter.tools:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm">
            <li>Use a modern, up-to-date browser — Chrome, Firefox, Safari, and Edge all receive regular security patches.</li>
            <li>Bookmark <strong className="text-[var(--heading)] font-medium">allconverter.tools</strong> directly and navigate from your bookmark rather than search results, to avoid landing on lookalike domains.</li>
            <li>For highly sensitive documents, you can disconnect from the internet before using any tool. Since all processing is local, every tool will continue to work offline once the page has loaded.</li>
            <li>After processing a sensitive file, clear your browser's memory cache if you share your device with others.</li>
          </ul>
        </Section>

        <Section icon={<AlertTriangle className="w-5 h-5" />} title="Responsible Disclosure">
          <p>
            We take security reports seriously. If you discover a vulnerability — whether in our code, our
            infrastructure, or the behaviour of a tool — we ask that you report it to us privately before
            disclosing it publicly, so we can address it promptly.
          </p>
          <p>
            Please send a clear description of the issue, the steps to reproduce it, and any proof-of-concept
            material to:
          </p>
          <a
            href="mailto:security@allconverter.tools"
            className="inline-flex items-center gap-2 mt-1 text-[var(--fg-brand)] font-medium hover:opacity-80 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            security@allconverter.tools
          </a>
          <p className="mt-3">
            We will acknowledge your report within 48 hours and aim to resolve confirmed vulnerabilities within
            14 days. Researchers who responsibly disclose valid issues are credited in our changelog with their
            permission.
          </p>
        </Section>

      </section>

      {/* Commitment footer */}
      <section className="border-t border-[var(--border-default)] bg-[var(--neutral-primary-soft)] mt-6">
        <div className="container-xl max-w-3xl py-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <ShieldCheck className="w-10 h-10 text-[var(--fg-brand)] shrink-0" />
          <div>
            <p className="font-semibold text-[var(--heading)] mb-1">Our commitment to you</p>
            <p className="text-sm text-[var(--body-subtle)] leading-relaxed">
              Privacy and security are not features we added — they are the consequence of an architecture that
              never needed your data in the first place. We will maintain this design as the platform grows, and
              we will be transparent when anything changes.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
