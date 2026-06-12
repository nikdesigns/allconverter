"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Receipt, Eye, EyeOff, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Credit Card", "Debit Card", "Cheque", "UPI", "Online", "Other"];
const CURRENCIES = [
  { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" }, { code: "INR", symbol: "₹" },
  { code: "CAD", symbol: "CA$" }, { code: "AUD", symbol: "A$" },
];

function fmtCurr(n: number, code: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code, minimumFractionDigits: 2 }).format(n);
}

let receiptCounter = 1;

export function ReceiptGeneratorTool() {
  const [from, setFrom] = useState({ name: "Your Business", address: "123 Main St, City", email: "", phone: "" });
  const [meta, setMeta] = useState({
    number: `RCT-${String(receiptCounter++).padStart(3,"0")}`,
    date: new Date().toISOString().slice(0, 10),
    currency: "USD",
    paymentMethod: "Cash",
  });
  const [receivedFrom, setReceivedFrom] = useState("");
  const [amount, setAmount] = useState("");
  const [forPurpose, setForPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [themeAccent, setThemeAccent] = useState("#059669");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setFrom_ = (k: string, v: string) => setFrom(p => ({ ...p, [k]: v }));
  const setMeta_ = (k: string, v: string) => setMeta(p => ({ ...p, [k]: v }));

  const fmt = (n: number) => fmtCurr(n, meta.currency);
  const amtNum = parseFloat(amount) || 0;

  const amountInWords = (n: number): string => {
    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    if (n === 0) return "Zero";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
    if (n < 1000) return ones[Math.floor(n/100)] + " Hundred" + (n%100 ? " " + amountInWords(n%100) : "");
    if (n < 100000) return amountInWords(Math.floor(n/1000)) + " Thousand" + (n%1000 ? " " + amountInWords(n%1000) : "");
    if (n < 10000000) return amountInWords(Math.floor(n/100000)) + " Lakh" + (n%100000 ? " " + amountInWords(n%100000) : "");
    return amountInWords(Math.floor(n/10000000)) + " Crore" + (n%10000000 ? " " + amountInWords(n%10000000) : "");
  };

  const buildHTML = () => `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Receipt ${meta.number}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:500px;margin:32px auto;background:#fff;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.1);overflow:hidden}
.header{background:${themeAccent};padding:24px 28px;color:#fff}
.header-top{display:flex;justify-content:space-between;align-items:flex-start}
.org{font-size:18px;font-weight:800}
.org-sub{font-size:11px;opacity:.8;margin-top:3px}
.receipt-label{text-align:right}
.receipt-title{font-size:20px;font-weight:900;letter-spacing:.05em}
.receipt-num{font-size:11px;font-family:monospace;opacity:.8;margin-top:2px}
.body{padding:24px 28px}
.row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;gap:12px}
.row-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:#a1a1aa;font-weight:600;margin-bottom:2px}
.row-val{font-size:13px;font-weight:600;color:#18181b}
.amount-box{background:${themeAccent}10;border:2px solid ${themeAccent}30;border-radius:10px;padding:16px 20px;margin:16px 0;text-align:center}
.amt-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:${themeAccent};font-weight:700;margin-bottom:6px}
.amt-val{font-size:32px;font-weight:900;color:${themeAccent}}
.amt-words{font-size:11px;color:#52525b;margin-top:6px;font-style:italic}
.method-badge{display:inline-block;padding:3px 10px;background:${themeAccent}18;color:${themeAccent};border-radius:100px;font-size:11px;font-weight:700;margin-top:4px}
.divider{height:1px;background:#e4e4e7;margin:16px 0}
.notes{font-size:12px;color:#52525b;line-height:1.65}
.sig-area{margin-top:24px;display:flex;justify-content:space-between}
.sig-box{text-align:center;flex:1}
.sig-line{border-top:1px solid #d4d4d8;padding-top:6px;font-size:10px;color:#a1a1aa;margin-top:32px}
.footer{padding:12px 28px;border-top:1px solid #e4e4e7;display:flex;justify-content:space-between}
.footer-t{font-size:10px;color:#a1a1aa}
@media print{body{background:#fff}.page{box-shadow:none;margin:0;border-radius:0;max-width:100%}}
</style></head><body>
<div class="page">
  <div class="header">
    <div class="header-top">
      <div><div class="org">${from.name}</div><div class="org-sub">${from.address}</div>${from.email?`<div class="org-sub">${from.email}</div>`:""}</div>
      <div class="receipt-label"><div class="receipt-title">RECEIPT</div><div class="receipt-num">#${meta.number}</div></div>
    </div>
  </div>
  <div class="body">
    <div class="row">
      <div><div class="row-lbl">Date</div><div class="row-val">${meta.date}</div></div>
      <div style="text-align:right"><div class="row-lbl">Payment Method</div><div class="method-badge">${meta.paymentMethod}</div></div>
    </div>
    ${receivedFrom?`<div><div class="row-lbl">Received From</div><div class="row-val">${receivedFrom}</div></div><div class="divider"></div>`:""}
    ${forPurpose?`<div style="margin:12px 0"><div class="row-lbl">For</div><div class="row-val">${forPurpose}</div></div><div class="divider"></div>`:""}
    <div class="amount-box">
      <div class="amt-lbl">Amount Received</div>
      <div class="amt-val">${fmt(amtNum)}</div>
      ${amtNum>0?`<div class="amt-words">${amountInWords(Math.floor(amtNum))} ${meta.currency} Only</div>`:""}
    </div>
    ${notes?`<div style="margin-bottom:12px"><div class="row-lbl">Notes</div><div class="notes">${notes}</div></div><div class="divider"></div>`:""}
    <div class="sig-area">
      <div class="sig-box"><div class="sig-line">Receiver's Signature</div></div>
      <div style="width:32px"></div>
      <div class="sig-box"><div class="sig-line">Authorized Signature</div></div>
    </div>
  </div>
  <div class="footer"><span class="footer-t">Generated with AllConverter.tools</span><span class="footer-t">Receipt #${meta.number}</span></div>
</div></body></html>`;

  useEffect(() => {
    if (!showPreview) return;
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.open(); doc.write(buildHTML()); doc.close();
    }, 150);
    return () => { if (previewTimer.current) clearTimeout(previewTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview, from, meta, receivedFrom, amount, forPurpose, notes, themeAccent]);

  const print = () => { const w = window.open("","_blank")!; w.document.write(buildHTML()); w.document.close(); setTimeout(() => w.print(), 300); };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`Receipt #${meta.number} | ${from.name} | ${fmt(amtNum)} | ${meta.date}`);
    setCopied(true);
    toast.success("Receipt summary copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2"><Receipt className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Receipt Generator</span></div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={copyLink} className="h-7 text-xs gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}Copy
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowPreview(v => !v)} className="h-7 text-xs gap-1.5">
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}{showPreview ? "Hide" : "Preview"}
          </Button>
          <Button size="sm" onClick={print} className="h-7 text-xs gap-1.5"><Download className="w-3.5 h-3.5" />Print / PDF</Button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Color */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Color</label>
          {["#059669","#3b82f6","#6366f1","#0d9488","#f97316","#e11d48"].map(c => (
            <button key={c} onClick={() => setThemeAccent(c)} className={cn("w-6 h-6 rounded-full border-2 transition-all hover:scale-110", themeAccent===c?"border-foreground scale-110":"border-transparent")} style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Issuer */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Issued By</p>
          <div className="grid grid-cols-2 gap-2">
            <Input value={from.name} onChange={e => setFrom_("name",e.target.value)} placeholder="Business / Person name" className="text-sm" />
            <Input value={from.address} onChange={e => setFrom_("address",e.target.value)} placeholder="Address" className="text-sm" />
            <Input value={from.email} onChange={e => setFrom_("email",e.target.value)} placeholder="Email (optional)" className="text-sm" />
            <Input value={from.phone} onChange={e => setFrom_("phone",e.target.value)} placeholder="Phone (optional)" className="text-sm" />
          </div>
        </div>

        {/* Receipt details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Receipt #</label><Input value={meta.number} onChange={e => setMeta_("number",e.target.value)} className="text-sm font-mono" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Date</label><Input type="date" value={meta.date} onChange={e => setMeta_("date",e.target.value)} className="text-sm" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Currency</label>
            <select value={meta.currency} onChange={e => setMeta_("currency",e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Payment Method</label>
            <select value={meta.paymentMethod} onChange={e => setMeta_("paymentMethod",e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Received From</label><Input value={receivedFrom} onChange={e => setReceivedFrom(e.target.value)} placeholder="Payer name / company" className="text-sm" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Amount</label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="text-sm font-mono" min="0" /></div>
        </div>

        <div><label className="text-xs text-muted-foreground mb-1 block">For (Purpose)</label><Input value={forPurpose} onChange={e => setForPurpose(e.target.value)} placeholder="e.g. Consulting services for January 2026" className="text-sm" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Notes (optional)</label><Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-sm resize-none min-h-[60px]" placeholder="Additional notes…" /></div>

        {/* Amount preview */}
        {amtNum > 0 && (
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed" style={{ borderColor: themeAccent + "40", background: themeAccent + "08" }}>
            <div><p className="text-xs text-muted-foreground">Amount in Words</p><p className="text-sm font-medium mt-0.5">{amountInWords(Math.floor(amtNum))} only</p></div>
            <p className="text-2xl font-black font-mono" style={{ color: themeAccent }}>{fmtCurr(amtNum, meta.currency)}</p>
          </div>
        )}

        {showPreview && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Live Preview</p>
            <div className="rounded-xl border border-border overflow-hidden" style={{ height: 500 }}>
              <iframe ref={iframeRef} className="w-full h-full" title="Receipt Preview" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
