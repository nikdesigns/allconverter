"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, Hash, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Pure-JS MD5 (Piotr Walczyszyn / blueimp)
function md5(input: string): string {
  function safeAdd(x: number, y: number) { const lsw=(x&0xffff)+(y&0xffff); const msw=(x>>16)+(y>>16)+(lsw>>16); return (msw<<16)|(lsw&0xffff); }
  function bitRotateLeft(num: number, cnt: number) { return (num<<cnt)|(num>>>(32-cnt)); }
  function md5cmn(q: number,a: number,b: number,x: number,s: number,t: number) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a,q),safeAdd(x,t)),s),b); }
  function md5ff(a: number,b: number,c: number,d: number,x: number,s: number,t: number) { return md5cmn((b&c)|((~b)&d),a,b,x,s,t); }
  function md5gg(a: number,b: number,c: number,d: number,x: number,s: number,t: number) { return md5cmn((b&d)|(c&(~d)),a,b,x,s,t); }
  function md5hh(a: number,b: number,c: number,d: number,x: number,s: number,t: number) { return md5cmn(b^c^d,a,b,x,s,t); }
  function md5ii(a: number,b: number,c: number,d: number,x: number,s: number,t: number) { return md5cmn(c^(b|(~d)),a,b,x,s,t); }
  function utf8Encode(s: string) { return unescape(encodeURIComponent(s)); }
  function binl2hex(binarray: number[]) { const h="0123456789abcdef"; let s=""; for(let i=0;i<binarray.length*4;i++) s+=h.charAt((binarray[i>>2]>>(((i%4)*8)+4))&0xf)+h.charAt((binarray[i>>2]>>(((i%4)*8)))&0xf); return s; }
  function binlMD5(x: number[], len: number) {
    x[len>>5] |= 0x80 << (len % 32); x[(((len+64)>>>9)<<4)+14] = len;
    let a=1732584193,b=-271733879,c=-1732584194,d=271733878;
    for(let i=0;i<x.length;i+=16) {
      const [oa,ob,oc,od]=[a,b,c,d];
      a=md5ff(a,b,c,d,x[i],7,-680876936); d=md5ff(d,a,b,c,x[i+1],12,-389564586); c=md5ff(c,d,a,b,x[i+2],17,606105819); b=md5ff(b,c,d,a,x[i+3],22,-1044525330);
      a=md5ff(a,b,c,d,x[i+4],7,-176418897); d=md5ff(d,a,b,c,x[i+5],12,1200080426); c=md5ff(c,d,a,b,x[i+6],17,-1473231341); b=md5ff(b,c,d,a,x[i+7],22,-45705983);
      a=md5ff(a,b,c,d,x[i+8],7,1770035416); d=md5ff(d,a,b,c,x[i+9],12,-1958414417); c=md5ff(c,d,a,b,x[i+10],17,-42063); b=md5ff(b,c,d,a,x[i+11],22,-1990404162);
      a=md5ff(a,b,c,d,x[i+12],7,1804603682); d=md5ff(d,a,b,c,x[i+13],12,-40341101); c=md5ff(c,d,a,b,x[i+14],17,-1502002290); b=md5ff(b,c,d,a,x[i+15],22,1236535329);
      a=md5gg(a,b,c,d,x[i+1],5,-165796510); d=md5gg(d,a,b,c,x[i+6],9,-1069501632); c=md5gg(c,d,a,b,x[i+11],14,643717713); b=md5gg(b,c,d,a,x[i],20,-373897302);
      a=md5gg(a,b,c,d,x[i+5],5,-701558691); d=md5gg(d,a,b,c,x[i+10],9,38016083); c=md5gg(c,d,a,b,x[i+15],14,-660478335); b=md5gg(b,c,d,a,x[i+4],20,-405537848);
      a=md5gg(a,b,c,d,x[i+9],5,568446438); d=md5gg(d,a,b,c,x[i+14],9,-1019803690); c=md5gg(c,d,a,b,x[i+3],14,-187363961); b=md5gg(b,c,d,a,x[i+8],20,1163531501);
      a=md5gg(a,b,c,d,x[i+13],5,-1444681467); d=md5gg(d,a,b,c,x[i+2],9,-51403784); c=md5gg(c,d,a,b,x[i+7],14,1735328473); b=md5gg(b,c,d,a,x[i+12],20,-1926607734);
      a=md5hh(a,b,c,d,x[i+5],4,-378558); d=md5hh(d,a,b,c,x[i+8],11,-2022574463); c=md5hh(c,d,a,b,x[i+11],16,1839030562); b=md5hh(b,c,d,a,x[i+14],23,-35309556);
      a=md5hh(a,b,c,d,x[i+1],4,-1530992060); d=md5hh(d,a,b,c,x[i+4],11,1272893353); c=md5hh(c,d,a,b,x[i+7],16,-155497632); b=md5hh(b,c,d,a,x[i+10],23,-1094730640);
      a=md5hh(a,b,c,d,x[i+13],4,681279174); d=md5hh(d,a,b,c,x[i],11,-358537222); c=md5hh(c,d,a,b,x[i+3],16,-722521979); b=md5hh(b,c,d,a,x[i+6],23,76029189);
      a=md5hh(a,b,c,d,x[i+9],4,-640364487); d=md5hh(d,a,b,c,x[i+12],11,-421815835); c=md5hh(c,d,a,b,x[i+15],16,530742520); b=md5hh(b,c,d,a,x[i+2],23,-995338651);
      a=md5ii(a,b,c,d,x[i],6,-198630844); d=md5ii(d,a,b,c,x[i+7],10,1126891415); c=md5ii(c,d,a,b,x[i+14],15,-1416354905); b=md5ii(b,c,d,a,x[i+5],21,-57434055);
      a=md5ii(a,b,c,d,x[i+12],6,1700485571); d=md5ii(d,a,b,c,x[i+3],10,-1894986606); c=md5ii(c,d,a,b,x[i+10],15,-1051523); b=md5ii(b,c,d,a,x[i+1],21,-2054922799);
      a=md5ii(a,b,c,d,x[i+8],6,1873313359); d=md5ii(d,a,b,c,x[i+15],10,-30611744); c=md5ii(c,d,a,b,x[i+6],15,-1560198380); b=md5ii(b,c,d,a,x[i+13],21,1309151649);
      a=md5ii(a,b,c,d,x[i+4],6,-145523070); d=md5ii(d,a,b,c,x[i+11],10,-1120210379); c=md5ii(c,d,a,b,x[i+2],15,718787259); b=md5ii(b,c,d,a,x[i+9],21,-343485551);
      a=safeAdd(a,oa); b=safeAdd(b,ob); c=safeAdd(c,oc); d=safeAdd(d,od);
    }
    return [a,b,c,d];
  }
  function str2binl(s: string) { const b: number[] = []; const mask=(1<<8)-1; for(let i=0;i<s.length*8;i+=8) b[i>>5]|=(s.charCodeAt(i/8)&mask)<<(i%32); return b; }
  const str = utf8Encode(input);
  return binl2hex(binlMD5(str2binl(str), str.length * 8));
}

async function sha(algorithm: "SHA-1" | "SHA-256" | "SHA-512", text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,"0")).join("");
}

const ALGORITHMS = {
  "md5-generator": { label: "MD5", bits: 128 },
  "sha1-generator": { label: "SHA-1", bits: 160 },
  "sha256-generator": { label: "SHA-256", bits: 256 },
  "sha512-generator": { label: "SHA-512", bits: 512 },
  "bcrypt-generator": { label: "Bcrypt", bits: 0 },
};

type AlgoKey = keyof typeof ALGORITHMS;

export function HashGeneratorTool() {
  const pathname = usePathname();
  const slug = (pathname?.split("/").filter(Boolean).at(-1) ?? "sha256-generator") as AlgoKey;
  const algo = ALGORITHMS[slug] ?? ALGORITHMS["sha256-generator"];

  const [input, setInput] = useState("Hello, World!");
  const [hash, setHash] = useState("");
  const [bcryptHash, setBcryptHash] = useState("");
  const [bcryptInput, setBcryptInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [rounds, setRounds] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug === "bcrypt-generator") return;
    let cancelled = false;
    (async () => {
      if (!input) { setHash(""); return; }
      const h = slug === "md5-generator"
        ? md5(input)
        : await sha(algo.label as "SHA-1" | "SHA-256" | "SHA-512", input);
      if (!cancelled) setHash(h);
    })();
    return () => { cancelled = true; };
  }, [input, slug]);

  const generateBcrypt = async () => {
    if (!input) return;
    setLoading(true);
    const bcrypt = await import("bcryptjs");
    const h = await bcrypt.hash(input, rounds);
    setBcryptHash(h);
    setLoading(false);
  };

  const verifyBcrypt = async () => {
    if (!bcryptInput || !bcryptHash) return;
    setLoading(true);
    const bcrypt = await import("bcryptjs");
    const ok = await bcrypt.compare(bcryptInput, bcryptHash);
    setVerifyResult(ok);
    setLoading(false);
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  if (slug === "bcrypt-generator") {
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
          <Hash className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Bcrypt Generator & Verifier</span>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Password to hash</label>
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter password" className="font-mono text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Cost factor (rounds): {rounds}</label>
            <input type="range" min={6} max={14} value={rounds} onChange={e => setRounds(+e.target.value)} className="w-full accent-primary h-1.5" />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1"><span>Fast (6)</span><span>Secure (14)</span></div>
          </div>
          <Button onClick={generateBcrypt} disabled={loading || !input} className="w-full gap-2">
            {loading ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Hashing…</> : "Generate Bcrypt Hash"}
          </Button>
          {bcryptHash && (
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/10">
              <code className="flex-1 text-xs font-mono break-all">{bcryptHash}</code>
              <Button size="sm" variant="ghost" onClick={() => copy(bcryptHash)} className="h-7 shrink-0"><Copy className="w-3.5 h-3.5" /></Button>
            </div>
          )}
          <div className="pt-2 border-t border-border space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Verify hash</p>
            <Input value={bcryptInput} onChange={e => { setBcryptInput(e.target.value); setVerifyResult(null); }} placeholder="Plain text to verify" className="font-mono text-sm" />
            <Button onClick={verifyBcrypt} disabled={loading || !bcryptInput || !bcryptHash} variant="outline" className="w-full gap-2">
              {loading ? "Verifying…" : "Verify"}
            </Button>
            {verifyResult !== null && (
              <p className={`text-sm font-medium text-center ${verifyResult ? "text-emerald-500" : "text-red-500"}`}>
                {verifyResult ? "✓ Hash matches!" : "✗ Hash does not match"}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Hash className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{algo.label} Hash Generator</span>
        {algo.bits > 0 && <span className="text-xs text-muted-foreground ml-auto">{algo.bits}-bit</span>}
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input text</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to hash…" className="min-h-[120px] resize-none text-sm font-mono" />
        </div>
        {hash && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{algo.label} Hash</span>
              <Button size="sm" variant="ghost" onClick={() => copy(hash)} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/10">
              <code className="text-sm font-mono break-all text-primary">{hash}</code>
            </div>
            <p className="text-xs text-muted-foreground">{hash.length} hex characters · {hash.length * 4} bits</p>
          </div>
        )}
        {!input && <p className="text-sm text-muted-foreground text-center py-4">Enter text above to generate hash</p>}
      </div>
    </div>
  );
}
