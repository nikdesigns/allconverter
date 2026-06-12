"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, QrCode, Copy, Link, Mail, Phone, Wifi, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CONTENT_TYPES = [
  { id: "url",   label: "URL",    icon: Link,           template: "https://allconverter.tools" },
  { id: "email", label: "Email",  icon: Mail,           template: "mailto:hello@example.com" },
  { id: "phone", label: "Phone",  icon: Phone,          template: "tel:+1234567890" },
  { id: "sms",   label: "SMS",    icon: MessageSquare,  template: "sms:+1234567890?body=Hello" },
  { id: "wifi",  label: "Wi-Fi",  icon: Wifi,           template: "WIFI:T:WPA;S:MyNetwork;P:password;;" },
  { id: "vcard", label: "vCard",  icon: User,           template: "BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nEMAIL:john@example.com\nTEL:+1234567890\nEND:VCARD" },
];

const COLOR_PRESETS = [
  { fg: "#000000", bg: "#ffffff", label: "Classic" },
  { fg: "#1e40af", bg: "#eff6ff", label: "Blue" },
  { fg: "#166534", bg: "#f0fdf4", label: "Green" },
  { fg: "#7c3aed", bg: "#faf5ff", label: "Purple" },
  { fg: "#be123c", bg: "#fff1f2", label: "Red" },
  { fg: "#ffffff", bg: "#111827", label: "Dark" },
];

export function QrCodeGeneratorTool() {
  const [activeType, setActiveType] = useState("url");
  const [content, setContent] = useState("https://allconverter.tools");
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState("#000000");
  const [fgHex, setFgHex] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgHex, setBgHex] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState<"L"|"M"|"Q"|"H">("M");
  const [margin, setMargin] = useState(2);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generate = useCallback(async () => {
    if (!content.trim()) return;
    setGenerating(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(content, {
        width: size,
        margin,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      });
      setQrDataUrl(url);
    } catch {
      toast.error("Failed to generate QR code");
    } finally {
      setGenerating(false);
    }
  }, [content, size, fgColor, bgColor, errorLevel, margin]);

  // Real-time: auto-generate on any change with 200ms debounce for typed content
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(generate, 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [generate]);

  const applyFgHex = (v: string) => {
    setFgHex(v);
    if (/^#[0-9a-f]{6}$/i.test(v)) setFgColor(v);
  };

  const applyBgHex = (v: string) => {
    setBgHex(v);
    if (/^#[0-9a-f]{6}$/i.test(v)) setBgColor(v);
  };

  const applyColorPreset = (fg: string, bg: string) => {
    setFgColor(fg); setFgHex(fg);
    setBgColor(bg); setBgHex(bg);
  };

  const downloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
    toast.success("Downloaded PNG");
  };

  const downloadSvg = async () => {
    if (!content.trim()) return;
    try {
      const QRCode = (await import("qrcode")).default;
      const svg = await QRCode.toString(content, {
        type: "svg",
        margin,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "qrcode.svg";
      a.click();
      toast.success("Downloaded SVG");
    } catch {
      toast.error("SVG export failed");
    }
  };

  const copyImage = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Copy not supported in this browser");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">QR Code Generator</span>
          {generating && (
            <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          )}
        </div>
        <span className="text-[10px] text-emerald-500 font-medium">● Updates in real time</span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6">

          {/* ── Left: controls ── */}
          <div className="space-y-5">

            {/* Content type tabs */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Content Type</label>
              <div className="flex flex-wrap gap-1.5">
                {CONTENT_TYPES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveType(t.id);
                        setContent(t.template);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
                        activeType === t.id
                          ? "border-[var(--border-brand)] bg-[var(--brand-softer)] text-[var(--fg-brand)]"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content input */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                placeholder="Enter URL, text, phone number…"
              />
            </div>

            {/* Color theme presets */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Color Theme</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyColorPreset(p.fg, p.bg)}
                    title={p.label}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] text-muted-foreground hover:text-foreground transition-all",
                      fgColor === p.fg && bgColor === p.bg
                        ? "border-[var(--border-brand)] bg-[var(--brand-softer)]"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="flex shrink-0">
                      <div className="w-3 h-3 rounded-l-sm border border-border/40" style={{ backgroundColor: p.fg }} />
                      <div className="w-3 h-3 rounded-r-sm border border-border/40 border-l-0" style={{ backgroundColor: p.bg }} />
                    </div>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Foreground Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => { setFgColor(e.target.value); setFgHex(e.target.value); }}
                    className="w-9 h-9 rounded-lg border border-input cursor-pointer p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={fgHex}
                    onChange={(e) => applyFgHex(e.target.value)}
                    maxLength={7}
                    className="flex-1 h-9 px-3 rounded-xl border border-input bg-background text-sm font-mono uppercase"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => { setBgColor(e.target.value); setBgHex(e.target.value); }}
                    className="w-9 h-9 rounded-lg border border-input cursor-pointer p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgHex}
                    onChange={(e) => applyBgHex(e.target.value)}
                    maxLength={7}
                    className="flex-1 h-9 px-3 rounded-xl border border-input bg-background text-sm font-mono uppercase"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            {/* Size / margin / error */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Output Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(+e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  {[200, 300, 400, 512, 1024].map((s) => (
                    <option key={s} value={s}>{s}px</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Quiet Margin: <span className="text-foreground font-medium">{margin}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={6}
                  value={margin}
                  onChange={(e) => setMargin(+e.target.value)}
                  className="w-full mt-2 accent-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Error Correction</label>
                <select
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value as "L"|"M"|"Q"|"H")}
                  className="w-full h-9 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  <option value="L">L — Low (7%)</option>
                  <option value="M">M — Medium (15%)</option>
                  <option value="Q">Q — Quartile (25%)</option>
                  <option value="H">H — High (30%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Right: live preview ── */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-full aspect-square rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-colors duration-300 relative"
              style={{ backgroundColor: bgColor }}
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <QrCode className="w-16 h-16 opacity-10" style={{ color: fgColor }} />
              )}
              {generating && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px]">
                  <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              )}
            </div>

            {/* Download / copy */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPng}
                disabled={!qrDataUrl}
                className="gap-1 text-xs h-8"
              >
                <Download className="w-3 h-3" /> PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSvg}
                disabled={!content.trim()}
                className="gap-1 text-xs h-8"
              >
                <Download className="w-3 h-3" /> SVG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyImage}
                disabled={!qrDataUrl}
                className="gap-1 text-xs h-8"
              >
                <Copy className="w-3 h-3" /> Copy
              </Button>
            </div>

            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
              QR updates instantly as you type or change colors
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
