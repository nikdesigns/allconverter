"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Plus, Trash2, Printer, Download, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function printPage(html: string, title: string) {
  const w = window.open("", "_blank")!;
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    *{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:12px;color:#222;margin:0;padding:20px}
    .doc{max-width:800px;margin:0 auto;padding:32px;border:1px solid #ddd}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #333}
    .title{font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
    .meta{text-align:right;font-size:11px;color:#555}
    .parties{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
    .party h3{font-size:11px;text-transform:uppercase;color:#777;margin:0 0 4px}
    .party p{margin:2px 0}
    table{width:100%;border-collapse:collapse;margin:16px 0}
    th{background:#f5f5f5;font-weight:600;padding:8px;text-align:left;border:1px solid #ddd}
    td{padding:7px 8px;border:1px solid #ddd}
    .totals{margin-top:8px;text-align:right}
    .totals tr td:first-child{color:#555}
    .totals tr:last-child td{font-weight:700;font-size:14px;border-top:2px solid #333}
    .footer{margin-top:24px;font-size:10px;color:#888;text-align:center}
    @media print{@page{margin:15mm}body{padding:0}.doc{border:none}}
  </style></head><body>${html}</body></html>`);
  w.document.close(); w.focus(); w.print();
}

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─── Shared line item editor ──────────────────────────────────────────────────

interface LineItem { description: string; qty: number; rate: number; }

function LineItems({ items, onChange }: { items: LineItem[]; onChange: (items: LineItem[]) => void }) {
  const add  = () => onChange([...items, { description: "", qty: 1, rate: 0 }]);
  const del  = (i: number) => onChange(items.filter((_,j)=>j!==i));
  const upd  = (i: number, k: keyof LineItem, v: string|number) => onChange(items.map((it,j) => j===i ? {...it,[k]:v} : it));
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-1 text-[10px] font-medium text-muted-foreground px-1">
        <span className="col-span-6">Description</span><span className="col-span-2 text-center">Qty</span>
        <span className="col-span-2 text-right">Rate</span><span className="col-span-1 text-right">Amount</span><span className="col-span-1" />
      </div>
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-12 gap-1 items-center">
          <Input value={it.description} onChange={e=>upd(i,"description",e.target.value)} placeholder="Item description" className="col-span-6 h-8 text-xs" />
          <Input type="number" min={1} value={it.qty} onChange={e=>upd(i,"qty",Number(e.target.value))} className="col-span-2 h-8 text-xs text-center" />
          <Input type="number" min={0} value={it.rate} onChange={e=>upd(i,"rate",Number(e.target.value))} className="col-span-2 h-8 text-xs text-right" />
          <span className="col-span-1 text-xs text-right font-medium">{(it.qty*it.rate).toLocaleString()}</span>
          <button onClick={()=>del(i)} className="col-span-1 flex justify-center text-muted-foreground hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1 text-xs h-7 mt-1"><Plus className="w-3 h-3" />Add item</Button>
    </div>
  );
}

// ─── Proforma Invoice ─────────────────────────────────────────────────────────

function ProformaInvoice() {
  const [from, setFrom]   = useState({ name:"", address:"", gstin:"" });
  const [to, setTo]       = useState({ name:"", address:"", gstin:"" });
  const [num, setNum]     = useState("PI-001");
  const [date, setDate]   = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<LineItem[]>([{ description:"", qty:1, rate:0 }]);
  const [gst, setGst]     = useState(18);
  const [notes, setNotes] = useState("");

  const subtotal = items.reduce((s,it)=>s+it.qty*it.rate, 0);
  const tax      = subtotal * gst / 100;
  const total    = subtotal + tax;

  const generate = () => {
    const rows = items.map(it=>`<tr><td>${it.description}</td><td style="text-align:center">${it.qty}</td><td style="text-align:right">${formatCurrency(it.rate)}</td><td style="text-align:right">${formatCurrency(it.qty*it.rate)}</td></tr>`).join("");
    const html = `<div class="doc">
      <div class="header"><div><div class="title">Proforma Invoice</div><div style="font-size:11px;color:#555;margin-top:4px">No: ${num} &nbsp;|&nbsp; Date: ${date}</div></div></div>
      <div class="parties">
        <div class="party"><h3>From</h3><p><b>${from.name}</b></p><p>${from.address}</p>${from.gstin?`<p>GSTIN: ${from.gstin}</p>`:""}</div>
        <div class="party"><h3>Bill To</h3><p><b>${to.name}</b></p><p>${to.address}</p>${to.gstin?`<p>GSTIN: ${to.gstin}</p>`:""}</div>
      </div>
      <table><thead><tr><th>Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Rate</th><th style="text-align:right">Amount</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="totals"><table style="width:auto;margin-left:auto"><tr><td>Subtotal</td><td style="text-align:right;padding-left:40px">${formatCurrency(subtotal)}</td></tr><tr><td>GST ${gst}%</td><td style="text-align:right">${formatCurrency(tax)}</td></tr><tr><td>Total</td><td style="text-align:right">${formatCurrency(total)}</td></tr></table></div>
      ${notes?`<div style="margin-top:16px"><b>Notes:</b> ${notes}</div>`:""}
      <div class="footer">This is a proforma invoice. Not a tax invoice.</div>
    </div>`;
    printPage(html, `Proforma Invoice ${num}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <Input value={num} onChange={e=>setNum(e.target.value)} placeholder="Invoice no." className="h-9 text-sm" />
        <Input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-9 text-sm" />
        <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground whitespace-nowrap">GST %</span><Input type="number" value={gst} onChange={e=>setGst(Number(e.target.value))} className="h-9 text-sm" /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[{label:"From (Seller)",s:from,set:setFrom},{label:"To (Buyer)",s:to,set:setTo}].map(p=>(
          <div key={p.label} className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">{p.label}</div>
            <Input value={p.s.name} onChange={e=>p.set({...p.s,name:e.target.value})} placeholder="Company name" className="h-8 text-xs" />
            <Input value={p.s.address} onChange={e=>p.set({...p.s,address:e.target.value})} placeholder="Address" className="h-8 text-xs" />
            <Input value={p.s.gstin} onChange={e=>p.set({...p.s,gstin:e.target.value})} placeholder="GSTIN (optional)" className="h-8 text-xs" />
          </div>
        ))}
      </div>
      <LineItems items={items} onChange={setItems} />
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">Total: {formatCurrency(total)}</span>
        <Button onClick={generate} className="gap-1.5"><Printer className="w-4 h-4" />Print / Save PDF</Button>
      </div>
    </div>
  );
}

// ─── Purchase Order ───────────────────────────────────────────────────────────

function PurchaseOrder() {
  const [buyer, setBuyer]   = useState({ name:"", address:"" });
  const [vendor, setVendor] = useState({ name:"", address:"" });
  const [poNum, setPoNum]   = useState("PO-001");
  const [date, setDate]     = useState(new Date().toISOString().split("T")[0]);
  const [delivery, setDelivery] = useState("");
  const [items, setItems]   = useState<LineItem[]>([{ description:"", qty:1, rate:0 }]);
  const [notes, setNotes]   = useState("");

  const total = items.reduce((s,it)=>s+it.qty*it.rate, 0);

  const generate = () => {
    const rows = items.map(it=>`<tr><td>${it.description}</td><td style="text-align:center">${it.qty}</td><td style="text-align:right">${formatCurrency(it.rate)}</td><td style="text-align:right">${formatCurrency(it.qty*it.rate)}</td></tr>`).join("");
    const html = `<div class="doc">
      <div class="header"><div><div class="title">Purchase Order</div><div style="font-size:11px;color:#555;margin-top:4px">PO No: ${poNum} &nbsp;|&nbsp; Date: ${date}${delivery?` &nbsp;|&nbsp; Delivery: ${delivery}`:""}</div></div></div>
      <div class="parties">
        <div class="party"><h3>Buyer</h3><p><b>${buyer.name}</b></p><p>${buyer.address}</p></div>
        <div class="party"><h3>Vendor / Supplier</h3><p><b>${vendor.name}</b></p><p>${vendor.address}</p></div>
      </div>
      <table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Total</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="totals"><table style="width:auto;margin-left:auto"><tr><td>Order Total</td><td style="text-align:right;padding-left:40px">${formatCurrency(total)}</td></tr></table></div>
      ${notes?`<div style="margin-top:16px"><b>Terms / Notes:</b> ${notes}</div>`:""}
    </div>`;
    printPage(html, `Purchase Order ${poNum}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <Input value={poNum} onChange={e=>setPoNum(e.target.value)} placeholder="PO number" className="h-9 text-sm" />
        <Input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-9 text-sm" />
        <Input type="date" value={delivery} onChange={e=>setDelivery(e.target.value)} placeholder="Delivery date" className="h-9 text-sm" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[{label:"Buyer",s:buyer,set:setBuyer},{label:"Vendor / Supplier",s:vendor,set:setVendor}].map(p=>(
          <div key={p.label} className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">{p.label}</div>
            <Input value={p.s.name} onChange={e=>p.set({...p.s,name:e.target.value})} placeholder="Company name" className="h-8 text-xs" />
            <Input value={p.s.address} onChange={e=>p.set({...p.s,address:e.target.value})} placeholder="Address" className="h-8 text-xs" />
          </div>
        ))}
      </div>
      <LineItems items={items} onChange={setItems} />
      <Input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Terms and conditions / notes (optional)" className="h-9 text-xs" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">Order Total: {formatCurrency(total)}</span>
        <Button onClick={generate} className="gap-1.5"><Printer className="w-4 h-4" />Print / Save PDF</Button>
      </div>
    </div>
  );
}

// ─── Delivery Challan ─────────────────────────────────────────────────────────

function DeliveryChallan() {
  const [from, setFrom]     = useState({ name:"", address:"", gstin:"" });
  const [to, setTo]         = useState({ name:"", address:"" });
  const [num, setNum]       = useState("DC-001");
  const [date, setDate]     = useState(new Date().toISOString().split("T")[0]);
  const [vehicle, setVehicle] = useState("");
  const [reason, setReason]   = useState("Job Work");
  const [items, setItems]     = useState<LineItem[]>([{ description:"", qty:1, rate:0 }]);

  const reasons = ["Job Work","Branch Transfer","Goods on Approval","Sales Return","Exhibition"];

  const generate = () => {
    const rows = items.map(it=>`<tr><td>${it.description}</td><td style="text-align:center">${it.qty}</td><td style="text-align:right">${formatCurrency(it.rate)}</td><td style="text-align:right">${formatCurrency(it.qty*it.rate)}</td></tr>`).join("");
    const html = `<div class="doc">
      <div class="header"><div><div class="title">Delivery Challan</div><div style="font-size:11px;color:#555;margin-top:4px">No: ${num} &nbsp;|&nbsp; Date: ${date} &nbsp;|&nbsp; Reason: ${reason}${vehicle?` &nbsp;|&nbsp; Vehicle: ${vehicle}`:""}</div></div></div>
      <div class="parties">
        <div class="party"><h3>Consigner (From)</h3><p><b>${from.name}</b></p><p>${from.address}</p>${from.gstin?`<p>GSTIN: ${from.gstin}</p>`:""}</div>
        <div class="party"><h3>Consignee (To)</h3><p><b>${to.name}</b></p><p>${to.address}</p></div>
      </div>
      <table><thead><tr><th>Description of Goods</th><th style="text-align:center">Qty</th><th style="text-align:right">Value</th><th style="text-align:right">Total Value</th></tr></thead><tbody>${rows}</tbody></table>
      <div style="margin-top:24px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
        <div><p style="margin-bottom:40px">Received in good condition</p><div style="border-top:1px solid #333;padding-top:4px;font-size:10px">Consignee Signature &amp; Stamp</div></div>
        <div><div style="border-top:1px solid #333;padding-top:4px;font-size:10px;margin-top:64px">Authorised Signatory for ${from.name||"Consigner"}</div></div>
      </div>
    </div>`;
    printPage(html, `Delivery Challan ${num}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Input value={num} onChange={e=>setNum(e.target.value)} placeholder="Challan number" className="h-9 text-sm" />
        <Input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-9 text-sm" />
        <Input value={vehicle} onChange={e=>setVehicle(e.target.value)} placeholder="Vehicle number (optional)" className="h-9 text-sm" />
        <select value={reason} onChange={e=>setReason(e.target.value)} className="h-9 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none">
          {reasons.map(r=><option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Consigner (From)</div>
          <Input value={from.name} onChange={e=>setFrom(p=>({...p,name:e.target.value}))} placeholder="Name" className="h-8 text-xs" />
          <Input value={from.address} onChange={e=>setFrom(p=>({...p,address:e.target.value}))} placeholder="Address" className="h-8 text-xs" />
          <Input value={from.gstin} onChange={e=>setFrom(p=>({...p,gstin:e.target.value}))} placeholder="GSTIN" className="h-8 text-xs" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Consignee (To)</div>
          <Input value={to.name} onChange={e=>setTo(p=>({...p,name:e.target.value}))} placeholder="Name" className="h-8 text-xs" />
          <Input value={to.address} onChange={e=>setTo(p=>({...p,address:e.target.value}))} placeholder="Address" className="h-8 text-xs" />
        </div>
      </div>
      <LineItems items={items} onChange={setItems} />
      <div className="flex justify-end">
        <Button onClick={generate} className="gap-1.5"><Printer className="w-4 h-4" />Print / Save PDF</Button>
      </div>
    </div>
  );
}

// ─── Expense Tracker ──────────────────────────────────────────────────────────

const EXPENSE_CATS = ["Travel","Food","Utilities","Office Supplies","Software","Marketing","Salaries","Rent","Miscellaneous"];

interface Expense { description: string; category: string; amount: number; date: string; }

function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [desc, setDesc]         = useState("");
  const [cat, setCat]           = useState(EXPENSE_CATS[0]);
  const [amount, setAmount]     = useState<number|"">("");
  const [eDate, setEDate]       = useState(new Date().toISOString().split("T")[0]);

  const add = () => {
    if (!desc.trim() || !amount) return;
    setExpenses(prev=>[...prev,{description:desc.trim(),category:cat,amount:Number(amount),date:eDate}]);
    setDesc(""); setAmount("");
    toast.success("Expense added");
  };

  const del = useCallback((i:number) => setExpenses(prev=>prev.filter((_,j)=>j!==i)), []);

  const byCategory = EXPENSE_CATS.map(c=>({ cat:c, total:expenses.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0) })).filter(c=>c.total>0);
  const grandTotal = expenses.reduce((s,e)=>s+e.amount,0);

  const exportCsv = () => {
    const rows = ["Date,Category,Description,Amount", ...expenses.map(e=>`${e.date},${e.category},"${e.description}",${e.amount}`)];
    const blob = new Blob([rows.join("\n")], {type:"text/csv"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="expenses.csv"; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Input value={desc} onChange={e=>setDesc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Description" className="col-span-2 sm:col-span-1 h-9 text-xs" />
        <select value={cat} onChange={e=>setCat(e.target.value)} className="h-9 rounded-xl border border-border bg-background px-2 text-xs focus:outline-none">
          {EXPENSE_CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <Input type="number" value={amount} onChange={e=>setAmount(e.target.value?Number(e.target.value):"")} placeholder="Amount ₹" className="h-9 text-xs" />
        <Input type="date" value={eDate} onChange={e=>setEDate(e.target.value)} className="h-9 text-xs" />
      </div>
      <Button onClick={add} disabled={!desc.trim()||!amount} className="gap-1.5 w-full sm:w-auto"><Plus className="w-3.5 h-3.5" />Add Expense</Button>

      {expenses.length > 0 && (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border">
              <span className="text-xs font-semibold">{expenses.length} expenses · Total: {formatCurrency(grandTotal)}</span>
              <Button size="sm" variant="ghost" onClick={exportCsv} className="h-6 text-xs gap-1"><Download className="w-3 h-3" />CSV</Button>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {[...expenses].reverse().map((e,ri) => {
                const i = expenses.length-1-ri;
                return (
                  <div key={i} className={cn("flex items-center gap-2 px-4 py-2.5 text-xs", i%2===0?"bg-background":"bg-muted/10")}>
                    <span className="text-muted-foreground w-20 shrink-0">{e.date}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-muted/30 text-[10px] shrink-0">{e.category}</span>
                    <span className="flex-1 truncate">{e.description}</span>
                    <span className="font-semibold">{formatCurrency(e.amount)}</span>
                    <button onClick={()=>del(i)} className="text-muted-foreground hover:text-rose-400 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                );
              })}
            </div>
          </div>

          {byCategory.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {byCategory.map(c=>(
                <div key={c.cat} className="rounded-xl border border-border p-3">
                  <div className="text-[10px] text-muted-foreground">{c.cat}</div>
                  <div className="font-bold text-sm">{formatCurrency(c.total)}</div>
                  <div className="text-[10px] text-muted-foreground">{((c.total/grandTotal)*100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Profit & Loss Calculator ─────────────────────────────────────────────────

interface PLItem { label: string; amount: number; }

function ProfitLossCalculator() {
  const [revItems,  setRevItems]  = useState<PLItem[]>([{ label:"Sales Revenue", amount:0 }]);
  const [cogsItems, setCogsItems] = useState<PLItem[]>([{ label:"Cost of Goods Sold", amount:0 }]);
  const [opexItems, setOpexItems] = useState<PLItem[]>([{ label:"Salaries", amount:0 }, { label:"Rent", amount:0 }, { label:"Marketing", amount:0 }]);
  const [taxRate, setTaxRate]     = useState(25);

  const sum = (items: PLItem[]) => items.reduce((s,it)=>s+Number(it.amount),0);
  const revenue    = sum(revItems);
  const cogs       = sum(cogsItems);
  const grossProfit= revenue - cogs;
  const opex       = sum(opexItems);
  const ebit       = grossProfit - opex;
  const tax        = Math.max(0, ebit * taxRate / 100);
  const netProfit  = ebit - tax;
  const gpm        = revenue ? (grossProfit/revenue*100) : 0;
  const npm        = revenue ? (netProfit/revenue*100) : 0;

  const addItem = (set: React.Dispatch<React.SetStateAction<PLItem[]>>) =>
    set(prev => [...prev, {label:"", amount:0}]);
  const updItem = (set: React.Dispatch<React.SetStateAction<PLItem[]>>, i:number, k:keyof PLItem, v:string|number) =>
    set(prev => prev.map((it,j)=>j===i?{...it,[k]:v}:it));
  const delItem = (set: React.Dispatch<React.SetStateAction<PLItem[]>>, i:number) =>
    set(prev=>prev.filter((_,j)=>j!==i));

  const ItemList = ({ items, set, label }: { items: PLItem[]; set: React.Dispatch<React.SetStateAction<PLItem[]>>; label: string }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
        <Button variant="ghost" size="sm" onClick={()=>addItem(set)} className="h-6 text-xs gap-1"><Plus className="w-3 h-3" />Add</Button>
      </div>
      {items.map((it,i)=>(
        <div key={i} className="flex gap-2 items-center">
          <Input value={it.label} onChange={e=>updItem(set,i,"label",e.target.value)} placeholder="Label" className="flex-1 h-8 text-xs" />
          <Input type="number" value={it.amount} onChange={e=>updItem(set,i,"amount",Number(e.target.value))} placeholder="0" className="w-28 h-8 text-xs text-right" />
          <button onClick={()=>delItem(set,i)} className="text-muted-foreground hover:text-rose-400 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
    </div>
  );

  const PLRow = ({ label, value, highlight, indent }: { label:string; value:number; highlight?:boolean; indent?:boolean }) => (
    <div className={cn("flex justify-between py-2 px-3 text-sm border-b border-border/50 last:border-0", highlight&&"font-bold bg-muted/10", indent&&"pl-6 text-muted-foreground text-xs")}>
      <span>{label}</span>
      <span className={cn(value>=0?"text-emerald-500":"text-rose-500")}>{formatCurrency(value)}</span>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <ItemList items={revItems}  set={setRevItems}  label="Revenue" />
        <ItemList items={cogsItems} set={setCogsItems} label="Cost of Goods Sold" />
        <ItemList items={opexItems} set={setOpexItems} label="Operating Expenses" />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Tax rate %:</span>
        <Input type="number" value={taxRate} onChange={e=>setTaxRate(Number(e.target.value))} className="w-20 h-8 text-xs" />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-3 py-2 bg-muted/20 text-xs font-semibold uppercase tracking-wide">Profit & Loss Statement</div>
        <PLRow label="Total Revenue"          value={revenue} />
        <PLRow label="Cost of Goods Sold"     value={-cogs} indent />
        <PLRow label="Gross Profit"           value={grossProfit} highlight />
        <PLRow label={`Gross Margin ${gpm.toFixed(1)}%`} value={grossProfit} indent />
        <PLRow label="Operating Expenses"     value={-opex} indent />
        <PLRow label="Operating Profit (EBIT)"value={ebit} highlight />
        <PLRow label={`Tax ${taxRate}%`}      value={-tax} indent />
        <PLRow label="Net Profit"             value={netProfit} highlight />
        <PLRow label={`Net Margin ${npm.toFixed(1)}%`} value={netProfit} indent />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"Gross Profit",   val:grossProfit,  icon:TrendingUp },
          { label:"EBIT",           val:ebit,         icon:TrendingUp },
          { label:"Net Profit",     val:netProfit,    icon:netProfit>=0?TrendingUp:TrendingDown },
        ].map(s=>{
          const Icon = s.icon;
          return (
            <div key={s.label} className={cn("rounded-xl border p-3 text-center", s.val>=0?"border-emerald-500/20 bg-emerald-500/5":"border-rose-500/20 bg-rose-500/5")}>
              <Icon className={cn("w-4 h-4 mx-auto mb-1", s.val>=0?"text-emerald-400":"text-rose-400")} />
              <div className={cn("text-base font-bold", s.val>=0?"text-emerald-400":"text-rose-400")}>{formatCurrency(s.val)}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Suite Router ─────────────────────────────────────────────────────────────

const TOOLS: Record<string, { title: string; component: React.ComponentType }> = {
  "proforma-invoice":      { title: "Proforma Invoice Generator", component: ProformaInvoice },
  "purchase-order":        { title: "Purchase Order Generator",   component: PurchaseOrder },
  "delivery-challan":      { title: "Delivery Challan Generator", component: DeliveryChallan },
  "expense-tracker":       { title: "Expense Tracker",            component: ExpenseTracker },
  "profit-loss-calculator":{ title: "Profit & Loss Calculator",   component: ProfitLossCalculator },
};

export function BusinessDocSuite() {
  const pathname = usePathname();
  const slug = pathname.split("/tools/")[1]?.replace(/\/$/, "") ?? "";
  const tool = TOOLS[slug];
  if (!tool) return <div className="p-6 text-muted-foreground text-sm">Tool not found.</div>;
  const Component = tool.component;
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">
        <Component />
      </div>
    </div>
  );
}
