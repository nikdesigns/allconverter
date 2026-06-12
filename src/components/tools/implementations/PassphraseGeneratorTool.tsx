"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Key } from "lucide-react";
import { toast } from "sonner";

const WORDS = ["apple","bridge","cloud","dream","eagle","flame","ghost","honey","ivory","jewel","karma","lemon","magic","noble","ocean","piano","queen","river","solar","tiger","ultra","vapor","wheel","xenon","yacht","zebra","amber","blade","cedar","delta","ember","frost","globe","haven","index","joker","kneel","lunar","maple","nexus","olive","pearl","quirk","rally","slate","thorn","unite","vibes","world","xenon","yield","azure","blaze","crisp","dance","elite","focus","grace","haste","image","judge","knack","light","merit","nerve","orbit","phase","quest","realm","scope","tower","ultra","vista","winds","xerox","youth","zonal","brave","crisp","dusk","echo","fern","glow","haze","iris","jade","keen","loft","mist","neon","opal","pine","roar","sage","tale","veil","warp"];

function randWord() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function PassphraseGeneratorTool() {
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [capitalize_, setCapitalize] = useState(false);
  const [addNumber, setAddNumber] = useState(false);
  const [passphrases, setPassphrases] = useState<string[]>([]);

  const generate = useCallback(() => {
    const list: string[] = [];
    for (let j = 0; j < 5; j++) {
      const words = Array.from({ length: wordCount }, () => {
        const w = randWord();
        return capitalize_ ? capitalize(w) : w;
      });
      if (addNumber) words.push(String(Math.floor(Math.random() * 9000) + 1000));
      list.push(words.join(separator));
    }
    setPassphrases(list);
  }, [wordCount, separator, capitalize_, addNumber]);

  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success("Copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Key className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Passphrase Generator</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Words</label>
            <Input type="number" min={3} max={8} value={wordCount} onChange={e => setWordCount(+e.target.value)} className="text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Separator</label>
            <Input value={separator} onChange={e => setSeparator(e.target.value)} className="text-sm font-mono" />
          </div>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={capitalize_} onChange={e => setCapitalize(e.target.checked)} className="w-4 h-4 rounded" />
            Capitalize
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={addNumber} onChange={e => setAddNumber(e.target.checked)} className="w-4 h-4 rounded" />
            Add number
          </label>
        </div>
        <Button onClick={generate} className="w-full gap-2"><RefreshCw className="w-4 h-4" />Generate Passphrases</Button>
        {passphrases.length > 0 && (
          <div className="space-y-2">
            {passphrases.map((p, i) => (
              <div key={i} className="flex items-center justify-between gap-2 p-3 rounded-xl border border-border bg-muted/10">
                <code className="text-sm font-mono flex-1 break-all">{p}</code>
                <button onClick={() => copy(p)} className="shrink-0 p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
