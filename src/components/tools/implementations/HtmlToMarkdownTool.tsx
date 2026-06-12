"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, FileCode2 } from "lucide-react";
import { toast } from "sonner";

function htmlToMd(html: string): string {
  return html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n")
    .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n##### $1\n")
    .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n###### $1\n")
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*")
    .replace(/<del[^>]*>([\s\S]*?)<\/del>/gi, "~~$1~~")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n")
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, m => m.replace(/<[^>]+>/g,"").split("\n").map(l => `> ${l}`).join("\n"))
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)")
    .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, "![$1]($2)")
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, m => m.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1") + "\n")
    .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, m => { let c=0; return m.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, () => `\n${++c}. $1`) + "\n"; })
    .replace(/<hr[^>]*\/?>/gi, "\n---\n")
    .replace(/<br[^>]*\/?>/gi, "\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n").trim();
}

const SAMPLE = `<h1>Hello World</h1>
<p>This is a <strong>bold</strong> and <em>italic</em> paragraph with a <a href="https://example.com">link</a>.</p>
<h2>Features</h2>
<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>
<blockquote><p>A great quote</p></blockquote>
<pre><code>const hello = "world";</code></pre>`;

export function HtmlToMarkdownTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");

  useEffect(() => { setOutput(htmlToMd(input)); }, [input]);

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Markdown copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <FileCode2 className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">HTML to Markdown</span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">HTML Input</label>
            <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[320px] resize-none text-xs font-mono" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">Markdown Output</label>
              <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
            </div>
            <Textarea readOnly value={output} className="min-h-[320px] resize-none text-xs font-mono bg-muted/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
