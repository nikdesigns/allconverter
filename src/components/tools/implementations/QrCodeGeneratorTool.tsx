"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";
import { toast } from "sonner";

export function QrCodeGeneratorTool() {
  const [content, setContent] = useState("https://example.com");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = async () => {
    if (!content.trim()) return;
    setGenerating(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(content, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      });
      setQrDataUrl(url);
    } catch { toast.error("Failed to generate QR code"); }
    finally { setGenerating(false); }
  };

  useEffect(() => { if (content) generate(); }, []);

  const download = (format: "png" | "svg") => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qrcode.${format}`;
    a.click();
  };

  const PRESETS = [
    { label: "URL", val: "https://example.com" },
    { label: "Email", val: "mailto:hello@example.com" },
    { label: "Phone", val: "tel:+1234567890" },
    { label: "WiFi", val: "WIFI:T:WPA;S:MyNetwork;P:password;;" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <QrCode className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">QR Code Generator</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => setContent(p.val)}
              className="px-2.5 py-1 rounded-full border border-border text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
              {p.label}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Content (URL, text, phone…)</label>
          <Input value={content} onChange={e => setContent(e.target.value)} placeholder="https://example.com" className="font-mono text-sm" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Size (px)</label>
            <select value={size} onChange={e => setSize(+e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              {[128,256,512,1024].map(s => <option key={s} value={s}>{s}px</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Error correction</label>
            <select value={errorLevel} onChange={e => setErrorLevel(e.target.value as "L"|"M"|"Q"|"H")}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              <option value="L">L — Low (7%)</option>
              <option value="M">M — Medium (15%)</option>
              <option value="Q">Q — High (25%)</option>
              <option value="H">H — Max (30%)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Foreground</label>
            <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
              className="w-full h-10 rounded-xl border border-input cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Background</label>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
              className="w-full h-10 rounded-xl border border-input cursor-pointer" />
          </div>
        </div>

        <Button onClick={generate} disabled={generating || !content.trim()} className="w-full gap-2">
          {generating ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Generating…</> : <><QrCode className="w-4 h-4" />Generate QR Code</>}
        </Button>

        {qrDataUrl && (
          <div className="space-y-3">
            <div className="flex justify-center p-4 rounded-xl border border-border bg-white">
              <img src={qrDataUrl} alt="QR Code" className="max-w-[256px] w-full" />
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => download("png")} className="gap-1.5">
                <Download className="w-4 h-4" />PNG
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
