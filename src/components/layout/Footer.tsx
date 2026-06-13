import Link from "next/link";
import { Zap, X, Heart, Code2 } from "lucide-react";
import { categories } from "@/lib/categories";
import { getPopularTools } from "@/lib/tools-data";

const popularTools = getPopularTools(8);

const companyLinks = [
  { href: "/about/", label: "About" },
  { href: "/blog/", label: "Blog" },
  { href: "/changelog/", label: "Changelog" },
  { href: "/contact/", label: "Contact" },
  { href: "/sitemap/", label: "Sitemap" },
];

const legalLinks = [
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms of Service" },
  { href: "/cookies/", label: "Cookie Policy" },
  { href: "/disclaimer/", label: "Disclaimer" },
  { href: "/security/", label: "Security" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--neutral-primary-soft)]">
      {/* Main footer grid */}
      <div className="container-xl py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-[var(--radius-default)] bg-[var(--brand)] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white fill-current" />
              </div>
              <span className="font-bold text-base text-[var(--heading)]">
                AllConverter<span className="text-[var(--fg-brand)] font-light">.tools</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--body-subtle)] leading-relaxed mb-4 max-w-[220px]">
              Convert Anything. All in One Place. 100+ free online tools — no sign-up required.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com/allconvertertools"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-[var(--radius-default)] border border-[var(--border-default)] flex items-center justify-center hover:bg-[var(--neutral-secondary-medium)] hover:text-[var(--fg-brand)] transition-colors"
                aria-label="Follow on Twitter"
              >
                <X className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/allconvertertools"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-[var(--radius-default)] border border-[var(--border-default)] flex items-center justify-center hover:bg-[var(--neutral-secondary-medium)] hover:text-[var(--fg-brand)] transition-colors"
                aria-label="View on GitHub"
              >
                <Code2 className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Tools categories */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Tool Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}/`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More categories */}
          <div>
            <h3 className="text-sm font-semibold mb-3">More Tools</h3>
            <ul className="space-y-2">
              {categories.slice(5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}/`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular tools */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Popular Tools</h3>
            <ul className="space-y-2">
              {popularTools.slice(0, 6).map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}/`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-xl py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AllConverter.tools. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for the web
          </p>
        </div>
      </div>
    </footer>
  );
}
