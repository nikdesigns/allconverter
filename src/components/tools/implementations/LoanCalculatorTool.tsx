"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Calculator } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

export function LoanCalculatorTool() {
  const [amount, setAmount] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [type, setType] = useState<"monthly" | "annuity">("monthly");

  const results = useMemo(() => {
    const P = parseFloat(amount) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(term) || 0) * 12;
    if (!P || !r || !n) return null;

    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Amortization schedule (yearly summary)
    const schedule: Array<{ year: number; principal: number; interest: number; balance: number }> = [];
    let balance = P;
    for (let yr = 1; yr <= parseFloat(term); yr++) {
      let yearlyP = 0; let yearlyI = 0;
      for (let m = 0; m < 12 && balance > 0; m++) {
        const intPart = balance * r;
        const prinPart = Math.min(emi - intPart, balance);
        yearlyI += intPart; yearlyP += prinPart;
        balance = Math.max(0, balance - prinPart);
      }
      schedule.push({ year: yr, principal: yearlyP, interest: yearlyI, balance });
    }
    return { emi, totalPayment, totalInterest, schedule };
  }, [amount, rate, term]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Calculator className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Loan EMI Calculator</span>
      </div>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Loan Amount ($)</label>
            <Input value={amount} onChange={e => setAmount(e.target.value)} type="number" min="0" className="font-mono text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Annual Interest Rate (%)</label>
            <Input value={rate} onChange={e => setRate(e.target.value)} type="number" min="0" max="50" step="0.1" className="font-mono text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Loan Term (years)</label>
            <Input value={term} onChange={e => setTerm(e.target.value)} type="number" min="1" max="50" className="font-mono text-sm" />
          </div>
        </div>

        {results && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Monthly EMI", value: fmt(results.emi), color: "text-primary" },
                { label: "Total Interest", value: fmt(results.totalInterest), color: "text-rose-500" },
                { label: "Total Payment", value: fmt(results.totalPayment), color: "text-muted-foreground" },
              ].map(c => (
                <div key={c.label} className="p-3 rounded-xl border border-border bg-muted/10 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                  <p className={`text-sm font-bold font-mono ${c.color}`}>{c.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Principal ({((parseFloat(amount) / results.totalPayment) * 100).toFixed(0)}%)</span>
                <span>Interest ({((results.totalInterest / results.totalPayment) * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex">
                <div className="bg-primary/60 h-full transition-all"
                  style={{ width: `${(parseFloat(amount) / results.totalPayment) * 100}%` }} />
                <div className="bg-rose-500/50 h-full flex-1" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Year</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">Principal</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">Interest</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.schedule.filter((_, i) => i % Math.max(1, Math.floor(results.schedule.length / 10)) === 0 || i === results.schedule.length - 1).map(row => (
                    <tr key={row.year} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="px-3 py-2 font-medium">{row.year}</td>
                      <td className="px-3 py-2 text-right font-mono text-primary">{fmt(row.principal)}</td>
                      <td className="px-3 py-2 text-right font-mono text-rose-500">{fmt(row.interest)}</td>
                      <td className="px-3 py-2 text-right font-mono text-muted-foreground">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
