"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Bot, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Rule {
  id: number;
  userAgent: string;
  allow: string[];
  disallow: string[];
}

const COMMON_BOTS = ["*","Googlebot","Bingbot","Slurp","DuckDuckBot","Baiduspider","YandexBot","facebot","ia_archiver"];

let nextId = 2;

export function RobotsTxtGeneratorTool() {
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, userAgent: "*", allow: ["/"], disallow: ["/admin/", "/private/"] },
  ]);
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [crawlDelay, setCrawlDelay] = useState("");

  const addRule = () => { setRules(p => [...p, { id: nextId++, userAgent: "*", allow: [], disallow: ["/"] }]); };
  const removeRule = (id: number) => setRules(p => p.filter(r => r.id !== id));
  const updateRule = (id: number, key: keyof Rule, value: string) => {
    setRules(p => p.map(r => r.id === id ? { ...r, [key]: value } : r));
  };
  const updateLines = (id: number, key: "allow" | "disallow", value: string) => {
    setRules(p => p.map(r => r.id === id ? { ...r, [key]: value.split("\n").map(s => s.trim()).filter(Boolean) } : r));
  };

  const generated = [
    ...rules.map(r => [
      `User-agent: ${r.userAgent}`,
      ...(crawlDelay ? [`Crawl-delay: ${crawlDelay}`] : []),
      ...r.allow.map(a => `Allow: ${a}`),
      ...r.disallow.map(d => `Disallow: ${d}`),
      "",
    ].join("\n")),
    ...(sitemapUrl ? [`Sitemap: ${sitemapUrl}`] : []),
  ].join("\n").trim();

  const copy = () => { navigator.clipboard.writeText(generated); toast.success("robots.txt copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Bot className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">robots.txt Generator</span>
      </div>
      <div className="p-5 space-y-5">
        {rules.map((rule, idx) => (
          <div key={rule.id} className="p-4 rounded-xl border border-border bg-muted/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Rule #{idx+1}</span>
              {rules.length > 1 && (
                <button onClick={() => removeRule(rule.id)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">User-agent</label>
              <select value={rule.userAgent} onChange={e => updateRule(rule.id, "userAgent", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm">
                {COMMON_BOTS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Allow (one per line)</label>
                <textarea value={rule.allow.join("\n")} onChange={e => updateLines(rule.id, "allow", e.target.value)}
                  className="w-full h-24 px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono resize-none outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="/&#10;/blog/" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Disallow (one per line)</label>
                <textarea value={rule.disallow.join("\n")} onChange={e => updateLines(rule.id, "disallow", e.target.value)}
                  className="w-full h-24 px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono resize-none outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="/admin/&#10;/private/" />
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" size="sm" onClick={addRule} className="w-full gap-2">
          <Plus className="w-4 h-4" />Add Rule
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Sitemap URL</label>
            <Input value={sitemapUrl} onChange={e => setSitemapUrl(e.target.value)} placeholder="https://example.com/sitemap.xml" className="text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Crawl-delay (optional)</label>
            <Input type="number" value={crawlDelay} onChange={e => setCrawlDelay(e.target.value)} placeholder="e.g. 10" className="text-sm" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium">Generated robots.txt</label>
            <Button size="sm" onClick={copy} className="h-7 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
          </div>
          <pre className="p-4 rounded-xl border border-border bg-muted/10 text-sm font-mono whitespace-pre-wrap">{generated}</pre>
        </div>
      </div>
    </div>
  );
}
