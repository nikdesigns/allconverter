"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Info } from "lucide-react";

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
  "0": "Apollo Network Computing System (NCS) variant",
  "2": "RFC 4122 / ITU-T X.667 variant (standard)",
  "6": "RFC 4122 / ITU-T X.667 variant (standard)",
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

function validateUUID(input: string): UUIDInfo | null {
  const clean = input.trim().toLowerCase().replace(/^urn:uuid:/i, "").replace(/^{|}$/g, "");
  const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!re.test(clean)) return { valid: false, version: "Unknown", variant: "Unknown", formatted: clean, uppercase: clean.toUpperCase(), urnFormat: "" };

  const version = clean[14];
  const variantChar = clean[19];
  const variantBits = parseInt(variantChar, 16) >> 2;
  let variantKey = "0";
  if (variantBits >= 14) variantKey = "f";
  else if (variantBits >= 12) variantKey = "e";
  else if (variantBits >= 8) variantKey = "6";
  else variantKey = "0";

  return {
    valid: true,
    version: UUID_VERSIONS[version] ?? `Unknown version (${version})`,
    variant: UUID_VARIANTS[variantKey] ?? "Unknown",
    formatted: clean,
    uppercase: clean.toUpperCase(),
    urnFormat: `urn:uuid:${clean}`,
  };
}

export function UuidValidatorTool() {
  const [input, setInput] = useState("550e8400-e29b-41d4-a716-446655440000");
  const [result, setResult] = useState<UUIDInfo | null>(null);

  const validate = () => { setResult(validateUUID(input)); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Info className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">UUID Validator</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          <Input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&validate()}
            className="font-mono text-sm flex-1" placeholder="550e8400-e29b-41d4-a716-446655440000" />
          <Button onClick={validate}>Validate</Button>
        </div>

        {result && (
          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.valid ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
              {result.valid ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              <div>
                <p className={`font-medium ${result.valid ? "text-emerald-500" : "text-red-500"}`}>
                  {result.valid ? "Valid UUID" : "Invalid UUID"}
                </p>
                {!result.valid && <p className="text-xs text-muted-foreground">Format should be xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</p>}
              </div>
            </div>
            {result.valid && (
              <div className="space-y-2">
                {[
                  ["Version", result.version],
                  ["Variant", result.variant],
                  ["Lowercase", result.formatted],
                  ["Uppercase", result.uppercase],
                  ["URN Format", result.urnFormat],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-start justify-between gap-3 p-3 rounded-xl border border-border bg-muted/10">
                    <span className="text-xs text-muted-foreground w-28 shrink-0">{label}</span>
                    <code className="text-xs font-mono break-all text-right">{val}</code>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Accepts formats:</p>
          <p className="font-mono">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</p>
          <p className="font-mono">{"{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}"}</p>
          <p className="font-mono">urn:uuid:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</p>
        </div>
      </div>
    </div>
  );
}
