"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Hash } from "lucide-react";
import { toast } from "sonner";

function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf);
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function uuidv1Like(): string {
  const now = Date.now();
  const time = now.toString(16).padStart(12, "0");
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(10))).map(b => b.toString(16).padStart(2,"0")).join("");
  return `${time.slice(-8)}-${time.slice(-12,-8)}-1${rand.slice(0,3)}-${(8+Math.floor(Math.random()*4)).toString(16)}${rand.slice(3,6)}-${rand.slice(6,18)}`;
}

function nilUuid(): string { return "00000000-0000-0000-0000-000000000000"; }

type Version = "v4" | "v1" | "nil";

export function UuidGeneratorTool() {
  const [version, setVersion] = useState<Version>("v4");
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const generate = useCallback((ver: Version, cnt: number) => {
    const gen = ver === "v4" ? uuidv4 : ver === "v1" ? uuidv1Like : nilUuid;
    setUuids(Array.from({ length: cnt }, gen));
  }, []);

  // Initial generation + auto-regenerate when version or count changes
  useEffect(() => {
    generate(version, count);
  }, [version, count, generate]);

  const format = (u: string) => {
    let r = u;
    if (noDashes) r = r.replace(/-/g, "");
    if (uppercase) r = r.toUpperCase();
    return r;
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.map(format).join("\n"));
    toast.success(`Copied ${uuids.length} UUIDs`);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">UUID Generator</span>
        </div>
        <span className="text-[10px] text-emerald-500 font-medium">● Live</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Version</label>
            <div className="flex rounded-xl border border-border overflow-hidden">
              {(["v4","v1","nil"] as const).map(v => (
                <button key={v} onClick={() => setVersion(v)}
                  className={`flex-1 py-2 text-xs font-medium uppercase transition-all ${version===v?"bg-primary text-primary-foreground":"bg-muted/20 text-muted-foreground"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Count (1–50)</label>
            <Input type="number" min={1} max={50} value={count}
              onChange={e => setCount(Math.min(50, Math.max(1, +e.target.value)))}
              className="text-sm font-mono" />
          </div>
          <div className="flex flex-col gap-2 justify-end">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-primary" />
              Uppercase
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={noDashes} onChange={e => setNoDashes(e.target.checked)} className="accent-primary" />
              No dashes
            </label>
          </div>
        </div>

        <Button onClick={() => generate(version, count)} className="w-full gap-2">
          <RefreshCw className="w-4 h-4" /> Regenerate {count} UUID{count > 1 ? "s" : ""}
        </Button>

        {uuids.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Generated UUIDs</span>
              <Button size="sm" variant="ghost" onClick={copyAll} className="h-7 text-xs gap-1">
                <Copy className="w-3 h-3" />Copy all
              </Button>
            </div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {uuids.map((u, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-muted/10 group">
                  <code className="flex-1 text-sm font-mono">{format(u)}</code>
                  <button onClick={() => { navigator.clipboard.writeText(format(u)); toast.success("Copied!"); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all">
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl border border-border bg-muted/10 text-xs text-muted-foreground space-y-1">
          <p><strong>v4</strong> — Random UUID (recommended for most use cases)</p>
          <p><strong>v1</strong> — Time-based UUID (approximate, no MAC address)</p>
          <p><strong>nil</strong> — All zeros UUID (useful as placeholder)</p>
        </div>
      </div>
    </div>
  );
}
