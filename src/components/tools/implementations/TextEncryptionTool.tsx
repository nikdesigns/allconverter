"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Lock, Unlock, Shield } from "lucide-react";
import { toast } from "sonner";

async function deriveKey(password: string, salt: Uint8Array) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt.buffer as ArrayBuffer, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptText(text: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(text));
  const combined = new Uint8Array([...salt, ...iv, ...new Uint8Array(ciphertext)]);
  return btoa(String.fromCharCode(...combined));
}

async function decryptText(data: string, password: string): Promise<string> {
  const combined = new Uint8Array(atob(data).split("").map(c => c.charCodeAt(0)));
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const ciphertext = combined.slice(28);
  const key = await deriveKey(password, salt);
  const dec = new TextDecoder();
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return dec.decode(plain);
}

export function TextEncryptionTool() {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (mode: "encrypt" | "decrypt") => {
    if (!input.trim() || !password.trim()) return;
    setLoading(true); setError(""); setOutput("");
    try {
      if (mode === "encrypt") setOutput(await encryptText(input, password));
      else setOutput(await decryptText(input.trim(), password));
    } catch { setError("Decryption failed. Wrong password or corrupted data."); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Text Encryption (AES-256-GCM)</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-400">
          All encryption happens in your browser. No data is sent to any server.
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Password</label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter encryption password…" className="text-sm" />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input text (or encrypted data)</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[120px] resize-none text-sm font-mono" placeholder="Paste text to encrypt, or encrypted data to decrypt…" />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => handle("encrypt")} disabled={!input.trim() || !password.trim() || loading} className="flex-1 gap-2">
            <Lock className="w-4 h-4" />Encrypt
          </Button>
          <Button onClick={() => handle("decrypt")} disabled={!input.trim() || !password.trim() || loading} variant="outline" className="flex-1 gap-2">
            <Unlock className="w-4 h-4" />Decrypt
          </Button>
        </div>

        {error && <p className="text-xs text-red-400 p-3 rounded-xl border border-red-500/20 bg-red-500/5">{error}</p>}

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Output</span>
              <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
            </div>
            <Textarea readOnly value={output} className="min-h-[120px] resize-none text-sm font-mono bg-muted/20" />
          </div>
        )}
      </div>
    </div>
  );
}
