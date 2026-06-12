"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PREFIXES: Record<string, string[]> = {
  tech:    ["Nova", "Apex", "Zen", "Flux", "Byte", "Nexus", "Pixel", "Qubit", "Volt", "Arc"],
  health:  ["Vita", "Zeal", "Pure", "Helio", "Brio", "Bloom", "Vive", "Forte", "Care", "Aura"],
  finance: ["Acme", "Crest", "Trust", "Prime", "Apex", "Verity", "Ledge", "Capital", "Merit", "Forte"],
  food:    ["Zest", "Savor", "Crisp", "Nosh", "Bake", "Feast", "Tangy", "Grove", "Harvest", "Sprig"],
  fashion: ["Vogue", "Flair", "Stitch", "Drape", "Cloth", "Thread", "Silk", "Arc", "Preen", "Loom"],
  edu:     ["Lumis", "Sage", "Nova", "Mentor", "Edify", "Spark", "Alma", "Academ", "Scholar", "Wit"],
  general: ["Vivid", "Bright", "Bold", "Keen", "Swift", "Clear", "Peak", "Rise", "Core", "Vex"],
};

const SUFFIXES: Record<string, string[]> = {
  modern:       ["ly", "io", "ify", "hub", "lab", "HQ", "dot", "AI", "co", "up"],
  classic:      ["Corp", "Group", "Partners", "Solutions", "Services", "Associates", "Inc", "Co", "Ltd", "Pro"],
  playful:      ["oo", "ish", "ster", "ling", "kins", "ze", "sy", "ie", "berry", "pop"],
  professional: ["Consulting", "Ventures", "Strategies", "Systems", "Analytics", "Dynamics", "Networks", "Advisors", "Works", "Agency"],
};

const DOMAINS = [".com", ".io", ".co", ".app", ".ai", ".dev"];

function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function generateNames(keyword: string, industry: string, style: string, count: number, seed: number): string[] {
  const prefixPool = [...(PREFIXES[industry] || PREFIXES.general), ...PREFIXES.general];
  const suffixPool = SUFFIXES[style] || SUFFIXES.modern;
  const kw = keyword.trim().replace(/\s+/g,"").toLowerCase();
  const kwTitled = kw.charAt(0).toUpperCase() + kw.slice(1);
  const rand = seededRand(seed);
  const names = new Set<string>();

  for (let i = 0; names.size < count && i < 200; i++) {
    const p = prefixPool[Math.floor(rand() * prefixPool.length)];
    const s = suffixPool[Math.floor(rand() * suffixPool.length)];
    const pattern = Math.floor(rand() * 5);
    let name = "";
    if (kw) {
      if (pattern === 0) name = kwTitled + s;
      else if (pattern === 1) name = p + kwTitled;
      else if (pattern === 2) name = p + s;
      else if (pattern === 3) name = kwTitled + p;
      else name = p + kwTitled + s;
    } else {
      name = pattern < 3 ? p + s : p + suffixPool[Math.floor(rand() * suffixPool.length)];
    }
    // Normalize
    name = name.charAt(0).toUpperCase() + name.slice(1);
    if (name.length >= 4 && name.length <= 20) names.add(name);
  }
  return Array.from(names).slice(0, count);
}

const INDUSTRIES = [
  { id: "tech",    label: "Tech / Software" },
  { id: "health",  label: "Health & Wellness" },
  { id: "finance", label: "Finance" },
  { id: "food",    label: "Food & Beverage" },
  { id: "fashion", label: "Fashion" },
  { id: "edu",     label: "Education" },
  { id: "general", label: "General" },
];

const STYLES = [
  { id: "modern",       label: "Modern" },
  { id: "classic",      label: "Classic" },
  { id: "playful",      label: "Playful" },
  { id: "professional", label: "Professional" },
];

export function BusinessNameGeneratorTool() {
  const [keyword, setKeyword]   = useState("");
  const [industry, setIndustry] = useState("tech");
  const [style, setStyle]       = useState("modern");
  const [count, setCount]       = useState(20);
  const [seed, setSeed]         = useState(42);
  const [names, setNames]       = useState<string[]>([]);
  const [copied, setCopied]     = useState<string>("");
  const [generated, setGenerated] = useState(false);

  const generate = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 100000);
    setSeed(newSeed);
    setNames(generateNames(keyword, industry, style, count, newSeed));
    setGenerated(true);
  }, [keyword, industry, style, count]);

  const copyName = async (name: string) => {
    await navigator.clipboard.writeText(name);
    setCopied(name);
    toast.success(`"${name}" copied!`);
    setTimeout(() => setCopied(""), 2000);
  };

  const domainColor = (domain: string) => {
    const map: Record<string, string> = { ".com": "text-emerald-600 dark:text-emerald-400", ".io": "text-blue-500", ".co": "text-violet-500", ".app": "text-orange-500", ".ai": "text-pink-500", ".dev": "text-cyan-500" };
    return map[domain] || "text-muted-foreground";
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Business Name Generator</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Keyword */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Keyword (optional)</label>
          <Input value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key==="Enter" && generate()} placeholder="e.g. cloud, fit, pay, shop…" className="text-sm" />
        </div>

        {/* Industry */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Industry</p>
          <div className="flex flex-wrap gap-1.5">
            {INDUSTRIES.map(i => (
              <button key={i.id} onClick={() => setIndustry(i.id)} className={cn("px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all", industry===i.id?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground hover:border-primary/30")}>
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Name Style</p>
          <div className="flex flex-wrap gap-1.5">
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)} className={cn("px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all", style===s.id?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground hover:border-primary/30")}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count + Generate */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Generate</span>
            {[10,20,30].map(n => (
              <button key={n} onClick={() => setCount(n)} className={cn("w-8 h-8 rounded-lg border text-xs font-medium transition-all", count===n?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground hover:border-primary/30")}>{n}</button>
            ))}
            <span className="text-xs text-muted-foreground">names</span>
          </div>
          <Button onClick={generate} className="gap-2 ml-auto">
            {generated ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {generated ? "Regenerate" : "Generate Names"}
          </Button>
        </div>

        {/* Results */}
        {names.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{names.length} name suggestions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {names.map(name => (
                <div key={name} className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/30 bg-muted/10 hover:bg-primary/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{name}</span>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {DOMAINS.slice(0, 3).map(d => (
                        <span key={d} className={cn("text-[10px] font-mono font-medium", domainColor(d))}>{d}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => copyName(name)} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors shrink-0">
                    {copied===name ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!generated && (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Choose your industry and style, then click Generate</p>
          </div>
        )}
      </div>
    </div>
  );
}
