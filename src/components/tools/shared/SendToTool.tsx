"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setHandoff } from "@/lib/handoff";

export type Kind = "pdf" | "image" | "audio";

// Tools that accept a file handed over from another tool, by file kind.
export const TARGETS: Record<Kind, [slug: string, label: string][]> = {
  pdf: [
    ["pdf-compressor", "Compress this PDF"],
    ["pdf-merger", "Merge with other PDFs"],
    ["pdf-splitter", "Split into pages"],
    ["pdf-protector", "Add a password"],
    ["pdf-watermark", "Add a watermark"],
    ["pdf-page-number-adder", "Add page numbers"],
    ["pdf-to-jpg", "Convert pages to JPG"],
  ],
  image: [
    ["image-compressor", "Compress this image"],
    ["image-resizer", "Resize"],
    ["image-cropper", "Crop"],
    ["photo-signature-resizer", "Fit to form size and KB"],
    ["png-to-jpg", "Convert to JPG"],
    ["jpg-to-pdf", "Turn into a PDF"],
  ],
  audio: [
    ["mp3-cutter", "Trim"],
    ["audio-volume-booster", "Boost volume"],
    ["wav-to-mp3", "Convert to MP3"],
    ["mp3-to-wav", "Convert to WAV"],
  ],
};

export function kindOf(name: string, type: string): Kind | null {
  if (type === "application/pdf" || /\.pdf$/i.test(name)) return "pdf";
  if (type.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif)$/i.test(name)) return "image";
  if (type.startsWith("audio/") || /\.(mp3|wav|m4a|aac|flac|ogg)$/i.test(name)) return "audio";
  return null;
}

interface Props {
  /** The result, as a Blob or as an object URL pointing at it. */
  blob?: Blob;
  url?: string;
  name: string;
  /** Compact icon-and-text button for tight rows. */
  size?: "sm" | "default";
}

/** "Use in another tool" menu: carries a result into the next tool without a download and re-upload. */
export function SendToTool({ blob, url, name, size = "sm" }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname() ?? "";

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const type = blob?.type ?? "";
  const kind = kindOf(name, type);
  if (!kind || (!blob && !url)) return null;
  const targets = TARGETS[kind].filter(([slug]) => !pathname.includes(`/tools/${slug}`));
  // WAV is already WAV, MP3 is already MP3.
  const usable = targets.filter(([slug]) =>
    !(slug === "wav-to-mp3" && !/\.wav$/i.test(name)) && !(slug === "mp3-to-wav" && !/\.mp3$/i.test(name)));
  if (!usable.length) return null;

  const send = async (slug: string) => {
    setBusy(true);
    try {
      const data = blob ?? (await (await fetch(url!)).blob());
      const fallbackType = kind === "pdf" ? "application/pdf" : data.type;
      setHandoff([new File([data], name, { type: data.type || fallbackType })]);
      router.push(`/tools/${slug}/`);
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <Button type="button" variant="outline" size={size} disabled={busy} aria-haspopup="menu" aria-expanded={open}
        onClick={() => setOpen((o) => !o)} className="gap-1.5">
        Use in another tool <ChevronDown className="w-3.5 h-3.5" />
      </Button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-1.5 w-60 rounded-xl border border-border bg-popover p-1 shadow-lg">
          {usable.map(([slug, label]) => (
            <button key={slug} type="button" role="menuitem" onClick={() => send(slug)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted focus-visible:bg-muted">
              {label} <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
