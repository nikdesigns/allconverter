"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Template-based generators — fully client-side, no AI API needed
// Each generator produces structured output based on the user's topic input

function blogOutline(topic: string): string {
  return `# Blog Post Outline: ${topic}

## Introduction
- Hook: Attention-grabbing opening about ${topic}
- Problem statement: Why this matters to your readers
- Promise: What readers will learn in this post

## Section 1: Understanding ${topic}
- What is ${topic} and why it matters
- Common misconceptions
- Key terminology

## Section 2: Benefits of ${topic}
- Top 5 benefits you need to know
- Real-world examples
- Data and statistics

## Section 3: How to Get Started with ${topic}
- Step 1: Preparation and research
- Step 2: Implementation basics
- Step 3: Best practices and tips

## Section 4: Common Mistakes to Avoid
- Mistake 1 and how to fix it
- Mistake 2 and how to fix it
- Expert tips for success

## Section 5: Advanced Techniques
- Pro-level strategies for ${topic}
- Tools and resources
- Case studies

## Conclusion
- Recap of key points
- Call to action
- Next steps for readers

---
*Estimated read time: 8–12 minutes*
*Target keywords: ${topic}, ${topic} guide, how to ${topic}*`;
}

function faqContent(topic: string): string {
  return `# Frequently Asked Questions: ${topic}

**Q1: What is ${topic} and how does it work?**
A: ${topic} is a widely-used approach that helps businesses and individuals achieve better results. It works by combining proven techniques with modern best practices to deliver consistent outcomes.

**Q2: Who should use ${topic}?**
A: ${topic} is ideal for beginners and professionals alike. Anyone looking to improve their results in this area can benefit, regardless of experience level.

**Q3: How long does it take to see results from ${topic}?**
A: Most users see initial results within 2–4 weeks of consistent implementation. Full benefits are typically realized within 3–6 months depending on your goals.

**Q4: What are the main benefits of ${topic}?**
A: The key benefits include improved efficiency, cost savings, better outcomes, and a competitive advantage in your field. Many users report 30–50% improvement after implementing ${topic}.

**Q5: Is ${topic} suitable for small businesses?**
A: Absolutely. ${topic} scales to fit any business size. Small businesses often see the biggest relative gains because they can implement changes quickly without bureaucratic overhead.

**Q6: What tools do I need for ${topic}?**
A: You can start with basic tools available for free. As you advance, specialized tools can help automate and optimize your ${topic} workflow significantly.

**Q7: How much does ${topic} cost?**
A: Costs vary widely depending on scale and approach. Many start for free or low-cost, with premium options available as needs grow.

**Q8: Where can I learn more about ${topic}?**
A: Industry blogs, online courses, and community forums are excellent resources. Look for certified experts and case studies specific to your industry.`;
}

function productDescription(topic: string): string {
  return `## ${topic}

**Transform your experience with the most advanced ${topic} solution available.**

### Overview
Introducing our premium ${topic} — designed for professionals who demand the best. Built with cutting-edge technology and an intuitive interface, this solution delivers unmatched performance from day one.

### Key Features
✅ **Industry-leading performance** — 3× faster than competitors
✅ **Easy setup** — Get started in under 5 minutes
✅ **24/7 support** — Expert help whenever you need it
✅ **Flexible pricing** — Plans for every budget
✅ **Proven results** — Trusted by 50,000+ customers worldwide

### What You Get
- Full access to all premium features
- Regular updates and improvements
- Detailed documentation and tutorials
- 30-day money-back guarantee

### Perfect For
- Businesses looking to scale efficiently
- Professionals who value quality and reliability
- Teams that need collaboration features
- Anyone who wants results without complexity

### Customer Reviews
⭐⭐⭐⭐⭐ *"${topic} completely transformed how we work. Worth every penny."*

### Pricing
Starting at **$29/month** — Cancel anytime.

**[Get Started Today →]**`;
}

function socialPost(topic: string): string {
  return `# Social Media Posts: ${topic}

---
### Twitter/X (280 chars)
Struggling with ${topic}? Here's what nobody tells you: 🧵

The secret isn't working harder. It's working smarter with the right system. Here's the exact framework that changed everything for me 👇

[Thread continues...]

---
### LinkedIn
I spent 5 years getting ${topic} wrong.

Then I learned these 3 principles that changed everything:

1️⃣ **Focus on fundamentals first.** Most people skip this step.

2️⃣ **Consistency beats intensity.** Small daily actions compound over time.

3️⃣ **Measure what matters.** Track the right metrics, not vanity numbers.

The result? 10× improvement in under 6 months.

What's your approach to ${topic}? Drop it in the comments 👇

#${topic.replace(/\s+/g,"")} #Growth #Success #Business

---
### Instagram Caption
The ${topic} game changed when I started doing this one thing 💡

Swipe through to see the full breakdown →

Saving this post? Follow for more tips on ${topic} every week 🔥

#${topic.replace(/\s+/g,"")} #Tips #Viral #Growth #Trending

---
### Facebook
📣 Big news for everyone interested in ${topic}!

We've just published a comprehensive guide covering everything you need to know — from basics to advanced strategies.

Whether you're just starting or looking to level up, this guide has something for you.

🔗 Link in comments. Share with someone who needs this!`;
}

function emailContent(topic: string): string {
  return `Subject: You asked about ${topic} — here's everything

Hi [First Name],

Thank you for your interest in ${topic}.

I wanted to reach out personally to share a few things that most people miss when getting started.

**The #1 mistake with ${topic}**

Most people jump straight to tactics without understanding the fundamentals. The result? Wasted time, money, and effort.

Here's what actually works:

1. **Start with a clear goal.** What does success look like for you with ${topic}?

2. **Build the right foundation.** Before scaling, make sure your core setup is solid.

3. **Track and iterate.** Data beats intuition every time.

**What's next for you**

Over the next few emails, I'll share:
- The exact framework I use for ${topic}
- Real case studies and results
- Tools and resources I recommend

If you have questions about ${topic} in the meantime, just hit reply — I read every email.

Talk soon,
[Your Name]

P.S. Have you seen our free guide on ${topic}? [Click here to download it →]

---
*You received this because you signed up for our newsletter.*
*Unsubscribe | Update preferences*`;
}

function subjectLines(topic: string): string {
  return `# Email Subject Lines: ${topic}

## Curiosity
• Nobody told me this about ${topic}
• The ${topic} secret I wish I knew sooner
• Why your ${topic} strategy isn't working (and the fix)
• What the top 1% do differently with ${topic}

## Urgency / Scarcity
• Last chance: Our ${topic} guide is being updated soon
• [Closing soon] Get our ${topic} toolkit before it's gone
• Only 24 hours left to grab this ${topic} resource

## Direct / Clear
• A complete guide to ${topic} (free)
• How to master ${topic} in 30 days
• ${topic}: Everything you need to know
• Step-by-step: Getting started with ${topic}

## Question-based
• Are you making these ${topic} mistakes?
• Can you really master ${topic} in a week?
• What's your biggest challenge with ${topic}?

## Numbers / Lists
• 7 ${topic} strategies that actually work
• 10 things I learned about ${topic} this year
• 3 reasons your ${topic} isn't getting results

## Personal
• My #1 lesson from 5 years of ${topic}
• I tried 12 approaches to ${topic}. Here's what worked.
• How I improved my ${topic} results by 300%`;
}

function headlineContent(topic: string): string {
  return `# Headlines: ${topic}

## How-to Headlines
• How to Master ${topic} in 30 Days (Even If You're a Complete Beginner)
• How to Get Better Results with ${topic} Without Working Harder
• How ${topic} Can Change Your Business in 90 Days

## List Headlines
• 10 Proven ${topic} Strategies That Actually Work in 2024
• 7 ${topic} Mistakes You're Probably Making Right Now
• 5 Things the Best ${topic} Experts Do Every Day

## Question Headlines
• Is Your ${topic} Strategy Costing You Money?
• What Would Your Business Look Like With a Better ${topic} System?
• Are You Getting the Most Out of Your ${topic} Investment?

## "Secrets" / Exclusive
• The ${topic} Secret Nobody Is Talking About
• What Industry Experts Don't Tell You About ${topic}
• The Hidden ${topic} Strategy Top Performers Use

## Fear-of-Missing-Out
• Don't Make This Common ${topic} Mistake
• The ${topic} Mistake That's Killing Your Results
• Why Your Competitors Are Winning at ${topic} (And You're Not)

## Benefit-focused
• Get Better ${topic} Results With Half the Effort
• Transform Your ${topic} Results in Under a Month
• The Fastest Way to Improve Your ${topic} Performance`;
}

function youtubeTitles(topic: string): string {
  return `# YouTube Titles: ${topic}

## How-To / Tutorial
• How to ${topic} — Complete Beginner's Guide (${new Date().getFullYear()})
• How I Mastered ${topic} in 30 Days (Step-by-Step)
• ${topic} Tutorial for Beginners — Everything You Need to Know
• How to ${topic} FAST — The Only Guide You'll Need

## Listicles
• 10 ${topic} Tips That Actually Work
• 7 Mistakes Everyone Makes with ${topic} (And How to Fix Them)
• Top 5 ${topic} Strategies for ${new Date().getFullYear()}
• The Ultimate ${topic} Checklist (Free Download)

## Story / Curiosity
• I Tried ${topic} for 30 Days — Here's What Happened
• What Nobody Tells You About ${topic}
• Why Your ${topic} Isn't Working (The Real Reason)
• The ${topic} Secret That Changed Everything for Me

## Vs / Comparison
• ${topic} vs. Old Method — Which Is Better?
• Best ${topic} Tools Compared — My Honest Review
• Free vs. Paid ${topic}: Which Should You Choose?

## Short / Punchy (Under 50 chars)
• ${topic} Guide (${new Date().getFullYear()})
• Master ${topic} Today
• ${topic} — The Full Breakdown
• ${topic} Explained Simply`;
}

function youtubeDescription(topic: string): string {
  return `In this video, I'll show you exactly how to ${topic} — from scratch. Whether you're a complete beginner or looking to level up, this step-by-step guide has everything you need.

📌 WHAT YOU'LL LEARN IN THIS VIDEO:
✅ The basics of ${topic} explained simply
✅ Common mistakes to avoid when getting started
✅ My proven step-by-step process for ${topic}
✅ Advanced tips to get faster results
✅ The exact tools I use (free & paid options)

⏱️ TIMESTAMPS:
0:00 — Introduction
1:30 — What is ${topic}?
4:00 — Getting Started: Step 1
8:30 — The Most Common Mistakes
12:00 — Advanced Strategies
16:30 — My Full Process Revealed
20:00 — Results & Next Steps
22:00 — Q&A and Wrap-Up

🔗 RESOURCES MENTIONED:
• Free ${topic} Checklist → [Link in comments]
• Recommended Tools → [Link]
• Free Course → [Link]

👍 If this helped you, please LIKE and SUBSCRIBE — it means the world to me and helps more people find this content!

💬 Drop a COMMENT below with your biggest ${topic} question — I read every one.

📧 CONTACT & SOCIAL:
• Instagram: @YourHandle
• Twitter/X: @YourHandle
• Email: hello@example.com

#${topic.replace(/\s+/g,"")} #${topic.replace(/\s+/g,"")}Tips #HowTo #Tutorial #${new Date().getFullYear()}

---
DISCLAIMER: This video is for educational purposes only. Results may vary based on individual circumstances and effort applied.`;
}

function linkedinPost(topic: string): string {
  return `I spent 3 years getting ${topic} completely wrong.

Then one conversation changed everything.

Here's what I learned (and what I wish someone had told me earlier):

↳ Most people start with the wrong foundation.
They focus on tactics before strategy. It never works.

↳ The #1 thing that actually moves the needle:
Consistency over intensity. 90 days of focused effort beats 1 year of scattered attempts.

↳ What the top 1% do differently:
They measure outcomes, not activity.
Not "how many hours did I work" but "what result did I create?"

The mindset shift that changed everything for me:

Stop asking "How do I do ${topic}?"
Start asking "What does success with ${topic} actually look like for me?"

Once I got clear on the outcome, the path became obvious.

Here's my simple 3-step framework:
1️⃣ Define your specific goal
2️⃣ Identify the 2–3 actions that drive 80% of results
3️⃣ Eliminate everything else

The uncomfortable truth: most people fail at ${topic} not because of lack of knowledge — but lack of focus.

What's your biggest challenge with ${topic} right now?
Drop it in the comments 👇 I'd love to help.

—
P.S. If this resonated, repost ♻️ to help someone in your network who's struggling with ${topic}.

#${topic.replace(/\s+/g,"")} #Growth #Leadership #PersonalDevelopment #CareerAdvice`;
}

function hookContent(topic: string): string {
  return `# Scroll-Stopping Hooks: ${topic}

## Pattern Interrupt
• "Nobody talks about this side of ${topic}…"
• "Stop scrolling if you're struggling with ${topic}."
• "Forget everything you've heard about ${topic}."
• "This single ${topic} mistake cost me $10,000."

## Bold Statement
• "The way you're doing ${topic} is backwards."
• "${topic} doesn't have to be this hard — here's proof."
• "I cracked the code on ${topic} so you don't have to."
• "Most ${topic} advice is wrong. Here's what actually works."

## Curiosity Gap
• "The one thing about ${topic} they never teach you…"
• "What happens when you do ${topic} the right way? This:"
• "I tested 12 ways to do ${topic}. Only one worked."
• "The ${topic} secret hiding in plain sight:"

## Relatable Problem
• "Tired of ${topic} not working no matter what you try?"
• "If ${topic} feels overwhelming, read this."
• "I used to hate ${topic}. Then I tried this."
• "Still struggling with ${topic}? It's not your fault."

## Social Proof / Story
• "I went from zero to results with ${topic} in 60 days. Here's how:"
• "After talking to 500+ people about ${topic}, here's what I found:"
• "My client doubled their results with this one ${topic} change:"
• "5 years doing ${topic} wrong. 1 year doing it right. Here's the difference:"

## Question Hook
• "What if ${topic} was actually easy?"
• "What's the real reason your ${topic} isn't working?"
• "Are you making this common ${topic} mistake?"
• "When was the last time ${topic} actually worked for you?"`;
}

function coldEmail(topic: string): string {
  return `# Cold Email Templates: ${topic}

---
## Template 1: Short & Punchy (Best Open Rate)

Subject: Quick question about your ${topic}

Hi [First Name],

I'll keep this short.

I help [ICP — e.g., B2B SaaS companies] improve their ${topic} results.

Most I speak to are dealing with [Pain Point 1] or [Pain Point 2].

Does that sound familiar?

If so, I have a specific idea that might help. Worth a 15-minute call?

[Your Name]
[Title] | [Company]

---
## Template 2: Value-First

Subject: [Company]'s ${topic} — one quick idea

Hi [First Name],

I was looking at your [website/LinkedIn/content] and noticed [specific observation].

Many companies in [their industry] are seeing strong results from [specific ${topic} approach] — typically [specific outcome like "20–30% improvement"].

I put together a quick breakdown of how this might apply to [Company Name].

Want me to send it over?

[Your Name]

---
## Template 3: Problem-Led

Subject: Are you seeing this with your ${topic}?

Hi [First Name],

Quick question: are you running into [specific ${topic} problem] at [Company]?

It's the #1 thing I hear from [their role] at [company size] companies.

We recently helped [similar company] solve this and they saw [result] in [timeframe].

Open to a quick 10-minute call to see if we can do the same for you?

[Your Name]

---
## Follow-Up (Day 3–5):

Subject: Re: ${topic}

Hi [First Name],

Just bumping this in case it got buried.

Happy to send over a quick case study showing exactly how we tackled this for [similar company].

Worth a look?

[Your Name]

---
Tips:
• Personalize the first line for every email
• Keep emails under 100 words — shorter = higher reply rate
• One clear CTA only: "Worth a call?" or "Want me to send it over?"
• Test subject lines — curiosity outperforms clever every time`;
}

function coverLetter(context: string): string {
  return `# Cover Letter — ${context}

---

[Your Name]
[Your Address]
[City, State, PIN]
[Email] | [Phone] | [LinkedIn]
[Date]

Hiring Manager
${context}
[Company Address]

Dear Hiring Manager,

I am writing to express my strong interest in the [Job Title] position at [Company Name]. With [X years] of experience in [relevant field/industry] and a proven track record of [key achievement], I am confident in my ability to contribute meaningfully to your team.

In my current/previous role at [Previous Company], I [specific achievement 1 — quantified]. I also [specific achievement 2 — quantified]. These experiences have equipped me with [3 key skills relevant to the role], which I understand are central to this position.

What excites me most about [Company Name] is [specific reason — product, mission, culture, growth]. I have followed your work on [specific project/product/initiative] and believe my background in [relevant area] would allow me to make an immediate impact.

I am particularly skilled at:
• [Skill 1] — demonstrated by [brief example]
• [Skill 2] — demonstrated by [brief example]
• [Skill 3] — demonstrated by [brief example]

I would welcome the opportunity to discuss how my experience aligns with [Company Name]'s goals. I am available for an interview at your earliest convenience and can be reached at [phone/email].

Thank you for considering my application. I look forward to the possibility of contributing to [Company Name].

Sincerely,
[Your Name]

---
📌 Tips for personalizing:
• Replace all [brackets] with your actual details
• Research the company and add 1 specific thing that excites you about them
• Quantify achievements (e.g., "increased sales by 32%", "managed team of 8")
• Keep to one page — ideally 3–4 paragraphs
• Match keywords from the job description for ATS optimization`;
}

function linkedinOptimizer(context: string): string {
  return `# LinkedIn Profile Optimization — ${context}

---

## 🎯 Headline (max 220 characters)

**Option 1 (Role + Value):**
[Job Title] | Helping [target audience] achieve [outcome] | [Key Skill] | [Industry]

**Option 2 (Achievement-led):**
[Job Title] @ [Company] | [X years] in [Industry] | [Key Strength] | Open to [opportunities]

**Option 3 (Keyword-rich):**
[Title] | [Skill 1] | [Skill 2] | [Industry] Expert | [Location or Remote]

---

## 📝 About Section (Summary)

I'm a [job title] with [X years] of experience helping [target audience] [achieve specific outcome].

Currently at [Company], I focus on [main responsibility]. My work has resulted in [achievement — quantified if possible].

What I do best:
✅ [Skill / service 1]
✅ [Skill / service 2]
✅ [Skill / service 3]

I'm passionate about [relevant topic] and believe [brief philosophy or approach].

Previously, I've worked with [types of companies/clients] to [solve what problem]. I bring a [unique angle — e.g., data-driven / creative / systems-thinking] approach to everything I do.

📫 Open to: [freelance / full-time / consulting / speaking]
📍 Based in: [City] | [Remote-friendly]

---

## 💼 Experience Bullet Points (for each role)

Instead of writing duties, use this formula:
**[Action verb] + [what you did] + [result/impact]**

Examples:
• Led redesign of [product/process], reducing [metric] by [X]%
• Grew [channel/metric] from [X] to [Y] in [timeframe]
• Built and managed a team of [X] people across [departments]
• Closed [X] deals worth [₹/$ value] in [timeframe]
• Launched [project] that [outcome] for [client/company]

---

## 🏷️ Skills to Add (for discoverability)

Top 5 (shown on profile): [Skill 1], [Skill 2], [Skill 3], [Skill 4], [Skill 5]
Additional: [10–15 more relevant skills from the job description]

---

## 📌 Quick wins checklist:
☐ Professional headshot (increases profile views by 14×)
☐ Custom banner image with your tagline
☐ Custom LinkedIn URL (linkedin.com/in/yourname)
☐ 500+ connections
☐ Request recommendations from managers/clients
☐ Post content 2–3× per week in your area of expertise
☐ Add certifications and courses to show continuous learning

Context provided: ${context}`;
}

function rewriteContent(text: string): string {
  if (!text.trim()) return "";
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const rewrites = sentences.map(s => {
    s = s.trim();
    const synonyms: [string, string][] = [
      ["utilize","use"],["leverage","use"],["implement","apply"],["facilitate","help"],
      ["commence","start"],["terminate","end"],["numerous","many"],["obtain","get"],
      ["provide","give"],["require","need"],["important","key"],["significant","major"],
    ];
    let r = s;
    for (const [from, to] of synonyms) r = r.replace(new RegExp(`\\b${from}\\b`,"gi"), to);
    return r;
  });
  return `**Original:**\n${text}\n\n**Rewritten (Professional):**\n${rewrites.join(" ")}\n\n**Rewritten (Casual):**\n${text.replace(/\. /g, "! ").replace(/We /g, "You ").replace(/the company/gi, "you")}\n\n**Rewritten (Shorter):**\n${text.split(" ").filter((_,i)=>i%3!==2).join(" ").slice(0, text.length * 0.7)}...`;
}

const TOOLS: Record<string,{ title: string; hasTopicInput: boolean; generate: (v:string)=>string }> = {
  "blog-outline-generator":         { title:"Blog Outline Generator",          hasTopicInput:true,  generate: blogOutline },
  "faq-generator":                  { title:"FAQ Generator",                   hasTopicInput:true,  generate: faqContent },
  "product-description-generator":  { title:"Product Description Generator",   hasTopicInput:true,  generate: productDescription },
  "social-post-generator":          { title:"Social Post Generator",           hasTopicInput:true,  generate: socialPost },
  "email-generator":                { title:"Email Generator",                 hasTopicInput:true,  generate: emailContent },
  "subject-line-generator":         { title:"Subject Line Generator",          hasTopicInput:true,  generate: subjectLines },
  "headline-generator":             { title:"Headline Generator",              hasTopicInput:true,  generate: headlineContent },
  "rewrite-tool":                   { title:"Text Rewriter",                   hasTopicInput:false, generate: rewriteContent },
  "youtube-title-generator":        { title:"YouTube Title Generator",         hasTopicInput:true,  generate: youtubeTitles },
  "youtube-description-generator":  { title:"YouTube Description Generator",   hasTopicInput:true,  generate: youtubeDescription },
  "linkedin-post-generator":        { title:"LinkedIn Post Generator",         hasTopicInput:true,  generate: linkedinPost },
  "hook-generator":                 { title:"Hook Generator",                  hasTopicInput:true,  generate: hookContent },
  "cold-email-generator":           { title:"Cold Email Generator",            hasTopicInput:true,  generate: coldEmail },
  "ai-cover-letter":                { title:"AI Cover Letter Generator",       hasTopicInput:true,  generate: coverLetter },
  "ai-linkedin-optimizer":          { title:"AI LinkedIn Profile Optimizer",   hasTopicInput:true,  generate: linkedinOptimizer },
};

export function ContentGeneratorTool() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "blog-outline-generator";
  const tool = TOOLS[slug] ?? TOOLS["blog-outline-generator"];

  const [topic, setTopic] = useState(tool.hasTopicInput ? "" : "");
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const input = tool.hasTopicInput ? topic : text;
    if (!input.trim()) return;
    setOutput(tool.generate(input));
  };

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400">
          Template-based generator — edit the output to customize for your needs. No AI API required.
        </div>
        {tool.hasTopicInput ? (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Topic / Subject</label>
            <Input value={topic} onChange={e=>setTopic(e.target.value)} placeholder={`Enter your topic… e.g. "remote work productivity"`} className="text-sm" />
          </div>
        ) : (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Text to rewrite</label>
            <Textarea value={text} onChange={e=>setText(e.target.value)} className="min-h-[120px] resize-none text-sm" placeholder="Paste your text here…" />
          </div>
        )}
        <Button onClick={generate} disabled={!(tool.hasTopicInput ? topic : text).trim()} className="w-full gap-2">
          <RefreshCw className="w-4 h-4" />Generate
        </Button>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Generated content</span>
              <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
            </div>
            <Textarea readOnly value={output} className="min-h-[400px] resize-none text-sm font-mono bg-muted/20" />
          </div>
        )}
      </div>
    </div>
  );
}
