"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Copy, RefreshCw, ExternalLink, Monitor, Smartphone, Maximize2, Globe, Shield, Server, Zap, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── HTML fetch + parse helpers ───────────────────────────────────────────────

async function fetchPageHtml(targetUrl: string): Promise<string> {
  const proxies = [
    (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  ];
  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy(targetUrl), { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      const html = await res.text();
      if (html.length > 200) return html;
    } catch { /* try next */ }
  }
  throw new Error("Could not fetch page. The site may block external crawlers.");
}

function parseMeta(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const meta  = (name: string) => doc.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ?? "—";
  const og    = (prop: string) => doc.querySelector(`meta[property="og:${prop}"]`)?.getAttribute("content") ?? "—";
  const tw    = (name: string) => doc.querySelector(`meta[name="twitter:${name}"]`)?.getAttribute("content") ?? "—";
  const link  = (rel: string) => doc.querySelector(`link[rel="${rel}"]`)?.getAttribute("href") ?? "—";
  const h1s   = Array.from(doc.querySelectorAll("h1")).map(el => el.textContent?.trim()).filter(Boolean).slice(0, 3).join(" · ") || "—";
  return {
    title:         doc.title || "—",
    description:   meta("description"),
    ogTitle:       og("title"),
    ogDescription: og("description"),
    ogImage:       og("image"),
    canonical:     link("canonical"),
    h1s,
    keywords:      meta("keywords"),
    robots:        meta("robots"),
    viewport:      meta("viewport"),
    twitterCard:   tw("card"),
    favicon:       link("icon") || link("shortcut icon"),
  };
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function cleanDomain(url: string): string {
  try {
    const u = url.startsWith("http") ? new URL(url) : new URL("https://" + url);
    return u.hostname;
  } catch {
    return url.trim();
  }
}

function cleanUrl(u: string): string {
  if (!u) return "";
  return u.startsWith("http") ? u : `https://${u}`;
}

function copy(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied!");
}

// ─── Website Screenshot ───────────────────────────────────────────────────────

const SCREENSHOT_MODES = [
  { id: "desktop",  label: "Desktop",   icon: Monitor    },
  { id: "mobile",   label: "Mobile",    icon: Smartphone },
  { id: "fullpage", label: "Full Page", icon: Maximize2  },
];

function WebsiteScreenshot() {
  const [url, setUrl]       = useState("");
  const [mode, setMode]     = useState("desktop");
  const [imgSrc, setImgSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const take = async () => {
    const clean = cleanUrl(url.trim());
    if (!clean) return;
    setLoading(true);
    setImgSrc("");
    setError("");

    const params = new URLSearchParams({ url: clean, screenshot: "true", meta: "false" });
    if (mode === "mobile") {
      params.set("viewport.width", "390");
      params.set("viewport.height", "844");
    } else if (mode === "fullpage") {
      params.set("screenshot.fullPage", "true");
      params.set("viewport.width", "1280");
    } else {
      params.set("viewport.width", "1280");
      params.set("viewport.height", "800");
    }

    try {
      const res = await fetch(`https://api.microlink.io/?${params.toString()}`);
      const data = await res.json();
      if (data.status === "success" && data.data?.screenshot?.url) {
        setImgSrc(data.data.screenshot.url);
      } else {
        setError("Screenshot failed — the site may block external crawlers, or the URL is invalid.");
      }
    } catch {
      setError("Failed to reach the screenshot service. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={url} onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && take()}
          placeholder="https://example.com" className="text-sm h-10" />
        <Button onClick={take} disabled={!url.trim() || loading} className="h-10 px-4 gap-1.5 shrink-0">
          <Monitor className="w-3.5 h-3.5" /> Capture
        </Button>
      </div>

      <div className="flex gap-2">
        {SCREENSHOT_MODES.map(m => {
          const Icon = m.icon;
          return (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
                mode === m.id ? "border-primary/50 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}>
              <Icon className="w-3 h-3" />{m.label}
            </button>
          );
        })}
      </div>

      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Capturing screenshot… (5–10 seconds)
        </div>
      )}

      {imgSrc && !loading && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border overflow-hidden">
            <img src={imgSrc} alt="Screenshot" className="w-full object-contain max-h-125" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"
              onClick={() => { const a = document.createElement("a"); a.href = imgSrc; a.download = "screenshot.jpg"; a.target = "_blank"; a.click(); }}>
              Download
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"
              onClick={() => copy(imgSrc)}>
              <Copy className="w-3 h-3" /> Copy URL
            </Button>
            <a href={imgSrc} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                <ExternalLink className="w-3 h-3" /> Open Full
              </Button>
            </a>
          </div>
        </div>
      )}
      {loading && <div className="text-center py-6 text-sm text-muted-foreground">Capturing screenshot…</div>}

      <p className="text-xs text-muted-foreground">Powered by thum.io — some sites block external screenshot services.</p>
    </div>
  );
}

// ─── DNS Lookup ───────────────────────────────────────────────────────────────

const DNS_TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA", "CAA"];
const TYPE_LABELS: Record<number, string> = { 1:"A",2:"NS",5:"CNAME",6:"SOA",12:"PTR",15:"MX",16:"TXT",28:"AAAA",257:"CAA" };

interface DnsRecord { name: string; type: number; TTL: number; data: string }

function DnsLookup() {
  const [domain, setDomain]     = useState("");
  const [type, setType]         = useState("A");
  const [records, setRecords]   = useState<DnsRecord[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const lookup = async () => {
    const d = cleanDomain(domain.trim());
    if (!d) return;
    setLoading(true);
    setError("");
    setRecords([]);
    try {
      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(d)}&type=${type}`, {
        headers: { Accept: "application/dns-json" }
      });
      const data = await res.json();
      if (data.Status !== 0) {
        setError(`DNS query failed (Status ${data.Status}). The domain may not exist or have no ${type} records.`);
        return;
      }
      setRecords(data.Answer || []);
      if ((data.Answer || []).length === 0) setError(`No ${type} records found for ${d}.`);
    } catch {
      setError("Failed to perform DNS lookup. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    copy(records.map(r => `${r.name}\t${TYPE_LABELS[r.type] || r.type}\t${r.TTL}\t${r.data}`).join("\n"));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={domain} onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookup()}
          placeholder="example.com" className="text-sm h-10" />
        <Button onClick={lookup} disabled={!domain.trim() || loading} className="h-10 px-4 shrink-0 gap-1.5">
          <Search className="w-3.5 h-3.5" /> Lookup
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {DNS_TYPES.map(t => (
          <button key={t} onClick={() => setType(t)}
            className={cn("px-2.5 py-1 rounded-full border text-xs font-mono font-medium transition-all",
              type === t ? "border-primary/50 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}>
            {t}
          </button>
        ))}
      </div>

      {error && <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-sm text-amber-400">{error}</div>}

      {loading && <div className="text-center py-6 text-muted-foreground text-sm">Looking up {type} records…</div>}

      {records.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{records.length} record{records.length > 1 ? "s" : ""} found</span>
            <Button size="sm" variant="ghost" onClick={copyAll} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy All</Button>
          </div>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/30">
                <tr>
                  {["Name","Type","TTL","Value"].map(h => <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i} className="border-t border-border hover:bg-muted/10">
                    <td className="px-3 py-2 font-mono truncate max-w-[120px]">{r.name}</td>
                    <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px]">{TYPE_LABELS[r.type] || r.type}</span></td>
                    <td className="px-3 py-2 text-muted-foreground">{r.TTL}s</td>
                    <td className="px-3 py-2 font-mono break-all cursor-pointer hover:text-primary" onClick={() => copy(r.data)}>{r.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── IP Lookup ────────────────────────────────────────────────────────────────

function IpLookup() {
  const [ip, setIp]         = useState("");
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const lookup = async () => {
    const target = ip.trim() || ""; // empty = own IP
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const url = target ? `https://ipapi.co/${encodeURIComponent(target)}/json/` : "https://ipapi.co/json/";
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) { setError(data.reason || "IP not found"); return; }
      setResult({
        "IP Address":   data.ip,
        "City":         data.city || "—",
        "Region":       data.region || "—",
        "Country":      `${data.country_name || "—"} (${data.country || ""})`,
        "Postal Code":  data.postal || "—",
        "Timezone":     data.timezone || "—",
        "ISP / Org":    data.org || "—",
        "ASN":          data.asn || "—",
        "Latitude":     data.latitude ? String(data.latitude) : "—",
        "Longitude":    data.longitude ? String(data.longitude) : "—",
        "Currency":     data.currency_name ? `${data.currency_name} (${data.currency})` : "—",
        "Languages":    data.languages || "—",
      });
    } catch {
      setError("Failed to fetch IP data.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!result) return;
    copy(Object.entries(result).map(([k, v]) => `${k}: ${v}`).join("\n"));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={ip} onChange={e => setIp(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookup()}
          placeholder="Enter IP address (leave empty for your own IP)" className="text-sm h-10" />
        <Button onClick={lookup} disabled={loading} className="h-10 px-4 shrink-0 gap-1.5">
          <Search className="w-3.5 h-3.5" /> Lookup
        </Button>
      </div>

      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}
      {loading && <div className="text-center py-6 text-muted-foreground text-sm">Looking up IP…</div>}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Geolocation data for {result["IP Address"]}</span>
            <Button size="sm" variant="ghost" onClick={copyAll} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy All</Button>
          </div>
          <div className="rounded-xl border border-border overflow-hidden">
            {Object.entries(result).map(([k, v], i) => (
              <div key={k} className={cn("flex items-center justify-between px-4 py-2.5 text-sm", i % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                <span className="text-muted-foreground text-xs">{k}</span>
                <span className="font-medium text-right ml-4 cursor-pointer hover:text-primary" onClick={() => copy(v)}>{v}</span>
              </div>
            ))}
          </div>
          {result["Latitude"] !== "—" && result["Longitude"] !== "—" && (
            <a href={`https://maps.google.com/?q=${result["Latitude"]},${result["Longitude"]}`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"><ExternalLink className="w-3 h-3" />View on Maps</Button>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SSL Checker ─────────────────────────────────────────────────────────────

interface CertInfo { issuer_name: string; not_before: string; not_after: string; name_value: string; id: number }

function SslChecker() {
  const [domain, setDomain]   = useState("");
  const [certs, setCerts]     = useState<CertInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const check = async () => {
    const d = cleanDomain(domain.trim());
    if (!d) return;
    setLoading(true);
    setError("");
    setCerts([]);
    try {
      const res = await fetch(`https://crt.sh/?q=${encodeURIComponent(d)}&output=json`);
      const data: CertInfo[] = await res.json();
      const sorted = data.sort((a, b) => b.id - a.id).slice(0, 10);
      if (sorted.length === 0) {
        setError("No certificates found in Certificate Transparency logs for this domain.");
        return;
      }
      setCerts(sorted);
    } catch {
      setError("Failed to fetch SSL data. Try again or check the domain name.");
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (notAfter: string) => {
    const diff = new Date(notAfter).getTime() - Date.now();
    return Math.floor(diff / 86400000);
  };

  const latest = certs[0];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={domain} onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder="example.com" className="text-sm h-10" />
        <Button onClick={check} disabled={!domain.trim() || loading} className="h-10 px-4 shrink-0 gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Check SSL
        </Button>
      </div>

      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}
      {loading && <div className="text-center py-6 text-muted-foreground text-sm">Checking certificates…</div>}

      {latest && (
        <div className="space-y-4">
          {/* Summary card */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{latest.name_value.split("\n")[0]}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{latest.issuer_name.split(",")[0].replace("O=","")}</div>
              </div>
              {(() => {
                const d = getDaysLeft(latest.not_after);
                return (
                  <div className={cn("px-3 py-1.5 rounded-full text-xs font-bold shrink-0",
                    d > 30 ? "bg-emerald-500/15 text-emerald-400" :
                    d > 7  ? "bg-amber-500/15 text-amber-400" :
                    d > 0  ? "bg-rose-500/15 text-rose-400" :
                             "bg-rose-600/20 text-rose-500")}>
                    {d > 0 ? `${d}d remaining` : "EXPIRED"}
                  </div>
                );
              })()}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><div className="text-muted-foreground mb-0.5">Valid From</div><div className="font-medium">{new Date(latest.not_before).toLocaleDateString()}</div></div>
              <div><div className="text-muted-foreground mb-0.5">Valid Until</div><div className="font-medium">{new Date(latest.not_after).toLocaleDateString()}</div></div>
              <div className="col-span-2"><div className="text-muted-foreground mb-0.5">Issuer</div><div className="font-medium">{latest.issuer_name.replace(/\w+=|\s*,\s*/g," ").trim()}</div></div>
              <div className="col-span-2"><div className="text-muted-foreground mb-0.5">Domains Covered</div><div className="font-mono text-[11px]">{latest.name_value.split("\n").slice(0,5).join(", ")}</div></div>
            </div>
          </div>

          {/* Recent certs */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Certificate History (from crt.sh)</div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {certs.map(c => {
                const d = getDaysLeft(c.not_after);
                return (
                  <div key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border text-xs">
                    <div className={cn("w-2 h-2 rounded-full shrink-0", d > 0 ? "bg-emerald-400" : "bg-rose-400")} />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono truncate">{c.name_value.split("\n")[0]}</div>
                      <div className="text-muted-foreground">{new Date(c.not_before).toLocaleDateString()} – {new Date(c.not_after).toLocaleDateString()}</div>
                    </div>
                    <div className="text-muted-foreground shrink-0">{d > 0 ? `${d}d left` : "expired"}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Data from Certificate Transparency logs (crt.sh) — shows issued certs, not live connection status.</p>
        </div>
      )}
    </div>
  );
}

// ─── Website Metadata ─────────────────────────────────────────────────────────

interface MetaResult {
  title: string; description: string; ogTitle: string; ogDescription: string; ogImage: string;
  canonical: string; h1s: string; keywords: string; robots: string; viewport: string;
  twitterCard: string; favicon: string;
}

function WebsiteMetadata() {
  const [url, setUrl]           = useState("");
  const [result, setResult]     = useState<MetaResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const extract = async () => {
    const clean = cleanUrl(url.trim());
    if (!clean) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const html = await fetchPageHtml(clean);
      setResult(parseMeta(html));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch metadata. Try a different URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={url} onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && extract()}
          placeholder="https://example.com" className="text-sm h-10" />
        <Button onClick={extract} disabled={!url.trim() || loading} className="h-10 px-4 shrink-0 gap-1.5">
          <FileSearch className="w-3.5 h-3.5" /> Extract
        </Button>
      </div>

      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}
      {loading && <div className="text-center py-6 text-muted-foreground text-sm">Fetching metadata…</div>}

      {result && (
        <div className="space-y-3">
          {result.ogImage !== "—" && (
            <div className="rounded-xl border border-border overflow-hidden">
              <img src={result.ogImage} alt="OG" className="w-full max-h-40 object-cover" onError={e => (e.currentTarget.style.display = "none")} />
            </div>
          )}
          <div className="rounded-xl border border-border overflow-hidden">
            {(Object.entries(result) as [string, string][]).map(([k, v], i) => {
              const label: Record<string, string> = { title:"Title", description:"Meta Description", ogTitle:"OG Title", ogDescription:"OG Description", ogImage:"OG Image", canonical:"Canonical URL", h1s:"H1 Tags", keywords:"Keywords", robots:"Robots", viewport:"Viewport", twitterCard:"Twitter Card", favicon:"Favicon" };
              return (
                <div key={k} className={cn("flex items-start gap-3 px-4 py-3 text-xs", i % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                  <span className="text-muted-foreground shrink-0 w-28">{label[k] || k}</span>
                  <span className="font-medium break-all cursor-pointer hover:text-primary flex-1" onClick={() => copy(v)}>{v}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">Metadata fetched via Microlink API. Click any value to copy.</p>
        </div>
      )}
    </div>
  );
}

// ─── Website Speed Checker ────────────────────────────────────────────────────

interface SpeedResult { score: number; fcp: string; lcp: string; cls: string; tbt: string; si: string; strategy: string }

function WebsiteSpeed() {
  const [url, setUrl]           = useState("");
  const [strategy, setStrategy] = useState<"desktop"|"mobile">("desktop");
  const [apiKey, setApiKey]     = useState("");
  const [showKey, setShowKey]   = useState(false);
  const [result, setResult]     = useState<SpeedResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const check = async () => {
    const clean = cleanUrl(url.trim());
    if (!clean) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const key = apiKey.trim();
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(clean)}&strategy=${strategy}${key ? `&key=${encodeURIComponent(key)}` : ""}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.error) {
        const msg: string = data.error.message || "PageSpeed check failed";
        if (msg.toLowerCase().includes("quota")) {
          setError("Daily quota exceeded for the free shared API. Add your own free Google API key below to continue (25,000 requests/day free).");
        } else {
          setError(msg);
        }
        return;
      }

      const cats = data.lighthouseResult?.categories;
      const audits = data.lighthouseResult?.audits;
      const score = Math.round((cats?.performance?.score ?? 0) * 100);

      const fmt = (metric: string) => {
        const v = audits?.[metric]?.displayValue;
        return v ?? "—";
      };

      setResult({
        score,
        fcp: fmt("first-contentful-paint"),
        lcp: fmt("largest-contentful-paint"),
        cls: fmt("cumulative-layout-shift"),
        tbt: fmt("total-blocking-time"),
        si:  fmt("speed-index"),
        strategy,
      });
    } catch {
      setError("Failed to run PageSpeed check. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => s >= 90 ? "text-emerald-400" : s >= 50 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={url} onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder="https://example.com" className="text-sm h-10" />
        <Button onClick={check} disabled={!url.trim() || loading} className="h-10 px-4 shrink-0 gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Test Speed
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(["desktop","mobile"] as const).map(s => (
            <button key={s} onClick={() => setStrategy(s)}
              className={cn("px-3 py-1.5 rounded-full border text-xs font-medium capitalize transition-all",
                strategy === s ? "border-primary/50 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setShowKey(v => !v)}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
          {showKey ? "Hide API Key" : "Add API Key"}
        </button>
      </div>

      {showKey && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2.5">
          <div className="text-xs font-semibold text-amber-400">Google PageSpeed API Key (optional but recommended)</div>
          <Input
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="AIza…"
            className="text-xs h-9 font-mono"
          />
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            The free shared quota may run out during peak hours. Get your own free key (25,000 req/day) in 2 minutes:
            <ol className="mt-1.5 space-y-0.5 list-decimal list-inside">
              <li>Go to <span className="font-mono text-foreground">console.cloud.google.com</span></li>
              <li>Create a project → APIs &amp; Services → Enable &quot;PageSpeed Insights API&quot;</li>
              <li>Credentials → Create API Key → paste it above</li>
            </ol>
            Your key stays in your browser only — never sent anywhere except Google.
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 space-y-2">
          <div className="text-sm text-rose-400">{error}</div>
          {!showKey && (
            <button onClick={() => setShowKey(true)} className="text-xs text-amber-400 underline underline-offset-2">
              Add a free API key to fix this →
            </button>
          )}
        </div>
      )}
      {loading && <div className="text-center py-6 text-muted-foreground text-sm">Running PageSpeed analysis… (may take 10–20 seconds)</div>}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={cn("w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center shrink-0",
              result.score >= 90 ? "border-emerald-400" : result.score >= 50 ? "border-amber-400" : "border-rose-400")}>
              <span className={cn("text-3xl font-black", scoreColor(result.score))}>{result.score}</span>
              <span className="text-[10px] text-muted-foreground uppercase">score</span>
            </div>
            <div>
              <div className={cn("text-sm font-semibold", scoreColor(result.score))}>
                {result.score >= 90 ? "Excellent" : result.score >= 50 ? "Needs Improvement" : "Poor"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 capitalize">{result.strategy} analysis via Google PageSpeed</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "First Contentful Paint", key: "fcp", value: result.fcp },
              { label: "Largest Contentful Paint", key: "lcp", value: result.lcp },
              { label: "Total Blocking Time", key: "tbt", value: result.tbt },
              { label: "Cumulative Layout Shift", key: "cls", value: result.cls },
              { label: "Speed Index", key: "si", value: result.si },
            ].map(m => (
              <div key={m.key} className="rounded-xl border border-border p-3">
                <div className="text-[10px] text-muted-foreground uppercase mb-1">{m.label}</div>
                <div className="text-sm font-bold">{m.value}</div>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground">
            Powered by Google PageSpeed Insights. Scores may vary based on server load and location.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TOOLS: Record<string, { title: string; icon: React.ComponentType<{className?:string}>; component: React.ComponentType }> = {
  "website-screenshot":          { title: "Website Screenshot",        icon: Monitor,    component: WebsiteScreenshot },
  "dns-lookup":                  { title: "DNS Lookup",                icon: Server,     component: DnsLookup },
  "ip-lookup":                   { title: "IP Lookup",                 icon: Globe,      component: IpLookup },
  "ssl-checker":                 { title: "SSL Certificate Checker",   icon: Shield,     component: SslChecker },
  "website-metadata-extractor":  { title: "Website Metadata Extractor",icon: FileSearch, component: WebsiteMetadata },
  "website-speed-checker":       { title: "Website Speed Checker",     icon: Zap,        component: WebsiteSpeed },
};

export function NetworkToolsSuite() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "dns-lookup";
  const tool = TOOLS[slug] ?? TOOLS["dns-lookup"];
  const Icon = tool.icon;
  const Comp = tool.component;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">
        <Comp />
      </div>
    </div>
  );
}
