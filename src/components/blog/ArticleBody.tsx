import Link from "next/link";
import type { ContentBlock } from "@/types/blog";
import { AdUnit } from "@/components/ads/AdUnit";

interface Props {
  content: ContentBlock[];
}

export function ArticleBody({ content }: Props) {
  return (
    <div className="space-y-5 text-base leading-relaxed">
      {content.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="text-foreground/90">
                {block.text}
              </p>
            );

          case "h2":
            return (
              <h2
                key={i}
                id={block.text
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-")}
                className="text-xl font-bold text-foreground mt-8 mb-2 scroll-mt-20"
              >
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={i}
                id={block.text
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-")}
                className="text-lg font-semibold text-foreground mt-6 mb-1 scroll-mt-20"
              >
                {block.text}
              </h3>
            );

          case "ul":
            return (
              <ul key={i} className="list-disc list-inside space-y-1.5 text-foreground/90 pl-2">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={i} className="list-decimal list-inside space-y-1.5 text-foreground/90 pl-2">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            );

          case "callout": {
            const styles = {
              tip: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
              warning: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400",
              info: "border-sky-500/30 bg-sky-500/5 text-sky-700 dark:text-sky-400",
              note: "border-border bg-muted text-muted-foreground",
            };
            return (
              <div key={i} className={`rounded-lg border p-4 ${styles[block.variant]}`}>
                {block.heading && (
                  <p className="font-semibold text-sm mb-1">{block.heading}</p>
                )}
                <p className="text-sm">{block.text}</p>
              </div>
            );
          }

          case "cta":
            return (
              <div key={i} className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{block.heading}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{block.text}</p>
                </div>
                <Link
                  href={block.href}
                  className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {block.label}
                </Link>
              </div>
            );

          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-lg border border-border">
                {block.caption && (
                  <p className="text-xs text-muted-foreground px-4 pt-3">{block.caption}</p>
                )}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {block.headers.map((h, j) => (
                        <th key={j} className="px-4 py-2.5 text-left font-semibold text-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        {row.map((cell, k) => (
                          <td key={k} className="px-4 py-2.5 text-foreground/90">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "ad":
            return (
              <AdUnit
                key={i}
                slot={block.slot}
                format="auto"
                responsive
                minHeight={100}
                className="my-2"
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
