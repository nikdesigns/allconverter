"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";

function ipToInt(ip: string): number {
  return ip.split(".").reduce((acc, oct) => (acc << 8) | parseInt(oct, 10), 0) >>> 0;
}
function intToIp(n: number): string {
  return [24,16,8,0].map(s => (n >>> s) & 0xff).join(".");
}

interface CidrResult {
  network: string; broadcast: string; firstHost: string; lastHost: string;
  totalHosts: number; usableHosts: number; subnetMask: string; wildcardMask: string;
  ipClass: string; cidr: number; ipBinary: string;
}

function calculateCidr(input: string): CidrResult {
  const [ipPart, prefixStr] = input.trim().split("/");
  if (!ipPart || !prefixStr) throw new Error("Format: 192.168.1.0/24");
  const prefix = parseInt(prefixStr, 10);
  if (prefix < 0 || prefix > 32) throw new Error("Prefix must be 0–32");
  const parts = ipPart.split(".").map(Number);
  if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) throw new Error("Invalid IP address");

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const ipInt = ipToInt(ipPart);
  const networkInt = (ipInt & mask) >>> 0;
  const broadcastInt = (networkInt | (~mask >>> 0)) >>> 0;
  const total = 2 ** (32 - prefix);
  const firstHost = prefix < 31 ? intToIp(networkInt + 1) : intToIp(networkInt);
  const lastHost = prefix < 31 ? intToIp(broadcastInt - 1) : intToIp(broadcastInt);
  const firstOctet = (ipInt >>> 24) & 0xff;
  const cls = firstOctet < 128 ? "A" : firstOctet < 192 ? "B" : firstOctet < 224 ? "C" : firstOctet < 240 ? "D (Multicast)" : "E (Reserved)";

  return {
    network: intToIp(networkInt), broadcast: intToIp(broadcastInt),
    firstHost, lastHost,
    totalHosts: total, usableHosts: prefix < 31 ? total - 2 : total,
    subnetMask: intToIp(mask), wildcardMask: intToIp(~mask >>> 0),
    ipClass: cls, cidr: prefix,
    ipBinary: ipPart.split(".").map(o => (+o).toString(2).padStart(8,"0")).join("."),
  };
}

export function CidrCalculatorTool() {
  const [input, setInput] = useState("192.168.1.0/24");
  const [result, setResult] = useState<CidrResult | null>(null);
  const [error, setError] = useState("");

  const calc = () => {
    try { setError(""); setResult(calculateCidr(input)); }
    catch (e) { setError((e as Error).message); setResult(null); }
  };

  const rows: [string, string][] = result ? [
    ["Network Address", result.network],
    ["Broadcast Address", result.broadcast],
    ["First Usable Host", result.firstHost],
    ["Last Usable Host", result.lastHost],
    ["Subnet Mask", result.subnetMask],
    ["Wildcard Mask", result.wildcardMask],
    ["Total Hosts", result.totalHosts.toLocaleString()],
    ["Usable Hosts", result.usableHosts.toLocaleString()],
    ["IP Class", result.ipClass],
    ["IP in Binary", result.ipBinary],
  ] : [];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Network className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">CIDR Calculator</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&calc()}
            className="font-mono text-sm flex-1" placeholder="192.168.1.0/24" />
          <Button onClick={calc}>Calculate</Button>
        </div>
        {error && <p className="text-xs text-red-400 p-3 rounded-xl border border-red-500/20 bg-red-500/5">{error}</p>}
        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-2 p-3 rounded-xl border border-border bg-muted/10">
                <span className="text-xs text-muted-foreground shrink-0">{label}</span>
                <code className="text-xs font-mono font-medium text-right break-all">{value}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
