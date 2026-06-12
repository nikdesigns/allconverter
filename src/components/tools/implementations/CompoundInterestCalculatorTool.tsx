"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { TrendingUp } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
const fmtPct = (n: number) => n.toFixed(2) + "%";

export function CompoundInterestCalculatorTool() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [monthly, setMonthly] = useState("0");
  const [compound, setCompound] = useState("12");

  const results = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const n = parseFloat(compound) || 12;
    const t = parseFloat(years) || 0;
    const M = parseFloat(monthly) || 0;

    const rows: Array<{ year: number; balance: number; interest: number; contributions: number }> = [];
    let balance = P;
    let totalContributions = P;

    for (let yr = 1; yr <= Math.min(t, 50); yr++) {
      const startBalance = balance;
      balance = balance * Math.pow(1 + r / n, n);
      const monthlyGrowth = M > 0 ? M * ((Math.pow(1 + r / n, n) - 1) / (r / n)) : 0;
      balance += monthlyGrowth;
      totalContributions += M * 12;
      rows.push({ year: yr, balance, interest: balance - totalContributions, contributions: totalContributions });
    }

    const final = rows[rows.length - 1]?.balance ?? P;
    const totalInterest = final - parseFloat(principal) - M * 12 * t;
    return { rows, final, totalInterest, totalContributions };
  }, [principal, rate, years, monthly, compound]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Compound Interest Calculator</span>
      </div>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Principal ($)</label>
            <Input value={principal} onChange={e => setPrincipal(e.target.value)} type="number" min="0" className="font-mono text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Annual Rate (%)</label>
            <Input value={rate} onChange={e => setRate(e.target.value)} type="number" min="0" max="100" step="0.1" className="font-mono text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Duration (years)</label>
            <Input value={years} onChange={e => setYears(e.target.value)} type="number" min="1" max="50" className="font-mono text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Monthly Contribution ($)</label>
            <Input value={monthly} onChange={e => setMonthly(e.target.value)} type="number" min="0" className="font-mono text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Compound Frequency</label>
            <select value={compound} onChange={e => setCompound(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              <option value="365">Daily</option>
              <option value="52">Weekly</option>
              <option value="12">Monthly</option>
              <option value="4">Quarterly</option>
              <option value="2">Semi-annually</option>
              <option value="1">Annually</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Final Balance", value: fmt(results.final), color: "text-primary" },
            { label: "Total Interest", value: fmt(results.totalInterest), color: "text-emerald-500" },
            { label: "Total Invested", value: fmt(results.totalContributions), color: "text-muted-foreground" },
          ].map(card => (
            <div key={card.label} className="p-3 rounded-xl border border-border bg-muted/10 text-center">
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              <p className={`text-base font-bold font-mono ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {results.final > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Principal</span>
              <span>Interest</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex">
              <div className="bg-primary/60 h-full transition-all"
                style={{ width: `${(parseFloat(principal) / results.final) * 100}%` }} />
              <div className="bg-emerald-500/60 h-full flex-1" />
            </div>
          </div>
        )}

        {/* Year table */}
        {results.rows.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Year</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Balance</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Interest Earned</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Total Invested</th>
                </tr>
              </thead>
              <tbody>
                {results.rows.filter((_, i) => i % Math.max(1, Math.floor(results.rows.length / 10)) === 0 || i === results.rows.length - 1)
                  .map(row => (
                  <tr key={row.year} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                    <td className="px-3 py-2 font-medium">{row.year}</td>
                    <td className="px-3 py-2 text-right font-mono text-primary">{fmt(row.balance)}</td>
                    <td className="px-3 py-2 text-right font-mono text-emerald-500">{fmt(row.interest)}</td>
                    <td className="px-3 py-2 text-right font-mono text-muted-foreground">{fmt(row.contributions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
