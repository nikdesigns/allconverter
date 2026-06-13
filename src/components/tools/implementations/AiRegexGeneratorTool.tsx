"use client";

import { useState, useMemo } from "react";
import { Sparkles, Copy, Play, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RegexEntry {
  label: string;
  pattern: string;
  flags: string;
  explanation: string;
  example: string;
  category: string;
}

const PATTERN_LIBRARY: RegexEntry[] = [
  // Email
  { label: "Email Address", pattern: `[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}`, flags: "g", explanation: "Matches standard email addresses. Allows dots, plus signs, hyphens and underscores in the local part.", example: "user@example.com", category: "contact" },
  // Phone numbers
  { label: "Indian Mobile Number", pattern: `(?:\\+91|91|0)?[6-9]\\d{9}`, flags: "g", explanation: "Matches Indian mobile numbers starting with 6-9, optionally prefixed with +91, 91, or 0.", example: "+91 9876543210", category: "contact" },
  { label: "US Phone Number", pattern: `(?:\\+1[\\s.-]?)?\\(?[2-9]\\d{2}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}`, flags: "g", explanation: "Matches US phone numbers in various formats: (555) 123-4567, 555-123-4567, +1 555.123.4567.", example: "(555) 123-4567", category: "contact" },
  // URL
  { label: "URL (HTTP/HTTPS)", pattern: `https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&\\/=]*)`, flags: "gi", explanation: "Matches HTTP and HTTPS URLs including paths, query strings and fragments.", example: "https://example.com/page?q=1", category: "web" },
  { label: "Domain Name", pattern: `(?:[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}`, flags: "g", explanation: "Matches domain names including subdomains.", example: "www.example.com", category: "web" },
  { label: "IPv4 Address", pattern: `(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)`, flags: "g", explanation: "Matches valid IPv4 addresses (0-255 in each octet).", example: "192.168.1.1", category: "web" },
  // Dates
  { label: "Date (DD/MM/YYYY)", pattern: `(?:0[1-9]|[12]\\d|3[01])\\/(?:0[1-9]|1[0-2])\\/(?:19|20)\\d{2}`, flags: "g", explanation: "Matches dates in DD/MM/YYYY format from 1900 to 2099.", example: "25/12/2024", category: "date" },
  { label: "Date (YYYY-MM-DD)", pattern: `(?:19|20)\\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])`, flags: "g", explanation: "Matches ISO 8601 dates in YYYY-MM-DD format.", example: "2024-12-25", category: "date" },
  { label: "Time (HH:MM)", pattern: `(?:[01]\\d|2[0-3]):[0-5]\\d`, flags: "g", explanation: "Matches 24-hour time in HH:MM format.", example: "14:30", category: "date" },
  // Numbers
  { label: "Integer Number", pattern: `-?\\d+`, flags: "g", explanation: "Matches positive and negative integers.", example: "42, -7, 1000", category: "number" },
  { label: "Decimal / Float", pattern: `-?\\d+(?:\\.\\d+)?`, flags: "g", explanation: "Matches integers and decimal numbers.", example: "3.14, -2.5, 100", category: "number" },
  { label: "Currency Amount", pattern: `[£$€₹]?\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?`, flags: "g", explanation: "Matches currency amounts with optional symbol, thousands separators and 2 decimal places.", example: "$1,234.56", category: "number" },
  { label: "Percentage", pattern: `\\d+(?:\\.\\d+)?%`, flags: "g", explanation: "Matches percentage values like 50%, 3.5%.", example: "99.9%", category: "number" },
  // Security
  { label: "Strong Password", pattern: `(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}`, flags: "", explanation: "Validates passwords with at least 8 chars, one uppercase, one lowercase, one digit, and one special character.", example: "Secure@123", category: "security" },
  { label: "Credit Card Number", pattern: `(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})`, flags: "g", explanation: "Matches Visa, Mastercard, Amex and Discover credit card numbers.", example: "4111111111111111", category: "security" },
  { label: "UUID / GUID", pattern: `[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}`, flags: "gi", explanation: "Matches UUIDs in the standard xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx format.", example: "550e8400-e29b-41d4-a716-446655440000", category: "security" },
  // Code
  { label: "HTML Tag", pattern: `<([a-z]+)([^<]+)*(?:>(.*?)<\\/\\1>|\\s+\\/>)`, flags: "gi", explanation: "Matches HTML tags including attributes and content. Note: for robust HTML parsing, use a proper HTML parser.", example: "<p class='text'>Hello</p>", category: "code" },
  { label: "Hex Color Code", pattern: `#(?:[0-9a-fA-F]{3}){1,2}`, flags: "g", explanation: "Matches CSS hex color codes — both shorthand (#fff) and full (#ffffff) forms.", example: "#ff5733", category: "code" },
  { label: "JavaScript Variable Name", pattern: `[a-zA-Z_$][a-zA-Z0-9_$]*`, flags: "g", explanation: "Matches valid JavaScript/TypeScript identifier names.", example: "myVariable, _count, $price", category: "code" },
  // India-specific
  { label: "Indian PAN Card", pattern: `[A-Z]{5}[0-9]{4}[A-Z]{1}`, flags: "g", explanation: "Matches Indian PAN card numbers in the format AAAAA9999A.", example: "ABCDE1234F", category: "india" },
  { label: "Indian Aadhaar Number", pattern: `[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}`, flags: "g", explanation: "Matches Aadhaar numbers in the formatted XXXX XXXX XXXX pattern.", example: "2345 6789 0123", category: "india" },
  { label: "Indian Pincode", pattern: `[1-9][0-9]{5}`, flags: "g", explanation: "Matches 6-digit Indian postal PIN codes (first digit 1-9).", example: "400001", category: "india" },
  { label: "GST Number", pattern: `[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}`, flags: "g", explanation: "Matches Indian GST Identification Numbers (GSTIN).", example: "29ABCDE1234F1Z5", category: "india" },
];

const KEYWORDS: Record<string, string[]> = {
  "email": ["email"],
  "indian mobile": ["indian mobile", "india phone", "mobile number india", "+91"],
  "us phone": ["us phone", "american phone", "phone number"],
  "url": ["url", "link", "website", "http"],
  "domain": ["domain", "hostname"],
  "ipv4": ["ip address", "ipv4", "ip4"],
  "date dd/mm": ["dd/mm", "date format india", "indian date", "day month year"],
  "date yyyy-mm-dd": ["iso date", "yyyy-mm", "iso 8601"],
  "time": ["time", "hh:mm", "24 hour"],
  "integer": ["integer", "whole number", "int"],
  "decimal": ["decimal", "float", "number with dot", "price"],
  "currency": ["currency", "money", "amount", "price with symbol"],
  "percentage": ["percent", "percentage", "%"],
  "strong password": ["password", "secure password", "strong password"],
  "credit card": ["credit card", "card number", "visa", "mastercard"],
  "uuid": ["uuid", "guid"],
  "html tag": ["html tag", "html element", "<", ">"],
  "hex color": ["hex color", "color code", "#", "colour"],
  "javascript variable": ["variable name", "identifier", "javascript variable"],
  "pan card": ["pan card", "pan number"],
  "aadhaar": ["aadhaar", "aadhar"],
  "pincode": ["pincode", "pin code", "postal code india", "zip india"],
  "gst": ["gst", "gstin", "gst number"],
};

function findPattern(query: string): RegexEntry | null {
  const q = query.toLowerCase();
  for (const [key, kws] of Object.entries(KEYWORDS)) {
    if (kws.some(kw => q.includes(kw))) {
      const found = PATTERN_LIBRARY.find(p => p.label.toLowerCase().includes(key));
      if (found) return found;
    }
  }
  // fallback: search label directly
  return PATTERN_LIBRARY.find(p => p.label.toLowerCase().split(" ").some(w => q.includes(w))) ?? null;
}

const CATEGORIES = ["all", "contact", "web", "date", "number", "security", "code", "india"];

export function AiRegexGeneratorTool() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<RegexEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [testStr, setTestStr] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const generate = () => {
    if (!query.trim()) return;
    const r = findPattern(query);
    setResult(r);
    setNotFound(!r);
    setTestStr("");
  };

  const testMatches = useMemo(() => {
    if (!result || !testStr) return null;
    try {
      const rx = new RegExp(result.pattern, result.flags || "g");
      const matches = [...testStr.matchAll(rx)].map(m => m[0]);
      return matches;
    } catch {
      return null;
    }
  }, [result, testStr]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const filtered = activeCategory === "all"
    ? PATTERN_LIBRARY
    : PATTERN_LIBRARY.filter(p => p.category === activeCategory);

  const pick = (entry: RegexEntry) => {
    setResult(entry);
    setNotFound(false);
    setQuery(entry.label);
    setTestStr("");
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">AI Regex Generator</span>
        <span className="ml-auto text-[10px] text-muted-foreground">Plain English → Regex</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          <Input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
            placeholder={`Describe what to match — e.g. "Indian mobile number"`}
            className="text-sm h-10" />
          <Button onClick={generate} disabled={!query.trim()} className="h-10 px-4 gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5" /> Generate
          </Button>
        </div>

        {notFound && (
          <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-sm text-amber-400">
            No match found. Try a different description or pick from the library below.
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{result.label}</span>
                <Button size="sm" variant="ghost" onClick={() => copy(`/${result.pattern}/${result.flags}`)} className="h-7 text-xs gap-1">
                  <Copy className="w-3 h-3" /> Copy Pattern
                </Button>
              </div>

              <div className="rounded-lg bg-background border border-border p-3 font-mono text-sm break-all text-primary">
                /{result.pattern}/{result.flags}
              </div>

              <p className="text-sm text-muted-foreground">{result.explanation}</p>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Example match:</span>
                <code className="px-2 py-0.5 rounded bg-muted/30 text-foreground">{result.example}</code>
              </div>
            </div>

            {/* Copy variants */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: "JavaScript",  val: `/${result.pattern}/${result.flags}` },
                { label: "Python",       val: `r"${result.pattern}"` },
                { label: "Raw Pattern", val: result.pattern },
                { label: "with Flags",  val: `(?${result.flags})${result.pattern}` },
              ].map(v => (
                <button key={v.label} onClick={() => copy(v.val)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
                  <Copy className="w-3 h-3 shrink-0" /> {v.label}
                </button>
              ))}
            </div>

            {/* Live tester */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Live Tester</div>
              <Input value={testStr} onChange={e => setTestStr(e.target.value)}
                placeholder="Paste text here to test the regex…" className="text-sm h-9" />
              {testStr && testMatches !== null && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {testMatches.length > 0
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    <span className="text-xs text-muted-foreground">
                      {testMatches.length > 0 ? `${testMatches.length} match${testMatches.length > 1 ? "es" : ""} found` : "No matches"}
                    </span>
                  </div>
                  {testMatches.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {testMatches.slice(0, 20).map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pattern Library */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pattern Library</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={cn("px-3 py-1 rounded-full border text-xs font-medium capitalize transition-all",
                  activeCategory === c
                    ? "border-primary/50 bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}>
                {c}
              </button>
            ))}
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {filtered.map(entry => (
              <button key={entry.label} onClick={() => pick(entry)}
                className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all",
                  result?.label === entry.label
                    ? "border-primary/40 bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-muted/20"
                )}>
                <div>
                  <div className="text-xs font-medium">{entry.label}</div>
                  <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[280px]">
                    /{entry.pattern.slice(0, 40)}{entry.pattern.length > 40 ? "…" : ""}/
                  </div>
                </div>
                <Play className="w-3 h-3 text-muted-foreground shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
