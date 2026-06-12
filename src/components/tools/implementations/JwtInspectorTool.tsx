"use client";

import { useState, useMemo, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Copy, KeySquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function b64decode(str: string): string {
  try {
    const pad = str.replace(/-/g,"+").replace(/_/g,"/");
    return decodeURIComponent(atob(pad).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
  } catch { return str; }
}

function parseJwt(token: string) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(b64decode(parts[0]));
    const payload = JSON.parse(b64decode(parts[1]));
    return { header, payload, signature: parts[2], valid: parts.length === 3 };
  } catch { return null; }
}

const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtInspectorTool() {
  const [token, setToken] = useState(SAMPLE);

  const parsed = useMemo(() => parseJwt(token), [token]);

  const copy = (obj: unknown) => { navigator.clipboard.writeText(JSON.stringify(obj, null, 2)); toast.success("Copied!"); };

  const formatDate = (ts: number) => new Date(ts * 1000).toLocaleString();

  // Client-only "now" to avoid hydration mismatch (Date.now() differs server vs client)
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Math.floor(Date.now() / 1000));
  }, []);

  const expired = parsed?.payload?.exp && now > 0 ? parsed.payload.exp < now : null;

  const JsonView = ({ data, label }: { data: unknown; label: string }) => (
    <div className="w-full max-w-full rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/20 border-b border-border">
        <span className="text-xs font-medium">{label}</span>
        <button onClick={() => copy(data)} className="p-1 rounded hover:bg-muted"><Copy className="w-3 h-3" /></button>
      </div>
      <pre className="p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <KeySquare className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">JWT Inspector</span>
      </div>
      <div className="p-5 space-y-4">
        {/* JWT Token field with fixed/constrained width to prevent page overflow from long tokens */}
        <div className="w-full max-w-full">
          <label className="text-xs text-muted-foreground mb-1 block">JWT Token</label>
          <Textarea
            value={token}
            onChange={e => setToken(e.target.value)}
            className="min-h-[110px] w-full resize-y text-xs font-mono"
            style={{ wordBreak: "break-all", overflowWrap: "anywhere" }}
            placeholder="Paste a JWT token here…"
          />
        </div>

        {!parsed && token.trim() && (
          <div className="w-full max-w-full flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-500">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />Invalid JWT format — must have 3 dot-separated base64 parts.
          </div>
        )}

        {parsed && (
          <div className="space-y-3">
            {/* Status bar */}
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 className="w-3.5 h-3.5" />Valid structure</span>
              {parsed.header.alg && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">{parsed.header.alg}</span>}
              {parsed.payload.exp && (
                <span className={`flex items-center gap-1 ${expired ? "text-red-500" : "text-emerald-500"}`}>
                  {expired ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {expired ? `Expired ${formatDate(parsed.payload.exp)}` : `Expires ${formatDate(parsed.payload.exp)}`}
                </span>
              )}
              {parsed.payload.iat && <span className="text-muted-foreground">Issued {formatDate(parsed.payload.iat)}</span>}
            </div>

            <JsonView data={parsed.header} label="Header" />
            <JsonView data={parsed.payload} label="Payload" />

            <div className="w-full max-w-full rounded-xl border border-border overflow-hidden">
              <div className="px-3 py-2 bg-muted/20 border-b border-border">
                <span className="text-xs font-medium">Signature</span>
              </div>
              <div className="p-3 overflow-x-auto">
                <code className="text-xs font-mono text-muted-foreground break-all whitespace-pre-wrap">{parsed.signature}</code>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Decoded locally. Signature not verified — paste the secret in production tools for verification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
