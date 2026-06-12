"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

function calcAge(birthDate: Date, targetDate: Date) {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalMonths = years * 12 + months;
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  // Next birthday
  const nextBd = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBd <= targetDate) nextBd.setFullYear(nextBd.getFullYear() + 1);
  const daysToNextBd = Math.ceil((nextBd.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, daysToNextBd };
}

const STATS = [
  { label: "Years", key: "years" as const },
  { label: "Months", key: "months" as const },
  { label: "Days", key: "days" as const },
];

const TOTALS = [
  { label: "Total days", key: "totalDays" as const },
  { label: "Total weeks", key: "totalWeeks" as const },
  { label: "Total months", key: "totalMonths" as const },
  { label: "Total hours", key: "totalHours" as const },
  { label: "Total minutes", key: "totalMinutes" as const },
];

export function AgeCalculatorTool() {
  const today = new Date().toISOString().split("T")[0];
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [targetDate, setTargetDate] = useState(today);

  const result = useMemo(() => {
    try {
      const bd = new Date(birthDate);
      const td = new Date(targetDate);
      if (isNaN(bd.getTime()) || isNaN(td.getTime()) || bd >= td) return null;
      return calcAge(bd, td);
    } catch {
      return null;
    }
  }, [birthDate, targetDate]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Calendar className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Age Calculator</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">
              Date of Birth
            </label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={today}
              className="h-11"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">
              Age on date
            </label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              max={new Date(Date.now() + 86400000 * 365 * 50).toISOString().split("T")[0]}
              className="h-11"
            />
          </div>
        </div>

        {result ? (
          <>
            {/* Main age display */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Your Age
              </p>
              <div className="flex items-end justify-center gap-3 flex-wrap">
                {STATS.map((s) => (
                  <div key={s.key} className="text-center">
                    <p className="text-4xl font-bold tabular-nums text-foreground">
                      {result[s.key]}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TOTALS.map((s) => (
                <div key={s.key} className="rounded-xl border border-border bg-muted/20 p-3 text-center">
                  <p className="text-lg font-bold tabular-nums">
                    {result[s.key].toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Next birthday */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
              <span className="text-2xl">🎂</span>
              <div>
                <p className="text-sm font-medium">Next Birthday</p>
                <p className="text-xs text-muted-foreground">
                  {result.daysToNextBd === 0
                    ? "Today is your birthday! 🎉"
                    : `${result.daysToNextBd} days away`}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-10 rounded-2xl border-2 border-dashed border-border">
            <p className="text-sm text-muted-foreground">
              Enter a valid birth date to calculate age
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
