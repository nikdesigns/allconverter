"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/shared/FileUploadZone";
import { Download, Layers, Sliders } from "lucide-react";
import { toast } from "sonner";

function removeBackground(
  imageData: ImageData,
  tolerance: number,
  mode: "corner" | "white" | "green"
): ImageData {
  const data = imageData.data;
  let targetR: number, targetG: number, targetB: number;
  if (mode === "white") { targetR = 255; targetG = 255; targetB = 255; }
  else if (mode === "green") { targetR = 0; targetG = 200; targetB = 0; }
  else {
    targetR = data[0]; targetG = data[1]; targetB = data[2];
  }
  const out = new Uint8ClampedArray(data);
  for (let i = 0; i < data.length; i += 4) {
    const dr = Math.abs(data[i] - targetR);
    const dg = Math.abs(data[i+1] - targetG);
    const db = Math.abs(data[i+2] - targetB);
    const dist = Math.sqrt(dr*dr + dg*dg + db*db);
    if (dist < tolerance) {
      out[i+3] = 0;
    }
  }
  return new ImageData(out, imageData.width, imageData.height);
}

export function BackgroundRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [tolerance, setTolerance] = useState(40);
  const [mode, setMode] = useState<"corner" | "white" | "green">("corner");
  const [processing, setProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (files: File[]) => {
    const f = files[0]; setFile(f); setOutputUrl("");
    const url = URL.createObjectURL(f); setPreview(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; };
    img.src = url;
  };

  const process = () => {
    if (!imgRef.current || !file) return;
    setProcessing(true);
    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const processed = removeBackground(imgData, tolerance, mode);
    ctx.putImageData(processed, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) setOutputUrl(URL.createObjectURL(blob));
      setProcessing(false);
      toast.success("Background removed");
    }, "image/png");
  };

  const outputName = file ? file.name.replace(/\.[^.]+$/, "_nobg.png") : "nobg.png";

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Layers className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Background Remover</span>
      </div>
      <div className="p-5 space-y-4">
        {!file ? (
          <FileUploadZone accept="image/*" onFiles={handleFile} label="Drop an image to remove background" sublabel="Works best with solid or near-solid backgrounds" />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Original</p>
                <img src={preview} alt="Original" className="w-full h-48 object-contain rounded-xl border border-border bg-muted/20" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Result</p>
                <div className="w-full h-48 rounded-xl border border-border overflow-hidden"
                  style={{ background: outputUrl ? "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQoU2NkYGBg+M9AABBICAQABTABBFDFoT0AAAAASUVORK5CYII=\") repeat" : undefined }}>
                  {outputUrl ? (
                    <img src={outputUrl} alt="Result" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Result will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Background Type</label>
                <div className="flex gap-2">
                  {([["corner","Auto-detect"],["white","White BG"],["green","Green Screen"]] as const).map(([v,l]) => (
                    <button key={v} onClick={() => setMode(v)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${mode===v?"border-primary/40 bg-primary/8 text-foreground":"border-border text-muted-foreground"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-muted-foreground">Tolerance</label>
                  <span className="text-xs font-medium">{tolerance}</span>
                </div>
                <input type="range" min={5} max={120} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} className="w-full accent-primary h-1.5" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={process} disabled={processing} className="flex-1 gap-2">
                {processing ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Processing…</> : <><Layers className="w-4 h-4" />Remove Background</>}
              </Button>
              {outputUrl && (
                <a href={outputUrl} download={outputName}>
                  <Button variant="outline" className="gap-1.5"><Download className="w-4 h-4" />PNG</Button>
                </a>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Tip: Works best with solid colour backgrounds. Adjust tolerance for better results.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
