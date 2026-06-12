"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

type UnitDef = { label: string; factor: number; offset?: number };

const converterData: Record<string, { title: string; units: UnitDef[] }> = {
  "length-converter": {
    title: "Length",
    units: [
      { label: "Millimeter (mm)", factor: 0.001 },
      { label: "Centimeter (cm)", factor: 0.01 },
      { label: "Meter (m)", factor: 1 },
      { label: "Kilometer (km)", factor: 1000 },
      { label: "Inch (in)", factor: 0.0254 },
      { label: "Foot (ft)", factor: 0.3048 },
      { label: "Yard (yd)", factor: 0.9144 },
      { label: "Mile (mi)", factor: 1609.344 },
      { label: "Nautical Mile (nmi)", factor: 1852 },
    ],
  },
  "weight-converter": {
    title: "Weight",
    units: [
      { label: "Milligram (mg)", factor: 0.000001 },
      { label: "Gram (g)", factor: 0.001 },
      { label: "Kilogram (kg)", factor: 1 },
      { label: "Metric Ton (t)", factor: 1000 },
      { label: "Pound (lb)", factor: 0.453592 },
      { label: "Ounce (oz)", factor: 0.0283495 },
      { label: "Stone (st)", factor: 6.35029 },
      { label: "US Ton", factor: 907.185 },
    ],
  },
  "temperature-converter": {
    title: "Temperature",
    units: [
      { label: "Celsius (°C)", factor: 1, offset: 0 },
      { label: "Fahrenheit (°F)", factor: 9 / 5, offset: 32 },
      { label: "Kelvin (K)", factor: 1, offset: 273.15 },
      { label: "Rankine (°R)", factor: 9 / 5, offset: 491.67 },
    ],
  },
  "speed-converter": {
    title: "Speed",
    units: [
      { label: "Meter/second (m/s)", factor: 1 },
      { label: "Kilometer/hour (km/h)", factor: 1 / 3.6 },
      { label: "Miles/hour (mph)", factor: 0.44704 },
      { label: "Knot (kn)", factor: 0.514444 },
      { label: "Foot/second (ft/s)", factor: 0.3048 },
      { label: "Mach (at sea level)", factor: 340.3 },
    ],
  },
  "area-converter": {
    title: "Area",
    units: [
      { label: "Square millimeter (mm²)", factor: 0.000001 },
      { label: "Square centimeter (cm²)", factor: 0.0001 },
      { label: "Square meter (m²)", factor: 1 },
      { label: "Square kilometer (km²)", factor: 1_000_000 },
      { label: "Square inch (in²)", factor: 0.00064516 },
      { label: "Square foot (ft²)", factor: 0.0929 },
      { label: "Square yard (yd²)", factor: 0.8361 },
      { label: "Acre", factor: 4046.86 },
      { label: "Hectare (ha)", factor: 10_000 },
    ],
  },
};

function toBase(value: number, unit: UnitDef, isTempUnit: boolean): number {
  if (isTempUnit) {
    // Temperature: convert from any unit to Celsius (base)
    const label = unit.label;
    if (label.includes("°F")) return (value - 32) * (5 / 9);
    if (label.includes("K")) return value - 273.15;
    if (label.includes("°R")) return (value - 491.67) * (5 / 9);
    return value;
  }
  return value * unit.factor;
}

function fromBase(base: number, unit: UnitDef, isTempUnit: boolean): number {
  if (isTempUnit) {
    const label = unit.label;
    if (label.includes("°F")) return base * (9 / 5) + 32;
    if (label.includes("K")) return base + 273.15;
    if (label.includes("°R")) return base * (9 / 5) + 491.67;
    return base;
  }
  return base / unit.factor;
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1e9) return n.toExponential(4);
  if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(4);
  const s = n.toPrecision(8);
  return parseFloat(s).toString();
}

export function UnitConverterTool() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) || "length-converter";
  const data = converterData[slug] || converterData["length-converter"];
  const isTemp = slug === "temperature-converter";

  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [inputVal, setInputVal] = useState("1");

  // Reset when slug changes
  useEffect(() => {
    setFromIndex(0);
    setToIndex(1);
    setInputVal("1");
  }, [slug]);

  const allResults = useMemo(() => {
    const num = parseFloat(inputVal);
    if (isNaN(num)) return [];
    const baseVal = toBase(num, data.units[fromIndex], isTemp);
    return data.units.map((u) => ({
      ...u,
      result: fromBase(baseVal, u, isTemp),
    }));
  }, [inputVal, fromIndex, data.units, isTemp]);

  const currentResult = allResults[toIndex];

  const swap = () => {
    const newFrom = toIndex;
    const newTo = fromIndex;
    setFromIndex(newFrom);
    setToIndex(newTo);
    if (currentResult) {
      setInputVal(fmt(currentResult.result));
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-sm font-medium">{data.title} Converter</h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Main conversion */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">From</label>
            <select
              value={fromIndex}
              onChange={(e) => setFromIndex(Number(e.target.value))}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-2"
            >
              {data.units.map((u, i) => (
                <option key={i} value={i}>{u.label}</option>
              ))}
            </select>
            <Input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="h-11 font-mono"
            />
          </div>

          <button
            onClick={swap}
            className="h-11 w-11 rounded-xl border border-border bg-muted hover:bg-accent flex items-center justify-center transition-all hover:scale-105 mb-0"
            title="Swap units"
          >
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">To</label>
            <select
              value={toIndex}
              onChange={(e) => setToIndex(Number(e.target.value))}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-2"
            >
              {data.units.map((u, i) => (
                <option key={i} value={i}>{u.label}</option>
              ))}
            </select>
            <div className="h-11 rounded-lg border border-border bg-muted/30 px-3 flex items-center font-mono text-sm font-semibold text-foreground">
              {currentResult ? fmt(currentResult.result) : "—"}
            </div>
          </div>
        </div>

        {/* All conversions */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            All Conversions for {inputVal || "1"} {data.units[fromIndex]?.label}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allResults.map((u, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl border transition-all cursor-pointer",
                  i === fromIndex
                    ? "border-primary/40 bg-primary/5"
                    : i === toIndex
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-border hover:border-border/80 hover:bg-muted/30"
                )}
                onClick={() => setToIndex(i)}
              >
                <span className="text-xs text-muted-foreground truncate mr-2">
                  {u.label}
                </span>
                <span className="text-sm font-mono font-semibold text-foreground shrink-0">
                  {fmt(u.result)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
