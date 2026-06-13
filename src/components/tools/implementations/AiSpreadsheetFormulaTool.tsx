"use client";

import { useState } from "react";
import { Sparkles, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FormulaResult {
  excel: string;
  sheets: string;
  explanation: string;
  example: string;
}

const EXAMPLES = [
  "Sum sales where region is North",
  "Count rows where status is Pending",
  "Average salary by department",
  "Find price using product ID from another sheet",
  "If sales > 10000 show Bonus else None",
  "Combine first name and last name",
  "Count unique values in column A",
  "Date difference between two dates in days",
  "Extract first 5 characters from a cell",
  "Remove extra spaces from text",
  "Calculate percentage of total",
  "Find maximum value where category matches",
  "Sum top 5 values in a range",
  "Convert text to UPPERCASE",
  "Split full name into first and last name",
];

function matchFormula(query: string): FormulaResult | null {
  const q = query.toLowerCase();

  // SUMIF / SUMIFS
  if ((q.includes("sum") || q.includes("total")) && (q.includes("where") || q.includes("if") || q.includes("when") || q.includes("only") || q.includes("by") || q.includes("for"))) {
    if (q.includes("multiple") || q.includes("and") || q.includes("two condition") || q.includes("criteria")) {
      return {
        excel: `=SUMIFS(D:D, A:A, "Criteria1", B:B, "Criteria2")`,
        sheets: `=SUMIFS(D:D, A:A, "Criteria1", B:B, "Criteria2")`,
        explanation: "SUMIFS sums values in column D where column A matches Criteria1 AND column B matches Criteria2. Add more range/criteria pairs as needed.",
        example: `=SUMIFS(D:D, A:A, "North", B:B, "Q1")  → Sum column D where Region=North AND Quarter=Q1`
      };
    }
    return {
      excel: `=SUMIF(A:A, "Criteria", B:B)`,
      sheets: `=SUMIF(A:A, "Criteria", B:B)`,
      explanation: "SUMIF sums values in column B where column A matches your criteria. Replace 'Criteria' with your condition (e.g., \"North\", \">1000\", or a cell reference like C1).",
      example: `=SUMIF(A:A, "North", B:B)  → Sum column B where column A equals "North"`
    };
  }

  // COUNTIF / COUNTIFS
  if ((q.includes("count") || q.includes("how many")) && (q.includes("where") || q.includes("if") || q.includes("when") || q.includes("with") || q.includes("that"))) {
    return {
      excel: `=COUNTIF(A:A, "Criteria")`,
      sheets: `=COUNTIF(A:A, "Criteria")`,
      explanation: "COUNTIF counts rows in column A that match your criteria. Use COUNTIFS for multiple conditions.",
      example: `=COUNTIF(A:A, "Pending")  → Count rows where column A equals "Pending"`
    };
  }

  // COUNTA / COUNT non-blank
  if (q.includes("count") && (q.includes("non-empty") || q.includes("non empty") || q.includes("not blank") || q.includes("filled") || q.includes("all"))) {
    return {
      excel: `=COUNTA(A:A)`,
      sheets: `=COUNTA(A:A)`,
      explanation: "COUNTA counts all non-empty cells in the range. Use COUNT for numeric cells only.",
      example: `=COUNTA(A2:A100)  → Count all non-empty rows in A2:A100`
    };
  }

  // AVERAGEIF
  if (q.includes("average") && (q.includes("where") || q.includes("if") || q.includes("by") || q.includes("for") || q.includes("per"))) {
    return {
      excel: `=AVERAGEIF(A:A, "Criteria", B:B)`,
      sheets: `=AVERAGEIF(A:A, "Criteria", B:B)`,
      explanation: "AVERAGEIF computes the average of column B where column A matches your criteria.",
      example: `=AVERAGEIF(A:A, "Engineering", B:B)  → Average salary for Engineering department`
    };
  }

  // VLOOKUP / XLOOKUP
  if (q.includes("lookup") || q.includes("find") || q.includes("search") || q.includes("match") || q.includes("retrieve") || q.includes("get value")) {
    return {
      excel: `=IFERROR(VLOOKUP(A2, Sheet2!A:C, 2, FALSE), "Not found")`,
      sheets: `=IFERROR(VLOOKUP(A2, Sheet2!A:C, 2, FALSE), "Not found")`,
      explanation: "VLOOKUP finds A2's value in the first column of Sheet2!A:C and returns the value from column 2. The FALSE means exact match. IFERROR handles missing values gracefully.",
      example: `=IFERROR(VLOOKUP(A2, Products!A:C, 3, FALSE), "N/A")  → Get price from Products sheet using product ID in A2`
    };
  }

  // INDEX MATCH
  if (q.includes("index") || q.includes("index match") || q.includes("two-way") || q.includes("two way")) {
    return {
      excel: `=INDEX(C:C, MATCH(A2, B:B, 0))`,
      sheets: `=INDEX(C:C, MATCH(A2, B:B, 0))`,
      explanation: "INDEX-MATCH is more flexible than VLOOKUP — it can look left and handles column insertions. MATCH(A2, B:B, 0) finds the position; INDEX(C:C,...) returns the value at that position.",
      example: `=INDEX(D:D, MATCH("Product A", A:A, 0))  → Return the price from D where A matches "Product A"`
    };
  }

  // IF / IFS
  if ((q.includes(" if ") || q.includes("if ") || q.includes("condition") || q.includes("when") || q.includes("else") || q.includes("then")) && !q.includes("sumif") && !q.includes("countif") && !q.includes("averageif")) {
    if (q.includes("multiple") || q.includes("nested") || q.includes("several")) {
      return {
        excel: `=IFS(A2>10000,"High", A2>5000,"Medium", A2>0,"Low", TRUE,"Unknown")`,
        sheets: `=IFS(A2>10000,"High", A2>5000,"Medium", A2>0,"Low", TRUE,"Unknown")`,
        explanation: "IFS evaluates multiple conditions in order and returns the first matching result. The final TRUE,'Unknown' acts as the default/else clause.",
        example: `=IFS(B2>90,"A", B2>80,"B", B2>70,"C", TRUE,"F")  → Grade based on score`
      };
    }
    return {
      excel: `=IF(A2>1000, "Yes", "No")`,
      sheets: `=IF(A2>1000, "Yes", "No")`,
      explanation: "IF checks the condition; if TRUE returns the first value, if FALSE returns the second. Nest IFs or use IFS for multiple conditions.",
      example: `=IF(B2>10000, "Bonus", "No Bonus")  → Show "Bonus" if sales exceed 10000`
    };
  }

  // CONCAT / combine text
  if (q.includes("combine") || q.includes("concat") || q.includes("join") || q.includes("merge") || q.includes("full name") || (q.includes("first") && q.includes("last"))) {
    return {
      excel: `=A2&" "&B2`,
      sheets: `=A2&" "&B2`,
      explanation: "The & operator joins text. Add any separator between quotes. CONCAT() and TEXTJOIN() are alternatives for joining ranges.",
      example: `=A2&" "&B2  → Combine first name in A2 and last name in B2 with a space`
    };
  }

  // UNIQUE / distinct values
  if (q.includes("unique") || q.includes("distinct") || q.includes("deduplic") || q.includes("remove duplicate")) {
    return {
      excel: `=UNIQUE(A2:A100)`,
      sheets: `=UNIQUE(A2:A100)`,
      explanation: "UNIQUE returns a list of unique values from the range. In Excel 365/2021 and Google Sheets, it spills results automatically.",
      example: `=UNIQUE(A2:A100)  → Return list of unique cities from column A`
    };
  }

  // DATE DIFFERENCE
  if (q.includes("date") && (q.includes("diff") || q.includes("days") || q.includes("between") || q.includes("age") || q.includes("duration"))) {
    return {
      excel: `=DATEDIF(A2, B2, "D")`,
      sheets: `=DAYS(B2, A2)`,
      explanation: "Excel: DATEDIF(start, end, unit) — units are \"D\" (days), \"M\" (months), \"Y\" (years). Google Sheets: DAYS(end, start) for day count.",
      example: `=DATEDIF(A2, TODAY(), "Y")  → Calculate age in years from birthday in A2`
    };
  }

  // TODAY / NOW
  if (q.includes("today") || q.includes("current date") || q.includes("now")) {
    return {
      excel: `=TODAY()`,
      sheets: `=TODAY()`,
      explanation: "TODAY() returns the current date (updates daily). NOW() returns current date and time.",
      example: `=TODAY()-A2  → Number of days since date in A2`
    };
  }

  // LEFT / RIGHT / MID text extraction
  if (q.includes("first") && (q.includes("character") || q.includes("letter") || q.includes("digit"))) {
    return {
      excel: `=LEFT(A2, 5)`,
      sheets: `=LEFT(A2, 5)`,
      explanation: "LEFT(text, n) returns the first n characters. Use RIGHT(text, n) for the last n characters, or MID(text, start, length) for the middle.",
      example: `=LEFT(A2, 3)  → First 3 characters from A2 (e.g., country code)`
    };
  }

  if (q.includes("last") && (q.includes("character") || q.includes("letter") || q.includes("digit"))) {
    return {
      excel: `=RIGHT(A2, 4)`,
      sheets: `=RIGHT(A2, 4)`,
      explanation: "RIGHT(text, n) returns the last n characters from the text in A2.",
      example: `=RIGHT(A2, 4)  → Last 4 characters (e.g., year from "Report 2024")`
    };
  }

  if (q.includes("extract") || q.includes("substring") || q.includes("part of")) {
    return {
      excel: `=MID(A2, 5, 3)`,
      sheets: `=MID(A2, 5, 3)`,
      explanation: "MID(text, start_position, num_chars) extracts text from the middle. Start at position 5, take 3 characters.",
      example: `=MID(A2, 5, 6)  → Extract 6 characters starting at position 5`
    };
  }

  // TRIM
  if (q.includes("trim") || q.includes("space") || q.includes("whitespace") || q.includes("clean")) {
    return {
      excel: `=TRIM(A2)`,
      sheets: `=TRIM(A2)`,
      explanation: "TRIM removes leading, trailing, and extra internal spaces from text. Combine with CLEAN to also remove non-printable characters.",
      example: `=TRIM(A2)  → Remove extra spaces from text in A2`
    };
  }

  // UPPER / LOWER / PROPER
  if (q.includes("uppercase") || q.includes("upper case") || q.includes("all caps")) {
    return {
      excel: `=UPPER(A2)`,
      sheets: `=UPPER(A2)`,
      explanation: "UPPER converts text to ALL CAPS. Use LOWER for lowercase or PROPER for Title Case.",
      example: `=UPPER(A2)  → Convert text in A2 to uppercase`
    };
  }

  if (q.includes("lowercase") || q.includes("lower case")) {
    return {
      excel: `=LOWER(A2)`,
      sheets: `=LOWER(A2)`,
      explanation: "LOWER converts text to all lowercase.",
      example: `=LOWER(A2)  → Convert text in A2 to lowercase`
    };
  }

  if (q.includes("title case") || q.includes("proper") || q.includes("capitalize")) {
    return {
      excel: `=PROPER(A2)`,
      sheets: `=PROPER(A2)`,
      explanation: "PROPER capitalizes the first letter of each word.",
      example: `=PROPER(A2)  → Convert "john doe" to "John Doe"`
    };
  }

  // PERCENTAGE
  if (q.includes("percent") || q.includes("proportion") || q.includes("share") || q.includes("% of")) {
    return {
      excel: `=B2/SUM(B:B)`,
      sheets: `=B2/SUM(B:B)`,
      explanation: "Divide individual value by total to get percentage. Format the cell as Percentage (%). For percentage change: =(B2-A2)/A2.",
      example: `=B2/SUM($B$2:$B$100)  → Percentage share of each value (lock range with $ for copy-down)`
    };
  }

  // MAX IF / MIN IF
  if ((q.includes("max") || q.includes("highest") || q.includes("largest")) && (q.includes("where") || q.includes("if") || q.includes("by"))) {
    return {
      excel: `=MAXIFS(B:B, A:A, "Criteria")`,
      sheets: `=MAXIFS(B:B, A:A, "Criteria")`,
      explanation: "MAXIFS returns the maximum value in column B where column A matches the criteria.",
      example: `=MAXIFS(C:C, A:A, "Sales")  → Highest value in column C where column A equals "Sales"`
    };
  }

  if ((q.includes("min") || q.includes("lowest") || q.includes("smallest")) && (q.includes("where") || q.includes("if") || q.includes("by"))) {
    return {
      excel: `=MINIFS(B:B, A:A, "Criteria")`,
      sheets: `=MINIFS(B:B, A:A, "Criteria")`,
      explanation: "MINIFS returns the minimum value in column B where column A matches the criteria.",
      example: `=MINIFS(C:C, A:A, "Sales")  → Lowest value in column C where column A equals "Sales"`
    };
  }

  // RANK
  if (q.includes("rank") || q.includes("ranking")) {
    return {
      excel: `=RANK(A2, A$2:A$100, 0)`,
      sheets: `=RANK(A2, A$2:A$100, 0)`,
      explanation: "RANK returns the rank of A2 within the range. 0 = descending (1 = highest), 1 = ascending (1 = lowest). Lock the range with $ so it doesn't shift when copied down.",
      example: `=RANK(B2, $B$2:$B$50, 0)  → Rank each sales figure from highest (1) to lowest`
    };
  }

  // SPLIT
  if (q.includes("split") || q.includes("separate") || (q.includes("first") && q.includes("last") && q.includes("name"))) {
    return {
      excel: `=LEFT(A2, FIND(" ", A2)-1)  |  =MID(A2, FIND(" ", A2)+1, LEN(A2))`,
      sheets: `=SPLIT(A2, " ")`,
      explanation: "Google Sheets: SPLIT(A2, \" \") splits by space and spills into adjacent columns. In Excel, extract first word with LEFT/FIND, last word with MID/FIND.",
      example: `Google Sheets: =SPLIT(A2, " ")  → Split "John Doe" into "John" and "Doe" automatically`
    };
  }

  // SUM top N
  if ((q.includes("top") || q.includes("largest")) && (q.includes("sum") || q.includes("total"))) {
    return {
      excel: `=SUMPRODUCT(LARGE(A2:A100, ROW(INDIRECT("1:5"))))`,
      sheets: `=SUM(LARGE(A2:A100, {1,2,3,4,5}))`,
      explanation: "Sum the top 5 values. Google Sheets: pass an array {1,2,3,4,5} to LARGE. Excel: use SUMPRODUCT with ROW/INDIRECT to generate the sequence.",
      example: `=SUM(LARGE(B2:B100, {1,2,3}))  → Sum of top 3 sales in column B`
    };
  }

  return null;
}

export function AiSpreadsheetFormulaTool() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FormulaResult | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const generate = () => {
    if (!query.trim()) return;
    const r = matchFormula(query);
    setResult(r);
    setNotFound(!r);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">AI Spreadsheet Formula Generator</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
          Describe what you want to calculate in plain English — get the exact Excel &amp; Google Sheets formula.
        </div>

        <div className="flex gap-2">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
            placeholder={`e.g. "Sum sales where region is North"`}
            className="text-sm h-10"
          />
          <Button onClick={generate} disabled={!query.trim()} className="h-10 px-4 gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5" /> Generate
          </Button>
        </div>

        {/* Example prompts */}
        <div>
          <button
            onClick={() => setShowExamples(v => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showExamples ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showExamples ? "Hide" : "Show"} example prompts
          </button>
          {showExamples && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {EXAMPLES.map(e => (
                <button key={e} onClick={() => { setQuery(e); setResult(null); setNotFound(false); }}
                  className="px-2.5 py-1 rounded-full bg-muted/40 border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {notFound && (
          <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 text-sm text-amber-400">
            Could not match a formula pattern. Try rephrasing — e.g. &quot;sum where&quot;, &quot;count if&quot;, &quot;find using&quot;, &quot;average by&quot;.
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "Excel Formula", value: result.excel, color: "from-emerald-500/10 to-teal-500/10" },
                { label: "Google Sheets Formula", value: result.sheets, color: "from-blue-500/10 to-indigo-500/10" },
              ].map(({ label, value, color }) => (
                <div key={label} className={cn("rounded-xl border border-border bg-gradient-to-br p-4 space-y-2", color)}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                    <Button size="sm" variant="ghost" onClick={() => copy(value)} className="h-6 text-xs gap-1">
                      <Copy className="w-3 h-3" /> Copy
                    </Button>
                  </div>
                  <code className="text-sm font-mono text-foreground break-all">{value}</code>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-muted/20 border border-border p-4 space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Explanation</div>
              <p className="text-sm text-foreground">{result.explanation}</p>
            </div>

            <div className="rounded-xl bg-muted/20 border border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Live Example</div>
                <Button size="sm" variant="ghost" onClick={() => copy(result.example)} className="h-6 text-xs gap-1">
                  <Copy className="w-3 h-3" /> Copy
                </Button>
              </div>
              <code className="text-sm font-mono text-primary break-all">{result.example}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
