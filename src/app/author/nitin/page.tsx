import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Wrench, MapPin, Globe } from "lucide-react";
import { siteConfig } from "@/lib/seo-utils";
import { allBlogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: `Nitin Kaushik — Founder & Developer | ${siteConfig.name}`,
  description:
    "Nitin Kaushik is the founder and developer of AllConverter.tools — a free browser-based platform with 250+ online tools. Based in Mumbai, India.",
  alternates: { canonical: `${siteConfig.url}/author/nitin/` },
  openGraph: {
    title: "Nitin Kaushik — Founder & Developer at AllConverter.tools",
    description:
      "Frontend developer and founder of AllConverter.tools. Building free, privacy-first tools for everyone.",
    url: `${siteConfig.url}/author/nitin/`,
    siteName: siteConfig.name,
    type: "profile",
  },
};

const authorSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${siteConfig.url}/author/nitin/#webpage`,
  url: `${siteConfig.url}/author/nitin/`,
  name: "Nitin Kaushik — Author Profile",
  isPartOf: { "@id": `${siteConfig.url}/#website` },
  about: {
    "@type": "Person",
    "@id": `${siteConfig.url}/#founder`,
    name: "Nitin Kaushik",
    jobTitle: "Founder & Frontend Developer",
    description:
      "Frontend developer and founder of AllConverter.tools — a free browser-based platform with 250+ online tools for PDF, image, developer, AI, SEO, and business tasks.",
    url: `${siteConfig.url}/author/nitin/`,
    email: "support@allconverter.tools",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    worksFor: { "@id": `${siteConfig.url}/#organization` },
    knowsAbout: [
      "Web Development",
      "Next.js",
      "TypeScript",
      "PDF tools",
      "Image processing",
      "SEO",
      "AI content tools",
      "Browser-based applications",
    ],
    sameAs: [
      "https://twitter.com/allconvertertools",
      "https://github.com/allconvertertools",
    ],
  },
};

const authoredPosts = allBlogPosts
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .slice(0, 12);

const skills = [
  "Next.js & React",
  "TypeScript",
  "Tailwind CSS",
  "Browser APIs",
  "PDF processing",
  "Image optimisation",
  "SEO engineering",
  "Performance tuning",
];

export default function AuthorPage() {
  return (
    <div className="min-h-screen pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />

      {/* Hero */}
      <section className="border-b border-(--border-default) bg-(--neutral-primary-soft) py-14">
        <div className="container-xl max-w-3xl">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full bg-linear-to-br from-fg-brand to-violet-500 flex items-center justify-center text-white font-bold text-2xl shrink-0 select-none shadow-lg">
              NK
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--heading) mb-1">
                Nitin Kaushik
              </h1>
              <p className="text-sm font-medium text-fg-brand mb-3">
                Founder & Frontend Developer · AllConverter.tools
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-(--body-subtle)">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Mumbai, India
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <a href={siteConfig.url} className="hover:text-fg-brand transition-colors">
                    allconverter.tools
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-xl max-w-3xl py-12 space-y-14">

        {/* Bio */}
        <section>
          <p className="text-sm text-(--body-subtle) leading-relaxed mb-4">
            I'm a frontend developer with a focus on web applications and browser-based productivity
            tools. I built AllConverter.tools because the tools I needed most were either behind
            paywalls, required unnecessary sign-ups, or were slow due to server-side processing.
          </p>
          <p className="text-sm text-(--body-subtle) leading-relaxed mb-4">
            Every tool on this platform runs in your browser — your files never leave your device.
            No account system, no premium tier, no limits. That's not a marketing line; it's a
            technical design choice made from day one.
          </p>
          <p className="text-sm text-(--body-subtle) leading-relaxed">
            I write guides here when I find that a common task has a non-obvious best approach —
            format comparisons, workflow tips, and technical deep-dives that help people get more
            out of the tools they already use.
          </p>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-base font-bold text-(--heading) mb-4">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-3 py-1.5 rounded-full border border-(--border-default) bg-(--neutral-secondary-soft) text-(--body-subtle)"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Platform stats */}
        <section>
          <h2 className="text-base font-bold text-(--heading) mb-4">The Platform</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-lg overflow-hidden border border-(--border-default) bg-(--border-default)">
            {[
              { value: "250+", label: "Free tools" },
              { value: "13", label: "Categories" },
              { value: "55+", label: "Guides written" },
              { value: "0", label: "Accounts needed" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-(--neutral-primary-soft) px-5 py-4 text-center"
              >
                <p className="text-xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-(--body-subtle) mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-fg-brand" />
              <h2 className="text-base font-bold text-(--heading)">Articles & Guides</h2>
            </div>
            <Link
              href="/blog/"
              className="text-xs font-medium text-fg-brand hover:underline flex items-center gap-1"
            >
              All articles <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {authoredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.category}/${post.slug}/`}
                className="flex items-center justify-between gap-4 rounded-lg border border-(--border-default) bg-(--neutral-primary-soft) px-4 py-3 hover:border-border-brand hover:bg-(--neutral-secondary-soft) transition-all group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-(--heading) group-hover:text-fg-brand transition-colors line-clamp-1">
                    {post.h1}
                  </p>
                  <p className="text-xs text-(--body-subtle) mt-0.5">
                    {post.readingTime} min read · {post.category.replace("-", " ")}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-(--body-subtle) shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>

        {/* Tools CTA */}
        <section className="rounded-lg border border-border-brand bg-brand-soft px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Wrench className="w-4 h-4 text-fg-brand mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-(--heading)">Explore the tools</p>
              <p className="text-xs text-(--body-subtle) mt-0.5">
                250+ free browser-based tools — no sign-up, no upload limits.
              </p>
            </div>
          </div>
          <Link
            href="/tools/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg-brand border border-border-brand rounded-(--radius-default) px-4 py-2 hover:bg-(--neutral-secondary-soft) transition-colors shrink-0"
          >
            Browse all tools <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

      </div>
    </div>
  );
}
