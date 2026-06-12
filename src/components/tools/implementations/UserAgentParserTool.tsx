"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Monitor, Copy } from "lucide-react";
import { toast } from "sonner";

interface UAInfo {
  browser: string; browserVersion: string;
  os: string; osVersion: string;
  device: string; type: string;
  engine: string; raw: string;
}

function parseUA(ua: string): UAInfo {
  const mobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  const tablet = /iPad|Tablet/i.test(ua);

  let browser = "Unknown", browserVersion = "";
  let os = "Unknown", osVersion = "";
  let engine = "Unknown";

  if (/Edg\//i.test(ua))        { browser = "Edge";    browserVersion = ua.match(/Edg\/([0-9.]+)/i)?.[1] ?? ""; }
  else if (/OPR\/|Opera/i.test(ua)) { browser = "Opera"; browserVersion = ua.match(/(?:OPR|Opera)\/([0-9.]+)/i)?.[1] ?? ""; }
  else if (/Chrome\/([0-9.]+)/i.test(ua)) { browser = "Chrome";  browserVersion = ua.match(/Chrome\/([0-9.]+)/i)?.[1] ?? ""; }
  else if (/Firefox\/([0-9.]+)/i.test(ua)) { browser = "Firefox"; browserVersion = ua.match(/Firefox\/([0-9.]+)/i)?.[1] ?? ""; }
  else if (/Safari\/([0-9.]+)/i.test(ua)) { browser = "Safari";  browserVersion = ua.match(/Version\/([0-9.]+)/i)?.[1] ?? ""; }
  else if (/MSIE |Trident\//i.test(ua)) { browser = "Internet Explorer"; browserVersion = ua.match(/(?:MSIE |rv:)([0-9.]+)/i)?.[1] ?? ""; }

  if (/WebKit/i.test(ua))       engine = "WebKit";
  else if (/Gecko/i.test(ua))   engine = "Gecko";
  else if (/Trident/i.test(ua)) engine = "Trident";

  if (/Windows NT ([0-9.]+)/i.test(ua)) {
    os = "Windows";
    const v = ua.match(/Windows NT ([0-9.]+)/i)?.[1];
    osVersion = ({ "10.0": "10/11", "6.3": "8.1", "6.2": "8", "6.1": "7", "6.0": "Vista" })[v ?? ""] ?? v ?? "";
  } else if (/Mac OS X ([0-9_]+)/i.test(ua)) {
    os = "macOS"; osVersion = ua.match(/Mac OS X ([0-9_.]+)/i)?.[1]?.replace(/_/g, ".") ?? "";
  } else if (/Android ([0-9.]+)/i.test(ua)) {
    os = "Android"; osVersion = ua.match(/Android ([0-9.]+)/i)?.[1] ?? "";
  } else if (/iPhone OS ([0-9_]+)|iPad.*OS ([0-9_]+)/i.test(ua)) {
    os = "iOS"; osVersion = ua.match(/OS ([0-9_]+)/i)?.[1]?.replace(/_/g, ".") ?? "";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  return { browser, browserVersion, os, osVersion, device: tablet ? "Tablet" : mobile ? "Smartphone" : "Desktop", type: mobile || tablet ? "Mobile" : "Desktop", engine, raw: ua };
}

const MY_UA = typeof navigator !== "undefined" ? navigator.userAgent : "";

export function UserAgentParserTool() {
  const [ua, setUa] = useState(MY_UA);

  const info = useMemo(() => ua.trim() ? parseUA(ua) : null, [ua]);

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  const rows: [string, string][] = info ? [
    ["Browser", `${info.browser}${info.browserVersion ? ` ${info.browserVersion}` : ""}`],
    ["Engine", info.engine],
    ["Operating System", `${info.os}${info.osVersion ? ` ${info.osVersion}` : ""}`],
    ["Device Type", info.device],
    ["Platform", info.type],
  ] : [];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">User Agent Parser</span>
        </div>
        <span className="text-[10px] text-emerald-500 font-medium">● Live</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          <Input
            value={ua}
            onChange={(e) => setUa(e.target.value)}
            className="text-xs font-mono flex-1"
            placeholder="Paste a user agent string…"
          />
          <button
            onClick={() => setUa(MY_UA)}
            className="shrink-0 px-3 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            My UA
          </button>
        </div>

        {info && (
          <div className="space-y-1.5">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/10">
                <span className="text-xs text-muted-foreground w-36 shrink-0">{label}</span>
                <span className="text-sm font-medium flex-1">{value || "—"}</span>
              </div>
            ))}
            <div className="p-3 rounded-xl border border-border bg-muted/10">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">Raw UA String</p>
                <button onClick={() => copy(info.raw)} className="p-1 rounded hover:bg-muted">
                  <Copy className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs font-mono break-all text-foreground/80">{info.raw}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
