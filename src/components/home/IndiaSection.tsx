import Link from "next/link";
import {
  ReceiptText, QrCode, CreditCard, Smartphone,
  BadgeIndianRupee, FileText, ArrowRight, ExternalLink,
} from "lucide-react";

const indiaTools = [
  {
    slug: "gst-invoice-generator",
    name: "GST Invoice Generator",
    tagline: "CGST / SGST / IGST — print-ready",
    icon: ReceiptText,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    slug: "upi-qr-generator",
    name: "UPI QR Code Generator",
    tagline: "GPay, PhonePe, Paytm & all UPI apps",
    icon: QrCode,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    slug: "loan-calculator",
    name: "Loan EMI Calculator",
    tagline: "Home, car & personal loan EMI",
    icon: CreditCard,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC to JPG",
    tagline: "Convert iPhone photos instantly",
    icon: Smartphone,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    slug: "ctc-to-inhand-calculator",
    name: "CTC to In-Hand Calculator",
    tagline: "Annual CTC → monthly take-home",
    icon: BadgeIndianRupee,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    slug: "salary-slip-generator",
    name: "Salary Slip Generator",
    tagline: "PF, PT, TDS — print-ready PDF",
    icon: FileText,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

export function IndiaSection() {
  return (
    <section className="py-14 lg:py-20 border-t border-(--border-default)">
      <div className="container-xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg leading-none">🇮🇳</span>
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
                Popular in India
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--heading)">
              Built for Indian users
            </h2>
            <p className="text-(--body-subtle) text-sm mt-1 max-w-lg">
              GST invoices, UPI payments, salary slips, and more — tools designed for Indian businesses and professionals.
            </p>
          </div>
          <Link
            href="/business-tools/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-brand hover:underline shrink-0"
          >
            All business tools
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {indiaTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}/`}
                className="group flex flex-col gap-2.5 rounded-xl border border-(--border-default) bg-(--neutral-primary-soft) p-4 hover:border-(--border-brand) hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tool.bg}`}>
                  <Icon className={`w-4.5 h-4.5 ${tool.color}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-(--heading) leading-snug group-hover:text-fg-brand transition-colors">
                    {tool.name}
                  </p>
                  <p className="text-[10px] text-(--body-subtle) mt-0.5 leading-snug">
                    {tool.tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Fincado cross-promo */}
        <div className="rounded-xl border border-(--border-brand-subtle) bg-(--brand-soft) p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <BadgeIndianRupee className="w-5 h-5 text-fg-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-(--heading)">
              Need advanced financial calculators?
            </p>
            <p className="text-xs text-(--body-subtle) mt-0.5">
              Visit our sister site <strong>Fincado.com</strong> for SIP returns, mutual fund comparisons, tax planning tools, and in-depth financial analysis.
            </p>
          </div>
          <a
            href="https://fincado.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-brand border border-(--border-brand-subtle) rounded-lg px-3 py-1.5 hover:bg-(--brand-soft-strong) transition-colors shrink-0 whitespace-nowrap"
          >
            Visit Fincado.com
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </section>
  );
}
