"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Link2 } from "lucide-react";
import { toast } from "sonner";

export function UrlParserTool() {
  const [input, setInput] = useState("https://example.com:8080/path/to/page?q=hello+world&lang=en&page=1#section");

  const parsed = useMemo(() => {
    try {
      const u = new URL(input);
      const params: Array<[string, string]> = [];
      u.searchParams.forEach((v, k) => params.push([k, v]));
      return { ok: true, protocol: u.protocol, hostname: u.hostname, port: u.port, pathname: u.pathname, search: u.search, hash: u.hash, origin: u.origin, host: u.host, params };
    } catch { return { ok: false } as const; }
  }, [input]);

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  const Row = ({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) => value ? (
    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground w-24 shrink-0 pt-0.5">{label}</span>
      <code className={`flex-1 text-sm break-all ${mono ? "font-mono" : ""}`}>{value}</code>
      <button onClick={() => copy(value)} className="p-1 rounded hover:bg-muted shrink-0 mt-0.5"><Copy className="w-3 h-3 text-muted-foreground" /></button>
    </div>
  ) : null;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Link2 className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">URL Parser</span>
      </div>
      <div className="p-5 space-y-4">
        <Input value={input} onChange={e => setInput(e.target.value)} placeholder="https://example.com/path?query=value#hash" className="font-mono text-sm" />

        {!parsed.ok && input.trim() && (
          <p className="text-sm text-red-500">Invalid URL — include the protocol (https://)</p>
        )}

        {parsed.ok && (
          <div className="rounded-xl border border-border overflow-hidden divide-y-0">
            <Row label="Protocol" value={parsed.protocol} />
            <Row label="Host" value={parsed.host} />
            <Row label="Hostname" value={parsed.hostname} />
            {parsed.port && <Row label="Port" value={parsed.port} />}
            <Row label="Origin" value={parsed.origin} />
            <Row label="Pathname" value={parsed.pathname} />
            {parsed.search && <Row label="Query string" value={parsed.search} />}
            {parsed.hash && <Row label="Fragment" value={parsed.hash} />}
          </div>
        )}

        {parsed.ok && parsed.params.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Query Parameters</p>
            <div className="rounded-xl border border-border overflow-hidden">
              {parsed.params.map(([k, v]) => (
                <div key={k} className="flex items-center gap-3 px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/10">
                  <code className="text-xs font-mono text-primary w-32 truncate shrink-0">{k}</code>
                  <code className="text-xs font-mono flex-1 truncate">{decodeURIComponent(v)}</code>
                  <button onClick={() => copy(decodeURIComponent(v))} className="p-1 rounded hover:bg-muted shrink-0"><Copy className="w-3 h-3 text-muted-foreground" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
