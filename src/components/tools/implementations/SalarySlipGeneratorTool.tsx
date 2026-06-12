"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EarningRow { id: number; label: string; amount: string; }
interface DeductionRow { id: number; label: string; amount: string; }
let nextEId = 5, nextDId = 4;

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS  = Array.from({ length: 6 }, (_, i) => String(2020 + i));

const COLORS = ["#0d9488","#3b82f6","#6366f1","#059669","#f97316","#e11d48"];

export function SalarySlipGeneratorTool() {
  const [company, setCompany] = useState({ name: "Acme Corp Pvt Ltd", address: "123 Corporate Park, Mumbai 400001", logo: "" });
  const [employee, setEmployee] = useState({ name: "Rajesh Kumar", id: "EMP-001", designation: "Software Engineer", department: "Engineering", bank: "HDFC Bank", accountNo: "XXXXXXXX1234", pan: "ABCDE1234F", pfNo: "" });
  const [period, setPeriod] = useState({ month: MONTHS[new Date().getMonth()], year: String(new Date().getFullYear()) });
  const [workingDays, setWorkingDays] = useState("26");
  const [presentDays, setPresentDays] = useState("26");
  const [earnings, setEarnings] = useState<EarningRow[]>([
    { id: 1, label: "Basic Salary", amount: "50000" },
    { id: 2, label: "HRA", amount: "20000" },
    { id: 3, label: "Conveyance", amount: "1600" },
    { id: 4, label: "Other Allowances", amount: "3000" },
  ]);
  const [deductions, setDeductions] = useState<DeductionRow[]>([
    { id: 1, label: "Provident Fund", amount: "6000" },
    { id: 2, label: "Professional Tax", amount: "200" },
    { id: 3, label: "TDS", amount: "2000" },
  ]);
  const [themeAccent, setThemeAccent] = useState("#0d9488");
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalEarnings  = earnings.reduce((s, e) => s + (parseFloat(e.amount)||0), 0);
  const totalDeductions = deductions.reduce((s, d) => s + (parseFloat(d.amount)||0), 0);
  const netPay = totalEarnings - totalDeductions;
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const inWords = (n: number): string => {
    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    if (n <= 0) return "Zero";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10?" "+ones[n%10]:"");
    if (n < 1000) return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+inWords(n%100):"");
    if (n < 100000) return inWords(Math.floor(n/1000))+" Thousand"+(n%1000?" "+inWords(n%1000):"");
    if (n < 10000000) return inWords(Math.floor(n/100000))+" Lakh"+(n%100000?" "+inWords(n%100000):"");
    return inWords(Math.floor(n/10000000))+" Crore"+(n%10000000?" "+inWords(n%10000000):"");
  };

  const buildHTML = () => `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Salary Slip ${period.month} ${period.year}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;color:#18181b;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:760px;margin:24px auto;background:#fff;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.1);overflow:hidden}
.header{background:${themeAccent};padding:22px 28px;color:#fff;display:flex;justify-content:space-between;align-items:flex-start}
.co-name{font-size:18px;font-weight:800}
.co-addr{font-size:10px;opacity:.8;margin-top:4px}
.slip-title{text-align:right}
.title{font-size:16px;font-weight:900;letter-spacing:.05em}
.period{font-size:11px;opacity:.8;margin-top:3px}
.emp-section{padding:20px 28px;display:grid;grid-template-columns:1fr 1fr;gap:8px;border-bottom:1px solid #e4e4e7;background:#fafafa}
.field{display:flex;gap:6px;align-items:baseline}
.fl{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#a1a1aa;font-weight:600;min-width:90px}
.fv{font-size:12px;font-weight:600;color:#27272a}
.main{padding:20px 28px}
.tables{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.tbl-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;padding:8px 12px;border-radius:6px 6px 0 0;color:#fff}
.earn-title{background:${themeAccent}}
.ded-title{background:#ef4444}
table{width:100%;border-collapse:collapse}
td{padding:8px 12px;font-size:12px;border-bottom:1px solid #f4f4f5}
td:last-child{text-align:right;font-family:monospace;font-weight:600}
.total-row td{font-weight:700;background:${themeAccent}12;border-top:1px solid ${themeAccent}30}
.net-box{margin-top:16px;background:${themeAccent};color:#fff;border-radius:8px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center}
.net-lbl{font-size:12px;font-weight:700;opacity:.9}
.net-amt{font-size:22px;font-weight:900;font-family:monospace}
.net-words{font-size:10px;opacity:.8;margin-top:3px}
.footer{margin-top:20px;padding-top:16px;border-top:1px solid #e4e4e7;display:flex;justify-content:space-between}
.sig-box{text-align:center}
.sig-line{border-top:1px solid #d4d4d8;padding-top:6px;font-size:10px;color:#a1a1aa;margin-top:32px}
@media print{body{background:#fff}.page{box-shadow:none;margin:0;border-radius:0;max-width:100%}}
</style></head><body>
<div class="page">
  <div class="header">
    <div><div class="co-name">${company.name}</div><div class="co-addr">${company.address}</div></div>
    <div class="slip-title"><div class="title">SALARY SLIP</div><div class="period">${period.month} ${period.year}</div></div>
  </div>
  <div class="emp-section">
    <div class="field"><span class="fl">Employee Name</span><span class="fv">${employee.name}</span></div>
    <div class="field"><span class="fl">Employee ID</span><span class="fv">${employee.id}</span></div>
    <div class="field"><span class="fl">Designation</span><span class="fv">${employee.designation}</span></div>
    <div class="field"><span class="fl">Department</span><span class="fv">${employee.department}</span></div>
    <div class="field"><span class="fl">Bank / A/C</span><span class="fv">${employee.bank} / ${employee.accountNo}</span></div>
    <div class="field"><span class="fl">PAN</span><span class="fv">${employee.pan}</span></div>
    <div class="field"><span class="fl">Working Days</span><span class="fv">${workingDays}</span></div>
    <div class="field"><span class="fl">Present Days</span><span class="fv">${presentDays}</span></div>
    ${employee.pfNo?`<div class="field"><span class="fl">PF No.</span><span class="fv">${employee.pfNo}</span></div>`:""}
  </div>
  <div class="main">
    <div class="tables">
      <div>
        <div class="earn-title tbl-title">Earnings</div>
        <table><tbody>
          ${earnings.map(e => `<tr><td>${e.label}</td><td>${fmt(parseFloat(e.amount)||0)}</td></tr>`).join("")}
          <tr class="total-row"><td>Total Earnings</td><td>${fmt(totalEarnings)}</td></tr>
        </tbody></table>
      </div>
      <div>
        <div class="ded-title tbl-title">Deductions</div>
        <table><tbody>
          ${deductions.map(d => `<tr><td>${d.label}</td><td>${fmt(parseFloat(d.amount)||0)}</td></tr>`).join("")}
          <tr class="total-row"><td>Total Deductions</td><td>${fmt(totalDeductions)}</td></tr>
        </tbody></table>
      </div>
    </div>
    <div class="net-box">
      <div><div class="net-lbl">Net Pay</div><div class="net-words">${inWords(Math.round(netPay))} Rupees Only</div></div>
      <div class="net-amt">${fmt(netPay)}</div>
    </div>
    <div class="footer">
      <div class="sig-box"><div class="sig-line">Employee Signature</div></div>
      <div style="width:40px"></div>
      <div class="sig-box"><div class="sig-line">Authorized Signatory</div></div>
    </div>
    <p style="margin-top:12px;font-size:9px;color:#a1a1aa;text-align:center">This is a computer-generated salary slip. Generated with AllConverter.tools</p>
  </div>
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
  }, [showPreview, company, employee, period, workingDays, presentDays, earnings, deductions, themeAccent]);

  const print = () => { const w = window.open("","_blank")!; w.document.write(buildHTML()); w.document.close(); setTimeout(() => w.print(), 300); };

  const addEarning    = () => setEarnings(p => [...p, { id: nextEId++, label: "", amount: "" }]);
  const removeEarning = (id: number) => setEarnings(p => p.filter(e => e.id !== id));
  const updEarning    = (id: number, k: "label"|"amount", v: string) => setEarnings(p => p.map(e => e.id===id?{...e,[k]:v}:e));

  const addDed    = () => setDeductions(p => [...p, { id: nextDId++, label: "", amount: "" }]);
  const removeDed = (id: number) => setDeductions(p => p.filter(d => d.id !== id));
  const updDed    = (id: number, k: "label"|"amount", v: string) => setDeductions(p => p.map(d => d.id===id?{...d,[k]:v}:d));

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Salary Slip Generator</span></div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowPreview(v => !v)} className="h-7 text-xs gap-1.5">
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}{showPreview?"Hide":"Preview"}
          </Button>
          <Button size="sm" onClick={print} className="h-7 text-xs gap-1.5"><Download className="w-3.5 h-3.5" />Print / PDF</Button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Color */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-muted-foreground">Color</label>
          {COLORS.map(c => <button key={c} onClick={() => setThemeAccent(c)} className={cn("w-6 h-6 rounded-full border-2 transition-all", themeAccent===c?"border-foreground scale-110":"border-transparent")} style={{ backgroundColor: c }} />)}
        </div>

        {/* Company */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company</p>
          <div className="grid grid-cols-2 gap-2">
            <Input value={company.name} onChange={e => setCompany(p=>({...p,name:e.target.value}))} placeholder="Company name" className="text-sm" />
            <Input value={company.address} onChange={e => setCompany(p=>({...p,address:e.target.value}))} placeholder="Address" className="text-sm" />
          </div>
        </div>

        {/* Period */}
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium text-muted-foreground shrink-0">Pay Period</p>
          <select value={period.month} onChange={e => setPeriod(p=>({...p,month:e.target.value}))} className="h-10 px-3 rounded-xl border border-input bg-background text-sm">
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={period.year} onChange={e => setPeriod(p=>({...p,year:e.target.value}))} className="h-10 px-3 rounded-xl border border-input bg-background text-sm">
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-xs text-muted-foreground">Working Days</label>
            <Input type="number" value={workingDays} onChange={e => setWorkingDays(e.target.value)} className="w-16 text-sm text-center" />
            <label className="text-xs text-muted-foreground">Present</label>
            <Input type="number" value={presentDays} onChange={e => setPresentDays(e.target.value)} className="w-16 text-sm text-center" />
          </div>
        </div>

        {/* Employee */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employee</p>
          <div className="grid grid-cols-2 gap-2">
            <Input value={employee.name} onChange={e => setEmployee(p=>({...p,name:e.target.value}))} placeholder="Full name" className="text-sm" />
            <Input value={employee.id} onChange={e => setEmployee(p=>({...p,id:e.target.value}))} placeholder="Employee ID" className="text-sm font-mono" />
            <Input value={employee.designation} onChange={e => setEmployee(p=>({...p,designation:e.target.value}))} placeholder="Designation" className="text-sm" />
            <Input value={employee.department} onChange={e => setEmployee(p=>({...p,department:e.target.value}))} placeholder="Department" className="text-sm" />
            <Input value={employee.bank} onChange={e => setEmployee(p=>({...p,bank:e.target.value}))} placeholder="Bank name" className="text-sm" />
            <Input value={employee.accountNo} onChange={e => setEmployee(p=>({...p,accountNo:e.target.value}))} placeholder="Account number" className="text-sm font-mono" />
            <Input value={employee.pan} onChange={e => setEmployee(p=>({...p,pan:e.target.value}))} placeholder="PAN" className="text-sm font-mono uppercase" />
            <Input value={employee.pfNo} onChange={e => setEmployee(p=>({...p,pfNo:e.target.value}))} placeholder="PF number (optional)" className="text-sm font-mono" />
          </div>
        </div>

        {/* Earnings + Deductions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Earnings</p>
            <div className="space-y-1.5">
              {earnings.map(e => (
                <div key={e.id} className="grid grid-cols-[1fr_88px_24px] gap-1.5 items-center">
                  <Input value={e.label} onChange={ev => updEarning(e.id,"label",ev.target.value)} placeholder="Component" className="text-xs" />
                  <Input type="number" value={e.amount} onChange={ev => updEarning(e.id,"amount",ev.target.value)} placeholder="0" className="text-xs font-mono" min="0" />
                  <button onClick={() => removeEarning(e.id)} disabled={earnings.length===1} className="p-0.5 hover:text-destructive text-muted-foreground disabled:opacity-25"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addEarning} className="mt-2 w-full h-7 text-xs gap-1"><Plus className="w-3 h-3" />Add</Button>
            <div className="flex justify-between px-1 pt-2 text-sm font-bold border-t border-border mt-2"><span>Total Earnings</span><span className="font-mono">{fmt(totalEarnings)}</span></div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Deductions</p>
            <div className="space-y-1.5">
              {deductions.map(d => (
                <div key={d.id} className="grid grid-cols-[1fr_88px_24px] gap-1.5 items-center">
                  <Input value={d.label} onChange={ev => updDed(d.id,"label",ev.target.value)} placeholder="Component" className="text-xs" />
                  <Input type="number" value={d.amount} onChange={ev => updDed(d.id,"amount",ev.target.value)} placeholder="0" className="text-xs font-mono" min="0" />
                  <button onClick={() => removeDed(d.id)} className="p-0.5 hover:text-destructive text-muted-foreground"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addDed} className="mt-2 w-full h-7 text-xs gap-1"><Plus className="w-3 h-3" />Add</Button>
            <div className="flex justify-between px-1 pt-2 text-sm font-bold border-t border-border mt-2"><span>Total Deductions</span><span className="font-mono text-red-500">-{fmt(totalDeductions)}</span></div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="flex items-center justify-between p-4 rounded-xl text-white" style={{ background: themeAccent }}>
          <div><p className="text-xs font-medium opacity-80">Net Pay ({period.month} {period.year})</p><p className="text-xs opacity-70 mt-0.5">{inWords(Math.round(netPay))} Rupees Only</p></div>
          <p className="text-2xl font-black font-mono">{fmt(netPay)}</p>
        </div>

        {showPreview && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Live Preview</p>
            <div className="rounded-xl border border-border overflow-hidden" style={{ height: 540 }}>
              <iframe ref={iframeRef} className="w-full h-full" title="Salary Slip Preview" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
