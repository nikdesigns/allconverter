"use client";

import { useState } from "react";
import { Sparkles, Copy, Plus, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Experience { title: string; company: string; location: string; start: string; end: string; bullets: string }
interface Education  { degree: string; school: string; location: string; year: string; gpa: string }

const TABS = ["Personal", "Summary", "Experience", "Education", "Skills", "Preview"] as const;
type Tab = typeof TABS[number];

function buildResume(
  personal: Record<string, string>,
  summary: string,
  experiences: Experience[],
  educations: Education[],
  skills: string,
  certifications: string,
  projects: string,
): string {
  const e = experiences.filter(e => e.title || e.company);
  const ed = educations.filter(e => e.degree || e.school);
  const sk = skills.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
  const certs = certifications.split("\n").map(s => s.trim()).filter(Boolean);
  const projs = projects.split("\n\n").map(s => s.trim()).filter(Boolean);

  return [
    // Header
    `${personal.name || "Your Name"}`,
    `${[personal.email, personal.phone, personal.location].filter(Boolean).join("  |  ")}`,
    personal.linkedin ? `LinkedIn: ${personal.linkedin}` : "",
    personal.portfolio ? `Portfolio: ${personal.portfolio}` : "",
    "",
    // Summary
    summary ? ["PROFESSIONAL SUMMARY", "─".repeat(40), summary, ""].join("\n") : "",
    // Experience
    e.length > 0 ? ["WORK EXPERIENCE", "─".repeat(40),
      ...e.map(x => [
        `${x.title}${x.company ? ` — ${x.company}` : ""}${x.location ? `, ${x.location}` : ""}`,
        `${x.start || ""}${x.end ? ` – ${x.end}` : ""}`,
        ...(x.bullets ? x.bullets.split("\n").filter(Boolean).map(b => `  • ${b.replace(/^[•\-]\s*/,"").trim()}`) : []),
        "",
      ].join("\n")),
    ""].join("\n") : "",
    // Education
    ed.length > 0 ? ["EDUCATION", "─".repeat(40),
      ...ed.map(x => [
        `${x.degree || "Degree"}${x.school ? ` — ${x.school}` : ""}${x.location ? `, ${x.location}` : ""}`,
        `${x.year || ""}${x.gpa ? ` | GPA: ${x.gpa}` : ""}`,
        "",
      ].join("\n")),
    ""].join("\n") : "",
    // Skills
    sk.length > 0 ? ["SKILLS", "─".repeat(40), sk.join("  •  "), ""].join("\n") : "",
    // Certifications
    certs.length > 0 ? ["CERTIFICATIONS", "─".repeat(40), ...certs.map(c => `  • ${c}`), ""].join("\n") : "",
    // Projects
    projs.length > 0 ? ["PROJECTS", "─".repeat(40), ...projs, ""].join("\n") : "",
  ].filter(Boolean).join("\n");
}

export function AiResumeBuilderTool() {
  const [tab, setTab]   = useState<Tab>("Personal");
  const [personal, setPersonal]     = useState<Record<string, string>>({});
  const [summary, setSummary]       = useState("");
  const [skills, setSkills]         = useState("");
  const [certifications, setCerts]  = useState("");
  const [projects, setProjects]     = useState("");
  const [experiences, setExp]       = useState<Experience[]>([
    { title: "", company: "", location: "", start: "", end: "", bullets: "" },
  ]);
  const [educations, setEd]         = useState<Education[]>([
    { degree: "", school: "", location: "", year: "", gpa: "" },
  ]);

  const set = (k: string, v: string) => setPersonal(p => ({ ...p, [k]: v }));
  const setE = (i: number, k: keyof Experience, v: string) =>
    setExp(ex => ex.map((e, j) => j === i ? { ...e, [k]: v } : e));
  const setEd2 = (i: number, k: keyof Education, v: string) =>
    setEd(ed => ed.map((e, j) => j === i ? { ...e, [k]: v } : e));

  const preview = buildResume(personal, summary, experiences, educations, skills, certifications, projects);

  const copy = () => { navigator.clipboard.writeText(preview); toast.success("Resume copied!"); };

  const pField = (label: string, key: string, placeholder?: string) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <Input value={personal[key] ?? ""} onChange={e => set(key, e.target.value)}
        placeholder={placeholder} className="text-sm h-9" />
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">AI Resume Builder</span>
        <span className="ml-auto text-[10px] text-muted-foreground">ATS-Friendly Format</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
                tab === t
                  ? "border-primary/50 bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              )}>
              {t}
            </button>
          ))}
        </div>

        {/* Personal */}
        {tab === "Personal" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pField("Full Name *",    "name",      "John Doe")}
            {pField("Email *",        "email",     "john@example.com")}
            {pField("Phone *",        "phone",     "+91 9876543210")}
            {pField("Location",       "location",  "Mumbai, India")}
            {pField("LinkedIn URL",   "linkedin",  "linkedin.com/in/johndoe")}
            {pField("Portfolio / GitHub", "portfolio", "johndoe.dev")}
          </div>
        )}

        {/* Summary */}
        {tab === "Summary" && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
              A strong summary is 2–4 sentences. Lead with your years of experience, your key skill, and your top achievement. Tailor it to each job.
            </div>
            <Textarea value={summary} onChange={e => setSummary(e.target.value)}
              placeholder={`Results-driven software engineer with 5+ years of experience building scalable web applications. Led a team of 8 engineers at XYZ Corp, delivering a platform used by 2M+ users. Passionate about clean code, performance optimization, and mentoring junior developers.`}
              className="min-h-[120px] resize-none text-sm" />
            <div className="text-xs text-muted-foreground">{summary.split(/\s+/).filter(Boolean).length} words</div>
          </div>
        )}

        {/* Experience */}
        {tab === "Experience" && (
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Experience #{i + 1}</span>
                  {experiences.length > 1 && (
                    <button onClick={() => setExp(ex => ex.filter((_, j) => j !== i))}
                      className="text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs text-muted-foreground mb-1 block">Job Title *</label>
                    <Input value={exp.title} onChange={e => setE(i, "title", e.target.value)} placeholder="Senior Software Engineer" className="text-sm h-9" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Company *</label>
                    <Input value={exp.company} onChange={e => setE(i, "company", e.target.value)} placeholder="Google" className="text-sm h-9" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Location</label>
                    <Input value={exp.location} onChange={e => setE(i, "location", e.target.value)} placeholder="Bangalore, India" className="text-sm h-9" /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-xs text-muted-foreground mb-1 block">Start</label>
                      <Input value={exp.start} onChange={e => setE(i, "start", e.target.value)} placeholder="Jan 2022" className="text-sm h-9" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">End</label>
                      <Input value={exp.end} onChange={e => setE(i, "end", e.target.value)} placeholder="Present" className="text-sm h-9" /></div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Key Achievements (one per line, use action verbs)</label>
                  <Textarea value={exp.bullets} onChange={e => setE(i, "bullets", e.target.value)}
                    placeholder={`Reduced API response time by 40% by implementing Redis caching\nLed migration from monolith to microservices for 3 core services\nMentored 4 junior engineers, improving team velocity by 25%`}
                    className="min-h-[90px] resize-none text-sm" />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1"
              onClick={() => setExp(ex => [...ex, { title: "", company: "", location: "", start: "", end: "", bullets: "" }])}>
              <Plus className="w-3 h-3" /> Add Experience
            </Button>
          </div>
        )}

        {/* Education */}
        {tab === "Education" && (
          <div className="space-y-4">
            {educations.map((ed, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Education #{i + 1}</span>
                  {educations.length > 1 && (
                    <button onClick={() => setEd(e => e.filter((_, j) => j !== i))} className="text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs text-muted-foreground mb-1 block">Degree / Certificate *</label>
                    <Input value={ed.degree} onChange={e => setEd2(i, "degree", e.target.value)} placeholder="B.Tech Computer Science" className="text-sm h-9" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Institution *</label>
                    <Input value={ed.school} onChange={e => setEd2(i, "school", e.target.value)} placeholder="IIT Bombay" className="text-sm h-9" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Location</label>
                    <Input value={ed.location} onChange={e => setEd2(i, "location", e.target.value)} placeholder="Mumbai, India" className="text-sm h-9" /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-xs text-muted-foreground mb-1 block">Year</label>
                      <Input value={ed.year} onChange={e => setEd2(i, "year", e.target.value)} placeholder="2020" className="text-sm h-9" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">GPA / %</label>
                      <Input value={ed.gpa} onChange={e => setEd2(i, "gpa", e.target.value)} placeholder="8.5 / 10" className="text-sm h-9" /></div>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1"
              onClick={() => setEd(e => [...e, { degree: "", school: "", location: "", year: "", gpa: "" }])}>
              <Plus className="w-3 h-3" /> Add Education
            </Button>
          </div>
        )}

        {/* Skills */}
        {tab === "Skills" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Skills (comma or newline separated)</label>
              <Textarea value={skills} onChange={e => setSkills(e.target.value)}
                placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, AWS, Git, Agile, REST APIs"
                className="min-h-[80px] resize-none text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Certifications (one per line)</label>
              <Textarea value={certifications} onChange={e => setCerts(e.target.value)}
                placeholder={`AWS Certified Solutions Architect — 2023\nGoogle Cloud Professional Data Engineer — 2022`}
                className="min-h-[80px] resize-none text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Projects (separate each project with a blank line)</label>
              <Textarea value={projects} onChange={e => setProjects(e.target.value)}
                placeholder={`E-Commerce Platform (React, Node.js, MongoDB)\nBuilt a full-stack e-commerce site with 10k+ monthly users.\nGitHub: github.com/johndoe/shop`}
                className="min-h-[100px] resize-none text-sm" />
            </div>
          </div>
        )}

        {/* Preview */}
        {tab === "Preview" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">ATS-friendly plain text resume</div>
              </div>
              <Button size="sm" onClick={copy} className="gap-1.5 h-8 text-xs">
                <Copy className="w-3 h-3" /> Copy Resume
              </Button>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-border p-6">
              <pre className="text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed">
                {preview || "Fill in the other tabs to generate your resume."}
              </pre>
            </div>
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground space-y-1">
              <p>• Copy and paste into Word, Google Docs, or a text editor</p>
              <p>• Use a clean single-column layout for ATS systems</p>
              <p>• Tailor the summary and skills to match each job description</p>
              <p>• Save as .docx or plain PDF (avoid images/columns for ATS)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
