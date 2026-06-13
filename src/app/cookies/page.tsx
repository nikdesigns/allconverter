import type { Metadata } from "next";
import {
  Cookie,
  ShieldCheck,
  BarChart2,
  Megaphone,
  Link2,
  Settings2,
  UserCheck,
  Mail,
  Info,
} from "lucide-react";
import { siteConfig } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn how AllConverter.tools uses cookies — including essential, analytics, and advertising cookies from Google Analytics and Google AdSense — and how to manage your preferences.",
  alternates: { canonical: `${siteConfig.url}/cookies/` },
};

const EFFECTIVE_DATE = "1 June 2025";
const CONTACT_EMAIL = "privacy@allconverter.tools";

interface SectionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ id, icon, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-8 border-b border-[var(--border-default)] last:border-0">
      <div className="flex gap-4">
        <div className="shrink-0 w-10 h-10 rounded-[var(--radius-base)] bg-[var(--brand-soft)] border border-[var(--border-brand)] flex items-center justify-center text-[var(--fg-brand)] mt-0.5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-[var(--heading)] mb-3">{title}</h2>
          <div className="text-sm text-[var(--body-subtle)] leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function Table({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div className="overflow-x-auto mt-4 rounded-lg border border-[var(--border-default)]">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[var(--neutral-secondary-soft)] border-b border-[var(--border-default)]">
            {["Cookie / Provider", "Purpose", "Type", "Duration"].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 font-semibold text-[var(--heading)] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, purpose, type, duration], i) => (
            <tr
              key={i}
              className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--neutral-secondary-soft)] transition-colors"
            >
              <td className="px-4 py-2.5 font-mono font-medium text-[var(--heading)] whitespace-nowrap">{name}</td>
              <td className="px-4 py-2.5 text-[var(--body-subtle)]">{purpose}</td>
              <td className="px-4 py-2.5 whitespace-nowrap">{type}</td>
              <td className="px-4 py-2.5 whitespace-nowrap">{duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-12">
        <div className="container-xl max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Cookie className="w-5 h-5 text-[var(--fg-brand)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-brand)]">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)] mb-3">
            Cookie Policy
          </h1>
          <p className="text-sm text-[var(--body-subtle)] leading-relaxed max-w-2xl mb-4">
            This policy explains what cookies are, which cookies AllConverter.tools sets and why, which
            third-party cookies may be placed on your device, and how you can control your preferences.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-[var(--body-subtle)]">
            <span>Effective date: <strong className="text-[var(--heading)]">{EFFECTIVE_DATE}</strong></span>
            <span>Applies to: <strong className="text-[var(--heading)]">allconverter.tools</strong></span>
          </div>
        </div>
      </section>

      {/* Quick-nav */}
      <div className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] sticky top-16 z-10">
        <div className="container-xl max-w-3xl py-2 overflow-x-auto">
          <div className="flex gap-1 text-xs whitespace-nowrap">
            {[
              ["#what-are-cookies", "What Are Cookies"],
              ["#essential", "Essential"],
              ["#analytics", "Analytics"],
              ["#advertising", "Advertising"],
              ["#third-party", "Third-Party"],
              ["#manage", "Manage Cookies"],
              ["#your-rights", "Your Rights"],
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

        <Section id="what-are-cookies" icon={<Info className="w-5 h-5" />} title="What Are Cookies?">
          <p>
            Cookies are small text files that a website stores on your device — computer, tablet, or smartphone —
            when you visit. They are widely used to make websites work efficiently, to remember your preferences
            across sessions, and to provide analytical information to website owners.
          </p>
          <p>
            Cookies set by the website you are visiting are called <strong className="text-[var(--heading)]">first-party cookies</strong>.
            Cookies set by organisations other than the website owner are called <strong className="text-[var(--heading)]">third-party cookies</strong>.
            Third-party cookies are typically placed by advertising networks, analytics providers, or embedded
            content — and they may track your browsing activity across multiple websites.
          </p>
          <p>
            Cookies can be <strong className="text-[var(--heading)]">session cookies</strong> (deleted when you
            close your browser) or <strong className="text-[var(--heading)]">persistent cookies</strong> (stored
            on your device for a set period or until you delete them).
          </p>
        </Section>

        <Section id="essential" icon={<ShieldCheck className="w-5 h-5" />} title="Essential Cookies">
          <p>
            Essential cookies are strictly necessary for the website to function. They enable core features such
            as page navigation, theme preferences, and security. Without these cookies, services you have asked
            for — such as remembering your dark-mode preference — cannot be provided.
          </p>
          <p>
            Because these cookies are necessary for the site to operate, they do not require your consent under
            GDPR and the ePrivacy Directive. You cannot opt out of essential cookies while continuing to use
            the site.
          </p>
          <Table
            rows={[
              ["theme", "Stores your light/dark mode preference", "First-party · Persistent", "1 year"],
              ["__Host-next-*", "Next.js internal routing and hydration state", "First-party · Session", "Session"],
            ]}
          />
        </Section>

        <Section id="analytics" icon={<BarChart2 className="w-5 h-5" />} title="Analytics Cookies">
          <p>
            We use <strong className="text-[var(--heading)]">Google Analytics 4 (GA4)</strong> to understand how
            visitors use AllConverter.tools — which tools are most popular, how users navigate between pages, and
            where visitors come from. This helps us improve the platform and prioritise new features.
          </p>
          <p>
            GA4 collects data such as pages visited, time spent, and general geographic region (country/city
            level). IP anonymisation is enabled — your full IP address is never stored by Google Analytics.
            We do not use GA4 to identify you personally, and we have not enabled any advertising features
            within GA4.
          </p>
          <p>
            Analytics cookies are only placed with your consent where consent is required by applicable law.
            You can withdraw consent at any time using the methods described in the{" "}
            <a href="#manage" className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80">
              Manage Cookies
            </a>{" "}
            section.
          </p>
          <Table
            rows={[
              ["_ga", "Distinguishes unique users for Google Analytics", "First-party · Persistent", "2 years"],
              ["_ga_XXXXXXXXXX", "Stores and counts page-view sessions in GA4", "First-party · Persistent", "2 years"],
              ["_gid", "Distinguishes users — resets daily", "First-party · Persistent", "24 hours"],
              ["_gat", "Rate-limits requests to Google Analytics", "First-party · Persistent", "1 minute"],
            ]}
          />
        </Section>

        <Section id="advertising" icon={<Megaphone className="w-5 h-5" />} title="Advertising Cookies">
          <p>
            AllConverter.tools displays advertisements served by <strong className="text-[var(--heading)]">Google AdSense</strong>.
            AdSense uses cookies to serve ads that are relevant to you based on your browsing history and
            interests, and to measure the effectiveness of those ads.
          </p>
          <p>
            Google may use the information collected via these cookies to personalise the ads you see on this
            site and on other websites across the internet. This processing is carried out by Google Ireland
            Limited under its own privacy policy. We do not have access to the data Google collects through
            AdSense, nor do we receive any personally identifiable information from Google in connection with
            advertising.
          </p>
          <p>
            If you have not consented to personalised advertising, AdSense will serve
            non-personalised ads using contextual signals only (page content, approximate location) — no
            cross-site tracking. You can manage your Google advertising preferences at any time via{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80"
            >
              Google Ad Settings
            </a>
            .
          </p>
          <Table
            rows={[
              ["IDE", "Used by Google DoubleClick to register and report ad interactions", "Third-party · Persistent", "1 year"],
              ["DSID", "Identifies a signed-in Google user account for ad personalisation", "Third-party · Persistent", "2 weeks"],
              ["test_cookie", "Checks that the browser supports cookies (DoubleClick)", "Third-party · Session", "Session"],
              ["__gads / __gpi", "Google AdSense — stores ad-click information and fraud prevention", "First-party · Persistent", "13 months"],
            ]}
          />
        </Section>

        <Section id="third-party" icon={<Link2 className="w-5 h-5" />} title="Third-Party Cookies">
          <p>
            In addition to Google Analytics and Google AdSense, certain tools on this platform make requests
            to third-party APIs to deliver their functionality — for example, the Website Speed Checker calls
            the Google PageSpeed API, and the Redirect Checker uses the Microlink API. These API calls are
            triggered only when you actively use those tools and transmit only the URL you enter — not your
            personal data. These requests do not set cookies on your device.
          </p>
          <p>
            We do not embed social media plugins, comment systems, or other third-party widgets that would
            set additional cookies without your knowledge. If we add such functionality in future, this policy
            will be updated before deployment.
          </p>
          <p>
            The following third parties may place cookies on your device when you visit AllConverter.tools:
          </p>
          <div className="rounded-lg border border-[var(--border-default)] overflow-hidden mt-4">
            {[
              {
                name: "Google Analytics (Google Ireland Ltd)",
                purpose: "Usage analytics — page views and tool usage",
                policy: "https://policies.google.com/privacy",
              },
              {
                name: "Google AdSense (Google Ireland Ltd)",
                purpose: "Advertising delivery and measurement",
                policy: "https://policies.google.com/privacy",
              },
            ].map((tp, i, arr) => (
              <div
                key={tp.name}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 ${i < arr.length - 1 ? "border-b border-[var(--border-default)]" : ""}`}
              >
                <div>
                  <p className="font-medium text-[var(--heading)] text-xs">{tp.name}</p>
                  <p className="text-[var(--body-subtle)] text-xs mt-0.5">{tp.purpose}</p>
                </div>
                <a
                  href={tp.policy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80"
                >
                  Privacy Policy →
                </a>
              </div>
            ))}
          </div>
        </Section>

        <Section id="manage" icon={<Settings2 className="w-5 h-5" />} title="How to Manage Cookies">
          <p>
            You have several options to control or limit how cookies are used when you visit our site.
          </p>

          <div className="space-y-4 mt-2">
            <div className="rounded-lg border border-[var(--border-default)] p-4 bg-[var(--neutral-secondary-soft)]">
              <p className="font-semibold text-[var(--heading)] text-sm mb-1">Browser settings</p>
              <p>
                All modern browsers allow you to view, block, and delete cookies through their settings menu.
                Note that blocking all cookies will prevent some parts of this site — such as theme
                preferences — from working correctly.
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {[
                  ["Chrome", "Settings → Privacy and security → Cookies and other site data"],
                  ["Firefox", "Settings → Privacy & Security → Cookies and Site Data"],
                  ["Safari", "Preferences → Privacy → Manage Website Data"],
                  ["Edge", "Settings → Cookies and site permissions → Cookies and site data"],
                ].map(([browser, path]) => (
                  <li key={browser}>
                    <strong className="text-[var(--heading)]">{browser}:</strong>{" "}
                    <span className="text-[var(--body-subtle)]">{path}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-[var(--border-default)] p-4 bg-[var(--neutral-secondary-soft)]">
              <p className="font-semibold text-[var(--heading)] text-sm mb-1">Opt out of Google Analytics</p>
              <p>
                Install the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>{" "}
                to prevent your data from being collected by GA4 across all websites, including ours.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-default)] p-4 bg-[var(--neutral-secondary-soft)]">
              <p className="font-semibold text-[var(--heading)] text-sm mb-1">Opt out of personalised advertising</p>
              <p>
                Visit{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80"
                >
                  Google Ad Settings
                </a>{" "}
                to control whether Google serves you personalised ads. You can also opt out of
                interest-based advertising from participating networks via{" "}
                <a
                  href="https://www.youronlinechoices.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80"
                >
                  Your Online Choices (EU)
                </a>{" "}
                or the{" "}
                <a
                  href="https://optout.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--fg-brand)] underline underline-offset-2 hover:opacity-80"
                >
                  Digital Advertising Alliance (US)
                </a>
                .
              </p>
            </div>
          </div>
        </Section>

        <Section id="your-rights" icon={<UserCheck className="w-5 h-5" />} title="Your Rights Under Indian Privacy Law">
          <p>
            As a Data Principal under the Digital Personal Data Protection Act, 2023 (DPDPA) and
            the Information Technology Act, 2000, you have the following rights in relation to personal
            data collected through cookies on this platform:
          </p>
          <ul className="space-y-2.5 mt-2">
            {[
              ["Right of access", "Request a summary of the personal data we hold about you and the purposes for which it is processed."],
              ["Right to erasure", "Ask us to delete your personal data. For data held by Google, this is managed through Google's own tools."],
              ["Right to object", "Object to the processing of your data for analytics or advertising purposes."],
              ["Right to withdraw consent", "Withdraw consent at any time without affecting the lawfulness of processing carried out before withdrawal. See the Manage Cookies section above."],
              ["Right to grievance redressal", "Raise a grievance about cookie-related data processing by contacting us directly. Unresolved grievances may be escalated to the Data Protection Board of India once operational."],
            ].map(([right, desc]) => (
              <li key={right as string} className="flex gap-2">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--fg-brand)] mt-1.5" />
                <span>
                  <strong className="text-[var(--heading)]">{right}:</strong>{" "}
                  {desc}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            To exercise any of these rights, or if you have questions about how we handle cookie data, contact
            us at:
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 mt-2 text-[var(--fg-brand)] font-medium hover:opacity-80 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            {CONTACT_EMAIL}
          </a>
        </Section>

        {/* Updates notice */}
        <section className="py-8">
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] p-5 flex gap-3">
            <Info className="w-4 h-4 text-[var(--fg-brand)] shrink-0 mt-0.5" />
            <div className="text-sm text-[var(--body-subtle)] space-y-1">
              <p className="font-semibold text-[var(--heading)]">Changes to this policy</p>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation,
                or our services. When we make material changes, we will update the effective date at the top of
                this page. We encourage you to review this page periodically. Continued use of the site after
                changes are posted constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
