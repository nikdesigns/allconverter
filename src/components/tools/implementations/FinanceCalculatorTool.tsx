"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

// ── GST Calculator ────────────────────────────────────────────────────────────
function GstCalc() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"exclusive"|"inclusive">("exclusive");
  const GST_RATES = [5, 12, 18, 28];
  const base = parseFloat(amount) || 0;
  const r = parseFloat(rate) || 0;
  const gstAmount = mode === "exclusive" ? (base * r) / 100 : (base * r) / (100 + r);
  const preGst = mode === "exclusive" ? base : base - gstAmount;
  const postGst = mode === "exclusive" ? base + gstAmount : base;
  const cgst = gstAmount / 2; const sgst = gstAmount / 2;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Amount (₹)</label>
        <Input value={amount} onChange={e=>setAmount(e.target.value)} className="text-sm font-mono" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">GST Rate (%)</label>
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {GST_RATES.map(r=>(
            <button key={r} onClick={()=>setRate(String(r))} className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${rate===String(r)?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>{r}%</button>
          ))}
        </div>
        <Input value={rate} onChange={e=>setRate(e.target.value)} className="text-sm font-mono w-28" placeholder="Custom %" />
      </div>
      <div className="flex gap-2">
        {(["exclusive","inclusive"] as const).map(m=>(
          <button key={m} onClick={()=>setMode(m)} className={`flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition-all ${mode===m?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>
            {m === "exclusive" ? "Add GST (Excl.)" : "Remove GST (Incl.)"}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {[
          ["Pre-GST Amount", `₹${preGst.toFixed(2)}`],
          ["CGST (@"+r/2+"%)", `₹${cgst.toFixed(2)}`],
          ["SGST (@"+r/2+"%)", `₹${sgst.toFixed(2)}`],
          ["Total GST", `₹${gstAmount.toFixed(2)}`],
          ["Total Amount", `₹${postGst.toFixed(2)}`],
        ].map(([label,val],i)=>(
          <div key={label} className={`flex items-center justify-between p-3 rounded-xl border ${i===4?"border-primary/30 bg-primary/5":"border-border bg-muted/10"}`}>
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className={`font-mono font-semibold ${i===4?"text-primary":""}`}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CAGR Calculator ──────────────────────────────────────────────────────────
function CagrCalc() {
  const [initial, setInitial] = useState("10000");
  const [final, setFinal] = useState("25000");
  const [years, setYears] = useState("5");
  const iv = parseFloat(initial)||0; const fv = parseFloat(final)||0; const n = parseFloat(years)||1;
  const cagr = n > 0 && iv > 0 ? (Math.pow(fv / iv, 1 / n) - 1) * 100 : 0;
  const totalReturn = iv > 0 ? ((fv - iv) / iv) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[["Initial Investment",initial,setInitial],["Final Value",final,setFinal],["Period (years)",years,setYears]].map(([label,val,set])=>(
          <div key={label as string}><label className="text-xs text-muted-foreground mb-1 block">{label as string}</label>
            <Input value={val as string} onChange={e=>(set as (v:string)=>void)(e.target.value)} className="text-sm font-mono" /></div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          ["CAGR", `${cagr.toFixed(2)}%`, true],
          ["Total Return", `${totalReturn.toFixed(2)}%`, false],
          ["Absolute Gain", `₹${(fv - iv).toLocaleString(undefined,{maximumFractionDigits:2})}`, false],
        ].map(([label,val,highlight])=>(
          <div key={label as string} className={`flex items-center justify-between p-4 rounded-xl border ${highlight?"border-primary/30 bg-primary/5":"border-border bg-muted/10"}`}>
            <span className="text-sm text-muted-foreground">{label as string}</span>
            <span className={`font-mono font-bold text-lg ${highlight?"text-primary":""}`}>{val as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SIP Calculator ────────────────────────────────────────────────────────────
function SipCalc() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");
  const m = parseFloat(monthly)||0; const r = parseFloat(rate)||0; const n = parseFloat(years)||0;
  const months = n * 12;
  const monthlyRate = r / (12 * 100);
  const invested = m * months;
  const maturity = m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const returns = maturity - invested;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[["Monthly SIP (₹)",monthly,setMonthly],["Expected Return (%/yr)",rate,setRate],["Period (years)",years,setYears]].map(([label,val,set])=>(
          <div key={label as string}><label className="text-xs text-muted-foreground mb-1 block">{label as string}</label>
            <Input value={val as string} onChange={e=>(set as (v:string)=>void)(e.target.value)} className="text-sm font-mono" /></div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          ["Total Invested", `₹${invested.toLocaleString(undefined,{maximumFractionDigits:0})}`, false],
          ["Estimated Returns", `₹${returns.toLocaleString(undefined,{maximumFractionDigits:0})}`, false],
          ["Maturity Amount", `₹${maturity.toLocaleString(undefined,{maximumFractionDigits:0})}`, true],
        ].map(([label,val,highlight])=>(
          <div key={label as string} className={`flex items-center justify-between p-4 rounded-xl border ${highlight?"border-primary/30 bg-primary/5":"border-border bg-muted/10"}`}>
            <span className="text-sm text-muted-foreground">{label as string}</span>
            <span className={`font-mono font-bold text-lg ${highlight?"text-primary":""}`}>{val as string}</span>
          </div>
        ))}
      </div>
      <div className="relative h-4 rounded-full bg-muted overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-primary/40 rounded-full" style={{width:`${(invested/maturity*100).toFixed(1)}%`}} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Invested: {((invested/maturity)*100).toFixed(0)}%</span>
        <span>Returns: {((returns/maturity)*100).toFixed(0)}%</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function FinanceCalculatorTool() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "gst-calculator";
  const titles: Record<string,string> = { "gst-calculator":"GST Calculator", "cagr-calculator":"CAGR Calculator", "sip-calculator":"SIP Calculator" };
  const title = titles[slug] ?? "Finance Calculator";

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <DollarSign className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="p-5">
        {slug === "gst-calculator" && <GstCalc />}
        {slug === "cagr-calculator" && <CagrCalc />}
        {slug === "sip-calculator" && <SipCalc />}
      </div>
    </div>
  );
}
