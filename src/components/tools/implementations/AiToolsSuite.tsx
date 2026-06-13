"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, Copy, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// ─────────────────────────── template generators ────────────────────────────

function resumeAnalyzer(text: string): string {
  const t = text.toLowerCase();
  const sections: Record<string, boolean> = {
    "Contact Info":     /\b(phone|email|linkedin|github|portfolio|address)\b/.test(t),
    "Summary / Objective": /\b(summary|objective|profile|about me|overview)\b/.test(t),
    "Work Experience":  /\b(experience|employment|work history|position|role)\b/.test(t),
    "Education":        /\b(education|degree|university|college|bachelor|master|phd|diploma)\b/.test(t),
    "Skills":           /\b(skills|technologies|tools|stack|competencies|languages)\b/.test(t),
    "Projects":         /\b(projects?|portfolio|case stud)\b/.test(t),
    "Certifications":   /\b(certified|certification|certificate|license|aws|google cloud)\b/.test(t),
    "Achievements":     /\b(award|achievement|honor|recognition|winner)\b/.test(t),
  };
  const actionVerbs = ["led","managed","developed","created","implemented","improved","increased","reduced","designed","built","launched","delivered","established","optimized","coordinated","negotiated","spearheaded","architected","mentored"];
  const foundVerbs = actionVerbs.filter(v => t.includes(v));
  const hasMetrics = /\d+\s*(%|percent|x|times|employees|people|users|customers|projects|years|months|dollars|\$)/.test(t);
  const wordCount = text.trim().split(/\s+/).length;

  let score = 0;
  if (sections["Contact Info"]) score += 10;
  if (sections["Summary / Objective"]) score += 8;
  if (sections["Work Experience"]) score += 20;
  if (sections["Education"]) score += 12;
  if (sections["Skills"]) score += 10;
  if (sections["Projects"]) score += 8;
  if (sections["Certifications"]) score += 7;
  if (foundVerbs.length >= 5) score += 10;
  else if (foundVerbs.length >= 2) score += 5;
  if (hasMetrics) score += 10;
  if (wordCount >= 250 && wordCount <= 800) score += 5;

  const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D";
  const sectionLines = Object.entries(sections)
    .map(([name, found]) => `${found ? "✅" : "❌"} ${name}`)
    .join("\n");

  const suggestions: string[] = [];
  if (!sections["Summary / Objective"]) suggestions.push("Add a 2–3 sentence professional summary at the top.");
  if (!hasMetrics) suggestions.push("Add quantified achievements (e.g. 'increased revenue by 30%', 'managed team of 8').");
  if (foundVerbs.length < 5) suggestions.push(`Use more strong action verbs — found: ${foundVerbs.length}. Examples: led, architected, optimized, delivered.`);
  if (!sections["Projects"]) suggestions.push("Add a Projects section to showcase your practical work.");
  if (wordCount < 250) suggestions.push("Resume is short — aim for 300–600 words for a single-page resume.");
  if (wordCount > 900) suggestions.push("Resume may be too long — consider trimming to 1–2 pages.");
  if (!sections["Certifications"]) suggestions.push("Consider adding relevant certifications to strengthen credibility.");

  return `# Resume Analysis Report
Score: ${score}/100 — Grade: ${grade}
${"█".repeat(Math.round(score / 5))}${"░".repeat(20 - Math.round(score / 5))} ${score}%

## Sections Found
${sectionLines}

## Content Quality
- Action verbs used: ${foundVerbs.length} ${foundVerbs.length >= 5 ? "✅" : "⚠️"} ${foundVerbs.length > 0 ? `(${foundVerbs.slice(0,6).join(", ")})` : ""}
- Quantified metrics: ${hasMetrics ? "✅ Found" : "❌ Missing — add numbers!"}
- Word count: ${wordCount} ${wordCount >= 250 && wordCount <= 800 ? "✅" : "⚠️ (ideal: 300–800)"}

## Improvement Suggestions
${suggestions.length ? suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n") : "Great job — no major issues found!"}

## ATS Compatibility Tips
- Use standard section headings (Experience, Education, Skills)
- Avoid tables, columns, and graphics — ATS can't parse them
- Mirror exact keywords from the job description
- Use a clean, single-column format
- Save as .docx or plain PDF (not a scanned image)

## Recommended Next Steps
1. Tailor your resume to each job by matching keywords from the job posting
2. Get feedback from a peer or use a professional review service
3. Test your resume with an ATS simulator before applying`;
}

function seoAudit(content: string): string {
  const t = content.toLowerCase();
  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);
  const wordCount = content.trim().split(/\s+/).length;

  const hasTitle = /<title[^>]*>/.test(t) || /^title:/im.test(content);
  const hasMetaDesc = /meta.*description|<meta[^>]+description/i.test(content);
  const h1Count = (content.match(/<h1[^>]*>|^# /gm) ?? []).length;
  const h2Count = (content.match(/<h2[^>]*>|^## /gm) ?? []).length;
  const hasImages = /<img|!\[/i.test(content);
  const hasAlt = /alt=["'][^"']+["']|!\[.+\]/i.test(content);
  const hasInternalLinks = /<a[^>]*href=["'][^"'#][^"']*["']|]\([^)]+\)/i.test(content);
  const hasKeywords = wordCount > 100;
  const hasStructuredData = /application\/ld\+json|schema\.org/i.test(content);

  let score = 0;
  if (hasTitle) score += 15;
  if (hasMetaDesc) score += 15;
  if (h1Count === 1) score += 15;
  if (h2Count >= 2) score += 10;
  if (hasImages && hasAlt) score += 10;
  if (hasInternalLinks) score += 10;
  if (hasKeywords) score += 10;
  if (hasStructuredData) score += 10;
  if (wordCount >= 800) score += 5;

  const issues: string[] = [];
  if (!hasTitle) issues.push("Missing <title> tag — critical for SEO.");
  if (!hasMetaDesc) issues.push("Missing meta description — add a 150–160 character description.");
  if (h1Count === 0) issues.push("No H1 tag found — every page needs exactly one H1.");
  if (h1Count > 1) issues.push(`Multiple H1 tags (${h1Count}) — use only one H1 per page.`);
  if (h2Count < 2) issues.push("Add more H2 subheadings to structure content for scanners.");
  if (hasImages && !hasAlt) issues.push("Images missing alt text — required for accessibility and image SEO.");
  if (!hasInternalLinks) issues.push("No internal links detected — link to related pages to improve crawlability.");
  if (wordCount < 300) issues.push("Content too short — aim for 800+ words for competitive ranking.");
  if (!hasStructuredData) issues.push("No structured data (Schema.org) — add FAQ, Article, or BreadcrumbList markup.");

  return `# SEO Audit Report
Overall Score: ${score}/100
${"█".repeat(Math.round(score / 5))}${"░".repeat(20 - Math.round(score / 5))} ${score}%

## Technical SEO
${hasTitle ? "✅" : "❌"} Title tag present
${hasMetaDesc ? "✅" : "❌"} Meta description present
${hasStructuredData ? "✅" : "❌"} Structured data (JSON-LD / Schema.org)

## Content Structure
${h1Count === 1 ? "✅" : "❌"} H1 tags: ${h1Count} (should be exactly 1)
${h2Count >= 2 ? "✅" : "⚠️"} H2 subheadings: ${h2Count} (recommend 2+)
${wordCount >= 800 ? "✅" : "⚠️"} Word count: ${wordCount} (recommend 800+ for competitive terms)

## On-Page SEO
${hasImages ? (hasAlt ? "✅" : "❌") : "—"} Image alt text
${hasInternalLinks ? "✅" : "❌"} Internal links
${hasKeywords ? "✅" : "⚠️"} Content length for keyword coverage

## Issues Found (${issues.length})
${issues.length ? issues.map((s, i) => `${i + 1}. ⚠️ ${s}`).join("\n") : "No critical issues found — great work!"}

## Quick Win Recommendations
1. **Target one primary keyword** — use it in title, H1, first paragraph, and URL
2. **Write for featured snippets** — answer questions directly with bullet lists
3. **Improve page speed** — compress images, enable caching, use a CDN
4. **Build internal links** — link every new page from 2–3 existing pages
5. **Get backlinks** — guest posts, resource pages, and PR mentions

## Core Web Vitals Checklist
- [ ] LCP (Largest Contentful Paint) < 2.5 seconds
- [ ] FID / INP (Interaction to Next Paint) < 200ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Mobile-friendly design
- [ ] HTTPS enabled`;
}

function keywordCluster(input: string): string {
  const raw = input.split(/[,\n]/).map(k => k.trim()).filter(Boolean);
  if (raw.length === 0) return "Please enter at least one keyword.";

  const informational = raw.filter(k => /\b(what|how|why|when|where|who|guide|tips|tutorial|learn|meaning|definition|difference|vs|versus)\b/i.test(k));
  const commercial = raw.filter(k => /\b(best|top|review|compare|vs|alternative|cheap|affordable|price|cost|rating|recommend)\b/i.test(k));
  const transactional = raw.filter(k => /\b(buy|purchase|order|download|get|sign up|subscribe|free trial|discount|coupon|deal)\b/i.test(k));
  const navigational = raw.filter(k => /\b(login|sign in|website|app|tool|platform|software|service|brand)\b/i.test(k) && !commercial.includes(k));

  const classified = new Set([...informational, ...commercial, ...transactional, ...navigational]);
  const uncategorized = raw.filter(k => !classified.has(k));

  const fmt = (arr: string[]) => arr.length ? arr.map(k => `  • ${k}`).join("\n") : "  (none)";

  return `# Keyword Cluster Analysis
Total keywords: ${raw.length}

## 🔍 Informational (${informational.length} keywords)
Intent: Research & awareness — target with blog posts, guides, FAQs
${fmt(informational)}

## 🛒 Commercial Investigation (${commercial.length} keywords)
Intent: Comparing options before buying — target with comparison pages, reviews
${fmt(commercial)}

## 💳 Transactional (${transactional.length} keywords)
Intent: Ready to take action — target with landing pages, product pages
${fmt(transactional)}

## 🧭 Navigational (${navigational.length} keywords)
Intent: Looking for a specific brand/tool — target with branded pages
${fmt(navigational)}

## 📂 Other / Head Terms (${uncategorized.length} keywords)
${fmt(uncategorized)}

## Content Strategy Recommendations

**For Informational keywords:**
- Create comprehensive pillar pages (2000+ words)
- Add FAQ sections targeting "People Also Ask" boxes
- Optimize for featured snippets with direct answers

**For Commercial keywords:**
- Build comparison tables with pros/cons
- Write detailed reviews with real data
- Target "best [product]" queries with ranked lists

**For Transactional keywords:**
- Create dedicated landing pages with clear CTAs
- Include trust signals (reviews, security badges)
- Make pricing transparent

## Suggested Content Clusters
${raw.slice(0, 3).map(kw => `- "${kw}" → Pillar page + 3–5 supporting articles`).join("\n")}`;
}

function proposalGenerator(values: Record<string, string>): string {
  const { client = "Client", project = "the project", scope = "full project scope", budget = "TBD", timeline = "4–6 weeks", company = "Our Company" } = values;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return `# PROJECT PROPOSAL
**Prepared for:** ${client}
**Prepared by:** ${company}
**Date:** ${today}
**Project:** ${project}

---

## Executive Summary

We are pleased to submit this proposal for ${project}. Based on our understanding of your requirements, we have designed a solution that will deliver measurable results within the agreed timeline and budget.

${company} brings expertise, a proven track record, and a dedicated team to ensure the success of this engagement.

---

## Project Understanding

**Project:** ${project}
**Scope:** ${scope}

We understand that ${client} is looking for a reliable partner to deliver ${project}. Our approach focuses on:
- Clear communication and milestone-based delivery
- Quality assurance at every stage
- Post-delivery support and documentation

---

## Proposed Scope of Work

### Phase 1: Discovery & Planning (Week 1)
- Stakeholder interviews and requirement gathering
- Technical discovery and feasibility assessment
- Detailed project plan and timeline sign-off

### Phase 2: Design & Architecture (Week 2)
- Solution architecture and design mockups
- Client review and feedback cycle
- Final design approval

### Phase 3: Development & Implementation (Weeks 3–${parseInt(timeline) || 4})
- Core development per agreed specifications
- Regular progress updates (bi-weekly check-ins)
- Quality assurance and testing

### Phase 4: Delivery & Handover
- Final testing and sign-off
- Deployment and go-live support
- Documentation and knowledge transfer
- 30-day post-launch support

---

## Deliverables
- [ ] Completed ${project} as per agreed scope
- [ ] Source code / final files with documentation
- [ ] User guide / training materials
- [ ] 30-day support window post-delivery

---

## Timeline

| Phase | Duration | Milestone |
|-------|----------|-----------|
| Discovery | Week 1 | Requirements signed off |
| Design | Week 2 | Designs approved |
| Development | Weeks 3–${timeline || "5"} | QA complete |
| Launch | Final week | Live delivery |

**Total Estimated Timeline:** ${timeline}

---

## Investment

| Item | Cost |
|------|------|
| ${project} | ${budget} |
| Post-launch support (30 days) | Included |
| **Total Investment** | **${budget}** |

*Payment terms: 50% upfront, 50% on delivery. All prices exclusive of applicable taxes.*

---

## Why ${company}?

- ✅ Proven delivery track record
- ✅ Dedicated project manager assigned
- ✅ Clear milestones and transparent communication
- ✅ Post-delivery support included
- ✅ Satisfaction guarantee

---

## Next Steps

1. Review this proposal and share any questions
2. Sign the Letter of Engagement to confirm the project
3. Submit 50% deposit to initiate work
4. Kick-off meeting scheduled within 48 hours of engagement

We look forward to partnering with ${client} on this exciting project.

---

*This proposal is valid for 30 days from the date above.*
*${company} | Confidential*`;
}

function sqlGenerator(description: string): string {
  const d = description.toLowerCase();
  const words = d.split(/\s+/);

  // Detect table name from description
  const tableKeywords = ["users", "customers", "orders", "products", "employees", "students", "records", "items", "sales", "transactions", "accounts", "posts", "comments", "categories", "invoices"];
  const detectedTable = tableKeywords.find(t => d.includes(t)) ?? "table_name";
  const table = detectedTable;

  // Detect column-like words
  const colWords = words.filter(w => w.length > 3 && !["from","where","select","order","group","having","limit","offset","join","inner","outer","left","right","full","with","using","that","this","where","show","find","list","fetch","all","the","and","for"].includes(w));

  let sql = "";
  let explanation = "";

  if (d.includes("count") || d.includes("how many")) {
    const filterMatch = d.match(/where (.+?)(?:$| and | or )/);
    const condition = filterMatch ? filterMatch[1].replace(/\s+/g, "_") + " = 'value'" : "status = 'active'";
    sql = `SELECT COUNT(*) AS total_count\nFROM ${table}\nWHERE ${condition};`;
    explanation = "Counts rows matching the condition.";
  } else if (d.includes("average") || d.includes("avg")) {
    sql = `SELECT AVG(amount) AS average_amount\nFROM ${table}\nWHERE status = 'completed';`;
    explanation = "Calculates average value of a numeric column.";
  } else if (d.includes("group by") || d.includes("per ") || d.includes("by each")) {
    sql = `SELECT category, COUNT(*) AS count, SUM(amount) AS total\nFROM ${table}\nGROUP BY category\nORDER BY total DESC;`;
    explanation = "Aggregates data grouped by a category column.";
  } else if (d.includes("join") || d.includes("related") || d.includes("with their") || d.includes("along with")) {
    const secondTable = tableKeywords.find(t => d.includes(t) && t !== detectedTable) ?? "related_table";
    sql = `SELECT a.*, b.name AS related_name\nFROM ${table} a\nINNER JOIN ${secondTable} b ON a.${secondTable.replace(/s$/,'')}_id = b.id\nWHERE a.status = 'active'\nORDER BY a.created_at DESC;`;
    explanation = "Joins two tables to fetch combined data.";
  } else if (d.includes("insert") || d.includes("add new") || d.includes("create new")) {
    const col1 = colWords[0] ?? "name";
    const col2 = colWords[1] ?? "email";
    sql = `INSERT INTO ${table} (${col1}, ${col2}, created_at)\nVALUES ('value1', 'value2', NOW())\nRETURNING id;`;
    explanation = "Inserts a new row and returns the generated ID.";
  } else if (d.includes("update") || d.includes("change") || d.includes("set ") || d.includes("modify")) {
    const col = colWords[0] ?? "status";
    sql = `UPDATE ${table}\nSET ${col} = 'new_value', updated_at = NOW()\nWHERE id = :id\nRETURNING *;`;
    explanation = "Updates specific columns for a matching row.";
  } else if (d.includes("delete") || d.includes("remove") || d.includes("drop")) {
    sql = `-- ⚠️  Always verify before deleting!\nDELETE FROM ${table}\nWHERE id = :id\n  AND status = 'inactive';`;
    explanation = "Deletes a specific row. Conditions prevent accidental bulk deletes.";
  } else if (d.includes("top") || d.includes("most") || d.includes("highest") || d.includes("latest") || d.includes("recent")) {
    const limitMatch = d.match(/\b(\d+)\b/);
    const limit = limitMatch ? parseInt(limitMatch[1]) : 10;
    sql = `SELECT *\nFROM ${table}\nORDER BY created_at DESC\nLIMIT ${limit};`;
    explanation = `Fetches the ${limit} most recent rows.`;
  } else if (d.includes("search") || d.includes("find") || d.includes("where") || d.includes("filter")) {
    const col = colWords[0] ?? "name";
    sql = `SELECT id, ${col}, email, created_at\nFROM ${table}\nWHERE ${col} ILIKE '%search_term%'\n   OR email ILIKE '%search_term%'\nORDER BY created_at DESC\nLIMIT 50;`;
    explanation = "Full-text search across columns using ILIKE (case-insensitive).";
  } else {
    // Default SELECT
    const cols = colWords.slice(0, 4).join(", ") || "id, name, status, created_at";
    sql = `SELECT ${cols}\nFROM ${table}\nWHERE status = 'active'\nORDER BY created_at DESC\nLIMIT 100;`;
    explanation = "Fetches active rows ordered by most recent.";
  }

  return `-- SQL Query Generator
-- Input: "${description}"

${sql}

-- Explanation: ${explanation}

-- ─── Common variations ──────────────────────────────────────────────────────

-- Add pagination:
-- LIMIT 20 OFFSET (page - 1) * 20

-- Add a date range filter:
-- WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'

-- Add full-text search (PostgreSQL):
-- WHERE to_tsvector('english', name) @@ to_tsquery('search_term')

-- Create an index for this query:
-- CREATE INDEX CONCURRENTLY idx_${table}_status_created
--   ON ${table} (status, created_at DESC);

-- ─── Tips ───────────────────────────────────────────────────────────────────
-- • Replace :id and 'value' placeholders with actual parameters
-- • Use parameterized queries (?, $1) to prevent SQL injection
-- • Add EXPLAIN ANALYZE before the query to check performance
-- • Test on staging before running on production`;
}

function codeExplainer(values: Record<string, string>): string {
  const { code, language = "auto" } = values;
  if (!code.trim()) return "Please paste some code to explain.";

  const lines = code.split("\n");
  const lang = language !== "auto" ? language : detectLanguage(code);

  const lineAnnotations = lines.slice(0, 30).map((line, i) => {
    const l = line.trim();
    if (!l || l.startsWith("//") || l.startsWith("#") || l.startsWith("*")) return null;
    let note = "";
    if (/^(function|def|const.*=>|class|public |private |protected )/.test(l)) note = "↳ Function/class definition";
    else if (/^(if|else|elif|switch|case)\b/.test(l)) note = "↳ Conditional branch";
    else if (/^(for|while|do)\b/.test(l)) note = "↳ Loop";
    else if (/^(return|yield)\b/.test(l)) note = "↳ Returns a value";
    else if (/^(import|require|from|#include|using)\b/.test(l)) note = "↳ Imports a module/dependency";
    else if (/^(try|catch|except|finally|throw|raise)\b/.test(l)) note = "↳ Error handling";
    else if (/\basync\b.*\bawait\b|\bawait\b/.test(l)) note = "↳ Asynchronous operation";
    else if (/=\s*new\s+\w+\(/.test(l)) note = "↳ Creates a new object instance";
    else if (/\bconsole\.(log|warn|error)|print\(|println/.test(l)) note = "↳ Outputs to console/log";
    return note ? `  ${String(i + 1).padStart(3, " ")} | ${l.slice(0, 60).padEnd(62)}  ${note}` : null;
  }).filter(Boolean);

  const complexity = estimateComplexity(code);

  return `# Code Explanation — ${lang}

## What this code does
This ${lang} code ${summarizeCode(code, lang)}.

## Line-by-line Breakdown
\`\`\`
${lineAnnotations.slice(0, 20).join("\n") || "  (code is straightforward — see summary above)"}
${lines.length > 30 ? `  ... (${lines.length - 30} more lines)` : ""}
\`\`\`

## Key Concepts Used
${detectConcepts(code, lang).map(c => `• **${c.name}**: ${c.description}`).join("\n")}

## Complexity Analysis
- Lines of code: ${lines.filter(l => l.trim()).length}
- Cyclomatic complexity: ~${complexity} (${complexity <= 5 ? "simple" : complexity <= 10 ? "moderate" : "complex"})
- Functions/methods: ${(code.match(/\bfunction\b|\bdef\b|\b=>\s*{/g) ?? []).length}
- Loops: ${(code.match(/\b(for|while|forEach|map|reduce|filter)\b/g) ?? []).length}

## Potential Issues to Watch
${detectIssues(code).map(i => `⚠️ ${i}`).join("\n") || "✅ No obvious issues detected."}

## How to use this code
\`\`\`${lang.toLowerCase()}
// Example usage:
// 1. Set up the required dependencies
// 2. Call the main function with appropriate arguments
// 3. Handle the returned value / side effects
\`\`\``;
}

function estimateComplexity(code: string): number {
  const branches = (code.match(/\b(if|else|for|while|switch|catch|&&|\|\|)\b/g) ?? []).length;
  return Math.max(1, branches + 1);
}

function detectLanguage(code: string): string {
  if (/\bpublic\s+class\b|\bSystem\.out\.println\b/.test(code)) return "Java";
  if (/\bdef\s+\w+\s*\(|\bimport\s+\w+\b/.test(code) && !code.includes("{")) return "Python";
  if (/\bfunc\s+\w+\s*\(|\bvar\s+\w+\s*=|\blet\s+\w+\s*=/.test(code) && /<\w+>/.test(code)) return "Swift";
  if (/\bfn\s+\w+|\blet\s+mut\b|\bimpl\b/.test(code)) return "Rust";
  if (/\bpackage\s+main\b|\bfmt\.Printf\b/.test(code)) return "Go";
  if (/\#include|std::|\bcout\b/.test(code)) return "C++";
  if (/<[A-Z][a-z]+[\s/>]|\bjsx\b|\.tsx?/.test(code)) return "TypeScript/React";
  if (/\bconst\b|\blet\b|\barrow\b|=>/.test(code)) return "JavaScript";
  if (/\.\w+\s*\{|\bpublic\b/.test(code) && !/function/.test(code)) return "CSS / SCSS";
  if (/SELECT|INSERT|UPDATE|DELETE|FROM|WHERE/i.test(code)) return "SQL";
  if (/<\?php/.test(code)) return "PHP";
  return "Code";
}

function summarizeCode(code: string, lang: string): string {
  const hasFunctions = /function|def |=>/.test(code);
  const hasClass = /class\s+\w+/.test(code);
  const hasAsync = /async|await|Promise/.test(code);
  const hasApi = /fetch|axios|http|request|api/i.test(code);
  const hasDb = /sql|query|database|db\./i.test(code);

  const parts: string[] = [];
  if (hasClass) parts.push("defines a class");
  if (hasFunctions) parts.push(`contains ${(code.match(/function|def |=>/g) ?? []).length} function(s)`);
  if (hasAsync) parts.push("performs asynchronous operations");
  if (hasApi) parts.push("makes API/network requests");
  if (hasDb) parts.push("interacts with a database");

  return parts.length > 0 ? parts.join(", ") : `appears to be a ${lang} script`;
}

function detectConcepts(code: string, lang: string): { name: string; description: string }[] {
  const concepts: { name: string; description: string }[] = [];
  if (/async|await/.test(code)) concepts.push({ name: "Async/Await", description: "Handles asynchronous code in a synchronous-looking style" });
  if (/\.map\(|\.filter\(|\.reduce\(/.test(code)) concepts.push({ name: "Array Methods", description: "Functional programming patterns for transforming data" });
  if (/class\s+\w+/.test(code)) concepts.push({ name: "Object-Oriented Programming", description: "Code organized into classes and objects" });
  if (/try\s*{|catch\s*\(|except\s/.test(code)) concepts.push({ name: "Error Handling", description: "Catches and handles runtime errors gracefully" });
  if (/fetch\(|axios\.|http\./i.test(code)) concepts.push({ name: "HTTP Requests", description: "Communicates with external APIs or services" });
  if (/useState|useEffect|useRef/.test(code)) concepts.push({ name: "React Hooks", description: "Manages component state and side effects in React" });
  if (/\binterface\b|\btype\s+\w+\s*=/.test(code)) concepts.push({ name: "TypeScript Types", description: "Defines static type contracts for better code safety" });
  if (concepts.length === 0) concepts.push({ name: "Procedural Logic", description: "Sequential statements that execute top-to-bottom" });
  return concepts;
}

function detectIssues(code: string): string[] {
  const issues: string[] = [];
  if (/console\.log\(/.test(code)) issues.push("console.log() statements present — remove before production");
  if (/TODO|FIXME|HACK|XXX/.test(code)) issues.push("TODO/FIXME comments found — review before shipping");
  if (/password|secret|api_key|apikey|token/i.test(code) && /"[^"]{8,}"/.test(code)) issues.push("Possible hardcoded credential — move to environment variables");
  if (/catch\s*\([^)]+\)\s*\{\s*\}/.test(code)) issues.push("Empty catch block — add error logging or handling");
  if (/var\s+/.test(code)) issues.push("var declarations found — prefer const/let for block scoping");
  return issues;
}

function businessPlan(values: Record<string, string>): string {
  const { business = "Your Business", industry = "Technology", description = "innovative products and services", market = "professionals and businesses", revenue = "subscription model" } = values;
  const today = new Date().getFullYear();

  return `# BUSINESS PLAN
## ${business}

**Industry:** ${industry}
**Date:** ${today}
**Prepared by:** Founding Team

---

## 1. Executive Summary

**${business}** is an ${industry} company that ${description}. Our target market is ${market}, and we will generate revenue through a ${revenue}.

We aim to capture a meaningful share of the ${industry} market by offering a superior product, focused go-to-market strategy, and exceptional customer experience.

**Highlights:**
- Market opportunity: $X billion (replace with actual research)
- Target: ${market}
- Revenue model: ${revenue}
- Break-even target: Month 18

---

## 2. Company Overview

### Mission
To provide ${market} with the best ${description} through innovation and customer focus.

### Vision
To become the leading ${industry} solution for ${market} within 5 years.

### Legal Structure
- Entity type: Private Limited / LLC (to be confirmed)
- Founded: ${today}
- Founders: [Add founder names and roles]

---

## 3. Products & Services

### Core Offering
${description}

### Key Features
1. Feature 1 — [Primary value proposition]
2. Feature 2 — [Secondary differentiation]
3. Feature 3 — [Supporting capability]

### Competitive Advantage
- [Unique technology / approach]
- [Cost advantage / efficiency]
- [Network effects / switching costs]

---

## 4. Market Analysis

### Target Market
**Primary:** ${market}
**Secondary:** [Adjacent segment]

### Market Size
- TAM (Total Addressable Market): $X billion
- SAM (Serviceable Addressable Market): $X million
- SOM (Serviceable Obtainable Market, Year 1): $X million

### Competitive Landscape

| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|------------|---------------|
| Competitor A | Brand, Scale | Price, UX | Better UX |
| Competitor B | Features | Complex | Simplicity |
| Competitor C | Price | Limited | Full solution |

---

## 5. Go-To-Market Strategy

### Phase 1: Launch (Months 1–3)
- Beta with 100 design partners
- Product Hunt launch
- Content marketing (blog, SEO)

### Phase 2: Growth (Months 4–12)
- Paid acquisition (Google, LinkedIn)
- Partnerships and integrations
- Referral program

### Phase 3: Scale (Year 2+)
- Enterprise sales team
- International expansion
- Platform / marketplace

### Marketing Channels
1. Content SEO — target high-intent keywords for ${industry}
2. LinkedIn/Social — thought leadership for ${market}
3. Partnerships — referral agreements with complementary products
4. PR — industry publications and podcasts

---

## 6. Financial Projections

### Revenue Model: ${revenue}

| Year | Customers | ARR | Expenses | EBITDA |
|------|-----------|-----|----------|--------|
| Y1 | 200 | $200K | $350K | -$150K |
| Y2 | 800 | $960K | $600K | $360K |
| Y3 | 2,500 | $3.5M | $1.5M | $2M |

### Key Assumptions
- Average contract value: $X/month
- Monthly churn: < 3%
- CAC payback: < 12 months
- LTV:CAC ratio: > 3:1

### Funding Requirements
- Seed round: $X (enough for 18 months runway)
- Use of funds: 50% product, 30% marketing, 20% operations

---

## 7. Team

| Role | Responsibilities | Status |
|------|-----------------|--------|
| CEO / Co-founder | Vision, fundraising, sales | [Name] |
| CTO / Co-founder | Product, engineering | [Name] |
| Head of Marketing | Growth, content, brand | Hiring |
| Head of Sales | Enterprise, partnerships | Hiring |

**Advisors:** [Add relevant advisors with credentials]

---

## 8. Milestones & KPIs

| Milestone | Target Date | KPI |
|-----------|-------------|-----|
| MVP launch | Month 3 | 50 beta users |
| Product-market fit | Month 6 | NPS > 40 |
| First $10K MRR | Month 9 | 50 paying customers |
| Break-even | Month 18 | Positive EBITDA |
| Series A ready | Month 24 | $1M ARR |

---

## 9. Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Slow adoption | Medium | High | Intensive customer development |
| Competitor response | High | Medium | Speed to market, patents |
| Funding gap | Low | High | Conservative burn, bridge loans |
| Key person dependency | Medium | Medium | Hire #2 in each function |

---

*This document is confidential and intended for internal use and authorized investors only.*`;
}

function productDescriptionEnhanced(values: Record<string, string>): string {
  const { product = "the product", features = "great features", audience = "professionals", tone = "professional" } = values;
  const featureList = features.split(/[,\n]/).map(f => f.trim()).filter(Boolean);

  const toneMap: Record<string, { opener: string; style: string }> = {
    professional: { opener: `Introducing ${product} — the professional-grade solution for ${audience}.`, style: "Precision-engineered" },
    casual: { opener: `Meet ${product} — the thing your life was missing.`, style: "Super easy to use" },
    luxury: { opener: `Experience the pinnacle of ${product} — crafted exclusively for ${audience} who demand excellence.`, style: "Meticulously crafted" },
    technical: { opener: `${product} delivers enterprise-grade performance for ${audience} with specific technical requirements.`, style: "Technically superior" },
  };
  const t = toneMap[tone] ?? toneMap["professional"];

  return `# Product Descriptions: ${product}

---
## Version 1 — Short (for ads / product cards)

**${product}**
${t.opener}
${t.style} for ${audience}. ${featureList[0] ? `Key benefit: ${featureList[0]}.` : ""} Trusted by thousands worldwide.

---
## Version 2 — Medium (for e-commerce listing)

**${product} — The Complete Solution for ${audience}**

Are you looking for a reliable, high-performance ${product}? Look no further.

${t.opener}

**What makes it different:**
${featureList.map(f => `✅ ${f}`).join("\n") || "✅ Premium quality\n✅ Easy to use\n✅ Built to last"}

Perfect for ${audience} who need results without compromise.

🔒 **30-day money-back guarantee** | 🚀 **Fast shipping** | ⭐ **5-star rated**

---
## Version 3 — Long (for product page / SEO)

# ${product}: Everything You Need to Know

## Overview
${t.opener} ${product} was designed from the ground up with ${audience} in mind.

Unlike generic alternatives, ${product} ${featureList[0] ? `focuses on ${featureList[0].toLowerCase()}` : "delivers on every promise"}.

## Key Features
${featureList.map((f, i) => `### Feature ${i + 1}: ${f}\nThis capability sets ${product} apart by delivering real, measurable value to ${audience}.`).join("\n\n") || `### Premium Build Quality\nEvery component of ${product} is selected for durability and performance.`}

## Who Is This For?
${product} is ideal for:
- ${audience} who value quality over price
- Anyone tired of subpar alternatives
- Teams / individuals looking for a long-term solution

## Customer Reviews
⭐⭐⭐⭐⭐ *"Best ${product} I've ever used. Completely changed how I work."* — Verified Buyer

⭐⭐⭐⭐⭐ *"Worth every penny. The ${featureList[0] ?? "quality"} is unmatched."* — ${audience.split(" ")[0]}

## Pricing
Starting from **$[PRICE]** — *see all plans*

**[Add to Cart →]**  |  **[Learn More →]**`;
}

function meetingNotes(input: string): string {
  const lines = input.split("\n").map(l => l.trim()).filter(Boolean);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // Heuristic detection
  const attendeeLines = lines.filter(l => /attendee|present|participant|team:|who:|joined/i.test(l));
  const actionLines = lines.filter(l => /action|todo|task|will|need to|assigned|responsible|owner|deadline|by [a-z]/i.test(l));
  const decisionLines = lines.filter(l => /decided|agreed|approved|confirmed|resolved|conclusion|we will|going with/i.test(l));
  const remainingLines = lines.filter(l => !actionLines.includes(l) && !decisionLines.includes(l) && !attendeeLines.includes(l));

  const fmt = (arr: string[]) => arr.length
    ? arr.map(l => `- ${l.replace(/^[-•*]\s*/,"")}`).join("\n")
    : "- [None recorded]";

  return `# Meeting Notes
📅 Date: ${today}
🕐 Duration: [Add time]
📍 Location / Platform: [Add meeting location]

---

## Attendees
${fmt(attendeeLines.length ? attendeeLines : ["[Add attendee names]"])}

---

## Agenda Items Discussed
${remainingLines.slice(0, 10).map((l, i) => `${i + 1}. ${l.replace(/^[-•*]\s*/,"")}`).join("\n") || "1. [Add agenda items]"}

---

## Key Decisions Made
${fmt(decisionLines)}

---

## Action Items

| # | Task | Owner | Deadline |
|---|------|-------|----------|
${actionLines.map((l, i) => `| ${i + 1} | ${l.replace(/^[-•*]\s*/,"").slice(0,60)} | [Name] | [Date] |`).join("\n") || "| 1 | [Add action item] | [Owner] | [Date] |"}

---

## Discussion Notes
${remainingLines.slice(10).map(l => `- ${l.replace(/^[-•*]\s*/,"")}`).join("\n") || "- [Additional notes]"}

---

## Next Steps
1. Share these notes with all attendees
2. Follow up on action items before next meeting
3. Schedule next meeting: [Date TBD]

---
*Notes taken by: [Your name]*
*Distribution: All attendees*`;
}

function formatSql(raw: string): string {
  if (!raw.trim()) return "Please paste SQL to format.";
  const keywords = ["SELECT","FROM","WHERE","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","OUTER JOIN","ON","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","CREATE TABLE","DROP TABLE","ALTER TABLE","WITH","UNION","UNION ALL","EXCEPT","INTERSECT","CASE","WHEN","THEN","ELSE","END","AND","OR","NOT","IN","IS NULL","IS NOT NULL","AS","DISTINCT","COUNT","SUM","AVG","MAX","MIN","COALESCE","NULLIF"];
  let sql = raw.trim().replace(/\s+/g, " ");
  const upper = keywords.reduce((s, kw) => s.replace(new RegExp(`\\b${kw}\\b`,"gi"), kw), sql);
  const formatted = upper
    .replace(/\b(SELECT)\b/g, "\nSELECT")
    .replace(/\b(FROM)\b/g, "\nFROM")
    .replace(/\b(WHERE)\b/g, "\nWHERE")
    .replace(/\b((?:LEFT |RIGHT |INNER |OUTER )?JOIN)\b/g, "\n$1")
    .replace(/\b(ON)\b/g, "\n  ON")
    .replace(/\b(GROUP BY)\b/g, "\nGROUP BY")
    .replace(/\b(ORDER BY)\b/g, "\nORDER BY")
    .replace(/\b(HAVING)\b/g, "\nHAVING")
    .replace(/\b(LIMIT|OFFSET)\b/g, "\n$1")
    .replace(/,\s*/g, ",\n  ")
    .replace(/\n\s*\n/g, "\n")
    .trim();

  return `-- Formatted SQL\n-- Original length: ${raw.length} chars → Formatted: ${formatted.length} chars\n\n${formatted}\n\n-- Formatting notes:\n-- • Keywords uppercased for readability\n-- • Each clause on its own line\n-- • SELECT columns indented 2 spaces each\n-- • JOIN conditions indented under their JOIN`;
}

function explainSql(sql: string): string {
  if (!sql.trim()) return "Please paste a SQL query to explain.";
  const s = sql.toUpperCase();

  const clauses: string[] = [];
  if (/\bSELECT\b/.test(s)) {
    const distinct = /\bDISTINCT\b/.test(s) ? " (DISTINCT — duplicates removed)" : "";
    const colMatch = sql.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
    const cols = colMatch ? colMatch[1].trim().slice(0, 150) : "*";
    clauses.push(`**SELECT${distinct}** — Retrieves columns: \`${cols}\``);
  }
  if (/\bFROM\b/.test(s)) {
    const fromMatch = sql.match(/FROM\s+([\w.,\s]+?)(?:\s+(?:WHERE|JOIN|GROUP|ORDER|LIMIT|HAVING|$))/i);
    clauses.push(`**FROM** — Reads data from table(s): \`${fromMatch ? fromMatch[1].trim() : "[table]"}\``);
  }
  const joins = [...sql.matchAll(/(?:LEFT |RIGHT |INNER |OUTER )?JOIN\s+(\w+)/gi)];
  for (const j of joins) {
    const type = j[0].trim().split(" ")[0] === "JOIN" ? "INNER" : j[0].trim().split(" ")[0];
    clauses.push(`**${type} JOIN** on \`${j[1]}\` — Combines rows from both tables where the ON condition matches. ${type === "LEFT" ? "All rows from the left table are kept even with no match." : type === "RIGHT" ? "All rows from the right table are kept." : "Only matching rows from both tables are returned."}`);
  }
  if (/\bWHERE\b/.test(s)) {
    const whereMatch = sql.match(/WHERE\s+(.*?)(?:\s+(?:GROUP BY|ORDER BY|HAVING|LIMIT|$))/i);
    clauses.push(`**WHERE** — Filters rows: \`${whereMatch ? whereMatch[1].trim().slice(0, 120) : "[condition]"}\``);
  }
  if (/\bGROUP BY\b/.test(s)) {
    const grpMatch = sql.match(/GROUP BY\s+(.*?)(?:\s+(?:HAVING|ORDER BY|LIMIT|$))/i);
    clauses.push(`**GROUP BY** — Groups rows by: \`${grpMatch ? grpMatch[1].trim() : "[columns]"}\`. Aggregates (COUNT, SUM, AVG) apply per group.`);
  }
  if (/\bHAVING\b/.test(s)) clauses.push("**HAVING** — Filters groups (like WHERE, but applied after GROUP BY). Used to filter on aggregate values.");
  if (/\bORDER BY\b/.test(s)) {
    const ordMatch = sql.match(/ORDER BY\s+(.*?)(?:\s+(?:LIMIT|$))/i);
    clauses.push(`**ORDER BY** — Sorts results by: \`${ordMatch ? ordMatch[1].trim() : "[columns]"}\``);
  }
  if (/\bLIMIT\b/.test(s)) {
    const limMatch = sql.match(/LIMIT\s+(\d+)/i);
    clauses.push(`**LIMIT ${limMatch ? limMatch[1] : "N"}** — Returns only the first ${limMatch ? limMatch[1] : "N"} rows.`);
  }

  const aggFuncs = [...new Set([...sql.matchAll(/\b(COUNT|SUM|AVG|MAX|MIN)\s*\(/gi)].map(m => m[1].toUpperCase()))];

  return `# SQL Query Explanation

## What this query does
This query ${/\bSELECT\b/.test(s) ? "retrieves" : /\bINSERT\b/.test(s) ? "inserts" : /\bUPDATE\b/.test(s) ? "updates" : "deletes"} data${joins.length > 0 ? ` by joining ${joins.length + 1} table${joins.length > 0 ? "s" : ""}` : ""}${/\bGROUP BY\b/.test(s) ? " and aggregates results into groups" : ""}${/\bORDER BY\b/.test(s) ? ", sorted by specified columns" : ""}${/\bLIMIT\b/.test(s) ? ", limited to a subset of rows" : ""}.

## Clause-by-Clause Breakdown

${clauses.map((c, i) => `### ${i + 1}. ${c}`).join("\n\n")}

${aggFuncs.length > 0 ? `## Aggregate Functions Used\n${aggFuncs.map(f => `- **${f}()** — ${f === "COUNT" ? "Counts rows/non-null values" : f === "SUM" ? "Sums numeric values" : f === "AVG" ? "Computes average" : f === "MAX" ? "Returns highest value" : "Returns lowest value"}`).join("\n")}` : ""}

## Execution Order
SQL executes clauses in this order: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT

This matters: you can't reference SELECT aliases in WHERE, but you can in ORDER BY.`;
}

function optimizeSql(sql: string): string {
  if (!sql.trim()) return "Please paste a SQL query to optimize.";
  const s = sql.toUpperCase();
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (/SELECT\s+\*/i.test(sql)) {
    issues.push("**SELECT \\*** — Fetching all columns is expensive.");
    suggestions.push("Replace `SELECT *` with only the columns you need: `SELECT id, name, email`");
  }
  if (/WHERE.*LIKE\s+'%/i.test(sql)) {
    issues.push("**Leading wildcard LIKE** (`LIKE '%value'`) — Cannot use indexes, causes full table scan.");
    suggestions.push("Consider full-text search (`MATCH ... AGAINST` or `to_tsvector`) or restructure to avoid a leading wildcard.");
  }
  if (/WHERE.*LIKE\s+'[^%]/i.test(sql) && !/WHERE.*LIKE\s+'%/i.test(sql)) {
    suggestions.push("Trailing wildcard LIKE (`LIKE 'value%'`) can use an index — ensure the column is indexed.");
  }
  if (/YEAR\s*\(|MONTH\s*\(|DAY\s*\(|DATEPART\s*\(/i.test(sql)) {
    issues.push("**Function on indexed column** — Wrapping a column in YEAR(), MONTH(), etc. prevents index use.");
    suggestions.push("Use range conditions instead: `created_at >= '2024-01-01' AND created_at < '2025-01-01'`");
  }
  if (/OR\b/i.test(sql) && /WHERE/i.test(sql)) {
    issues.push("**OR in WHERE clause** — Can prevent index use depending on the optimizer.");
    suggestions.push("Consider rewriting OR conditions as UNION: `SELECT ... WHERE cond1 UNION SELECT ... WHERE cond2`");
  }
  if (/NOT IN\s*\(/i.test(sql)) {
    issues.push("**NOT IN with subquery** — Poor performance with NULL values; can misfire.");
    suggestions.push("Replace `NOT IN (subquery)` with `NOT EXISTS (...)` — handles NULLs correctly and is often faster.");
  }
  if (/SELECT.*DISTINCT/i.test(sql)) {
    suggestions.push("DISTINCT is expensive — consider whether a GROUP BY or a proper JOIN condition would eliminate duplicates instead.");
  }
  if (!/\bLIMIT\b/i.test(sql) && /SELECT/i.test(sql)) {
    suggestions.push("Add LIMIT to restrict result set size during development and testing.");
  }
  if (!/\bINDEX\b/i.test(sql)) {
    const whereMatch = sql.match(/WHERE\s+([\w.]+)\s*=/i);
    if (whereMatch) suggestions.push(`Ensure \`${whereMatch[1]}\` has an index: \`CREATE INDEX idx_${whereMatch[1].replace(/\./g,"_")} ON table_name(${whereMatch[1].split(".").pop()});\``);
  }
  if (/COUNT\s*\(\s*\*\s*\)/i.test(sql)) {
    suggestions.push("Consider `COUNT(1)` instead of `COUNT(*)` — slightly faster on some engines (MySQL). In PostgreSQL they're equivalent.");
  }
  if (/\bN\+1\b/i.test(sql) || (sql.match(/SELECT/gi) || []).length > 2) {
    suggestions.push("Multiple nested SELECT statements detected — check for N+1 patterns; a single JOIN may be more efficient.");
  }

  const score = Math.max(0, 100 - issues.length * 20);

  return `# SQL Optimization Report

## Performance Score: ${score}/100

${issues.length === 0 ? "✅ No major performance issues detected." : `## Issues Found (${issues.length})\n\n${issues.map((issue, i) => `### Issue ${i + 1}: ${issue}`).join("\n\n")}`}

## Optimization Suggestions

${suggestions.length > 0 ? suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n\n") : "✅ Query looks well-optimized."}

## General Best Practices

1. **Indexing** — Add indexes on columns used in WHERE, JOIN ON, and ORDER BY. Run \`EXPLAIN ANALYZE\` to see if indexes are being used.
2. **Avoid functions on indexed columns** — Use range conditions instead of wrapping columns in functions.
3. **Use EXPLAIN/EXPLAIN ANALYZE** — Always profile before and after optimization changes.
4. **Pagination** — Use keyset/cursor pagination instead of OFFSET for large datasets.
5. **Connection pooling** — Use PgBouncer or similar to reduce connection overhead.
6. **Read replicas** — Route SELECT queries to read replicas for heavy reporting loads.

## Optimized Query

\`\`\`sql
${sql.replace(/SELECT\s+\*/i, "SELECT id, [specify columns]").replace(/YEAR\s*\(([^)]+)\)\s*=\s*(\d{4})/gi, "$1 >= '$2-01-01' AND $1 < '[NEXT_YEAR]-01-01'").trim()}
\`\`\``;
}

// ────────────────────────────── tool registry ────────────────────────────────

type Field =
  | { type: "textarea"; key: string; label: string; placeholder: string; rows?: number }
  | { type: "text"; key: string; label: string; placeholder: string }
  | { type: "select"; key: string; label: string; options: { value: string; label: string }[] };

interface ToolDef {
  title: string;
  description: string;
  fields: Field[];
  generate: (values: Record<string, string>) => string;
  buttonLabel?: string;
  outputRows?: number;
}

const TOOLS: Record<string, ToolDef> = {
  "ai-resume-analyzer": {
    title: "AI Resume Analyzer",
    description: "Paste your resume text to get an ATS score, section analysis, and actionable improvement tips.",
    fields: [{ type: "textarea", key: "text", label: "Resume Text", placeholder: "Paste your resume text here…", rows: 12 }],
    generate: (v) => resumeAnalyzer(v.text ?? ""),
    buttonLabel: "Analyze Resume",
  },
  "ai-seo-audit": {
    title: "AI SEO Audit",
    description: "Paste your page HTML or content to get a detailed on-page SEO audit with scores and recommendations.",
    fields: [{ type: "textarea", key: "content", label: "Page HTML or Content", placeholder: "Paste your page HTML or raw content here…", rows: 10 }],
    generate: (v) => seoAudit(v.content ?? ""),
    buttonLabel: "Run SEO Audit",
  },
  "ai-keyword-cluster": {
    title: "AI Keyword Cluster Generator",
    description: "Enter your keywords (one per line or comma-separated) and get them clustered by search intent.",
    fields: [{ type: "textarea", key: "input", label: "Keywords", placeholder: "best project management tool\nhow to use Notion\nbuy project management software\nNotion vs Asana\n…", rows: 8 }],
    generate: (v) => keywordCluster(v.input ?? ""),
    buttonLabel: "Cluster Keywords",
  },
  "ai-proposal-generator": {
    title: "AI Proposal Generator",
    description: "Fill in the details and get a full professional project proposal you can customize and send.",
    fields: [
      { type: "text", key: "client", label: "Client Name", placeholder: "Acme Corp" },
      { type: "text", key: "company", label: "Your Company Name", placeholder: "Your Agency / Name" },
      { type: "textarea", key: "project", label: "Project Name / Title", placeholder: "e.g. E-commerce website redesign", rows: 2 },
      { type: "textarea", key: "scope", label: "Scope of Work", placeholder: "Briefly describe what will be delivered…", rows: 3 },
      { type: "text", key: "budget", label: "Budget", placeholder: "e.g. $5,000 or $2,500/month" },
      { type: "text", key: "timeline", label: "Timeline", placeholder: "e.g. 4 weeks or 2 months" },
    ],
    generate: proposalGenerator,
    buttonLabel: "Generate Proposal",
    outputRows: 60,
  },
  "ai-sql-generator": {
    title: "AI SQL Generator",
    description: "Describe your query in plain English and get SQL you can run immediately.",
    fields: [{ type: "textarea", key: "description", label: "Describe your query", placeholder: "Show me the top 10 customers by total orders in the last 30 days\nGet all users where email is not verified\nCount orders grouped by product category…", rows: 4 }],
    generate: (v) => sqlGenerator(v.description ?? ""),
    buttonLabel: "Generate SQL",
  },
  "ai-code-explainer": {
    title: "AI Code Explainer",
    description: "Paste any code snippet and get a plain-English explanation with concept breakdown and issue detection.",
    fields: [
      {
        type: "select", key: "language", label: "Language (optional)", options: [
          { value: "auto", label: "Auto-detect" },
          { value: "JavaScript", label: "JavaScript" },
          { value: "TypeScript", label: "TypeScript" },
          { value: "Python", label: "Python" },
          { value: "Java", label: "Java" },
          { value: "Go", label: "Go" },
          { value: "Rust", label: "Rust" },
          { value: "SQL", label: "SQL" },
          { value: "CSS", label: "CSS" },
          { value: "Bash", label: "Bash" },
        ]
      },
      { type: "textarea", key: "code", label: "Code to Explain", placeholder: "Paste your code here…", rows: 12 },
    ],
    generate: codeExplainer,
    buttonLabel: "Explain Code",
  },
  "ai-business-plan": {
    title: "AI Business Plan Generator",
    description: "Enter your business details and get a complete, investor-ready business plan structure.",
    fields: [
      { type: "text", key: "business", label: "Business Name", placeholder: "e.g. Acme SaaS" },
      { type: "text", key: "industry", label: "Industry", placeholder: "e.g. FinTech, EdTech, E-commerce" },
      { type: "textarea", key: "description", label: "What does your business do?", placeholder: "e.g. provides automated invoice processing software for small businesses", rows: 3 },
      { type: "text", key: "market", label: "Target Market", placeholder: "e.g. freelancers and small business owners" },
      { type: "text", key: "revenue", label: "Revenue Model", placeholder: "e.g. SaaS subscription, marketplace fees, one-time purchase" },
    ],
    generate: businessPlan,
    buttonLabel: "Generate Business Plan",
    outputRows: 70,
  },
  "ai-product-description": {
    title: "AI Product Description Generator",
    description: "Generate multiple product descriptions optimized for different channels and tones.",
    fields: [
      { type: "text", key: "product", label: "Product Name", placeholder: "e.g. ProDesk Standing Desk" },
      { type: "textarea", key: "features", label: "Key Features (one per line or comma-separated)", placeholder: "Adjustable height 60–120cm\nOak wood top\nMemory presets\n…", rows: 4 },
      { type: "text", key: "audience", label: "Target Audience", placeholder: "e.g. remote workers and home office professionals" },
      {
        type: "select", key: "tone", label: "Tone", options: [
          { value: "professional", label: "Professional" },
          { value: "casual", label: "Casual & Friendly" },
          { value: "luxury", label: "Luxury / Premium" },
          { value: "technical", label: "Technical" },
        ]
      },
    ],
    generate: productDescriptionEnhanced,
    buttonLabel: "Generate Descriptions",
    outputRows: 60,
  },
  "ai-meeting-notes": {
    title: "AI Meeting Notes Generator",
    description: "Paste your raw meeting notes or bullets and get structured, shareable meeting minutes.",
    fields: [{ type: "textarea", key: "input", label: "Raw Meeting Notes", placeholder: "Attendees: John, Sarah, Mike\nDiscussed Q3 roadmap\nJohn will create the design mockups by Friday\nDecided to use React for the frontend\nAction: Sarah to send updated budget to team by EOD\n…", rows: 10 }],
    generate: (v) => meetingNotes(v.input ?? ""),
    buttonLabel: "Generate Meeting Notes",
    outputRows: 50,
  },
  "sql-formatter": {
    title: "SQL Formatter",
    description: "Paste minified or messy SQL and get it reformatted with consistent indentation and keyword casing.",
    fields: [{ type: "textarea", key: "sql", label: "SQL to Format", placeholder: "select u.id,u.name,o.total from users u inner join orders o on u.id=o.user_id where o.status='active' order by o.total desc limit 10", rows: 8 }],
    generate: (v) => formatSql(v.sql ?? ""),
    buttonLabel: "Format SQL",
  },
  "sql-explainer": {
    title: "SQL Explainer",
    description: "Paste a SQL query and get a plain-English explanation of what it does, clause by clause.",
    fields: [{ type: "textarea", key: "sql", label: "SQL Query", placeholder: "SELECT u.name, COUNT(o.id) AS total_orders\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.created_at > NOW() - INTERVAL '30 days'\nGROUP BY u.name\nHAVING COUNT(o.id) > 5\nORDER BY total_orders DESC\nLIMIT 20;", rows: 10 }],
    generate: (v) => explainSql(v.sql ?? ""),
    buttonLabel: "Explain SQL",
  },
  "sql-optimizer": {
    title: "SQL Query Optimizer",
    description: "Paste your SQL query and get optimization suggestions for better performance.",
    fields: [{ type: "textarea", key: "sql", label: "SQL Query to Optimize", placeholder: "SELECT * FROM orders WHERE YEAR(created_at) = 2024 AND status = 'active'", rows: 8 }],
    generate: (v) => optimizeSql(v.sql ?? ""),
    buttonLabel: "Optimize SQL",
  },
};

// ───────────────────────────────── component ─────────────────────────────────

export function AiToolsSuite() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "ai-resume-analyzer";
  const tool = TOOLS[slug] ?? TOOLS["ai-resume-analyzer"];

  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const set = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const canGenerate = tool.fields
    .filter((f) => f.type !== "select")
    .some((f) => (values[f.key] ?? "").trim().length > 0);

  const generate = () => {
    setOutput(tool.generate(values));
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{tool.title}</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400">
          Template-based generator — fully client-side, no AI API needed. Edit the output to customise for your needs.
        </div>

        {tool.fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">{field.label}</label>
            {field.type === "textarea" && (
              <Textarea
                value={values[field.key] ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows ?? 5}
                className="resize-none text-sm"
              />
            )}
            {field.type === "text" && (
              <Input
                value={values[field.key] ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="text-sm"
              />
            )}
            {field.type === "select" && (
              <select
                value={values[field.key] ?? field.options[0]?.value ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {field.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
          </div>
        ))}

        <Button onClick={generate} disabled={!canGenerate} className="w-full gap-2">
          <RefreshCw className="w-4 h-4" />
          {tool.buttonLabel ?? "Generate"}
        </Button>

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Generated output</span>
              <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1">
                {copied ? <><CheckCircle2 className="w-3 h-3 text-emerald-500" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
              </Button>
            </div>
            <Textarea
              readOnly
              value={output}
              rows={tool.outputRows ?? 30}
              className="resize-none text-sm font-mono bg-muted/20"
            />
          </div>
        )}
      </div>
    </div>
  );
}
