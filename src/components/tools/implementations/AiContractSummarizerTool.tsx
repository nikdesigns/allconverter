"use client";

import { useState } from "react";
import { Sparkles, Copy, Upload, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ContractSummary {
  type: string;
  parties: string[];
  effectiveDate: string;
  expiryDate: string;
  duration: string;
  keyObligations: string[];
  paymentTerms: string[];
  confidentiality: string;
  termination: string;
  governingLaw: string;
  riskFlags: string[];
  summary: string;
}

function extractParties(text: string): string[] {
  const parties: string[] = [];
  const patterns = [
    /between\s+([A-Z][^,\n(]{2,50})\s*(?:,\s*a\s+\w+|)\s*\("([^"]{1,40})"\)/gi,
    /([A-Z][A-Za-z\s.,]+(?:Inc|LLC|Ltd|Limited|Corp|Company|pvt|Pvt)\.?)/g,
    /(?:Party|CLIENT|VENDOR|EMPLOYER|EMPLOYEE|LICENSOR|LICENSEE|BUYER|SELLER)\s*[:\-]?\s*([A-Z][^\n,;]{5,50})/gi,
  ];
  for (const p of patterns) {
    const m = [...text.matchAll(p)];
    for (const match of m.slice(0, 4)) {
      const name = (match[1] || "").trim();
      if (name.length > 3 && !parties.includes(name)) parties.push(name);
    }
    if (parties.length >= 3) break;
  }
  return parties.slice(0, 4);
}

function extractDates(text: string): { effective: string; expiry: string; duration: string } {
  const dateRx = /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}-\d{2}-\d{2}/gi;
  const dates = [...text.matchAll(dateRx)].map(m => m[0]);
  const effectiveRx = /(?:effective|commencing|start|commencement)\s+(?:date|on)?\s*:?\s*([^\n.,;]{5,40})/i;
  const expiryRx = /(?:expir|terminat|end|expires?|valid until|through)\s+(?:date|on)?\s*:?\s*([^\n.,;]{5,40})/i;
  const durationRx = /(?:term|duration|period)\s+(?:of|:)?\s*([^\n.,;]{3,40})/i;

  const eff = effectiveRx.exec(text);
  const exp = expiryRx.exec(text);
  const dur = durationRx.exec(text);

  return {
    effective: eff ? eff[1].trim() : (dates[0] || "Not specified"),
    expiry: exp ? exp[1].trim() : (dates[1] || "Not specified"),
    duration: dur ? dur[1].trim() : "Not specified",
  };
}

function extractObligations(text: string): string[] {
  const obligations: string[] = [];
  const sentenceRx = /[^.!?\n]{20,200}[.!?]/g;
  const sentences = text.match(sentenceRx) || [];
  const triggers = /\b(?:shall|must|will|agrees? to|is required to|responsible for|obligated to|undertakes to|committed to)\b/i;
  for (const s of sentences) {
    if (triggers.test(s) && obligations.length < 8) {
      obligations.push(s.trim().replace(/\s+/g, " ").slice(0, 150));
    }
  }
  return obligations;
}

function extractPaymentTerms(text: string): string[] {
  const terms: string[] = [];
  const payRx = /[^.!?\n]*(?:payment|fee|compensation|salary|invoice|amount|charge|cost|price|pay)[^.!?\n]*[.]/gi;
  const matches = text.match(payRx) || [];
  for (const m of matches.slice(0, 5)) {
    const t = m.trim().replace(/\s+/g, " ").slice(0, 150);
    if (t.length > 15) terms.push(t);
  }
  return terms;
}

function detectContractType(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("non-disclosure") || t.includes("nda") || t.includes("confidential")) return "Non-Disclosure Agreement (NDA)";
  if (t.includes("employment") || t.includes("employee") || t.includes("employer")) return "Employment Agreement";
  if (t.includes("service agreement") || t.includes("services agreement") || t.includes("consulting")) return "Service Agreement";
  if (t.includes("lease") || t.includes("landlord") || t.includes("tenant")) return "Lease / Rental Agreement";
  if (t.includes("software") || t.includes("license") || t.includes("saas")) return "Software License Agreement";
  if (t.includes("purchase") || t.includes("sale of goods") || t.includes("vendor")) return "Purchase / Vendor Agreement";
  if (t.includes("partnership") || t.includes("joint venture")) return "Partnership Agreement";
  if (t.includes("freelance") || t.includes("independent contractor")) return "Freelance / Contractor Agreement";
  return "General Contract";
}

function extractRisks(text: string): string[] {
  const risks: string[] = [];
  const t = text.toLowerCase();
  if (t.includes("unlimited liability") || t.includes("no limitation of liability")) risks.push("Unlimited liability clause — no cap on damages.");
  if (t.includes("indemnif")) risks.push("Indemnification clause present — review scope carefully.");
  if (t.includes("non-compete") || t.includes("non compete")) risks.push("Non-compete clause restricts future work with competitors.");
  if (t.includes("auto-renew") || t.includes("automatically renew")) risks.push("Auto-renewal clause — contract renews unless cancelled by a specific date.");
  if (t.includes("perpetual") && t.includes("license")) risks.push("Perpetual license granted — check if revocable.");
  if (t.includes("liquidated damages")) risks.push("Liquidated damages clause — fixed penalties for breach.");
  if (t.includes("all disputes") && t.includes("arbitration")) risks.push("Mandatory arbitration — waives right to jury trial.");
  if (t.includes("waive") || t.includes("waiver")) risks.push("Waiver clauses present — some rights may be forfeited.");
  if (!t.includes("termination") && !t.includes("terminate")) risks.push("No explicit termination clause found — contract may have no exit path.");
  return risks;
}

function summarizeContract(text: string): ContractSummary {
  const parties = extractParties(text);
  const dates = extractDates(text);
  const obligations = extractObligations(text);
  const paymentTerms = extractPaymentTerms(text);
  const type = detectContractType(text);
  const riskFlags = extractRisks(text);

  const confRx = /[^.!?\n]*(?:confidential|non-disclosure|proprietary)[^.!?\n]*[.]/i;
  const confMatch = confRx.exec(text);

  const termRx = /[^.!?\n]*(?:terminat|end\s+of\s+(?:contract|agreement))[^.!?\n]*[.]/i;
  const termMatch = termRx.exec(text);

  const lawRx = /governed by(?:\s+the\s+laws?\s+of)?\s+([^.;\n,]{3,60})/i;
  const lawMatch = lawRx.exec(text);

  const wordCount = text.split(/\s+/).length;
  const pageEst = Math.round(wordCount / 250);

  const summary = `This appears to be a ${type}. The document is approximately ${wordCount.toLocaleString()} words (≈${pageEst} pages). ${
    parties.length > 0 ? `Key parties identified: ${parties.slice(0, 2).join(", ")}.` : ""
  } ${
    dates.effective !== "Not specified" ? `Effective from ${dates.effective}.` : ""
  } ${
    riskFlags.length > 0 ? `${riskFlags.length} potential risk area${riskFlags.length > 1 ? "s" : ""} detected.` : "No major risk flags detected."
  }`;

  return {
    type,
    parties,
    effectiveDate: dates.effective,
    expiryDate: dates.expiry,
    duration: dates.duration,
    keyObligations: obligations.slice(0, 6),
    paymentTerms: paymentTerms.slice(0, 4),
    confidentiality: confMatch ? confMatch[0].trim().slice(0, 180) : "No specific confidentiality clause detected.",
    termination: termMatch ? termMatch[0].trim().slice(0, 180) : "No specific termination clause detected.",
    governingLaw: lawMatch ? lawMatch[1].trim() : "Not specified",
    riskFlags,
    summary,
  };
}

export function AiContractSummarizerTool() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ContractSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = () => {
    if (text.trim().split(/\s+/).length < 30) {
      toast.error("Please paste more contract text (minimum 30 words)");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResult(summarizeContract(text));
      setLoading(false);
    }, 600);
  };

  const copyReport = () => {
    if (!result) return;
    const lines = [
      `CONTRACT SUMMARY REPORT`,
      `=======================`,
      `Type: ${result.type}`,
      `Parties: ${result.parties.join(", ") || "Not identified"}`,
      `Effective Date: ${result.effectiveDate}`,
      `Expiry / End Date: ${result.expiryDate}`,
      `Duration: ${result.duration}`,
      `Governing Law: ${result.governingLaw}`,
      ``,
      `SUMMARY`,
      result.summary,
      ``,
      `KEY OBLIGATIONS`,
      ...result.keyObligations.map((o, i) => `${i + 1}. ${o}`),
      ``,
      `PAYMENT TERMS`,
      ...result.paymentTerms.map((p, i) => `${i + 1}. ${p}`),
      ``,
      `CONFIDENTIALITY`,
      result.confidentiality,
      ``,
      `TERMINATION`,
      result.termination,
      ``,
      `RISK FLAGS`,
      ...result.riskFlags.map((r, i) => `⚠ ${i + 1}. ${r}`),
    ].join("\n");
    navigator.clipboard.writeText(lines);
    toast.success("Report copied!");
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</div>
      {children}
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">AI Contract Summarizer</span>
        <span className="ml-auto text-[10px] text-muted-foreground">NDA · Agreement · Contract</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400">
          Paste your contract text below. This tool extracts key information using pattern analysis — always consult a lawyer for legal advice.
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Contract / NDA / Agreement Text</label>
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste the full contract text here…"
            className="min-h-[200px] resize-none text-sm font-mono"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">{text.split(/\s+/).filter(Boolean).length} words</span>
            <Button onClick={analyze} disabled={!text.trim() || loading} className="gap-2">
              {loading ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Analyze Contract
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="rounded-full px-3 py-1 bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                {result.type}
              </div>
              <Button size="sm" variant="ghost" onClick={copyReport} className="h-7 text-xs gap-1">
                <Copy className="w-3 h-3" /> Copy Report
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Summary</div>
              <p className="text-sm">{result.summary}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {[
                { label: "Parties",        value: result.parties.join(", ") || "Not identified" },
                { label: "Effective Date", value: result.effectiveDate },
                { label: "Expiry Date",    value: result.expiryDate },
                { label: "Duration",       value: result.duration },
                { label: "Governing Law",  value: result.governingLaw },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-border p-3">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{item.label}</div>
                  <div className="text-xs font-medium line-clamp-2">{item.value}</div>
                </div>
              ))}
            </div>

            {result.riskFlags.length > 0 && (
              <Section title="⚠ Risk Flags">
                <ul className="space-y-1.5">
                  {result.riskFlags.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {result.keyObligations.length > 0 && (
              <Section title="Key Obligations">
                <ul className="space-y-2">
                  {result.keyObligations.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5 text-primary/60" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {result.paymentTerms.length > 0 && (
              <Section title="Payment Terms">
                <ul className="space-y-1.5">
                  {result.paymentTerms.map((p, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {p}</li>
                  ))}
                </ul>
              </Section>
            )}

            <Section title="Confidentiality">
              <p className="text-xs text-muted-foreground">{result.confidentiality}</p>
            </Section>

            <Section title="Termination">
              <p className="text-xs text-muted-foreground">{result.termination}</p>
            </Section>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/50 text-xs text-muted-foreground">
              This summary is AI-assisted pattern analysis. It is not a substitute for professional legal review. Always consult a qualified lawyer before signing any contract.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
