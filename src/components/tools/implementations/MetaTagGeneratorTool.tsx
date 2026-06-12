"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Tag } from "lucide-react";
import { toast } from "sonner";

export function MetaTagGeneratorTool() {
  const [form, setForm] = useState({
    title: "My Awesome Page Title",
    description: "A compelling description of this page that makes users want to click through from search results.",
    keywords: "keyword1, keyword2, keyword3",
    author: "",
    url: "https://example.com/page",
    image: "https://example.com/og-image.jpg",
    siteName: "My Website",
    twitterHandle: "@mysite",
    type: "website",
    locale: "en_US",
    robots: "index, follow",
    viewport: "width=device-width, initial-scale=1",
    charset: "UTF-8",
    theme: "#6366f1",
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const generated = `<!-- Primary Meta Tags -->
<meta charset="${form.charset}">
<meta name="viewport" content="${form.viewport}">
<title>${form.title}</title>
<meta name="title" content="${form.title}">
<meta name="description" content="${form.description}">
${form.keywords ? `<meta name="keywords" content="${form.keywords}">` : ""}
${form.author ? `<meta name="author" content="${form.author}">` : ""}
<meta name="robots" content="${form.robots}">
<meta name="theme-color" content="${form.theme}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${form.type}">
<meta property="og:url" content="${form.url}">
<meta property="og:title" content="${form.title}">
<meta property="og:description" content="${form.description}">
${form.image ? `<meta property="og:image" content="${form.image}">` : ""}
${form.siteName ? `<meta property="og:site_name" content="${form.siteName}">` : ""}
${form.locale ? `<meta property="og:locale" content="${form.locale}">` : ""}

<!-- Twitter Card -->
<meta property="twitter:card" content="summary_large_image">
${form.twitterHandle ? `<meta property="twitter:site" content="${form.twitterHandle}">` : ""}
<meta property="twitter:url" content="${form.url}">
<meta property="twitter:title" content="${form.title}">
<meta property="twitter:description" content="${form.description}">
${form.image ? `<meta property="twitter:image" content="${form.image}">` : ""}

<!-- Canonical -->
<link rel="canonical" href="${form.url}">`.replace(/\n{3,}/g, "\n\n").trim();

  const copy = () => { navigator.clipboard.writeText(generated); toast.success("Meta tags copied!"); };

  const titleLen = form.title.length;
  const descLen = form.description.length;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Tag className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Meta Tag Generator</span>
      </div>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">Page Title *</label>
              <span className={`text-xs ${titleLen > 60 ? "text-amber-500" : "text-muted-foreground"}`}>{titleLen}/60</span>
            </div>
            <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Your page title" />
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">Meta Description *</label>
              <span className={`text-xs ${descLen > 160 ? "text-amber-500" : "text-muted-foreground"}`}>{descLen}/160</span>
            </div>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="A compelling description for search engines…" className="resize-none min-h-[80px] text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Keywords (comma-separated)</label>
            <Input value={form.keywords} onChange={e => set("keywords", e.target.value)} placeholder="seo, tools, free" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Author</label>
            <Input value={form.author} onChange={e => set("author", e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Page URL</label>
            <Input value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://example.com/page" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">OG Image URL</label>
            <Input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Site Name</label>
            <Input value={form.siteName} onChange={e => set("siteName", e.target.value)} placeholder="My Website" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Twitter Handle</label>
            <Input value={form.twitterHandle} onChange={e => set("twitterHandle", e.target.value)} placeholder="@handle" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Robots</label>
            <select value={form.robots} onChange={e => set("robots", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              <option>index, follow</option>
              <option>noindex, follow</option>
              <option>index, nofollow</option>
              <option>noindex, nofollow</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">OG Type</label>
            <select value={form.type} onChange={e => set("type", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              <option>website</option>
              <option>article</option>
              <option>product</option>
              <option>profile</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium">Generated Meta Tags</label>
            <Button size="sm" onClick={copy} className="h-7 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
          </div>
          <Textarea readOnly value={generated} className="min-h-[280px] resize-none text-xs font-mono bg-muted/20" />
        </div>
      </div>
    </div>
  );
}
