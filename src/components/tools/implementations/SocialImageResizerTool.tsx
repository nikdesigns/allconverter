"use client";

import { useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Download, Monitor } from "lucide-react";
import { toast } from "sonner";

interface Preset { label: string; width: number; height: number; }

const PRESETS: Record<string, Preset[]> = {
  "social-image-resizer": [
    { label: "Instagram Square", width: 1080, height: 1080 },
    { label: "Instagram Portrait", width: 1080, height: 1350 },
    { label: "Instagram Story", width: 1080, height: 1920 },
    { label: "Facebook Post", width: 1200, height: 630 },
    { label: "Facebook Cover", width: 820, height: 312 },
    { label: "Twitter Post", width: 1200, height: 675 },
    { label: "Twitter Header", width: 1500, height: 500 },
    { label: "LinkedIn Post", width: 1200, height: 627 },
    { label: "LinkedIn Cover", width: 1584, height: 396 },
    { label: "YouTube Thumbnail", width: 1280, height: 720 },
    { label: "YouTube Channel Art", width: 2560, height: 1440 },
    { label: "Pinterest Pin", width: 1000, height: 1500 },
  ],
  "instagram-image-resizer": [
    { label: "Square Post", width: 1080, height: 1080 },
    { label: "Portrait Post", width: 1080, height: 1350 },
    { label: "Landscape Post", width: 1080, height: 566 },
    { label: "Story / Reel", width: 1080, height: 1920 },
    { label: "Profile Picture", width: 320, height: 320 },
  ],
  "youtube-thumbnail-resizer": [
    { label: "Standard Thumbnail", width: 1280, height: 720 },
    { label: "Channel Art Banner", width: 2560, height: 1440 },
    { label: "Channel Icon", width: 800, height: 800 },
    { label: "End Screen", width: 1280, height: 720 },
  ],
  "facebook-cover-resizer": [
    { label: "Page Cover", width: 820, height: 312 },
    { label: "Profile Cover", width: 851, height: 315 },
    { label: "Event Cover", width: 1920, height: 1005 },
    { label: "Group Cover", width: 1640, height: 856 },
    { label: "Post Image", width: 1200, height: 630 },
  ],
  "twitter-image-resizer": [
    { label: "Tweet Image", width: 1200, height: 675 },
    { label: "Header Photo", width: 1500, height: 500 },
    { label: "Profile Picture", width: 400, height: 400 },
    { label: "Card Summary Large", width: 1200, height: 628 },
  ],
};

const TITLES: Record<string, string> = {
  "social-image-resizer": "Social Media Image Resizer",
  "instagram-image-resizer": "Instagram Image Resizer",
  "youtube-thumbnail-resizer": "YouTube Image Resizer",
  "facebook-cover-resizer": "Facebook Image Resizer",
  "twitter-image-resizer": "Twitter/X Image Resizer",
};

type FitMode = "cover" | "contain" | "stretch";

export function SocialImageResizerTool() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "social-image-resizer";
  const presets = PRESETS[slug] ?? PRESETS["social-image-resizer"];
  const title = TITLES[slug] ?? "Social Media Image Resizer";

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [selected, setSelected] = useState(0);
  const [fit, setFit] = useState<FitMode>("cover");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fileName, setFileName] = useState("image");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    const reader = new FileReader();
    reader.onload = e => setImgSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const generate = useCallback((preset: Preset, fitMode: FitMode, bg: string): Promise<string> => {
    return new Promise(resolve => {
      if (!imgSrc) { resolve(""); return; }
      const canvas = document.createElement("canvas");
      canvas.width = preset.width; canvas.height = preset.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, preset.width, preset.height);
      const img = new window.Image();
      img.onload = () => {
        if (fitMode === "stretch") {
          ctx.drawImage(img, 0, 0, preset.width, preset.height);
        } else {
          const imgRatio = img.naturalWidth / img.naturalHeight;
          const canvasRatio = preset.width / preset.height;
          let sw, sh, sx, sy;
          if (fitMode === "cover") {
            if (imgRatio > canvasRatio) { sh = img.naturalHeight; sw = sh * canvasRatio; sx = (img.naturalWidth - sw) / 2; sy = 0; }
            else { sw = img.naturalWidth; sh = sw / canvasRatio; sx = 0; sy = (img.naturalHeight - sh) / 2; }
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, preset.width, preset.height);
          } else {
            let dw, dh, dx, dy;
            if (imgRatio > canvasRatio) { dw = preset.width; dh = dw / imgRatio; dx = 0; dy = (preset.height - dh) / 2; }
            else { dh = preset.height; dw = dh * imgRatio; dy = 0; dx = (preset.width - dw) / 2; }
            ctx.drawImage(img, dx, dy, dw, dh);
          }
        }
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
      img.src = imgSrc;
    });
  }, [imgSrc]);

  const download = async () => {
    const preset = presets[selected];
    const dataUrl = await generate(preset, fit, bgColor);
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${fileName}_${preset.width}x${preset.height}.jpg`;
    a.click();
    toast.success(`Downloaded ${preset.width}×${preset.height}`);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Monitor className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="p-5 space-y-4">
        <div
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}>
          {imgSrc
            ? <img src={imgSrc} alt="preview" className="max-h-32 mx-auto rounded-lg object-contain" />
            : <><Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm font-medium">Upload image</p></>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);}} />

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Select size preset</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {presets.map((p, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ${selected===i?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground hover:bg-muted/20"}`}>
                <span className="font-medium">{p.label}</span>
                <span className="font-mono opacity-60">{p.width}×{p.height}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Fit mode</label>
            <div className="flex gap-1.5">
              {(["cover","contain","stretch"] as FitMode[]).map(m => (
                <button key={m} onClick={() => setFit(m)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-medium transition-all ${fit===m?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          {fit === "contain" && (
            <div className="w-28">
              <label className="text-xs text-muted-foreground mb-1 block">BG color</label>
              <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)} className="w-full h-10 rounded-xl border border-input cursor-pointer p-1" />
            </div>
          )}
        </div>

        <Button onClick={download} disabled={!imgSrc} className="w-full gap-2">
          <Download className="w-4 h-4" />Download {presets[selected].width}×{presets[selected].height}
        </Button>
      </div>
    </div>
  );
}
