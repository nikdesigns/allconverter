"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

function calcStrength(pass: string) {
  const checks = {
    length8: pass.length >= 8,
    length12: pass.length >= 12,
    length16: pass.length >= 16,
    lowercase: /[a-z]/.test(pass),
    uppercase: /[A-Z]/.test(pass),
    numbers: /[0-9]/.test(pass),
    symbols: /[^a-zA-Z0-9]/.test(pass),
    noCommon: !["password","123456","qwerty","letmein","welcome","admin","login"].some(w => pass.toLowerCase().includes(w)),
    noRepeat: !/(.)\1{2,}/.test(pass),
  };

  let score = 0;
  if (checks.length8) score += 10;
  if (checks.length12) score += 15;
  if (checks.length16) score += 15;
  if (checks.lowercase) score += 10;
  if (checks.uppercase) score += 10;
  if (checks.numbers) score += 10;
  if (checks.symbols) score += 20;
  if (checks.noCommon) score += 5;
  if (checks.noRepeat) score += 5;

  // Bonus for mixing all types + good length
  if (checks.lowercase && checks.uppercase && checks.numbers && checks.symbols && checks.length12) score += 10;

  const label = score < 20 ? "Very Weak" : score < 40 ? "Weak" : score < 60 ? "Fair" : score < 80 ? "Strong" : "Very Strong";
  const color = score < 20 ? "bg-red-500" : score < 40 ? "bg-orange-500" : score < 60 ? "bg-amber-500" : score < 80 ? "bg-lime-500" : "bg-emerald-500";
  const textColor = score < 20 ? "text-red-500" : score < 40 ? "text-orange-500" : score < 60 ? "text-amber-500" : score < 80 ? "text-lime-500" : "text-emerald-500";

  // Crack time estimate
  const entropy = pass.length * Math.log2(
    (/[a-z]/.test(pass) ? 26 : 0) + (/[A-Z]/.test(pass) ? 26 : 0) +
    (/[0-9]/.test(pass) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(pass) ? 32 : 0) || 26
  );
  const attempts = Math.pow(2, entropy);
  const attPerSec = 1e10;
  const seconds = attempts / attPerSec;
  const crackTime = seconds < 1 ? "instantly" : seconds < 60 ? `${Math.round(seconds)}s` : seconds < 3600 ? `${Math.round(seconds/60)} min` : seconds < 86400 ? `${Math.round(seconds/3600)} hours` : seconds < 31536000 ? `${Math.round(seconds/86400)} days` : seconds < 3.15e9 ? `${Math.round(seconds/31536000)} years` : "centuries";

  return { score, label, color, textColor, checks, crackTime, entropy: Math.round(entropy) };
}

export function PasswordStrengthCheckerTool() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const strength = useMemo(() => password ? calcStrength(password) : null, [password]);

  const CRITERIA = [
    { key: "length8", label: "At least 8 characters" },
    { key: "length12", label: "At least 12 characters" },
    { key: "length16", label: "16+ characters (best)" },
    { key: "lowercase", label: "Lowercase letters (a-z)" },
    { key: "uppercase", label: "Uppercase letters (A-Z)" },
    { key: "numbers", label: "Numbers (0-9)" },
    { key: "symbols", label: "Symbols (!@#$%^&*)" },
    { key: "noCommon", label: "Not a common password" },
    { key: "noRepeat", label: "No repeated characters" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Password Strength Checker</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter a password to analyse…"
            className="pr-10 text-sm font-mono"
            autoComplete="new-password"
          />
          <button onClick={() => setShow(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {strength && (
          <>
            {/* Strength bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${strength.textColor}`}>{strength.label}</span>
                <span className="text-xs text-muted-foreground">Score: {strength.score}/100</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                  style={{ width: `${strength.score}%` }} />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-border bg-muted/10 text-center">
                <p className="text-xs text-muted-foreground">Length</p>
                <p className="text-lg font-bold font-mono mt-0.5">{password.length}</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-muted/10 text-center">
                <p className="text-xs text-muted-foreground">Entropy</p>
                <p className="text-lg font-bold font-mono mt-0.5">{strength.entropy} bits</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-muted/10 text-center">
                <p className="text-xs text-muted-foreground">Crack time</p>
                <p className={`text-sm font-bold mt-0.5 ${strength.textColor}`}>{strength.crackTime}</p>
              </div>
            </div>

            {/* Criteria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {CRITERIA.map(c => {
                const passed = strength.checks[c.key as keyof typeof strength.checks];
                return (
                  <div key={c.key} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${passed ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                    {c.label}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Crack time assumes {(1e10).toLocaleString()} guesses/second (GPU attack)
            </p>
          </>
        )}

        {!password && (
          <div className="py-8 text-center">
            <ShieldCheck className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Enter a password above to check its strength.</p>
            <p className="text-xs text-muted-foreground mt-1">Analysed locally — nothing is sent to a server.</p>
          </div>
        )}
      </div>
    </div>
  );
}
