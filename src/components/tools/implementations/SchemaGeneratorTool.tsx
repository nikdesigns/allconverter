"use client";

import { useState } from "react";
import { Copy, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SchemaType = "faq" | "article" | "product" | "organization" | "local-business";

interface FaqPair { q: string; a: string }

function buildFaq(pairs: FaqPair[], pageUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pairs.filter(p => p.q && p.a).map(p => ({
      "@type": "Question",
      "name": p.q,
      "acceptedAnswer": { "@type": "Answer", "text": p.a }
    })),
    ...(pageUrl ? { "url": pageUrl } : {})
  };
}

function buildArticle(f: Record<string, string>): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": f.headline || "Article Title",
    "description": f.description || "",
    "author": { "@type": "Person", "name": f.author || "Author Name" },
    "publisher": {
      "@type": "Organization",
      "name": f.publisher || "Publisher Name",
      "logo": { "@type": "ImageObject", "url": f.logoUrl || "https://example.com/logo.png" }
    },
    "datePublished": f.datePublished || new Date().toISOString().split("T")[0],
    "dateModified": f.dateModified || new Date().toISOString().split("T")[0],
    "image": f.image || "https://example.com/image.jpg",
    "url": f.url || "https://example.com/article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": f.url || "https://example.com/article" }
  };
}

function buildProduct(f: Record<string, string>): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": f.name || "Product Name",
    "description": f.description || "Product description",
    "image": f.image || "https://example.com/product.jpg",
    "brand": { "@type": "Brand", "name": f.brand || "Brand Name" },
    "sku": f.sku || "SKU-001",
    "offers": {
      "@type": "Offer",
      "priceCurrency": f.currency || "USD",
      "price": f.price || "0",
      "availability": "https://schema.org/InStock",
      "url": f.url || "https://example.com/product"
    },
    ...(f.rating && f.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": f.rating,
        "reviewCount": f.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    } : {})
  };
}

function buildOrganization(f: Record<string, string>): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": f.name || "Organization Name",
    "url": f.url || "https://example.com",
    "logo": f.logo || "https://example.com/logo.png",
    "description": f.description || "Organization description",
    ...(f.email ? { "email": f.email } : {}),
    ...(f.phone ? { "telephone": f.phone } : {}),
    ...(f.twitter ? { "sameAs": [`https://twitter.com/${f.twitter}`] } : {}),
    "address": f.address ? { "@type": "PostalAddress", "streetAddress": f.address } : undefined
  };
}

function buildLocalBusiness(f: Record<string, string>): object {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": f.name || "Business Name",
    "description": f.description || "",
    "url": f.url || "https://example.com",
    "telephone": f.phone || "+1-555-555-5555",
    "email": f.email || "info@example.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": f.street || "123 Main St",
      "addressLocality": f.city || "City",
      "addressRegion": f.state || "State",
      "postalCode": f.zip || "10001",
      "addressCountry": f.country || "US"
    },
    "geo": (f.lat && f.lng) ? {
      "@type": "GeoCoordinates",
      "latitude": f.lat,
      "longitude": f.lng
    } : undefined,
    "openingHoursSpecification": f.hours ? [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }] : undefined,
    ...(f.rating && f.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": f.rating,
        "reviewCount": f.reviewCount
      }
    } : {})
  };
}

const TYPES: { id: SchemaType; label: string; desc: string }[] = [
  { id: "faq",           label: "FAQ",            desc: "FAQPage schema for Q&A content" },
  { id: "article",       label: "Article",        desc: "Blog post or news article" },
  { id: "product",       label: "Product",        desc: "E-commerce product listing" },
  { id: "organization",  label: "Organization",   desc: "Company or brand identity" },
  { id: "local-business",label: "Local Business", desc: "Physical store or service area" },
];

export function SchemaGeneratorTool() {
  const [type, setType] = useState<SchemaType>("faq");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [faqs, setFaqs] = useState<FaqPair[]>([{ q: "", a: "" }, { q: "", a: "" }]);
  const [output, setOutput] = useState("");

  const set = (k: string, v: string) => setFields(f => ({ ...f, [k]: v }));

  const generate = () => {
    let schema: object;
    if (type === "faq") schema = buildFaq(faqs, fields.url ?? "");
    else if (type === "article") schema = buildArticle(fields);
    else if (type === "product") schema = buildProduct(fields);
    else if (type === "organization") schema = buildOrganization(fields);
    else schema = buildLocalBusiness(fields);

    const cleaned = JSON.parse(JSON.stringify(schema));
    setOutput(JSON.stringify(cleaned, null, 2));
  };

  const copy = () => {
    navigator.clipboard.writeText(
      `<script type="application/ld+json">\n${output}\n</script>`
    );
    toast.success("Copied with <script> tags!");
  };

  const copyRaw = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied JSON!");
  };

  const field = (label: string, key: string, placeholder?: string, hint?: string) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <Input value={fields[key] ?? ""} onChange={e => set(key, e.target.value)}
        placeholder={placeholder} className="text-sm h-9" />
      {hint && <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Code2 className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Schema Markup Generator</span>
        <span className="ml-auto text-[10px] text-muted-foreground">JSON-LD / Schema.org</span>
      </div>

      <div className="p-5 space-y-5">

        {/* Type selector */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Schema Type</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button key={t.id} onClick={() => { setType(t.id); setOutput(""); setFields({}); }}
                className={cn("px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
                  type === t.id
                    ? "border-primary/50 bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )} title={t.desc}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form fields per type */}
        <div className="space-y-3">
          {type === "faq" && (
            <>
              {field("Page URL (optional)", "url", "https://example.com/faq-page")}
              <div className="space-y-3">
                <label className="text-xs text-muted-foreground block">Questions & Answers</label>
                {faqs.map((pair, i) => (
                  <div key={i} className="rounded-xl border border-border/60 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">FAQ #{i + 1}</span>
                      {faqs.length > 2 && (
                        <button onClick={() => setFaqs(f => f.filter((_, j) => j !== i))}
                          className="text-[10px] text-rose-400 hover:text-rose-300">Remove</button>
                      )}
                    </div>
                    <Input value={pair.q} onChange={e => setFaqs(f => f.map((p, j) => j === i ? { ...p, q: e.target.value } : p))}
                      placeholder="What is your question?" className="text-sm h-9" />
                    <Textarea value={pair.a} onChange={e => setFaqs(f => f.map((p, j) => j === i ? { ...p, a: e.target.value } : p))}
                      placeholder="Provide a clear and concise answer…" className="text-sm min-h-[70px] resize-none" />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="h-8 text-xs"
                  onClick={() => setFaqs(f => [...f, { q: "", a: "" }])}>
                  + Add FAQ
                </Button>
              </div>
            </>
          )}

          {type === "article" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field("Headline *", "headline", "Your article title")}
              {field("Article URL *", "url", "https://example.com/article")}
              {field("Author Name *", "author", "Jane Doe")}
              {field("Publisher Name *", "publisher", "My Blog")}
              {field("Date Published", "datePublished", "2024-01-15")}
              {field("Date Modified", "dateModified", "2024-01-20")}
              {field("Featured Image URL", "image", "https://example.com/image.jpg")}
              {field("Publisher Logo URL", "logoUrl", "https://example.com/logo.png")}
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                <Textarea value={fields.description ?? ""} onChange={e => set("description", e.target.value)}
                  placeholder="Brief article description (150-160 chars recommended)…"
                  className="text-sm min-h-[70px] resize-none" />
              </div>
            </div>
          )}

          {type === "product" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field("Product Name *", "name", "My Product")}
              {field("Product URL *", "url", "https://example.com/product")}
              {field("Brand", "brand", "Brand Name")}
              {field("SKU", "sku", "PROD-001")}
              {field("Price *", "price", "29.99")}
              {field("Currency", "currency", "USD")}
              {field("Image URL", "image", "https://example.com/product.jpg")}
              {field("Average Rating (1-5)", "rating", "4.5")}
              {field("Review Count", "reviewCount", "128")}
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                <Textarea value={fields.description ?? ""} onChange={e => set("description", e.target.value)}
                  placeholder="Product description…" className="text-sm min-h-[70px] resize-none" />
              </div>
            </div>
          )}

          {type === "organization" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field("Organization Name *", "name", "Acme Corp")}
              {field("Website URL *", "url", "https://acme.com")}
              {field("Logo URL", "logo", "https://acme.com/logo.png")}
              {field("Email", "email", "info@acme.com")}
              {field("Phone", "phone", "+1-800-123-4567")}
              {field("Twitter Handle", "twitter", "acmecorp")}
              <div className="sm:col-span-2">
                {field("Street Address", "address", "123 Main St, New York, NY 10001")}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                <Textarea value={fields.description ?? ""} onChange={e => set("description", e.target.value)}
                  placeholder="Short company description…" className="text-sm min-h-[60px] resize-none" />
              </div>
            </div>
          )}

          {type === "local-business" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field("Business Name *", "name", "Joe's Plumbing")}
              {field("Website URL", "url", "https://example.com")}
              {field("Phone *", "phone", "+1-555-123-4567")}
              {field("Email", "email", "hello@example.com")}
              {field("Street Address *", "street", "123 Main St")}
              {field("City *", "city", "New York")}
              {field("State / Region", "state", "NY")}
              {field("Postal Code", "zip", "10001")}
              {field("Country Code", "country", "US")}
              {field("Latitude", "lat", "40.7128")}
              {field("Longitude", "lng", "-74.0060")}
              {field("Rating (1-5)", "rating", "4.7")}
              {field("Review Count", "reviewCount", "256")}
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                <Textarea value={fields.description ?? ""} onChange={e => set("description", e.target.value)}
                  placeholder="Brief business description…" className="text-sm min-h-[60px] resize-none" />
              </div>
            </div>
          )}
        </div>

        <Button onClick={generate} className="w-full gap-2">
          <Code2 className="w-4 h-4" /> Generate Schema
        </Button>

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Generated JSON-LD</span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={copyRaw} className="h-6 text-xs gap-1">
                  <Copy className="w-3 h-3" /> JSON
                </Button>
                <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1">
                  <Copy className="w-3 h-3" /> with &lt;script&gt;
                </Button>
              </div>
            </div>
            <pre className="rounded-xl bg-muted/20 border border-border p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {`<script type="application/ld+json">\n${output}\n</script>`}
            </pre>
            <p className="text-xs text-muted-foreground">
              Paste this inside your page&apos;s <code>&lt;head&gt;</code> or <code>&lt;body&gt;</code>.
              Test with <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google&apos;s Rich Results Test</a>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
