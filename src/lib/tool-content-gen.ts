/**
 * Tool content generation engine.
 *
 * Produces FAQs, introductions, how-to steps, benefits, and use-cases for every
 * tool page. Uses a three-tier system:
 *   1. Slug-specific overrides for high-traffic tools (~40 tools)
 *   2. Category + trait-based generation for all other tools
 *   3. Universal questions appended to every tool (free? safe? mobile?)
 *
 * getEnrichedTool() merges generated defaults with any data already in tools-data.ts
 * so hand-crafted entries are never overwritten.
 */

import type { Tool, FAQ, HowToStep, ToolCategory } from "@/types";

// ─── Trait Detection ──────────────────────────────────────────────────────────

interface ToolTraits {
  isConverter: boolean;
  isCompressor: boolean;
  isGenerator: boolean;
  isCalculator: boolean;
  isFormatter: boolean;
  isAnalyzer: boolean;
  isEditor: boolean;
  isRemover: boolean;
  hasFileInput: boolean;
  hasAudio: boolean;
  hasPDF: boolean;
  hasImage: boolean;
  isAITool: boolean;
  isLegalDoc: boolean;
  isFinancial: boolean;
  usesExternalAPI: boolean;
  formats: string[];
  inputFormat: string | null;
  outputFormat: string | null;
}

const FILE_FORMATS = new Set([
  "pdf", "jpg", "jpeg", "png", "webp", "avif", "svg", "gif", "heic", "bmp", "tiff",
  "mp3", "wav", "aac", "flac", "m4a", "ogg", "mp4", "webm",
  "json", "xml", "yaml", "csv", "html", "css", "js", "sql", "base64",
  "word", "docx", "xlsx", "pptx",
]);

const EXTERNAL_API_TOOLS = new Set([
  "background-remover", "website-speed-checker", "whois-lookup",
  "dns-lookup", "ip-lookup", "ssl-checker", "page-speed-checker",
]);

function detectTraits(tool: Tool): ToolTraits {
  const slug = tool.slug;
  const tags = tool.tags.map(t => t.toLowerCase());
  const name = tool.name.toLowerCase();
  const cat  = tool.category;

  const formats = tags.filter(t => FILE_FORMATS.has(t));

  // Detect input/output from slug pattern "x-to-y"
  const toMatch = slug.match(/^(.+?)-to-(.+)$/);
  const inputFormat  = toMatch ? toMatch[1] : null;
  const outputFormat = toMatch ? toMatch[2] : null;

  return {
    isConverter:   !!(toMatch) || name.includes("convert") || name.includes("converter"),
    isCompressor:  name.includes("compress") || name.includes("compressor") || name.includes("minif"),
    isGenerator:   name.includes("generator") || name.includes("maker") || name.includes("builder"),
    isCalculator:  name.includes("calculator") || cat === "calculators",
    isFormatter:   name.includes("formatter") || name.includes("format") || name.includes("beautif"),
    isAnalyzer:    name.includes("analyzer") || name.includes("checker") || name.includes("tester") || name.includes("validator"),
    isEditor:      name.includes("editor") || name.includes("cropper") || name.includes("resizer"),
    isRemover:     name.includes("remover") || name.includes("cleaner"),
    hasFileInput:  ["pdf-tools", "image-tools", "audio-tools"].includes(cat) || tags.some(t => FILE_FORMATS.has(t)),
    hasAudio:      cat === "audio-tools" || tags.some(t => ["mp3", "wav", "audio", "aac", "flac", "ogg"].includes(t)),
    hasPDF:        cat === "pdf-tools"   || tags.includes("pdf"),
    hasImage:      cat === "image-tools" || tags.some(t => ["jpg", "png", "image", "webp", "svg", "gif"].includes(t)),
    isAITool:      cat === "ai-tools"    || tags.includes("ai"),
    isLegalDoc:    tags.some(t => ["nda", "legal", "contract", "agreement"].includes(t)),
    isFinancial:   cat === "calculators" || tags.some(t => ["finance", "tax", "gst", "emi", "loan", "investment", "salary", "ctc"].includes(t)),
    usesExternalAPI: EXTERNAL_API_TOOLS.has(slug),
    formats, inputFormat, outputFormat,
  };
}

// ─── Tier 1 – Universal FAQs (every tool gets these) ─────────────────────────

function universalFAQs(tool: Tool, traits: ToolTraits): FAQ[] {
  const { name } = tool;

  const privacyAnswer = traits.usesExternalAPI
    ? `${name} sends only the minimal necessary data (such as a URL or identifier) to an external service to process your request. No files or personal data are stored on our servers.`
    : `Yes. ${name} runs entirely in your browser using client-side JavaScript. Your files and data never leave your device and are never transmitted to our servers.`;

  return [
    {
      question: `Is ${name} free to use?`,
      answer:   `Yes, ${name} is 100% free with no usage limits, no watermarks, and no hidden charges. The platform is supported by non-intrusive advertising so all tools stay free for everyone.`,
    },
    {
      question: `Do I need to create an account to use ${name}?`,
      answer:   `No account or registration is required. Open ${name} and start immediately — no email, no sign-up, no personal information needed.`,
    },
    {
      question: `Is my data safe when using ${name}?`,
      answer:   privacyAnswer,
    },
    {
      question: `Does ${name} work on mobile and tablet devices?`,
      answer:   `Yes. ${name} is fully responsive and tested on smartphones, tablets, and all major desktop browsers (Chrome, Firefox, Safari, and Edge). The interface adapts automatically to any screen size.`,
    },
  ];
}

// ─── Tier 2 – Category FAQs ───────────────────────────────────────────────────

function categoryFAQs(tool: Tool, traits: ToolTraits): FAQ[] {
  const { category, name } = tool;
  const faqs: FAQ[] = [];

  if (category === "pdf-tools") {
    faqs.push(
      {
        question: `What is the maximum PDF file size ${name} can handle?`,
        answer:   `Because processing happens in your browser, the practical limit is your device's available memory. PDFs up to 100 MB work without issues on most computers; very large files may be slower on older or low-memory devices.`,
      },
      {
        question: `Can ${name} process password-protected PDFs?`,
        answer:   `Password-protected PDFs must be unlocked first. Use our PDF Unlocker tool to remove the password, then use ${name} on the unlocked file.`,
      },
      {
        question: `Does ${name} support all PDF versions?`,
        answer:   `Yes. ${name} supports PDF 1.0 through 2.0, including files created by Adobe Acrobat, Microsoft Office, Google Docs, LibreOffice, and any standards-compliant PDF generator.`,
      },
    );
  }

  if (category === "image-tools") {
    const fmtList = traits.formats.length > 1
      ? traits.formats.map(f => f.toUpperCase()).join(", ")
      : "JPG, PNG, WebP, GIF, BMP, and TIFF";
    faqs.push(
      {
        question: `What image formats does ${name} support?`,
        answer:   `${name} supports ${fmtList}. All processing happens locally in your browser — no file uploads to a remote server.`,
      },
      {
        question: `Is there a file size limit for ${name}?`,
        answer:   `No hard server-side limit exists because processing is local. Images up to 50 MB are handled smoothly. Very high-resolution files (50+ megapixels) may take a few extra seconds on slower devices.`,
      },
    );
  }

  if (category === "audio-tools") {
    faqs.push(
      {
        question: `What audio formats does ${name} support?`,
        answer:   `${name} supports MP3, WAV, AAC, FLAC, M4A, and OGG. All processing uses the Web Audio API built into modern browsers — no plugins or software installs required.`,
      },
      {
        question: `Does ${name} require any software installation?`,
        answer:   `No. ${name} runs in your browser using native Web Audio APIs. It works on Chrome, Firefox, Edge, and Safari without any extensions or plugins.`,
      },
      {
        question: `Will processing audio in the browser affect quality?`,
        answer:   `For lossless operations (trimming, joining, normalising), there is no quality degradation. Conversions to lossy formats (MP3, AAC) include quality settings so you control the output bitrate.`,
      },
    );
  }

  if (category === "developer-tools") {
    faqs.push(
      {
        question: `Does ${name} log or store the data I paste into it?`,
        answer:   `No. ${name} processes everything locally in your browser. Nothing is sent to a server, logged, or stored. Your code, secrets, and data never leave your machine.`,
      },
      {
        question: `Which browsers are compatible with ${name}?`,
        answer:   `${name} works in all modern evergreen browsers: Chrome 90+, Firefox 88+, Edge 90+, and Safari 14+. Internet Explorer is not supported.`,
      },
    );
  }

  if (category === "calculators" || traits.isFinancial) {
    faqs.push(
      {
        question: `How accurate are the results from ${name}?`,
        answer:   `${name} uses standard industry formulas to produce accurate estimates for planning purposes. Results are indicative only and should not substitute professional financial, tax, or legal advice. Consult a qualified advisor for specific decisions.`,
      },
      {
        question: `Does ${name} save my inputs for future visits?`,
        answer:   `Your inputs are not sent to any server. Some browsers restore form values on page revisit via local session state, but we never store or transmit your financial figures.`,
      },
    );
  }

  if (category === "ai-tools") {
    faqs.push(
      {
        question: `Does ${name} require an API key or AI subscription?`,
        answer:   `No. ${name} uses intelligent template-based generation that runs entirely in your browser — no external AI API is called and no API key or subscription is needed.`,
      },
      {
        question: `How accurate are the outputs from ${name}?`,
        answer:   `${name} produces structured, professional outputs based on proven templates. AI-generated content may occasionally contain inaccuracies — always review and personalise the output before using it in a professional context.`,
      },
      {
        question: `Can I edit the content generated by ${name}?`,
        answer:   `Yes. All output is fully editable plain text. Copy it to any word processor or editor and customise it to match your specific needs, tone, and requirements.`,
      },
    );
  }

  if (category === "seo-tools") {
    faqs.push(
      {
        question: `Does ${name} use live data or analyse static input?`,
        answer:   `${name} analyses the content or configuration you provide. Where live website data is needed (such as fetching a page), you enter the URL and the tool retrieves the relevant data instantly.`,
      },
      {
        question: `How often should I use ${name}?`,
        answer:   `Run ${name} whenever you publish new content, make significant page changes, or audit your existing setup. Regular use catches issues before they impact your search rankings.`,
      },
    );
  }

  if (category === "text-tools") {
    faqs.push(
      {
        question: `Is there a character or word limit for ${name}?`,
        answer:   `There is no server-side limit because all processing is local. ${name} handles texts of 100,000+ characters smoothly. Extremely large documents may have a slight delay on older devices.`,
      },
    );
  }

  if (category === "unit-converters") {
    faqs.push(
      {
        question: `How precise are the conversion results from ${name}?`,
        answer:   `${name} uses high-precision conversion factors and displays results to up to 10 significant figures. Values are rounded for readability but the underlying calculation maintains full floating-point precision.`,
      },
      {
        question: `Does ${name} support metric, imperial, and US customary units?`,
        answer:   `Yes. ${name} covers all common measurement systems including SI (metric), imperial, and US customary units, as well as any other systems relevant to this measurement type.`,
      },
    );
  }

  if (category === "color-tools") {
    faqs.push(
      {
        question: `What color formats does ${name} support?`,
        answer:   `${name} supports all web color formats: HEX, RGB, RGBA, HSL, HSLA, HSV, CMYK, and CSS named colors. Conversion between formats is instant and lossless.`,
      },
    );
  }

  if (category === "business-tools" && traits.isLegalDoc) {
    faqs.push(
      {
        question: `Is the document generated by ${name} legally binding?`,
        answer:   `The document is based on standard templates for informational purposes only. Always have any legal document reviewed by a qualified attorney before signing or relying on it in a binding agreement.`,
      },
    );
  }

  if (category === "business-tools" && !traits.isLegalDoc && !traits.isCalculator) {
    faqs.push(
      {
        question: `Can I save the output from ${name} as a PDF?`,
        answer:   `Yes. Use the built-in Print / Save as PDF button, or press Ctrl+P (Windows) / Cmd+P (Mac) in your browser and select "Save as PDF" as the destination.`,
      },
      {
        question: `Does ${name} support multiple currencies?`,
        answer:   `Yes. Select your currency from the dropdown (INR, USD, EUR, GBP, AED, and more) and all amounts are formatted accordingly.`,
      },
    );
  }

  if (category === "network-tools") {
    faqs.push(
      {
        question: `Is the information returned by ${name} real-time?`,
        answer:   `${name} queries live data sources and returns current results. Some records (like WHOIS or DNS) may have propagation delays of a few minutes to 48 hours for very recent changes.`,
      },
    );
  }

  return faqs;
}

// ─── Tier 3 – Slug-Specific FAQs (top ~45 tools) ─────────────────────────────

function slugSpecificFAQs(tool: Tool): FAQ[] {
  switch (tool.slug) {

    // ── PDF Tools ──────────────────────────────────────────────────────────────
    case "pdf-compressor":
      return [
        { question: "How much can I reduce a PDF file size?", answer: "Compression varies by content. PDFs containing high-resolution images typically reduce 50–90%. Text-only or already-optimised PDFs may reduce 10–30%. Choose a higher compression level for maximum savings." },
        { question: "Will PDF compression affect image quality?", answer: "At Low and Medium levels, images remain visually indistinguishable from the original. At High compression, images may show slight softness under close inspection. Text, vectors, and fonts are never degraded regardless of compression level." },
        { question: "Can I compress multiple PDFs at once?", answer: "Yes. Upload multiple PDFs and compress them in a single batch. Each file is processed independently and you can download outputs individually or as a ZIP archive." },
        { question: "What compression levels are available?", answer: "Three levels: Low (minimal quality impact, modest size reduction), Medium (balanced — the recommended default), and High (maximum compression, minor image quality reduction)." },
      ];

    case "pdf-merger":
      return [
        { question: "How many PDFs can I merge at once?", answer: "Up to 20 PDF files per session. For larger batches, merge in rounds — use the merged output as input for the next round." },
        { question: "Can I reorder pages before merging?", answer: "Yes. Drag and drop the uploaded files to rearrange them in any order. The merged PDF follows the sequence you set exactly." },
        { question: "Is the merged PDF the same quality as the originals?", answer: "Yes. Merging is lossless — no re-encoding happens. All fonts, images, bookmarks, and formatting from the original files are preserved." },
      ];

    case "pdf-splitter":
      return [
        { question: "Can I extract specific pages from a PDF?", answer: "Yes. Enter page ranges such as 1-3, 5, 7-10 to extract exactly the pages you need. You can combine ranges, extract single pages, or split every N pages." },
        { question: "Can I extract a single page as a standalone PDF?", answer: "Yes. Enter the single page number in the range field (e.g., \"5\") to save that page as its own PDF document." },
        { question: "How do I split a PDF into equal parts?", answer: "Use the 'Split every N pages' mode and set N to your preferred chunk size. The tool creates equal-size files automatically, with any remaining pages in the final file." },
      ];

    case "pdf-to-jpg":
    case "pdf-to-png": {
      const fmt = tool.slug === "pdf-to-jpg" ? "JPG" : "PNG";
      return [
        { question: `What resolution are the output ${fmt} images?`, answer: `Default is 150 DPI — sharp for screen use. Select 300 DPI for print-quality output. Higher DPI produces larger, crisper images.` },
        { question: "Are all pages converted or just the first?", answer: `All pages are converted by default, each becoming one ${fmt} image. Download them individually or as a single ZIP archive.` },
        { question: "Will text in the PDF remain sharp after conversion?", answer: "Yes, especially at 150 DPI or higher. For PDFs with small print or fine detail, use 300 DPI to preserve legibility." },
      ];
    }

    case "ocr-pdf":
      return [
        { question: "What languages does the OCR engine support?", answer: "100+ languages including English, Hindi, Spanish, French, German, Chinese (Simplified and Traditional), Arabic, Japanese, Portuguese, Russian, and more. Select your document's language for best accuracy." },
        { question: "How accurate is the OCR text extraction?", answer: "Clean, high-resolution scans (200+ DPI) typically yield 95–99% accuracy on printed text. Low-quality, skewed, or faded scans will have lower accuracy — review the extracted text before use." },
        { question: "Can the OCR tool read handwritten text?", answer: "The OCR engine is optimised for printed text. Handwriting recognition is not currently supported and accuracy on handwritten content will be very low." },
        { question: "What is the difference between a scanned PDF and a digital PDF?", answer: "A digital PDF was created electronically and already contains selectable text. A scanned PDF is an image of a document — it requires OCR to extract the text. If you can already select text in your PDF, OCR is not needed." },
      ];

    // ── Image Tools ────────────────────────────────────────────────────────────
    case "image-compressor":
      return [
        { question: "What compression methods does the Image Compressor use?", answer: "The tool applies smart lossy compression to JPEG and WebP files and lossless compression to PNG and GIF files, automatically selecting the most effective method per format." },
        { question: "Can I compress multiple images at once?", answer: "Yes. Upload up to 20 images simultaneously. The tool processes them in parallel and shows before/after file sizes for each one." },
        { question: "What quality setting should I use for web images?", answer: "A quality of 75–85% gives the best balance for web use — visually indistinguishable from the original at typical display sizes while reducing file size by 50–70%." },
      ];

    case "image-resizer":
      return [
        { question: "Can I resize without distorting the image?", answer: "Yes. The 'Maintain Aspect Ratio' option (enabled by default) keeps proportions intact — enter one dimension and the other calculates automatically." },
        { question: "What social media preset sizes are available?", answer: "Presets for Instagram (1:1, 4:5, 16:9 story), Facebook (post, cover), Twitter/X (post, header), LinkedIn (post, banner), YouTube (thumbnail), Pinterest (pin), and WhatsApp profile." },
        { question: "Can I resize multiple images to the same dimensions at once?", answer: "Yes. Upload a batch of images, set one dimension target, and all files are resized to those exact dimensions. Download as a ZIP when done." },
      ];

    case "background-remover":
      return [
        { question: "What types of images give the best background removal results?", answer: "Images with clear subject-background contrast: product photos, portraits, logos, and objects against uniform backgrounds. Complex textured or gradient backgrounds may require manual touch-up after removal." },
        { question: "Is Background Remover suitable for e-commerce product photos?", answer: "Yes — it is specifically designed for this use case. Remove backgrounds to prepare white-background images for Amazon, Flipkart, Shopify, and other e-commerce platforms." },
        { question: "Can I add a new background colour after removing the original?", answer: "After removal you download a transparent PNG, which you can open in any image editor to add a new background colour or image. A built-in background replacement option is on the product roadmap." },
      ];

    case "social-image-resizer":
      return [
        { question: "Which social media platforms are covered?", answer: "Instagram, Facebook, Twitter/X, LinkedIn, Pinterest, YouTube, TikTok, Snapchat, WhatsApp, and Open Graph (website link previews). Each platform includes multiple content-type presets." },
        { question: "Will the resizer crop my image for exact platform dimensions?", answer: "The tool offers two modes: Fit (scales to fit within the dimensions maintaining aspect ratio) and Crop (matches exact platform dimensions with an interactive crop selector)." },
      ];

    // ── Developer Tools ────────────────────────────────────────────────────────
    case "json-formatter":
      return [
        { question: "Can JSON Formatter detect and fix syntax errors?", answer: "Yes. The formatter highlights exact errors — missing commas, unquoted keys, trailing commas, mismatched brackets — with the line and column number so you can fix them instantly." },
        { question: "Can I minify JSON as well as format it?", answer: "Yes. Toggle between Pretty Print (human-readable with indentation) and Minify (compact, whitespace-free) modes with a single click. Minified JSON reduces API payload size." },
        { question: "What indentation options are available?", answer: "2 spaces (default, the most common convention), 4 spaces, or tab indentation. Choose whichever matches your codebase style guide." },
        { question: "Can I compare two JSON objects with this tool?", answer: "For side-by-side JSON comparison, use our dedicated JSON Diff Checker — it highlights added, removed, and changed keys with colour coding." },
      ];

    case "base64-encoder":
      return [
        { question: "What can I encode with the Base64 Encoder?", answer: "Any text string including plain text, JSON, HTML, URLs, and special characters. You can also upload a file to convert it to a Base64 data URI for embedding in CSS or HTML." },
        { question: "What is Base64 typically used for?", answer: "Embedding binary data in text formats (JSON, XML, HTML), transmitting data via email, encoding HTTP Basic Auth credentials, storing small images directly in CSS as data URIs, and passing binary data in REST APIs." },
        { question: "What is the difference between standard Base64 and URL-safe Base64?", answer: "Standard Base64 uses + and / characters which are reserved in URLs. URL-safe Base64 replaces + with - and / with _ making the output safe to include directly in URLs and filenames without percent-encoding." },
      ];

    case "uuid-generator":
      return [
        { question: "What UUID versions does this generator support?", answer: "Version 1 (time-based, includes timestamp and MAC address), Version 4 (randomly generated — the most widely used), and Version 5 (namespace + name hashed with SHA-1). v4 is recommended for most use cases." },
        { question: "Are the UUIDs cryptographically random?", answer: "v4 UUIDs are generated using the browser's window.crypto API, which produces cryptographically secure random values — not predictable pseudo-random numbers. They are safe for use as unique identifiers." },
        { question: "Can I generate UUIDs in bulk?", answer: "Yes. Set the quantity (up to 1,000) to generate a list of unique UUIDs at once. Copy all to clipboard or download as a text file." },
      ];

    case "regex-tester":
      return [
        { question: "Which regex engine does the Regex Tester use?", answer: "The tester uses JavaScript's native RegExp engine (ECMAScript standard), which is compatible with most modern programming languages for common regex patterns." },
        { question: "Can I test with multiple regex flags at once?", answer: "Yes. Enable any combination: g (global), i (case-insensitive), m (multiline), s (dotAll), and u (Unicode mode). Each flag can be toggled independently." },
        { question: "Does the tester highlight all matches in real time?", answer: "Yes. All matches are highlighted in the test string as you type the pattern, with no need to click a button. Each capture group is shown separately in the matches panel." },
        { question: "Can I use the Regex Tester to learn regular expressions?", answer: "Yes. The tool explains what each part of your pattern matches and shows capture groups visually — useful for learning and debugging complex patterns." },
      ];

    case "password-generator":
      return [
        { question: "How secure are the passwords generated by this tool?", answer: "Passwords are generated using window.crypto — the browser's cryptographic random number generator. This produces truly random values, not predictable pseudo-random outputs." },
        { question: "Are generated passwords stored anywhere?", answer: "No. Passwords are generated and displayed locally and never transmitted to any server. Nothing is logged or stored. Generate, copy, and close." },
        { question: "What character sets can I include?", answer: "Uppercase letters (A-Z), lowercase letters (a-z), digits (0-9), and special symbols. You can also exclude visually ambiguous characters (0, O, I, l) to prevent transcription errors." },
        { question: "What password length is recommended?", answer: "16 characters minimum for most accounts; 20+ for financial and administrative accounts. Always store generated passwords in a reputable password manager." },
      ];

    case "password-strength-checker":
      return [
        { question: "How is password strength calculated?", answer: "Strength is scored using entropy (character set × length), common dictionary word checks, known breach list matching, and pattern detection (keyboard walks, repeated characters, common substitutions like @ for a)." },
        { question: "Is my password transmitted anywhere when I check it?", answer: "No. Your password is analysed entirely in your browser using a locally-loaded wordlist and algorithm. It is never sent to any server." },
        { question: "What does the 'time to crack' estimate mean?", answer: "It shows how long a modern offline brute-force attack would take to crack the password, assuming 10 billion guesses per second. It is a rough benchmark — real-world security depends on many additional factors." },
      ];

    // ── SEO Tools ──────────────────────────────────────────────────────────────
    case "meta-tag-generator":
      return [
        { question: "What meta tags does this generator produce?", answer: "Title tag, meta description, canonical URL, robots directives, Open Graph tags (og:title, og:description, og:image, og:type, og:url), Twitter Card tags, and viewport meta — ready to paste into your HTML <head>." },
        { question: "How long should my meta description be?", answer: "Google typically shows 150–160 characters. Aim for 140–155 to avoid truncation on all devices. Front-load the most important keywords and include a clear call to action." },
        { question: "Do meta tags directly improve my Google ranking?", answer: "Meta tags alone are not a direct ranking factor, but a compelling title and description improve your click-through rate (CTR) in search results — a positive engagement signal for Google." },
      ];

    case "sitemap-generator":
      return [
        { question: "What is an XML sitemap and do I really need one?", answer: "An XML sitemap lists all important URLs on your website so search engine crawlers can discover and index them efficiently. It is especially valuable for large sites, newly launched domains, or pages with few inbound links." },
        { question: "How do I submit my sitemap to Google?", answer: "Upload sitemap.xml to your domain root (e.g., example.com/sitemap.xml), then go to Google Search Console → Indexing → Sitemaps and enter the URL." },
        { question: "How many URLs can a sitemap contain?", answer: "Google's protocol supports up to 50,000 URLs per file at a maximum 50 MB. For larger sites, create multiple sitemap files and list them in a sitemap index file." },
      ];

    case "robots-txt-generator":
      return [
        { question: "What is a robots.txt file used for?", answer: "robots.txt tells web crawlers which pages or sections of your site they may or may not crawl. It does not prevent pages from being indexed if they are linked from elsewhere — use noindex meta tags for that." },
        { question: "Does blocking a page in robots.txt remove it from Google?", answer: "No — it only prevents crawling. If the blocked page is linked from other sites, Google may still index it (without being able to see its content). Use a noindex meta tag or response header to prevent indexing." },
        { question: "Where do I upload the generated robots.txt?", answer: "Upload it to the root of your domain so it is accessible at yourdomain.com/robots.txt. It must be at the root — subdirectory placement will not work." },
      ];

    case "keyword-density-checker":
      return [
        { question: "What is a good keyword density percentage?", answer: "There is no universally correct number — Google does not use a target density. Most SEO practitioners aim for keywords to appear naturally, approximately 1–2% density for primary keywords. Over-optimisation (keyword stuffing) is penalised." },
        { question: "Should I optimise for exact-match keyword density?", answer: "Modern SEO focuses on topic relevance and natural language rather than exact keyword repetition. Write for your reader first; use synonyms, related terms, and natural phrasing." },
      ];

    // ── Financial Calculators ──────────────────────────────────────────────────
    case "loan-calculator":
      return [
        { question: "What EMI formula does this calculator use?", answer: "EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is the principal loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the number of monthly instalments." },
        { question: "Can I see a full amortisation schedule?", answer: "Yes. Scroll below the summary result to see a month-by-month amortisation table showing principal repaid, interest charged, and outstanding balance for each EMI payment." },
        { question: "Does the EMI calculation include processing fees?", answer: "The base calculation does not include processing fees or other charges. To factor them in, add the total fee amount to the principal before calculating." },
        { question: "How does a higher down payment affect my EMI?", answer: "A larger down payment reduces the loan principal, which directly lowers your monthly EMI and total interest paid over the loan tenure. The calculator lets you model different down payment scenarios." },
      ];

    case "gst-calculator":
      return [
        { question: "What GST slabs does this calculator support?", answer: "All current Indian GST slabs: 0%, 0.25%, 1%, 1.5%, 3%, 5%, 12%, 18%, and 28%, plus cess applicable to certain goods such as tobacco and luxury items." },
        { question: "How do I calculate GST-exclusive vs GST-inclusive price?", answer: "Exclusive: GST Amount = Base Price × Rate ÷ 100. Inclusive: Base Price = Total Price ÷ (1 + Rate ÷ 100), then GST = Total − Base. Toggle the switch in the calculator to switch between both modes automatically." },
        { question: "How does the calculator handle CGST, SGST, and IGST?", answer: "For intra-state supplies, CGST and SGST are each half the total GST rate. For inter-state supplies, the full IGST rate applies. Select your supply type and the calculator shows the correct breakdown." },
        { question: "Are the GST rates updated to the latest revision?", answer: "The calculator includes rates as of the latest GST Council revision. GST rates can change — verify with the official GST portal (gst.gov.in) for any recent updates before filing." },
      ];

    case "bmi-calculator":
      return [
        { question: "What formula does the BMI Calculator use?", answer: "BMI = weight (kg) ÷ height² (m²). For imperial units: BMI = (weight in lbs × 703) ÷ height² (inches²). Both metric and imperial inputs are supported." },
        { question: "What are the WHO BMI categories?", answer: "Under 18.5: Underweight. 18.5–24.9: Normal weight. 25.0–29.9: Overweight. 30.0–34.9: Obese Class I. 35.0–39.9: Obese Class II. 40.0+: Obese Class III (severe obesity). These are World Health Organisation classifications." },
        { question: "Is BMI an accurate health indicator?", answer: "BMI is a useful population-level screening tool but does not account for muscle mass, bone density, age, sex, or fat distribution. Athletes may have high BMI with low body fat; older adults may have normal BMI with high body fat. Use it alongside other health assessments." },
      ];

    case "sip-calculator":
      return [
        { question: "What formula does the SIP Calculator use?", answer: "Maturity Value = P × ((1 + r)^n − 1) ÷ r × (1 + r), where P is the monthly SIP amount, r is the monthly rate of return (annual ÷ 12 ÷ 100), and n is the number of monthly instalments." },
        { question: "Does the SIP Calculator show inflation-adjusted returns?", answer: "Enable the 'Inflation-adjusted returns' toggle to see your returns in today's purchasing power terms, using the inflation rate you specify." },
        { question: "Are SIP returns guaranteed?", answer: "No. The calculator illustrates projected growth at a constant assumed return rate. Actual mutual fund returns fluctuate with market conditions and are never guaranteed. Past performance does not predict future returns." },
        { question: "What is the difference between SIP and lump-sum investment?", answer: "A SIP invests a fixed amount monthly, averaging purchase cost over time (rupee-cost averaging). A lump-sum invests a single large amount at one point in time. The calculator lets you compare both scenarios." },
      ];

    case "compound-interest-calculator":
      return [
        { question: "What compound interest formula does this calculator use?", answer: "A = P × (1 + r/n)^(n×t), where A is the final amount, P is principal, r is the annual interest rate (decimal), n is compounding frequency per year, and t is time in years." },
        { question: "What compounding frequencies are supported?", answer: "Daily (365×/year), weekly, monthly (12×/year), quarterly (4×/year), semi-annually (2×/year), and annually. More frequent compounding yields a slightly higher return for the same stated rate." },
      ];

    // ── Business Tools ─────────────────────────────────────────────────────────
    case "invoice-generator":
      return [
        { question: "Can I add my company logo to the invoice?", answer: "Yes. Upload your logo (PNG, JPG, or SVG) and it appears in the invoice header on screen and in the printed/PDF output." },
        { question: "Can I save my company details for future invoices?", answer: "Yes. Your company name, address, and other details are saved in your browser's local storage and pre-filled automatically on your next visit." },
        { question: "Is the Invoice Generator GST-compliant for India?", answer: "For invoices requiring GSTIN fields, HSN/SAC codes, and CGST/SGST/IGST breakdowns, use our dedicated GST Invoice Generator tool which meets all CGST Act requirements." },
        { question: "Can I create recurring invoice templates?", answer: "You can save a completed invoice as a PDF and reuse the structure as a visual template. Future invoices can be started from a duplicate by adjusting the date, invoice number, and line items." },
      ];

    case "gst-invoice-generator":
      return [
        { question: "Is this generator compliant with Indian GST rules?", answer: "Yes. The generator includes all mandatory fields under the CGST Act: supplier and buyer GSTINs, HSN/SAC codes, taxable value, applicable CGST/SGST/IGST amounts, and total invoice value with amount in words." },
        { question: "How do I decide between CGST+SGST and IGST?", answer: "If the supplier and buyer are in the same state (intra-state supply), use CGST + SGST — each at half the total rate. If they are in different states (inter-state supply), apply the full IGST rate." },
        { question: "What HSN/SAC codes should I use?", answer: "Enter the HSN code (for goods) or SAC code (for services) relevant to each line item. The tool accepts any code — verify codes with your CA or on the GST portal (gst.gov.in) if unsure." },
      ];

    case "nda-generator":
      return [
        { question: "What types of NDA can I generate?", answer: "One-way (unilateral) NDAs — where only one party discloses — mutual NDAs for bilateral exchanges, and employee confidentiality agreements. Select your NDA type before filling in the details." },
        { question: "Is the generated NDA legally binding?", answer: "The generated NDA is based on a standard template for reference only. Legal enforceability depends on your jurisdiction, the specific circumstances, and correct execution. Always have a qualified attorney review any NDA before signing." },
        { question: "Can I customise the NDA jurisdiction?", answer: "Yes. Enter your governing law jurisdiction (e.g., Maharashtra, India) and the courts of exclusive jurisdiction in the form fields before generating." },
      ];

    // ── AI Tools ───────────────────────────────────────────────────────────────
    case "ai-cover-letter":
      return [
        { question: "What information do I need to generate a cover letter?", answer: "Job title, company name, your name, and 2–3 key skills or relevant experiences. Adding the job description or role requirements produces a more tailored output." },
        { question: "How long is the generated cover letter?", answer: "3–4 paragraphs (250–350 words) — the widely recommended length for professional applications. You can edit the output to add or remove content." },
        { question: "Can I generate cover letters for different industries?", answer: "Yes. Select your target industry (technology, finance, healthcare, creative, etc.) and the tone and vocabulary are adapted accordingly. Always review and personalise the output for each specific role." },
        { question: "How do I make the AI cover letter sound more personal?", answer: "After generating, replace the placeholder phrases with specific examples from your experience — a project you led, a metric you achieved, or a specific reason you want this particular company and role." },
      ];

    // ── Audio Tools ────────────────────────────────────────────────────────────
    case "mp3-cutter":
      return [
        { question: "How precisely can I trim an MP3?", answer: "The MP3 Cutter supports millisecond-level precision. Use the waveform visualiser to drag start and end handles, or type exact timestamps in HH:MM:SS.ms format for frame-accurate cuts." },
        { question: "Does cutting an MP3 re-encode and degrade the audio?", answer: "No. MP3 cuts are performed at frame boundaries without re-encoding, preserving the original audio quality entirely. The cut operation is lossless." },
        { question: "Can I use the MP3 Cutter to create a ringtone?", answer: "Yes. Select a 30–40 second section of the song, cut it, and download the clip. Most smartphones accept MP3 ringtones directly without any conversion." },
      ];

    default:
      return [];
  }
}

// ─── Trait-Based Generic FAQs (converter / compressor / generator fallback) ───

function traitFAQs(tool: Tool, traits: ToolTraits): FAQ[] {
  const { name } = tool;
  const faqs: FAQ[] = [];

  if (traits.isConverter && traits.inputFormat && traits.outputFormat) {
    const inf  = traits.inputFormat.toUpperCase();
    const outf = traits.outputFormat.toUpperCase();
    faqs.push(
      { question: `Is ${inf} to ${outf} conversion lossless?`, answer: `Lossless conversion depends on the formats involved. Converting from a lossless format (PNG, WAV, FLAC) to another lossless format produces no quality loss. Converting to a lossy format (JPG, MP3, AAC) involves compression — you control quality via the settings slider.` },
      { question: `Can I convert multiple ${inf} files to ${outf} at once?`, answer: `Yes. Upload multiple files and they are all converted in a single batch, ready to download individually or as a single ZIP archive.` },
      { question: `How large can the ${inf} input file be?`, answer: `Processing happens locally in your browser so limits depend on your device's available memory. Files up to 100 MB are handled without issues on most computers.` },
    );
  }

  if (traits.isCompressor && !traits.hasPDF && !traits.hasImage && !traits.hasAudio) {
    faqs.push(
      { question: `What does ${name} compress and how much?`, answer: `${name} removes unnecessary whitespace, comments, and redundant characters to reduce file size. Typical size reductions are 20–60% depending on the original content verbosity.` },
      { question: `Is the output from ${name} still functional after compression?`, answer: `Yes. Compression only removes cosmetic characters (spaces, newlines, comments) that are not needed for the file to work correctly.` },
    );
  }

  if (traits.isGenerator && !traits.hasFileInput) {
    faqs.push(
      { question: `Can I customise the output from ${name}?`, answer: `Yes. All generated output is plain text or HTML that you can copy and edit in any text editor. Adjust wording, add details, or reformat as needed.` },
    );
  }

  if (traits.isAnalyzer && !traits.isCalculator) {
    faqs.push(
      { question: `How does ${name} work?`, answer: `${name} analyses the content, URL, or data you provide and returns a detailed report with actionable findings. All analysis runs in your browser — no server upload required.` },
    );
  }

  return faqs;
}

// ─── Introduction Generator (100-150 words) ───────────────────────────────────

const CAT_LABELS: Partial<Record<ToolCategory, string>> = {
  "pdf-tools":        "PDF management",
  "image-tools":      "image editing and conversion",
  "text-tools":       "text processing",
  "developer-tools":  "web development and coding",
  "seo-tools":        "search engine optimisation",
  "calculators":      "financial and mathematical calculations",
  "unit-converters":  "unit conversion",
  "ai-tools":         "AI-powered content creation",
  "business-tools":   "business document generation",
  "color-tools":      "colour and CSS design",
  "audio-tools":      "audio editing and conversion",
  "network-tools":    "network diagnostics",
};

const AUDIENCE_MAP: Partial<Record<ToolCategory, string>> = {
  "pdf-tools":        "students, office workers, freelancers, and anyone who works regularly with PDF documents",
  "image-tools":      "designers, photographers, marketers, developers, and e-commerce sellers",
  "text-tools":       "writers, bloggers, content creators, editors, and SEO professionals",
  "developer-tools":  "web developers, software engineers, and DevOps professionals",
  "seo-tools":        "SEO specialists, content marketers, website owners, and digital agencies",
  "calculators":      "individuals, students, business owners, and financial planners",
  "unit-converters":  "students, engineers, scientists, chefs, travellers, and anyone working across measurement systems",
  "ai-tools":         "job seekers, marketing professionals, entrepreneurs, and content creators",
  "business-tools":   "freelancers, SMEs, startups, accountants, and business owners",
  "color-tools":      "UI/UX designers, front-end developers, and graphic designers",
  "audio-tools":      "podcasters, musicians, content creators, and video editors",
  "network-tools":    "IT professionals, developers, system administrators, and network engineers",
};

function generateIntroduction(tool: Tool, traits: ToolTraits): string {
  const { name, description, category } = tool;
  const catLabel = CAT_LABELS[category]  ?? "online utilities";
  const audience = AUDIENCE_MAP[category] ?? "professionals and everyday users";

  const privacyNote = traits.usesExternalAPI
    ? "No files are stored on our servers."
    : "Your files never leave your browser — full privacy by design.";

  const actionVerb = traits.hasFileInput
    ? "upload"
    : traits.isCalculator
    ? "enter your values into"
    : traits.isGenerator
    ? "fill in the form for"
    : "paste your content into";

  // Two-paragraph format: what it does + who uses it and why
  return (
    `${name} is a free, browser-based ${catLabel} tool. ${description}\n\n` +
    `${audience.charAt(0).toUpperCase() + audience.slice(1)} use ${name} every day to save time and skip the overhead of desktop software or paid services. No installation, no account, and no technical knowledge required — just ${actionVerb} ${name} and get results in seconds. ${privacyNote}`
  );
}

// ─── HowTo Fallback ───────────────────────────────────────────────────────────

function howToFallback(tool: Tool, traits: ToolTraits): HowToStep[] {
  const { name } = tool;

  if (traits.isCalculator) {
    return [
      { title: "Enter your values",     description: `Type the required numbers into the input fields in the ${name}.` },
      { title: "Adjust settings",        description: "Set any additional options such as rate, period, currency, or compounding frequency." },
      { title: "See instant results",    description: "Results update in real time as you type — no submit button needed." },
      { title: "Copy or share results",  description: "Copy the output to your clipboard or bookmark the page with pre-filled values to return later." },
    ];
  }

  if (traits.isGenerator && !traits.hasFileInput) {
    return [
      { title: "Fill in the form",       description: `Enter the required details in the ${name} fields.` },
      { title: "Customise the options",  description: "Adjust style, format, and any optional fields to match your specific needs." },
      { title: "Generate",               description: `Click Generate to produce your output.` },
      { title: "Copy or download",       description: "Copy the text to your clipboard or download the file directly." },
    ];
  }

  if (traits.hasFileInput) {
    const kind = traits.hasPDF ? "PDF" : traits.hasAudio ? "audio file" : traits.hasImage ? "image" : "file";
    return [
      { title: `Upload your ${kind}`,   description: `Drag and drop your ${kind} onto the upload area, or click to browse and select it.` },
      { title: "Configure settings",    description: "Adjust quality, format, or processing options as needed." },
      { title: "Process",               description: `Click the action button to process your ${kind}.` },
      { title: "Download the result",   description: "Once complete, download your output file directly to your device." },
    ];
  }

  if (traits.isConverter) {
    return [
      { title: "Select your input",     description: "Upload the file or paste the content you want to convert." },
      { title: "Choose output options", description: "Select the target format and any quality or encoding settings." },
      { title: "Convert",               description: "Click Convert and wait a moment for the operation to finish." },
      { title: "Download",              description: "Download the converted output to your device." },
    ];
  }

  // Generic
  return [
    { title: `Open ${name}`,           description: `Navigate to the ${name} page on AllConverter.tools.` },
    { title: "Provide your input",     description: "Upload a file, paste text, or complete the form fields as required." },
    { title: "Configure options",      description: "Adjust settings to match your specific requirements." },
    { title: "Get your output",        description: "Process your input, then download or copy the result." },
  ];
}

// ─── Benefits Fallback ────────────────────────────────────────────────────────

function benefitsFallback(tool: Tool, traits: ToolTraits): string[] {
  const base: string[] = [
    "100% free with no usage limits, watermarks, or hidden fees",
    "No account or sign-up required — use it instantly",
    "Works in all modern browsers on desktop, tablet, and mobile",
  ];

  if (!traits.usesExternalAPI) {
    base.push("Privacy-first: all processing runs locally, files never leave your device");
  }

  if (traits.isCalculator) {
    base.push(
      "Instant real-time results — updates as you type",
      "Based on standard industry-accepted formulas",
      "Results displayed clearly with full breakdown",
    );
  } else if (traits.isGenerator) {
    base.push(
      "Professional, print-ready output in seconds",
      "Fully customisable fields to match your requirements",
      "Download as PDF or copy directly to clipboard",
    );
  } else if (traits.hasFileInput) {
    base.push(
      "Fast local processing — no server upload queues",
      "Batch process multiple files in one operation",
      "Original file is never modified — output is always a new file",
    );
  } else if (traits.isConverter) {
    base.push(
      "Instant conversion with no waiting queue",
      "Lossless quality where the format permits",
      "Batch convert multiple files at once",
    );
  } else if (traits.isAnalyzer) {
    base.push(
      "Actionable insights with clear, readable output",
      "Detailed breakdown with specific recommendations",
    );
  }

  return base.slice(0, 8);
}

// ─── Use Cases Fallback ───────────────────────────────────────────────────────

const USECASE_DEFAULTS: Partial<Record<ToolCategory, string[]>> = {
  "pdf-tools": [
    "Reducing PDF size for email attachments under size limits",
    "Archiving scanned documents in a compact, standardised format",
    "Sharing polished reports and proposals with clients",
    "Organising multi-document projects into a single file",
    "Preparing documents for e-signature platforms",
  ],
  "image-tools": [
    "Optimising images for faster website loading and Core Web Vitals",
    "Preparing assets for social media campaigns",
    "Resizing product photos for e-commerce listings (Amazon, Flipkart, Shopify)",
    "Converting formats for cross-platform compatibility",
    "Generating design mockup assets and placeholders",
  ],
  "audio-tools": [
    "Editing podcast episodes and removing unwanted sections",
    "Creating ringtones and audio clips from longer recordings",
    "Preparing audio files for video editing and post-production",
    "Converting audio formats for compatibility with different players and platforms",
    "Normalising audio levels before uploading to streaming services",
  ],
  "developer-tools": [
    "Debugging and validating data formats during API development",
    "Preparing test fixtures and sample payloads",
    "Encoding and decoding data for integrations and authentication flows",
    "Formatting and linting configuration files before deployment",
  ],
  "calculators": [
    "Planning a major purchase by comparing monthly payment scenarios",
    "Estimating tax liabilities and deductions before filing",
    "Projecting investment growth and setting savings targets",
    "Evaluating financial decisions with clear numbers before committing",
  ],
  "seo-tools": [
    "Optimising new pages before publishing to ensure technical correctness",
    "Auditing existing pages for crawlability and structured data issues",
    "Preparing JSON-LD schemas for rich results in Google Search",
    "Monitoring and improving search snippet appearance and CTR",
  ],
  "business-tools": [
    "Creating professional client-facing documents quickly",
    "Generating paperwork for freelance and contract engagements",
    "Streamlining administrative workflows for small businesses and startups",
    "Producing compliance-ready documents without legal software subscriptions",
  ],
  "ai-tools": [
    "Generating first drafts to overcome writer's block and save time",
    "Creating professional documents from minimal input",
    "Producing multiple content variations to A/B test different messaging angles",
    "Scaling content creation without hiring additional writers",
  ],
  "text-tools": [
    "Checking word and character counts before submitting essays or social posts",
    "Cleaning and normalising text exported from databases or other tools",
    "Reformatting content for specific platforms with different requirements",
    "Preparing text for analysis, translation, or further processing",
  ],
  "unit-converters": [
    "Converting measurements for international recipes and cooking",
    "Engineering and scientific unit conversions across measurement systems",
    "Academic calculations requiring precise unit conversions",
    "Travel planning with unfamiliar local measurement standards",
  ],
};

function useCasesFallback(tool: Tool): string[] {
  return USECASE_DEFAULTS[tool.category] ?? [
    "Quick one-off conversions without installing software",
    "Batch processing multiple items to save time",
    "Demonstrating concepts in teaching and learning contexts",
    "Cross-platform compatibility conversions and format standardisation",
  ];
}

// ─── Related Tools Fallback ───────────────────────────────────────────────────

function relatedToolsFallback(tool: Tool, allTools: Tool[]): string[] {
  if (tool.relatedTools?.length) return tool.relatedTools;
  return allTools
    .filter(t => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 5)
    .map(t => t.slug);
}

// ─── Main Export: getEnrichedTool ─────────────────────────────────────────────

/**
 * Returns the tool with all sparse or missing content fields filled in by the
 * content generator. Existing values in tools-data.ts are always preserved —
 * generated content only fills gaps (faqs < 8, missing howTo, benefits, etc.).
 */
export function getEnrichedTool(tool: Tool, allTools?: Tool[]): Tool {
  const traits = detectTraits(tool);

  // ── FAQs ──────────────────────────────────────────────────────────────────
  const existingFAQs      = tool.faqs ?? [];
  const existingQuestions = new Set(existingFAQs.map(f => f.question.toLowerCase()));

  const generated: FAQ[] = [
    ...slugSpecificFAQs(tool),
    ...categoryFAQs(tool, traits),
    ...traitFAQs(tool, traits),
    ...universalFAQs(tool, traits),
  ].filter(f => !existingQuestions.has(f.question.toLowerCase()));

  // Keep existing FAQs first; pad with generated ones up to 12 total
  const mergedFAQs = [...existingFAQs, ...generated].slice(0, 12);

  // ── HowTo ─────────────────────────────────────────────────────────────────
  const howTo = (tool.howTo?.length ?? 0) > 0
    ? tool.howTo!
    : howToFallback(tool, traits);

  // ── Benefits ──────────────────────────────────────────────────────────────
  const benefits = (tool.benefits?.length ?? 0) > 0
    ? tool.benefits!
    : benefitsFallback(tool, traits);

  // ── Use Cases ─────────────────────────────────────────────────────────────
  const useCases = (tool.useCases?.length ?? 0) > 0
    ? tool.useCases!
    : useCasesFallback(tool);

  // ── Related Tools ─────────────────────────────────────────────────────────
  const relatedTools = allTools
    ? relatedToolsFallback(tool, allTools)
    : (tool.relatedTools ?? []);

  // ── Introduction ──────────────────────────────────────────────────────────
  const introduction = tool.introduction ?? generateIntroduction(tool, traits);

  return { ...tool, faqs: mergedFAQs, howTo, benefits, useCases, relatedTools, introduction };
}

// ─── Schema Helpers ───────────────────────────────────────────────────────────

/**
 * Returns a Schema.org applicationCategory appropriate for this tool's category.
 * https://schema.org/applicationCategory
 */
export function getApplicationCategory(category: ToolCategory): string {
  const map: Partial<Record<ToolCategory, string>> = {
    "pdf-tools":       "UtilitiesApplication",
    "image-tools":     "GraphicsApplication",
    "audio-tools":     "MultimediaApplication",
    "developer-tools": "DeveloperApplication",
    "seo-tools":       "WebApplication",
    "calculators":     "FinanceApplication",
    "business-tools":  "BusinessApplication",
    "ai-tools":        "WebApplication",
    "text-tools":      "UtilitiesApplication",
    "unit-converters": "UtilitiesApplication",
    "color-tools":     "DesignApplication",
    "network-tools":   "NetworkingApplication",
  };
  return map[category] ?? "WebApplication";
}
