"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadZone } from "@/components/tools/shared/FileUploadZone";
import { Download, Shapes } from "lucide-react";
import { toast } from "sonner";

export function SvgToPngTool() {
  const [svgText, setSvgText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(2);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [transparent, setTransparent] = useState(false);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputSize, setOutputSize] = useState({ w: 0, h: 0 });
  const [processing, setProcessing] = useState(false);

  const handleFile = (files: File[]) => {
    const f = files[0]; setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setSvgText(e.target?.result as string ?? "");
    reader.readAsText(f);
  };

  const convert = () => {
    const src = svgText.trim();
    if (!src) { toast.error("Please upload or paste an SVG first"); return; }
    setProcessing(true);

    const img = new Image();
    const blob = new Blob([src], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const w = (img.naturalWidth || 800) * scale;
      const h = (img.naturalHeight || 600) * scale;
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      if (!transparent) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) { setOutputUrl(URL.createObjectURL(pngBlob)); setOutputSize({ w, h }); }
        setProcessing(false);
        toast.success("SVG converted to PNG");
      }, "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast.error("Invalid SVG"); setProcessing(false); };
    img.src = url;
  };

  const outputName = (file?.name ?? "image").replace(/\.svg$/i, "") + `_${outputSize.w}x${outputSize.h}.png`;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Shapes className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">SVG to PNG Converter</span>
      </div>
      <div className="p-5 space-y-4">
        <FileUploadZone accept=".svg,image/svg+xml" onFiles={handleFile} label="Drop an SVG file here" sublabel="Or paste SVG code below" />

        <Textarea value={svgText} onChange={(e) => setSvgText(e.target.value)}
          placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>'
          className="font-mono text-xs min-h-[120px] resize-none" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Scale</label>
            <div className="flex bg-muted rounded-lg p-0.5">
              {[1,2,3,4].map(s => (
                <button key={s} onClick={() => setScale(s)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${scale===s?"bg-background shadow-sm text-foreground":"text-muted-foreground"}`}>
                  {s}×
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Background</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                disabled={transparent} className="w-10 h-10 rounded-lg border border-input cursor-pointer disabled:opacity-40" />
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="accent-primary" />
                Transparent
              </label>
            </div>
          </div>
        </div>

        <Button onClick={convert} disabled={processing || !svgText.trim()} className="w-full gap-2">
          {processing ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Converting…</> : "Convert to PNG"}
        </Button>

        {outputUrl && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-4">
            <img src={outputUrl} alt="PNG" className="w-14 h-14 object-contain rounded-lg border" style={{ background: transparent ? "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQoU2NkYGBg+M9AABBICAQABTABBFDFoT0AAAAASUVORK5CYII=\")" : bgColor }} />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">PNG: {outputSize.w}×{outputSize.h}px</p>
              <p className="text-xs text-muted-foreground">{scale}× scale</p>
            </div>
            <a href={outputUrl} download={outputName}>
              <Button size="sm" className="gap-1.5"><Download className="w-3.5 h-3.5" />Download</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
