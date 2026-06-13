export type ChangeType =
  | "tool"      // New tool shipped
  | "feature"   // New capability or improvement
  | "perf"      // Performance improvement
  | "bug"       // Bug fix
  | "design"    // UI / UX change
  | "security"  // Security improvement
  | "seo"       // SEO / structured data
  | "ai"        // AI-specific improvement
  | "infra";    // Infrastructure / build

export interface ChangeItem {
  type: ChangeType;
  text: string;
}

export interface Release {
  version: string;
  codename?: string;
  date: string;
  summary: string;
  highlight?: string;
  isMajor?: boolean;
  changes: ChangeItem[];
}

export interface RoadmapItem {
  text: string;
  priority?: "high" | "medium" | "low";
}

export const releases: Release[] = [
  {
    version: "v2.5.0",
    date: "June 2026",
    summary:
      "Launched a full blog architecture with 33 in-depth articles across 9 categories, article-level structured data, sticky TOC sidebar, and AdSense integration on all blog pages.",
    highlight:
      "The blog delivers topical authority and organic discovery for every tool category — with FAQPage, Article, HowTo, and BreadcrumbList schemas on every article.",
    changes: [
      { type: "feature", text: "Blog homepage at /blog/ — featured guides, 9 category cards, recent articles feed" },
      { type: "feature", text: "9 category pages with pillar article feature and cluster article grid" },
      { type: "feature", text: "33 in-depth articles across PDF, Image, Developer, SEO, Finance, Business, AI, Audio, and Text categories" },
      { type: "feature", text: "Sticky table-of-contents sidebar with IntersectionObserver-based active section tracking" },
      { type: "feature", text: "Relevance-scored related articles system — weighted by category, pillar relationship, and shared tags" },
      { type: "feature", text: "In-article related tool CTAs linking from article content to the relevant tool page" },
      { type: "seo", text: "Article JSON-LD schema — Article type for pillar/educational, HowTo type for tutorial/comparison articles" },
      { type: "seo", text: "FAQPage JSON-LD schema on all articles containing FAQ sections" },
      { type: "seo", text: "BreadcrumbList schema (4 levels: Home → Blog → Category → Article) on all article pages" },
      { type: "seo", text: "Open Graph article metadata — publishedTime, modifiedTime, tags on all article pages" },
      { type: "seo", text: "In-article AdUnit (slot 1096054855) placed after AuthorBox for high-viewability placement" },
      { type: "seo", text: "Sidebar rectangle AdUnit (slot 8443766688) below TOC on article pages" },
      { type: "seo", text: "In-feed ads on blog homepage (between categories and recent articles) and category pages (between pillar and grid)" },
      { type: "infra", text: "Blog data architecture: 9 TypeScript data files aggregated via /src/data/blog-posts/index.ts" },
      { type: "infra", text: "Blog utilities: getBlogPost, getPostsByCategory, getFeaturedPosts, getRecentPosts, getRelatedPosts, getAllBlogSlugs, getPillarPosts" },
    ],
  },

  {
    version: "v2.4.0",
    date: "May 2026",
    summary:
      "Automated FAQ and SEO content framework deployed across all 250+ tool pages. Founder & Mission section and Support the Project section added to homepage.",
    changes: [
      { type: "feature", text: "3-tier FAQ generation for all 250+ tools: slug-specific (45 top tools) → category/trait-based → universal fallback" },
      { type: "feature", text: "Trait detection from tool metadata: isConverter, isCompressor, isGenerator, isCalculator, isAITool, isLegalDoc, hasFileInput, and more" },
      { type: "feature", text: "Auto-generated tool introduction paragraphs rendered above each tool interface" },
      { type: "feature", text: "Founder & Mission homepage section — personal story, core principles, trust stats, dual CTA" },
      { type: "feature", text: "Support the Project homepage section — cost breakdown, PayPal CTA, trust indicators" },
      { type: "seo", text: "FAQPage JSON-LD schema on all tool pages using generated FAQ data" },
      { type: "seo", text: "HowTo JSON-LD schema on all tool pages" },
      { type: "seo", text: "BreadcrumbList schema (3 levels: Home → Category → Tool) on all tool pages" },
      { type: "seo", text: "Enhanced SoftwareApplication schema: featureList, applicationCategory (per-category), operatingSystem, browserRequirements, isAccessibleForFree, offers" },
      { type: "seo", text: "Person JSON-LD schema for founder added to homepage (E-E-A-T signal)" },
      { type: "design", text: "Tool introduction section renders above the tool interface — auto-generated or hand-crafted per tool" },
    ],
  },

  {
    version: "v2.3.0",
    date: "April 2026",
    summary:
      "Google AdSense integration across tool pages with smart placement — sidebar rectangle, in-article, and mobile anchor ad units.",
    changes: [
      { type: "feature", text: "MobileAnchorAd — sticky fixed-bottom unit, mobile/tablet only (lg:hidden), 1.5s reveal delay, dismissible" },
      { type: "feature", text: "Sidebar AdUnit (300×250 rectangle) sticky on desktop tool page sidebar" },
      { type: "feature", text: "In-article AdUnit (auto format) between tool interface and How-to section" },
      { type: "feature", text: "AdBlockNotice component — polite non-intrusive detection with platform explanation" },
      { type: "infra", text: "Google AdSense publisher script (ca-pub-6648091987919638) integrated in root layout" },
      { type: "infra", text: "Dev-mode ad placeholders — dashed containers with slot IDs for layout verification without live ads" },
      { type: "design", text: "Ad placements never interrupt the tool interface itself — only surrounding editorial content" },
    ],
  },

  {
    version: "v2.2.0",
    date: "March 2026",
    summary:
      "AI Tools category expanded with 8 new tools. Audio Tools category launched. All AI tools run entirely in-browser with no API key required.",
    changes: [
      { type: "tool", text: "AI Cover Letter Generator — structured template-based generation, role, company, and skills input" },
      { type: "tool", text: "AI LinkedIn Profile Optimizer" },
      { type: "tool", text: "AI Cold Email Writer" },
      { type: "tool", text: "AI Blog Outline Generator" },
      { type: "tool", text: "AI SQL Generator" },
      { type: "tool", text: "AI Code Explainer" },
      { type: "tool", text: "AI Product Description Generator" },
      { type: "tool", text: "Audio Converter — MP3, WAV, AAC, FLAC, M4A" },
      { type: "tool", text: "Audio Compressor with quality and bitrate controls" },
      { type: "tool", text: "Audio Trimmer with waveform preview" },
      { type: "ai", text: "All AI tools run template-based generation entirely in-browser — no external API calls, no key required, no data transmitted" },
      { type: "perf", text: "Audio processing via Web Audio API — all operations client-side, no file uploads" },
    ],
  },

  {
    version: "v2.1.0",
    date: "February 2026",
    summary:
      "Legal and compliance pages published. XML sitemap, robots.txt, and canonical URLs implemented across the full site.",
    changes: [
      { type: "feature", text: "Privacy Policy — DPDPA 2023 (India) compliant, per-category data handling details" },
      { type: "feature", text: "Terms of Service" },
      { type: "feature", text: "Cookie Policy — cookie type breakdown with browser opt-out guidance" },
      { type: "feature", text: "Disclaimer — financial and legal tool caveats with jurisdiction details" },
      { type: "feature", text: "Security page — architecture overview, TLS details, and vulnerability disclosure process" },
      { type: "feature", text: "Visual Sitemap at /sitemap/ — all categories and pages in a human-readable layout" },
      { type: "seo", text: "XML sitemap at /sitemap.xml covering all 319 static pages" },
      { type: "seo", text: "robots.txt with sitemap reference and crawl directives" },
      { type: "seo", text: "Canonical URL meta tag on every page" },
      { type: "security", text: "HTTP Strict Transport Security (HSTS) enabled" },
      { type: "security", text: "Content Security Policy headers configured" },
    ],
  },

  {
    version: "v2.0.0",
    codename: "Foundation",
    date: "January 2026",
    summary:
      "Complete platform rebuild — new design system with dark mode, Business Tools category, and migration to Next.js 16 App Router with full static export.",
    isMajor: true,
    highlight:
      "v2.0 is a complete rebuild: new component architecture, CSS design tokens, dark mode, 25+ Business Tools, and static export to Hostinger.",
    changes: [
      { type: "tool", text: "Invoice Generator — GST-compliant, logo upload, PDF export" },
      { type: "tool", text: "GST Invoice Generator — CGST/SGST/IGST breakdown, HSN/SAC codes" },
      { type: "tool", text: "NDA Generator — mutual and one-way templates" },
      { type: "tool", text: "Salary Slip Generator" },
      { type: "tool", text: "Quotation / Pro Forma Invoice Generator" },
      { type: "tool", text: "Purchase Order Generator" },
      { type: "tool", text: "Freelance Rate Calculator" },
      { type: "tool", text: "Profit Margin Calculator" },
      { type: "tool", text: "SaaS MRR & ARR Calculator" },
      { type: "tool", text: "Customer Acquisition Cost (CAC) Calculator" },
      { type: "design", text: "Full design system rebuild with CSS custom properties for light and dark mode tokens" },
      { type: "design", text: "Dark mode — OS preference detection with manual toggle in site header" },
      { type: "design", text: "Component library on shadcn/ui + Tailwind CSS v4" },
      { type: "design", text: "Responsive navigation with mobile menu and full category access" },
      { type: "infra", text: "Migration to Next.js 16.2.9 App Router with output: 'export' for static hosting" },
      { type: "infra", text: "Turbopack compiler — 4.1s compile time in development" },
      { type: "perf", text: "319 pages statically exported at build time — zero server-side rendering at request time" },
    ],
  },

  {
    version: "v1.5.0",
    date: "November 2025",
    summary:
      "SEO Tools category launched. Financial Calculators expanded to 14 tools. Organization and WebSite structured data added to homepage.",
    changes: [
      { type: "tool", text: "Meta Tag Generator" },
      { type: "tool", text: "SERP Snippet Preview" },
      { type: "tool", text: "Schema Markup Generator — FAQ, Article, LocalBusiness, Product" },
      { type: "tool", text: "Open Graph Preview" },
      { type: "tool", text: "XML Sitemap Generator" },
      { type: "tool", text: "Robots.txt Generator" },
      { type: "tool", text: "Hreflang Tag Generator" },
      { type: "tool", text: "Keyword Density Analyser" },
      { type: "tool", text: "EMI / Loan Calculator with full amortisation schedule" },
      { type: "tool", text: "SIP Calculator with inflation-adjusted projections" },
      { type: "tool", text: "CAGR Calculator" },
      { type: "tool", text: "GST Calculator — inclusive and exclusive modes" },
      { type: "tool", text: "Compound Interest Calculator" },
      { type: "tool", text: "FD / RD Maturity Calculator" },
      { type: "seo", text: "Organization JSON-LD schema on homepage" },
      { type: "seo", text: "WebSite JSON-LD schema with Sitelinks Searchbox on homepage" },
    ],
  },

  {
    version: "v1.4.0",
    date: "October 2025",
    summary:
      "Developer Tools expanded to 20+ tools. Web Workers introduced for non-blocking computation on large inputs.",
    changes: [
      { type: "tool", text: "JSON Formatter & Validator with collapsible tree view" },
      { type: "tool", text: "JSON Diff — compare two JSON objects side by side" },
      { type: "tool", text: "Base64 Encoder / Decoder" },
      { type: "tool", text: "Regex Tester with real-time match highlighting and group capture" },
      { type: "tool", text: "Hash Generator — MD5, SHA-1, SHA-256, SHA-512, bcrypt" },
      { type: "tool", text: "JWT Decoder" },
      { type: "tool", text: "CRON Expression Generator with human-readable preview" },
      { type: "tool", text: "UUID / ULID Generator" },
      { type: "tool", text: "CIDR / Subnet Calculator" },
      { type: "tool", text: "URL Encoder / Decoder" },
      { type: "tool", text: "HTML Entity Encoder" },
      { type: "tool", text: "SQL Formatter" },
      { type: "perf", text: "Web Workers for hash generation and JSON processing — UI stays responsive with 10MB+ inputs" },
      { type: "bug", text: "Fixed regex tester crashing on catastrophic backtracking patterns with timeout guard" },
    ],
  },

  {
    version: "v1.3.0",
    date: "September 2025",
    summary:
      "Image Tools expanded with modern format support — WebP, AVIF, HEIC. Web Workers for large image processing added.",
    changes: [
      { type: "tool", text: "WebP Converter — to/from PNG, JPG, GIF" },
      { type: "tool", text: "HEIC to JPG Converter" },
      { type: "tool", text: "AVIF Converter" },
      { type: "tool", text: "Image Compressor with quality slider and before/after preview" },
      { type: "tool", text: "Background Remover" },
      { type: "tool", text: "Social Media Image Resizer — Instagram, Twitter, LinkedIn, YouTube presets" },
      { type: "tool", text: "EXIF Metadata Viewer & Remover" },
      { type: "tool", text: "Image to Base64 Converter" },
      { type: "tool", text: "Favicon Generator — multi-size ICO and PNG output" },
      { type: "perf", text: "Web Workers for image processing — converts large images without freezing the browser tab" },
      { type: "perf", text: "Progressive preview — renders conversion result as it processes, not on full completion" },
      { type: "bug", text: "Fixed HEIC conversion failing on files without embedded colour profiles" },
      { type: "bug", text: "Fixed EXIF data not being stripped from JPEG output in Image Compressor" },
    ],
  },

  {
    version: "v1.2.0",
    date: "July 2025",
    summary:
      "PDF Tools category launched — 14 client-side PDF utilities, all running in-browser with no file uploads.",
    changes: [
      { type: "tool", text: "PDF Compressor — lossy and lossless modes with size preview" },
      { type: "tool", text: "PDF Merger — drag-and-drop page reordering" },
      { type: "tool", text: "PDF Splitter — by page range or every N pages" },
      { type: "tool", text: "PDF to Word Converter" },
      { type: "tool", text: "PDF to Images — JPG/PNG per page" },
      { type: "tool", text: "Images to PDF" },
      { type: "tool", text: "OCR PDF — text extraction from scanned documents" },
      { type: "tool", text: "Watermark PDF — text and image watermarks" },
      { type: "tool", text: "Rotate PDF Pages" },
      { type: "tool", text: "PDF Password Remover" },
      { type: "tool", text: "PDF Page Number Adder" },
      { type: "tool", text: "PDF Metadata Editor" },
      { type: "perf", text: "All PDF operations client-side using pdf-lib and PDF.js — no server uploads, no processing wait" },
      { type: "infra", text: "PDF.js worker bundled with the application for OCR and page rendering" },
    ],
  },

  {
    version: "v1.1.0",
    date: "June 2025",
    summary:
      "Text Tools, Unit Converters, Color Tools, and CSS utilities added. Navigation and tool search launched.",
    changes: [
      { type: "tool", text: "Word Counter & Character Counter" },
      { type: "tool", text: "Case Converter — UPPER, lower, Title, Sentence, camelCase, kebab-case" },
      { type: "tool", text: "Lorem Ipsum Generator" },
      { type: "tool", text: "Duplicate Line Remover" },
      { type: "tool", text: "Slug / URL Generator" },
      { type: "tool", text: "Text Encryption / Decryption — AES-256" },
      { type: "tool", text: "Length, Weight, Temperature, Area, Speed, Storage unit converters" },
      { type: "tool", text: "CSS Grid Generator" },
      { type: "tool", text: "Flexbox Builder" },
      { type: "tool", text: "CSS Gradient Generator" },
      { type: "tool", text: "Tailwind Colour Picker" },
      { type: "tool", text: "Contrast Checker — WCAG AA / AAA rating" },
      { type: "tool", text: "REM / PX Converter" },
      { type: "design", text: "Category pages with tool grid, category description, and related categories" },
      { type: "design", text: "Site-wide tool search — instant fuzzy search across all tool names and tags" },
    ],
  },

  {
    version: "v1.0.0",
    codename: "Launch",
    date: "May 2025",
    isMajor: true,
    summary:
      "AllConverter.tools launched publicly with 50+ tools across PDF, Image, and Developer categories.",
    highlight:
      "Public launch — a privacy-first, browser-based utility platform. No accounts, no uploads, no watermarks, no paywalls.",
    changes: [
      { type: "feature", text: "50+ tools at launch across PDF, Image, Text, and Developer categories" },
      { type: "feature", text: "Privacy-first architecture — all processing client-side, no file uploads to servers" },
      { type: "feature", text: "No-account model — all tools open and run instantly without registration" },
      { type: "design", text: "Responsive design — desktop, tablet, and mobile" },
      { type: "design", text: "Tool directory with category navigation and tag filtering" },
      { type: "infra", text: "Built on Next.js + Tailwind CSS, deployed to Hostinger" },
      { type: "infra", text: "Google Analytics 4 for usage insights (no personal data)" },
    ],
  },
];

export const roadmap = {
  planned: [
    { text: "Batch file processing — convert or compress multiple files in one operation", priority: "high" as const },
    { text: "AI Resume Analyzer — score and improve resumes against job descriptions", priority: "high" as const },
    { text: "Advanced site search — filters by category, input type, and file format", priority: "high" as const },
    { text: "Progressive Web App (PWA) — install tools for offline access", priority: "medium" as const },
    { text: "More AI writing tools — proposal generator, performance review writer, job description writer", priority: "medium" as const },
    { text: "Additional Indian tax and finance calculators", priority: "medium" as const },
    { text: "WCAG 2.1 AA accessibility audit across all tools", priority: "medium" as const },
    { text: "Dark mode refinements — improved contrast across all tool interfaces", priority: "low" as const },
  ],
  inProgress: [
    { text: "Blog expansion — target 100+ articles across all 9 categories" },
    { text: "Lighthouse performance audit and Core Web Vitals improvements" },
    { text: "Mobile UX improvements across form-heavy tools" },
    { text: "Additional AI tools — AI LinkedIn post generator, AI job description writer" },
  ],
  completed: [
    { text: "250+ free tools across 12 categories" },
    { text: "Blog architecture — 9 categories, 33 articles, structured data on every page" },
    { text: "Auto-generated FAQs and tool introductions for all tool pages" },
    { text: "Full JSON-LD structured data — Article, FAQPage, HowTo, BreadcrumbList, SoftwareApplication" },
    { text: "Dark mode with OS preference detection and manual toggle" },
    { text: "Legal & compliance pages — Privacy, Terms, Cookies, Disclaimer, Security" },
    { text: "Google AdSense — sidebar, in-article, and mobile anchor placements" },
    { text: "Founder & Mission section — E-E-A-T and transparency improvements" },
    { text: "XML sitemap and robots.txt" },
    { text: "Audio Tools category — 10+ tools" },
    { text: "Business Tools category — 25+ tools including GST invoice and NDA" },
    { text: "AI Tools category — 15+ tools, no API key required" },
    { text: "Static export — all 319 pages pre-rendered at build time" },
  ],
};
