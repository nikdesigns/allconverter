import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase, Rocket, Search as SearchIcon, ImageIcon, ArrowRight, Workflow,
} from "lucide-react";
import { siteConfig } from "@/lib/seo-utils";
import { getToolBySlug } from "@/lib/tools-data";
import type { Tool } from "@/types";

export const metadata: Metadata = {
  title: `Workflows — Guided Tool Bundles | ${siteConfig.name}`,
  description:
    "Multi-step workflows that bundle the right tools together for common tasks — job applications, launching a business, SEO audits, and prepping photos for the web.",
  alternates: { canonical: `${siteConfig.url}/workflows/` },
  openGraph: {
    title: "Workflows — Guided Tool Bundles",
    description: "Bundles of tools for common multi-step tasks, in the right order.",
    url: `${siteConfig.url}/workflows/`,
    siteName: siteConfig.name,
    type: "website",
  },
};

interface WorkflowBundle {
  slug: string;
  title: string;
  description: string;
  icon: typeof Briefcase;
  color: string;
  bg: string;
  steps: string[]; // tool slugs, in order
}

const workflows: WorkflowBundle[] = [
  {
    slug: "job-application",
    title: "Prep a Job Application",
    description: "Go from a blank page to a polished application — build your resume, score it against ATS, and write a tailored cover letter.",
    icon: Briefcase,
    color: "text-violet-500",
    bg: "from-violet-500/10 to-purple-500/10",
    steps: ["ai-resume-builder", "ai-resume-analyzer", "ai-cover-letter", "ai-linkedin-optimizer"],
  },
  {
    slug: "launch-a-business",
    title: "Launch a Small Business",
    description: "Name your business, send your first quote, and start invoicing clients with GST-compliant documents.",
    icon: Rocket,
    color: "text-amber-500",
    bg: "from-amber-500/10 to-orange-500/10",
    steps: ["business-name-generator", "quotation-generator", "invoice-generator", "gst-invoice-generator", "upi-qr-generator"],
  },
  {
    slug: "seo-audit",
    title: "Audit & Optimize a Page",
    description: "Run a quick SEO health check, fix your meta tags, check keyword density, and make sure your sitemap is in shape.",
    icon: SearchIcon,
    color: "text-emerald-500",
    bg: "from-emerald-500/10 to-teal-500/10",
    steps: ["ai-seo-audit", "meta-tag-generator", "keyword-density-checker", "sitemap-generator"],
  },
  {
    slug: "prep-photos-for-web",
    title: "Prep Photos for the Web",
    description: "Resize, remove the background, and compress your images so they load fast without losing quality.",
    icon: ImageIcon,
    color: "text-sky-500",
    bg: "from-sky-500/10 to-blue-500/10",
    steps: ["image-resizer", "smart-background-remover", "image-compressor"],
  },
];

export default function WorkflowsPage() {
  return (
    <div className="container-xl py-12 lg:py-16">
      <div className="max-w-2xl mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Workflow className="w-4 h-4 text-(--fg-brand)" />
          <span className="text-xs font-semibold text-(--fg-brand) uppercase tracking-wider">
            Workflows
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-(--heading)">
          Guided tool bundles
        </h1>
        <p className="text-(--body-subtle) mt-3">
          Some tasks need more than one tool. These workflows walk you through the right tools,
          in the right order, so you can get the whole job done in one sitting.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {workflows.map((wf) => {
          const Icon = wf.icon;
          const tools = wf.steps
            .map((slug) => getToolBySlug(slug))
            .filter((t): t is Tool => !!t);

          return (
            <div
              key={wf.slug}
              className="rounded-2xl border border-(--border-default) bg-(--neutral-primary) p-6 flex flex-col"
            >
              <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${wf.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${wf.color}`} />
              </div>
              <h2 className="text-lg font-bold text-(--heading)">{wf.title}</h2>
              <p className="text-sm text-(--body-subtle) mt-1.5">{wf.description}</p>

              <ol className="mt-5 space-y-2 flex-1">
                {tools.map((tool, i) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}/`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg border border-(--border-default) hover:border-border-brand hover:bg-brand-soft transition-colors group"
                    >
                      <span className="w-5 h-5 rounded-full bg-(--neutral-secondary-soft) text-(--body-subtle) text-[11px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-(--heading) group-hover:text-fg-brand truncate">
                        {tool.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-(--body-subtle) ml-auto shrink-0" />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}
