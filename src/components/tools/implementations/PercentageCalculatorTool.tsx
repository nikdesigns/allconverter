"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

function fmt(n: number): string {
  if (isNaN(n) || !isFinite(n)) return "—";
  return Number(n.toFixed(6)).toString();
}

export function PercentageCalculatorTool() {
  // Mode 1: X% of Y
  const [pct1, setPct1] = useState("20");
  const [val1, setVal1] = useState("150");

  // Mode 2: X is what % of Y
  const [xOf, setXOf] = useState("30");
  const [yOf, setYOf] = useState("150");

  // Mode 3: percentage change
  const [from, setFrom] = useState("80");
  const [to, setTo] = useState("100");

  const [copied, setCopied] = useState<string | null>(null);

  const res1 = useMemo(() => {
    const p = parseFloat(pct1), v = parseFloat(val1);
    return fmt((p / 100) * v);
  }, [pct1, val1]);

  const res2 = useMemo(() => {
    const x = parseFloat(xOf), y = parseFloat(yOf);
    return fmt((x / y) * 100) + "%";
  }, [xOf, yOf]);

  const res3 = useMemo(() => {
    const f = parseFloat(from), t = parseFloat(to);
    const change = ((t - f) / f) * 100;
    return { value: fmt(change) + "%", isIncrease: change >= 0 };
  }, [from, to]);

  const copy = async (val: string, label: string) => {
    await navigator.clipboard.writeText(val.replace("%", ""));
    setCopied(label);
    toast.success("Copied");
    setTimeout(() => setCopied(null), 2000);
  };

  const ResultRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-muted/30">
      <span className="text-sm font-semibold text-foreground">{value}</span>
      <button
        onClick={() => copy(value, label)}
        className="p-1.5 rounded-lg hover:bg-muted transition-all"
      >
        {copied === label ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">Percentage Calculator</span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-5 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* Mode 1 */}
        <div className="space-y-3 pb-5 sm:pb-0 sm:pr-5">
          <h3 className="text-sm font-semibold">What is X% of Y?</h3>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={pct1}
              onChange={(e) => setPct1(e.target.value)}
              placeholder="20"
              className="h-9 text-sm"
            />
            <span className="text-sm font-medium text-muted-foreground shrink-0">% of</span>
            <Input
              type="number"
              value={val1}
              onChange={(e) => setVal1(e.target.value)}
              placeholder="150"
              className="h-9 text-sm"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {pct1}% of {val1} =
          </div>
          <ResultRow label="mode1" value={res1} />
        </div>

        {/* Mode 2 */}
        <div className="space-y-3 py-5 sm:py-0 sm:px-5">
          <h3 className="text-sm font-semibold">X is what % of Y?</h3>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={xOf}
              onChange={(e) => setXOf(e.target.value)}
              placeholder="30"
              className="h-9 text-sm"
            />
            <span className="text-sm font-medium text-muted-foreground shrink-0">out of</span>
            <Input
              type="number"
              value={yOf}
              onChange={(e) => setYOf(e.target.value)}
              placeholder="150"
              className="h-9 text-sm"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {xOf} is what % of {yOf} =
          </div>
          <ResultRow label="mode2" value={res2} />
        </div>

        {/* Mode 3 */}
        <div className="space-y-3 pt-5 sm:pt-0 sm:pl-5">
          <h3 className="text-sm font-semibold">Percentage Change</h3>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="80"
              className="h-9 text-sm"
            />
            <span className="text-sm font-medium text-muted-foreground shrink-0">→</span>
            <Input
              type="number"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="100"
              className="h-9 text-sm"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            From {from} to {to} =
          </div>
          <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border bg-muted/30 ${
            res3.isIncrease ? "border-emerald-500/30" : "border-rose-500/30"
          }`}>
            <span className={`text-sm font-semibold ${
              res3.isIncrease ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
            }`}>
              {res3.isIncrease ? "+" : ""}{res3.value}
            </span>
            <span className="text-xs text-muted-foreground">
              {res3.isIncrease ? "increase" : "decrease"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
