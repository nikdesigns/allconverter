"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Plus, Trash2, FileText, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface LineItem { id: number; description: string; hsn: string; qty: string; rate: string; gstRate: string; }
let nextId = 2;

const GST_RATES = ["0", "5", "12", "18", "28"];
const CURRENCIES = [{ code: "INR", symbol: "₹" }, { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" }];

function fmt(n: number, code = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: code, minimumFractionDigits: 2 }).format(n);
}

export function GstInvoiceGeneratorTool() {
  const [from, setFrom] = useState({ name: "Your Business", address: "123 Main Road\nMumbai, MH 400001", gstin: "27AAAPL1234C1Z5", email: "billing@yourbiz.com", phone: "" });
  const [to, setTo] = useState({ name: "Client Company", address: "456 Client Nagar\nDelhi, DL 110001", gstin: "07BBBPL5678D2Z6", email: "accounts@client.com" });
  const [meta, setMeta] = useState({ number: "GST-001", date: new Date().toISOString().slice(0, 10), due: "", currency: "INR", po: "", supplyType: "intra" });
  const [items, setItems] = useState<LineItem[]>([{ id: 1, description: "Professional Services", hsn: "998313", qty: "1", rate: "10000", gstRate: "18" }]);
  const [notes, setNotes] = useState("Payment due within 30 days. Thank you for your business.");
  const [themeAccent, setThemeAccent] = useState("#0d9488");
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setFrom_ = (k: string, v: string) => setFrom(p => ({ ...p, [k]: v }));
  const setTo_   = (k: string, v: string) => setTo(p => ({ ...p, [k]: v }));
  const setMeta_ = (k: string, v: string) => setMeta(p => ({ ...p, [k]: v }));
  const updateItem = (id: number, k: keyof LineItem, v: string) => setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));
  const addItem = () => setItems(p => [...p, { id: nextId++, description: "", hsn: "", qty: "1", rate: "0", gstRate: "18" }]);
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));

  const isIntra = meta.supplyType === "intra";
  const itemsCalc = items.map(i => {
    const taxable = (parseFloat(i.qty) || 0) * (parseFloat(i.rate) || 0);
    const gstAmt  = taxable * (parseFloat(i.gstRate) || 0) / 100;
    return { ...i, taxable, gstAmt, total: taxable + gstAmt };
  });
  const subtotal  = itemsCalc.reduce((s, i) => s + i.taxable, 0);
  const totalGst  = itemsCalc.reduce((s, i) => s + i.gstAmt, 0);
  const grandTotal = subtotal + totalGst;

  const buildHTML = () => `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>GST Invoice ${meta.number}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;color:#18181b;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:820px;margin:28px auto;background:#fff;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.1);overflow:hidden}
.top-bar{background:${themeAccent};height:5px}
.body{padding:40px}
.header{display:flex;justify-content:space-between;gap:20px;margin-bottom:32px}
.brand-name{font-size:20px;font-weight:800;color:${themeAccent}}
.brand-sub{font-size:11px;color:#71717a;margin-top:3px}
.inv-right{text-align:right}
.inv-title{font-size:28px;font-weight:900;color:${themeAccent}}
.inv-num{font-size:12px;font-family:monospace;color:#a1a1aa;margin-top:4px}
.gst-badge{display:inline-block;padding:2px 8px;background:${themeAccent}20;color:${themeAccent};border-radius:100px;font-size:10px;font-weight:700;margin-top:4px}
.dates{display:flex;gap:16px;margin-top:8px;justify-content:flex-end}
.di{text-align:right}
.dl{font-size:9px;text-transform:uppercase;letter-spacing:.05em;color:#a1a1aa}
.dv{font-size:12px;font-weight:600}
.divider{height:1px;background:#e4e4e7;margin:0 0 24px}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
.party-lbl{font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:#a1a1aa;font-weight:600;margin-bottom:6px}
.party-name{font-size:15px;font-weight:700}
.party-addr{font-size:12px;color:#52525b;white-space:pre-line;line-height:1.6;margin-top:2px}
.gstin{font-size:11px;font-family:monospace;color:${themeAccent};margin-top:3px;font-weight:600}
table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:12px}
thead th{padding:8px 10px;background:${themeAccent}16;border-bottom:2px solid ${themeAccent}40;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:${themeAccent};font-weight:700}
tbody td{padding:10px 10px;border-bottom:1px solid #f4f4f5;color:#27272a;vertical-align:top}
.totals-wrap{display:flex;justify-content:flex-end}
.totals{width:300px;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden}
.tr{display:flex;justify-content:space-between;padding:8px 14px;font-size:13px;border-bottom:1px solid #e4e4e7;background:#fafafa}
.tr.gst{background:#f0fdf4;color:#166534}
.tr.grand{background:${themeAccent};color:#fff;padding:12px 14px}
.tr.grand .lbl{font-size:12px;font-weight:700;opacity:.9}
.tr.grand .amt{font-size:18px;font-weight:900}
.notes{margin-top:24px;padding:14px 16px;background:${themeAccent}0d;border-left:3px solid ${themeAccent};border-radius:0 6px 6px 0}
.nl{font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:${themeAccent};font-weight:700;margin-bottom:4px}
.nt{font-size:12px;color:#52525b;line-height:1.6}
.footer{margin-top:28px;padding-top:14px;border-top:1px solid #e4e4e7;display:flex;justify-content:space-between;align-items:center}
.footer-t{font-size:10px;color:#a1a1aa}
@media print{body{background:#fff}.page{box-shadow:none;margin:0;border-radius:0}}
</style></head><body>
<div class="page">
<div class="top-bar"></div>
<div class="body">
  <div class="header">
    <div><div class="brand-name">${from.name}</div>${from.gstin ? `<div class="brand-sub">GSTIN: ${from.gstin}</div>` : ""}<div class="brand-sub">${from.address.replace(/\n/g,", ")}</div>${from.email ? `<div class="brand-sub">${from.email}</div>` : ""}${from.phone ? `<div class="brand-sub">${from.phone}</div>` : ""}</div>
    <div class="inv-right">
      <div class="inv-title">TAX INVOICE</div>
      <div class="inv-num">#${meta.number}</div>
      <div class="gst-badge">${isIntra ? "Intra-State Supply" : "Inter-State Supply"}</div>
      ${meta.po ? `<div class="gst-badge" style="margin-left:4px">PO: ${meta.po}</div>` : ""}
      <div class="dates">
        <div class="di"><div class="dl">Invoice Date</div><div class="dv">${meta.date}</div></div>
        ${meta.due ? `<div class="di"><div class="dl">Due Date</div><div class="dv">${meta.due}</div></div>` : ""}
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="parties">
    <div><div class="party-lbl">From (Supplier)</div><div class="party-name">${from.name}</div><div class="party-addr">${from.address}</div>${from.gstin ? `<div class="gstin">GSTIN: ${from.gstin}</div>` : ""}</div>
    <div><div class="party-lbl">Bill To (Recipient)</div><div class="party-name">${to.name}</div><div class="party-addr">${to.address}</div>${to.gstin ? `<div class="gstin">GSTIN: ${to.gstin}</div>` : ""}${to.email ? `<div style="font-size:11px;color:#71717a;margin-top:2px">${to.email}</div>` : ""}</div>
  </div>
  <table>
    <thead><tr>
      <th style="text-align:left;width:35%">Description</th>
      <th>HSN/SAC</th><th>Qty</th><th style="text-align:right">Rate</th>
      <th style="text-align:right">Taxable</th>
      ${isIntra ? "<th style='text-align:right'>CGST</th><th style='text-align:right'>SGST</th>" : "<th style='text-align:right'>IGST</th>"}
      <th style="text-align:right">Total</th>
    </tr></thead>
    <tbody>${itemsCalc.map(i => {
      const half = i.gstAmt / 2;
      return `<tr>
        <td>${i.description || "<em style='color:#a1a1aa'>No description</em>"}</td>
        <td style="text-align:center;color:#71717a">${i.hsn || "—"}</td>
        <td style="text-align:center">${i.qty}</td>
        <td style="text-align:right">${fmt(parseFloat(i.rate)||0,meta.currency)}</td>
        <td style="text-align:right">${fmt(i.taxable,meta.currency)}</td>
        ${isIntra ? `<td style="text-align:right">${fmt(half,meta.currency)}<br><span style="font-size:9px;color:#71717a">${(parseFloat(i.gstRate)||0)/2}%</span></td><td style="text-align:right">${fmt(half,meta.currency)}<br><span style="font-size:9px;color:#71717a">${(parseFloat(i.gstRate)||0)/2}%</span></td>` : `<td style="text-align:right">${fmt(i.gstAmt,meta.currency)}<br><span style="font-size:9px;color:#71717a">${i.gstRate}%</span></td>`}
        <td style="text-align:right;font-weight:600">${fmt(i.total,meta.currency)}</td>
      </tr>`;
    }).join("")}</tbody>
  </table>
  <div class="totals-wrap"><div class="totals">
    <div class="tr"><span>Taxable Amount</span><span>${fmt(subtotal,meta.currency)}</span></div>
    ${isIntra ? `<div class="tr gst"><span>CGST</span><span>${fmt(totalGst/2,meta.currency)}</span></div><div class="tr gst"><span>SGST</span><span>${fmt(totalGst/2,meta.currency)}</span></div>` : `<div class="tr gst"><span>IGST</span><span>${fmt(totalGst,meta.currency)}</span></div>`}
    <div class="tr grand"><span class="lbl">Grand Total</span><span class="amt">${fmt(grandTotal,meta.currency)}</span></div>
  </div></div>
  ${notes ? `<div class="notes"><div class="nl">Notes & Terms</div><div class="nt">${notes}</div></div>` : ""}
  <div class="footer"><span class="footer-t">Generated with AllConverter.tools</span><span class="footer-t">GST Invoice #${meta.number}</span></div>
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
  }, [showPreview, from, to, meta, items, notes, themeAccent]);

  const print = () => { const w = window.open("", "_blank")!; w.document.write(buildHTML()); w.document.close(); setTimeout(() => w.print(), 300); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /><span className="text-sm font-medium">GST Invoice Generator</span></div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowPreview(v => !v)} className="h-7 text-xs gap-1.5">
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}{showPreview ? "Hide" : "Preview"}
          </Button>
          <Button size="sm" onClick={print} className="h-7 text-xs gap-1.5"><Download className="w-3.5 h-3.5" />Print / PDF</Button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Theme color */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Color</label>
          {["#0d9488","#3b82f6","#6366f1","#e11d48","#059669","#f97316"].map(c => (
            <button key={c} onClick={() => setThemeAccent(c)} className={cn("w-6 h-6 rounded-full border-2 transition-all hover:scale-110", themeAccent===c?"border-foreground scale-110":"border-transparent")} style={{ backgroundColor: c }} />
          ))}
          <input type="color" value={themeAccent} onChange={e => setThemeAccent(e.target.value)} className="w-6 h-6 rounded-full border border-border cursor-pointer p-0 bg-transparent" />
        </div>

        {/* Supply type */}
        <div className="flex gap-2">
          <label className="text-xs font-medium text-muted-foreground self-center">Supply Type:</label>
          {[{id:"intra",label:"Intra-State (CGST + SGST)"},{id:"inter",label:"Inter-State (IGST)"}].map(t => (
            <button key={t.id} onClick={() => setMeta_("supplyType", t.id)}
              className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium transition-all", meta.supplyType===t.id?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground hover:border-primary/40")}>
              {t.label}
            </button>
          ))}
        </div>

        {/* From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Supplier (From)</p>
            <Input value={from.name} onChange={e => setFrom_("name", e.target.value)} placeholder="Business name" className="text-sm" />
            <Textarea value={from.address} onChange={e => setFrom_("address", e.target.value)} className="text-sm resize-none min-h-[60px]" placeholder="Address" />
            <Input value={from.gstin} onChange={e => setFrom_("gstin", e.target.value)} placeholder="GSTIN (e.g. 27AAAPL1234C1Z5)" className="text-sm font-mono uppercase" />
            <Input value={from.email} onChange={e => setFrom_("email", e.target.value)} placeholder="Email" className="text-sm" />
            <Input value={from.phone} onChange={e => setFrom_("phone", e.target.value)} placeholder="Phone" className="text-sm" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recipient (Bill To)</p>
            <Input value={to.name} onChange={e => setTo_("name", e.target.value)} placeholder="Client company" className="text-sm" />
            <Textarea value={to.address} onChange={e => setTo_("address", e.target.value)} className="text-sm resize-none min-h-[60px]" placeholder="Address" />
            <Input value={to.gstin} onChange={e => setTo_("gstin", e.target.value)} placeholder="Client GSTIN" className="text-sm font-mono uppercase" />
            <Input value={to.email} onChange={e => setTo_("email", e.target.value)} placeholder="Email" className="text-sm" />
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Invoice #</label><Input value={meta.number} onChange={e => setMeta_("number", e.target.value)} className="text-sm font-mono" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Currency</label>
            <select value={meta.currency} onChange={e => setMeta_("currency", e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
            </select>
          </div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Invoice Date</label><Input type="date" value={meta.date} onChange={e => setMeta_("date", e.target.value)} className="text-sm" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Due Date</label><Input type="date" value={meta.due} onChange={e => setMeta_("due", e.target.value)} className="text-sm" /></div>
        </div>

        {/* Line items */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Line Items</p>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_80px_60px_84px_80px_28px] gap-2 px-1">
              {["Description","HSN/SAC","Qty","Rate","GST %",""].map((h,i) => <p key={i} className="text-[11px] text-muted-foreground">{h}</p>)}
            </div>
            {items.map(item => {
              const taxable = (parseFloat(item.qty)||0)*(parseFloat(item.rate)||0);
              const gstAmt = taxable*(parseFloat(item.gstRate)||0)/100;
              return (
                <div key={item.id} className="grid grid-cols-[1fr_80px_60px_84px_80px_28px] gap-2 items-center">
                  <Input value={item.description} onChange={e => updateItem(item.id,"description",e.target.value)} placeholder="Description" className="text-sm" />
                  <Input value={item.hsn} onChange={e => updateItem(item.id,"hsn",e.target.value)} placeholder="998313" className="text-xs font-mono" />
                  <Input type="number" value={item.qty} onChange={e => updateItem(item.id,"qty",e.target.value)} className="text-sm text-center font-mono" min="0" />
                  <Input type="number" value={item.rate} onChange={e => updateItem(item.id,"rate",e.target.value)} className="text-sm font-mono" min="0" />
                  <select value={item.gstRate} onChange={e => updateItem(item.id,"gstRate",e.target.value)} className="h-10 px-2 rounded-xl border border-input bg-background text-sm">
                    {GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                  <button onClick={() => removeItem(item.id)} disabled={items.length===1} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-25">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
          <Button variant="outline" size="sm" onClick={addItem} className="mt-2 w-full gap-2 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" />Add Line Item
          </Button>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-72 rounded-xl border border-border overflow-hidden">
            <div className="p-4 space-y-2 bg-muted/20">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Taxable Amount</span><span className="font-mono">{fmt(subtotal, meta.currency)}</span></div>
              {isIntra ? (
                <>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">CGST</span><span className="font-mono">{fmt(totalGst/2, meta.currency)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">SGST</span><span className="font-mono">{fmt(totalGst/2, meta.currency)}</span></div>
                </>
              ) : (
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">IGST</span><span className="font-mono">{fmt(totalGst, meta.currency)}</span></div>
              )}
            </div>
            <div className="flex justify-between px-4 py-3" style={{ backgroundColor: themeAccent }}>
              <span className="text-white font-bold text-sm">Grand Total</span>
              <span className="text-white font-black text-xl font-mono">{fmt(grandTotal, meta.currency)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Notes / Terms</label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-sm resize-none min-h-[60px]" placeholder="Payment terms, bank details…" />
        </div>

        {/* Preview */}
        {showPreview && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Live Preview</p>
            <div className="rounded-xl border border-border overflow-hidden" style={{ height: 560 }}>
              <iframe ref={iframeRef} className="w-full h-full" title="GST Invoice Preview" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
