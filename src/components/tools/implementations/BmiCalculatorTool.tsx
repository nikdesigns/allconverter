"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Unit = "metric" | "imperial";

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
  bgColor: string;
  minHealthy: number;
  maxHealthy: number;
}

function calcBmi(weight: number, height: number, unit: Unit): BmiResult | null {
  if (!weight || !height || weight <= 0 || height <= 0) return null;

  let bmi: number;
  let heightM: number;

  if (unit === "metric") {
    heightM = height / 100;
    bmi = weight / (heightM * heightM);
  } else {
    // imperial: weight in lbs, height in inches
    bmi = (weight / (height * height)) * 703;
    heightM = height * 0.0254;
  }

  bmi = Math.round(bmi * 10) / 10;

  let category: string;
  let color: string;
  let bgColor: string;

  if (bmi < 18.5) {
    category = "Underweight";
    color = "text-sky-500";
    bgColor = "bg-sky-500";
  } else if (bmi < 25) {
    category = "Normal Weight";
    color = "text-emerald-500";
    bgColor = "bg-emerald-500";
  } else if (bmi < 30) {
    category = "Overweight";
    color = "text-amber-500";
    bgColor = "bg-amber-500";
  } else {
    category = "Obese";
    color = "text-rose-500";
    bgColor = "bg-rose-500";
  }

  const minHealthy = unit === "metric"
    ? Math.round(18.5 * heightM * heightM * 10) / 10
    : Math.round((18.5 * height * height) / 703 * 10) / 10;
  const maxHealthy = unit === "metric"
    ? Math.round(24.9 * heightM * heightM * 10) / 10
    : Math.round((24.9 * height * height) / 703 * 10) / 10;

  return { bmi, category, color, bgColor, minHealthy, maxHealthy };
}

const bmiScale = [
  { label: "Underweight", range: "< 18.5", color: "bg-sky-500" },
  { label: "Normal", range: "18.5–24.9", color: "bg-emerald-500" },
  { label: "Overweight", range: "25–29.9", color: "bg-amber-500" },
  { label: "Obese", range: "≥ 30", color: "bg-rose-500" },
];

export function BmiCalculatorTool() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const heightInches = useMemo(() => {
    if (unit === "imperial") {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      return ft * 12 + inches;
    }
    return parseFloat(height) || 0;
  }, [unit, height, heightFt, heightIn]);

  const result = useMemo(() =>
    calcBmi(parseFloat(weight), heightInches, unit),
    [weight, heightInches, unit]
  );

  const bmiPercent = result
    ? Math.min(100, Math.max(0, ((result.bmi - 15) / (40 - 15)) * 100))
    : 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Unit toggle */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex bg-muted rounded-lg p-0.5">
          {(["metric", "imperial"] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => { setUnit(u); setWeight(""); setHeight(""); setHeightFt(""); setHeightIn(""); }}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                unit === u
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {u}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {unit === "metric" ? "kg / cm" : "lbs / ft+in"}
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
              min="0"
              className="h-11"
            />
          </div>

          {unit === "metric" ? (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">
                Height (cm)
              </label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 175"
                min="0"
                className="h-11"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">
                Height (ft + in)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  placeholder="ft"
                  min="0"
                  className="h-11"
                />
                <Input
                  type="number"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  placeholder="in"
                  min="0"
                  max="11"
                  className="h-11"
                />
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div>
          {result ? (
            <div className="space-y-4">
              {/* BMI value */}
              <div className="rounded-2xl border border-border bg-muted/30 p-5 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Your BMI
                </p>
                <p className={cn("text-5xl font-bold tabular-nums", result.color)}>
                  {result.bmi}
                </p>
                <p className={cn("text-sm font-semibold mt-1", result.color)}>
                  {result.category}
                </p>
              </div>

              {/* BMI scale bar */}
              <div>
                <div className="flex rounded-full overflow-hidden h-2.5 mb-2">
                  <div className="w-1/4 bg-sky-500/60" />
                  <div className="w-1/4 bg-emerald-500/60" />
                  <div className="w-1/4 bg-amber-500/60" />
                  <div className="w-1/4 bg-rose-500/60" />
                </div>
                <div
                  className="relative -mt-5 mb-2"
                  style={{ paddingLeft: `calc(${bmiPercent}% - 6px)` }}
                >
                  <div
                    className={cn("w-3 h-3 rounded-full border-2 border-background", result.bgColor)}
                  />
                </div>
              </div>

              {/* Healthy weight */}
              <div className="text-sm text-muted-foreground text-center">
                Healthy weight range:{" "}
                <span className="font-medium text-foreground">
                  {result.minHealthy}–{result.maxHealthy} {unit === "metric" ? "kg" : "lbs"}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center rounded-2xl border-2 border-dashed border-border min-h-[200px]">
              <p className="text-sm text-muted-foreground text-center px-4">
                Enter your weight and height to calculate BMI
              </p>
            </div>
          )}
        </div>
      </div>

      {/* BMI scale legend */}
      <div className="border-t border-border px-5 py-4">
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          BMI Scale
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {bmiScale.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", s.color)} />
              <div>
                <p className="text-xs font-medium">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.range}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
