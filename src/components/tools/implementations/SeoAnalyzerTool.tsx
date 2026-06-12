"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Search, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type Status = "good" | "warn" | "bad";
interface Check { label: string; value: string; status: Status; tip: string; }

function statusIcon(s: Status) {
  if (s === "good") return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
  if (s === "warn") return <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />;
  return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
}

// ── Title Tag Checker ──────────────────────────────────────────────────────────
function TitleChecker() {
  const [title, setTitle] = useState("Best Running Shoes 2024 | ShoeStore");
  const len = title.length;
  const checks: Check[] = [
    { label: "Length", value: `${len} chars`, status: len >= 50 && len <= 60 ? "good" : len > 0 && len < 70 ? "warn" : "bad", tip: "50–60 characters is ideal" },
    { label: "Has brand/keyword", value: title.includes("|") || title.includes("-") || title.includes(":") ? "Yes" : "Maybe", status: title.length > 0 ? "good" : "bad", tip: "Include your brand or main keyword" },
    { label: "Title-case", value: title === title.trim() ? "No leading/trailing spaces" : "Has extra spaces", status: title === title.trim() ? "good" : "warn", tip: "Remove extra whitespace" },
  ];
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Title Tag</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} className="text-sm" />
        <p className="text-xs text-muted-foreground mt-1">{len} / 60 characters — {len > 60 ? "⚠️ Too long" : len < 30 ? "Too short" : "Good"}</p>
      </div>
      <div className="p-3 rounded-xl bg-muted/20 border border-border text-sm font-medium truncate text-primary">{title || "No title"}</div>
      <CheckList checks={checks} />
    </div>
  );
}

// ── Meta Description Checker ──────────────────────────────────────────────────
function DescChecker() {
  const [desc, setDesc] = useState("Find the best running shoes for all terrains. Shop our collection with free shipping and 30-day returns.");
  const len = desc.length;
  const checks: Check[] = [
    { label: "Length", value: `${len} chars`, status: len >= 150 && len <= 160 ? "good" : len > 0 && len <= 180 ? "warn" : "bad", tip: "150–160 characters is ideal" },
    { label: "Not empty", value: desc.trim() ? "Present" : "Missing", status: desc.trim() ? "good" : "bad", tip: "Always include a meta description" },
    { label: "Call to action", value: /shop|buy|learn|discover|find|get|try|start/i.test(desc) ? "Detected" : "Not found", status: /shop|buy|learn|discover|find|get|try|start/i.test(desc) ? "good" : "warn", tip: "Use action words to improve CTR" },
  ];
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Meta Description</label>
        <Textarea value={desc} onChange={e => setDesc(e.target.value)} className="text-sm min-h-[80px] resize-none" />
        <p className="text-xs text-muted-foreground mt-1">{len} / 160 characters</p>
      </div>
      <CheckList checks={checks} />
    </div>
  );
}

// ── UTM Builder ───────────────────────────────────────────────────────────────
function UtmBuilder() {
  const [url, setUrl] = useState("https://example.com/page");
  const [source, setSource] = useState("google");
  const [medium, setMedium] = useState("cpc");
  const [campaign, setCampaign] = useState("summer_sale");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");

  const encode = (s: string) => encodeURIComponent(s.trim());
  const params = [
    source && `utm_source=${encode(source)}`,
    medium && `utm_medium=${encode(medium)}`,
    campaign && `utm_campaign=${encode(campaign)}`,
    term && `utm_term=${encode(term)}`,
    content && `utm_content=${encode(content)}`,
  ].filter(Boolean).join("&");
  const result = url.trim() + (params ? (url.includes("?") ? "&" : "?") + params : "");
  const copy = () => { navigator.clipboard.writeText(result); toast.success("UTM URL copied!"); };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[["Website URL *","url",url,setUrl],["Campaign Source *","e.g. google, newsletter",source,setSource],["Campaign Medium *","e.g. cpc, email",medium,setMedium],["Campaign Name *","e.g. summer_sale",campaign,setCampaign],["Campaign Term","keyword",term,setTerm],["Campaign Content","ad variant",content,setContent]] .map(([label,placeholder,val,set]) => (
          <div key={label as string}>
            <label className="text-xs text-muted-foreground mb-1 block">{label as string}</label>
            <Input value={val as string} onChange={e => (set as (v:string)=>void)(e.target.value)} placeholder={placeholder as string} className="text-sm" />
          </div>
        ))}
      </div>
      {params && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Generated URL</label>
            <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
          </div>
          <div className="p-3 rounded-xl border border-border bg-muted/10 text-xs font-mono break-all">{result}</div>
        </div>
      )}
    </div>
  );
}

// ── SERP Snippet Preview ──────────────────────────────────────────────────────
function SerpPreview() {
  const [title, setTitle] = useState("Best Running Shoes 2024 | ShoeStore");
  const [url, setUrl] = useState("https://www.shoestore.com/running-shoes");
  const [desc, setDesc] = useState("Find the best running shoes for all terrains. Shop our collection with free shipping and 30-day returns. Top brands available.");
  const displayUrl = url.replace(/^https?:\/\//,"").replace(/\/$/,"");
  const displayDesc = desc.length > 155 ? desc.slice(0, 155) + "…" : desc;
  const displayTitle = title.length > 60 ? title.slice(0, 60) + "…" : title;
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <div><label className="text-xs text-muted-foreground mb-1 block">Page Title</label>
          <Input value={title} onChange={e=>setTitle(e.target.value)} className="text-sm" />
          <p className="text-xs text-muted-foreground mt-0.5">{title.length}/60</p></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Page URL</label>
          <Input value={url} onChange={e=>setUrl(e.target.value)} className="text-sm" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Meta Description</label>
          <Textarea value={desc} onChange={e=>setDesc(e.target.value)} className="text-sm min-h-[80px] resize-none" />
          <p className="text-xs text-muted-foreground mt-0.5">{desc.length}/155</p></div>
      </div>
      <div className="p-4 rounded-xl border border-border bg-white/5">
        <p className="text-xs text-muted-foreground mb-2">SERP Preview (Desktop)</p>
        <p className="text-sm text-[#1a0dab] dark:text-[#8ab4f8] font-medium cursor-pointer hover:underline mb-0.5">{displayTitle}</p>
        <p className="text-xs text-[#006621] dark:text-[#4db56b] mb-1">{displayUrl}</p>
        <p className="text-sm text-[#545454] dark:text-[#bdc1c6] leading-5">{displayDesc}</p>
      </div>
    </div>
  );
}

// ── Hreflang Generator ────────────────────────────────────────────────────────
const HREFLANG_LANGS = [
  {code:"en",name:"English"},{code:"en-US",name:"English (US)"},{code:"en-GB",name:"English (UK)"},
  {code:"es",name:"Spanish"},{code:"fr",name:"French"},{code:"de",name:"German"},
  {code:"it",name:"Italian"},{code:"pt",name:"Portuguese"},{code:"nl",name:"Dutch"},
  {code:"ja",name:"Japanese"},{code:"ko",name:"Korean"},{code:"zh",name:"Chinese"},
  {code:"ar",name:"Arabic"},{code:"ru",name:"Russian"},{code:"hi",name:"Hindi"},
];
function HreflangGen() {
  const [entries, setEntries] = useState([{lang:"en",url:"https://example.com/"},{lang:"es",url:"https://example.com/es/"}]);
  const addRow = () => setEntries(e => [...e, {lang:"fr",url:""}]);
  const removeRow = (i: number) => setEntries(e => e.filter((_,j)=>j!==i));
  const update = (i: number, field: "lang"|"url", val: string) => setEntries(e => e.map((r,j) => j===i?{...r,[field]:val}:r));
  const html = entries.filter(r=>r.url).map(r => `<link rel="alternate" hreflang="${r.lang}" href="${r.url}" />`).join("\n");
  const copy = () => { navigator.clipboard.writeText(html); toast.success("Copied!"); };
  return (
    <div className="space-y-3">
      {entries.map((row,i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="w-40">
            <label className="text-xs text-muted-foreground mb-1 block">Language</label>
            <select value={row.lang} onChange={e=>update(i,"lang",e.target.value)} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
              {HREFLANG_LANGS.map(l=><option key={l.code} value={l.code}>{l.code} – {l.name}</option>)}
              <option value="x-default">x-default</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">URL</label>
            <Input value={row.url} onChange={e=>update(i,"url",e.target.value)} className="text-sm" placeholder="https://…" />
          </div>
          <Button variant="ghost" size="sm" onClick={()=>removeRow(i)} className="text-red-400 h-10">✕</Button>
        </div>
      ))}
      <Button variant="outline" onClick={addRow} className="w-full text-sm">+ Add Language</Button>
      {html && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Generated hreflang tags</label>
            <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
          </div>
          <pre className="p-3 rounded-xl border border-border bg-muted/10 text-xs font-mono whitespace-pre-wrap break-all">{html}</pre>
        </div>
      )}
    </div>
  );
}

// ── Robots.txt Tester ─────────────────────────────────────────────────────────
function RobotsTester() {
  const [robots, setRobots] = useState(`User-agent: *\nDisallow: /admin/\nDisallow: /private/\nAllow: /\n\nSitemap: https://example.com/sitemap.xml`);
  const [testUrl, setTestUrl] = useState("/admin/page");
  const [userAgent, setUserAgent] = useState("*");

  const test = () => {
    const path = testUrl.startsWith("/") ? testUrl : "/" + testUrl;
    const blocks = robots.split(/\n\s*\n/);
    let applicable = false;
    let allowed = true;
    let matchedRule = "";
    for (const block of blocks) {
      const lines = block.split("\n").map(l => l.trim());
      const agents = lines.filter(l => l.toLowerCase().startsWith("user-agent:")).map(l => l.split(":")[1]?.trim());
      if (!agents.some(a => a === "*" || a.toLowerCase() === userAgent.toLowerCase())) continue;
      applicable = true;
      for (const line of lines) {
        if (line.toLowerCase().startsWith("disallow:")) {
          const rule = line.split(":")[1]?.trim();
          if (rule && path.startsWith(rule)) { allowed = false; matchedRule = `Disallow: ${rule}`; }
        }
        if (line.toLowerCase().startsWith("allow:")) {
          const rule = line.split(":")[1]?.trim();
          if (rule && path.startsWith(rule)) { allowed = true; matchedRule = `Allow: ${rule}`; }
        }
      }
    }
    return { allowed: !applicable ? true : allowed, matchedRule, applicable };
  };
  const r = testUrl ? test() : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">robots.txt content</label>
        <Textarea value={robots} onChange={e=>setRobots(e.target.value)} className="min-h-[160px] resize-none text-sm font-mono" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Test URL path</label>
          <Input value={testUrl} onChange={e=>setTestUrl(e.target.value)} className="text-sm font-mono" placeholder="/admin/page" />
        </div>
        <div className="w-40">
          <label className="text-xs text-muted-foreground mb-1 block">User-agent</label>
          <Input value={userAgent} onChange={e=>setUserAgent(e.target.value)} className="text-sm font-mono" />
        </div>
      </div>
      {r && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${r.allowed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
          {r.allowed ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          <div>
            <p className={`text-sm font-medium ${r.allowed ? "text-emerald-500" : "text-red-500"}`}>
              {r.allowed ? "Allowed" : "Blocked"}
            </p>
            {r.matchedRule && <p className="text-xs text-muted-foreground font-mono mt-0.5">Matched rule: {r.matchedRule}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Schema Validator ──────────────────────────────────────────────────────────
function SchemaValidator() {
  const SAMPLE = JSON.stringify({ "@context":"https://schema.org","@type":"Product","name":"Running Shoe","description":"A great shoe","brand":{"@type":"Brand","name":"ShoeStore"},"offers":{"@type":"Offer","price":"99.99","priceCurrency":"USD"} }, null, 2);
  const [input, setInput] = useState(SAMPLE);
  const [checks, setChecks] = useState<Check[]>([]);

  const validate = () => {
    const results: Check[] = [];
    try {
      const obj = JSON.parse(input);
      results.push({ label: "Valid JSON", value: "Yes", status: "good", tip: "JSON parses correctly" });
      const ctx = obj["@context"];
      results.push({ label: "@context", value: ctx ? String(ctx) : "Missing", status: ctx ? "good" : "bad", tip: 'Should be "https://schema.org"' });
      const type = obj["@type"];
      results.push({ label: "@type", value: type ? String(type) : "Missing", status: type ? "good" : "bad", tip: "Required — e.g. Product, Article, Person" });
      if (type === "Product") {
        results.push({ label: "name", value: obj.name ?? "Missing", status: obj.name ? "good" : "warn", tip: "Product name is recommended" });
        results.push({ label: "offers", value: obj.offers ? "Present" : "Missing", status: obj.offers ? "good" : "warn", tip: "Include offers for product rich results" });
      }
      if (type === "Article") {
        results.push({ label: "headline", value: obj.headline ?? "Missing", status: obj.headline ? "good" : "warn", tip: "Article headline is required" });
        results.push({ label: "author", value: obj.author ? "Present" : "Missing", status: obj.author ? "good" : "warn", tip: "Author is recommended" });
      }
    } catch (e) {
      results.push({ label: "Valid JSON", value: "No – " + (e as Error).message, status: "bad", tip: "Fix JSON syntax errors first" });
    }
    setChecks(results);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Schema markup (JSON-LD)</label>
        <Textarea value={input} onChange={e=>setInput(e.target.value)} className="min-h-[200px] resize-none text-xs font-mono" />
      </div>
      <Button onClick={validate} className="w-full gap-2"><Search className="w-4 h-4" />Validate Schema</Button>
      {checks.length > 0 && <CheckList checks={checks} />}
    </div>
  );
}

// ── Sitemap Validator ─────────────────────────────────────────────────────────
function SitemapValidator() {
  const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <priority>0.8</priority>
  </url>
</urlset>`;
  const [input, setInput] = useState(SAMPLE);
  const [checks, setChecks] = useState<Check[]>([]);

  const validate = () => {
    const results: Check[] = [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input.trim(), "text/xml");
      const err = doc.querySelector("parsererror");
      if (err) { results.push({ label: "Valid XML", value: "No", status: "bad", tip: "Fix XML syntax errors" }); setChecks(results); return; }
      results.push({ label: "Valid XML", value: "Yes", status: "good", tip: "" });
      const hasNs = input.includes("sitemaps.org");
      results.push({ label: "Namespace", value: hasNs ? "Present" : "Missing", status: hasNs ? "good" : "warn", tip: 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' });
      const urls = doc.querySelectorAll("url");
      results.push({ label: "URL count", value: String(urls.length), status: urls.length > 0 ? "good" : "bad", tip: "Sitemap should contain at least one URL" });
      results.push({ label: "Within limit", value: urls.length <= 50000 ? "Yes" : "No (>50k)", status: urls.length <= 50000 ? "good" : "bad", tip: "Max 50,000 URLs per sitemap" });
      const hasLoc = Array.from(urls).every(u => u.querySelector("loc")?.textContent?.trim());
      results.push({ label: "All <loc> present", value: hasLoc ? "Yes" : "No", status: hasLoc ? "good" : "bad", tip: "Every <url> must have a <loc>" });
    } catch { results.push({ label: "Parse error", value: "Failed", status: "bad", tip: "" }); }
    setChecks(results);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Sitemap XML</label>
        <Textarea value={input} onChange={e=>setInput(e.target.value)} className="min-h-[200px] resize-none text-xs font-mono" />
      </div>
      <Button onClick={validate} className="w-full gap-2"><Search className="w-4 h-4" />Validate Sitemap</Button>
      {checks.length > 0 && <CheckList checks={checks} />}
    </div>
  );
}

// ── Meta Tag Analyzer ─────────────────────────────────────────────────────────
function MetaAnalyzer() {
  const SAMPLE = `<html>
<head>
  <title>Best Running Shoes 2024 | ShoeStore</title>
  <meta name="description" content="Find the best running shoes for all terrains. Free shipping on orders over $50.">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="Best Running Shoes 2024">
  <meta property="og:description" content="Top running shoes for every runner.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
</html>`;
  const [input, setInput] = useState(SAMPLE);
  const [checks, setChecks] = useState<Check[]>([]);

  const analyze = () => {
    const results: Check[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");
    const title = doc.querySelector("title")?.textContent ?? "";
    const desc = doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    const robots = doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "";
    const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute("content") ?? "";
    const viewport = doc.querySelector('meta[name="viewport"]')?.getAttribute("content") ?? "";

    results.push({ label: "Title", value: title || "Missing", status: title.length >= 30 && title.length <= 65 ? "good" : title ? "warn" : "bad", tip: `${title.length} chars. Ideal: 50–60` });
    results.push({ label: "Meta Description", value: desc ? `${desc.length} chars` : "Missing", status: desc.length >= 120 && desc.length <= 165 ? "good" : desc ? "warn" : "bad", tip: "Ideal: 150–160 chars" });
    results.push({ label: "Robots", value: robots || "Not set (defaults to index,follow)", status: "good", tip: "" });
    results.push({ label: "OG Title", value: ogTitle || "Missing", status: ogTitle ? "good" : "warn", tip: "Required for social sharing" });
    results.push({ label: "OG Description", value: ogDesc ? "Present" : "Missing", status: ogDesc ? "good" : "warn", tip: "Recommended for social sharing" });
    results.push({ label: "Viewport", value: viewport || "Missing", status: viewport ? "good" : "bad", tip: "Required for mobile SEO" });
    setChecks(results);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Paste HTML (head section)</label>
        <Textarea value={input} onChange={e=>setInput(e.target.value)} className="min-h-[180px] resize-none text-xs font-mono" />
      </div>
      <Button onClick={analyze} className="w-full gap-2"><Search className="w-4 h-4" />Analyze Meta Tags</Button>
      {checks.length > 0 && <CheckList checks={checks} />}
    </div>
  );
}

// ── Shared CheckList ──────────────────────────────────────────────────────────
function CheckList({ checks }: { checks: Check[] }) {
  return (
    <div className="space-y-2">
      {checks.map((c,i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/10">
          {statusIcon(c.status)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium">{c.label}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">{c.value}</span>
            </div>
            {c.tip && <p className="text-xs text-muted-foreground mt-0.5">{c.tip}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const TOOLS: Record<string, { title: string; component: React.ReactNode }> = {
  "meta-tag-analyzer": { title: "Meta Tag Analyzer", component: <MetaAnalyzer /> },
  "title-tag-checker": { title: "Title Tag Checker", component: <TitleChecker /> },
  "meta-description-checker": { title: "Meta Description Checker", component: <DescChecker /> },
  "utm-builder": { title: "UTM Builder", component: <UtmBuilder /> },
  "serp-snippet-preview": { title: "SERP Snippet Preview", component: <SerpPreview /> },
  "schema-validator": { title: "Schema Validator", component: <SchemaValidator /> },
  "robots-txt-tester": { title: "Robots.txt Tester", component: <RobotsTester /> },
  "sitemap-validator": { title: "Sitemap Validator", component: <SitemapValidator /> },
  "hreflang-generator": { title: "Hreflang Generator", component: <HreflangGen /> },
};

export function SeoAnalyzerTool() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "meta-tag-analyzer";
  const tool = TOOLS[slug] ?? TOOLS["meta-tag-analyzer"];
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Search className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">{tool.component}</div>
    </div>
  );
}
