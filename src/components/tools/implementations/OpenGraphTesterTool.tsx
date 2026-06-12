"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Eye } from "lucide-react";

interface OGData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  type: string;
}

export function OpenGraphTesterTool() {
  const [data, setData] = useState<OGData>({
    title: "My Amazing Product — The Best Tool for Everyone",
    description: "Discover how our product helps thousands of users save time and get more done every day. Try it free today.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop",
    url: "https://example.com/my-page",
    siteName: "Example.com",
    type: "website",
  });

  const set = (k: keyof OGData, v: string) => setData(p => ({ ...p, [k]: v }));

  const titleOk = data.title.length >= 15 && data.title.length <= 70;
  const descOk = data.description.length >= 50 && data.description.length <= 200;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Open Graph Tester & Preview</span>
      </div>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <div className="flex justify-between mb-1">
              <label className="text-xs text-muted-foreground">OG Title</label>
              <span className={`text-xs ${!titleOk ? "text-amber-500" : "text-emerald-500"}`}>{data.title.length}/70</span>
            </div>
            <Input value={data.title} onChange={e => set("title", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <div className="flex justify-between mb-1">
              <label className="text-xs text-muted-foreground">OG Description</label>
              <span className={`text-xs ${!descOk ? "text-amber-500" : "text-emerald-500"}`}>{data.description.length}/200</span>
            </div>
            <Textarea value={data.description} onChange={e => set("description", e.target.value)} className="resize-none min-h-[80px] text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">OG Image URL (1200×630)</label>
            <Input value={data.image} onChange={e => set("image", e.target.value)} placeholder="https://…/og-image.jpg" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Page URL</label>
            <Input value={data.url} onChange={e => set("url", e.target.value)} placeholder="https://example.com/page" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Site Name</label>
            <Input value={data.siteName} onChange={e => set("siteName", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">OG Type</label>
            <select value={data.type} onChange={e => set("type", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              <option>website</option><option>article</option><option>product</option>
            </select>
          </div>
        </div>

        {/* Previews */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Social Share Previews</span>
          </div>

          {/* Facebook/OG */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Facebook / LinkedIn</p>
            <div className="rounded-xl border border-border overflow-hidden max-w-[500px]">
              {data.image && (
                <div className="w-full h-[262px] bg-muted overflow-hidden">
                  <img src={data.image} alt="OG" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display="none")} />
                </div>
              )}
              <div className="p-3 border-t border-border bg-[#f2f3f5] dark:bg-muted/30">
                <p className="text-[11px] uppercase text-muted-foreground tracking-wide">{new URL(data.url || "https://example.com").hostname}</p>
                <p className="text-sm font-semibold text-[#1c1e21] dark:text-foreground line-clamp-2 mt-0.5">{data.title || "Title"}</p>
                <p className="text-[13px] text-[#606770] dark:text-muted-foreground line-clamp-1 mt-0.5">{data.description}</p>
              </div>
            </div>

            {/* Twitter card */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-4">Twitter / X</p>
            <div className="rounded-2xl border border-border overflow-hidden max-w-[500px]">
              {data.image && (
                <div className="w-full h-[262px] bg-muted overflow-hidden">
                  <img src={data.image} alt="Twitter" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display="none")} />
                </div>
              )}
              <div className="p-3 bg-background">
                <p className="text-sm font-semibold line-clamp-2">{data.title || "Title"}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{data.description}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Globe className="w-3 h-3" />{data.siteName || new URL(data.url || "https://example.com").hostname}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
