"use client";

import { useRef, useState } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFiles: (files: File[]) => void;
  className?: string;
  label?: string;
  sublabel?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export function FileUploadZone({
  accept = "*",
  multiple = false,
  maxSizeMB = 50,
  onFiles,
  className,
  label = "Drop files here or click to upload",
  sublabel,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`"${file.name}" exceeds the ${maxSizeMB} MB limit.`);
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length > 0) onFiles(validFiles);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200",
          dragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          processFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
            dragging ? "bg-primary/20" : "bg-muted"
          )}>
            <Upload className={cn("w-5 h-5", dragging ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {sublabel || `Max ${maxSizeMB}MB per file`}
            </p>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1.5 px-1">
          <X className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface UploadedFileCardProps {
  file: File;
  onRemove?: () => void;
  status?: "ready" | "processing" | "done" | "error";
  statusText?: string;
}

export function UploadedFileCard({ file, onRemove, status = "ready", statusText }: UploadedFileCardProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl border transition-all",
      status === "done" ? "border-emerald-500/30 bg-emerald-500/5" :
      status === "error" ? "border-destructive/30 bg-destructive/5" :
      status === "processing" ? "border-primary/30 bg-primary/5" :
      "border-border bg-card"
    )}>
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <FileIcon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(file.size)}
          {statusText && <span className={cn("ml-2", status === "done" && "text-emerald-600 dark:text-emerald-400", status === "error" && "text-destructive")}>· {statusText}</span>}
        </p>
      </div>
      {status === "processing" && (
        <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
      )}
      {onRemove && status !== "processing" && (
        <button onClick={onRemove} className="shrink-0 p-1 rounded hover:bg-muted transition-all">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}

export function formatBytes2(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
