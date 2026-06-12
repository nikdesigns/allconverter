"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, FileText, Eye, EyeOff, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NDA_TYPE_LABELS: Record<string, string> = {
  unilateral: "One-way (Unilateral) NDA — only one party discloses.",
  mutual:     "Two-way (Mutual) NDA — both parties disclose confidential information.",
  employee:   "Employee NDA — protects employer's confidential information.",
};

export function NdaGeneratorTool() {
  const [ndaType, setNdaType] = useState<"unilateral"|"mutual"|"employee">("unilateral");
  const [disclosing, setDisclosing] = useState({ name: "", address: "", state: "" });
  const [receiving, setReceiving]   = useState({ name: "", address: "", state: "" });
  const [effective, setEffective]   = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration]     = useState("2");
  const [jurisdiction, setJurisdiction] = useState("Delaware, United States");
  const [purpose, setPurpose]       = useState("");
  const [exceptions, setExceptions] = useState("publicly known information, information independently developed without use of confidential information");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setD = (k: string, v: string) => setDisclosing(p => ({ ...p, [k]: v }));
  const setR = (k: string, v: string) => setReceiving(p => ({ ...p, [k]: v }));

  const buildText = () => {
    const dName = disclosing.name || "[DISCLOSING PARTY]";
    const rName = receiving.name  || "[RECEIVING PARTY]";
    const dAddr = disclosing.address || "[ADDRESS]";
    const rAddr = receiving.address  || "[ADDRESS]";
    const effectiveFormatted = effective ? new Date(effective + "T00:00:00").toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric"}) : "[DATE]";
    const expiry = effective && duration ? new Date(new Date(effective + "T00:00:00").setFullYear(new Date(effective + "T00:00:00").getFullYear() + parseInt(duration))).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric"}) : "[EXPIRY DATE]";

    return `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of ${effectiveFormatted} by and between:

Disclosing Party:  ${dName}
                   ${dAddr}

Receiving Party:   ${rName}
                   ${rAddr}

${ndaType === "mutual" ? `Both parties may disclose and receive Confidential Information (as defined herein) in connection with the Purpose described below.` : ndaType === "employee" ? `In connection with ${rName}'s employment with ${dName}.` : ""}

1. PURPOSE
${purpose || "The parties wish to explore a potential business relationship and, in connection therewith, may disclose Confidential Information to each other."}

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public, proprietary, or sensitive information disclosed by the Disclosing Party to the Receiving Party, including but not limited to: business plans, financial data, technical information, trade secrets, customer data, software, designs, processes, and any other information designated as confidential.

Confidential Information does NOT include information that:
(a) is or becomes publicly known through no fault of the Receiving Party;
(b) was known to the Receiving Party prior to disclosure without restriction;
(c) is independently developed by the Receiving Party without use of Confidential Information;
(d) is lawfully received from a third party without restriction; or
(e) is required to be disclosed by law or court order, provided prompt written notice is given.

3. OBLIGATIONS
The Receiving Party agrees to:
(a) hold all Confidential Information in strict confidence;
(b) not disclose Confidential Information to any third party without prior written consent;
(c) use Confidential Information solely for the Purpose stated herein;
(d) protect Confidential Information with at least the same care used for its own confidential information, but no less than reasonable care;
(e) notify the Disclosing Party immediately upon discovery of any unauthorized disclosure or use.

4. TERM
This Agreement shall commence on ${effectiveFormatted} and continue for ${duration} year${parseInt(duration)!==1?"s":""}, expiring on ${expiry}, unless terminated earlier in writing by either party. Obligations of confidentiality shall survive termination for a period of ${duration} year${parseInt(duration)!==1?"s":""} thereafter.

5. RETURN OF INFORMATION
Upon request or termination of this Agreement, the Receiving Party shall promptly return or destroy all Confidential Information and certify such destruction in writing.

6. REMEDIES
The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party for which monetary damages may be inadequate. The Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law or equity.

7. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of ${jurisdiction}, without regard to conflict of law provisions.

8. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, understandings, and agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

${dName}                              ${rName}

Signature: ______________________     Signature: ______________________

Name: ___________________________     Name: ___________________________

Title: __________________________     Title: __________________________

Date: ___________________________     Date: ___________________________`;
  };

  const buildHTML = () => {
    const text = buildText();
    const lines = text.split("\n").map(l => {
      if (!l.trim()) return "<br>";
      if (l === "NON-DISCLOSURE AGREEMENT") return `<h1 style="font-size:20px;font-weight:900;text-align:center;color:#1e293b;margin-bottom:12px;letter-spacing:.02em">${l}</h1>`;
      if (/^\d+\./.test(l)) return `<p style="font-size:12px;font-weight:700;margin:12px 0 4px;color:#0f172a">${l}</p>`;
      if (l.startsWith("(")) return `<p style="font-size:11.5px;color:#334155;padding-left:16px;line-height:1.7">${l}</p>`;
      return `<p style="font-size:11.5px;color:#334155;line-height:1.7">${l}</p>`;
    }).join("\n");
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>NDA</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;-webkit-print-color-adjust:exact}
.page{max-width:750px;margin:28px auto;background:#fff;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.1);padding:48px 52px}
@media print{body{background:#fff}.page{box-shadow:none;margin:0;border-radius:0;padding:32px}}
</style></head><body><div class="page">${lines}</div></body></html>`;
  };

  useEffect(() => {
    if (!showPreview) return;
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.open(); doc.write(buildHTML()); doc.close();
    }, 200);
    return () => { if (previewTimer.current) clearTimeout(previewTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview, ndaType, disclosing, receiving, effective, duration, jurisdiction, purpose, exceptions]);

  const print = () => { const w = window.open("","_blank")!; w.document.write(buildHTML()); w.document.close(); setTimeout(() => w.print(), 300); };

  const copyText = async () => {
    await navigator.clipboard.writeText(buildText());
    setCopied(true);
    toast.success("NDA text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /><span className="text-sm font-medium">NDA Generator</span></div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={copyText} className="h-7 text-xs gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}Copy Text
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowPreview(v => !v)} className="h-7 text-xs gap-1.5">
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}{showPreview?"Hide":"Preview"}
          </Button>
          <Button size="sm" onClick={print} className="h-7 text-xs gap-1.5"><Download className="w-3.5 h-3.5" />Print / PDF</Button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
          This is a template for informational purposes only. Consult a qualified attorney before signing any legal agreement.
        </div>

        {/* NDA type */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Agreement Type</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(["unilateral","mutual","employee"] as const).map(t => (
              <button key={t} onClick={() => setNdaType(t)}
                className={cn("p-3 rounded-xl border text-left transition-all", ndaType===t?"border-primary bg-primary/8":"border-border hover:border-primary/30")}>
                <p className={cn("text-xs font-semibold capitalize", ndaType===t?"text-primary":"text-foreground")}>{t}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{NDA_TYPE_LABELS[t]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Disclosing Party</p>
            <Input value={disclosing.name} onChange={e => setD("name",e.target.value)} placeholder="Full legal name" className="text-sm" />
            <Textarea value={disclosing.address} onChange={e => setD("address",e.target.value)} placeholder="Address" className="text-sm resize-none min-h-[60px]" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Receiving Party</p>
            <Input value={receiving.name} onChange={e => setR("name",e.target.value)} placeholder="Full legal name" className="text-sm" />
            <Textarea value={receiving.address} onChange={e => setR("address",e.target.value)} placeholder="Address" className="text-sm resize-none min-h-[60px]" />
          </div>
        </div>

        {/* Terms */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Effective Date</label><Input type="date" value={effective} onChange={e => setEffective(e.target.value)} className="text-sm" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Duration (years)</label>
            <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              {["1","2","3","5","10"].map(y => <option key={y} value={y}>{y} year{y!=="1"?"s":""}</option>)}
            </select>
          </div>
          <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Governing Jurisdiction</label><Input value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} placeholder="e.g. California, USA" className="text-sm" /></div>
        </div>

        <div><label className="text-xs text-muted-foreground mb-1 block">Purpose of Disclosure</label><Textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Describe why confidential information will be shared (e.g. evaluating a potential business partnership)…" className="text-sm resize-none min-h-[72px]" /></div>

        {showPreview && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Live Preview</p>
            <div className="rounded-xl border border-border overflow-hidden" style={{ height: 580 }}>
              <iframe ref={iframeRef} className="w-full h-full" title="NDA Preview" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
