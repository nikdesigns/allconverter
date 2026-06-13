"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Download, Copy, Link2, Share2, QrCode,
  CheckCircle2, AlertCircle, Smartphone, Upload, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── UPI app presets ────────────────────────────────────────────────────────────
const UPI_APPS = [
  { id: "gpay",     label: "Google Pay",   color: "#4285F4", bg: "#EFF6FF" },
  { id: "phonepe",  label: "PhonePe",      color: "#5F259F", bg: "#FAF5FF" },
  { id: "paytm",    label: "Paytm",        color: "#00BAF2", bg: "#EFF9FF" },
  { id: "bhim",     label: "BHIM",         color: "#1A3C87", bg: "#EFF2FF" },
  { id: "amazon",   label: "Amazon Pay",   color: "#FF9900", bg: "#FFF7E6" },
  { id: "any",      label: "Any UPI App",  color: "#059669", bg: "#ECFDF5" },
];

// ── Color presets ──────────────────────────────────────────────────────────────
const COLOR_PRESETS = [
  { label: "Classic",  fg: "#000000", bg: "#FFFFFF" },
  { label: "GPay",     fg: "#4285F4", bg: "#EFF6FF" },
  { label: "PhonePe",  fg: "#5F259F", bg: "#FAF5FF" },
  { label: "Paytm",    fg: "#00BAF2", bg: "#FFFFFF" },
  { label: "BHIM",     fg: "#1A3C87", bg: "#FFFFFF" },
  { label: "Dark",     fg: "#FFFFFF", bg: "#111827" },
];

// ── UPI ID validation ──────────────────────────────────────────────────────────
function validateUpiId(id: string): string | null {
  if (!id) return "UPI ID is required";
  if (!id.includes("@")) return "UPI ID must contain @  (e.g. name@upi)";
  const [handle, psp] = id.split("@");
  if (!handle || handle.length < 3) return "Handle before @ must be at least 3 characters";
  if (!psp || psp.length < 2) return "PSP/bank after @ is required (e.g. okaxis, paytm, ybl)";
  if (!/^[a-zA-Z0-9._-]+$/.test(handle)) return "Handle can only contain letters, numbers, dots, hyphens";
  return null;
}

// ── Build UPI URI ──────────────────────────────────────────────────────────────
function buildUpiUri(upiId: string, name: string, amount: string, note: string): string {
  const params = new URLSearchParams();
  params.set("pa", upiId.trim());
  params.set("pn", name.trim());
  if (amount && parseFloat(amount) > 0) params.set("am", parseFloat(amount).toFixed(2));
  if (note.trim()) params.set("tn", note.trim());
  params.set("cu", "INR");
  return `upi://pay?${params.toString()}`;
}

// ── Canvas: QR + centre logo overlay ──────────────────────────────────────────
async function renderQrWithLogo(
  dataUrl: string,
  logoSrc: string | null,
  outputSize: number,
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d")!;

    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, outputSize, outputSize);

      if (!logoSrc) { resolve(canvas.toDataURL("image/png")); return; }

      const logo = new Image();
      logo.onload = () => {
        const logoSize = outputSize * 0.22;
        const x = (outputSize - logoSize) / 2;
        const y = (outputSize - logoSize) / 2;
        const pad = logoSize * 0.12;
        const r = logoSize * 0.18;

        // White rounded rect background
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, r);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.12)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        // Clip logo to rounded rect
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x - pad + 2, y - pad + 2, logoSize + (pad - 2) * 2, logoSize + (pad - 2) * 2, r * 0.8);
        ctx.clip();
        ctx.drawImage(logo, x, y, logoSize, logoSize);
        ctx.restore();

        resolve(canvas.toDataURL("image/png"));
      };
      logo.src = logoSrc;
    };
    qrImg.src = dataUrl;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
export function UpiQrGeneratorTool() {
  // Inputs
  const [upiId, setUpiId]     = useState("merchant@upi");
  const [name, setName]       = useState("My Store");
  const [amount, setAmount]   = useState("");
  const [note, setNote]       = useState("");

  // QR customisation
  const [size, setSize]       = useState(400);
  const [margin, setMargin]   = useState(2);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  // State
  const [qrDataUrl, setQrDataUrl]   = useState("");
  const [finalUrl, setFinalUrl]     = useState("");
  const [upiUri, setUpiUri]         = useState("");
  const [generating, setGenerating] = useState(false);
  const [upiError, setUpiError]     = useState<string | null>(null);
  const [copied, setCopied]         = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Validate UPI ID on change
  useEffect(() => {
    setUpiError(validateUpiId(upiId));
  }, [upiId]);

  // QR generation
  const generate = useCallback(async () => {
    const err = validateUpiId(upiId);
    if (err || !name.trim()) return;

    setGenerating(true);
    try {
      const uri = buildUpiUri(upiId, name, amount, note);
      setUpiUri(uri);

      const QRCode = (await import("qrcode")).default;
      const raw = await QRCode.toDataURL(uri, {
        width: size,
        margin,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: logoSrc ? "H" : "M",
      });

      const final = await renderQrWithLogo(raw, logoSrc, size);
      setQrDataUrl(final);
      setFinalUrl(final);
    } catch {
      toast.error("Failed to generate QR code");
    } finally {
      setGenerating(false);
    }
  }, [upiId, name, amount, note, size, margin, fgColor, bgColor, logoSrc]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(generate, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [generate]);

  // Handlers
  const applyPreset = (fg: string, bg: string) => { setFgColor(fg); setBgColor(bg); };

  const applyApp = (app: typeof UPI_APPS[number]) => {
    applyPreset(app.color, app.bg);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setLogoSrc(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoSrc(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const downloadPng = () => {
    if (!finalUrl) return;
    const a = document.createElement("a");
    a.href = finalUrl;
    a.download = `upi-qr-${upiId.replace("@", "_")}.png`;
    a.click();
    toast.success("QR downloaded as PNG");
  };

  const downloadSvg = async () => {
    if (!upiUri) return;
    try {
      const QRCode = (await import("qrcode")).default;
      const svg = await QRCode.toString(upiUri, {
        type: "svg",
        margin,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: "M",
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `upi-qr-${upiId.replace("@", "_")}.svg`;
      a.click();
      toast.success("QR downloaded as SVG");
    } catch { toast.error("SVG export failed"); }
  };

  const copyLink = async () => {
    if (!upiUri) return;
    await navigator.clipboard.writeText(upiUri);
    setCopied(true);
    toast.success("UPI payment link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareQr = async () => {
    if (!finalUrl) return;
    if (navigator.share) {
      try {
        const res = await fetch(finalUrl);
        const blob = await res.blob();
        const file = new File([blob], "upi-qr.png", { type: "image/png" });
        await navigator.share({ title: `Pay ${name}`, text: upiUri, files: [file] });
      } catch { /* user cancelled */ }
    } else {
      copyLink();
    }
  };

  const isValid = !upiError && name.trim().length > 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">UPI QR Code Generator</span>
          {generating && (
            <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-medium text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live preview
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

          {/* ── Left: inputs + customisation ── */}
          <div className="space-y-5">

            {/* App selector */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Optimise for app
              </label>
              <div className="flex flex-wrap gap-2">
                {UPI_APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => applyApp(app)}
                    className={cn(
                      "px-3 py-1.5 rounded-full border text-xs font-semibold transition-all",
                      fgColor === app.color
                        ? "border-transparent text-white"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                    style={fgColor === app.color ? { backgroundColor: app.color } : {}}
                  >
                    {app.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Core UPI fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* UPI ID */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  UPI ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    value={upiId}
                    onChange={e => setUpiId(e.target.value.toLowerCase().trim())}
                    placeholder="merchant@upi or name@okaxis"
                    className={cn(
                      "h-10 text-sm font-mono pr-8",
                      upiId && upiError ? "border-rose-400 focus:ring-rose-400/30" :
                      upiId && !upiError ? "border-emerald-400 focus:ring-emerald-400/30" : ""
                    )}
                  />
                  {upiId && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {upiError
                        ? <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      }
                    </div>
                  )}
                </div>
                {upiId && upiError && (
                  <p className="text-[11px] text-rose-400 mt-1">{upiError}</p>
                )}
                {!upiError && upiId && (
                  <p className="text-[11px] text-emerald-500 mt-1">Valid UPI ID</p>
                )}
              </div>

              {/* Recipient Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Recipient Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value.slice(0, 50))}
                  placeholder="ABC Store"
                  className="h-10 text-sm"
                />
                <p className="text-[10px] text-muted-foreground mt-1 text-right">{name.length}/50</p>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Amount (₹) <span className="text-muted-foreground font-normal">— optional</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Leave blank to let payer choose"
                    min={0}
                    step="0.01"
                    className="h-10 text-sm pl-7"
                  />
                </div>
                {amount && parseFloat(amount) > 0 && (
                  <p className="text-[11px] text-emerald-500 mt-1">Fixed amount: ₹{parseFloat(amount).toFixed(2)}</p>
                )}
              </div>

              {/* Transaction Note */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Transaction Note <span className="text-muted-foreground font-normal">— optional</span>
                </label>
                <Input
                  value={note}
                  onChange={e => setNote(e.target.value.slice(0, 50))}
                  placeholder="Invoice #1234, Donation, Order Payment…"
                  className="h-10 text-sm"
                />
                <p className="text-[10px] text-muted-foreground mt-1 text-right">{note.length}/50</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Customisation */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Customise QR
              </p>

              {/* Color presets */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Color theme</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p.fg, p.bg)}
                      title={p.label}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all",
                        fgColor === p.fg && bgColor === p.bg
                          ? "border-primary/60 bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      <div className="flex shrink-0">
                        <div className="w-3 h-3 rounded-l-[3px] border border-border/30" style={{ backgroundColor: p.fg }} />
                        <div className="w-3 h-3 rounded-r-[3px] border border-border/30 border-l-0" style={{ backgroundColor: p.bg }} />
                      </div>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom colors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">QR Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={e => setFgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-input cursor-pointer p-0.5 bg-transparent"
                    />
                    <Input
                      value={fgColor}
                      onChange={e => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && setFgColor(e.target.value)}
                      maxLength={7}
                      className="h-9 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Background</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={e => setBgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-input cursor-pointer p-0.5 bg-transparent"
                    />
                    <Input
                      value={bgColor}
                      onChange={e => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && setBgColor(e.target.value)}
                      maxLength={7}
                      className="h-9 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Size + Margin */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Output size</label>
                  <select
                    value={size}
                    onChange={e => setSize(+e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-input bg-background text-sm"
                  >
                    {[256, 400, 512, 1024].map(s => (
                      <option key={s} value={s}>{s}px{s >= 512 ? " (print)" : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Quiet margin: <span className="text-foreground font-medium">{margin}</span>
                  </label>
                  <input
                    type="range"
                    min={0} max={6} value={margin}
                    onChange={e => setMargin(+e.target.value)}
                    className="w-full mt-2.5 accent-primary"
                  />
                </div>
              </div>

              {/* Logo upload */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Centre logo <span className="text-muted-foreground font-normal">— PNG/SVG, optional</span>
                </label>
                {logoSrc ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-muted/30">
                    <img src={logoSrc} alt="Logo" className="w-10 h-10 object-contain rounded-lg border border-border bg-white p-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">Logo uploaded</p>
                      <p className="text-[10px] text-muted-foreground">Error correction set to High (H) automatically</p>
                    </div>
                    <button onClick={removeLogo} className="text-muted-foreground hover:text-rose-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/30 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload logo / icon
                  </button>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* ── Right: live preview ── */}
          <div className="flex flex-col gap-4">

            {/* QR preview */}
            <div
              className={cn(
                "relative w-full aspect-square rounded-2xl border-2 flex items-center justify-center overflow-hidden transition-all",
                isValid
                  ? "border-primary/20"
                  : "border-dashed border-border"
              )}
              style={{ backgroundColor: bgColor }}
            >
              {qrDataUrl && isValid ? (
                <img
                  src={qrDataUrl}
                  alt={`UPI QR Code for ${name}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center px-4">
                  <QrCode className="w-12 h-12 mx-auto mb-2 opacity-10" style={{ color: fgColor }} />
                  <p className="text-[11px] text-muted-foreground">
                    {upiError ? upiError : "Fill in UPI ID and name to generate"}
                  </p>
                </div>
              )}
              {generating && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[2px]">
                  <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              )}
            </div>

            {/* Supported apps badge row */}
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {["GPay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"].map((app) => (
                <span
                  key={app}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
                >
                  {app}
                </span>
              ))}
            </div>

            {/* UPI URI display */}
            {upiUri && isValid && (
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  UPI Payment Link
                </p>
                <p className="text-[11px] font-mono text-foreground break-all leading-relaxed">
                  {upiUri}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={downloadPng}
                disabled={!qrDataUrl || !isValid}
                size="sm"
                className="h-9 gap-1.5 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                Download PNG
              </Button>
              <Button
                onClick={downloadSvg}
                disabled={!isValid}
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download SVG
              </Button>
              <Button
                onClick={copyLink}
                disabled={!upiUri || !isValid}
                variant="outline"
                size="sm"
                className={cn("h-9 gap-1.5 text-xs", copied && "border-emerald-400 text-emerald-600")}
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
              <Button
                onClick={shareQr}
                disabled={!qrDataUrl || !isValid}
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share QR
              </Button>
            </div>

            {/* Usage note */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="flex items-start gap-2">
                <Smartphone className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  This QR works with Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, and any
                  UPI-enabled app. Your payment data is never sent to our servers.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
