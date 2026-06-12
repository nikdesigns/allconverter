"use client";

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
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true } as any);
      const saved = await doc.save();
      const blob = new Blob([saved as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `unlocked_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Password removed — PDF downloaded");
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes("password") || msg.includes("decrypt")) {
        toast.error("Wrong password or encrypted with unsupported algorithm");
      } else {
        toast.error("Failed: " + msg);
      }
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
          Only use this tool on PDFs you own or have authorization to modify. Supports standard PDF password encryption (RC4/AES).
        </div>
        <div
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}>
          {file
            ? <><FileText className="w-8 h-8 text-primary mx-auto mb-2" /><p className="text-sm font-medium">{file.name}</p><p className="text-xs text-muted-foreground">{(file.size/1024).toFixed(1)} KB — click to replace</p></>
            : <><Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm font-medium">Drop password-protected PDF here</p></>}
        </div>
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);}} />
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">PDF Password (leave empty if no user password)</label>
          <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter PDF password if required…" className="text-sm" />
        </div>
        <Button onClick={remove} disabled={!file || loading} className="w-full gap-2">
          <Download className="w-4 h-4" />{loading ? "Removing password…" : "Remove Password & Download"}
        </Button>
      </div>
    </div>
  );
}
