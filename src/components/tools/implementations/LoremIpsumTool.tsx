"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSentence(wordCount = 10): string {
  const words = Array.from({ length: wordCount }, (_, i) =>
    LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
  );
  return capitalize(words.join(" ")) + ".";
}

function generateParagraph(sentenceCount = 4): string {
  return Array.from({ length: sentenceCount }, () =>
    generateSentence(Math.floor(Math.random() * 6) + 8)
  ).join(" ");
}

type OutputType = "paragraphs" | "sentences" | "words";

export function LoremIpsumTool() {
  const [type, setType] = useState<OutputType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = "";
    if (type === "paragraphs") {
      const paragraphs = Array.from({ length: count }, (_, i) =>
        i === 0 && startWithLorem
          ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + generateParagraph(3)
          : generateParagraph()
      );
      result = paragraphs.join("\n\n");
    } else if (type === "sentences") {
      const sentences = Array.from({ length: count }, (_, i) =>
        i === 0 && startWithLorem
          ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          : generateSentence()
      );
      result = sentences.join(" ");
    } else {
      const words = Array.from({ length: count }, (_, i) =>
        i === 0 && startWithLorem ? "lorem" : LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
      );
      result = words.join(" ");
    }
    setOutput(result);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">Lorem Ipsum Generator</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Controls */}
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
              Generate
            </label>
            <div className="flex bg-muted rounded-lg p-0.5 gap-0.5">
              {(["paragraphs", "sentences", "words"] as OutputType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                    type === t
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
              Count
            </label>
            <div className="flex gap-1">
              {[1, 3, 5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                    count === n
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="accent-primary"
            />
            Start with &ldquo;Lorem ipsum&rdquo;
          </label>

          <Button onClick={generate} className="gap-2 ml-auto">
            <RefreshCw className="w-4 h-4" />
            Generate
          </Button>
        </div>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Generated Text
              </span>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-muted hover:bg-accent transition-all"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-sm leading-relaxed max-h-[400px] overflow-y-auto whitespace-pre-wrap text-foreground">
              {output}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {output.split(/\s+/).length} words · {output.length} characters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
