"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type CalcId = "profit-margin" | "discount" | "roi" | "freelance-rate" | "burn-rate" | "saas-mrr" | "cac" | "ltv" | "conversion-rate";

const CALCS: { id: CalcId; label: string; short: string }[] = [
  { id: "profit-margin",   label: "Profit Margin",      short: "Margin" },
  { id: "discount",        label: "Discount",           short: "Discount" },
  { id: "roi",             label: "ROI",                short: "ROI" },
  { id: "freelance-rate",  label: "Freelance Rate",     short: "Freelance" },
  { id: "burn-rate",       label: "Burn Rate",          short: "Burn" },
  { id: "saas-mrr",        label: "SaaS MRR",           short: "MRR" },
  { id: "cac",             label: "CAC",                short: "CAC" },
  { id: "ltv",             label: "LTV",                short: "LTV" },
  { id: "conversion-rate", label: "Conversion Rate",    short: "CVR" },
];

function Num({ label, value, unit = "", highlight, sub }: { label: string; value: string; unit?: string; highlight?: boolean; sub?: string }) {
  return (
    <div className={cn("rounded-2xl p-4 border flex flex-col gap-1", highlight ? "border-primary/30 bg-primary/8" : "border-border bg-muted/20")}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("font-mono font-bold tabular-nums", highlight ? "text-primary text-2xl" : "text-xl text-foreground")}>{value}<span className="text-xs font-normal ml-1 opacity-70">{unit}</span></p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Field({ label, value, onChange, prefix, suffix, step }: { label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; step?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-xs text-muted-foreground font-mono pointer-events-none">{prefix}</span>}
        <input type="number" value={value} onChange={e => onChange(e.target.value)} step={step||"any"} min="0"
          className={cn("w-full h-10 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30", prefix?"pl-7":"pl-3", suffix?"pr-8":"pr-3")} />
        {suffix && <span className="absolute right-3 text-xs text-muted-foreground pointer-events-none">{suffix}</span>}
      </div>
    </div>
  );
}

const $ = (v: number) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (v: number) => v.toFixed(2) + "%";
const round = (v: number, d = 2) => parseFloat(v.toFixed(d));

// ---- Individual calculators ----

function ProfitMargin() {
  const [revenue, setRevenue] = useState("100000");
  const [cogs, setCogs]       = useState("60000");
  const [operating, setOp]    = useState("15000");

  const r = useMemo(() => {
    const rev = parseFloat(revenue)||0, c = parseFloat(cogs)||0, op = parseFloat(operating)||0;
    const gross = rev - c;
    const net   = gross - op;
    return {
      grossProfit: gross, grossMargin: rev>0 ? (gross/rev)*100 : 0,
      netProfit:   net,   netMargin:   rev>0 ? (net/rev)*100   : 0,
      operatingMargin: rev>0 ? ((gross-op)/rev)*100 : 0,
    };
  }, [revenue, cogs, operating]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Revenue" value={revenue} onChange={setRevenue} prefix="$" />
        <Field label="Cost of Goods Sold (COGS)" value={cogs} onChange={setCogs} prefix="$" />
        <Field label="Operating Expenses" value={operating} onChange={setOp} prefix="$" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Num label="Gross Profit" value={$(r.grossProfit)} />
        <Num label="Gross Margin" value={pct(r.grossMargin)} highlight />
        <Num label="Net Profit" value={$(r.netProfit)} />
        <Num label="Net Margin" value={pct(r.netMargin)} highlight />
      </div>
    </div>
  );
}

function DiscountCalc() {
  const [original, setOriginal] = useState("100");
  const [discount, setDiscount] = useState("20");
  const [mode, setMode] = useState<"percent"|"fixed">("percent");

  const r = useMemo(() => {
    const orig = parseFloat(original)||0, d = parseFloat(discount)||0;
    const discAmt = mode==="percent" ? orig * d / 100 : d;
    const final   = Math.max(orig - discAmt, 0);
    const pctSaved = orig > 0 ? (discAmt/orig)*100 : 0;
    return { discAmt, final, pctSaved };
  }, [original, discount, mode]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <Field label="Original Price" value={original} onChange={setOriginal} prefix="$" />
        <Field label={mode==="percent"?"Discount %":"Discount Amount"} value={discount} onChange={setDiscount} prefix={mode==="fixed"?"$":undefined} suffix={mode==="percent"?"%":undefined} />
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Discount Type</label>
          <div className="flex bg-muted rounded-xl p-0.5">
            {(["percent","fixed"] as const).map(m => <button key={m} onClick={() => setMode(m)} className={cn("flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize", mode===m?"bg-background text-foreground shadow-sm":"text-muted-foreground hover:text-foreground")}>{m==="percent"?"Percentage":"Fixed Amount"}</button>)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Num label="Discount Amount" value={$(r.discAmt)} />
        <Num label="Final Price" value={$(r.final)} highlight />
        <Num label="% Saved" value={pct(r.pctSaved)} />
      </div>
    </div>
  );
}

function ROICalc() {
  const [investment, setInv] = useState("50000");
  const [returns, setReturns] = useState("65000");
  const [period, setPeriod]   = useState("12");

  const r = useMemo(() => {
    const inv = parseFloat(investment)||0, ret = parseFloat(returns)||0, p = parseFloat(period)||1;
    const gain = ret - inv;
    const roi  = inv > 0 ? (gain/inv)*100 : 0;
    const annualROI = inv > 0 ? (Math.pow(ret/inv, 12/p) - 1) * 100 : 0;
    const payback = gain > 0 ? inv / (gain / p) : 0;
    return { gain, roi, annualROI, payback };
  }, [investment, returns, period]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Initial Investment" value={investment} onChange={setInv} prefix="$" />
        <Field label="Total Returns" value={returns} onChange={setReturns} prefix="$" />
        <Field label="Investment Period (months)" value={period} onChange={setPeriod} suffix="mo" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Num label="Net Gain" value={$(r.gain)} />
        <Num label="ROI" value={pct(r.roi)} highlight />
        <Num label="Annualised ROI" value={pct(r.annualROI)} />
        <Num label="Payback Period" value={round(r.payback, 1).toString()} unit="months" />
      </div>
    </div>
  );
}

function FreelanceRate() {
  const [annualIncome, setIncome]   = useState("80000");
  const [hoursPerWeek, setHours]    = useState("40");
  const [weeksOff, setWeeksOff]     = useState("4");
  const [expenses, setExpenses]     = useState("5000");
  const [taxRate, setTax]           = useState("25");
  const [bufferPct, setBuffer]      = useState("20");

  const r = useMemo(() => {
    const target = parseFloat(annualIncome)||0, h = parseFloat(hoursPerWeek)||40;
    const weeksWork = 52 - (parseFloat(weeksOff)||0);
    const billableHours = weeksWork * h;
    const annualExpenses = parseFloat(expenses)||0;
    const taxMult = 1 + (parseFloat(taxRate)||0)/100;
    const bufferMult = 1 + (parseFloat(bufferPct)||0)/100;
    const grossNeeded = (target + annualExpenses) * taxMult * bufferMult;
    const hourlyRate = billableHours > 0 ? grossNeeded / billableHours : 0;
    const dailyRate  = hourlyRate * h;
    const monthlyIncome = grossNeeded / 12;
    return { hourlyRate, dailyRate, monthlyIncome, billableHours };
  }, [annualIncome, hoursPerWeek, weeksOff, expenses, taxRate, bufferPct]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Field label="Target Annual Income" value={annualIncome} onChange={setIncome} prefix="$" />
        <Field label="Hours / Week" value={hoursPerWeek} onChange={setHours} suffix="hrs" />
        <Field label="Weeks Off / Year" value={weeksOff} onChange={setWeeksOff} suffix="wks" />
        <Field label="Annual Business Expenses" value={expenses} onChange={setExpenses} prefix="$" />
        <Field label="Tax Rate" value={taxRate} onChange={setTax} suffix="%" />
        <Field label="Non-Billable Buffer" value={bufferPct} onChange={setBuffer} suffix="%" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Num label="Hourly Rate" value={$(r.hourlyRate)} highlight />
        <Num label="Daily Rate (8h)" value={$(r.dailyRate)} />
        <Num label="Monthly Target" value={$(r.monthlyIncome / 12 * 12)} sub="incl. tax & expenses" />
        <Num label="Billable Hours/Year" value={round(r.billableHours).toString()} unit="hrs" />
      </div>
    </div>
  );
}

function BurnRate() {
  const [balance, setBalance]     = useState("500000");
  const [monthlyBurn, setMBurn]   = useState("42000");
  const [monthlyRev, setMRev]     = useState("8000");

  const r = useMemo(() => {
    const bal = parseFloat(balance)||0, burn = parseFloat(monthlyBurn)||0, rev = parseFloat(monthlyRev)||0;
    const netBurn = Math.max(burn - rev, 0);
    const runway = netBurn > 0 ? bal / netBurn : Infinity;
    const runwayDate = new Date();
    runwayDate.setMonth(runwayDate.getMonth() + Math.floor(runway));
    return { netBurn, runway: runway === Infinity ? Infinity : runway, runwayDate: runway < 1200 ? runwayDate.toLocaleDateString("en-US",{month:"short",year:"numeric"}) : "∞" };
  }, [balance, monthlyBurn, monthlyRev]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Current Cash Balance" value={balance} onChange={setBalance} prefix="$" />
        <Field label="Monthly Burn (Expenses)" value={monthlyBurn} onChange={setMBurn} prefix="$" />
        <Field label="Monthly Revenue" value={monthlyRev} onChange={setMRev} prefix="$" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Num label="Gross Burn Rate" value={$(parseFloat(monthlyBurn)||0)} unit="/mo" />
        <Num label="Net Burn Rate" value={$(r.netBurn)} unit="/mo" highlight />
        <Num label="Runway" value={r.runway === Infinity ? "∞" : round(r.runway, 1).toString()} unit={r.runway < Infinity ? `months (≈ ${r.runwayDate})` : ""} sub={r.runway < 6 ? "⚠ Less than 6 months" : r.runway < 12 ? "Raise in the next 6 months" : "Comfortable runway"} />
      </div>
    </div>
  );
}

function SaasMrr() {
  const [customers, setCustomers]   = useState("150");
  const [arpu, setArpu]             = useState("49");
  const [churnPct, setChurn]        = useState("3");
  const [newPerMonth, setNew]       = useState("20");

  const r = useMemo(() => {
    const n = parseFloat(customers)||0, a = parseFloat(arpu)||0, c = (parseFloat(churnPct)||0)/100, np = parseFloat(newPerMonth)||0;
    const mrr = n * a;
    const arr = mrr * 12;
    const churnedMRR = mrr * c;
    const newMRR = np * a;
    const netNewMRR = newMRR - churnedMRR;
    const ltv = c > 0 ? a / c : 0;
    return { mrr, arr, churnedMRR, newMRR, netNewMRR, ltv };
  }, [customers, arpu, churnPct, newPerMonth]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="Active Customers" value={customers} onChange={setCustomers} />
        <Field label="ARPU (Monthly)" value={arpu} onChange={setArpu} prefix="$" />
        <Field label="Monthly Churn Rate" value={churnPct} onChange={setChurn} suffix="%" />
        <Field label="New Customers / Month" value={newPerMonth} onChange={setNew} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Num label="MRR" value={$(r.mrr)} highlight />
        <Num label="ARR" value={$(r.arr)} />
        <Num label="Net New MRR" value={$(r.netNewMRR)} sub={r.netNewMRR >= 0 ? "Growing" : "Declining"} />
        <Num label="Churned MRR" value={$(r.churnedMRR)} unit="/mo" />
        <Num label="New MRR" value={$(r.newMRR)} unit="/mo" />
        <Num label="LTV (est.)" value={$(r.ltv)} sub="ARPU ÷ Churn" />
      </div>
    </div>
  );
}

function CACCalc() {
  const [mktSpend, setMkt]     = useState("30000");
  const [salesSpend, setSales] = useState("15000");
  const [newCust, setNew]      = useState("50");
  const [ltv, setLtv]          = useState("1200");

  const r = useMemo(() => {
    const total = (parseFloat(mktSpend)||0) + (parseFloat(salesSpend)||0);
    const n = parseFloat(newCust)||1;
    const cac = total / n;
    const ltvNum = parseFloat(ltv)||0;
    const ratio = cac > 0 ? ltvNum / cac : 0;
    const payback = cac > 0 && ltvNum > 0 ? (cac / (ltvNum / 12)) : 0;
    return { total, cac, ratio, payback };
  }, [mktSpend, salesSpend, newCust, ltv]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="Marketing Spend" value={mktSpend} onChange={setMkt} prefix="$" />
        <Field label="Sales Spend" value={salesSpend} onChange={setSales} prefix="$" />
        <Field label="New Customers" value={newCust} onChange={setNew} />
        <Field label="Avg LTV (for ratio)" value={ltv} onChange={setLtv} prefix="$" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Num label="Total Acquisition Cost" value={$(r.total)} />
        <Num label="CAC" value={$(r.cac)} highlight />
        <Num label="LTV : CAC" value={round(r.ratio, 2).toString() + "x"} sub={r.ratio >= 3 ? "✓ Healthy (≥3x)" : r.ratio >= 1 ? "Marginal" : "⚠ Below breakeven"} />
        <Num label="CAC Payback" value={round(r.payback, 1).toString()} unit="months" />
      </div>
    </div>
  );
}

function LTVCalc() {
  const [arpu, setArpu]       = useState("49");
  const [churnPct, setChurn]  = useState("3");
  const [grossMargin, setGM]  = useState("70");
  const [cac, setCac]         = useState("200");

  const r = useMemo(() => {
    const a = parseFloat(arpu)||0, c = (parseFloat(churnPct)||0)/100, gm = (parseFloat(grossMargin)||0)/100;
    const cacNum = parseFloat(cac)||0;
    const ltv = c > 0 ? (a * gm) / c : 0;
    const ratio = cacNum > 0 ? ltv / cacNum : 0;
    const payback = ltv > 0 && a > 0 ? cacNum / (a * gm) : 0;
    const avgLifetime = c > 0 ? 1/c : 0;
    return { ltv, ratio, payback, avgLifetime };
  }, [arpu, churnPct, grossMargin, cac]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="ARPU (Monthly)" value={arpu} onChange={setArpu} prefix="$" />
        <Field label="Monthly Churn Rate" value={churnPct} onChange={setChurn} suffix="%" />
        <Field label="Gross Margin" value={grossMargin} onChange={setGM} suffix="%" />
        <Field label="CAC (for LTV:CAC)" value={cac} onChange={setCac} prefix="$" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Num label="LTV" value={$(r.ltv)} highlight />
        <Num label="LTV : CAC" value={round(r.ratio, 2).toString() + "x"} sub={r.ratio >= 3 ? "✓ Healthy" : "⚠ Low"} />
        <Num label="Avg Customer Lifetime" value={round(r.avgLifetime, 1).toString()} unit="months" />
        <Num label="CAC Payback" value={round(r.payback, 1).toString()} unit="months" />
      </div>
    </div>
  );
}

function ConversionRate() {
  const [visitors, setVisitors]   = useState("10000");
  const [conversions, setConv]    = useState("280");
  const [revenue, setRevenue]     = useState("14000");

  const r = useMemo(() => {
    const v = parseFloat(visitors)||0, c = parseFloat(conversions)||0, rev = parseFloat(revenue)||0;
    const cvr   = v > 0 ? (c/v)*100 : 0;
    const rpc   = c > 0 ? rev/c : 0;
    const rpv   = v > 0 ? rev/v : 0;
    const neededFor1Pct = v * 0.01;
    return { cvr, rpc, rpv, neededFor1Pct };
  }, [visitors, conversions, revenue]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Total Visitors" value={visitors} onChange={setVisitors} />
        <Field label="Conversions" value={conversions} onChange={setConv} />
        <Field label="Revenue (optional)" value={revenue} onChange={setRevenue} prefix="$" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Num label="Conversion Rate" value={pct(r.cvr)} highlight />
        <Num label="Revenue / Conversion" value={$(r.rpc)} />
        <Num label="Revenue / Visitor" value={$(r.rpv)} />
        <Num label="Conversions for 1%" value={round(r.neededFor1Pct).toString()} sub="Target conversions at 1% CVR" />
      </div>
    </div>
  );
}

const CALC_COMPONENTS: Record<CalcId, React.ComponentType> = {
  "profit-margin":   ProfitMargin,
  "discount":        DiscountCalc,
  "roi":             ROICalc,
  "freelance-rate":  FreelanceRate,
  "burn-rate":       BurnRate,
  "saas-mrr":        SaasMrr,
  "cac":             CACCalc,
  "ltv":             LTVCalc,
  "conversion-rate": ConversionRate,
};

export function BusinessMetricsTool() {
  const pathname = usePathname();
  const detected = CALCS.find(c => pathname?.includes(c.id));
  const [active, setActive] = useState<CalcId>(detected?.id ?? "profit-margin");
  const Component = CALC_COMPONENTS[active];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-3 flex-wrap">
        <div className="flex flex-wrap gap-1">
          {CALCS.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)}
              className={cn("px-2.5 py-1 rounded-lg border text-xs font-medium transition-all", active===c.id?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground hover:border-primary/30 hover:text-foreground")}>
              {c.short}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-emerald-500 font-medium ml-auto">● Live</span>
      </div>
      <div className="p-5">
        <p className="text-sm font-semibold mb-4">{CALCS.find(c => c.id === active)?.label} Calculator</p>
        <Component />
      </div>
    </div>
  );
}
