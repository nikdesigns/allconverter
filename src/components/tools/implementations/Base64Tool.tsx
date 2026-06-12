"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Mode = "encode" | "decode";

export function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const process = () => {
    const src = input.trim();
    if (!src) return;
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(src))));
        setError("");
      } else {
        setOutput(decodeURIComponent(escape(atob(src))));
        setError("");
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 input" : "Encoding failed");
      setOutput("");
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setError("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Mode selector */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex bg-muted rounded-lg p-0.5">
          {(["encode", "decode"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(""); setError(""); }}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize",
                mode === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          {mode === "encode" ? "Text → Base64" : "Base64 → Text"}
        </Badge>
        <Button size="sm" variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }} className="ml-auto h-8 text-xs">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Input */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
            {mode === "encode" ? "Text Input" : "Base64 Input"}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
            className="font-mono text-sm min-h-[140px] resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button onClick={process} className="gap-2">
            {mode === "encode" ? (
              <><ArrowDown className="w-4 h-4" /> Encode to Base64</>
            ) : (
              <><ArrowUp className="w-4 h-4" /> Decode from Base64</>
            )}
          </Button>
          {output && (
            <Button variant="outline" size="sm" onClick={swap} className="gap-1.5">
              Swap ↕
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {mode === "encode" ? "Base64 Output" : "Decoded Text"}
              </label>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-muted hover:bg-accent transition-all"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="font-mono text-sm bg-muted rounded-xl p-4 break-all leading-relaxed min-h-[80px]">
              {output}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {output.length.toLocaleString()} characters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
