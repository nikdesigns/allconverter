"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Plus, Trash2, FileText, Upload, X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface LineItem { id: number; description: string; qty: string; rate: string; }
let nextId = 2;

const CURRENCIES = [
  { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" }, { code: "INR", symbol: "₹" },
  { code: "CAD", symbol: "CA$" }, { code: "AUD", symbol: "A$" },
  { code: "JPY", symbol: "¥" }, { code: "AED", symbol: "د.إ" },
];

const THEMES = [
  { id: "indigo",  accent: "#6366f1" },
  { id: "blue",    accent: "#3b82f6" },
  { id: "teal",    accent: "#0d9488" },
  { id: "emerald", accent: "#059669" },
  { id: "rose",    accent: "#e11d48" },
  { id: "slate",   accent: "#475569" },
];

function currFmt(n: number, code: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code, minimumFractionDigits: 2 }).format(n);
}

export function InvoiceGeneratorTool() {
  const [from, setFrom] = useState({
    name: "Your Company Name", address: "123 Main St\nCity, State 12345",
    email: "hello@yourcompany.com", phone: "", website: "",
  });
  const [to, setTo] = useState({
    name: "Client Name", address: "456 Client Ave\nCity, State 67890", email: "client@company.com",
  });
  const [meta, setMeta] = useState({
    number: "INV-001", date: new Date().toISOString().slice(0, 10),
    due: "", currency: "USD", po: "",
  });
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "Web Design Services", qty: "1", rate: "1500" },
  ]);
  const [taxRate, setTaxRate] = useState("10");
  const [discount, setDiscount] = useState("0");
  const [notes, setNotes] = useState("Thank you for your business! Payment is due within 30 days.");
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [themeAccent, setThemeAccent] = useState(THEMES[0].accent);
  const [showPreview, setShowPreview] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!showPreview) return;
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.open();
      doc.write(buildHTML());
      doc.close();
    }, 150);
    return () => { if (previewTimer.current) clearTimeout(previewTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview, from, to, meta, items, taxRate, discount, notes, logoBase64, themeAccent]);

  const setFrom_ = (k: string, v: string) => setFrom(p => ({ ...p, [k]: v }));
  const setTo_   = (k: string, v: string) => setTo(p => ({ ...p, [k]: v }));
  const setMeta_ = (k: string, v: string) => setMeta(p => ({ ...p, [k]: v }));
  const updateItem = (id: number, k: keyof LineItem, v: string) =>
    setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));
  const addItem    = () => setItems(p => [...p, { id: nextId++, description: "", qty: "1", rate: "0" }]);
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));

  const fmt = (n: number) => currFmt(n, meta.currency);
  const subtotal    = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.rate) || 0), 0);
  const discountAmt = subtotal * (parseFloat(discount) || 0) / 100;
  const taxAmt      = (subtotal - discountAmt) * (parseFloat(taxRate) || 0) / 100;
  const total       = subtotal - discountAmt + taxAmt;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoBase64(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const buildHTML = () => `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Invoice ${meta.number}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;color:#18181b;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:794px;margin:32px auto;background:#fff;border-radius:12px;box-shadow:0 4px 32px rgba(0,0,0,.10);overflow:hidden}
.top-bar{background:${themeAccent};height:6px}
.body{padding:48px}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;gap:24px}
.logo img{max-height:72px;max-width:220px;object-fit:contain;display:block}
.brand-name{font-size:22px;font-weight:800;color:${themeAccent};letter-spacing:-.02em}
.brand-sub{font-size:12px;color:#71717a;margin-top:4px}
.invoice-block{text-align:right}
.invoice-title{font-size:32px;font-weight:900;letter-spacing:-.04em;color:${themeAccent};line-height:1}
.invoice-num{font-size:13px;color:#a1a1aa;font-family:monospace;margin-top:6px}
.dates{display:flex;gap:20px;margin-top:10px;justify-content:flex-end}
.date-item{text-align:right}
.date-label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#a1a1aa;margin-bottom:2px}
.date-val{font-size:13px;font-weight:600;color:#3f3f46}
.divider{height:1px;background:#e4e4e7;margin:0 0 32px}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:36px}
.party-label{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#a1a1aa;font-weight:600;margin-bottom:10px}
.party-name{font-size:16px;font-weight:700;color:#18181b;margin-bottom:4px}
.party-addr{font-size:13px;color:#52525b;white-space:pre-line;line-height:1.65}
.party-contact{font-size:12px;color:${themeAccent};margin-top:4px}
table{width:100%;border-collapse:collapse;margin-bottom:28px}
thead tr{background:${themeAccent}14;border-bottom:2px solid ${themeAccent}40}
thead th{padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${themeAccent}}
tbody tr{border-bottom:1px solid #f4f4f5;transition:background .1s}
tbody tr:hover{background:#fafafa}
tbody td{padding:13px 14px;font-size:14px;color:#27272a;vertical-align:top}
tbody tr:last-child td{border-bottom:none}
.totals-wrap{display:flex;justify-content:flex-end}
.totals{width:280px;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden}
.total-row{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;font-size:14px;color:#52525b;background:#fafafa;border-bottom:1px solid #e4e4e7}
.total-row:last-child{border-bottom:none}
.total-row.grand{background:${themeAccent};color:#fff;padding:14px 16px}
.total-row.grand .lbl{font-size:13px;font-weight:700;opacity:.9}
.total-row.grand .amt{font-size:20px;font-weight:900;letter-spacing:-.02em}
.discount-amt{color:#059669;font-weight:600}
.notes-section{margin-top:36px;padding:18px 20px;background:${themeAccent}0d;border-left:4px solid ${themeAccent};border-radius:0 8px 8px 0}
.notes-label{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:${themeAccent};font-weight:700;margin-bottom:6px}
.notes-text{font-size:13px;color:#52525b;line-height:1.7}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #e4e4e7;display:flex;justify-content:space-between;align-items:center}
.footer-brand{font-size:11px;color:#a1a1aa}
.po-badge{display:inline-block;padding:2px 10px;background:${themeAccent}18;color:${themeAccent};border-radius:100px;font-size:11px;font-weight:600;margin-top:4px}
@media print{body{background:#fff}.page{box-shadow:none;margin:0;border-radius:0}}
</style>
</head>
<body>
<div class="page">
<div class="top-bar"></div>
<div class="body">
  <div class="header">
    <div class="logo">
      ${logoBase64
        ? `<img src="${logoBase64}" alt="${from.name}" /><div class="brand-sub">${from.name}</div>`
        : `<div class="brand-name">${from.name}</div>${from.website ? `<div class="brand-sub">${from.website}</div>` : ""}`
      }
    </div>
    <div class="invoice-block">
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-num">#${meta.number}</div>
      ${meta.po ? `<div class="po-badge">PO: ${meta.po}</div>` : ""}
      <div class="dates">
        <div class="date-item"><div class="date-label">Issue Date</div><div class="date-val">${meta.date}</div></div>
        ${meta.due ? `<div class="date-item"><div class="date-label">Due Date</div><div class="date-val">${meta.due}</div></div>` : ""}
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <div class="parties">
    <div>
      <div class="party-label">From</div>
      <div class="party-name">${from.name}</div>
      <div class="party-addr">${from.address}</div>
      ${from.email  ? `<div class="party-contact">${from.email}</div>`   : ""}
      ${from.phone  ? `<div class="party-contact">${from.phone}</div>`   : ""}
      ${from.website? `<div class="party-contact">${from.website}</div>` : ""}
    </div>
    <div>
      <div class="party-label">Bill To</div>
      <div class="party-name">${to.name}</div>
      <div class="party-addr">${to.address}</div>
      ${to.email ? `<div class="party-contact">${to.email}</div>` : ""}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align:left;width:48%">Description</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Unit Rate</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(i => {
        const amt = (parseFloat(i.qty) || 0) * (parseFloat(i.rate) || 0);
        return `<tr>
          <td>${i.description || "<em style='color:#a1a1aa'>No description</em>"}</td>
          <td style="text-align:center;color:#71717a">${i.qty}</td>
          <td style="text-align:right">${fmt(parseFloat(i.rate) || 0)}</td>
          <td style="text-align:right;font-weight:600">${fmt(amt)}</td>
        </tr>`;
      }).join("")}
    </tbody>
  </table>

  <div class="totals-wrap">
    <div class="totals">
      <div class="total-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
      ${discountAmt > 0 ? `<div class="total-row"><span>Discount (${discount}%)</span><span class="discount-amt">−${fmt(discountAmt)}</span></div>` : ""}
      ${parseFloat(taxRate) > 0 ? `<div class="total-row"><span>Tax (${taxRate}%)</span><span>${fmt(taxAmt)}</span></div>` : ""}
      <div class="total-row grand"><span class="lbl">Total Due</span><span class="amt">${fmt(total)}</span></div>
    </div>
  </div>

  ${notes ? `<div class="notes-section"><div class="notes-label">Notes & Payment Terms</div><div class="notes-text">${notes}</div></div>` : ""}

  <div class="footer">
    <span class="footer-brand">Generated with AllConverter.tools</span>
    <span style="font-size:12px;color:#a1a1aa">${meta.currency} · Invoice #${meta.number}</span>
  </div>
</div>
</div>
</body>
</html>`;

  const printInvoice = () => {
    const w = window.open("", "_blank")!;
    w.document.write(buildHTML());
    w.document.close();
    setTimeout(() => w.print(), 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Invoice Generator</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPreview(v => !v)}
            className="h-7 text-xs gap-1.5"
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPreview ? "Hide" : "Preview"}
          </Button>
          <Button size="sm" onClick={printInvoice} className="h-7 text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" /> Print / Save PDF
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* Theme + Logo row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Color theme */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
              Invoice Color
            </label>
            <div className="flex items-center gap-2">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setThemeAccent(t.accent)}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-all hover:scale-110",
                    themeAccent === t.accent ? "border-foreground scale-110 shadow-md" : "border-transparent"
                  )}
                  style={{ backgroundColor: t.accent }}
                  title={t.id}
                />
              ))}
              {/* Custom color */}
              <input
                type="color"
                value={themeAccent}
                onChange={e => setThemeAccent(e.target.value)}
                className="w-7 h-7 rounded-full border-2 border-border cursor-pointer p-0 overflow-hidden"
                title="Custom color"
              />
            </div>
          </div>

          {/* Logo upload */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
              Company Logo
            </label>
            {logoBase64 ? (
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <img src={logoBase64} alt="Logo" className="h-8 max-w-[100px] object-contain shrink-0" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex-1">Logo uploaded</span>
                <button
                  onClick={() => setLogoBase64(null)}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoRef.current?.click()}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm text-muted-foreground"
              >
                <Upload className="w-4 h-4 shrink-0" />
                Upload logo (PNG, JPG, SVG, WebP)
              </button>
            )}
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">From</p>
            <Input value={from.name}    onChange={e => setFrom_("name",    e.target.value)} placeholder="Company name"  className="text-sm" />
            <Textarea value={from.address} onChange={e => setFrom_("address", e.target.value)} className="text-sm resize-none min-h-[68px]" placeholder="Address" />
            <Input value={from.email}   onChange={e => setFrom_("email",   e.target.value)} placeholder="Email"         className="text-sm" />
            <Input value={from.phone}   onChange={e => setFrom_("phone",   e.target.value)} placeholder="Phone"         className="text-sm" />
            <Input value={from.website} onChange={e => setFrom_("website", e.target.value)} placeholder="Website"       className="text-sm" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bill To</p>
            <Input value={to.name}    onChange={e => setTo_("name",    e.target.value)} placeholder="Client name"    className="text-sm" />
            <Textarea value={to.address} onChange={e => setTo_("address", e.target.value)} className="text-sm resize-none min-h-[68px]" placeholder="Address" />
            <Input value={to.email}   onChange={e => setTo_("email",   e.target.value)} placeholder="Email"         className="text-sm" />
          </div>
        </div>

        {/* Invoice meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Invoice #</label>
            <Input value={meta.number} onChange={e => setMeta_("number", e.target.value)} className="text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Currency</label>
            <select
              value={meta.currency}
              onChange={e => setMeta_("currency", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Issue Date</label>
            <Input type="date" value={meta.date} onChange={e => setMeta_("date", e.target.value)} className="text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Due Date</label>
            <Input type="date" value={meta.due}  onChange={e => setMeta_("due",  e.target.value)} className="text-sm" />
          </div>
        </div>

        {/* Line items */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Line Items</p>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_64px_96px_88px_32px] gap-2 px-1">
              {["Description", "Qty", "Rate", "Amount", ""].map((h, i) => (
                <p key={i} className="text-[11px] text-muted-foreground">{h}</p>
              ))}
            </div>
            {items.map(item => {
              const amt = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
              return (
                <div key={item.id} className="grid grid-cols-[1fr_64px_96px_88px_32px] gap-2 items-center">
                  <Input
                    value={item.description}
                    onChange={e => updateItem(item.id, "description", e.target.value)}
                    placeholder="Description"
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={e => updateItem(item.id, "qty", e.target.value)}
                    className="text-sm text-center font-mono"
                    min="0"
                  />
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={e => updateItem(item.id, "rate", e.target.value)}
                    className="text-sm font-mono"
                    min="0"
                  />
                  <span className="text-sm font-mono text-right text-muted-foreground pr-1 tabular-nums">
                    {fmt(amt)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-25 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
          <Button variant="outline" size="sm" onClick={addItem} className="mt-2 w-full gap-2 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add Line Item
          </Button>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-72 rounded-xl border border-border overflow-hidden">
            <div className="p-4 space-y-2.5 bg-muted/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono tabular-nums">{fmt(subtotal)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground shrink-0">Discount</span>
                <Input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  min="0" max="100"
                  className="w-16 h-7 text-xs text-center font-mono"
                />
                <span className="text-sm text-muted-foreground">%</span>
                {discountAmt > 0 && (
                  <span className="font-mono text-sm ml-auto text-emerald-600 dark:text-emerald-400 tabular-nums">
                    −{fmt(discountAmt)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground shrink-0">Tax</span>
                <Input
                  type="number"
                  value={taxRate}
                  onChange={e => setTaxRate(e.target.value)}
                  min="0" max="100"
                  className="w-16 h-7 text-xs text-center font-mono"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="font-mono text-sm ml-auto tabular-nums">{fmt(taxAmt)}</span>
              </div>
            </div>
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ backgroundColor: themeAccent }}
            >
              <span className="text-white font-bold text-sm">Total Due</span>
              <span className="text-white font-black text-xl font-mono tabular-nums">{fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Notes / Payment Terms</label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="text-sm resize-none min-h-[64px]"
            placeholder="Payment terms, bank details, thank you message…"
          />
        </div>

        {/* Inline live preview */}
        {showPreview && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </p>
            <div className="rounded-xl border border-border overflow-hidden" style={{ height: 560 }}>
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                title="Invoice Preview"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
