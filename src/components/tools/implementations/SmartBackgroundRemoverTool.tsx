"use client";

import { SendToTool } from "@/components/tools/shared/SendToTool";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/shared/FileUploadZone";
import { Download, Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SmartBackgroundRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const handleFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setOutputUrl("");
    setPreview(URL.createObjectURL(f));
  };

  const run = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);
    setProgressLabel("Loading AI model…");
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          setProgressLabel(key.includes("fetch") ? "Downloading AI model…" : "Removing background…");
          setProgress(total > 0 ? Math.round((current / total) * 100) : 0);
        },
        output: { format: "image/png", quality: 1 },
      });
      setOutputUrl(URL.createObjectURL(blob));
      toast.success("Background removed");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't process this image. Try a different file.");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview("");
    setOutputUrl("");
    setProgress(0);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Smart Background Remover</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
            AI
          </span>
        </div>
        {file && (
          <Button size="sm" variant="ghost" onClick={reset} className="h-7 text-xs gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Start over
          </Button>
        )}
      </div>

      <div className="p-5 space-y-5">
        {!file && (
          <FileUploadZone
            accept="image/jpeg,image/png,image/webp"
            onFiles={handleFile}
            label="Drop a photo here or click to upload"
            sublabel="AI automatically detects and removes the background — no manual tuning needed"
          />
        )}

        {file && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Original</p>
                <div className="rounded-xl border border-border overflow-hidden bg-[repeating-conic-gradient(#8883_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] aspect-square flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Result</p>
                <div className="rounded-xl border border-border overflow-hidden bg-[repeating-conic-gradient(#8883_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] aspect-square flex items-center justify-center">
                  {outputUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={outputUrl} alt="Background removed" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground px-3 text-center">
                      {processing ? progressLabel || "Processing…" : "Run AI removal to see result"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {processing && (
              <div className="space-y-1.5">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.max(5, progress)}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground text-center">{progressLabel}</p>
              </div>
            )}

            <div className={cn("flex gap-2", outputUrl && "items-center")}>
              {!outputUrl && (
                <Button onClick={run} disabled={processing} className="flex-1 gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  {processing ? "Removing background…" : "Remove background with AI"}
                </Button>
              )}
              {outputUrl && (
                <div className="flex items-center gap-2 flex-wrap justify-end flex-1"><a href={outputUrl} download={file.name.replace(/\.[^.]+$/, "_no-bg.png")} className="flex-1">
                  <Button className="w-full gap-1.5">
                    <Download className="w-4 h-4" /> Download PNG
                  </Button>
                </a><SendToTool url={outputUrl} name={file.name.replace(/\.[^.]+$/, "_no-bg.png")} /></div>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground text-center">
              Powered by an on-device segmentation model — your photo never leaves your browser.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
