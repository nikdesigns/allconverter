"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CHARSET = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-rose-500" };
  if (score <= 4) return { score, label: "Fair", color: "bg-amber-500" };
  if (score <= 5) return { score, label: "Good", color: "bg-sky-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [bulk, setBulk] = useState<string[]>([]);

  const generate = useCallback((len = length) => {
    let charset = "";
    if (options.upper) charset += CHARSET.upper;
    if (options.lower) charset += CHARSET.lower;
    if (options.numbers) charset += CHARSET.numbers;
    if (options.symbols) charset += CHARSET.symbols;
    if (!charset) charset = CHARSET.lower;

    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    const pwd = Array.from(arr, (b) => charset[b % charset.length]).join("");
    setPassword(pwd);
    setBulk([]);
    return pwd;
  }, [length, options]);

  const generateBulk = () => {
    const passwords = Array.from({ length: 10 }, () => {
      let charset = "";
      if (options.upper) charset += CHARSET.upper;
      if (options.lower) charset += CHARSET.lower;
      if (options.numbers) charset += CHARSET.numbers;
      if (options.symbols) charset += CHARSET.symbols;
      if (!charset) charset = CHARSET.lower;
      const arr = new Uint8Array(length);
      crypto.getRandomValues(arr);
      return Array.from(arr, (b) => charset[b % charset.length]).join("");
    });
    setBulk(passwords);
    setPassword("");
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Password copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = password ? getStrength(password) : null;

  const toggleOption = (key: keyof typeof options) => {
    const newOpts = { ...options, [key]: !options[key] };
    const hasAny = Object.values(newOpts).some(Boolean);
    if (!hasAny) return;
    setOptions(newOpts);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Password Generator</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Length slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Length
            </label>
            <span className="text-sm font-bold tabular-nums text-foreground">
              {length}
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-primary h-1.5"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>6</span>
            <span>64</span>
          </div>
        </div>

        {/* Options */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2.5 block">
            Character Types
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(options) as Array<keyof typeof options>).map((key) => (
              <button
                key={key}
                onClick={() => toggleOption(key)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all",
                  options[key]
                    ? "border-primary/40 bg-primary/8 text-foreground"
                    : "border-border bg-transparent text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0",
                    options[key] ? "bg-primary border-primary text-primary-foreground" : "border-border"
                  )}
                >
                  {options[key] && "✓"}
                </span>
                <span className="capitalize">{key}</span>
                <span className="text-xs text-muted-foreground ml-auto font-mono">
                  {key === "upper" ? "A–Z" : key === "lower" ? "a–z" : key === "numbers" ? "0–9" : "!@#"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate buttons */}
        <div className="flex gap-2">
          <Button onClick={() => generate()} className="flex-1 gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate Password
          </Button>
          <Button variant="outline" onClick={generateBulk} className="gap-1.5 text-xs">
            Bulk (10)
          </Button>
        </div>

        {/* Result */}
        {password && (
          <div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <p className="font-mono text-lg font-semibold break-all flex-1 leading-relaxed">
                  {password}
                </p>
                <button
                  onClick={() => copy(password)}
                  className="shrink-0 p-2 rounded-lg hover:bg-muted transition-all"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Strength meter */}
              {strength && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Strength</span>
                    <span className="text-xs font-semibold">{strength.label}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-all",
                          i < strength.score ? strength.color : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bulk results */}
        {bulk.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              10 Generated Passwords
            </p>
            <div className="space-y-1.5">
              {bulk.map((pwd, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted/30 transition-all cursor-pointer group"
                  onClick={() => copy(pwd)}
                >
                  <span className="font-mono text-sm flex-1 truncate">{pwd}</span>
                  <Copy className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
