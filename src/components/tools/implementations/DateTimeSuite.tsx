"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Copy, Plus, X, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function copy(text: string) { navigator.clipboard.writeText(text); toast.success("Copied!"); }

// ─── Date Calculator ──────────────────────────────────────────────────────────

function DateCalculator() {
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [op, setOp]    = useState<"add"|"sub">("add");
  const [days, setDays]    = useState(30);
  const [weeks, setWeeks]  = useState(0);
  const [months, setMonths] = useState(0);
  const [years, setYears]  = useState(0);

  const calc = (): Date | null => {
    const d = new Date(startDate + "T12:00:00");
    if (isNaN(d.getTime())) return null;
    const sign = op === "add" ? 1 : -1;
    d.setDate(d.getDate() + sign * (days + weeks * 7));
    d.setMonth(d.getMonth() + sign * months);
    d.setFullYear(d.getFullYear() + sign * years);
    return d;
  };

  const result = calc();
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const format = (d: Date) =>
    `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Start date</label>
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-10 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Operation</label>
          <div className="flex gap-2 h-10">
            {(["add","sub"] as const).map(o => (
              <button key={o} onClick={() => setOp(o)}
                className={cn("flex-1 rounded-xl border text-sm font-medium transition-all",
                  op === o ? "border-primary/50 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}>
                {o === "add" ? "+ Add" : "− Subtract"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[{label:"Days",val:days,set:setDays},{label:"Weeks",val:weeks,set:setWeeks},{label:"Months",val:months,set:setMonths},{label:"Years",val:years,set:setYears}].map(f => (
          <div key={f.label} className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground block text-center">{f.label}</label>
            <Input type="number" min={0} value={f.val} onChange={e => f.set(Number(e.target.value))}
              className="h-9 text-sm text-center" />
          </div>
        ))}
      </div>

      {result && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center space-y-1">
          <div className="text-2xl font-bold text-primary">{format(result)}</div>
          <div className="text-xs text-muted-foreground">{result.toISOString().split("T")[0]}</div>
          <Button size="sm" variant="ghost" onClick={() => copy(result.toISOString().split("T")[0])} className="h-6 text-xs gap-1 mt-1">
            <Copy className="w-3 h-3" /> Copy date
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Date Difference Calculator ───────────────────────────────────────────────

function DateDifferenceCalculator() {
  const [date1, setDate1] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [date2, setDate2] = useState(() => new Date().toISOString().split("T")[0]);

  const calc = () => {
    const d1 = new Date(date1 + "T12:00:00");
    const d2 = new Date(date2 + "T12:00:00");
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const start = d1 < d2 ? d1 : d2;
    const end   = d1 < d2 ? d2 : d1;
    const totalMs = end.getTime() - start.getTime();
    const totalDays = Math.round(totalMs / 86400000);
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    const years = end.getFullYear() - start.getFullYear();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    // count business days
    let bizDays = 0;
    const cur = new Date(start);
    while (cur < end) { const dow = cur.getDay(); if (dow !== 0 && dow !== 6) bizDays++; cur.setDate(cur.getDate() + 1); }

    return { totalDays, weeks, remDays, months, years, bizDays };
  };

  const r = calc();

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        {[{label:"Start date",val:date1,set:setDate1},{label:"End date",val:date2,set:setDate2}].map(f => (
          <div key={f.label} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
            <Input type="date" value={f.val} onChange={e => f.set(e.target.value)} className="h-10 text-sm" />
          </div>
        ))}
      </div>

      {r && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Total days",     value: r.totalDays.toLocaleString() },
            { label: "Weeks + days",   value: `${r.weeks}w ${r.remDays}d` },
            { label: "Total months",   value: r.months.toLocaleString() },
            { label: "Approx. years",  value: r.years > 0 ? `~${r.years}` : "< 1" },
            { label: "Business days",  value: r.bizDays.toLocaleString() },
            { label: "Weekend days",   value: (r.totalDays - r.bizDays).toLocaleString() },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border p-3 text-center">
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Timezone Converter ───────────────────────────────────────────────────────

const TIMEZONES = [
  "UTC","America/New_York","America/Los_Angeles","America/Chicago","America/Denver",
  "America/Toronto","America/Vancouver","America/Sao_Paulo","America/Buenos_Aires",
  "Europe/London","Europe/Paris","Europe/Berlin","Europe/Moscow","Europe/Istanbul",
  "Africa/Cairo","Africa/Lagos","Africa/Johannesburg",
  "Asia/Dubai","Asia/Kolkata","Asia/Dhaka","Asia/Bangkok","Asia/Singapore",
  "Asia/Hong_Kong","Asia/Shanghai","Asia/Tokyo","Asia/Seoul",
  "Australia/Sydney","Australia/Melbourne","Pacific/Auckland","Pacific/Honolulu",
];

function TimezoneConverter() {
  const [datetime, setDatetime] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz]     = useState("Asia/Kolkata");

  const convert = () => {
    try {
      const dt = new Date(datetime + ":00");
      const fromOffset = new Intl.DateTimeFormat("en", { timeZone: fromTz, timeZoneName: "shortOffset" }).formatToParts(dt).find(p => p.type === "timeZoneName")?.value ?? "";
      const toStr = new Intl.DateTimeFormat("en-IN", {
        timeZone: toTz, year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, weekday: "long",
      }).format(dt);
      return { toStr, fromOffset };
    } catch { return null; }
  };

  const result = convert();

  const tzSelect = (value: string, onChange: (v: string) => void, label: string) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
        {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Date & time</label>
        <Input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} className="h-10 text-sm" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {tzSelect(fromTz, setFromTz, "From timezone")}
        {tzSelect(toTz, setToTz, "To timezone")}
      </div>

      {result && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <div className="text-xs text-muted-foreground font-medium">Converted time ({toTz.replace(/_/g, " ")})</div>
          <div className="text-lg font-bold">{result.toStr}</div>
          <Button size="sm" variant="ghost" onClick={() => copy(result.toStr)} className="h-6 text-xs gap-1">
            <Copy className="w-3 h-3" /> Copy
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── World Clock ──────────────────────────────────────────────────────────────

const DEFAULT_CITIES = [
  { city: "New York",   tz: "America/New_York" },
  { city: "London",     tz: "Europe/London" },
  { city: "Dubai",      tz: "Asia/Dubai" },
  { city: "Mumbai",     tz: "Asia/Kolkata" },
  { city: "Singapore",  tz: "Asia/Singapore" },
  { city: "Tokyo",      tz: "Asia/Tokyo" },
  { city: "Sydney",     tz: "Australia/Sydney" },
  { city: "Los Angeles",tz: "America/Los_Angeles" },
];

function WorldClock() {
  const [cities, setCities]   = useState(DEFAULT_CITIES);
  const [now, setNow]         = useState(new Date());
  const [addTz, setAddTz]     = useState("");
  const [addCity, setAddCity] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmtTime = (tz: string) => new Intl.DateTimeFormat("en", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(now);

  const fmtDate = (tz: string) => new Intl.DateTimeFormat("en", {
    timeZone: tz, weekday: "short", month: "short", day: "numeric",
  }).format(now);

  const addCity_ = () => {
    if (!addTz || !addCity.trim()) return;
    setCities(c => [...c, { city: addCity.trim(), tz: addTz }]);
    setAddCity(""); setAddTz("");
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        {cities.map((c, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <div className="text-xs text-muted-foreground">{c.city}</div>
              <div className="font-mono font-bold text-xl tracking-tight">{fmtTime(c.tz)}</div>
              <div className="text-xs text-muted-foreground">{fmtDate(c.tz)}</div>
            </div>
            {i >= DEFAULT_CITIES.length && (
              <button onClick={() => setCities(cs => cs.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-rose-400 ml-2">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Input value={addCity} onChange={e => setAddCity(e.target.value)} placeholder="City name" className="h-9 text-sm w-36" />
        <select value={addTz} onChange={e => setAddTz(e.target.value)}
          className="h-9 rounded-xl border border-border bg-background px-2 text-sm flex-1 min-w-[160px] focus:outline-none">
          <option value="">Select timezone</option>
          {TIMEZONES.filter(tz => !cities.find(c => c.tz === tz)).map(tz => (
            <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
          ))}
        </select>
        <Button size="sm" onClick={addCity_} disabled={!addTz || !addCity.trim()} className="h-9 gap-1">
          <Plus className="w-3.5 h-3.5" /> Add
        </Button>
      </div>
    </div>
  );
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────

function CountdownTimer() {
  const [targetDate, setTargetDate] = useState("");
  const [targetTime, setTargetTime] = useState("00:00");
  const [eventName, setEventName]   = useState("");
  const [running, setRunning]       = useState(false);
  const [remaining, setRemaining]   = useState<{d:number,h:number,m:number,s:number,total:number}|null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const getRemaining = () => {
    const target = new Date(`${targetDate}T${targetTime}:00`);
    const now = new Date();
    const total = target.getTime() - now.getTime();
    if (total <= 0) return { d:0, h:0, m:0, s:0, total:0 };
    const d = Math.floor(total / 86400000);
    const h = Math.floor((total % 86400000) / 3600000);
    const m = Math.floor((total % 3600000) / 60000);
    const s = Math.floor((total % 60000) / 1000);
    return { d, h, m, s, total };
  };

  const start = () => {
    if (!targetDate) return;
    setRunning(true);
    setRemaining(getRemaining());
    intervalRef.current = setInterval(() => {
      const r = getRemaining();
      setRemaining(r);
      if (r.total <= 0) { clearInterval(intervalRef.current!); setRunning(false); }
    }, 1000);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false); setRemaining(null);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Event date</label>
          <Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="h-10 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Time</label>
          <Input type="time" value={targetTime} onChange={e => setTargetTime(e.target.value)} className="h-10 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Event name (optional)</label>
          <Input value={eventName} onChange={e => setEventName(e.target.value)} placeholder="e.g. New Year 2026" className="h-10 text-sm" />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={start} disabled={!targetDate || running} className="gap-1.5">
          <Play className="w-3.5 h-3.5" /> Start Countdown
        </Button>
        {running && <Button variant="outline" onClick={reset} className="gap-1.5"><RotateCcw className="w-3.5 h-3.5" />Reset</Button>}
      </div>

      {remaining && (
        <div className="rounded-xl border border-border bg-muted/10 p-6 space-y-3 text-center">
          {eventName && <div className="text-sm font-medium text-muted-foreground">{eventName}</div>}
          {remaining.total > 0 ? (
            <div className="flex justify-center gap-4">
              {[{label:"Days",val:remaining.d},{label:"Hours",val:remaining.h},{label:"Minutes",val:remaining.m},{label:"Seconds",val:remaining.s}].map(u => (
                <div key={u.label} className="min-w-[60px]">
                  <div className="text-4xl font-black font-mono tabular-nums">{pad(u.val)}</div>
                  <div className="text-[10px] text-muted-foreground uppercase mt-1">{u.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-2xl font-bold text-emerald-400">🎉 Time&apos;s up!</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Suite Router ─────────────────────────────────────────────────────────────

const TOOLS: Record<string, { title: string; component: React.ComponentType }> = {
  "date-calculator":            { title: "Date Calculator",              component: DateCalculator },
  "date-difference-calculator": { title: "Date Difference Calculator",   component: DateDifferenceCalculator },
  "timezone-converter":         { title: "Time Zone Converter",          component: TimezoneConverter },
  "world-clock":                { title: "World Clock",                  component: WorldClock },
  "countdown-timer":            { title: "Countdown Timer",              component: CountdownTimer },
};

export function DateTimeSuite() {
  const pathname = usePathname();
  const slug = pathname.split("/tools/")[1]?.replace(/\/$/, "") ?? "";
  const tool = TOOLS[slug];
  if (!tool) return <div className="p-6 text-muted-foreground text-sm">Tool not found.</div>;
  const Component = tool.component;
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">
        <Component />
      </div>
    </div>
  );
}
