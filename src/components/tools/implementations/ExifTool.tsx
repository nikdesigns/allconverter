"use client";

import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Download, Info, Trash2 } from "lucide-react";
import { toast } from "sonner";

// EXIF data is stored in JPEG App1 markers. We can read it via the File's ArrayBuffer.
// This is a simplified EXIF reader that extracts common tags.

const EXIF_TAGS: Record<number, string> = {
  0x010e: "ImageDescription", 0x010f: "Make", 0x0110: "Model",
  0x0112: "Orientation", 0x011a: "XResolution", 0x011b: "YResolution",
  0x0128: "ResolutionUnit", 0x0131: "Software", 0x0132: "DateTime",
  0x013b: "Artist", 0x013e: "WhitePoint", 0x013f: "PrimaryChromaticities",
  0x8769: "ExifIFD", 0x8825: "GPSIFD",
  0x829a: "ExposureTime", 0x829d: "FNumber", 0x8822: "ExposureProgram",
  0x8827: "ISOSpeedRatings", 0x9003: "DateTimeOriginal", 0x9004: "DateTimeDigitized",
  0x9201: "ShutterSpeedValue", 0x9202: "ApertureValue", 0x9203: "BrightnessValue",
  0x9204: "ExposureBiasValue", 0x9205: "MaxApertureValue", 0x9206: "SubjectDistance",
  0x9207: "MeteringMode", 0x9208: "LightSource", 0x9209: "Flash",
  0x920a: "FocalLength", 0xa002: "PixelXDimension", 0xa003: "PixelYDimension",
  0xa402: "ExposureMode", 0xa403: "WhiteBalance", 0xa406: "SceneCaptureType",
  0xa432: "LensSpecification", 0xa433: "LensMake", 0xa434: "LensModel",
};

function readUint16(buffer: DataView, offset: number, littleEndian: boolean): number {
  return buffer.getUint16(offset, littleEndian);
}
function readUint32(buffer: DataView, offset: number, littleEndian: boolean): number {
  return buffer.getUint32(offset, littleEndian);
}

function parseExif(arrayBuffer: ArrayBuffer): Record<string,string> {
  const result: Record<string,string> = {};
  const view = new DataView(arrayBuffer);
  if (view.getUint16(0) !== 0xffd8) return {}; // not JPEG
  let offset = 2;
  while (offset < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint16(offset);
    const length = view.getUint16(offset + 2);
    if (marker === 0xffe1) { // APP1
      const exifMark = String.fromCharCode(view.getUint8(offset+4),view.getUint8(offset+5),view.getUint8(offset+6),view.getUint8(offset+7));
      if (exifMark === "Exif") {
        const tiffStart = offset + 10;
        const endian = view.getUint16(tiffStart);
        const le = endian === 0x4949;
        if (readUint16(view, tiffStart + 2, le) !== 42) break;
        const ifdOffset = readUint32(view, tiffStart + 4, le);
        const ifdCount = readUint16(view, tiffStart + ifdOffset, le);
        for (let i = 0; i < ifdCount; i++) {
          const entryOffset = tiffStart + ifdOffset + 2 + i * 12;
          const tag = readUint16(view, entryOffset, le);
          const type = readUint16(view, entryOffset + 2, le);
          const count = readUint32(view, entryOffset + 4, le);
          const valueOffset = entryOffset + 8;
          const tagName = EXIF_TAGS[tag];
          if (!tagName || tagName === "ExifIFD" || tagName === "GPSIFD") continue;
          try {
            let value = "";
            if (type === 2) { // ASCII string
              const strOffset = count <= 4 ? valueOffset : tiffStart + readUint32(view, valueOffset, le);
              const chars: string[] = [];
              for (let j = 0; j < count - 1; j++) chars.push(String.fromCharCode(view.getUint8(strOffset + j)));
              value = chars.join("").trim();
            } else if (type === 3 && count === 1) { value = String(readUint16(view, valueOffset, le)); }
            else if (type === 4 && count === 1) { value = String(readUint32(view, valueOffset, le)); }
            else if (type === 5 && count === 1) {
              const ratOffset = tiffStart + readUint32(view, valueOffset, le);
              const num = readUint32(view, ratOffset, le);
              const den = readUint32(view, ratOffset + 4, le);
              value = den === 0 ? "0" : den === 1 ? String(num) : `${num}/${den}`;
            }
            if (value) result[tagName] = value;
          } catch { /* skip malformed */ }
        }
      }
    }
    offset += 2 + length;
  }
  return result;
}

function stripExif(arrayBuffer: ArrayBuffer): Uint8Array {
  const view = new DataView(arrayBuffer);
  if (view.getUint16(0) !== 0xffd8) return new Uint8Array(arrayBuffer);
  const output: number[] = [0xff, 0xd8];
  let offset = 2;
  while (offset < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint16(offset);
    const length = view.getUint16(offset + 2);
    if (marker === 0xffe1) { // Skip APP1 (EXIF)
      offset += 2 + length;
      continue;
    }
    const segment = new Uint8Array(arrayBuffer, offset, 2 + length);
    output.push(...segment);
    offset += 2 + length;
    if (marker === 0xffda) { // SOS — rest is raw image data
      const rest = new Uint8Array(arrayBuffer, offset);
      output.push(...rest);
      break;
    }
  }
  return new Uint8Array(output);
}

export function ExifTool() {
  const pathname = usePathname();
  const isRemover = pathname?.includes("exif-remover") ?? false;
  const [exifData, setExifData] = useState<Record<string,string> | null>(null);
  const [fileName, setFileName] = useState("");
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    if (isRemover) {
      const stripped = stripExif(buffer);
      const blob = new Blob([stripped as unknown as BlobPart], { type: "image/jpeg" });
      setProcessedBlob(blob);
      const data = parseExif(buffer);
      setExifData(Object.keys(data).length ? data : null);
      toast.success(`EXIF removed — ${Object.keys(data).length} tags stripped`);
    } else {
      const data = parseExif(buffer);
      setExifData(data);
    }
  };

  const download = () => {
    if (!processedBlob) return;
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement("a");
    a.href = url; a.download = `noexif_${fileName}`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        {isRemover ? <Trash2 className="w-4 h-4 text-primary" /> : <Info className="w-4 h-4 text-primary" />}
        <span className="text-sm font-medium">{isRemover ? "EXIF Remover" : "EXIF Viewer"}</span>
      </div>
      <div className="p-5 space-y-4">
        <div
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}>
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">Drop JPEG image here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">JPEG only — EXIF data is stored in JPEG files</p>
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);}} />

        {isRemover && processedBlob && (
          <Button onClick={download} className="w-full gap-2">
            <Download className="w-4 h-4" />Download EXIF-free image
          </Button>
        )}

        {exifData && Object.keys(exifData).length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {isRemover ? "Removed EXIF tags:" : "EXIF Data found:"} ({Object.keys(exifData).length} tags)
            </p>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {Object.entries(exifData).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-border bg-muted/10">
                  <span className="text-xs font-medium text-muted-foreground">{key}</span>
                  <span className="text-xs font-mono truncate max-w-[200px]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {exifData && Object.keys(exifData).length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">No EXIF data found in this image.</div>
        )}
      </div>
    </div>
  );
}
