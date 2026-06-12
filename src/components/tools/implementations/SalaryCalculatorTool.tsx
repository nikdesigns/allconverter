"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function Row({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={cn("flex justify-between items-center py-2.5 px-3 rounded-lg", highlight ? "bg-primary/8 border border-primary/20" : "")}>
      <div><p className={cn("text-sm", highlight ? "font-semibold" : "text-muted-foreground")}>{label}</p>{sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}</div>
      <p className={cn("font-mono font-semibold tabular-nums", highlight ? "text-primary text-base" : "text-sm")}>{value}</p>
    </div>
  );
}

function inp(label: string, value: string, onChange: (v: string) => void, prefix = "₹", sub?: string) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}{sub && <span className="ml-1 opacity-60">{sub}</span>}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">{prefix}</span>}
        <input type="number" value={value} onChange={e => onChange(e.target.value)} min="0"
          className={cn("w-full h-10 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30", prefix ? "pl-7 pr-3" : "px-3")} />
      </div>
    </div>
  );
}

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 }); }

// ---- Salary Calculator (monthly payslip breakdown) ----
function SalaryCalculator() {
  const [basic, setBasic]     = useState("50000");
  const [hra, setHra]         = useState("20000");
  const [da, setDa]           = useState("5000");
  const [other, setOther]     = useState("5000");
  const [pf, setPf]           = useState("6000");
  const [pt, setPt]           = useState("200");
  const [esic, setEsic]       = useState("0");
  const [tds, setTds]         = useState("2000");
  const [otherDed, setOtherDed] = useState("0");

  const r = useMemo(() => {
    const b = parseFloat(basic)||0, h = parseFloat(hra)||0, d = parseFloat(da)||0, o = parseFloat(other)||0;
    const gross = b + h + d + o;
    const deductions = (parseFloat(pf)||0) + (parseFloat(pt)||0) + (parseFloat(esic)||0) + (parseFloat(tds)||0) + (parseFloat(otherDed)||0);
    const net = gross - deductions;
    return { gross, deductions, net, grossAnnual: gross * 12, netAnnual: net * 12 };
  }, [basic, hra, da, other, pf, pt, esic, tds, otherDed]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Earnings (Monthly)</p>
        {inp("Basic Salary", basic, setBasic)}
        {inp("HRA", hra, setHra)}
        {inp("Dearness Allowance (DA)", da, setDa)}
        {inp("Other Allowances", other, setOther)}
        <div className="flex justify-between items-center px-3 py-2 bg-muted/40 rounded-lg">
          <span className="text-sm font-medium">Gross Salary</span>
          <span className="font-mono font-bold text-sm">{fmt(r.gross)}</span>
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-4">Deductions</p>
        {inp("Provident Fund (PF)", pf, setPf)}
        {inp("Professional Tax (PT)", pt, setPt)}
        {inp("ESI", esic, setEsic)}
        {inp("TDS", tds, setTds)}
        {inp("Other Deductions", otherDed, setOtherDed)}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Summary</p>
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="p-4 space-y-1">
            <Row label="Gross Salary" value={fmt(r.gross)} />
            <Row label="Total Deductions" value={`-${fmt(r.deductions)}`} />
            <div className="h-px bg-border my-2" />
            <Row label="Net Take-Home (Monthly)" value={fmt(r.net)} highlight />
          </div>
          <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/20 space-y-1">
            <Row label="Annual CTC (Gross×12)" value={fmt(r.grossAnnual)} />
            <Row label="Annual In-Hand (Net×12)" value={fmt(r.netAnnual)} />
          </div>
        </div>
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-xs text-muted-foreground font-medium">Breakdown</p>
          {[
            { label: "Basic", val: parseFloat(basic)||0 },
            { label: "HRA", val: parseFloat(hra)||0 },
            { label: "DA", val: parseFloat(da)||0 },
            { label: "Other", val: parseFloat(other)||0 },
          ].filter(x => x.val > 0).map(x => (
            <div key={x.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{x.label}</span>
                <span className="font-mono">{r.gross > 0 ? ((x.val/r.gross)*100).toFixed(1) : "0"}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary/70 transition-all" style={{ width: r.gross > 0 ? `${(x.val/r.gross)*100}%` : "0%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- CTC to In-Hand ----
function CtcToInhand() {
  const [ctc, setCtc] = useState("1200000");
  const [basicPct, setBasicPct] = useState("40");
  const [hraExemptPct, setHraExemptPct] = useState("50");
  const [pfEmployee, setPfEmployee] = useState("true");
  const [pfEmployer, setPfEmployer] = useState("true");
  const [pt, setPt] = useState("200");
  const [taxRegime, setTaxRegime] = useState("new");

  const r = useMemo(() => {
    const annualCTC   = parseFloat(ctc) || 0;
    const basicPctNum = Math.min(Math.max(parseFloat(basicPct) || 40, 10), 70);
    const annualBasic = annualCTC * basicPctNum / 100;
    const monthlyBasic = annualBasic / 12;

    const annualHRA = annualBasic * 0.4;
    const hraExempt = annualHRA * (parseFloat(hraExemptPct) || 50) / 100;
    const conveyance = 19200;
    const medReimb   = 15000;
    const special    = annualCTC - annualBasic - annualHRA - conveyance - medReimb - (pfEmployer==="true" ? annualBasic * 0.12 : 0);

    const gross = annualBasic + annualHRA + conveyance + medReimb + Math.max(special, 0);

    const pfEmp  = pfEmployee === "true" ? annualBasic * 0.12 : 0;
    const pfEmpr = pfEmployer === "true" ? annualBasic * 0.12 : 0;
    const ptAnn  = (parseFloat(pt) || 0) * 12;

    // Simplified income tax calc (new regime FY 2024-25)
    let taxableIncome: number;
    if (taxRegime === "new") {
      taxableIncome = gross - pfEmp - ptAnn;
      // Standard deduction 75k in new regime
      taxableIncome = Math.max(taxableIncome - 75000, 0);
    } else {
      taxableIncome = gross - pfEmp - ptAnn - hraExempt - conveyance - medReimb;
      taxableIncome = Math.max(taxableIncome - 50000, 0); // std deduction
    }

    let incomeTax = 0;
    if (taxRegime === "new") {
      if (taxableIncome <= 300000) incomeTax = 0;
      else if (taxableIncome <= 700000) incomeTax = (taxableIncome - 300000) * 0.05;
      else if (taxableIncome <= 1000000) incomeTax = 20000 + (taxableIncome - 700000) * 0.10;
      else if (taxableIncome <= 1200000) incomeTax = 50000 + (taxableIncome - 1000000) * 0.15;
      else if (taxableIncome <= 1500000) incomeTax = 80000 + (taxableIncome - 1200000) * 0.20;
      else incomeTax = 140000 + (taxableIncome - 1500000) * 0.30;
    } else {
      if (taxableIncome <= 250000) incomeTax = 0;
      else if (taxableIncome <= 500000) incomeTax = (taxableIncome - 250000) * 0.05;
      else if (taxableIncome <= 1000000) incomeTax = 12500 + (taxableIncome - 500000) * 0.20;
      else incomeTax = 112500 + (taxableIncome - 1000000) * 0.30;
    }
    const cess = incomeTax * 0.04;
    const totalTax = incomeTax + cess;
    const totalDeductions = pfEmp + ptAnn + totalTax;
    const annualInHand = gross - totalDeductions;
    const monthlyInHand = annualInHand / 12;

    return { annualCTC, annualBasic, monthlyBasic, gross, pfEmp, pfEmpr, ptAnn, totalTax, totalDeductions, annualInHand, monthlyInHand, effectiveTaxRate: gross > 0 ? (totalTax/gross)*100 : 0 };
  }, [ctc, basicPct, hraExemptPct, pfEmployee, pfEmployer, pt, taxRegime]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CTC Details</p>
        {inp("Annual CTC (Package)", ctc, setCtc)}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Basic % of CTC: <span className="font-mono">{basicPct}%</span></label>
          <input type="range" min="30" max="60" value={basicPct} onChange={e => setBasicPct(e.target.value)} className="w-full accent-primary h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">Basic = {fmt(r.annualBasic / 12)}/mo</p>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Tax Regime</label>
          <div className="grid grid-cols-2 gap-2">
            {[{id:"new",label:"New Regime"},{id:"old",label:"Old Regime"}].map(t => (
              <button key={t.id} onClick={() => setTaxRegime(t.id)} className={cn("py-2 rounded-xl border text-xs font-medium transition-all", taxRegime===t.id?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground hover:border-primary/40")}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer p-2 rounded-xl border border-border">
            <input type="checkbox" checked={pfEmployee==="true"} onChange={e => setPfEmployee(e.target.checked?"true":"false")} className="accent-primary" />
            Employee PF (12%)
          </label>
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer p-2 rounded-xl border border-border">
            <input type="checkbox" checked={pfEmployer==="true"} onChange={e => setPfEmployer(e.target.checked?"true":"false")} className="accent-primary" />
            Employer PF (in CTC)
          </label>
        </div>
        {inp("Professional Tax (monthly)", pt, setPt)}
        <p className="text-[10px] text-muted-foreground">Estimates based on standard salary structure. Consult a CA for exact figures.</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Breakdown</p>
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="p-4 space-y-1">
            <Row label="Annual CTC" value={fmt(r.annualCTC)} />
            <Row label="Gross Salary (Annual)" value={fmt(r.gross)} />
            <Row label="PF (Employee)" value={`-${fmt(r.pfEmp)}`} />
            <Row label="Professional Tax" value={`-${fmt(r.ptAnn)}`} />
            <Row label={`Income Tax (${taxRegime==="new"?"New":"Old"} Regime)`} value={`-${fmt(r.totalTax)}`} />
            <div className="h-px bg-border my-2" />
            <Row label="Annual In-Hand" value={fmt(r.annualInHand)} />
            <Row label="Monthly In-Hand" value={fmt(r.monthlyInHand)} highlight />
          </div>
          <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/20">
            <Row label="Effective Tax Rate" value={`${r.effectiveTaxRate.toFixed(1)}%`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SalaryCalculatorTool() {
  const pathname = usePathname();
  const isCtc = pathname?.includes("ctc");
  const [tab, setTab] = useState<"salary"|"ctc">(isCtc ? "ctc" : "salary");

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            {[{id:"salary",label:"Salary Calculator"},{id:"ctc",label:"CTC → In-Hand"}].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as "salary"|"ctc")}
                className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-all", tab===t.id?"bg-background text-foreground shadow-sm":"text-muted-foreground hover:text-foreground")}>
                {t.label}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-emerald-500 font-medium ml-auto">● Live</span>
        </div>
      </div>
      <div className="p-5">
        {tab === "salary" ? <SalaryCalculator /> : <CtcToInhand />}
      </div>
    </div>
  );
}
