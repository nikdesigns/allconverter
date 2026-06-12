"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Plus, Trash2, FileText, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface LineItem { id: number; description: string; qty: string; rate: string; }
let nextId = 2;

const CURRENCIES = [
  { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" }, { code: "INR", symbol: "₹" },
  { code: "CAD", symbol: "CA$" }, { code: "AUD", symbol: "A$" },
];

function fmtCurr(n: number, code: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code, minimumFractionDigits: 2 }).format(n);
}

export function QuotationGeneratorTool() {
  const pathname = usePathname();
  const isProposal = pathname?.includes("proposal");
  const docType = isProposal ? "PROPOSAL" : "QUOTATION";

  const [from, setFrom] = useState({ name: "Your Company", address: "123 Business Ave\nCity, State 12345", email: "hello@company.com", phone: "", website: "" });
  const [to,   setTo  ] = useState({ name: "Client Name",  address: "456 Client St\nCity, State 67890",   email: "client@company.com" });
  const [meta, setMeta] = useState({ number: isProposal ? "PROP-001" : "QT-001", date: new Date().toISOString().slice(0,10), validUntil: "", currency: "USD", subject: "" });
  const [items, setItems] = useState<LineItem[]>([{ id: 1, description: "Services / Products", qty: "1", rate: "1000" }]);
  const [taxRate, setTaxRate] = useState("0");
  const [terms, setTerms] = useState(isProposal ? "This proposal is valid for 30 days from the issue date. Prices are subject to change after the validity period." : "This quotation is valid for 30 days. Prices exclude applicable taxes unless stated.");
  const [notes, setNotes] = useState("");
  const [themeAccent, setThemeAccent] = useState("#3b82f6");
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setFrom_ = (k: string, v: string) => setFrom(p => ({ ...p, [k]: v }));
  const setTo_   = (k: string, v: string) => setTo(p => ({ ...p, [k]: v }));
  const setMeta_ = (k: string, v: string) => setMeta(p => ({ ...p, [k]: v }));
  const updateItem = (id: number, k: keyof LineItem, v: string) => setItems(p => p.map(i => i.id===id?{...i,[k]:v}:i));
  const addItem = () => setItems(p => [...p, { id: nextId++, description: "", qty: "1", rate: "0" }]);
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));

  const fmt = (n: number) => fmtCurr(n, meta.currency);
  const subtotal = items.reduce((s, i) => s + (parseFloat(i.qty)||0)*(parseFloat(i.rate)||0), 0);
  const taxAmt   = subtotal * (parseFloat(taxRate)||0) / 100;
  const total    = subtotal + taxAmt;

  const buildHTML = () => `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${docType} ${meta.number}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;color:#18181b;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:794px;margin:28px auto;background:#fff;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.1);overflow:hidden}
.accent-bar{background:${themeAccent};height:5px}
.body{padding:44px}
.header{display:flex;justify-content:space-between;gap:20px;margin-bottom:32px}
.brand-name{font-size:20px;font-weight:800;color:${themeAccent}}
.brand-sub{font-size:11px;color:#71717a;margin-top:3px}
.doc-right{text-align:right}
.doc-title{font-size:28px;font-weight:900;color:${themeAccent}}
.doc-num{font-size:12px;font-family:monospace;color:#a1a1aa;margin-top:4px}
.subject{margin-top:6px;font-size:13px;color:#3f3f46;font-style:italic}
.dates{display:flex;gap:16px;margin-top:8px;justify-content:flex-end}
.di{text-align:right}
.dl{font-size:9px;text-transform:uppercase;letter-spacing:.05em;color:#a1a1aa}
.dv{font-size:12px;font-weight:600}
.divider{height:1px;background:#e4e4e7;margin:0 0 24px}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
.pl{font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:#a1a1aa;font-weight:600;margin-bottom:6px}
.pn{font-size:15px;font-weight:700}
.pa{font-size:12px;color:#52525b;white-space:pre-line;line-height:1.6;margin-top:2px}
.pc{font-size:11px;color:${themeAccent};margin-top:2px}
table{width:100%;border-collapse:collapse;margin-bottom:20px}
thead th{padding:8px 12px;background:${themeAccent}16;border-bottom:2px solid ${themeAccent}40;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:${themeAccent};font-weight:700}
tbody td{padding:11px 12px;border-bottom:1px solid #f4f4f5;font-size:13px;color:#27272a}
.totals-wrap{display:flex;justify-content:flex-end}
.totals{width:280px;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden}
.trow{display:flex;justify-content:space-between;padding:8px 14px;font-size:13px;background:#fafafa;border-bottom:1px solid #e4e4e7}
.trow.grand{background:${themeAccent};color:#fff;padding:12px 14px}
.trow.grand .lbl{font-size:12px;font-weight:700;opacity:.9}
.trow.grand .amt{font-size:18px;font-weight:900}
.terms-section{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.sec-lbl{font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:${themeAccent};font-weight:700;margin-bottom:6px}
.sec-text{font-size:12px;color:#52525b;line-height:1.7;white-space:pre-line}
.footer{margin-top:28px;padding-top:14px;border-top:1px solid #e4e4e7;display:flex;justify-content:space-between}
.footer-t{font-size:10px;color:#a1a1aa}
.sig-line{margin-top:32px;padding-top:8px;border-top:1px solid #e4e4e7;font-size:11px;color:#a1a1aa}
@media print{body{background:#fff}.page{box-shadow:none;margin:0;border-radius:0}}
</style></head><body>
<div class="page">
<div class="accent-bar"></div>
<div class="body">
  <div class="header">
    <div>
      <div class="brand-name">${from.name}</div>
      <div class="brand-sub">${from.address.replace(/\n/g,", ")}</div>
      ${from.email?`<div class="brand-sub">${from.email}</div>`:""}
      ${from.phone?`<div class="brand-sub">${from.phone}</div>`:""}
      ${from.website?`<div class="brand-sub">${from.website}</div>`:""}
    </div>
    <div class="doc-right">
      <div class="doc-title">${docType}</div>
      <div class="doc-num">#${meta.number}</div>
      ${meta.subject?`<div class="subject">${meta.subject}</div>`:""}
      <div class="dates">
        <div class="di"><div class="dl">Date</div><div class="dv">${meta.date}</div></div>
        ${meta.validUntil?`<div class="di"><div class="dl">Valid Until</div><div class="dv">${meta.validUntil}</div></div>`:""}
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="parties">
    <div><div class="pl">Prepared By</div><div class="pn">${from.name}</div><div class="pa">${from.address}</div>${from.email?`<div class="pc">${from.email}</div>`:""}</div>
    <div><div class="pl">Prepared For</div><div class="pn">${to.name}</div><div class="pa">${to.address}</div>${to.email?`<div class="pc">${to.email}</div>`:""}</div>
  </div>
  <table>
    <thead><tr>
      <th style="text-align:left;width:50%">Description</th>
      <th style="text-align:center">Qty</th>
      <th style="text-align:right">Unit Price</th>
      <th style="text-align:right">Amount</th>
    </tr></thead>
    <tbody>${items.map(i => {
      const amt = (parseFloat(i.qty)||0)*(parseFloat(i.rate)||0);
      return `<tr><td>${i.description||"<em style='color:#a1a1aa'>No description</em>"}</td><td style="text-align:center;color:#71717a">${i.qty}</td><td style="text-align:right">${fmt(parseFloat(i.rate)||0)}</td><td style="text-align:right;font-weight:600">${fmt(amt)}</td></tr>`;
    }).join("")}</tbody>
  </table>
  <div class="totals-wrap"><div class="totals">
    <div class="trow"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
    ${parseFloat(taxRate)>0?`<div class="trow"><span>Tax (${taxRate}%)</span><span>${fmt(taxAmt)}</span></div>`:""}
    <div class="trow grand"><span class="lbl">Total</span><span class="amt">${fmt(total)}</span></div>
  </div></div>
  <div class="terms-section">
    ${terms?`<div><div class="sec-lbl">Terms & Conditions</div><div class="sec-text">${terms}</div></div>`:""}
    ${notes?`<div><div class="sec-lbl">Notes</div><div class="sec-text">${notes}</div></div>`:""}
  </div>
  <div class="sig-line">Authorized Signature: ___________________________  &nbsp;&nbsp;&nbsp; Date: _______________</div>
  <div class="footer"><span class="footer-t">Generated with AllConverter.tools</span><span class="footer-t">${docType} #${meta.number}</span></div>
</div></div></body></html>`;

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
  }, [showPreview, from, to, meta, items, taxRate, terms, notes, themeAccent]);

  const print = () => { const w = window.open("","_blank")!; w.document.write(buildHTML()); w.document.close(); setTimeout(() => w.print(), 300); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /><span className="text-sm font-medium">{isProposal ? "Proposal" : "Quotation"} Generator</span></div>
        <div className="flex items-center gap-2">
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
          {["#3b82f6","#6366f1","#0d9488","#059669","#f97316","#e11d48"].map(c => (
            <button key={c} onClick={() => setThemeAccent(c)} className={cn("w-6 h-6 rounded-full border-2 transition-all hover:scale-110", themeAccent===c?"border-foreground scale-110":"border-transparent")} style={{ backgroundColor: c }} />
          ))}
          <input type="color" value={themeAccent} onChange={e => setThemeAccent(e.target.value)} className="w-6 h-6 rounded-full border border-border cursor-pointer p-0 bg-transparent" />
        </div>

        {/* From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Details</p>
            <Input value={from.name} onChange={e => setFrom_("name",e.target.value)} placeholder="Company name" className="text-sm" />
            <Textarea value={from.address} onChange={e => setFrom_("address",e.target.value)} className="text-sm resize-none min-h-[60px]" placeholder="Address" />
            <Input value={from.email} onChange={e => setFrom_("email",e.target.value)} placeholder="Email" className="text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={from.phone} onChange={e => setFrom_("phone",e.target.value)} placeholder="Phone" className="text-sm" />
              <Input value={from.website} onChange={e => setFrom_("website",e.target.value)} placeholder="Website" className="text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client Details</p>
            <Input value={to.name} onChange={e => setTo_("name",e.target.value)} placeholder="Client name" className="text-sm" />
            <Textarea value={to.address} onChange={e => setTo_("address",e.target.value)} className="text-sm resize-none min-h-[60px]" placeholder="Address" />
            <Input value={to.email} onChange={e => setTo_("email",e.target.value)} placeholder="Email" className="text-sm" />
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">{isProposal?"Proposal #":"Quote #"}</label><Input value={meta.number} onChange={e => setMeta_("number",e.target.value)} className="text-sm font-mono" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Currency</label>
            <select value={meta.currency} onChange={e => setMeta_("currency",e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Date</label><Input type="date" value={meta.date} onChange={e => setMeta_("date",e.target.value)} className="text-sm" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Valid Until</label><Input type="date" value={meta.validUntil} onChange={e => setMeta_("validUntil",e.target.value)} className="text-sm" /></div>
        </div>
        <Input value={meta.subject} onChange={e => setMeta_("subject",e.target.value)} placeholder={`${isProposal?"Proposal":"Quote"} subject / project title (optional)`} className="text-sm" />

        {/* Line items */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Items / Services</p>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_60px_96px_88px_28px] gap-2 px-1">
              {["Description","Qty","Rate","Amount",""].map((h,i) => <p key={i} className="text-[11px] text-muted-foreground">{h}</p>)}
            </div>
            {items.map(item => {
              const amt = (parseFloat(item.qty)||0)*(parseFloat(item.rate)||0);
              return (
                <div key={item.id} className="grid grid-cols-[1fr_60px_96px_88px_28px] gap-2 items-center">
                  <Input value={item.description} onChange={e => updateItem(item.id,"description",e.target.value)} placeholder="Description" className="text-sm" />
                  <Input type="number" value={item.qty} onChange={e => updateItem(item.id,"qty",e.target.value)} className="text-sm text-center font-mono" min="0" />
                  <Input type="number" value={item.rate} onChange={e => updateItem(item.id,"rate",e.target.value)} className="text-sm font-mono" min="0" />
                  <span className="text-sm font-mono text-right text-muted-foreground tabular-nums">{fmt(amt)}</span>
                  <button onClick={() => removeItem(item.id)} disabled={items.length===1} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-25"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              );
            })}
          </div>
          <Button variant="outline" size="sm" onClick={addItem} className="mt-2 w-full gap-2 h-8 text-xs"><Plus className="w-3.5 h-3.5" />Add Item</Button>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 p-4 rounded-xl border border-border bg-muted/10">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{fmt(subtotal)}</span></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground shrink-0">Tax</span>
              <Input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} min="0" max="100" className="w-16 h-7 text-xs text-center font-mono" />
              <span className="text-sm text-muted-foreground">%</span>
              <span className="font-mono text-sm ml-auto">{fmt(taxAmt)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border font-bold"><span>Total</span><span className="font-mono">{fmt(total)}</span></div>
          </div>
        </div>

        {/* Terms / Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Terms & Conditions</label><Textarea value={terms} onChange={e => setTerms(e.target.value)} className="text-sm resize-none min-h-[80px]" placeholder="Terms…" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Notes</label><Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-sm resize-none min-h-[80px]" placeholder="Additional notes…" /></div>
        </div>

        {showPreview && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Live Preview</p>
            <div className="rounded-xl border border-border overflow-hidden" style={{ height: 540 }}>
              <iframe ref={iframeRef} className="w-full h-full" title="Quote Preview" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
