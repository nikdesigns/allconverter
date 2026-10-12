"use client";


import { activateOnKey } from "@/lib/a11y";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Download, Unlock, FileText } from "lucide-react";
import { toast } from "sonner";

export function PdfPasswordRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => setFile(f);

  const remove = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { decryptPdf } = await import("@/lib/qpdf");
      const out = await decryptPdf(new Uint8Array(await file.arrayBuffer()), password);
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `unlocked_${file.name}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast.success("Password removed — PDF downloaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not unlock this PDF.");
    }
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Unlock className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">PDF Password Remover</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400">
          Only use this on PDFs you own or are authorised to modify. You need the current password: this tool removes a password you know, it cannot recover one you have forgotten.
        </div>
        <div role="button" tabIndex={0} onKeyDown={activateOnKey}
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}>
          {file
            ? <><FileText className="w-8 h-8 text-primary mx-auto mb-2" /><p className="text-sm font-medium">{file.name}</p><p className="text-xs text-muted-foreground">{(file.size/1024).toFixed(1)} KB — click to replace</p></>
            : <><Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm font-medium">Drop password-protected PDF here</p></>}
        </div>
        <input aria-label="Choose file" ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);}} />
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Current PDF password (leave empty if the file opens without one and is only restricted)</label>
          <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter PDF password if required…" className="text-sm" />
        </div>
        <Button onClick={remove} disabled={!file || loading} className="w-full gap-2">
          <Download className="w-4 h-4" />{loading ? "Removing password…" : "Remove Password & Download"}
        </Button>
      </div>
    </div>
  );
}
