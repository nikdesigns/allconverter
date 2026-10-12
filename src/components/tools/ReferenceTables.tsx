import { getReferenceTables } from "@/lib/reference-tables";

/** Static conversion tables for converter tools (rendered into the page HTML). */
export function ReferenceTables({ slug }: { slug: string }) {
  const tables = getReferenceTables(slug);
  if (!tables.length) return null;
  return (
    <div className="space-y-8">
      {tables.map((t) => (
        <section key={t.title}>
          <h2 className="text-xl font-semibold mb-2">{t.title}</h2>
          {t.caption && <p className="text-sm text-muted-foreground mb-3">{t.caption}</p>}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  {t.headers.map((h) => (
                    <th key={h} scope="col" className="px-4 py-2 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {row.map((cell, j) => (
                      j === 0
                        ? <th key={j} scope="row" className="px-4 py-2 text-left font-medium tabular-nums">{cell}</th>
                        : <td key={j} className="px-4 py-2 tabular-nums text-muted-foreground">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
