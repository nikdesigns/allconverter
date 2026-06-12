"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Trash2, Link2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "Google Ads",    source: "google",    medium: "cpc",      campaign: "" },
  { label: "Facebook Ads",  source: "facebook",  medium: "paid",     campaign: "" },
  { label: "Email",         source: "newsletter",medium: "email",    campaign: "" },
  { label: "Twitter",       source: "twitter",   medium: "social",   campaign: "" },
  { label: "LinkedIn",      source: "linkedin",  medium: "social",   campaign: "" },
  { label: "YouTube",       source: "youtube",   medium: "video",    campaign: "" },
  { label: "Organic",       source: "organic",   medium: "seo",      campaign: "" },
  { label: "Referral",      source: "referral",  medium: "referral", campaign: "" },
];

type HistoryItem = { url: string; label: string; ts: number };
const HISTORY_KEY = "utm-builder-history";

function loadHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
function saveHistory(items: HistoryItem[]) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 15))); } catch { /* noop */ }
}

export function UtmBuilderTool() {
  const [baseUrl, setBaseUrl]       = useState("https://yoursite.com/page");
  const [source, setSource]         = useState("google");
  const [medium, setMedium]         = useState("cpc");
  const [campaign, setCampaign]     = useState("");
  const [term, setTerm]             = useState("");
  const [content, setContent]       = useState("");
  const [copied, setCopied]         = useState(false);
  const [history, setHistory]       = useState<HistoryItem[]>(loadHistory);
  const [showHistory, setShowHistory] = useState(false);

  const utmUrl = useMemo(() => {
    try {
      const url = new URL(baseUrl.trim() || "https://example.com");
      if (source.trim())   url.searchParams.set("utm_source",   source.trim());
      if (medium.trim())   url.searchParams.set("utm_medium",   medium.trim());
      if (campaign.trim()) url.searchParams.set("utm_campaign", campaign.trim());
      if (term.trim())     url.searchParams.set("utm_term",     term.trim());
      if (content.trim())  url.searchParams.set("utm_content",  content.trim());
      return url.toString();
    } catch {
      return "";
    }
  }, [baseUrl, source, medium, campaign, term, content]);

  const isValid = !!utmUrl && !!source.trim() && !!medium.trim();

  const copy = async () => {
    if (!utmUrl) return;
    await navigator.clipboard.writeText(utmUrl);
    setCopied(true);
    toast.success("UTM URL copied!");
    setTimeout(() => setCopied(false), 2000);
    // Add to history
    const label = [source, medium, campaign].filter(Boolean).join(" / ");
    const item: HistoryItem = { url: utmUrl, label, ts: Date.now() };
    const newHist = [item, ...history.filter(h => h.url !== utmUrl)];
    setHistory(newHist);
    saveHistory(newHist);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setSource(p.source);
    setMedium(p.medium);
    if (p.campaign) setCampaign(p.campaign);
  };

  const clearHistory = () => { setHistory([]); saveHistory([]); };

  const params = useMemo(() => {
    if (!utmUrl) return [];
    try {
      const url = new URL(utmUrl);
      return Array.from(url.searchParams.entries()).filter(([k]) => k.startsWith("utm_"));
    } catch { return []; }
  }, [utmUrl]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2"><Link2 className="w-4 h-4 text-primary" /><span className="text-sm font-medium">UTM Builder</span><span className="text-[10px] text-emerald-500 font-medium">● Live</span></div>
        <Button size="sm" variant="outline" onClick={() => setShowHistory(v => !v)} className="h-7 text-xs gap-1.5">
          History {history.length > 0 && <span className="px-1 py-0.5 rounded bg-primary/20 text-primary text-[10px]">{history.length}</span>}
        </Button>
      </div>

      <div className="p-5 space-y-5">
        {/* Base URL */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Base URL</label>
          <Input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} placeholder="https://yoursite.com/landing-page" className="text-sm font-mono" />
        </div>

        {/* Presets */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Quick Presets</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => applyPreset(p)}
                className={cn("px-2.5 py-1 rounded-lg border text-xs font-medium transition-all",
                  source===p.source && medium===p.medium ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground")}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* UTM fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1 flex items-center gap-1"><span className="text-muted-foreground">utm_source</span><span className="text-red-500">*</span></label>
            <Input value={source} onChange={e => setSource(e.target.value)} placeholder="google, newsletter, twitter…" className="text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs mb-1 flex items-center gap-1"><span className="text-muted-foreground">utm_medium</span><span className="text-red-500">*</span></label>
            <Input value={medium} onChange={e => setMedium(e.target.value)} placeholder="cpc, email, social, organic…" className="text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">utm_campaign</label>
            <Input value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="summer-sale, launch-2026…" className="text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">utm_term <span className="opacity-60">(paid keywords)</span></label>
            <Input value={term} onChange={e => setTerm(e.target.value)} placeholder="running+shoes" className="text-sm font-mono" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1 block">utm_content <span className="opacity-60">(A/B differentiation)</span></label>
            <Input value={content} onChange={e => setContent(e.target.value)} placeholder="button-cta, banner-top, logo-link…" className="text-sm font-mono" />
          </div>
        </div>

        {/* Output */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">Generated URL</span>
            <div className="flex items-center gap-2">
              {utmUrl && (
                <a href={utmUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <Button size="sm" onClick={copy} disabled={!isValid} className="h-7 text-xs gap-1.5">
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy URL"}
              </Button>
            </div>
          </div>
          <div className="p-3">
            {utmUrl ? (
              <p className="text-xs font-mono text-foreground break-all leading-relaxed">
                <span className="text-muted-foreground">{baseUrl.trim()}</span>
                {params.map(([k, v]) => (
                  <span key={k}>
                    <span className="text-muted-foreground">&{k}=</span>
                    <span className="text-primary font-semibold">{v}</span>
                  </span>
                ))}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">Enter a base URL to see the UTM link here</p>
            )}
          </div>
        </div>

        {/* Parameter breakdown */}
        {params.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {params.map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-muted/20 text-xs">
                <span className="text-muted-foreground">{k.replace("utm_","")}</span>
                <span className="font-mono font-semibold">{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* History */}
        {showHistory && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Recent URLs ({history.length})</p>
              {history.length > 0 && <button onClick={clearHistory} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"><Trash2 className="w-3 h-3" />Clear</button>}
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No history yet — copy a URL to save it here.</p>
            ) : (
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border hover:border-primary/30 bg-muted/10 group">
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{h.label || "—"}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">{h.url}</p>
                    </div>
                    <button onClick={async () => { await navigator.clipboard.writeText(h.url); toast.success("Copied!"); }}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
