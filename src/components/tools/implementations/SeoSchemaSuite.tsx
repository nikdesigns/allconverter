"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Copy, Plus, Trash2, Search, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function copy(text: string) { navigator.clipboard.writeText(text); toast.success("Copied!"); }

function SchemaBlock({ json }: { json: object }) {
  const code = JSON.stringify(json, null, 2);
  return (
    <div className="space-y-2">
      <div className="relative">
        <pre className="rounded-xl border border-border bg-muted/10 p-4 text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto">{code}</pre>
        <Button size="sm" variant="ghost" onClick={() => copy(code)} className="absolute top-2 right-2 h-6 text-xs gap-1">
          <Copy className="w-3 h-3" />Copy JSON-LD
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Wrap with: <code className="bg-muted/30 px-1 rounded">{"<script type=\"application/ld+json\">"}{"\n"}{"/script>"}</code>
      </div>
    </div>
  );
}

// ─── FAQ Schema Generator ─────────────────────────────────────────────────────

function FaqSchemaGenerator() {
  const [items, setItems] = useState([{ q: "", a: "" }]);

  const add = () => setItems(p => [...p, { q: "", a: "" }]);
  const del = (i: number) => setItems(p => p.filter((_, j) => j !== i));
  const upd = (i: number, k: "q" | "a", v: string) => setItems(p => p.map((it, j) => j === i ? { ...it, [k]: v } : it));

  const valid = items.filter(it => it.q.trim() && it.a.trim());
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map(it => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a }
    }))
  };

  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Q&A #{i + 1}</span>
            {items.length > 1 && <button onClick={() => del(i)} className="text-muted-foreground hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
          <Input value={it.q} onChange={e => upd(i, "q", e.target.value)} placeholder="Question" className="h-9 text-sm" />
          <Textarea value={it.a} onChange={e => upd(i, "a", e.target.value)} placeholder="Answer" className="text-sm min-h-[70px]" />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1 text-xs"><Plus className="w-3 h-3" />Add Q&A</Button>
      {valid.length > 0 && <SchemaBlock json={schema} />}
    </div>
  );
}

// ─── Article Schema Generator ─────────────────────────────────────────────────

function ArticleSchemaGenerator() {
  const [type, setType] = useState<"Article"|"BlogPosting"|"NewsArticle">("Article");
  const [f, setF] = useState({ headline:"", description:"", author:"", url:"", imageUrl:"", datePublished:"", dateModified:"", publisher:"", publisherLogo:"" });
  const upd = (k: keyof typeof f, v: string) => setF(p => ({ ...p, [k]: v }));

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    ...(f.headline && { headline: f.headline }),
    ...(f.description && { description: f.description }),
    ...(f.url && { url: f.url }),
    ...(f.imageUrl && { image: f.imageUrl }),
    ...(f.datePublished && { datePublished: f.datePublished }),
    ...(f.dateModified && { dateModified: f.dateModified }),
    ...(f.author && { author: { "@type": "Person", name: f.author } }),
    ...((f.publisher || f.publisherLogo) && {
      publisher: { "@type": "Organization", name: f.publisher || "Publisher", ...(f.publisherLogo && { logo: { "@type": "ImageObject", url: f.publisherLogo } }) }
    }),
  };

  const fields: { k: keyof typeof f; label: string; type?: string }[] = [
    { k:"headline",      label:"Headline / Title" },
    { k:"description",   label:"Description" },
    { k:"author",        label:"Author name" },
    { k:"url",           label:"Page URL" },
    { k:"imageUrl",      label:"Featured image URL" },
    { k:"datePublished", label:"Date published", type:"date" },
    { k:"dateModified",  label:"Date modified",  type:"date" },
    { k:"publisher",     label:"Publisher name" },
    { k:"publisherLogo", label:"Publisher logo URL" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["Article","BlogPosting","NewsArticle"] as const).map(t => (
          <button key={t} onClick={() => setType(t)}
            className={cn("px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
              type === t ? "border-primary/50 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {fields.map(f2 => (
          <div key={f2.k} className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">{f2.label}</label>
            <Input type={f2.type ?? "text"} value={f[f2.k]} onChange={e => upd(f2.k, e.target.value)} className="h-8 text-xs" />
          </div>
        ))}
      </div>
      {f.headline && <SchemaBlock json={schema} />}
    </div>
  );
}

// ─── Organization Schema Generator ───────────────────────────────────────────

function OrganizationSchemaGenerator() {
  const [f, setF] = useState({ name:"", url:"", logo:"", description:"", phone:"", email:"", street:"", city:"", state:"", country:"", postalCode:"" });
  const [socials, setSocials] = useState<string[]>([""]);
  const upd = (k: keyof typeof f, v: string) => setF(p => ({ ...p, [k]: v }));

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    ...(f.name && { name: f.name }),
    ...(f.url && { url: f.url }),
    ...(f.logo && { logo: f.logo }),
    ...(f.description && { description: f.description }),
    ...(f.phone && { telephone: f.phone }),
    ...(f.email && { email: f.email }),
    ...((f.street || f.city) && {
      address: {
        "@type": "PostalAddress",
        ...(f.street && { streetAddress: f.street }),
        ...(f.city && { addressLocality: f.city }),
        ...(f.state && { addressRegion: f.state }),
        ...(f.country && { addressCountry: f.country }),
        ...(f.postalCode && { postalCode: f.postalCode }),
      }
    }),
    ...(socials.filter(Boolean).length > 0 && { sameAs: socials.filter(Boolean) }),
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          {k:"name",label:"Organization name"},{k:"url",label:"Website URL"},{k:"logo",label:"Logo URL"},
          {k:"description",label:"Description"},{k:"phone",label:"Phone"},{k:"email",label:"Email"},
          {k:"street",label:"Street address"},{k:"city",label:"City"},{k:"state",label:"State/Region"},
          {k:"country",label:"Country (2-letter)"},{k:"postalCode",label:"Postal code"},
        ].map((f2) => (
          <div key={f2.k} className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">{f2.label}</label>
            <Input value={f[f2.k as keyof typeof f]} onChange={e => upd(f2.k as keyof typeof f, e.target.value)} className="h-8 text-xs" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Social profiles (sameAs)</span>
          <Button variant="ghost" size="sm" onClick={() => setSocials(p => [...p,""])} className="h-6 text-xs gap-1"><Plus className="w-3 h-3" />Add</Button>
        </div>
        {socials.map((s,i) => (
          <div key={i} className="flex gap-2">
            <Input value={s} onChange={e => setSocials(p => p.map((x,j)=>j===i?e.target.value:x))} placeholder="https://twitter.com/yourbrand" className="flex-1 h-8 text-xs" />
            {socials.length > 1 && <button onClick={() => setSocials(p=>p.filter((_,j)=>j!==i))} className="text-muted-foreground hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
        ))}
      </div>
      {f.name && <SchemaBlock json={schema} />}
    </div>
  );
}

// ─── Redirect Checker ─────────────────────────────────────────────────────────

interface Hop { url: string; status: number; type: string; }

function RedirectChecker() {
  const [url, setUrl]       = useState("");
  const [hops, setHops]     = useState<Hop[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const check = async () => {
    const u = url.trim();
    if (!u) return;
    setLoading(true); setError(""); setHops(null);
    try {
      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(u)}&followRedirects=true&timeout=15000`);
      const data = await res.json();
      if (data.status !== "success") { setError("Could not check URL. Ensure it is publicly accessible."); return; }

      const chain: Hop[] = [];
      const finalUrl = data.data?.url ?? u;
      if (finalUrl !== u) {
        chain.push({ url: u,        status: 301, type: "Redirect" });
        chain.push({ url: finalUrl, status: 200, type: "Final destination" });
      } else {
        chain.push({ url: u, status: 200, type: "No redirect — direct hit" });
      }
      setHops(chain);
    } catch { setError("Failed to check redirects. The URL may be blocking external requests."); }
    finally { setLoading(false); }
  };

  const statusColor = (s: number) => s < 300 ? "text-emerald-400" : s < 400 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key==="Enter"&&check()}
          placeholder="https://example.com/old-url" className="h-10 text-sm" />
        <Button onClick={check} disabled={!url.trim() || loading} className="h-10 shrink-0 gap-1.5 px-4">
          <Search className="w-3.5 h-3.5" /> Check
        </Button>
      </div>

      {loading && <div className="text-center py-4 text-muted-foreground text-sm">Following redirects…</div>}
      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}

      {hops && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">{hops.length - 1} redirect{hops.length !== 2 ? "s" : ""} found</div>
          {hops.map((h, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl border border-border">
              <div className={cn("text-sm font-bold shrink-0 w-8", statusColor(h.status))}>{h.status}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">{h.type}</div>
                <div className="text-sm font-mono truncate cursor-pointer hover:text-primary" onClick={() => copy(h.url)}>{h.url}</div>
              </div>
              {i < hops.length - 1 && <div className="text-muted-foreground text-xs mt-1">↓</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Canonical Tag Checker ────────────────────────────────────────────────────

// Tries two CORS proxies in sequence; returns raw HTML text or throws.
async function fetchHtml(targetUrl: string): Promise<{ html: string; finalUrl: string }> {
  const proxies = [
    (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  ];
  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy(targetUrl), { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      const html = await res.text();
      if (html.length > 100) return { html, finalUrl: res.url.includes("?url=") ? targetUrl : res.url };
    } catch { /* try next */ }
  }
  throw new Error("Could not fetch URL.");
}

function parseCanonical(html: string): string {
  // Use DOMParser when available (browser), regex as fallback
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
  } catch {
    const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
           ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    return m?.[1] ?? "";
  }
}

function normalise(u: string) {
  try { const p = new URL(u); p.search = ""; p.hash = ""; return p.href.replace(/\/$/, "").toLowerCase(); }
  catch { return u.toLowerCase().replace(/\/$/, ""); }
}

function CanonicalTagChecker() {
  const [url, setUrl]     = useState("");
  const [result, setResult] = useState<{ canonical: string; isSelf: boolean; found: boolean; finalUrl: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    const u = url.trim();
    if (!u) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const { html, finalUrl } = await fetchHtml(u);
      const canonical = parseCanonical(html);
      const isSelf = !!canonical && normalise(canonical) === normalise(u);
      setResult({ canonical, found: !!canonical, isSelf, finalUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch. The page may be blocking external requests.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key==="Enter"&&check()}
          placeholder="https://example.com/page" className="h-10 text-sm" />
        <Button onClick={check} disabled={!url.trim() || loading} className="h-10 shrink-0 gap-1.5 px-4">
          <Search className="w-3.5 h-3.5" /> Check
        </Button>
      </div>

      {loading && <div className="text-center py-4 text-muted-foreground text-sm">Fetching page metadata…</div>}
      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}

      {result && (
        <div className="space-y-3">
          {result.found ? (
            <div className={cn("flex items-start gap-2 rounded-xl border p-3",
              result.isSelf ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5")}>
              {result.isSelf
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                : <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />}
              <div>
                <div className={cn("text-sm font-medium", result.isSelf ? "text-emerald-400" : "text-amber-400")}>
                  {result.isSelf ? "Self-referencing canonical (correct)" : "Points to a different URL"}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">The canonical tag was found on this page.</div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
              <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-rose-400">No canonical tag found</div>
                <div className="text-xs text-muted-foreground mt-0.5">Add a canonical tag to prevent duplicate content issues.</div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border overflow-hidden">
            {[
              { label: "Checked URL", value: url },
              { label: "Final URL (after redirects)", value: result.finalUrl },
              { label: "Canonical tag value", value: result.canonical || "Not found" },
              { label: "Status", value: !result.found ? "Missing" : result.isSelf ? "Self-referencing ✓" : "Cross-page canonical" },
            ].map((row, i) => (
              <div key={row.label} className={cn("flex flex-col sm:flex-row sm:items-center gap-1 px-4 py-2.5 text-xs", i%2===0?"bg-background":"bg-muted/10")}>
                <span className="text-muted-foreground w-40 shrink-0">{row.label}</span>
                <span className="font-mono break-all cursor-pointer hover:text-primary" onClick={()=>copy(row.value)}>{row.value}</span>
              </div>
            ))}
          </div>

          {result.found && (
            <pre className="rounded-xl border border-border bg-muted/10 p-3 text-xs font-mono overflow-x-auto">{`<link rel="canonical" href="${result.canonical}" />`}</pre>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Suite Router ─────────────────────────────────────────────────────────────

const TOOLS: Record<string, { title: string; component: React.ComponentType }> = {
  "faq-schema-generator":          { title: "FAQ Schema Generator",          component: FaqSchemaGenerator },
  "article-schema-generator":      { title: "Article Schema Generator",      component: ArticleSchemaGenerator },
  "organization-schema-generator": { title: "Organization Schema Generator", component: OrganizationSchemaGenerator },
  "redirect-checker":              { title: "Redirect Checker",              component: RedirectChecker },
  "canonical-tag-checker":         { title: "Canonical Tag Checker",         component: CanonicalTagChecker },
};

export function SeoSchemaSuite() {
  const pathname = usePathname();
  const slug = pathname.split("/tools/")[1]?.replace(/\/$/, "") ?? "";
  const tool = TOOLS[slug];
  if (!tool) return <div className="p-6 text-muted-foreground text-sm">Tool not found.</div>;
  const Component = tool.component;
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">
        <Component />
      </div>
    </div>
  );
}
