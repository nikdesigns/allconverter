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

const CITY_TZ_DB: { city: string; country: string; tz: string }[] = [
  // Americas
  { city: "New York",        country: "US", tz: "America/New_York" },
  { city: "Los Angeles",     country: "US", tz: "America/Los_Angeles" },
  { city: "Chicago",         country: "US", tz: "America/Chicago" },
  { city: "Denver",          country: "US", tz: "America/Denver" },
  { city: "Phoenix",         country: "US", tz: "America/Phoenix" },
  { city: "Houston",         country: "US", tz: "America/Chicago" },
  { city: "Miami",           country: "US", tz: "America/New_York" },
  { city: "Seattle",         country: "US", tz: "America/Los_Angeles" },
  { city: "San Francisco",   country: "US", tz: "America/Los_Angeles" },
  { city: "Las Vegas",       country: "US", tz: "America/Los_Angeles" },
  { city: "Boston",          country: "US", tz: "America/New_York" },
  { city: "Atlanta",         country: "US", tz: "America/New_York" },
  { city: "Washington DC",   country: "US", tz: "America/New_York" },
  { city: "Toronto",         country: "CA", tz: "America/Toronto" },
  { city: "Vancouver",       country: "CA", tz: "America/Vancouver" },
  { city: "Montreal",        country: "CA", tz: "America/Toronto" },
  { city: "Calgary",         country: "CA", tz: "America/Edmonton" },
  { city: "Mexico City",     country: "MX", tz: "America/Mexico_City" },
  { city: "São Paulo",       country: "BR", tz: "America/Sao_Paulo" },
  { city: "Buenos Aires",    country: "AR", tz: "America/Argentina/Buenos_Aires" },
  { city: "Bogotá",          country: "CO", tz: "America/Bogota" },
  { city: "Lima",            country: "PE", tz: "America/Lima" },
  { city: "Santiago",        country: "CL", tz: "America/Santiago" },
  { city: "Caracas",         country: "VE", tz: "America/Caracas" },
  { city: "Honolulu",        country: "US", tz: "Pacific/Honolulu" },
  { city: "Anchorage",       country: "US", tz: "America/Anchorage" },
  // Europe
  { city: "London",          country: "GB", tz: "Europe/London" },
  { city: "Paris",           country: "FR", tz: "Europe/Paris" },
  { city: "Berlin",          country: "DE", tz: "Europe/Berlin" },
  { city: "Madrid",          country: "ES", tz: "Europe/Madrid" },
  { city: "Rome",            country: "IT", tz: "Europe/Rome" },
  { city: "Amsterdam",       country: "NL", tz: "Europe/Amsterdam" },
  { city: "Brussels",        country: "BE", tz: "Europe/Brussels" },
  { city: "Zurich",          country: "CH", tz: "Europe/Zurich" },
  { city: "Vienna",          country: "AT", tz: "Europe/Vienna" },
  { city: "Warsaw",          country: "PL", tz: "Europe/Warsaw" },
  { city: "Prague",          country: "CZ", tz: "Europe/Prague" },
  { city: "Stockholm",       country: "SE", tz: "Europe/Stockholm" },
  { city: "Oslo",            country: "NO", tz: "Europe/Oslo" },
  { city: "Copenhagen",      country: "DK", tz: "Europe/Copenhagen" },
  { city: "Helsinki",        country: "FI", tz: "Europe/Helsinki" },
  { city: "Athens",          country: "GR", tz: "Europe/Athens" },
  { city: "Lisbon",          country: "PT", tz: "Europe/Lisbon" },
  { city: "Dublin",          country: "IE", tz: "Europe/Dublin" },
  { city: "Moscow",          country: "RU", tz: "Europe/Moscow" },
  { city: "Istanbul",        country: "TR", tz: "Europe/Istanbul" },
  { city: "Kyiv",            country: "UA", tz: "Europe/Kiev" },
  { city: "Bucharest",       country: "RO", tz: "Europe/Bucharest" },
  { city: "Budapest",        country: "HU", tz: "Europe/Budapest" },
  // Africa
  { city: "Cairo",           country: "EG", tz: "Africa/Cairo" },
  { city: "Lagos",           country: "NG", tz: "Africa/Lagos" },
  { city: "Nairobi",         country: "KE", tz: "Africa/Nairobi" },
  { city: "Johannesburg",    country: "ZA", tz: "Africa/Johannesburg" },
  { city: "Cape Town",       country: "ZA", tz: "Africa/Johannesburg" },
  { city: "Casablanca",      country: "MA", tz: "Africa/Casablanca" },
  { city: "Accra",           country: "GH", tz: "Africa/Accra" },
  { city: "Addis Ababa",     country: "ET", tz: "Africa/Addis_Ababa" },
  { city: "Dar es Salaam",   country: "TZ", tz: "Africa/Dar_es_Salaam" },
  // Middle East
  { city: "Dubai",           country: "AE", tz: "Asia/Dubai" },
  { city: "Abu Dhabi",       country: "AE", tz: "Asia/Dubai" },
  { city: "Riyadh",          country: "SA", tz: "Asia/Riyadh" },
  { city: "Doha",            country: "QA", tz: "Asia/Qatar" },
  { city: "Kuwait City",     country: "KW", tz: "Asia/Kuwait" },
  { city: "Manama",          country: "BH", tz: "Asia/Bahrain" },
  { city: "Muscat",          country: "OM", tz: "Asia/Muscat" },
  { city: "Baghdad",         country: "IQ", tz: "Asia/Baghdad" },
  { city: "Tehran",          country: "IR", tz: "Asia/Tehran" },
  { city: "Beirut",          country: "LB", tz: "Asia/Beirut" },
  { city: "Tel Aviv",        country: "IL", tz: "Asia/Jerusalem" },
  { city: "Amman",           country: "JO", tz: "Asia/Amman" },
  // Asia
  { city: "Mumbai",          country: "IN", tz: "Asia/Kolkata" },
  { city: "Delhi",           country: "IN", tz: "Asia/Kolkata" },
  { city: "Bangalore",       country: "IN", tz: "Asia/Kolkata" },
  { city: "Chennai",         country: "IN", tz: "Asia/Kolkata" },
  { city: "Hyderabad",       country: "IN", tz: "Asia/Kolkata" },
  { city: "Kolkata",         country: "IN", tz: "Asia/Kolkata" },
  { city: "Pune",            country: "IN", tz: "Asia/Kolkata" },
  { city: "Karachi",         country: "PK", tz: "Asia/Karachi" },
  { city: "Lahore",          country: "PK", tz: "Asia/Karachi" },
  { city: "Islamabad",       country: "PK", tz: "Asia/Karachi" },
  { city: "Dhaka",           country: "BD", tz: "Asia/Dhaka" },
  { city: "Colombo",         country: "LK", tz: "Asia/Colombo" },
  { city: "Kathmandu",       country: "NP", tz: "Asia/Kathmandu" },
  { city: "Kabul",           country: "AF", tz: "Asia/Kabul" },
  { city: "Tashkent",        country: "UZ", tz: "Asia/Tashkent" },
  { city: "Bangkok",         country: "TH", tz: "Asia/Bangkok" },
  { city: "Jakarta",         country: "ID", tz: "Asia/Jakarta" },
  { city: "Ho Chi Minh City",country: "VN", tz: "Asia/Ho_Chi_Minh" },
  { city: "Hanoi",           country: "VN", tz: "Asia/Bangkok" },
  { city: "Kuala Lumpur",    country: "MY", tz: "Asia/Kuala_Lumpur" },
  { city: "Singapore",       country: "SG", tz: "Asia/Singapore" },
  { city: "Manila",          country: "PH", tz: "Asia/Manila" },
  { city: "Hong Kong",       country: "HK", tz: "Asia/Hong_Kong" },
  { city: "Shanghai",        country: "CN", tz: "Asia/Shanghai" },
  { city: "Beijing",         country: "CN", tz: "Asia/Shanghai" },
  { city: "Shenzhen",        country: "CN", tz: "Asia/Shanghai" },
  { city: "Guangzhou",       country: "CN", tz: "Asia/Shanghai" },
  { city: "Chengdu",         country: "CN", tz: "Asia/Shanghai" },
  { city: "Tokyo",           country: "JP", tz: "Asia/Tokyo" },
  { city: "Osaka",           country: "JP", tz: "Asia/Tokyo" },
  { city: "Seoul",           country: "KR", tz: "Asia/Seoul" },
  { city: "Taipei",          country: "TW", tz: "Asia/Taipei" },
  { city: "Ulaanbaatar",     country: "MN", tz: "Asia/Ulaanbaatar" },
  { city: "Yangon",          country: "MM", tz: "Asia/Rangoon" },
  // Pacific & Oceania
  { city: "Sydney",          country: "AU", tz: "Australia/Sydney" },
  { city: "Melbourne",       country: "AU", tz: "Australia/Melbourne" },
  { city: "Brisbane",        country: "AU", tz: "Australia/Brisbane" },
  { city: "Perth",           country: "AU", tz: "Australia/Perth" },
  { city: "Adelaide",        country: "AU", tz: "Australia/Adelaide" },
  { city: "Auckland",        country: "NZ", tz: "Pacific/Auckland" },
  { city: "Fiji",            country: "FJ", tz: "Pacific/Fiji" },
  // UTC
  { city: "UTC",             country: "",   tz: "UTC" },
];

const DEFAULT_CITIES = [
  { city: "New York",    country: "US", tz: "America/New_York" },
  { city: "London",      country: "GB", tz: "Europe/London" },
  { city: "Dubai",       country: "AE", tz: "Asia/Dubai" },
  { city: "Mumbai",      country: "IN", tz: "Asia/Kolkata" },
  { city: "Singapore",   country: "SG", tz: "Asia/Singapore" },
  { city: "Tokyo",       country: "JP", tz: "Asia/Tokyo" },
  { city: "Sydney",      country: "AU", tz: "Australia/Sydney" },
  { city: "Los Angeles", country: "US", tz: "America/Los_Angeles" },
];

function WorldClock() {
  const [cities, setCities]     = useState(DEFAULT_CITIES);
  const [now, setNow]           = useState<Date | null>(null);
  const [query, setQuery]       = useState("");
  const [suggestions, setSuggestions] = useState<typeof CITY_TZ_DB>([]);
  const [open, setOpen]         = useState(false);
  const [dropPos, setDropPos]   = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setSuggestions([]); setOpen(false); return; }
    const matches = CITY_TZ_DB.filter(
      ({ city, country }) =>
        city.toLowerCase().includes(q) || country.toLowerCase().includes(q)
    ).slice(0, 8);
    setSuggestions(matches);
    if (matches.length > 0 && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [query]);

  const fmtTime = (tz: string) => {
    if (!now) return "--:--:--";
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).format(now);
  };

  const fmtDate = (tz: string) => new Intl.DateTimeFormat("en", {
    timeZone: tz, weekday: "short", month: "short", day: "numeric",
  }).format(now);

  const fmtOffset = (tz: string) => {
    try {
      const parts = new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "shortOffset" })
        .formatToParts(now);
      return parts.find(p => p.type === "timeZoneName")?.value ?? "";
    } catch { return ""; }
  };

  const addCity = (entry: typeof CITY_TZ_DB[number]) => {
    if (cities.find(c => c.tz === entry.tz && c.city === entry.city)) return;
    setCities(c => [...c, entry]);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeCity = (i: number) => setCities(cs => cs.filter((_, j) => j !== i));

  return (
    <div className="space-y-4">
      {/* City cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {cities.map((c, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 group">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-semibold text-foreground">{c.city}</span>
                {c.country && (
                  <span className="text-[10px] text-muted-foreground font-medium">{c.country}</span>
                )}
              </div>
              <div className="font-mono font-bold text-2xl tracking-tight leading-none">{fmtTime(c.tz)}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {fmtDate(c.tz)} · {fmtOffset(c.tz)}
              </div>
            </div>
            {i >= DEFAULT_CITIES.length && (
              <button
                onClick={() => removeCity(i)}
                className="text-muted-foreground hover:text-rose-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* City search — single input, auto-resolves timezone */}
      <div ref={dropRef}>
        <Input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0 && inputRef.current) {
              const rect = inputRef.current.getBoundingClientRect();
              setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
              setOpen(true);
            }
          }}
          placeholder="Type a city name to add… e.g. Tokyo, Paris, Mumbai"
          className="h-10 text-sm w-full"
        />

        {open && (
          <div
            className="fixed z-9999 rounded-xl border border-border bg-popover shadow-xl overflow-hidden"
            style={{ top: dropPos.top, left: dropPos.left, width: dropPos.width }}
          >
            {suggestions.map((entry, i) => {
              const alreadyAdded = cities.some(c => c.tz === entry.tz && c.city === entry.city);
              return (
                <button
                  key={i}
                  onMouseDown={e => { e.preventDefault(); if (!alreadyAdded) addCity(entry); }}
                  disabled={alreadyAdded}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors",
                    alreadyAdded && "opacity-40 cursor-default"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.city}</span>
                    {entry.country && (
                      <span className="text-xs text-muted-foreground">{entry.country}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground font-mono">{fmtTime(entry.tz)}</span>
                    {alreadyAdded
                      ? <span className="text-[10px] text-muted-foreground">added</span>
                      : <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          Search from 120+ cities worldwide — timezone is resolved automatically.
        </p>
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
                <div key={u.label} className="min-w-15">
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
