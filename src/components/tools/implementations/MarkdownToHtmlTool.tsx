"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Eye, Code2 } from "lucide-react";
import { toast } from "sonner";

const SAMPLE = `# Hello World

This is **bold**, *italic*, and \`inline code\`.

## Features
- Item one
- Item two
- Item three

> A blockquote with *emphasis*

\`\`\`js
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

[Visit Google](https://google.com)
`;

function simpleMarkdown(md: string): string {
  let h = md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^#{6}\s(.+)$/gm, "<h6>$1</h6>")
    .replace(/^#{5}\s(.+)$/gm, "<h5>$1</h5>")
    .replace(/^#{4}\s(.+)$/gm, "<h4>$1</h4>")
    .replace(/^#{3}\s(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s(.+)$/gm, "<h1>$1</h1>")
    .replace(/```(\w*)\n([\s\S]*?)```/gm, (_, lang, code) => `<pre><code class="language-${lang}">${code.trim()}</code></pre>`)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^---$/gm, "<hr>")
    .replace(/^&gt;\s(.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[\*\-]\s(.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>");

  // Wrap consecutive <li> in <ul>
  h = h.replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>\n${m}</ul>\n`);

  // Wrap non-tag lines in <p>
  h = h.split("\n").map(line => {
    const t = line.trim();
    if (!t) return "";
    if (/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|img)/.test(t)) return line;
    return `<p>${t}</p>`;
  }).join("\n");

  return h;
}

export function MarkdownToHtmlTool() {
  const [input, setInput] = useState(SAMPLE);
  const [html, setHtml] = useState("");
  const [view, setView] = useState<"code" | "preview">("code");

  useEffect(() => { setHtml(simpleMarkdown(input)); }, [input]);

  const copy = () => { navigator.clipboard.writeText(html); toast.success("HTML copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Markdown to HTML</span>
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button onClick={() => setView("code")}
            className={`px-3 py-1 text-xs font-medium transition-all ${view==="code"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
            HTML
          </button>
          <button onClick={() => setView("preview")}
            className={`px-3 py-1 text-xs font-medium transition-all ${view==="preview"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
            Preview
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Markdown</span>
              <Button size="sm" variant="ghost" onClick={() => setInput("")} className="h-6 text-xs">Clear</Button>
            </div>
            <Textarea value={input} onChange={e => setInput(e.target.value)}
              className="min-h-[400px] resize-none text-sm font-mono" placeholder="Type Markdown here…" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Output</span>
              <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1">
                <Copy className="w-3 h-3" />Copy HTML
              </Button>
            </div>
            {view === "code" ? (
              <Textarea readOnly value={html} className="min-h-[400px] resize-none text-xs font-mono bg-muted/20" />
            ) : (
              <div
                className="min-h-[400px] p-4 rounded-xl border border-border bg-background overflow-auto prose prose-sm dark:prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
