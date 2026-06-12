"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// Simple XML→JSON parser
function xmlToJson(xml: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml.trim(), "text/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid XML");
  function nodeToObj(node: Element): unknown {
    const attrs: Record<string, string> = {};
    for (const a of Array.from(node.attributes)) attrs[`@${a.name}`] = a.value;
    const children: Record<string, unknown[] | unknown> = {};
    let hasChildren = false;
    for (const child of Array.from(node.children)) {
      hasChildren = true;
      const val = nodeToObj(child);
      if (child.tagName in children) {
        if (!Array.isArray(children[child.tagName])) children[child.tagName] = [children[child.tagName]];
        (children[child.tagName] as unknown[]).push(val);
      } else { children[child.tagName] = val; }
    }
    if (!hasChildren) {
      const text = node.textContent ?? "";
      if (Object.keys(attrs).length) return { ...attrs, "#text": text };
      return text;
    }
    return { ...attrs, ...children };
  }
  return { [doc.documentElement.tagName]: nodeToObj(doc.documentElement) };
}

// Simple JSON→XML serializer
function jsonToXml(obj: unknown, tag = "root", indent = 0): string {
  const pad = "  ".repeat(indent);
  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    const attrs = Object.entries(obj as Record<string,unknown>).filter(([k]) => k.startsWith("@")).map(([k,v]) => ` ${k.slice(1)}="${v}"`).join("");
    const children = Object.entries(obj as Record<string,unknown>).filter(([k]) => !k.startsWith("@") && k !== "#text");
    const text = (obj as Record<string,unknown>)["#text"] as string | undefined;
    if (!children.length) return `${pad}<${tag}${attrs}>${text ?? ""}</${tag}>`;
    const inner = children.map(([k,v]) => Array.isArray(v) ? v.map(i => jsonToXml(i, k, indent+1)).join("\n") : jsonToXml(v, k, indent+1)).join("\n");
    return `${pad}<${tag}${attrs}>\n${inner}\n${pad}</${tag}>`;
  }
  if (Array.isArray(obj)) return obj.map(i => jsonToXml(i, tag, indent)).join("\n");
  return `${pad}<${tag}>${String(obj ?? "")}</${tag}>`;
}

export function XmlJsonConverterTool() {
  const pathname = usePathname();
  const isXmlToJson = pathname?.includes("xml-to-json") ?? true;

  const [input, setInput] = useState(isXmlToJson
    ? `<?xml version="1.0"?>\n<person age="30">\n  <name>Alice</name>\n  <city>New York</city>\n</person>`
    : `{\n  "person": {\n    "@age": "30",\n    "name": "Alice",\n    "city": "New York"\n  }\n}`
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      if (isXmlToJson) {
        setOutput(JSON.stringify(xmlToJson(input), null, 2));
      } else {
        const obj = JSON.parse(input);
        const [rootTag, rootVal] = Object.entries(obj)[0] ?? ["root", obj];
        setOutput(`<?xml version="1.0" encoding="UTF-8"?>\n` + jsonToXml(rootVal, rootTag));
      }
    } catch (e) { setError((e as Error).message); }
  };

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <ArrowRight className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{isXmlToJson ? "XML to JSON" : "JSON to XML"} Converter</span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{isXmlToJson ? "XML" : "JSON"} Input</label>
            <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[280px] resize-none text-xs font-mono" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">{isXmlToJson ? "JSON" : "XML"} Output</label>
              {output && <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>}
            </div>
            {error ? (
              <div className="min-h-[280px] p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-500 font-mono">{error}</div>
            ) : (
              <Textarea readOnly value={output} className="min-h-[280px] resize-none text-xs font-mono bg-muted/10" placeholder="Output will appear here…" />
            )}
          </div>
        </div>
        <Button onClick={convert} className="w-full mt-4 gap-2">
          <ArrowRight className="w-4 h-4" />Convert {isXmlToJson ? "XML → JSON" : "JSON → XML"}
        </Button>
      </div>
    </div>
  );
}
