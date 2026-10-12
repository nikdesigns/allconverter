"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileIcon } from "lucide-react";
import { FileUploadZone, formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { TARGETS, kindOf } from "@/components/tools/shared/SendToTool";
import { setHandoff } from "@/lib/handoff";

const SHARE_CACHE = "allconverter-shared-files";

interface LaunchParams { files: { getFile: () => Promise<File> }[] }
interface LaunchQueue { setConsumer: (fn: (params: LaunchParams) => void) => void }

/** Files passed in by the share sheet (stored by the service worker). */
async function takeSharedFiles(): Promise<File[]> {
  if (!("caches" in window)) return [];
  const cache = await caches.open(SHARE_CACHE);
  const keys = await cache.keys();
  const files: File[] = [];
  for (const key of keys) {
    const res = await cache.match(key);
    if (!res) continue;
    const blob = await res.blob();
    const name = decodeURIComponent(res.headers.get("X-File-Name") ?? "shared-file");
    files.push(new File([blob], name, { type: blob.type }));
    await cache.delete(key);
  }
  return files;
}

export function OpenFileClient() {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    takeSharedFiles().then((shared) => { if (!cancelled && shared.length) setFiles(shared); }).catch(() => {});
    // "Open with AllConverter" from the desktop file manager.
    const queue = (window as unknown as { launchQueue?: LaunchQueue }).launchQueue;
    queue?.setConsumer(async (params) => {
      const opened = await Promise.all(params.files.map((f) => f.getFile()));
      if (!cancelled && opened.length) setFiles(opened);
    });
    return () => { cancelled = true; };
  }, []);

  const first = files[0];
  const kind = first ? kindOf(first.name, first.type) : null;
  const sameKind = kind ? files.filter((f) => kindOf(f.name, f.type) === kind) : [];
  const options = kind ? TARGETS[kind] : [];

  const go = (slug: string) => {
    setHandoff(sameKind);
    router.push(`/tools/${slug}/`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-lg max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Open a file</h1>
        <p className="text-muted-foreground mb-6">
          Choose a PDF, image or audio file, then pick what to do with it. The file stays on your device.
        </p>

        <FileUploadZone accept=".pdf,application/pdf,image/*,audio/*" multiple onFiles={setFiles}
          label="Drop files here or click to choose" sublabel="PDF, images or audio" />

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <FileIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium truncate flex-1">{f.name}</span>
                  <span className="text-xs text-muted-foreground">{formatBytes2(f.size)}</span>
                </li>
              ))}
            </ul>

            {options.length > 0 ? (
              <div>
                <h2 className="text-sm font-semibold mb-2">What would you like to do?</h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {options.map(([slug, label]) => (
                    <button key={slug} type="button" onClick={() => go(slug)}
                      className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm font-medium hover:border-primary/50 hover:bg-muted/30 transition-colors">
                      {label} <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
                {sameKind.length < files.length && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Only the {kind} file{sameKind.length === 1 ? "" : "s"} will be sent; mixed file types cannot be opened in one tool.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">This file type is not supported yet. Try a PDF, an image or an audio file.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
