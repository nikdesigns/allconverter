"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowDown, ArrowUp, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Mode = "encode" | "decode";

export function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [fullEncode, setFullEncode] = useState(false);

  const process = () => {
    const src = input.trim();
    if (!src) return;
    try {
      if (mode === "encode") {
        setOutput(fullEncode ? encodeURIComponent(src) : encodeURI(src));
        setError("");
      } else {
        setOutput(decodeURIComponent(src));
        setError("");
      }
    } catch (e: unknown) {
      setError((e as Error).message);
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
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
        <div className="flex bg-muted rounded-lg p-0.5">
          {(["encode", "decode"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(""); setError(""); }}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                mode === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m}
            </button>
          ))}
        </div>
        {mode === "encode" && (
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={fullEncode}
              onChange={(e) => setFullEncode(e.target.checked)}
              className="accent-primary"
            />
            Encode all characters (including /)
          </label>
        )}
        <Button size="sm" variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }} className="ml-auto h-8 text-xs">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">
            {mode === "encode" ? "URL / Text to Encode" : "Encoded URL to Decode"}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode"
              ? "https://example.com/path?q=hello world&name=John Doe"
              : "https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello%20world"}
            className="font-mono text-sm min-h-[120px] resize-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={process} className="gap-2">
            {mode === "encode" ? (
              <><ArrowDown className="w-4 h-4" /> Encode URL</>
            ) : (
              <><ArrowUp className="w-4 h-4" /> Decode URL</>
            )}
          </Button>
          {output && (
            <Button variant="outline" size="sm" onClick={swap}>
              Swap ↕
            </Button>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {mode === "encode" ? "Encoded Output" : "Decoded Output"}
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
          </div>
        )}
      </div>
    </div>
  );
}
