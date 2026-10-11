import type { ToolCopyMap } from "./types";

export const aiToolsCopy: ToolCopyMap = {
  "smart-background-remover": {
    intro:
      "Smart Background Remover cuts the subject out of a photo automatically. It runs a neural segmentation model directly in your browser: upload a JPG, PNG or WebP, wait while the model finds the foreground, and download a PNG with a transparent background. There are no colour pickers or tolerance sliders to adjust.\n\nThe model is downloaded the first time you use the tool, which can take a little while on a slow connection; after that it is cached. Your photo is processed on your device and never uploaded.",
    steps: [
      ["Upload a photo", "JPG, PNG or WebP."],
      ["Wait for processing", "The first run also downloads the model."],
      ["Download the PNG", "Compare original and result, then save."],
    ],
    faqs: [
      ["Why is the first run slow?", "The segmentation model, tens of megabytes, has to download once. Later runs start much faster."],
      ["Which photos work best?", "A clear subject that contrasts with the background: people, products, pets. Fine hair and glass are the hardest."],
      ["Is my image sent to a server?", "No. The model runs locally in the browser."],
    ],
    uses: [
      "Preparing product photos for an online shop",
      "Making a profile picture with a clean background",
      "Cutting out a subject for a slide or thumbnail",
    ],
  },
  "ai-pdf-chat": {
    intro:
      "AI PDF Chat lets you ask questions about a PDF and returns the passages most relevant to each question. After you upload a file, its text is extracted in your browser and split into chunks; when you ask something, the tool scores the chunks by how well their words match your question and shows the best ones.\n\nThis is keyword retrieval, not a generative language model. It finds and quotes what the document says; it does not write new explanations or reason across sections. It needs a PDF with a real text layer, and nothing is uploaded.",
    steps: [
      ["Upload a PDF", "A text-based document, not a scan."],
      ["Ask a question", "Use the words the document is likely to use."],
      ["Read the matching passages", "Rephrase if the first answer misses."],
    ],
    faqs: [
      ["Is this ChatGPT for PDFs?", "No. It retrieves matching passages locally and does not use a large language model."],
      ["Why did it not find my answer?", "The document may use different wording. Try synonyms or a more specific term."],
      ["Does it work on scanned PDFs?", "No. Run OCR first so the file contains text."],
    ],
    uses: [
      "Finding a clause in a long contract",
      "Locating a figure in a report",
      "Searching a manual for a specific procedure",
    ],
  },
  "ai-resume-analyzer": {
    intro:
      "AI Resume Analyzer reviews the text of a resume against a checklist of things recruiters and applicant tracking systems look for. Paste your resume and it produces a score with notes on sections present or missing, use of action verbs, measurable results, length and contact details.\n\nThe analysis is rule-based and runs in your browser; it is not a language model and it does not compare your resume with a particular job posting. Use it as a quick structural check before tailoring the content yourself.",
    steps: [
      ["Paste your resume text", "Copy it from your document."],
      ["Generate the analysis", "A scored report appears."],
      ["Work through the suggestions", "Fix the gaps and run it again."],
    ],
    faqs: [
      ["Is the score what a real ATS would give?", "No. Each ATS works differently. The score reflects general good practice."],
      ["Does it match my resume to a job description?", "No. Add keywords from the posting yourself."],
      ["Is my resume stored?", "No. It is analysed in the page and not sent anywhere."],
    ],
    uses: [
      "Checking a resume before applying",
      "Finding missing sections or weak bullet points",
      "Giving a student a first round of feedback",
    ],
  },
  "ai-seo-audit": {
    intro:
      "AI SEO Audit checks the on-page SEO basics of HTML or content that you paste in. It looks at the title tag, meta description, heading structure, content length, links, images and structured data, and returns a report with a score and recommendations.\n\nThe audit is a set of rules applied in your browser. It examines only what you paste, so it cannot measure page speed, backlinks, rankings or anything that needs a crawl of the live site.",
    steps: [
      ["Paste page HTML or content", "View Source and copy the full page for best results."],
      ["Generate the audit", "Checks run instantly."],
      ["Act on the findings", "Start with missing titles, descriptions and headings."],
    ],
    faqs: [
      ["Can it audit a URL?", "No. Paste the HTML. That also lets you check unpublished pages."],
      ["Does it check Core Web Vitals?", "No. Use the Website Speed Checker for performance."],
      ["Is it a replacement for a full SEO tool?", "No. It covers on-page fundamentals for a single page."],
    ],
    uses: [
      "Reviewing a page before it goes live",
      "Spotting missing tags on a landing page",
      "Teaching the basics of on-page SEO",
    ],
  },
  "ai-keyword-cluster": {
    intro:
      "AI Keyword Cluster Generator sorts a list of keywords into groups by search intent: informational, commercial, transactional and navigational. Paste keywords one per line or separated by commas and it assigns each to a group, with a note on the kind of content that suits it.\n\nClassification is based on signal words. Terms such as how and what indicate informational intent, best and vs indicate commercial research, and buy and price indicate transactional intent. It does not use search volume or live search results.",
    steps: [
      ["Paste your keywords", "One per line or comma-separated."],
      ["Generate clusters", "Keywords are grouped by intent."],
      ["Plan content", "Match each group to a page type."],
    ],
    faqs: [
      ["How is intent decided?", "By modifier words in each keyword, not by analysing search results."],
      ["Does it show search volume?", "No. Bring volumes from your keyword research tool."],
      ["What if a keyword lands in the wrong group?", "Ambiguous terms happen. Check the actual results page for that query and move it."],
    ],
    uses: [
      "Organising a keyword export into a content plan",
      "Separating blog topics from product-page terms",
      "Briefing writers on the purpose of each page",
    ],
  },
  "ai-proposal-generator": {
    intro:
      "AI Proposal Generator assembles a project proposal from the details you enter: client name, your company, project title, scope of work, budget and timeline. It fills a professional template with an executive summary, scope, timeline, pricing and terms sections.\n\nThe output is produced from a fixed template in your browser, not written by a language model, so think of it as a well-structured first draft. Edit the wording, add specifics about the client's problem, and check the terms before sending.",
    steps: [
      ["Enter project details", "Client, scope, budget and timeline."],
      ["Generate the proposal", "A full draft is produced."],
      ["Copy and customise", "Tailor the language to the client."],
    ],
    faqs: [
      ["Is the proposal ready to send?", "It needs your edits. Templates cannot know the client's situation."],
      ["Are the terms legally reviewed?", "No. Have your own terms checked by a professional."],
      ["Is my client's information stored?", "No. Everything stays in your browser."],
    ],
    uses: [
      "Starting a freelance project proposal",
      "Standardising the structure of agency proposals",
      "Responding quickly to an enquiry",
    ],
  },
  "ai-sql-generator": {
    intro:
      "AI SQL Generator turns a plain-English description into a SQL query by recognising common patterns: selecting and filtering rows, counting and summing, grouping, sorting, limiting, date ranges and simple joins. The result comes with an explanation and suggestions.\n\nIt works by pattern matching in your browser and does not use a language model or know your database schema. Table and column names are inferred from your wording, so expect to adjust them, and always test a generated query on non-production data first.",
    steps: [
      ["Describe the data you need", "Mention table and column names where you can."],
      ["Generate", "A query and explanation appear."],
      ["Adjust and test", "Correct names and run it against test data."],
    ],
    faqs: [
      ["Does it know my tables?", "No. It guesses names from your description."],
      ["Can it write complex queries?", "It handles common patterns. Window functions, CTEs and multi-join logic need hand-writing."],
      ["Which SQL dialect does it produce?", "Standard SQL that runs on most databases with minor changes."],
    ],
    uses: [
      "Drafting a simple report query",
      "Learning how a request maps to SQL clauses",
      "Getting a starting point to refine",
    ],
  },
  "ai-code-explainer": {
    intro:
      "AI Code Explainer analyses a code snippet and describes what it contains. It identifies programming concepts in use, such as async/await, array methods, classes, error handling, HTTP requests, React hooks and TypeScript types, comments on complexity, and flags some common issues.\n\nDetection is done with pattern rules in your browser for JavaScript, TypeScript, Python, Java, Rust, SQL, CSS and Bash. It recognises structures; it does not execute the code or understand its business logic the way a human reviewer or a language model would.",
    steps: [
      ["Paste code", "Optionally choose the language."],
      ["Generate the explanation", "Concepts and notes are listed."],
      ["Read and verify", "Treat it as a guide to what to look up."],
    ],
    faqs: [
      ["Will it find bugs?", "Only some well-known patterns. It is not a linter or a test suite."],
      ["Is my code sent anywhere?", "No. Analysis is local."],
      ["Which languages are supported?", "JavaScript, TypeScript, Python, Java, Rust, SQL, CSS and Bash, with auto-detection."],
    ],
    uses: [
      "Getting oriented in an unfamiliar snippet",
      "Identifying concepts to study as a learner",
      "A first pass before a proper code review",
    ],
  },
  "ai-business-plan": {
    intro:
      "AI Business Plan Generator builds the skeleton of a business plan from a few inputs: business name, industry, what the business does, and related details. It lays out the standard sections investors expect, including executive summary, market analysis, go-to-market strategy, financial projections, team and risks.\n\nThe plan is generated from a template, so its value is the structure and prompts, not the numbers. Market sizes and financial figures are placeholders that you must replace with your own research.",
    steps: [
      ["Enter your business details", "Name, industry and description."],
      ["Generate the plan", "All sections are drafted."],
      ["Replace placeholders", "Add real market data and financials."],
    ],
    faqs: [
      ["Can I send this to investors as it is?", "No. It is an outline. Investors expect evidence and figures specific to your business."],
      ["Are the financial projections real?", "No. They are illustrative and must be rebuilt from your own assumptions."],
      ["How long should a business plan be?", "Often 15 to 25 pages, with a one-page executive summary."],
    ],
    uses: [
      "Getting past a blank page when starting a plan",
      "Checking you have covered every standard section",
      "Preparing an outline for a loan or grant application",
    ],
  },
  "ai-product-description": {
    intro:
      "AI Product Description Generator produces three versions of a product description from the details you supply: a short one for ads, a medium one for e-commerce listings, and a long one for product pages, written in the tone you select.\n\nThe text is assembled from templates in your browser. It gives you correctly sized drafts for each placement; the persuasive detail, what makes this product different and who it is for, still has to come from you.",
    steps: [
      ["Enter product details", "Name, features, audience and tone."],
      ["Generate", "Three lengths are produced."],
      ["Edit and publish", "Add specifics and check every claim."],
    ],
    faqs: [
      ["Is the copy unique?", "The structure is templated, so always rewrite it in your own words before publishing, especially across many products."],
      ["Which tone should I choose?", "Match your brand and audience: professional for B2B, friendly for consumer goods."],
      ["How long should a listing description be?", "Enough to answer the buyer's questions, typically 100 to 300 words plus bullet points."],
    ],
    uses: [
      "Drafting listings for a new product line",
      "Creating ad copy variations",
      "Giving a copywriter a starting structure",
    ],
  },
  "ai-meeting-notes": {
    intro:
      "AI Meeting Notes Generator reorganises rough notes into structured minutes. Paste your bullet points or raw notes and it arranges them under headings for discussion summary, decisions, action items and follow-up.\n\nIt sorts lines using keyword rules, for example treating lines with words like will, todo or by Friday as actions. It does not interpret the conversation the way a person would, so read the result and move anything that has landed under the wrong heading.",
    steps: [
      ["Paste raw notes", "One point per line works best."],
      ["Generate minutes", "Notes are grouped under headings."],
      ["Review and share", "Confirm owners and dates on each action."],
    ],
    faqs: [
      ["Can it transcribe a recording?", "No. It formats notes you have already written."],
      ["How do I get better results?", "Write each point on its own line and name the person responsible for each action."],
      ["Are my notes private?", "Yes. They are processed in your browser."],
    ],
    uses: [
      "Tidying notes straight after a call",
      "Producing consistent minutes for a recurring meeting",
      "Pulling the action items out of a long list",
    ],
  },
  "text-summarizer": {
    intro:
      "Text Summarizer shortens an article or document by picking out its most important sentences. It scores every sentence by how many of the text's frequent, meaningful words it contains, then keeps the top-scoring ones in their original order. A slider sets how much of the text is kept, and you can switch between a paragraph summary and a list of key points.\n\nThis is extractive summarisation: every sentence in the summary appears word for word in the original, so nothing is invented. It runs entirely in your browser.",
    steps: [
      ["Paste your text", "Works best on a few paragraphs or more."],
      ["Set the length", "Slide towards shorter or longer."],
      ["Copy the summary", "As a paragraph or as key points."],
    ],
    faqs: [
      ["Does it rewrite in its own words?", "No. It selects existing sentences. That avoids fabrication but can read less smoothly."],
      ["What text works best?", "Factual, well-structured writing such as news and reports. Dialogue and poetry summarise poorly."],
      ["Is there a length limit?", "No fixed limit, though very long texts take longer to process."],
    ],
    uses: [
      "Getting the gist of a long article",
      "Pulling key sentences for study notes",
      "Drafting an abstract to refine",
    ],
  },
  "grammar-checker": {
    intro:
      "Grammar Checker scans text for a set of common writing problems and highlights each with a suggestion. Its rules cover issues such as double spaces, sentences that do not start with a capital letter, repeated words, frequent misspellings and confusions, and passive voice. Many can be fixed with one click, and Fix all applies every automatic correction together.\n\nIt is a rule-based checker that runs in your browser. It catches mechanical slips quickly but does not understand meaning, so it will miss errors that a full grammar service or a careful proofread would find.",
    steps: [
      ["Paste or type text", "Issues are highlighted."],
      ["Review suggestions", "Apply fixes individually."],
      ["Fix all", "Apply every automatic correction at once."],
    ],
    faqs: [
      ["Is it as thorough as Grammarly?", "No. It applies a fixed list of rules and has no understanding of context."],
      ["Is passive voice always wrong?", "No. It is flagged as a style suggestion; keep it where it reads better."],
      ["Is my text uploaded?", "No. Checking is local."],
    ],
    uses: [
      "A last check on an email before sending",
      "Cleaning double spaces and capitalisation in pasted text",
      "Spotting repeated words in a draft",
    ],
  },
  "blog-outline-generator": {
    intro:
      "Blog Outline Generator produces a structured outline for a post on the topic you enter: a working title, an introduction, main sections with subheadings and talking points, and a conclusion.\n\nThe outline comes from a template with your topic inserted, not from a language model that knows the subject. It gives a dependable article skeleton; the research, the angle and the examples are yours to add, and sections that do not fit your topic should be cut or renamed.",
    steps: [
      ["Enter a topic", "Be specific about the angle."],
      ["Generate", "An outline appears."],
      ["Reshape it", "Reorder, rename and add your own points."],
    ],
    faqs: [
      ["Will the outline be unique to my topic?", "The structure is generic. Make it yours by adding sections only you can write."],
      ["How many sections should a post have?", "Enough to answer the reader's question fully; often four to seven."],
      ["Does it write the article?", "No. It provides headings and prompts."],
    ],
    uses: [
      "Breaking through a blank page",
      "Briefing a writer with a consistent structure",
      "Planning a series of related posts",
    ],
  },
  "faq-generator": {
    intro:
      "FAQ Generator drafts a set of frequently asked questions and answers for a topic or product. Enter the subject and it produces the question types people commonly ask: what it is, how it works, what it costs, who it is for and how to get started.\n\nQuestions and answers are generated from templates. The questions are a useful checklist, but the answers are placeholders in general terms; replace them with accurate details about your own product or subject before publishing.",
    steps: [
      ["Enter a topic or product", "The name people would search for."],
      ["Generate", "A list of Q&A pairs appears."],
      ["Rewrite the answers", "Use your real facts and policies."],
    ],
    faqs: [
      ["Can I publish the answers as generated?", "Not without editing. They are generic and may not be true of your product."],
      ["Where do I find real customer questions?", "Support tickets, sales calls, reviews and the People also ask box in search results."],
      ["How many FAQs should a page have?", "Five to ten well-answered questions is plenty."],
    ],
    uses: [
      "Starting a help or support page",
      "Planning the FAQ section of a product page",
      "Checking which common questions your content misses",
    ],
  },
  "product-description-generator": {
    intro:
      "Product Description Generator writes a draft description from a product name or short summary. The output follows a familiar e-commerce pattern: an opening line, key benefits, who it is for and a closing call to action.\n\nIt is a template generator that runs in your browser. Because it knows only what you type, add the concrete details that sell: materials, dimensions, what is included and why this product beats the alternatives.",
    steps: [
      ["Enter the product", "Name and main features."],
      ["Generate", "A description draft appears."],
      ["Add specifics", "Replace general claims with facts."],
    ],
    faqs: [
      ["Is the text suitable for marketplaces?", "As a starting point. Check each marketplace's rules on claims and length."],
      ["Will duplicate descriptions hurt SEO?", "Near-identical text across many products can. Vary the wording and add unique details."],
      ["Should I write features or benefits?", "Both. State the feature, then what it does for the buyer."],
    ],
    uses: [
      "Drafting listings for a small shop",
      "Filling gaps where products have no description",
      "Creating a consistent description format",
    ],
  },
  "social-post-generator": {
    intro:
      "Social Post Generator creates draft posts on a topic in formats suited to X (Twitter), LinkedIn, Instagram and Facebook. Each version follows the conventions of its platform, such as a short punchy line for X, a longer structured post for LinkedIn and a caption with hashtags for Instagram.\n\nPosts are built from templates around your topic. They give you the shape and length for each network; add your own opinion, story or data so the post says something only you could say.",
    steps: [
      ["Enter a topic", "A subject, announcement or idea."],
      ["Generate", "Drafts for several platforms appear."],
      ["Personalise and post", "Add your voice and check the facts."],
    ],
    faqs: [
      ["How many hashtags should I use?", "One or two on X and LinkedIn; a handful of relevant ones on Instagram."],
      ["Can I post the same text everywhere?", "It works better adapted. Each platform rewards a different length and tone."],
      ["Does it schedule posts?", "No. Copy the text into your scheduling tool."],
    ],
    uses: [
      "Turning one announcement into posts for four platforms",
      "Filling a content calendar",
      "Getting a first draft to edit",
    ],
  },
  "email-generator": {
    intro:
      "Email Generator drafts a professional email around the subject you provide. The draft has a greeting, a clear statement of purpose, supporting detail, a specific request or next step, and a sign-off.\n\nThe email is produced from a template in your browser, so it is a structure to edit, not a finished message. Put in the recipient's name, the facts of your situation and the exact action you want, and cut anything that does not apply.",
    steps: [
      ["Enter the purpose", "What the email is about."],
      ["Generate", "A draft appears."],
      ["Edit and send", "Add names, dates and specifics."],
    ],
    faqs: [
      ["How long should a work email be?", "As short as it can be while being complete. Aim for under 150 words."],
      ["What makes an email get a reply?", "One clear request, stated early, with a reason and a deadline."],
      ["Is my draft stored?", "No. It stays in your browser."],
    ],
    uses: [
      "Writing a follow-up after a meeting",
      "Making a polite request or complaint",
      "Getting started when you do not know how to open",
    ],
  },
  "subject-line-generator": {
    intro:
      "Subject Line Generator produces a batch of email subject lines for a topic, using formulas that are known to work: a question, a number, a how-to, a benefit, urgency and curiosity. Having several side by side makes it easy to choose candidates for an A/B test.\n\nLines are generated from templates. Pick two or three, tune the wording to your audience, and let your own open-rate data decide which style wins.",
    steps: [
      ["Enter the email topic", "The offer or subject."],
      ["Generate", "A list of options appears."],
      ["Choose and test", "Send two variants to a sample of your list."],
    ],
    faqs: [
      ["How long should a subject line be?", "About 30 to 50 characters so it is not cut off on phones."],
      ["Do emoji help open rates?", "Sometimes, depending on the audience. Test before adopting them."],
      ["Which words trigger spam filters?", "Filters weigh many signals, but all capitals, heavy punctuation and misleading claims all hurt."],
    ],
    uses: [
      "Preparing variants for a newsletter test",
      "Refreshing subject lines on an automated sequence",
      "Finding a stronger angle for an announcement",
    ],
  },
  "headline-generator": {
    intro:
      "Headline Generator gives you a set of headline options for a topic, based on proven structures: how-to, numbered list, question, ultimate guide, mistakes to avoid and direct benefit.\n\nThe headlines come from templates with your topic inserted. Use them as a spread of angles to react to, then sharpen the best one with a specific number, audience or outcome, and make sure the content delivers what the headline promises.",
    steps: [
      ["Enter a topic", "The subject of your piece."],
      ["Generate", "Multiple headlines appear."],
      ["Refine the best one", "Make it specific and accurate."],
    ],
    faqs: [
      ["What makes a headline effective?", "It is specific, promises a clear benefit and matches what the reader is looking for."],
      ["How long should a headline be?", "Around 50 to 60 characters if it also serves as the page title in search."],
      ["Is clickbait worth it?", "No. A headline the content does not fulfil loses readers and trust."],
    ],
    uses: [
      "Choosing a title for a blog post",
      "Writing a landing page heading",
      "Producing options for ad copy",
    ],
  },
  "rewrite-tool": {
    intro:
      "Rewrite Tool rephrases text by replacing words and phrases with alternatives from a built-in list of synonyms. Paste your text and it returns versions with the vocabulary changed while the sentence structure stays the same.\n\nIt is a substitution tool, not a language model. That makes it fast and private, but it cannot restructure sentences or judge whether a synonym fits the context, so read the output carefully. It does not make copied text original; cite your sources.",
    steps: [
      ["Paste your text", "A paragraph or two works best."],
      ["Generate", "Rewritten versions appear."],
      ["Review each change", "Undo any swap that alters the meaning."],
    ],
    faqs: [
      ["Does it change the meaning?", "It should not, but a synonym can be wrong in context. Check every sentence."],
      ["Will it make text pass a plagiarism check?", "Swapping words does not make someone else's work yours. Quote and cite instead."],
      ["Can it change the tone?", "Only through word choice. It does not restructure sentences."],
    ],
    uses: [
      "Finding alternative wording for a repeated phrase",
      "Varying vocabulary in a draft",
      "Simplifying overly formal language",
    ],
  },
  "youtube-title-generator": {
    intro:
      "YouTube Title Generator creates title ideas for a video topic using formats that perform well on the platform: how-to, numbered lists, beginner guides, comparisons and curiosity-led titles, some including the current year.\n\nTitles are template-based. Choose the one that most honestly describes your video, keep the main keyword near the start, and pair it with a thumbnail that adds to the title instead of repeating it.",
    steps: [
      ["Enter the video topic", "What the video covers."],
      ["Generate", "A list of titles appears."],
      ["Pick and adjust", "Make sure it matches the content."],
    ],
    faqs: [
      ["How long can a YouTube title be?", "100 characters, but about 60 show before truncation."],
      ["Should I put the year in the title?", "Only if the content is genuinely current and you will keep it updated."],
      ["Do capital letters help?", "One emphasised word can. Whole titles in capitals look like spam."],
    ],
    uses: [
      "Brainstorming titles before filming",
      "Testing a new title on an underperforming video",
      "Keeping a series consistently named",
    ],
  },
  "youtube-description-generator": {
    intro:
      "YouTube Description Generator drafts a full video description for your topic. The template includes an opening summary, a timestamps section, calls to action for subscribing, placeholders for links, and hashtags derived from the topic.\n\nReplace the placeholder timestamps and links with real ones. The first two lines matter most because they appear in search results and above the Show more fold, so put your main keyword and the reason to watch there.",
    steps: [
      ["Enter the video topic", "Used throughout the draft."],
      ["Generate", "A full description appears."],
      ["Fill in the details", "Real timestamps, links and credits."],
    ],
    faqs: [
      ["How do chapters work?", "List timestamps starting at 0:00, with at least three chapters each 10 seconds or longer."],
      ["How many hashtags can I use?", "Up to 15 count; the first three appear above the title. A few relevant ones are best."],
      ["Does the description affect ranking?", "It helps YouTube understand the video, alongside title, captions and viewer behaviour."],
    ],
    uses: [
      "Speeding up the upload routine",
      "Standardising descriptions across a channel",
      "Remembering to include chapters and links",
    ],
  },
  "linkedin-post-generator": {
    intro:
      "LinkedIn Post Generator drafts a post in the format that reads well in the LinkedIn feed: a hook on the first line, short paragraphs with white space, a lesson or takeaway, and a question or call to action at the end.\n\nThe draft is template-based and built around your topic. The framework is sound, but posts do well when they contain a real experience or a specific result, so replace the general statements with your own story.",
    steps: [
      ["Enter a topic", "A lesson, announcement or opinion."],
      ["Generate", "A formatted draft appears."],
      ["Make it personal", "Add your example and numbers."],
    ],
    faqs: [
      ["How long should a LinkedIn post be?", "Posts can run to 3,000 characters. Only the first two or three lines show before See more, so the opening matters most."],
      ["Should I put links in the post?", "Many people place the link in the first comment, though the effect on reach is debated."],
      ["How often should I post?", "Consistency beats volume. Two or three good posts a week is a realistic rhythm."],
    ],
    uses: [
      "Sharing a professional lesson",
      "Announcing a launch or new role",
      "Building a regular posting habit",
    ],
  },
  "hook-generator": {
    intro:
      "Hook Generator writes opening lines designed to stop someone scrolling. Enter your topic and it returns hooks in several styles: a bold claim, a question, a surprising statistic placeholder, a story opening and a common mistake.\n\nHooks are generated from templates. Use them for the first line of a post, the first three seconds of a video or the opening of an email, and replace any placeholder figure with a real, sourced one.",
    steps: [
      ["Enter your topic", "What the content is about."],
      ["Generate", "Several hook styles appear."],
      ["Choose one and deliver on it", "The content must keep the hook's promise."],
    ],
    faqs: [
      ["What makes a good hook?", "It creates a gap between what the audience knows and what they want to know, in one line."],
      ["How long should a video hook be?", "The first one to three seconds, a sentence at most."],
      ["Can I use the statistics as written?", "No. They are placeholders. Insert a real number with a source."],
    ],
    uses: [
      "Opening a short-form video",
      "Writing the first line of a social post",
      "Starting a sales email",
    ],
  },
  "cold-email-generator": {
    intro:
      "Cold Email Generator drafts outreach emails for sales, partnerships and follow-ups. Each template is short and follows the structure that tends to get replies: a relevant opening, one sentence on the value you offer, a small specific ask and a polite close.\n\nGenerated from templates in your browser, the drafts contain placeholders for the recipient's name, company and something specific about them. That personal detail is what separates a cold email from spam, so do not skip it.",
    steps: [
      ["Enter your offer or topic", "What you are reaching out about."],
      ["Generate", "Template emails appear."],
      ["Personalise every send", "Add a specific, researched opening line."],
    ],
    faqs: [
      ["How long should a cold email be?", "Under 120 words. It should be readable on a phone without scrolling."],
      ["How many follow-ups are reasonable?", "Two or three, spaced several days apart, each adding something new."],
      ["Is cold email legal?", "Rules differ: CAN-SPAM in the US, GDPR and ePrivacy in Europe. Identify yourself and offer a way to opt out."],
    ],
    uses: [
      "Reaching out to potential clients",
      "Proposing a partnership or guest post",
      "Following up after no reply",
    ],
  },
  "ai-cover-letter": {
    intro:
      "AI Cover Letter Generator creates a cover letter draft from the role you are applying for. It follows the standard structure: an opening naming the position, a paragraph on relevant experience, a paragraph on why this company, and a confident close.\n\nThe letter is a template, not a personalised piece of writing. Hiring managers notice generic letters, so use the draft for structure and replace the general statements with two or three concrete achievements that match the job description.",
    steps: [
      ["Enter the role", "Job title and company."],
      ["Generate", "A draft letter appears."],
      ["Tailor it", "Add specific achievements and remove filler."],
    ],
    faqs: [
      ["How long should a cover letter be?", "Half a page to one page: three or four short paragraphs."],
      ["Should I repeat my resume?", "No. Pick one or two achievements and explain why they matter for this role."],
      ["Is my information stored?", "No. It stays in your browser."],
    ],
    uses: [
      "Getting a first draft for a job application",
      "Structuring a speculative application",
      "Learning the standard cover letter format",
    ],
  },
  "ai-linkedin-optimizer": {
    intro:
      "AI LinkedIn Profile Optimizer generates draft text for the main parts of a LinkedIn profile: a headline, an About section and experience bullet points, based on the role or field you enter.\n\nThe suggestions are template-based. They show the pattern that works, a keyword-rich headline, an About section written in the first person, and bullets that start with action verbs, which you then rewrite with your own results and numbers.",
    steps: [
      ["Enter your role or field", "For example product designer."],
      ["Generate", "Headline, About and bullet drafts appear."],
      ["Rewrite with your facts", "Use real metrics and projects."],
    ],
    faqs: [
      ["How long can a LinkedIn headline be?", "220 characters. Include your role and the keywords recruiters search for."],
      ["What belongs in the About section?", "Who you help, what you do, proof that you do it well, and how to contact you."],
      ["Do keywords matter on LinkedIn?", "Yes. Recruiter searches match against your headline, About, titles and skills."],
    ],
    uses: [
      "Refreshing a profile before a job search",
      "Writing a headline that is more than a job title",
      "Turning duties into achievement-focused bullets",
    ],
  },
  "ai-spreadsheet-formula": {
    intro:
      "AI Spreadsheet Formula Generator finds a formula from a plain-English description. Type what you want to calculate, such as sum a column where another column says Paid, and it returns the Excel formula and the Google Sheets equivalent, with an explanation and a worked example.\n\nIt matches your description against a library of common formulas, including SUMIF, COUNTIF, VLOOKUP, INDEX MATCH, IF, date and text functions. It is not a language model, so unusual requests may return no match; rephrase with the name of the operation.",
    steps: [
      ["Describe the calculation", "Use plain words such as sum, count, look up."],
      ["Generate", "Excel and Sheets formulas appear."],
      ["Copy and adapt", "Change the cell ranges to match your sheet."],
    ],
    faqs: [
      ["Are Excel and Google Sheets formulas the same?", "Mostly. A few functions and separators differ, so both versions are shown."],
      ["Why was no formula found?", "The request did not match the library. Try naming the function type or simplifying."],
      ["Why does my formula return an error?", "Check the ranges, and use semicolons instead of commas if your locale requires them."],
    ],
    uses: [
      "Remembering lookup formula syntax",
      "Building a conditional sum or count",
      "Learning which function suits a task",
    ],
  },
  "ai-regex-generator": {
    intro:
      "AI Regex Generator finds a regular expression from a description. Type what you want to match, such as email address, URL, IPv4 address, date, hex colour or UUID, and it returns the pattern with an explanation, an example match, and versions formatted for JavaScript and Python.\n\nPatterns come from a curated library that also includes Indian formats such as mobile numbers, PAN, Aadhaar, PIN code and GSTIN. A built-in tester lets you paste text and see what matches. Descriptions outside the library return no result; browse the pattern list instead.",
    steps: [
      ["Describe what to match", "Or pick from the pattern library."],
      ["Review the pattern", "Read the explanation and example."],
      ["Test and copy", "Paste sample text into the live tester."],
    ],
    faqs: [
      ["Can it write any regex I describe?", "No. It matches descriptions to a fixed library of common patterns."],
      ["Is the email pattern fully accurate?", "It covers normal addresses. No regex validates every legal email; confirm by sending a message."],
      ["Should I validate credit cards with regex alone?", "No. Use it for format only and apply a Luhn check and your payment provider's validation."],
    ],
    uses: [
      "Getting a validation pattern for a form field",
      "Extracting URLs or IPs from logs",
      "Validating Indian identifiers such as PAN or GSTIN",
    ],
  },
  "ai-resume-builder": {
    intro:
      "AI Resume Builder guides you through writing a resume in six steps: personal details, summary, experience, education, skills and preview. Add as many jobs and qualifications as you need, list achievements one per line, and include certifications and projects.\n\nThe result is a clean, plain-text resume in a single-column layout that applicant tracking systems parse reliably. Copy it into Word or Google Docs to apply your own formatting. The tool structures what you write; it does not generate the content for you.",
    steps: [
      ["Fill in each section", "Move through the tabs in order."],
      ["Write achievement bullets", "Start with an action verb and include a number."],
      ["Preview and copy", "Paste into a document and save as .docx or PDF."],
    ],
    faqs: [
      ["Why plain text?", "Simple single-column text is what ATS software reads most accurately. Tables, columns and images often break parsing."],
      ["Can I download a PDF?", "The tool copies text. Paste it into a word processor and export from there."],
      ["How long should a resume be?", "One page for early careers, two for experienced professionals."],
    ],
    uses: [
      "Writing a first resume",
      "Rebuilding a heavily designed CV into an ATS-safe version",
      "Keeping a master resume to tailor per application",
    ],
  },
  "ai-contract-summarizer": {
    intro:
      "AI Contract Summarizer scans contract text and pulls out the essentials: the parties, effective and expiry dates, duration, governing law, payment terms, confidentiality and termination clauses, key obligations, and a list of risk flags such as auto-renewal or unlimited liability wording.\n\nExtraction is done by pattern analysis in your browser, so confidential agreements are not uploaded. It finds text that matches known clause patterns; it does not understand legal meaning and will miss unusually worded terms. It is not legal advice.",
    steps: [
      ["Paste the contract text", "At least a few paragraphs."],
      ["Run the summary", "Key fields and risk flags are listed."],
      ["Read the flagged clauses in full", "Then consult a lawyer for anything important."],
    ],
    faqs: [
      ["Can I rely on this instead of a lawyer?", "No. It is a reading aid that points you to sections worth attention."],
      ["Why are some fields empty?", "The contract words those terms in a way the patterns did not recognise, or omits them."],
      ["Is the contract uploaded?", "No. Analysis happens locally."],
    ],
    uses: [
      "Getting an overview of an NDA before reading it closely",
      "Finding renewal and termination dates",
      "Comparing key terms across supplier agreements",
    ],
  },
  "ai-pdf-summarizer": {
    intro:
      "AI PDF Summarizer reads a PDF and produces a structured overview: key topics, an executive summary, key points and conclusions, along with the page count, word count and estimated reading time. Files up to 20 MB are accepted.\n\nThe summary is extractive. Text is pulled from the PDF in your browser, the most frequent meaningful terms are identified, and the sentences that best represent them are selected. The sentences are the document's own, not newly written, and scanned PDFs without a text layer cannot be summarised.",
    steps: [
      ["Upload a PDF", "Text-based, up to 20 MB."],
      ["Read the summary", "Topics, key points and conclusions."],
      ["Copy the report", "Paste it into your notes."],
    ],
    faqs: [
      ["Why does it say it could not extract text?", "The PDF is a scan made of images. Run OCR first."],
      ["Is the summary written by a language model?", "No. It selects existing sentences using word-frequency scoring."],
      ["Is my document uploaded?", "No. It is processed on your device."],
    ],
    uses: [
      "Triaging a stack of reports",
      "Getting the main points of a research paper",
      "Preparing notes ahead of a meeting",
    ],
  },
};
