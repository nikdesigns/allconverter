"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Info, Copy } from "lucide-react";
import { toast } from "sonner";

const UUID_VERSIONS: Record<string, string> = {
  "1": "Version 1 (Time-based)",
  "2": "Version 2 (DCE Security)",
  "3": "Version 3 (Name-based, MD5)",
  "4": "Version 4 (Random)",
  "5": "Version 5 (Name-based, SHA-1)",
  "6": "Version 6 (Time-reordered)",
  "7": "Version 7 (Unix Epoch time-based)",
  "8": "Version 8 (Custom)",
};

const UUID_VARIANTS: Record<string, string> = {
  "0": "Apollo NCS variant",
  "2": "RFC 4122 standard variant",
  "6": "RFC 4122 standard variant",
  "e": "Microsoft COM variant",
  "f": "Reserved",
};

interface UUIDInfo {
  valid: boolean;
  version: string;
  variant: string;
  formatted: string;
  uppercase: string;
  urnFormat: string;
}

function validateUUID(input: string): UUIDInfo {
  const clean = input.trim().toLowerCase().replace(/^urn:uuid:/i, "").replace(/^{|}$/g, "");
  const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!re.test(clean)) {
    return { valid: false, version: "Unknown", variant: "Unknown", formatted: clean, uppercase: clean.toUpperCase(), urnFormat: "" };
  }
  const version = clean[14];
  const variantBits = parseInt(clean[19], 16) >> 2;
  const variantKey = variantBits >= 14 ? "f" : variantBits >= 12 ? "e" : variantBits >= 8 ? "6" : "0";
  return {
    valid: true,
    version: UUID_VERSIONS[version] ?? `Unknown version (${version})`,
    variant: UUID_VARIANTS[variantKey] ?? "Unknown",
    formatted: clean,
    uppercase: clean.toUpperCase(),
    urnFormat: `urn:uuid:${clean}`,
  };
}

const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

export function UuidValidatorTool() {
  const [input, setInput] = useState("550e8400-e29b-41d4-a716-446655440000");

  const result = useMemo(() => input.trim() ? validateUUID(input) : null, [input]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">UUID Validator</span>
        </div>
        <span className="text-[10px] text-emerald-500 font-medium">● Live</span>
      </div>
      <div className="p-5 space-y-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono text-sm"
          placeholder="550e8400-e29b-41d4-a716-446655440000"
        />

        {result && (
          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.valid ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
              {result.valid
                ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                : <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
              <div>
                <p className={`font-medium ${result.valid ? "text-emerald-500" : "text-red-500"}`}>
                  {result.valid ? "Valid UUID" : "Invalid UUID"}
                </p>
                {!result.valid && <p className="text-xs text-muted-foreground">Expected: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</p>}
              </div>
            </div>

            {result.valid && (
              <div className="space-y-1.5">
                {[
                  ["Version", result.version],
                  ["Variant", result.variant],
                  ["Lowercase", result.formatted],
                  ["Uppercase", result.uppercase],
                  ["URN Format", result.urnFormat],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-muted/10">
                    <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
                    <code className="text-xs font-mono break-all flex-1 text-right">{val}</code>
                    <button onClick={() => copy(val)} className="p-1 rounded hover:bg-muted shrink-0">
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-0.5 pt-1 border-t border-border">
          <p className="font-medium mb-1">Accepted formats</p>
          <p className="font-mono opacity-70">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</p>
          <p className="font-mono opacity-70">{"{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}"}</p>
          <p className="font-mono opacity-70">urn:uuid:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</p>
        </div>
      </div>
    </div>
  );
}
