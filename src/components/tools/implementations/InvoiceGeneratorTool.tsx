"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Plus, Trash2, FileText } from "lucide-react";

interface LineItem { id: number; description: string; qty: string; rate: string; }
let nextId = 2;

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function InvoiceGeneratorTool() {
  const [from, setFrom] = useState({ name: "Your Company Name", address: "123 Main St\nCity, State 12345", email: "hello@yourcompany.com" });
  const [to, setTo] = useState({ name: "Client Name", address: "456 Client Ave\nCity, State 67890", email: "client@company.com" });
  const [meta, setMeta] = useState({ number: "INV-001", date: new Date().toISOString().slice(0,10), due: "", currency: "USD" });
  const [items, setItems] = useState<LineItem[]>([{ id: 1, description: "Web Design Services", qty: "1", rate: "1500" }]);
  const [taxRate, setTaxRate] = useState("10");
  const [notes, setNotes] = useState("Thank you for your business!");

  const setFrom_ = (k: string, v: string) => setFrom(p => ({ ...p, [k]: v }));
  const setTo_ = (k: string, v: string) => setTo(p => ({ ...p, [k]: v }));
  const setMeta_ = (k: string, v: string) => setMeta(p => ({ ...p, [k]: v }));
  const updateItem = (id: number, k: keyof LineItem, v: string) => setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));
  const addItem = () => setItems(p => [...p, { id: nextId++, description: "", qty: "1", rate: "0" }]);
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));

  const subtotal = items.reduce((s, i) => s + (parseFloat(i.qty)||0) * (parseFloat(i.rate)||0), 0);
  const tax = subtotal * (parseFloat(taxRate)||0) / 100;
  const total = subtotal + tax;

  const printInvoice = () => {
    const w = window.open("", "_blank")!;
    w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${meta.number}</title>
<style>
body{font-family:Inter,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#111}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px}
.title{font-size:32px;font-weight:800;color:#6366f1}
.section{margin-bottom:24px}
.label{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888;margin-bottom:4px}
.from-to{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px}
table{width:100%;border-collapse:collapse}
th{text-align:left;padding:8px 12px;background:#f5f5f5;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#888}
td{padding:10px 12px;border-bottom:1px solid #eee;font-size:14px}
.total-row td{border-top:2px solid #eee;font-weight:600}
.grand td{font-size:18px;font-weight:800;color:#6366f1}
.notes{margin-top:32px;padding:16px;background:#f9f9f9;border-radius:8px;font-size:13px;color:#555}
@media print{body{margin:0}}
</style></head><body>
<div class="header">
  <div><div class="title">INVOICE</div><div style="font-size:13px;color:#888;margin-top:4px">#${meta.number}</div></div>
  <div style="text-align:right">
    <div style="font-size:11px;color:#888">Date: ${meta.date}</div>
    ${meta.due ? `<div style="font-size:11px;color:#888">Due: ${meta.due}</div>` : ""}
  </div>
</div>
<div class="from-to">
  <div><div class="label">From</div><strong>${from.name}</strong><br><pre style="font:inherit;margin:4px 0 0;white-space:pre-line">${from.address}</pre>${from.email ? `<div style="color:#6366f1;font-size:13px">${from.email}</div>` : ""}</div>
  <div><div class="label">Bill To</div><strong>${to.name}</strong><br><pre style="font:inherit;margin:4px 0 0;white-space:pre-line">${to.address}</pre>${to.email ? `<div style="color:#6366f1;font-size:13px">${to.email}</div>` : ""}</div>
</div>
<table><thead><tr><th style="width:50%">Description</th><th>Qty</th><th>Rate</th><th style="text-align:right">Amount</th></tr></thead>
<tbody>
${items.map(i => `<tr><td>${i.description || "(no description)"}</td><td>${i.qty}</td><td>${fmt(parseFloat(i.rate)||0)}</td><td style="text-align:right">${fmt((parseFloat(i.qty)||0)*(parseFloat(i.rate)||0))}</td></tr>`).join("")}
</tbody>
<tfoot>
<tr><td colspan="3" style="text-align:right;padding:10px 12px;font-size:12px;color:#888">Subtotal</td><td style="text-align:right;padding:10px 12px">${fmt(subtotal)}</td></tr>
${taxRate && parseFloat(taxRate) > 0 ? `<tr><td colspan="3" style="text-align:right;padding:10px 12px;font-size:12px;color:#888">Tax (${taxRate}%)</td><td style="text-align:right;padding:10px 12px">${fmt(tax)}</td></tr>` : ""}
<tr class="grand"><td colspan="3" style="text-align:right;padding:12px">Total</td><td style="text-align:right;padding:12px">${fmt(total)}</td></tr>
</tfoot>
</table>
${notes ? `<div class="notes">${notes}</div>` : ""}
</body></html>`);
    w.document.close();
    setTimeout(() => { w.print(); }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Invoice Generator</span>
        </div>
        <Button size="sm" onClick={printInvoice} className="h-7 text-xs gap-1.5">
          <Download className="w-3.5 h-3.5" />Print / Save PDF
        </Button>
      </div>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">From</p>
            <Input value={from.name} onChange={e => setFrom_("name", e.target.value)} placeholder="Your company" className="text-sm" />
            <Textarea value={from.address} onChange={e => setFrom_("address", e.target.value)} className="text-sm resize-none min-h-[72px]" placeholder="Address" />
            <Input value={from.email} onChange={e => setFrom_("email", e.target.value)} placeholder="Email" className="text-sm" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bill To</p>
            <Input value={to.name} onChange={e => setTo_("name", e.target.value)} placeholder="Client name" className="text-sm" />
            <Textarea value={to.address} onChange={e => setTo_("address", e.target.value)} className="text-sm resize-none min-h-[72px]" placeholder="Address" />
            <Input value={to.email} onChange={e => setTo_("email", e.target.value)} placeholder="Email" className="text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Invoice #</label>
            <Input value={meta.number} onChange={e => setMeta_("number", e.target.value)} className="text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Issue Date</label>
            <Input type="date" value={meta.date} onChange={e => setMeta_("date", e.target.value)} className="text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Due Date</label>
            <Input type="date" value={meta.due} onChange={e => setMeta_("due", e.target.value)} className="text-sm" />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Line Items</p>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_72px_96px_32px] gap-2 px-1">
              {["Description","Qty","Rate",""].map(h => <p key={h} className="text-[11px] text-muted-foreground">{h}</p>)}
            </div>
            {items.map(item => (
              <div key={item.id} className="grid grid-cols-[1fr_72px_96px_32px] gap-2">
                <Input value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)} placeholder="Description" className="text-sm" />
                <Input type="number" value={item.qty} onChange={e => updateItem(item.id, "qty", e.target.value)} className="text-sm text-center font-mono" min="0" />
                <Input type="number" value={item.rate} onChange={e => updateItem(item.id, "rate", e.target.value)} className="text-sm font-mono" min="0" />
                <button onClick={() => removeItem(item.id)} disabled={items.length === 1}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive disabled:opacity-30 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={addItem} className="mt-2 w-full gap-2 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" />Add Line
          </Button>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">{fmt(subtotal)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tax</span>
              <Input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} min="0" max="100" className="w-16 h-7 text-xs text-center font-mono" />
              <span className="text-sm text-muted-foreground">%</span>
              <span className="font-mono text-sm ml-auto">{fmt(tax)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="font-bold">Total</span>
              <span className="font-bold font-mono text-primary text-lg">{fmt(total)}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-sm resize-none min-h-[60px]" placeholder="Payment terms, thank you message…" />
        </div>
      </div>
    </div>
  );
}
