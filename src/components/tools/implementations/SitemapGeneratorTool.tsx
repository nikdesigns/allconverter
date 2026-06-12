"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Download, Map, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SitemapEntry {
  id: number;
  url: string;
  priority: string;
  changefreq: string;
  lastmod: string;
}

let nextId = 3;

export function SitemapGeneratorTool() {
  const [entries, setEntries] = useState<SitemapEntry[]>([
    { id: 1, url: "https://example.com/", priority: "1.0", changefreq: "daily", lastmod: new Date().toISOString().slice(0,10) },
    { id: 2, url: "https://example.com/about", priority: "0.8", changefreq: "monthly", lastmod: new Date().toISOString().slice(0,10) },
  ]);
  const [bulkInput, setBulkInput] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  const addEntry = () => setEntries(p => [...p, { id: nextId++, url: "", priority: "0.5", changefreq: "weekly", lastmod: new Date().toISOString().slice(0,10) }]);
  const removeEntry = (id: number) => setEntries(p => p.filter(e => e.id !== id));
  const update = (id: number, k: keyof SitemapEntry, v: string) => setEntries(p => p.map(e => e.id === id ? { ...e, [k]: v } : e));

  const addBulk = () => {
    const urls = bulkInput.split("\n").map(s => s.trim()).filter(Boolean);
    setEntries(p => [...p, ...urls.map(url => ({ id: nextId++, url, priority: "0.5", changefreq: "monthly", lastmod: new Date().toISOString().slice(0,10) }))]);
    setBulkInput(""); setShowBulk(false);
    toast.success(`Added ${urls.length} URLs`);
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.filter(e => e.url).map(e => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  const copy = () => { navigator.clipboard.writeText(xml); toast.success("sitemap.xml copied!"); };
  const download = () => {
    const blob = new Blob([xml], { type: "application/xml" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "sitemap.xml"; a.click();
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">XML Sitemap Generator</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={copy} className="h-7 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
          <Button size="sm" onClick={download} className="h-7 text-xs gap-1"><Download className="w-3 h-3" />Download</Button>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {entries.map((e, i) => (
            <div key={e.id} className="grid grid-cols-[1fr_80px_100px_120px_32px] gap-2 items-center">
              {i === 0 && (
                <>
                  <p className="text-[11px] text-muted-foreground">URL</p>
                  <p className="text-[11px] text-muted-foreground">Priority</p>
                  <p className="text-[11px] text-muted-foreground">Freq</p>
                  <p className="text-[11px] text-muted-foreground">Last modified</p>
                  <span />
                </>
              )}
              <Input value={e.url} onChange={ev => update(e.id, "url", ev.target.value)} placeholder="https://example.com/page" className="text-xs font-mono h-9" />
              <select value={e.priority} onChange={ev => update(e.id, "priority", ev.target.value)}
                className="h-9 px-2 rounded-xl border border-input bg-background text-xs">
                {["1.0","0.9","0.8","0.7","0.6","0.5","0.4","0.3","0.2","0.1"].map(v => <option key={v}>{v}</option>)}
              </select>
              <select value={e.changefreq} onChange={ev => update(e.id, "changefreq", ev.target.value)}
                className="h-9 px-2 rounded-xl border border-input bg-background text-xs">
                {["always","hourly","daily","weekly","monthly","yearly","never"].map(v => <option key={v}>{v}</option>)}
              </select>
              <Input type="date" value={e.lastmod} onChange={ev => update(e.id, "lastmod", ev.target.value)} className="text-xs h-9" />
              <button onClick={() => removeEntry(e.id)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addEntry} className="gap-1.5 text-xs h-8">
            <Plus className="w-3.5 h-3.5" />Add URL
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowBulk(p => !p)} className="text-xs h-8">
            {showBulk ? "Hide" : "Bulk add"}
          </Button>
        </div>

        {showBulk && (
          <div className="space-y-2">
            <textarea value={bulkInput} onChange={e => setBulkInput(e.target.value)}
              className="w-full h-28 px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono resize-none outline-none focus:ring-2 focus:ring-primary/30"
              placeholder={"https://example.com/page1\nhttps://example.com/page2"} />
            <Button size="sm" onClick={addBulk} className="h-8 text-xs">Add URLs</Button>
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Preview (sitemap.xml)</p>
          <pre className="p-4 rounded-xl border border-border bg-muted/10 text-xs font-mono overflow-x-auto max-h-64 whitespace-pre">{xml}</pre>
        </div>
      </div>
    </div>
  );
}
