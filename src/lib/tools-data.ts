import type { Tool } from "@/types";

export const tools: Tool[] = [
  // ===========================
  // PDF TOOLS
  // ===========================
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    tagline: "Reduce PDF file size without losing quality",
    description:
      "Compress PDF files online for free. Reduce file size by up to 90% while maintaining visual quality. Perfect for email attachments, web uploads, and storage optimization.",
    category: "pdf-tools",
    icon: "FileDown",
    tags: ["pdf", "compress", "reduce size", "optimize"],
    isPopular: true,
    isFeatured: true,
    relatedTools: ["pdf-merger", "pdf-splitter", "pdf-to-word", "image-compressor"],
    useCases: [
      "Reduce PDF size for email attachments",
      "Optimize PDFs for web uploads",
      "Save storage space on devices",
      "Speed up PDF loading times",
    ],
    benefits: [
      "Reduce file size by up to 90%",
      "No quality loss on text and vectors",
      "Batch compress multiple files",
      "Files processed securely in browser",
    ],
    howTo: [
      { title: "Upload your PDF", description: "Drag and drop or click to select your PDF file." },
      { title: "Choose compression level", description: "Select between low, medium, or high compression." },
      { title: "Compress", description: "Click the compress button and wait for processing." },
      { title: "Download", description: "Download your compressed PDF instantly." },
    ],
    faqs: [
      {
        question: "How much can I compress a PDF?",
        answer:
          "Depending on the content, you can typically reduce PDF file size by 20–90%. PDFs with high-resolution images compress the most.",
      },
      {
        question: "Will compression affect quality?",
        answer:
          "Text, vectors, and fonts remain sharp. Images may see slight quality reduction at maximum compression settings.",
      },
      {
        question: "Is my PDF safe?",
        answer: "Yes. All processing happens in your browser. Your files are never uploaded to our servers.",
      },
    ],
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    tagline: "Combine multiple PDFs into one file",
    description:
      "Merge multiple PDF documents into a single file online. Reorder pages, set output quality, and combine PDFs from any device for free.",
    category: "pdf-tools",
    icon: "FilePlus2",
    tags: ["pdf", "merge", "combine", "join"],
    isPopular: true,
    relatedTools: ["pdf-splitter", "pdf-compressor", "pdf-to-word"],
    howTo: [
      { title: "Upload PDFs", description: "Select or drag multiple PDF files to merge." },
      { title: "Reorder files", description: "Drag to reorder the files in your desired sequence." },
      { title: "Merge", description: "Click merge to combine all files into one PDF." },
      { title: "Download", description: "Download your merged PDF." },
    ],
    faqs: [
      { question: "How many PDFs can I merge at once?", answer: "You can merge up to 20 PDF files at once." },
      { question: "Is the file order preserved?", answer: "Yes, files are merged in the order you arrange them." },
    ],
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter",
    tagline: "Split a PDF into multiple separate files",
    description:
      "Extract specific pages or split a PDF into multiple files. Choose page ranges, extract individual pages, or split by file size.",
    category: "pdf-tools",
    icon: "ScissorsLineDashed",
    tags: ["pdf", "split", "extract", "pages"],
    relatedTools: ["pdf-merger", "pdf-compressor"],
    howTo: [
      { title: "Upload PDF", description: "Select the PDF you want to split." },
      { title: "Choose split mode", description: "Split by page ranges, every N pages, or extract all pages." },
      { title: "Split", description: "Process the split operation." },
      { title: "Download", description: "Download individual files or a ZIP archive." },
    ],
    faqs: [
      { question: "Can I extract specific pages?", answer: "Yes, you can specify exact page ranges like 1-3, 5, 7-10." },
    ],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    tagline: "Convert PDF pages to JPG images",
    description: "Convert each PDF page into a high-quality JPG image. Choose resolution, quality, and export format.",
    category: "pdf-tools",
    icon: "FileImage",
    tags: ["pdf", "jpg", "image", "convert"],
    relatedTools: ["jpg-to-pdf", "pdf-compressor", "image-compressor"],
    howTo: [
      { title: "Upload PDF", description: "Select your PDF to convert to images." },
      { title: "Set quality", description: "Choose output resolution and quality." },
      { title: "Convert", description: "Convert all pages to JPG images." },
      { title: "Download", description: "Download individual JPGs or a ZIP." },
    ],
    faqs: [
      { question: "What resolution are the output images?", answer: "Default is 150 DPI. You can choose up to 300 DPI for print quality." },
    ],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    tagline: "Convert JPG images to PDF",
    description: "Convert one or multiple JPG images into a PDF document. Supports JPG, PNG, WEBP, and other image formats.",
    category: "pdf-tools",
    icon: "FilePlus",
    tags: ["jpg", "pdf", "image", "convert"],
    relatedTools: ["pdf-to-jpg", "pdf-compressor", "image-compressor"],
    howTo: [
      { title: "Upload images", description: "Select JPG or other image files." },
      { title: "Set page size", description: "Choose PDF page size (A4, Letter, etc.)." },
      { title: "Convert", description: "Generate your PDF." },
      { title: "Download", description: "Download the PDF file." },
    ],
    faqs: [
      { question: "Can I convert multiple images?", answer: "Yes, each image becomes one page in the output PDF." },
    ],
  },

  // ===========================
  // IMAGE TOOLS
  // ===========================
  {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Compress images without visible quality loss",
    description:
      "Compress JPEG, PNG, WebP, and GIF images online. Reduce file size by up to 80% with smart lossy and lossless compression algorithms.",
    category: "image-tools",
    icon: "ImageDown",
    tags: ["image", "compress", "optimize", "jpg", "png", "webp"],
    isPopular: true,
    isFeatured: true,
    relatedTools: ["image-resizer", "jpg-to-png", "png-to-webp", "pdf-compressor"],
    useCases: [
      "Optimize images for faster website loading",
      "Reduce storage space usage",
      "Prepare images for email attachments",
      "Batch compress product photos",
    ],
    benefits: [
      "Up to 80% file size reduction",
      "Smart compression preserves visual quality",
      "Supports JPG, PNG, WebP, GIF",
      "Batch process multiple images",
    ],
    howTo: [
      { title: "Upload images", description: "Select images or drag and drop files." },
      { title: "Adjust quality", description: "Set your desired compression level (1–100)." },
      { title: "Compress", description: "Process your images." },
      { title: "Download", description: "Download compressed files individually or as ZIP." },
    ],
    faqs: [
      { question: "What formats are supported?", answer: "JPG, PNG, WebP, GIF, BMP, and TIFF are all supported." },
      { question: "Can I compress multiple images at once?", answer: "Yes, you can upload and compress up to 20 images simultaneously." },
    ],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    tagline: "Resize images to exact dimensions",
    description:
      "Resize images by pixels, percentage, or preset sizes. Maintain aspect ratio, crop, and output in any format.",
    category: "image-tools",
    icon: "Maximize2",
    tags: ["image", "resize", "dimensions", "crop"],
    isPopular: true,
    relatedTools: ["image-compressor", "jpg-to-png", "image-cropper"],
    howTo: [
      { title: "Upload image", description: "Select the image you want to resize." },
      { title: "Set dimensions", description: "Enter width, height, or percentage." },
      { title: "Resize", description: "Apply the resize operation." },
      { title: "Download", description: "Save your resized image." },
    ],
    faqs: [
      { question: "Will aspect ratio be maintained?", answer: "By default yes. You can disable this for custom dimensions." },
    ],
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG",
    tagline: "Convert JPG images to PNG format",
    description: "Convert JPEG images to PNG format with full transparency support. Lossless conversion preserves image quality.",
    category: "image-tools",
    icon: "RefreshCw",
    tags: ["jpg", "png", "convert", "image"],
    isTrending: true,
    relatedTools: ["png-to-jpg", "image-compressor", "png-to-webp"],
    howTo: [
      { title: "Upload JPG", description: "Select your JPEG image file." },
      { title: "Convert", description: "Convert to PNG format." },
      { title: "Download", description: "Download your PNG file." },
    ],
    faqs: [
      { question: "Will I lose quality converting JPG to PNG?", answer: "No. PNG is lossless, so conversion from JPG to PNG maintains the current quality without further loss." },
    ],
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG",
    tagline: "Convert PNG images to JPG format",
    description: "Convert PNG files to JPEG format with custom quality settings. Reduces file size for web-optimized images.",
    category: "image-tools",
    icon: "RefreshCcw",
    tags: ["png", "jpg", "convert", "image"],
    relatedTools: ["jpg-to-png", "image-compressor"],
    howTo: [
      { title: "Upload PNG", description: "Select your PNG image file." },
      { title: "Set quality", description: "Choose JPEG quality (1–100)." },
      { title: "Convert", description: "Convert to JPG format." },
      { title: "Download", description: "Download your JPG file." },
    ],
    faqs: [],
  },
  {
    slug: "png-to-webp",
    name: "PNG to WebP",
    tagline: "Convert PNG to modern WebP format",
    description: "Convert PNG images to WebP for smaller file sizes and better web performance. WebP is supported by all modern browsers.",
    category: "image-tools",
    icon: "Zap",
    tags: ["png", "webp", "convert", "web"],
    isTrending: true,
    relatedTools: ["jpg-to-png", "image-compressor"],
    howTo: [
      { title: "Upload PNG", description: "Select your PNG image." },
      { title: "Set quality", description: "Adjust WebP quality settings." },
      { title: "Convert", description: "Convert to WebP format." },
      { title: "Download", description: "Download the WebP file." },
    ],
    faqs: [],
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    tagline: "Crop images with precision",
    description: "Crop images online with a free-hand or aspect-ratio crop tool. Supports common ratios like 16:9, 4:3, 1:1, and custom.",
    category: "image-tools",
    icon: "Crop",
    tags: ["image", "crop", "edit", "aspect ratio"],
    relatedTools: ["image-resizer", "image-compressor"],
    howTo: [
      { title: "Upload image", description: "Select the image you want to crop." },
      { title: "Set crop area", description: "Drag to select the area or choose a preset ratio." },
      { title: "Crop", description: "Apply the crop." },
      { title: "Download", description: "Save your cropped image." },
    ],
    faqs: [],
  },
  {
    slug: "background-remover",
    name: "Background Remover",
    tagline: "Remove image backgrounds instantly",
    description: "Remove image backgrounds automatically using AI. Perfect for product photos, profile pictures, and design assets.",
    category: "image-tools",
    icon: "Layers",
    tags: ["background", "remove", "transparent", "ai", "png"],
    isNew: true,
    isTrending: true,
    relatedTools: ["image-compressor", "png-to-webp"],
    howTo: [
      { title: "Upload image", description: "Select an image with a background to remove." },
      { title: "Process", description: "AI automatically removes the background." },
      { title: "Refine", description: "Use the eraser/restore tool to fine-tune edges." },
      { title: "Download", description: "Save as transparent PNG." },
    ],
    faqs: [],
  },
  {
    slug: "svg-to-png",
    name: "SVG to PNG",
    tagline: "Convert SVG vector to PNG image",
    description: "Convert SVG files to high-resolution PNG images at any scale. Set custom width, height, and background color.",
    category: "image-tools",
    icon: "Shapes",
    tags: ["svg", "png", "vector", "convert"],
    relatedTools: ["png-to-webp", "image-resizer"],
    howTo: [
      { title: "Upload SVG", description: "Select your SVG vector file." },
      { title: "Set size", description: "Enter the desired output dimensions." },
      { title: "Convert", description: "Render the SVG to PNG." },
      { title: "Download", description: "Download your PNG." },
    ],
    faqs: [],
  },

  // ===========================
  // TEXT TOOLS
  // ===========================
  {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Count words, characters, sentences, and paragraphs",
    description:
      "Instantly count words, characters (with and without spaces), sentences, paragraphs, and reading time. Includes keyword density analysis.",
    category: "text-tools",
    icon: "Hash",
    tags: ["word count", "character count", "text analysis", "writing"],
    isPopular: true,
    isFeatured: true,
    relatedTools: ["case-converter", "text-cleaner", "lorem-ipsum-generator"],
    useCases: [
      "Check essay or article word count",
      "Verify Twitter/social media character limits",
      "Analyze keyword density for SEO",
      "Estimate reading time for blog posts",
    ],
    benefits: [
      "Real-time word and character counting",
      "Reading time estimation",
      "Keyword density analysis",
      "Works with any language",
    ],
    howTo: [
      { title: "Paste your text", description: "Type or paste your text into the input area." },
      { title: "View statistics", description: "Instantly see word count, character count, and more." },
      { title: "Analyze", description: "Check keyword density and reading time." },
    ],
    faqs: [
      { question: "Does it count characters with spaces?", answer: "Yes, we show both character counts: with and without spaces." },
      { question: "How is reading time calculated?", answer: "Based on the average reading speed of 200–250 words per minute." },
    ],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    tagline: "Convert text to any case format",
    description:
      "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and more.",
    category: "text-tools",
    icon: "CaseSensitive",
    tags: ["case", "uppercase", "lowercase", "camelcase", "text"],
    isPopular: true,
    relatedTools: ["word-counter", "text-cleaner"],
    howTo: [
      { title: "Paste text", description: "Enter the text you want to convert." },
      { title: "Choose case", description: "Select the target case format." },
      { title: "Copy result", description: "Copy the converted text with one click." },
    ],
    faqs: [
      { question: "What case formats are supported?", answer: "UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, kebab-case, SCREAMING_SNAKE, dot.case." },
    ],
  },
  {
    slug: "text-cleaner",
    name: "Text Cleaner",
    tagline: "Remove extra spaces, lines, and formatting",
    description:
      "Clean and format text by removing extra whitespace, blank lines, HTML tags, special characters, and more. Essential for content editing.",
    category: "text-tools",
    icon: "Eraser",
    tags: ["text", "clean", "format", "whitespace"],
    relatedTools: ["word-counter", "case-converter"],
    howTo: [
      { title: "Paste text", description: "Enter the text to clean." },
      { title: "Select options", description: "Choose what to remove or fix." },
      { title: "Clean", description: "Apply cleaning operations." },
      { title: "Copy", description: "Copy the cleaned text." },
    ],
    faqs: [],
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    tagline: "Generate placeholder text for designs",
    description: "Generate Lorem Ipsum placeholder text in paragraphs, sentences, or words. Supports classic and Cicero-original modes.",
    category: "text-tools",
    icon: "AlignLeft",
    tags: ["lorem ipsum", "placeholder", "dummy text", "design"],
    relatedTools: ["word-counter", "text-cleaner"],
    howTo: [
      { title: "Set quantity", description: "Choose number of paragraphs, sentences, or words." },
      { title: "Choose type", description: "Classic Lorem Ipsum or random words." },
      { title: "Generate", description: "Generate your placeholder text." },
      { title: "Copy", description: "Copy to clipboard." },
    ],
    faqs: [],
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML",
    tagline: "Convert Markdown text to HTML",
    description: "Convert Markdown files and text to HTML code with live preview. Supports GitHub Flavored Markdown.",
    category: "text-tools",
    icon: "FileCode",
    tags: ["markdown", "html", "convert", "developer"],
    relatedTools: ["html-to-markdown", "json-formatter"],
    howTo: [
      { title: "Enter Markdown", description: "Type or paste your Markdown text." },
      { title: "Preview", description: "See the live HTML preview." },
      { title: "Copy HTML", description: "Copy the generated HTML code." },
    ],
    faqs: [],
  },

  // ===========================
  // DEVELOPER TOOLS
  // ===========================
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Format, validate, and beautify JSON",
    description:
      "Format and validate JSON data with syntax highlighting, error detection, and minification. Supports JSON5 and handles malformed JSON gracefully.",
    category: "developer-tools",
    icon: "Braces",
    tags: ["json", "format", "validate", "beautify", "developer"],
    isPopular: true,
    isFeatured: true,
    relatedTools: ["base64-encoder", "url-encoder", "json-to-csv", "xml-formatter"],
    useCases: [
      "Debug API responses",
      "Validate JSON data structures",
      "Minify JSON for production",
      "Convert JSON to readable format",
    ],
    benefits: [
      "Instant JSON validation with error messages",
      "Syntax highlighting for readability",
      "One-click minify and beautify",
      "Copy formatted output instantly",
    ],
    howTo: [
      { title: "Paste JSON", description: "Paste your JSON data into the input area." },
      { title: "Validate", description: "Errors are highlighted with helpful messages." },
      { title: "Format", description: "Beautify or minify with a single click." },
      { title: "Copy", description: "Copy the formatted JSON to clipboard." },
    ],
    faqs: [
      { question: "Can it detect JSON errors?", answer: "Yes, the formatter shows exactly where syntax errors occur with line and column numbers." },
      { question: "What is JSON minification?", answer: "Minification removes all unnecessary whitespace to reduce file size for production use." },
    ],
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder / Decoder",
    tagline: "Encode and decode Base64 strings",
    description:
      "Encode text or files to Base64 and decode Base64 strings back to text. Supports UTF-8, binary data, and data URI generation.",
    category: "developer-tools",
    icon: "Binary",
    tags: ["base64", "encode", "decode", "developer"],
    isPopular: true,
    relatedTools: ["url-encoder", "json-formatter", "md5-hash-generator"],
    howTo: [
      { title: "Enter text", description: "Paste the text or data to encode." },
      { title: "Encode or Decode", description: "Toggle between encode and decode modes." },
      { title: "Copy result", description: "Copy the output to clipboard." },
    ],
    faqs: [
      { question: "What is Base64 encoding?", answer: "Base64 encodes binary data as ASCII text, commonly used for embedding data in HTML, CSS, or APIs." },
    ],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    tagline: "Encode and decode URLs",
    description: "Encode and decode URLs for safe transmission. Handles percent-encoding, query parameters, and full URL encoding.",
    category: "developer-tools",
    icon: "Link",
    tags: ["url", "encode", "decode", "percent-encoding"],
    relatedTools: ["base64-encoder", "json-formatter"],
    howTo: [
      { title: "Paste URL", description: "Enter the URL or text to encode." },
      { title: "Encode/Decode", description: "Choose the operation." },
      { title: "Copy result", description: "Copy the encoded or decoded URL." },
    ],
    faqs: [],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    tagline: "Generate random UUIDs and GUIDs",
    description: "Generate Version 1, 4, and 5 UUIDs (GUIDs). Generate single or bulk UUIDs for database primary keys and unique identifiers.",
    category: "developer-tools",
    icon: "Fingerprint",
    tags: ["uuid", "guid", "generate", "unique id"],
    isTrending: true,
    relatedTools: ["password-generator", "hash-generator"],
    howTo: [
      { title: "Choose version", description: "Select UUID version (v1, v4, or v5)." },
      { title: "Set quantity", description: "Choose how many UUIDs to generate." },
      { title: "Generate", description: "Click generate to create UUIDs." },
      { title: "Copy", description: "Copy individual or all UUIDs." },
    ],
    faqs: [],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    tagline: "Test and debug regular expressions",
    description: "Test regular expressions with real-time match highlighting. Supports JavaScript, Python, and PCRE regex flavors.",
    category: "developer-tools",
    icon: "ScanSearch",
    tags: ["regex", "regular expression", "pattern", "developer"],
    relatedTools: ["json-formatter", "url-encoder"],
    howTo: [
      { title: "Enter regex", description: "Type your regular expression pattern." },
      { title: "Paste test string", description: "Enter the text to test against." },
      { title: "View matches", description: "See all matches highlighted in real time." },
    ],
    faqs: [],
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    tagline: "Convert between HEX, RGB, HSL, and more",
    description: "Convert colors between HEX, RGB, RGBA, HSL, HSLA, HSV, and CSS named colors. Includes a color picker and palette generator.",
    category: "developer-tools",
    icon: "Palette",
    tags: ["color", "hex", "rgb", "hsl", "converter"],
    isPopular: true,
    relatedTools: ["css-minifier", "json-formatter"],
    howTo: [
      { title: "Enter color", description: "Type a color in any format or use the color picker." },
      { title: "View conversions", description: "See the color in all formats instantly." },
      { title: "Copy", description: "Copy any format with one click." },
    ],
    faqs: [],
  },
  {
    slug: "html-entity-encoder",
    name: "HTML Entity Encoder",
    tagline: "Encode and decode HTML entities",
    description: "Encode special characters to HTML entities and decode HTML entities back to text. Essential for safe HTML content rendering.",
    category: "developer-tools",
    icon: "Code",
    tags: ["html", "entity", "encode", "decode"],
    relatedTools: ["base64-encoder", "url-encoder"],
    howTo: [
      { title: "Paste content", description: "Enter text with special characters." },
      { title: "Encode/Decode", description: "Convert to or from HTML entities." },
      { title: "Copy result", description: "Copy the output." },
    ],
    faqs: [],
  },
  {
    slug: "css-minifier",
    name: "CSS Minifier",
    tagline: "Minify CSS files for faster loading",
    description: "Minify and compress CSS code to reduce file size. Remove comments, whitespace, and redundant code for production use.",
    category: "developer-tools",
    icon: "Minimize2",
    tags: ["css", "minify", "compress", "optimize"],
    relatedTools: ["json-formatter", "html-entity-encoder"],
    howTo: [
      { title: "Paste CSS", description: "Enter your CSS code." },
      { title: "Minify", description: "Click minify to compress." },
      { title: "Copy result", description: "Copy the minified CSS." },
    ],
    faqs: [],
  },

  // ===========================
  // SEO TOOLS
  // ===========================
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    tagline: "Generate SEO meta tags for any page",
    description:
      "Generate complete SEO meta tags including title, description, keywords, Open Graph, Twitter Cards, and robots directives.",
    category: "seo-tools",
    icon: "Tags",
    tags: ["seo", "meta tags", "open graph", "twitter cards"],
    isPopular: true,
    isFeatured: true,
    relatedTools: ["robots-txt-generator", "sitemap-generator", "keyword-density-checker"],
    useCases: [
      "Generate meta tags for new web pages",
      "Create Open Graph tags for social sharing",
      "Generate Twitter Card meta tags",
      "Set canonical URLs and robots directives",
    ],
    howTo: [
      { title: "Enter page info", description: "Fill in your page title, description, and keywords." },
      { title: "Configure OG/Twitter", description: "Set Open Graph and Twitter Card properties." },
      { title: "Generate", description: "Preview and generate the meta tag code." },
      { title: "Copy HTML", description: "Copy the complete <head> section code." },
    ],
    faqs: [
      { question: "How long should meta descriptions be?", answer: "Meta descriptions should be 150–160 characters for optimal display in search results." },
    ],
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    tagline: "Generate robots.txt for your website",
    description: "Create a robots.txt file to control search engine crawling. Specify allowed/disallowed paths per bot with sitemap reference.",
    category: "seo-tools",
    icon: "Bot",
    tags: ["robots.txt", "seo", "crawler", "sitemap"],
    relatedTools: ["sitemap-generator", "meta-tag-generator"],
    howTo: [
      { title: "Choose crawlers", description: "Select which bots to configure rules for." },
      { title: "Set rules", description: "Allow or disallow specific paths." },
      { title: "Add sitemap", description: "Include your sitemap URL." },
      { title: "Download", description: "Download the robots.txt file." },
    ],
    faqs: [],
  },
  {
    slug: "keyword-density-checker",
    name: "Keyword Density Checker",
    tagline: "Analyze keyword frequency in your content",
    description: "Analyze keyword density in text content. Find the top keywords, bigrams, and trigrams to optimize for SEO.",
    category: "seo-tools",
    icon: "BarChart2",
    tags: ["keyword", "density", "seo", "content", "analysis"],
    relatedTools: ["word-counter", "meta-tag-generator"],
    howTo: [
      { title: "Paste content", description: "Enter or paste your page content." },
      { title: "Analyze", description: "Calculate keyword frequencies." },
      { title: "Review results", description: "See top keywords with density percentages." },
    ],
    faqs: [],
  },
  {
    slug: "sitemap-generator",
    name: "Sitemap Generator",
    tagline: "Generate XML sitemaps for your website",
    description: "Create XML sitemaps for SEO by entering your website URLs. Set priority, change frequency, and last modified dates.",
    category: "seo-tools",
    icon: "Map",
    tags: ["sitemap", "xml", "seo", "google"],
    relatedTools: ["robots-txt-generator", "meta-tag-generator"],
    howTo: [
      { title: "Enter URLs", description: "Add your website URLs." },
      { title: "Set attributes", description: "Configure priority and change frequency." },
      { title: "Generate", description: "Create the XML sitemap." },
      { title: "Download", description: "Download sitemap.xml." },
    ],
    faqs: [],
  },
  {
    slug: "open-graph-tester",
    name: "Open Graph Tester",
    tagline: "Preview how your page looks when shared",
    description: "Preview how your webpage appears when shared on Facebook, Twitter, LinkedIn, and WhatsApp. Test Open Graph and Twitter Card tags.",
    category: "seo-tools",
    icon: "Share2",
    tags: ["open graph", "twitter card", "social media", "preview", "seo"],
    isNew: true,
    relatedTools: ["meta-tag-generator", "sitemap-generator"],
    howTo: [
      { title: "Enter URL or meta tags", description: "Enter a URL or paste your meta tag code." },
      { title: "Preview", description: "See previews across all major platforms." },
      { title: "Edit tags", description: "Adjust tags to optimize appearance." },
    ],
    faqs: [],
  },

  // ===========================
  // CALCULATORS
  // ===========================
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    tagline: "Calculate your Body Mass Index",
    description:
      "Calculate your BMI (Body Mass Index) using weight and height. Supports metric (kg/cm) and imperial (lb/in) units. Includes healthy weight range.",
    category: "calculators",
    icon: "Activity",
    tags: ["bmi", "body mass index", "health", "weight", "calculator"],
    isPopular: true,
    isFeatured: true,
    relatedTools: ["calorie-calculator", "body-fat-calculator", "ideal-weight-calculator"],
    useCases: [
      "Check if your weight is healthy",
      "Track fitness progress over time",
      "Calculate BMI for medical records",
      "Understand healthy weight ranges",
    ],
    howTo: [
      { title: "Enter weight", description: "Enter your weight in kg or lbs." },
      { title: "Enter height", description: "Enter your height in cm or feet/inches." },
      { title: "Calculate", description: "Click calculate to get your BMI." },
      { title: "Interpret results", description: "See your BMI category and healthy range." },
    ],
    faqs: [
      { question: "What is a healthy BMI?", answer: "A BMI between 18.5 and 24.9 is considered healthy for adults." },
      { question: "Is BMI accurate for athletes?", answer: "BMI doesn't account for muscle mass, so athletes may have high BMI despite being healthy." },
    ],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    tagline: "Calculate exact age from date of birth",
    description: "Calculate your exact age in years, months, days, hours, and minutes from your date of birth.",
    category: "calculators",
    icon: "Calendar",
    tags: ["age", "birthday", "date", "calculator"],
    isPopular: true,
    relatedTools: ["bmi-calculator", "percentage-calculator"],
    howTo: [
      { title: "Enter birthdate", description: "Select your date of birth." },
      { title: "Set target date", description: "Use today or a custom date." },
      { title: "Calculate", description: "See your exact age breakdown." },
    ],
    faqs: [
      { question: "How precise is the calculation?", answer: "We calculate age down to the exact day, hour, and minute." },
    ],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    tagline: "Calculate percentages quickly and accurately",
    description: "Calculate percentages, percentage change, percentage of a number, and more. Multiple calculation modes in one tool.",
    category: "calculators",
    icon: "Percent",
    tags: ["percentage", "math", "calculator"],
    isPopular: true,
    relatedTools: ["age-calculator", "bmi-calculator", "scientific-calculator"],
    howTo: [
      { title: "Choose mode", description: "Select percentage type (of, change, difference)." },
      { title: "Enter values", description: "Input your numbers." },
      { title: "Calculate", description: "See the result instantly." },
    ],
    faqs: [],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    tagline: "Calculate compound interest and investment growth",
    description: "Calculate compound interest for investments, savings, and loans. Supports monthly, quarterly, and annual compounding.",
    category: "calculators",
    icon: "TrendingUp",
    tags: ["compound interest", "investment", "savings", "financial"],
    isTrending: true,
    relatedTools: ["loan-calculator", "percentage-calculator"],
    howTo: [
      { title: "Enter principal", description: "Enter the initial investment amount." },
      { title: "Set rate and period", description: "Enter annual interest rate and time period." },
      { title: "Choose compounding", description: "Select compounding frequency." },
      { title: "Calculate", description: "See total amount and interest earned." },
    ],
    faqs: [
      { question: "What is the difference between simple and compound interest?", answer: "Simple interest is calculated only on principal. Compound interest is calculated on principal plus accumulated interest." },
    ],
  },
  {
    slug: "loan-calculator",
    name: "Loan EMI Calculator",
    tagline: "Calculate monthly loan payments (EMI)",
    description: "Calculate loan EMI, total interest payable, and amortization schedule for home, car, and personal loans.",
    category: "calculators",
    icon: "CreditCard",
    tags: ["loan", "emi", "mortgage", "financial", "calculator"],
    isPopular: true,
    relatedTools: ["compound-interest-calculator", "percentage-calculator"],
    howTo: [
      { title: "Enter loan amount", description: "Enter the total loan amount." },
      { title: "Set rate and tenure", description: "Enter interest rate and loan term." },
      { title: "Calculate EMI", description: "See monthly payment and total interest." },
      { title: "View schedule", description: "Check the full amortization table." },
    ],
    faqs: [],
  },
  {
    slug: "password-strength-checker",
    name: "Password Strength Checker",
    tagline: "Check how strong your password is",
    description: "Analyze password strength in real time. Checks length, complexity, common patterns, and estimated crack time.",
    category: "calculators",
    icon: "ShieldCheck",
    tags: ["password", "security", "strength", "checker"],
    relatedTools: ["password-generator", "uuid-generator"],
    howTo: [
      { title: "Enter password", description: "Type your password into the secure field." },
      { title: "View analysis", description: "See strength score and specific weaknesses." },
      { title: "Improve", description: "Follow suggestions to strengthen your password." },
    ],
    faqs: [],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    tagline: "Generate strong, secure passwords",
    description: "Generate random, secure passwords with custom length, character sets, and complexity rules. Includes passphrase generator.",
    category: "developer-tools",
    icon: "KeyRound",
    tags: ["password", "security", "generate", "random"],
    isPopular: true,
    relatedTools: ["uuid-generator", "password-strength-checker"],
    howTo: [
      { title: "Set length", description: "Choose password length (8–128 characters)." },
      { title: "Select characters", description: "Choose uppercase, lowercase, numbers, symbols." },
      { title: "Generate", description: "Create your secure password." },
      { title: "Copy", description: "Copy to clipboard securely." },
    ],
    faqs: [
      { question: "Are generated passwords stored?", answer: "No. Passwords are generated entirely in your browser and never transmitted or stored." },
    ],
  },

  // ===========================
  // UNIT CONVERTERS
  // ===========================
  {
    slug: "length-converter",
    name: "Length Converter",
    tagline: "Convert between meters, feet, miles, and more",
    description: "Convert between all length units including metric, imperial, and nautical. Supports mm, cm, m, km, in, ft, yd, mi, and more.",
    category: "unit-converters",
    icon: "Ruler",
    tags: ["length", "meters", "feet", "miles", "convert"],
    isPopular: true,
    relatedTools: ["weight-converter", "temperature-converter", "area-converter"],
    howTo: [
      { title: "Enter value", description: "Type the length value to convert." },
      { title: "Select units", description: "Choose from and to units." },
      { title: "Convert", description: "See all conversions instantly." },
    ],
    faqs: [],
  },
  {
    slug: "weight-converter",
    name: "Weight Converter",
    tagline: "Convert kg, lbs, oz, grams, and more",
    description: "Convert between all weight and mass units including kilograms, pounds, ounces, grams, tons, and more.",
    category: "unit-converters",
    icon: "Scale",
    tags: ["weight", "mass", "kg", "lbs", "convert"],
    isPopular: true,
    relatedTools: ["length-converter", "temperature-converter"],
    howTo: [
      { title: "Enter weight", description: "Enter the weight value to convert." },
      { title: "Select units", description: "Choose source and target units." },
      { title: "Convert", description: "See conversions across all units." },
    ],
    faqs: [],
  },
  {
    slug: "temperature-converter",
    name: "Temperature Converter",
    tagline: "Convert Celsius, Fahrenheit, and Kelvin",
    description: "Convert between Celsius, Fahrenheit, Kelvin, and Rankine temperature scales with instant results and formula explanations.",
    category: "unit-converters",
    icon: "Thermometer",
    tags: ["temperature", "celsius", "fahrenheit", "kelvin", "convert"],
    isPopular: true,
    relatedTools: ["length-converter", "weight-converter"],
    howTo: [
      { title: "Enter temperature", description: "Enter your temperature value." },
      { title: "Select scale", description: "Choose the input temperature scale." },
      { title: "Convert", description: "See values in all temperature scales." },
    ],
    faqs: [
      { question: "How do I convert Celsius to Fahrenheit?", answer: "Multiply by 9/5 then add 32. Example: 100°C × 9/5 + 32 = 212°F." },
    ],
  },
  {
    slug: "area-converter",
    name: "Area Converter",
    tagline: "Convert square meters, acres, hectares, and more",
    description: "Convert between area units: square meters, square feet, acres, hectares, square kilometers, and more.",
    category: "unit-converters",
    icon: "Square",
    tags: ["area", "acres", "hectares", "square meters", "convert"],
    relatedTools: ["length-converter", "volume-converter"],
    howTo: [
      { title: "Enter area", description: "Enter the area value." },
      { title: "Select units", description: "Choose input and output units." },
      { title: "Convert", description: "View the conversion." },
    ],
    faqs: [],
  },
  {
    slug: "speed-converter",
    name: "Speed Converter",
    tagline: "Convert mph, km/h, m/s, and knots",
    description: "Convert between speed units: miles per hour, kilometers per hour, meters per second, knots, and Mach number.",
    category: "unit-converters",
    icon: "Gauge",
    tags: ["speed", "mph", "km/h", "knots", "convert"],
    relatedTools: ["length-converter", "temperature-converter"],
    howTo: [
      { title: "Enter speed", description: "Enter the speed value." },
      { title: "Choose units", description: "Select from and to units." },
      { title: "Convert", description: "See the result instantly." },
    ],
    faqs: [],
  },

  // ===========================
  // BUSINESS TOOLS
  // ===========================
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    tagline: "Create professional invoices for free",
    description: "Create and download professional PDF invoices instantly. Customize your logo, line items, taxes, and payment terms.",
    category: "business-tools",
    icon: "FileSpreadsheet",
    tags: ["invoice", "billing", "pdf", "business", "freelance"],
    isNew: true,
    isTrending: true,
    relatedTools: ["signature-generator", "pdf-compressor"],
    howTo: [
      { title: "Enter business info", description: "Add your name, logo, and contact details." },
      { title: "Add line items", description: "Enter services, quantities, and prices." },
      { title: "Set terms", description: "Add due date, notes, and payment terms." },
      { title: "Download PDF", description: "Generate and download your invoice." },
    ],
    faqs: [],
  },

  // GST Invoice Generator
  { slug: "gst-invoice-generator", name: "GST Invoice Generator", tagline: "Create GST-compliant tax invoices with CGST/SGST/IGST", description: "Generate professional GST tax invoices with GSTIN fields, HSN/SAC codes, and automatic CGST/SGST/IGST breakdown. Print or save as PDF.", category: "business-tools", icon: "ReceiptText", tags: ["gst", "invoice", "tax", "cgst", "sgst", "igst", "india", "billing"], isNew: true, isTrending: true, relatedTools: ["invoice-generator", "gst-calculator", "receipt-generator"], howTo: [{ title: "Enter supplier & buyer details", description: "Add GSTINs, addresses, and contact info." }, { title: "Select supply type", description: "Choose intra-state (CGST+SGST) or inter-state (IGST)." }, { title: "Add line items", description: "Enter HSN/SAC codes, quantities, rates, and GST rates." }, { title: "Print or save", description: "Preview and print/save as PDF." }], faqs: [{ question: "What is a GST invoice?", answer: "A GST tax invoice is a legal document issued by a GST-registered supplier to the buyer, showing GSTIN, HSN codes, and applicable GST components." }] },
  // Quotation Generator
  { slug: "quotation-generator", name: "Quotation Generator", tagline: "Create professional quotes for clients", description: "Generate polished quotations with line items, tax, validity date, and terms. Perfect for freelancers, agencies, and businesses.", category: "business-tools", icon: "ClipboardList", tags: ["quotation", "quote", "estimate", "proposal", "business"], isNew: true, relatedTools: ["invoice-generator", "proposal-generator"], howTo: [{ title: "Enter your details", description: "Add your company info and logo color." }, { title: "Add client details", description: "Enter client name and address." }, { title: "Add line items", description: "Enter services, quantities, and rates." }, { title: "Print or save", description: "Preview and export to PDF." }], faqs: [] },
  // Receipt Generator
  { slug: "receipt-generator", name: "Receipt Generator", tagline: "Create payment receipts instantly", description: "Generate professional payment receipts with amount in words, payment method, and authorized signatures. Print or save as PDF.", category: "business-tools", icon: "Receipt", tags: ["receipt", "payment", "billing", "cash", "business"], isNew: true, relatedTools: ["invoice-generator", "gst-invoice-generator"], howTo: [{ title: "Fill in details", description: "Enter issuer, payer, amount, and purpose." }, { title: "Choose payment method", description: "Select cash, UPI, bank transfer, etc." }, { title: "Preview", description: "See the formatted receipt." }, { title: "Print or save", description: "Download as PDF." }], faqs: [] },
  // Salary Calculator
  { slug: "salary-calculator", name: "Salary Calculator", tagline: "Calculate take-home salary with deductions", description: "Calculate monthly and annual take-home salary with all earnings (basic, HRA, DA, allowances) and deductions (PF, PT, TDS, ESI).", category: "business-tools", icon: "IndianRupee", tags: ["salary", "calculator", "take-home", "pf", "tds", "india"], isNew: true, relatedTools: ["ctc-to-inhand-calculator", "salary-slip-generator"], howTo: [{ title: "Enter earnings", description: "Add basic salary, HRA, DA, and allowances." }, { title: "Enter deductions", description: "Add PF, PT, TDS, and other deductions." }, { title: "See results", description: "View gross, deductions, and net take-home." }], faqs: [{ question: "What deductions are included?", answer: "PF (12% of basic), Professional Tax, TDS, ESI, and any custom deductions you add." }] },
  // CTC to In-Hand
  { slug: "ctc-to-inhand-calculator", name: "CTC to In-Hand Salary Calculator", tagline: "Convert annual CTC to monthly in-hand salary", description: "Calculate your monthly in-hand salary from annual CTC. Includes PF, ESI, professional tax, and income tax under new and old regimes.", category: "business-tools", icon: "BadgeIndianRupee", tags: ["ctc", "salary", "in-hand", "take-home", "income tax", "india"], isNew: true, isTrending: true, relatedTools: ["salary-calculator", "salary-slip-generator"], howTo: [{ title: "Enter annual CTC", description: "Type your total annual package." }, { title: "Select regime", description: "Choose new or old income tax regime." }, { title: "Adjust basic %", description: "Set basic salary as a percentage of CTC." }, { title: "View in-hand", description: "See monthly in-hand and effective tax rate." }], faqs: [{ question: "Is this accurate?", answer: "This provides an estimate based on standard salary structure and simplified tax slabs. Consult your HR or a CA for precise figures." }] },
  // Profit Margin Calculator
  { slug: "profit-margin-calculator", name: "Profit Margin Calculator", tagline: "Calculate gross and net profit margins", description: "Calculate gross margin, net margin, and operating margin from revenue and costs. Essential for pricing and business analysis.", category: "business-tools", icon: "TrendingUp", tags: ["profit margin", "gross margin", "net profit", "business", "pricing"], isNew: true, relatedTools: ["roi-calculator", "discount-calculator"], howTo: [{ title: "Enter revenue", description: "Type total revenue or sales." }, { title: "Enter costs", description: "Add COGS and operating expenses." }, { title: "See margins", description: "View gross, operating, and net margins." }], faqs: [{ question: "What is a good profit margin?", answer: "It varies by industry. Gross margins of 50%+ are typical for SaaS; 20-40% for retail." }] },
  // Discount Calculator
  { slug: "discount-calculator", name: "Discount Calculator", tagline: "Calculate final price after discount", description: "Calculate the discounted price, savings amount, and percentage saved. Supports percentage-based and fixed-amount discounts.", category: "business-tools", icon: "Tag", tags: ["discount", "price", "sale", "savings", "calculator"], isPopular: true, relatedTools: ["profit-margin-calculator", "percentage-calculator"], howTo: [{ title: "Enter original price", description: "Type the original price." }, { title: "Enter discount", description: "Set discount as % or fixed amount." }, { title: "Calculate", description: "See final price and amount saved." }], faqs: [] },
  // ROI Calculator
  { slug: "roi-calculator", name: "ROI Calculator", tagline: "Calculate return on investment", description: "Calculate ROI, annualized return, net gain, and payback period for any investment. Perfect for business decisions and marketing analysis.", category: "business-tools", icon: "BarChart2", tags: ["roi", "return on investment", "calculator", "business", "marketing"], isNew: true, relatedTools: ["profit-margin-calculator", "cac-calculator"], howTo: [{ title: "Enter investment amount", description: "Type the initial investment." }, { title: "Enter returns", description: "Add total returns received." }, { title: "Set period", description: "Enter investment duration in months." }, { title: "See ROI", description: "View ROI, annualized return, and payback." }], faqs: [] },
  // Freelance Rate Calculator
  { slug: "freelance-rate-calculator", name: "Freelance Rate Calculator", tagline: "Calculate your ideal hourly & daily rate", description: "Calculate your minimum freelance hourly and daily rate based on income target, expenses, tax, and billable hours.", category: "business-tools", icon: "DollarSign", tags: ["freelance", "rate", "hourly rate", "pricing", "calculator"], isNew: true, relatedTools: ["roi-calculator", "profit-margin-calculator"], howTo: [{ title: "Set income target", description: "Enter your annual income goal." }, { title: "Add expenses", description: "Include business costs and taxes." }, { title: "Set hours", description: "Enter billable hours per week." }, { title: "Get your rate", description: "View minimum hourly and daily rates." }], faqs: [] },
  // Business Name Generator
  { slug: "business-name-generator", name: "Business Name Generator", tagline: "Generate creative business name ideas", description: "Generate unique business name ideas based on your industry, keywords, and style preference. Get 10-30 suggestions instantly.", category: "business-tools", icon: "Sparkles", tags: ["business name", "brand name", "startup name", "generator", "naming"], isNew: true, isTrending: true, relatedTools: ["invoice-generator", "quotation-generator"], howTo: [{ title: "Enter a keyword", description: "Optionally type a key term related to your business." }, { title: "Select industry", description: "Choose your business category." }, { title: "Pick a style", description: "Select modern, classic, playful, or professional." }, { title: "Generate names", description: "Get a list of name ideas to choose from." }], faqs: [] },
  // NDA Generator
  { slug: "nda-generator", name: "NDA Generator", tagline: "Create non-disclosure agreements instantly", description: "Generate one-way, mutual, or employee NDAs from a simple form. Fill in party details, term, jurisdiction, and purpose, then print or copy.", category: "business-tools", icon: "ShieldCheck", tags: ["nda", "non-disclosure", "legal", "contract", "agreement"], isNew: true, relatedTools: ["proposal-generator", "invoice-generator"], howTo: [{ title: "Choose NDA type", description: "Select unilateral, mutual, or employee NDA." }, { title: "Enter party details", description: "Add names and addresses of both parties." }, { title: "Set terms", description: "Enter effective date, duration, and jurisdiction." }, { title: "Print or copy", description: "Print the NDA or copy the full text." }], faqs: [{ question: "Is this legally binding?", answer: "This is a template for informational purposes only. Always have legal documents reviewed by a qualified attorney before signing." }] },
  // Salary Slip Generator
  { slug: "salary-slip-generator", name: "Salary Slip Generator", tagline: "Generate professional salary slips", description: "Create detailed salary slips with earnings (basic, HRA, allowances) and deductions (PF, PT, TDS) with net pay calculation. Print as PDF.", category: "business-tools", icon: "FileText", tags: ["salary slip", "payslip", "payroll", "hr", "india"], isNew: true, relatedTools: ["salary-calculator", "ctc-to-inhand-calculator"], howTo: [{ title: "Enter company details", description: "Add company name and address." }, { title: "Enter employee details", description: "Add name, ID, designation, bank info." }, { title: "Set earnings & deductions", description: "Enter salary components." }, { title: "Preview and print", description: "Generate the salary slip PDF." }], faqs: [] },
  // Proposal Generator
  { slug: "proposal-generator", name: "Proposal Generator", tagline: "Create professional business proposals", description: "Generate polished business proposals with itemized pricing, terms, validity date, and signature lines. Print or export as PDF.", category: "business-tools", icon: "ScrollText", tags: ["proposal", "business proposal", "client", "freelance", "agency"], isNew: true, relatedTools: ["quotation-generator", "nda-generator"], howTo: [{ title: "Enter details", description: "Add your company and client info." }, { title: "Add line items", description: "List deliverables with pricing." }, { title: "Add terms", description: "Include validity period and conditions." }, { title: "Print or save", description: "Export as PDF." }], faqs: [] },
  // Burn Rate Calculator
  { slug: "burn-rate-calculator", name: "Burn Rate Calculator", tagline: "Calculate startup cash runway", description: "Calculate your gross and net burn rate and remaining cash runway. Know exactly when you need to raise or break even.", category: "business-tools", icon: "Flame", tags: ["burn rate", "runway", "startup", "cash flow", "calculator"], isNew: true, relatedTools: ["saas-mrr-calculator", "roi-calculator"], howTo: [{ title: "Enter cash balance", description: "Type current cash reserves." }, { title: "Enter monthly burn", description: "Add total monthly expenses." }, { title: "Add revenue", description: "Enter monthly revenue if any." }, { title: "See runway", description: "View net burn rate and months of runway." }], faqs: [{ question: "What is a healthy runway?", answer: "Most startups aim for 12-18 months of runway before the next fundraise." }] },
  // SaaS MRR Calculator
  { slug: "saas-mrr-calculator", name: "SaaS MRR Calculator", tagline: "Calculate monthly and annual recurring revenue", description: "Calculate MRR, ARR, churn impact, and net new MRR for your SaaS business. Track growth and revenue trends.", category: "business-tools", icon: "TrendingUp", tags: ["mrr", "arr", "saas", "recurring revenue", "churn", "calculator"], isNew: true, relatedTools: ["burn-rate-calculator", "ltv-calculator", "cac-calculator"], howTo: [{ title: "Enter customer count", description: "Type active paying customers." }, { title: "Enter ARPU", description: "Add average revenue per user per month." }, { title: "Set churn rate", description: "Enter monthly churn percentage." }, { title: "See MRR/ARR", description: "View all revenue metrics." }], faqs: [] },
  // CAC Calculator
  { slug: "cac-calculator", name: "CAC Calculator", tagline: "Calculate customer acquisition cost", description: "Calculate your Customer Acquisition Cost (CAC), LTV:CAC ratio, and payback period to assess marketing efficiency.", category: "business-tools", icon: "Users", tags: ["cac", "customer acquisition", "marketing", "ltv", "saas", "calculator"], isNew: true, relatedTools: ["ltv-calculator", "saas-mrr-calculator", "roi-calculator"], howTo: [{ title: "Enter spend", description: "Add total marketing and sales spend." }, { title: "Enter new customers", description: "Type new customers acquired." }, { title: "Add LTV", description: "Enter average lifetime value for ratio." }, { title: "See CAC", description: "View CAC, ratio, and payback period." }], faqs: [] },
  // LTV Calculator
  { slug: "ltv-calculator", name: "LTV Calculator", tagline: "Calculate customer lifetime value", description: "Calculate Customer Lifetime Value (LTV), LTV:CAC ratio, and average customer lifetime. Essential for SaaS and subscription businesses.", category: "business-tools", icon: "Users", tags: ["ltv", "lifetime value", "saas", "churn", "calculator"], isNew: true, relatedTools: ["cac-calculator", "saas-mrr-calculator"], howTo: [{ title: "Enter ARPU", description: "Add average revenue per user per month." }, { title: "Enter churn rate", description: "Type monthly churn percentage." }, { title: "Set gross margin", description: "Enter your gross margin %." }, { title: "See LTV", description: "View LTV, ratio, and payback period." }], faqs: [] },
  // UTM Builder
  { slug: "utm-builder", name: "UTM Builder", tagline: "Build UTM tracking URLs for campaigns", description: "Build UTM-tagged URLs for marketing campaigns. Supports all UTM parameters with presets for Google Ads, Facebook, email, and more.", category: "business-tools", icon: "Link2", tags: ["utm", "tracking", "url", "marketing", "analytics", "campaign"], isNew: true, isTrending: true, isPopular: true, relatedTools: ["url-parser", "url-encoder"], howTo: [{ title: "Enter base URL", description: "Type the landing page URL." }, { title: "Fill UTM fields", description: "Add source, medium, campaign, and other params." }, { title: "Copy URL", description: "Copy the tagged URL to use in your campaigns." }], faqs: [{ question: "What are UTM parameters?", answer: "UTM parameters are tags added to URLs to track the source, medium, and campaign name of traffic in analytics tools like Google Analytics." }] },
  // Conversion Rate Calculator
  { slug: "conversion-rate-calculator", name: "Conversion Rate Calculator", tagline: "Calculate website or campaign conversion rates", description: "Calculate conversion rate, revenue per visitor, and revenue per conversion from visitors and conversions data.", category: "business-tools", icon: "BarChart", tags: ["conversion rate", "cvr", "marketing", "analytics", "calculator"], isNew: true, relatedTools: ["cac-calculator", "roi-calculator"], howTo: [{ title: "Enter visitors", description: "Type total visitors or sessions." }, { title: "Enter conversions", description: "Add total conversions or goals completed." }, { title: "Add revenue (optional)", description: "Include revenue for RPV calculation." }, { title: "See results", description: "View CVR, RPV, and revenue metrics." }], faqs: [] },

  // ===========================
  // AUDIO TOOLS
  // ===========================
  { slug: "mp3-cutter", name: "MP3 Cutter", tagline: "Trim and cut audio files online", description: "Cut any audio file to the exact segment you need. Set a start and end time, preview the selection, and download the trimmed clip as a WAV file — all in your browser.", category: "audio-tools", icon: "Scissors", tags: ["mp3 cutter", "audio trimmer", "cut mp3", "trim audio", "audio editor"], isNew: true, isFeatured: true, isPopular: true, relatedTools: ["audio-joiner", "audio-volume-booster"], howTo: [{ title: "Upload file", description: "Drag or select your MP3, WAV, M4A, or OGG file." }, { title: "Set start & end", description: "Drag the sliders or type exact times to mark your clip." }, { title: "Preview", description: "Click Preview to hear the selection before downloading." }, { title: "Download", description: "Click Cut & Download to save the trimmed WAV." }], faqs: [{ question: "What audio formats are supported?", answer: "MP3, WAV, M4A, AAC, OGG, and any format your browser can decode." }, { question: "Why is the output WAV instead of MP3?", answer: "WAV encoding happens in the browser without a library. WAV is lossless and universally supported." }] },
  { slug: "audio-joiner", name: "Audio Joiner", tagline: "Merge multiple audio files into one", description: "Combine two or more audio tracks into a single file. Upload your files, drag to reorder them, and download the merged result.", category: "audio-tools", icon: "ListMusic", tags: ["audio joiner", "merge audio", "combine mp3", "audio merger", "join audio"], isNew: true, isFeatured: true, relatedTools: ["mp3-cutter", "audio-compressor"], howTo: [{ title: "Add files", description: "Click or drag to add MP3, WAV, M4A, or OGG files." }, { title: "Reorder", description: "Use the arrows to set the join order." }, { title: "Merge", description: "Click Join & Download to download the combined WAV." }], faqs: [{ question: "How many files can I join?", answer: "There's no hard limit — it depends on your browser's available memory." }] },
  { slug: "audio-compressor", name: "Audio Compressor", tagline: "Apply dynamic range compression to audio", description: "Even out loud and quiet passages in your audio using a dynamic range compressor. Adjust threshold and ratio, then download the processed file.", category: "audio-tools", icon: "AudioLines", tags: ["audio compressor", "dynamic compression", "audio leveler", "loudness", "audio normalizer"], isNew: true, relatedTools: ["audio-volume-booster", "audio-speed-changer"], howTo: [{ title: "Upload audio", description: "Add any audio file (MP3, WAV, M4A, OGG)." }, { title: "Set threshold", description: "Lower threshold = more compression." }, { title: "Set ratio", description: "Higher ratio = stronger effect." }, { title: "Download", description: "Click Process & Download to get the processed WAV." }], faqs: [{ question: "What does the makeup gain do?", answer: "After compression reduces the peaks, makeup gain (1.5×) boosts the overall volume back up." }] },
  { slug: "m4a-to-mp3", name: "M4A to MP3", tagline: "Convert M4A and AAC audio to WAV", description: "Convert M4A (AAC) audio files to high-quality WAV format directly in your browser. No upload required.", category: "audio-tools", icon: "FileAudio", tags: ["m4a to mp3", "aac to mp3", "m4a converter", "audio converter", "convert m4a"], isNew: true, relatedTools: ["mp3-to-wav", "wav-to-mp3"], howTo: [{ title: "Upload M4A", description: "Drag or select your .m4a or .aac file." }, { title: "Convert", description: "Click Convert & Download — output is a WAV file." }], faqs: [{ question: "Why WAV output instead of MP3?", answer: "MP3 encoding requires a separate library. WAV is lossless and plays everywhere." }] },
  { slug: "wav-to-mp3", name: "WAV to MP3", tagline: "Re-export WAV audio as WAV (44.1kHz)", description: "Re-encode a WAV file at 44.1 kHz stereo for compatibility. Useful for standardising sample rates across projects.", category: "audio-tools", icon: "FileAudio2", tags: ["wav to mp3", "wav converter", "audio converter", "convert wav"], isNew: true, relatedTools: ["mp3-to-wav", "m4a-to-mp3"], howTo: [{ title: "Upload WAV", description: "Select or drop your .wav file." }, { title: "Convert", description: "Click Convert & Download." }], faqs: [] },
  { slug: "mp3-to-wav", name: "MP3 to WAV", tagline: "Convert MP3 to uncompressed WAV", description: "Decode an MP3 file and export it as an uncompressed 16-bit PCM WAV — ideal for audio editing software.", category: "audio-tools", icon: "FileAudio", tags: ["mp3 to wav", "convert mp3", "wav converter", "audio converter"], isNew: true, relatedTools: ["wav-to-mp3", "m4a-to-mp3"], howTo: [{ title: "Upload MP3", description: "Select or drop your .mp3 file." }, { title: "Convert", description: "Click Convert & Download — instant WAV output." }], faqs: [{ question: "Does converting MP3 to WAV improve quality?", answer: "No — WAV is lossless but the audio data is still the same as the source MP3." }] },
  { slug: "mp4-to-mp3", name: "MP4 to MP3", tagline: "Extract audio from MP4 video files", description: "Strip the audio track from any MP4 video and download it as a WAV file. Works entirely in your browser — no server upload needed.", category: "audio-tools", icon: "FileAudio2", tags: ["mp4 to mp3", "extract audio", "video to audio", "mp4 audio", "convert mp4"], isNew: true, isFeatured: true, isPopular: true, relatedTools: ["video-to-audio", "mp3-to-wav"], howTo: [{ title: "Upload MP4", description: "Drag or select your .mp4 video file." }, { title: "Extract", description: "Click Convert & Download — the audio track is saved as WAV." }], faqs: [{ question: "What video formats are supported?", answer: "Any format your browser supports: MP4, WebM, and sometimes MOV." }] },
  { slug: "video-to-audio", name: "Video to Audio Converter", tagline: "Extract audio from any video file", description: "Extract the audio track from video files (MP4, WebM, MOV) and save it as a WAV file. All processing runs locally in your browser.", category: "audio-tools", icon: "Music", tags: ["video to audio", "extract audio from video", "video converter", "audio extractor"], isNew: true, relatedTools: ["mp4-to-mp3", "mp3-cutter"], howTo: [{ title: "Upload video", description: "Select an MP4, WebM, or MOV file." }, { title: "Convert", description: "Click Convert & Download to save the audio as WAV." }], faqs: [] },
  { slug: "audio-volume-booster", name: "Audio Volume Booster", tagline: "Amplify quiet audio up to 5×", description: "Boost the volume of any audio file by up to 5× using sample-level gain amplification. Clipping is automatically prevented.", category: "audio-tools", icon: "Volume2", tags: ["volume booster", "audio amplifier", "increase volume", "boost audio", "audio gain"], isNew: true, isFeatured: true, relatedTools: ["audio-compressor", "audio-speed-changer"], howTo: [{ title: "Upload audio", description: "Add your quiet MP3, WAV, or M4A file." }, { title: "Set gain", description: "Drag the slider to choose how much to amplify (1× – 5×)." }, { title: "Download", description: "Click Process & Download to get the boosted WAV." }], faqs: [{ question: "Why does my audio still sound quiet at 5×?", answer: "If the source file is very quiet, even 5× may not be enough. Try applying the boost twice." }] },
  { slug: "audio-speed-changer", name: "Audio Speed Changer", tagline: "Speed up or slow down audio files", description: "Change the playback speed of any audio file from 0.25× to 4× using the Web Audio API. Pitch is preserved automatically.", category: "audio-tools", icon: "Gauge", tags: ["audio speed", "speed changer", "slow audio", "speed up mp3", "audio pitch"], isNew: true, relatedTools: ["audio-volume-booster", "mp3-cutter"], howTo: [{ title: "Upload audio", description: "Add your MP3, WAV, or M4A file." }, { title: "Set speed", description: "Drag the slider (0.25× = quarter speed, 2× = double speed)." }, { title: "Download", description: "Click Process & Download." }], faqs: [{ question: "Does speed change affect pitch?", answer: "The browser's OfflineAudioContext handles resampling, so pitch is preserved at moderate speed changes." }] },
  { slug: "audio-to-text", name: "Audio to Text", tagline: "Transcribe speech with your microphone", description: "Convert your spoken words to text in real time using your browser's built-in speech recognition. Supports 13+ languages and requires no signup.", category: "audio-tools", icon: "Mic", tags: ["audio to text", "speech to text", "voice recognition", "transcribe", "speech recognition"], isNew: true, isFeatured: true, relatedTools: ["text-to-speech"], howTo: [{ title: "Choose language", description: "Select your language from the dropdown." }, { title: "Start recording", description: "Click Start Recording and allow microphone access." }, { title: "Speak", description: "Speak clearly — the transcript appears in real time." }, { title: "Copy", description: "Click Copy Text to copy the transcript to your clipboard." }], faqs: [{ question: "Does it work with audio files?", answer: "This tool uses live microphone input. Play your audio file through speakers and use the mic to capture it, or use a virtual audio cable." }, { question: "Is my speech sent to a server?", answer: "In Chrome the audio is processed by Google's servers (part of the Web Speech API). Firefox processes it locally." }] },
  { slug: "text-to-speech", name: "Text to Speech", tagline: "Convert text to audio with natural voices", description: "Type or paste any text and listen to it read aloud using your browser's built-in speech synthesis. Choose from dozens of OS voices, adjust speed and pitch.", category: "audio-tools", icon: "MessageSquare", tags: ["text to speech", "tts", "read aloud", "speech synthesis", "voice reader"], isNew: true, isFeatured: true, isPopular: true, relatedTools: ["audio-to-text"], howTo: [{ title: "Enter text", description: "Type or paste the text you want to hear." }, { title: "Pick a voice", description: "Choose from the voices installed on your OS." }, { title: "Adjust speed & pitch", description: "Use the sliders to fine-tune the voice." }, { title: "Speak", description: "Click Speak to start playback." }], faqs: [{ question: "Can I download the audio?", answer: "Browser TTS doesn't expose a direct download API. Use a screen recorder or OS-level capture to save it." }, { question: "Why don't I see many voices?", answer: "Available voices depend on your OS language packs. Install additional language packs in system settings to unlock more voices." }] },

  // ===========================
  // AI TOOLS
  // ===========================
  // New AI tools suite
  { slug: "ai-pdf-chat", name: "AI PDF Chat", tagline: "Chat with any PDF document", description: "Upload any PDF and ask questions about its content. The tool extracts text and finds the most relevant passages to answer your questions — entirely in your browser.", category: "ai-tools", icon: "MessageSquare", tags: ["ai", "pdf", "chat", "document", "qa", "pdf reader"], isNew: true, isFeatured: true, isPopular: true, relatedTools: ["ai-resume-analyzer", "text-summarizer"], howTo: [{ title: "Upload PDF", description: "Drag or click to upload your PDF file." }, { title: "Ask a question", description: "Type any question about the document's content." }, { title: "Get answers", description: "The tool finds the most relevant passages and answers your question." }], faqs: [{ question: "Does it work with scanned PDFs?", answer: "No — scanned PDFs are images and contain no extractable text. Use a text-based PDF." }, { question: "Is my PDF uploaded to a server?", answer: "No — everything is processed locally in your browser using PDF.js." }] },
  { slug: "ai-resume-analyzer", name: "AI Resume Analyzer", tagline: "Score and improve your resume instantly", description: "Paste your resume text and get an ATS compatibility score, section-by-section analysis, action verb check, and specific improvement recommendations.", category: "ai-tools", icon: "FileText", tags: ["ai", "resume", "cv", "ats", "job application", "career"], isNew: true, isFeatured: true, isPopular: true, relatedTools: ["ai-pdf-chat", "ai-proposal-generator"], howTo: [{ title: "Paste resume", description: "Copy and paste your resume text into the input box." }, { title: "Analyze", description: "Click Analyze Resume to get your score and feedback." }, { title: "Improve", description: "Follow the specific recommendations to raise your score." }], faqs: [{ question: "How is the score calculated?", answer: "The analyzer checks for key sections, action verbs, quantified achievements, and content length against ATS best practices." }] },
  { slug: "ai-seo-audit", name: "AI SEO Audit", tagline: "Instant on-page SEO audit and recommendations", description: "Paste your page HTML or content to get a comprehensive SEO audit covering title tags, meta description, headings, content length, links, and structured data.", category: "ai-tools", icon: "Search", tags: ["ai", "seo", "audit", "on-page seo", "seo analysis", "website"], isNew: true, isFeatured: true, relatedTools: ["ai-keyword-cluster", "meta-tag-generator"], howTo: [{ title: "Paste content", description: "Copy your page HTML or raw text content." }, { title: "Run audit", description: "Click Run SEO Audit to get your score." }, { title: "Fix issues", description: "Address each flagged issue to improve rankings." }], faqs: [] },
  { slug: "ai-keyword-cluster", name: "AI Keyword Cluster Generator", tagline: "Group keywords by search intent", description: "Enter your keyword list and automatically cluster them by search intent — informational, commercial, transactional, and navigational — with content strategy recommendations.", category: "ai-tools", icon: "Tags", tags: ["ai", "keywords", "seo", "keyword research", "content strategy", "search intent"], isNew: true, isFeatured: true, relatedTools: ["ai-seo-audit", "keyword-density-checker"], howTo: [{ title: "Enter keywords", description: "Paste your keywords, one per line or comma-separated." }, { title: "Cluster", description: "Click Cluster Keywords to group by intent." }, { title: "Plan content", description: "Use the clusters to build your content strategy." }], faqs: [] },
  { slug: "ai-proposal-generator", name: "AI Proposal Generator", tagline: "Generate professional project proposals", description: "Fill in project details and generate a complete, client-ready project proposal with executive summary, scope, timeline, pricing table, and terms.", category: "ai-tools", icon: "FileOutput", tags: ["ai", "proposal", "project proposal", "business", "freelance", "client"], isNew: true, isFeatured: true, relatedTools: ["ai-business-plan", "nda-generator"], howTo: [{ title: "Enter details", description: "Fill in client name, project description, scope, budget, and timeline." }, { title: "Generate", description: "Click Generate Proposal for a complete document." }, { title: "Customize", description: "Edit the output to fit your exact project requirements." }], faqs: [] },
  { slug: "ai-sql-generator", name: "AI SQL Generator", tagline: "Convert plain English to SQL queries", description: "Describe what data you need in plain English and get a production-ready SQL query with explanations, variations, and index suggestions.", category: "ai-tools", icon: "Database", tags: ["ai", "sql", "database", "query", "sql generator", "developer"], isNew: true, isFeatured: true, relatedTools: ["ai-code-explainer", "json-formatter"], howTo: [{ title: "Describe your query", description: "Type what you want in plain English, e.g. 'Show top 10 customers by orders'." }, { title: "Generate SQL", description: "Click Generate SQL to get the query." }, { title: "Customize", description: "Replace table names and column names with your actual schema." }], faqs: [{ question: "Which SQL dialects are supported?", answer: "The generated SQL is standard SQL with PostgreSQL syntax. Minor adjustments may be needed for MySQL or SQLite." }] },
  { slug: "ai-code-explainer", name: "AI Code Explainer", tagline: "Get plain-English explanations of any code", description: "Paste any code snippet and get a line-by-line breakdown, concept identification, complexity analysis, and potential issue detection.", category: "ai-tools", icon: "Code", tags: ["ai", "code", "code explainer", "developer", "programming", "debugging"], isNew: true, isFeatured: true, relatedTools: ["ai-sql-generator", "json-formatter"], howTo: [{ title: "Select language", description: "Choose your programming language or leave on auto-detect." }, { title: "Paste code", description: "Paste the code snippet you want explained." }, { title: "Explain", description: "Click Explain Code for a full breakdown." }], faqs: [] },
  { slug: "ai-business-plan", name: "AI Business Plan Generator", tagline: "Generate a complete business plan in seconds", description: "Enter your business details and get an investor-ready business plan with market analysis, financial projections, go-to-market strategy, team section, and risk analysis.", category: "ai-tools", icon: "Briefcase", tags: ["ai", "business plan", "startup", "entrepreneur", "investor", "business"], isNew: true, isFeatured: true, relatedTools: ["ai-proposal-generator", "business-name-generator"], howTo: [{ title: "Enter details", description: "Fill in business name, industry, description, market, and revenue model." }, { title: "Generate", description: "Click Generate Business Plan." }, { title: "Customize", description: "Replace placeholder numbers with real market research data." }], faqs: [] },
  { slug: "ai-product-description", name: "AI Product Description Generator", tagline: "Generate multi-tone product descriptions", description: "Enter product details and generate three ready-to-use product descriptions optimized for ads, e-commerce listings, and long-form product pages in your chosen tone.", category: "ai-tools", icon: "ShoppingBag", tags: ["ai", "product description", "ecommerce", "copywriting", "marketing", "amazon"], isNew: true, relatedTools: ["ai-proposal-generator", "headline-generator"], howTo: [{ title: "Enter product details", description: "Add product name, key features, target audience, and desired tone." }, { title: "Generate", description: "Click Generate Descriptions for three versions." }, { title: "Pick and edit", description: "Choose the best version and customize it for your store." }], faqs: [] },
  { slug: "ai-meeting-notes", name: "AI Meeting Notes Generator", tagline: "Turn raw notes into structured minutes", description: "Paste your messy meeting notes or bullet points and get clean, structured meeting minutes with decisions, action items, and a follow-up section.", category: "ai-tools", icon: "ClipboardList", tags: ["ai", "meeting notes", "minutes", "productivity", "action items", "team"], isNew: true, isFeatured: true, relatedTools: ["ai-proposal-generator", "text-summarizer"], howTo: [{ title: "Paste notes", description: "Copy your raw meeting notes or bullet points." }, { title: "Generate", description: "Click Generate Meeting Notes." }, { title: "Share", description: "Copy the structured notes and share with your team." }], faqs: [] },
  {
    slug: "text-summarizer",
    name: "Text Summarizer",
    tagline: "Summarize long text with AI",
    description: "Summarize articles, papers, and long documents instantly. Choose summary length and style for different use cases.",
    category: "ai-tools",
    icon: "Sparkles",
    tags: ["ai", "summarize", "text", "nlp"],
    isNew: true,
    isTrending: true,
    relatedTools: ["word-counter", "keyword-density-checker"],
    howTo: [
      { title: "Paste text", description: "Enter the content to summarize." },
      { title: "Set length", description: "Choose short, medium, or detailed summary." },
      { title: "Summarize", description: "Generate an AI-powered summary." },
      { title: "Copy", description: "Copy the summary to clipboard." },
    ],
    faqs: [],
  },
  {
    slug: "grammar-checker",
    name: "Grammar Checker",
    tagline: "Fix grammar and spelling instantly",
    description: "Check and fix grammar, spelling, punctuation, and style issues in your writing with real-time suggestions.",
    category: "ai-tools",
    icon: "SpellCheck",
    tags: ["grammar", "spelling", "ai", "writing", "proofreading"],
    isNew: true,
    relatedTools: ["word-counter", "text-summarizer"],
    howTo: [
      { title: "Paste text", description: "Enter the text to check." },
      { title: "Analyze", description: "AI scans for grammar and spelling errors." },
      { title: "Review suggestions", description: "See all errors with correction suggestions." },
      { title: "Apply fixes", description: "Accept or reject each suggestion." },
    ],
    faqs: [],
  },
  // ===========================
  // ADVANCED PDF TOOLS
  // ===========================
  { slug: "pdf-page-number-adder", name: "PDF Page Number Adder", tagline: "Add page numbers to any PDF", description: "Add customizable page numbers to your PDF files. Choose position, font, and numbering format.", category: "pdf-tools", icon: "Hash", tags: ["pdf", "page numbers", "edit"], relatedTools: ["pdf-metadata-editor", "pdf-merger"], howTo: [{ title: "Upload PDF", description: "Select your PDF file." }, { title: "Configure numbers", description: "Set position, size, and format." }, { title: "Apply", description: "Download your numbered PDF." }], faqs: [] },
  { slug: "pdf-metadata-editor", name: "PDF Metadata Editor", tagline: "Edit PDF title, author, and properties", description: "View and edit PDF metadata including title, author, subject, keywords, and creation date.", category: "pdf-tools", icon: "FileEdit", tags: ["pdf", "metadata", "edit"], relatedTools: ["pdf-compressor", "pdf-page-number-adder"], howTo: [{ title: "Upload PDF", description: "Select your PDF." }, { title: "Edit fields", description: "Change title, author, subject, keywords." }, { title: "Save", description: "Download the updated PDF." }], faqs: [] },
  { slug: "pdf-password-remover", name: "PDF Password Remover", tagline: "Remove password protection from PDFs", description: "Remove password protection from PDFs you own. Enter the current password to unlock and save an unprotected copy.", category: "pdf-tools", icon: "Unlock", tags: ["pdf", "password", "unlock", "security"], relatedTools: ["pdf-compressor", "pdf-merger"], howTo: [{ title: "Upload PDF", description: "Select your password-protected PDF." }, { title: "Enter password", description: "Provide the current PDF password." }, { title: "Remove protection", description: "Download the unlocked PDF." }], faqs: [{ question: "Can I remove any PDF password?", answer: "Only if you know the password. This tool unlocks PDFs you own." }] },
  { slug: "pdf-page-reorder", name: "PDF Page Reorder Tool", tagline: "Drag and drop to reorder PDF pages", description: "Reorder, delete, and rearrange pages in a PDF document. Visual drag-and-drop interface.", category: "pdf-tools", icon: "Layers", tags: ["pdf", "pages", "reorder", "edit"], relatedTools: ["pdf-splitter", "pdf-merger"], howTo: [{ title: "Upload PDF", description: "Select your PDF file." }, { title: "Reorder pages", description: "Drag thumbnails to rearrange order." }, { title: "Save", description: "Download the reordered PDF." }], faqs: [] },
  { slug: "pdf-size-analyzer", name: "PDF Size Analyzer", tagline: "Analyze what's taking space in your PDF", description: "Break down a PDF's file size by images, fonts, content streams, and metadata. Understand where the bytes go.", category: "pdf-tools", icon: "PieChart", tags: ["pdf", "size", "analyze", "optimize"], relatedTools: ["pdf-compressor", "pdf-metadata-editor"], howTo: [{ title: "Upload PDF", description: "Select your PDF file." }, { title: "Analyze", description: "View breakdown of file components." }, { title: "Optimize", description: "Use insights to reduce file size." }], faqs: [] },
  { slug: "pdf-to-text", name: "PDF to Text", tagline: "Extract text content from PDF files", description: "Extract all readable text from PDF documents. Supports multi-page PDFs.", category: "pdf-tools", icon: "FileType", tags: ["pdf", "text", "extract", "ocr"], relatedTools: ["pdf-to-jpg", "word-counter"], howTo: [{ title: "Upload PDF", description: "Select your PDF file." }, { title: "Extract text", description: "Click extract to pull all text content." }, { title: "Copy or download", description: "Use the extracted text." }], faqs: [{ question: "Does it work on scanned PDFs?", answer: "This extracts embedded text. Scanned image-based PDFs may return limited results." }] },

  // ===========================
  // ADVANCED IMAGE TOOLS
  // ===========================
  { slug: "avif-to-jpg", name: "AVIF to JPG", tagline: "Convert AVIF images to JPG format", description: "Convert AVIF images to JPEG format for compatibility with older software and services.", category: "image-tools", icon: "RefreshCw", tags: ["avif", "jpg", "convert", "image"], relatedTools: ["jpg-to-png", "image-compressor"], howTo: [{ title: "Upload AVIF", description: "Select your AVIF file." }, { title: "Convert", description: "Convert to JPG format." }, { title: "Download", description: "Save your JPG file." }], faqs: [] },
  { slug: "jpg-to-avif", name: "JPG to AVIF", tagline: "Convert JPG to modern AVIF format", description: "Convert JPEG images to AVIF format for better compression and modern browser support.", category: "image-tools", icon: "Zap", tags: ["jpg", "avif", "convert", "image"], isNew: true, relatedTools: ["png-to-webp", "image-compressor"], howTo: [{ title: "Upload JPG", description: "Select your JPEG file." }, { title: "Convert", description: "Convert to AVIF format." }, { title: "Download", description: "Save your AVIF file." }], faqs: [] },
  { slug: "avif-to-png", name: "AVIF to PNG", tagline: "Convert AVIF to PNG with transparency", description: "Convert AVIF images to PNG format preserving transparency and full color depth.", category: "image-tools", icon: "RefreshCw", tags: ["avif", "png", "convert", "image"], relatedTools: ["jpg-to-png", "image-compressor"], howTo: [{ title: "Upload AVIF", description: "Select your AVIF file." }, { title: "Convert", description: "Convert to PNG format." }, { title: "Download", description: "Save your PNG file." }], faqs: [] },
  { slug: "svg-optimizer", name: "SVG Optimizer", tagline: "Optimize and minify SVG files", description: "Reduce SVG file size by removing comments, whitespace, and unused elements. Keeps vector quality.", category: "image-tools", icon: "Minimize2", tags: ["svg", "optimize", "minify", "compress"], relatedTools: ["svg-to-png", "image-compressor"], howTo: [{ title: "Upload or paste SVG", description: "Select your SVG file or paste code." }, { title: "Optimize", description: "Apply optimization passes." }, { title: "Download", description: "Save the optimized SVG." }], faqs: [] },
  { slug: "image-dpi-converter", name: "Image DPI Converter", tagline: "Change image DPI for print and web", description: "Set the DPI (dots per inch) of an image for print or screen output. Supports JPG, PNG, WebP.", category: "image-tools", icon: "Printer", tags: ["dpi", "ppi", "image", "print"], relatedTools: ["image-resizer", "image-compressor"], howTo: [{ title: "Upload image", description: "Select your image." }, { title: "Set DPI", description: "Enter the target DPI value." }, { title: "Download", description: "Save image with new DPI setting." }], faqs: [{ question: "What DPI should I use for printing?", answer: "300 DPI for high-quality print, 72-96 DPI for web/screen use." }] },
  { slug: "exif-remover", name: "EXIF Data Remover", tagline: "Strip metadata from photos for privacy", description: "Remove EXIF metadata from JPEG and PNG images including GPS location, camera model, and timestamps.", category: "image-tools", icon: "ShieldOff", tags: ["exif", "metadata", "privacy", "remove"], relatedTools: ["exif-viewer", "image-compressor"], howTo: [{ title: "Upload image", description: "Select your photo." }, { title: "Remove EXIF", description: "Strip all metadata." }, { title: "Download", description: "Save the clean image." }], faqs: [{ question: "Why remove EXIF data?", answer: "EXIF data can contain GPS coordinates, camera info, and timestamps that could compromise your privacy." }] },
  { slug: "exif-viewer", name: "EXIF Viewer", tagline: "View hidden photo metadata and GPS data", description: "Read EXIF metadata from photos: GPS location, camera make/model, exposure, ISO, aperture, and more.", category: "image-tools", icon: "Info", tags: ["exif", "metadata", "gps", "camera"], relatedTools: ["exif-remover", "image-compressor"], howTo: [{ title: "Upload photo", description: "Select a JPEG or raw image." }, { title: "View metadata", description: "See all EXIF fields." }, { title: "Export", description: "Copy or export the metadata." }], faqs: [] },
  { slug: "favicon-generator", name: "Favicon Generator", tagline: "Create favicons from any image", description: "Generate favicon.ico and PNG icons in all standard sizes (16×16, 32×32, 48×48, 192×192, 512×512) from any image.", category: "image-tools", icon: "Star", tags: ["favicon", "icon", "website", "browser"], isNew: true, relatedTools: ["image-resizer", "svg-to-png"], howTo: [{ title: "Upload image", description: "Select a square image (logo or icon)." }, { title: "Generate", description: "Create all favicon sizes." }, { title: "Download", description: "Download favicon.ico and PNG files." }], faqs: [{ question: "What image should I use for a favicon?", answer: "Use a square image with simple, bold design that looks good at small sizes (16×16px)." }] },
  { slug: "social-image-resizer", name: "Social Media Image Resizer", tagline: "Resize images for every social platform", description: "Resize and crop images to exact dimensions for Facebook, Instagram, Twitter/X, LinkedIn, YouTube, and more.", category: "image-tools", icon: "Share2", tags: ["social media", "resize", "image", "facebook", "instagram"], isPopular: true, relatedTools: ["image-resizer", "image-compressor"], howTo: [{ title: "Upload image", description: "Select your image." }, { title: "Choose platform", description: "Pick the social network and post type." }, { title: "Resize", description: "Auto-resize to perfect dimensions." }, { title: "Download", description: "Save the optimized image." }], faqs: [] },
  { slug: "instagram-image-resizer", name: "Instagram Image Resizer", tagline: "Resize images to perfect Instagram dimensions", description: "Resize photos for Instagram posts (1:1, 4:5, 1.91:1), stories (9:16), and Reels.", category: "image-tools", icon: "Instagram", tags: ["instagram", "resize", "image", "social"], relatedTools: ["social-image-resizer", "image-cropper"], howTo: [{ title: "Upload image", description: "Select your photo." }, { title: "Choose format", description: "Pick post, story, or reel dimensions." }, { title: "Download", description: "Save the resized image." }], faqs: [] },
  { slug: "youtube-thumbnail-resizer", name: "YouTube Thumbnail Resizer", tagline: "Create perfect YouTube thumbnails", description: "Resize images to the ideal YouTube thumbnail size (1280×720) with the correct 16:9 aspect ratio.", category: "image-tools", icon: "Youtube", tags: ["youtube", "thumbnail", "resize", "image"], relatedTools: ["social-image-resizer", "image-resizer"], howTo: [{ title: "Upload image", description: "Select your thumbnail image." }, { title: "Resize", description: "Fit to 1280×720 (16:9)." }, { title: "Download", description: "Save your thumbnail." }], faqs: [] },
  { slug: "facebook-cover-resizer", name: "Facebook Cover Resizer", tagline: "Resize images for Facebook covers", description: "Resize images to perfect Facebook cover photo dimensions (820×312 for pages, 851×315 for profiles).", category: "image-tools", icon: "Facebook", tags: ["facebook", "cover", "resize", "image"], relatedTools: ["social-image-resizer", "image-resizer"], howTo: [{ title: "Upload image", description: "Select your cover image." }, { title: "Resize", description: "Apply Facebook cover dimensions." }, { title: "Download", description: "Save your cover photo." }], faqs: [] },
  { slug: "twitter-image-resizer", name: "Twitter/X Image Resizer", tagline: "Resize images for Twitter/X posts", description: "Resize images for Twitter/X headers (1500×500), profile photos (400×400), and tweet images.", category: "image-tools", icon: "Twitter", tags: ["twitter", "x", "resize", "image", "social"], relatedTools: ["social-image-resizer", "image-resizer"], howTo: [{ title: "Upload image", description: "Select your image." }, { title: "Choose type", description: "Pick header, profile, or tweet image." }, { title: "Download", description: "Save the resized image." }], faqs: [] },
  { slug: "bulk-image-converter", name: "Bulk Image Converter", tagline: "Convert multiple images at once", description: "Batch convert images between JPG, PNG, WebP, and AVIF formats. Process dozens of images in one click.", category: "image-tools", icon: "Images", tags: ["bulk", "convert", "image", "batch"], relatedTools: ["image-compressor", "jpg-to-png"], howTo: [{ title: "Upload images", description: "Select multiple image files." }, { title: "Choose format", description: "Pick the output format." }, { title: "Convert all", description: "Process all files at once." }, { title: "Download", description: "Download individually or as ZIP." }], faqs: [] },

  // ===========================
  // ADVANCED TEXT TOOLS
  // ===========================
  { slug: "text-to-ascii", name: "Text to ASCII", tagline: "Convert text to ASCII codes", description: "Convert any text to ASCII character codes, decimal, hex, or binary representations.", category: "text-tools", icon: "Binary", tags: ["text", "ascii", "encode", "character codes"], relatedTools: ["ascii-to-text", "base64-encoder"], howTo: [{ title: "Enter text", description: "Type or paste your text." }, { title: "Choose format", description: "Select decimal, hex, or binary." }, { title: "Convert", description: "Get ASCII codes." }], faqs: [] },
  { slug: "ascii-to-text", name: "ASCII to Text", tagline: "Convert ASCII codes back to text", description: "Convert ASCII decimal, hex, or binary codes back to readable text characters.", category: "text-tools", icon: "TextCursor", tags: ["ascii", "text", "decode", "character codes"], relatedTools: ["text-to-ascii", "base64-encoder"], howTo: [{ title: "Enter codes", description: "Paste your ASCII codes." }, { title: "Choose format", description: "Select input format (decimal/hex/binary)." }, { title: "Convert", description: "Get readable text." }], faqs: [] },
  { slug: "remove-line-breaks", name: "Remove Line Breaks", tagline: "Remove or replace line breaks in text", description: "Remove all line breaks from text or replace them with spaces, commas, or custom separators.", category: "text-tools", icon: "AlignJustify", tags: ["line breaks", "text", "format", "clean"], relatedTools: ["text-cleaner", "word-counter"], howTo: [{ title: "Paste text", description: "Enter your text with line breaks." }, { title: "Choose action", description: "Remove or replace line breaks." }, { title: "Copy result", description: "Copy the cleaned text." }], faqs: [] },
  { slug: "add-line-numbers", name: "Add Line Numbers", tagline: "Add line numbers to any text", description: "Number every line in a text file or code block. Set starting number and separator style.", category: "text-tools", icon: "ListOrdered", tags: ["line numbers", "text", "format", "code"], relatedTools: ["remove-line-breaks", "word-counter"], howTo: [{ title: "Paste text", description: "Enter your text." }, { title: "Configure", description: "Set start number and separator." }, { title: "Copy result", description: "Copy numbered text." }], faqs: [] },
  { slug: "duplicate-word-finder", name: "Duplicate Word Finder", tagline: "Find and highlight duplicate words", description: "Detect repeated words and phrases in your text. Useful for proofreading and improving writing quality.", category: "text-tools", icon: "Copy", tags: ["duplicate", "words", "find", "proofread"], relatedTools: ["word-counter", "grammar-checker"], howTo: [{ title: "Paste text", description: "Enter the text to analyze." }, { title: "Find duplicates", description: "Highlight all repeated words." }, { title: "Review", description: "See frequency counts." }], faqs: [] },
  { slug: "reading-time-calculator", name: "Reading Time Calculator", tagline: "Calculate how long text takes to read", description: "Estimate reading time based on average WPM. Adjust for different reading speeds and content types.", category: "text-tools", icon: "Clock", tags: ["reading time", "wpm", "text", "estimate"], relatedTools: ["word-counter", "text-summarizer"], howTo: [{ title: "Paste content", description: "Enter your text or article." }, { title: "Set speed", description: "Choose reading speed (slow/average/fast)." }, { title: "View result", description: "See estimated reading time." }], faqs: [] },
  { slug: "passphrase-generator", name: "Passphrase Generator", tagline: "Generate memorable secure passphrases", description: "Generate random, memorable passphrases using word lists. Stronger and easier to remember than random passwords.", category: "text-tools", icon: "KeyRound", tags: ["passphrase", "password", "secure", "generate"], relatedTools: ["password-generator", "password-strength-checker"], howTo: [{ title: "Set word count", description: "Choose number of words (3–8)." }, { title: "Choose separator", description: "Pick space, dash, or custom separator." }, { title: "Generate", description: "Create your passphrase." }], faqs: [{ question: "Are passphrases secure?", answer: "Yes, a 4-word passphrase has ~44 bits of entropy, comparable to a 8-character random password but far more memorable." }] },
  { slug: "text-encryption", name: "Text Encryption Tool", tagline: "Encrypt and decrypt text with AES-256", description: "Encrypt text using AES-256-GCM in your browser. Data never leaves your device.", category: "text-tools", icon: "Lock", tags: ["encrypt", "decrypt", "aes", "security", "privacy"], relatedTools: ["password-generator", "base64-encoder"], howTo: [{ title: "Enter text", description: "Type or paste the text to encrypt." }, { title: "Set password", description: "Enter an encryption password." }, { title: "Encrypt or decrypt", description: "Get your ciphertext or plaintext." }], faqs: [{ question: "Is my data secure?", answer: "All encryption/decryption runs in your browser. No data is ever sent to a server." }] },
  { slug: "rot13-encoder", name: "ROT13 Encoder / Decoder", tagline: "Encode and decode ROT13 text", description: "Apply ROT13 (rotate by 13 places) encoding to text. ROT13 is its own inverse, so encoding and decoding is the same operation.", category: "text-tools", icon: "RotateCcw", tags: ["rot13", "encode", "decode", "cipher"], relatedTools: ["base64-encoder", "text-encryption"], howTo: [{ title: "Enter text", description: "Type or paste your text." }, { title: "Apply ROT13", description: "Click to encode/decode." }, { title: "Copy result", description: "Copy the transformed text." }], faqs: [] },
  { slug: "strong-password-generator", name: "Strong Password Generator", tagline: "Generate ultra-secure passwords", description: "Create cryptographically secure passwords with custom rules. Guarantees inclusion of all required character types.", category: "developer-tools", icon: "Shield", tags: ["password", "security", "generate", "strong"], relatedTools: ["password-generator", "password-strength-checker"], howTo: [{ title: "Set requirements", description: "Choose length and required characters." }, { title: "Generate", description: "Create your secure password." }, { title: "Copy", description: "Copy to clipboard." }], faqs: [] },

  // ===========================
  // ADVANCED DEVELOPER TOOLS
  // ===========================
  { slug: "jwt-inspector", name: "JWT Inspector", tagline: "Decode and inspect JWT tokens", description: "Decode JWT tokens and inspect headers, payload, and signature. View expiry, issuer, and all claims.", category: "developer-tools", icon: "KeySquare", tags: ["jwt", "token", "decode", "auth", "developer"], isPopular: true, relatedTools: ["base64-encoder", "json-formatter"], howTo: [{ title: "Paste JWT", description: "Paste your JWT token." }, { title: "Inspect", description: "View decoded header and payload." }, { title: "Check claims", description: "Verify expiry and custom claims." }], faqs: [{ question: "Is my JWT safe to paste here?", answer: "Yes. JWT decoding is done entirely in your browser. No data is sent to servers." }] },
  { slug: "uuid-validator", name: "UUID Validator", tagline: "Validate and parse UUID strings", description: "Validate UUID format and detect the version (v1–v5, nil). Parse UUID components and check formatting.", category: "developer-tools", icon: "CheckCircle2", tags: ["uuid", "validate", "guid", "developer"], relatedTools: ["uuid-generator", "json-formatter"], howTo: [{ title: "Enter UUID", description: "Paste the UUID to validate." }, { title: "Validate", description: "Check format and detect version." }, { title: "View info", description: "See parsed UUID components." }], faqs: [] },
  { slug: "md5-generator", name: "MD5 Generator", tagline: "Generate MD5 hash of any text or file", description: "Generate MD5 hash digests from text strings. MD5 is commonly used for checksums.", category: "developer-tools", icon: "Hash", tags: ["md5", "hash", "checksum", "developer"], relatedTools: ["sha256-generator", "sha512-generator"], howTo: [{ title: "Enter text", description: "Type or paste text to hash." }, { title: "Generate", description: "Compute the MD5 hash." }, { title: "Copy", description: "Copy the hash string." }], faqs: [{ question: "Is MD5 secure for passwords?", answer: "No. MD5 is broken for security use. Use SHA-256 or bcrypt for passwords." }] },
  { slug: "sha1-generator", name: "SHA1 Generator", tagline: "Generate SHA-1 hash of text", description: "Generate SHA-1 cryptographic hashes. Commonly used in legacy systems and checksums.", category: "developer-tools", icon: "Hash", tags: ["sha1", "hash", "checksum", "developer"], relatedTools: ["sha256-generator", "md5-generator"], howTo: [{ title: "Enter text", description: "Paste text to hash." }, { title: "Generate SHA-1", description: "Compute the hash." }, { title: "Copy", description: "Copy the hash." }], faqs: [] },
  { slug: "sha256-generator", name: "SHA256 Generator", tagline: "Generate SHA-256 hash of text or files", description: "Generate SHA-256 cryptographic hashes. The most widely used secure hash algorithm.", category: "developer-tools", icon: "Hash", tags: ["sha256", "hash", "crypto", "developer"], isPopular: true, relatedTools: ["sha512-generator", "md5-generator"], howTo: [{ title: "Enter text", description: "Paste text to hash." }, { title: "Generate SHA-256", description: "Compute the hash." }, { title: "Copy", description: "Copy the 64-char hash." }], faqs: [] },
  { slug: "sha512-generator", name: "SHA512 Generator", tagline: "Generate SHA-512 hash of text", description: "Generate SHA-512 cryptographic hashes with 128-character output. Maximum security hashing.", category: "developer-tools", icon: "Hash", tags: ["sha512", "hash", "crypto", "developer"], relatedTools: ["sha256-generator", "md5-generator"], howTo: [{ title: "Enter text", description: "Paste text to hash." }, { title: "Generate SHA-512", description: "Compute the hash." }, { title: "Copy", description: "Copy the 128-char hash." }], faqs: [] },
  { slug: "bcrypt-generator", name: "Bcrypt Generator", tagline: "Generate and verify bcrypt password hashes", description: "Hash passwords using bcrypt with configurable cost factor. Verify bcrypt hashes against plain text.", category: "developer-tools", icon: "ShieldCheck", tags: ["bcrypt", "hash", "password", "security"], relatedTools: ["sha256-generator", "password-generator"], howTo: [{ title: "Enter password", description: "Type the password to hash." }, { title: "Set cost factor", description: "Choose rounds (10–14 recommended)." }, { title: "Hash or verify", description: "Generate or verify a bcrypt hash." }], faqs: [{ question: "What cost factor should I use?", answer: "10–12 for web apps (balances security and speed). Higher is more secure but slower." }] },
  { slug: "url-parser", name: "URL Parser", tagline: "Parse and analyze URL components", description: "Parse any URL into its components: protocol, hostname, pathname, query parameters, fragment, and more.", category: "developer-tools", icon: "Link2", tags: ["url", "parse", "query", "developer"], relatedTools: ["url-encoder", "json-formatter"], howTo: [{ title: "Enter URL", description: "Paste any URL to parse." }, { title: "View components", description: "See protocol, host, path, params." }, { title: "Edit", description: "Modify components and rebuild URL." }], faqs: [] },
  { slug: "user-agent-parser", name: "User Agent Parser", tagline: "Parse and decode browser user agent strings", description: "Parse user agent strings to identify browser, OS, device type, and rendering engine.", category: "developer-tools", icon: "Monitor", tags: ["user agent", "browser", "parse", "developer"], relatedTools: ["url-parser", "json-formatter"], howTo: [{ title: "Enter user agent", description: "Paste or auto-detect your UA." }, { title: "Parse", description: "Identify browser, OS, and device." }, { title: "View details", description: "See parsed components." }], faqs: [] },
  { slug: "cidr-calculator", name: "CIDR Calculator", tagline: "Calculate IP ranges from CIDR notation", description: "Calculate network address, broadcast, first/last host, and number of IPs from CIDR notation.", category: "developer-tools", icon: "Network", tags: ["cidr", "ip", "network", "subnet", "developer"], relatedTools: ["url-parser", "json-formatter"], howTo: [{ title: "Enter CIDR", description: "Enter an IP in CIDR notation (e.g. 192.168.1.0/24)." }, { title: "Calculate", description: "View network range details." }], faqs: [] },
  { slug: "cron-generator", name: "Cron Expression Generator", tagline: "Build cron schedules visually", description: "Generate cron expressions with a visual builder. Supports standard and extended cron syntax.", category: "developer-tools", icon: "Timer", tags: ["cron", "schedule", "expression", "developer"], relatedTools: ["cron-parser", "json-formatter"], howTo: [{ title: "Set schedule", description: "Choose minutes, hours, days, months." }, { title: "Preview", description: "See human-readable schedule." }, { title: "Copy expression", description: "Copy the cron string." }], faqs: [] },
  { slug: "cron-parser", name: "Cron Expression Parser", tagline: "Decode and explain cron expressions", description: "Parse any cron expression and get a human-readable explanation with next execution times.", category: "developer-tools", icon: "TimerOff", tags: ["cron", "parse", "schedule", "developer"], relatedTools: ["cron-generator", "json-formatter"], howTo: [{ title: "Enter cron", description: "Paste a cron expression." }, { title: "Parse", description: "Get plain-English explanation." }, { title: "View schedule", description: "See upcoming execution times." }], faqs: [] },
  { slug: "json-diff", name: "JSON Diff Tool", tagline: "Compare two JSON objects visually", description: "Compare two JSON files or objects and see differences highlighted. Supports deep comparison.", category: "developer-tools", icon: "GitCompare", tags: ["json", "diff", "compare", "developer"], isNew: true, relatedTools: ["json-formatter", "json-escape"], howTo: [{ title: "Paste JSON A & B", description: "Enter two JSON objects to compare." }, { title: "Diff", description: "View additions, deletions, changes." }], faqs: [] },
  { slug: "json-escape", name: "JSON Escape / Unescape", tagline: "Escape and unescape JSON strings", description: "Escape special characters in JSON strings or unescape existing JSON escape sequences.", category: "developer-tools", icon: "Code", tags: ["json", "escape", "unescape", "developer"], relatedTools: ["json-formatter", "json-diff"], howTo: [{ title: "Paste text", description: "Enter text with special characters." }, { title: "Escape or unescape", description: "Choose the operation." }, { title: "Copy result", description: "Use the processed string." }], faqs: [] },
  { slug: "xml-to-json", name: "XML to JSON", tagline: "Convert XML data to JSON format", description: "Convert XML documents to JSON format. Handles nested elements, attributes, and arrays.", category: "developer-tools", icon: "ArrowRight", tags: ["xml", "json", "convert", "developer"], relatedTools: ["json-to-xml", "json-formatter"], howTo: [{ title: "Paste XML", description: "Enter your XML document." }, { title: "Convert", description: "Transform to JSON." }, { title: "Copy", description: "Use the JSON output." }], faqs: [] },
  { slug: "json-to-xml", name: "JSON to XML", tagline: "Convert JSON data to XML format", description: "Convert JSON objects to well-formed XML documents. Customizable root element and attribute handling.", category: "developer-tools", icon: "ArrowLeft", tags: ["json", "xml", "convert", "developer"], relatedTools: ["xml-to-json", "json-formatter"], howTo: [{ title: "Paste JSON", description: "Enter your JSON data." }, { title: "Convert", description: "Transform to XML." }, { title: "Copy", description: "Use the XML output." }], faqs: [] },
  { slug: "yaml-to-json", name: "YAML to JSON", tagline: "Convert YAML to JSON format", description: "Parse and convert YAML files and strings to JSON. Supports YAML 1.2 spec.", category: "developer-tools", icon: "FileJson", tags: ["yaml", "json", "convert", "developer"], isNew: true, relatedTools: ["json-formatter", "xml-to-json"], howTo: [{ title: "Paste YAML", description: "Enter your YAML content." }, { title: "Convert", description: "Transform to JSON." }, { title: "Copy", description: "Use the JSON output." }], faqs: [] },
  { slug: "csv-to-xml", name: "CSV to XML", tagline: "Convert CSV files to XML format", description: "Convert CSV spreadsheet data to XML format with customizable element names.", category: "developer-tools", icon: "Table", tags: ["csv", "xml", "convert", "developer"], relatedTools: ["xml-to-json", "json-formatter"], howTo: [{ title: "Paste CSV", description: "Enter your CSV data." }, { title: "Set options", description: "Configure root and row element names." }, { title: "Convert & copy", description: "Get your XML output." }], faqs: [] },
  { slug: "html-to-markdown", name: "HTML to Markdown", tagline: "Convert HTML to Markdown format", description: "Convert HTML documents to clean Markdown syntax. Handles headings, lists, links, code blocks, and tables.", category: "developer-tools", icon: "FileCode2", tags: ["html", "markdown", "convert", "developer"], relatedTools: ["markdown-to-html", "text-cleaner"], howTo: [{ title: "Paste HTML", description: "Enter your HTML code." }, { title: "Convert", description: "Transform to Markdown." }, { title: "Copy", description: "Use the Markdown output." }], faqs: [] },

  // ===========================
  // ADVANCED SEO TOOLS
  // ===========================
  { slug: "meta-tag-analyzer", name: "Meta Tag Analyzer", tagline: "Analyze meta tags from any page's HTML", description: "Paste raw HTML and extract all meta tags, Open Graph data, Twitter Cards, canonical URLs, and structured data.", category: "seo-tools", icon: "Tags", tags: ["meta tags", "seo", "analyze", "html"], relatedTools: ["meta-tag-generator", "open-graph-checker"], howTo: [{ title: "Paste HTML", description: "Paste page source or head section." }, { title: "Analyze", description: "Extract all meta data." }, { title: "Review", description: "Check SEO completeness." }], faqs: [] },
  { slug: "title-tag-checker", name: "Title Tag Length Checker", tagline: "Check if your page title is SEO-optimal", description: "Measure title tag length in characters and pixels. Preview how it appears in Google search results.", category: "seo-tools", icon: "Ruler", tags: ["title tag", "seo", "length", "serp"], relatedTools: ["meta-description-checker", "serp-snippet-preview"], howTo: [{ title: "Enter title", description: "Type your page title." }, { title: "Check length", description: "See character count and pixel width." }, { title: "Preview", description: "See SERP preview." }], faqs: [] },
  { slug: "meta-description-checker", name: "Meta Description Length Checker", tagline: "Optimize meta description length for SEO", description: "Check meta description length and preview how it displays in search results. Avoid truncation.", category: "seo-tools", icon: "Ruler", tags: ["meta description", "seo", "length", "serp"], relatedTools: ["title-tag-checker", "meta-tag-generator"], howTo: [{ title: "Enter description", description: "Type your meta description." }, { title: "Check length", description: "See if it fits in SERP." }, { title: "Optimize", description: "Adjust to fit ideally within 155 chars." }], faqs: [] },
  { slug: "utm-builder", name: "UTM Campaign Builder", tagline: "Build UTM-tagged URLs for campaign tracking", description: "Build UTM-tagged URLs for Google Analytics campaign tracking. Supports all 5 UTM parameters.", category: "seo-tools", icon: "Link", tags: ["utm", "campaign", "tracking", "analytics", "seo"], isPopular: true, relatedTools: ["url-parser", "url-encoder"], howTo: [{ title: "Enter URL", description: "Paste the destination URL." }, { title: "Add UTM params", description: "Fill in source, medium, campaign, etc." }, { title: "Copy", description: "Copy the tagged URL." }], faqs: [{ question: "What are UTM parameters?", answer: "UTM parameters are tags added to URLs that tell analytics tools where traffic is coming from." }] },
  { slug: "serp-snippet-preview", name: "SERP Snippet Preview", tagline: "Preview how your page looks in Google", description: "Preview your page as it would appear in Google search results. Check title, description, and URL format.", category: "seo-tools", icon: "Search", tags: ["serp", "snippet", "preview", "google", "seo"], isPopular: true, relatedTools: ["meta-tag-generator", "title-tag-checker"], howTo: [{ title: "Enter title & description", description: "Type your page title and description." }, { title: "Set URL", description: "Enter the page URL." }, { title: "Preview", description: "See Google SERP result." }], faqs: [] },
  { slug: "schema-validator", name: "Schema Markup Validator", tagline: "Validate JSON-LD schema markup", description: "Validate JSON-LD structured data against Schema.org specifications. Check for errors and missing required properties.", category: "seo-tools", icon: "CheckSquare", tags: ["schema", "json-ld", "structured data", "seo"], relatedTools: ["meta-tag-generator", "open-graph-checker"], howTo: [{ title: "Paste JSON-LD", description: "Enter your schema markup." }, { title: "Validate", description: "Check for errors." }, { title: "Fix issues", description: "See suggestions for improvement." }], faqs: [] },
  { slug: "robots-txt-tester", name: "Robots.txt Tester", tagline: "Test robots.txt rules against URLs", description: "Simulate how search engines read your robots.txt. Test specific URLs against your rules.", category: "seo-tools", icon: "BotOff", tags: ["robots.txt", "seo", "test", "crawl"], relatedTools: ["robots-txt-generator", "sitemap-generator"], howTo: [{ title: "Paste robots.txt", description: "Enter your robots.txt content." }, { title: "Enter URL", description: "Type a URL to test." }, { title: "Test", description: "See if the URL is allowed or blocked." }], faqs: [] },
  { slug: "sitemap-validator", name: "Sitemap Validator", tagline: "Validate XML sitemap format", description: "Validate XML sitemap structure and check for errors. Verifies required elements and URL formatting.", category: "seo-tools", icon: "MapPin", tags: ["sitemap", "xml", "validate", "seo"], relatedTools: ["sitemap-generator", "robots-txt-generator"], howTo: [{ title: "Paste sitemap XML", description: "Enter your sitemap.xml content." }, { title: "Validate", description: "Check for format errors." }, { title: "Fix issues", description: "See what needs to be corrected." }], faqs: [] },
  { slug: "hreflang-generator", name: "Hreflang Generator", tagline: "Generate hreflang tags for international SEO", description: "Create hreflang tags for international and multilingual websites. Supports all languages and regions.", category: "seo-tools", icon: "Globe", tags: ["hreflang", "international seo", "languages", "seo"], relatedTools: ["meta-tag-generator", "robots-txt-generator"], howTo: [{ title: "Add URLs", description: "Enter URLs for each language/region." }, { title: "Set languages", description: "Select language and country codes." }, { title: "Generate", description: "Copy hreflang tags." }], faqs: [] },

  // ===========================
  // COLOR & CSS TOOLS (new category)
  // ===========================
  { slug: "css-grid-generator", name: "CSS Grid Generator", tagline: "Build CSS Grid layouts visually", description: "Create CSS Grid layouts interactively. Set columns, rows, gaps, and generate the CSS code.", category: "color-tools", icon: "Grid3x3", tags: ["css", "grid", "layout", "generator"], isNew: true, relatedTools: ["flexbox-generator", "css-animation-generator"], howTo: [{ title: "Set columns & rows", description: "Define your grid structure." }, { title: "Configure gaps", description: "Set row and column gaps." }, { title: "Copy CSS", description: "Use the generated CSS code." }], faqs: [] },
  { slug: "flexbox-generator", name: "Flexbox Generator", tagline: "Generate CSS Flexbox layouts visually", description: "Create Flexbox layouts interactively. Preview all flex properties in real-time and copy the CSS.", category: "color-tools", icon: "Layout", tags: ["css", "flexbox", "layout", "generator"], relatedTools: ["css-grid-generator", "css-animation-generator"], howTo: [{ title: "Set flex properties", description: "Configure direction, wrap, justify, align." }, { title: "Preview", description: "See live layout preview." }, { title: "Copy CSS", description: "Get the flexbox CSS code." }], faqs: [] },
  { slug: "css-animation-generator", name: "CSS Animation Generator", tagline: "Create CSS animations with a visual editor", description: "Generate CSS keyframe animations visually. Set easing, duration, and keyframe properties.", category: "color-tools", icon: "Wand2", tags: ["css", "animation", "keyframes", "generator"], relatedTools: ["css-grid-generator", "flexbox-generator"], howTo: [{ title: "Choose animation", description: "Select animation type." }, { title: "Configure", description: "Set duration, easing, delay." }, { title: "Copy CSS", description: "Get the keyframe code." }], faqs: [] },
  { slug: "tailwind-color-generator", name: "Tailwind Color Generator", tagline: "Generate custom Tailwind CSS color palettes", description: "Generate custom Tailwind CSS color palettes from any hex color. Get all 50–950 shade variations.", category: "color-tools", icon: "Palette", tags: ["tailwind", "color", "css", "palette"], isNew: true, relatedTools: ["color-converter", "tailwind-gradient-generator"], howTo: [{ title: "Choose base color", description: "Pick a color with the color picker." }, { title: "Generate palette", description: "Auto-generate all shades 50–950." }, { title: "Copy config", description: "Get Tailwind CSS config snippet." }], faqs: [] },
  { slug: "tailwind-shadow-generator", name: "Tailwind Shadow Generator", tagline: "Generate custom Tailwind box shadows", description: "Create and preview custom box shadow utilities for Tailwind CSS projects.", category: "color-tools", icon: "Square", tags: ["tailwind", "shadow", "css", "utility"], relatedTools: ["tailwind-color-generator", "css-clamp-calculator"], howTo: [{ title: "Configure shadow", description: "Set offset, blur, spread, color." }, { title: "Preview", description: "See live shadow preview." }, { title: "Copy class", description: "Get the Tailwind utility class." }], faqs: [] },
  { slug: "tailwind-gradient-generator", name: "Tailwind Gradient Generator", tagline: "Create gradient backgrounds for Tailwind", description: "Generate CSS gradient utilities for Tailwind CSS. Supports linear, radial, and conic gradients.", category: "color-tools", icon: "Blend", tags: ["tailwind", "gradient", "css", "background"], relatedTools: ["tailwind-color-generator", "css-animation-generator"], howTo: [{ title: "Pick colors", description: "Choose gradient start and end colors." }, { title: "Set direction", description: "Choose gradient direction." }, { title: "Copy", description: "Get Tailwind CSS classes." }], faqs: [] },
  { slug: "css-clamp-calculator", name: "CSS Clamp Calculator", tagline: "Calculate fluid CSS clamp() values", description: "Calculate CSS clamp() values for fluid typography and spacing that scales smoothly between viewport sizes.", category: "color-tools", icon: "Scaling", tags: ["css", "clamp", "fluid", "typography", "responsive"], isNew: true, relatedTools: ["rem-to-px", "css-unit-converter"], howTo: [{ title: "Set min & max values", description: "Enter minimum and maximum sizes." }, { title: "Set breakpoints", description: "Set viewport widths." }, { title: "Copy clamp()", description: "Get the CSS clamp() value." }], faqs: [] },
  { slug: "rem-to-px", name: "REM to PX Converter", tagline: "Convert REM values to pixels", description: "Convert CSS rem units to pixel values based on root font size. Useful for precise design implementation.", category: "color-tools", icon: "ArrowRight", tags: ["rem", "px", "css", "convert", "typography"], relatedTools: ["px-to-rem", "css-unit-converter"], howTo: [{ title: "Enter REM value", description: "Type the rem value." }, { title: "Set base font size", description: "Set root font size (default 16px)." }, { title: "Convert", description: "Get the pixel value." }], faqs: [] },
  { slug: "px-to-rem", name: "PX to REM Converter", tagline: "Convert pixels to REM values", description: "Convert pixel values to CSS rem units based on root font size. Essential for accessible, scalable CSS.", category: "color-tools", icon: "ArrowLeft", tags: ["px", "rem", "css", "convert", "typography"], relatedTools: ["rem-to-px", "css-unit-converter"], howTo: [{ title: "Enter PX value", description: "Type the pixel value." }, { title: "Set base font size", description: "Set root font size (default 16px)." }, { title: "Convert", description: "Get the rem value." }], faqs: [] },
  { slug: "css-unit-converter", name: "CSS Unit Converter", tagline: "Convert between all CSS units", description: "Convert between px, rem, em, vw, vh, pt, cm, mm, in, and all other CSS units.", category: "color-tools", icon: "ArrowLeftRight", tags: ["css", "units", "convert", "px", "rem", "em"], relatedTools: ["rem-to-px", "px-to-rem"], howTo: [{ title: "Enter value", description: "Type the value to convert." }, { title: "Select units", description: "Choose from and to CSS units." }, { title: "Convert", description: "See all unit equivalents." }], faqs: [] },

  // ===========================
  // ADDITIONAL UNIT CONVERTERS
  // ===========================
  { slug: "kb-to-mb", name: "KB to MB Converter", tagline: "Convert kilobytes to megabytes", description: "Convert KB to MB, GB, TB and all data storage units instantly.", category: "unit-converters", icon: "HardDrive", tags: ["kb", "mb", "data", "storage", "convert"], relatedTools: ["mb-to-gb", "gb-to-tb"], howTo: [{ title: "Enter KB value", description: "Type the kilobyte amount." }, { title: "Convert", description: "See equivalents in MB, GB, TB." }], faqs: [] },
  { slug: "mb-to-gb", name: "MB to GB Converter", tagline: "Convert megabytes to gigabytes", description: "Convert MB to GB, TB and all data storage units instantly.", category: "unit-converters", icon: "HardDrive", tags: ["mb", "gb", "data", "storage", "convert"], relatedTools: ["kb-to-mb", "gb-to-tb"], howTo: [{ title: "Enter MB value", description: "Type the megabyte amount." }, { title: "Convert", description: "See equivalents in GB, TB." }], faqs: [] },
  { slug: "gb-to-tb", name: "GB to TB Converter", tagline: "Convert gigabytes to terabytes", description: "Convert GB to TB and all data storage units instantly.", category: "unit-converters", icon: "HardDrive", tags: ["gb", "tb", "data", "storage", "convert"], relatedTools: ["kb-to-mb", "mb-to-gb"], howTo: [{ title: "Enter GB value", description: "Type the gigabyte amount." }, { title: "Convert", description: "See equivalents in TB." }], faqs: [] },
  { slug: "inches-to-cm", name: "Inches to CM", tagline: "Convert inches to centimeters", description: "Convert inches to centimeters and all length units instantly.", category: "unit-converters", icon: "Ruler", tags: ["inches", "cm", "length", "convert"], relatedTools: ["cm-to-inches", "length-converter"], howTo: [{ title: "Enter inches", description: "Type the inch value." }, { title: "Convert", description: "See cm equivalent." }], faqs: [{ question: "How many cm in an inch?", answer: "1 inch = 2.54 centimeters." }] },
  { slug: "cm-to-inches", name: "CM to Inches", tagline: "Convert centimeters to inches", description: "Convert centimeters to inches and all imperial length units instantly.", category: "unit-converters", icon: "Ruler", tags: ["cm", "inches", "length", "convert"], relatedTools: ["inches-to-cm", "length-converter"], howTo: [{ title: "Enter CM", description: "Type the centimeter value." }, { title: "Convert", description: "See inch equivalent." }], faqs: [] },
  { slug: "feet-to-meter", name: "Feet to Meter", tagline: "Convert feet to meters", description: "Convert feet to meters and all metric length units instantly.", category: "unit-converters", icon: "Ruler", tags: ["feet", "meters", "length", "convert"], relatedTools: ["meter-to-feet", "length-converter"], howTo: [{ title: "Enter feet", description: "Type the feet value." }, { title: "Convert", description: "See meter equivalent." }], faqs: [] },
  { slug: "meter-to-feet", name: "Meter to Feet", tagline: "Convert meters to feet", description: "Convert meters to feet, inches, and all imperial length units instantly.", category: "unit-converters", icon: "Ruler", tags: ["meters", "feet", "length", "convert"], relatedTools: ["feet-to-meter", "length-converter"], howTo: [{ title: "Enter meters", description: "Type the meter value." }, { title: "Convert", description: "See feet equivalent." }], faqs: [] },
  { slug: "kg-to-pounds", name: "KG to Pounds", tagline: "Convert kilograms to pounds", description: "Convert kilograms to pounds, ounces, and all weight units instantly.", category: "unit-converters", icon: "Scale", tags: ["kg", "pounds", "weight", "convert"], relatedTools: ["pounds-to-kg", "weight-converter"], howTo: [{ title: "Enter KG", description: "Type the kilogram value." }, { title: "Convert", description: "See pounds equivalent." }], faqs: [{ question: "How many pounds in a kilogram?", answer: "1 kg = 2.20462 pounds." }] },
  { slug: "pounds-to-kg", name: "Pounds to KG", tagline: "Convert pounds to kilograms", description: "Convert pounds to kilograms and all metric weight units instantly.", category: "unit-converters", icon: "Scale", tags: ["pounds", "kg", "weight", "convert"], relatedTools: ["kg-to-pounds", "weight-converter"], howTo: [{ title: "Enter pounds", description: "Type the pound value." }, { title: "Convert", description: "See kg equivalent." }], faqs: [] },
  { slug: "celsius-to-fahrenheit", name: "Celsius to Fahrenheit", tagline: "Convert °C to °F instantly", description: "Convert Celsius to Fahrenheit and all temperature scales instantly.", category: "unit-converters", icon: "Thermometer", tags: ["celsius", "fahrenheit", "temperature", "convert"], relatedTools: ["fahrenheit-to-celsius", "temperature-converter"], howTo: [{ title: "Enter °C", description: "Type the Celsius value." }, { title: "Convert", description: "See Fahrenheit equivalent." }], faqs: [{ question: "How do I convert Celsius to Fahrenheit?", answer: "°F = (°C × 9/5) + 32" }] },
  { slug: "fahrenheit-to-celsius", name: "Fahrenheit to Celsius", tagline: "Convert °F to °C instantly", description: "Convert Fahrenheit to Celsius and all temperature scales instantly.", category: "unit-converters", icon: "Thermometer", tags: ["fahrenheit", "celsius", "temperature", "convert"], relatedTools: ["celsius-to-fahrenheit", "temperature-converter"], howTo: [{ title: "Enter °F", description: "Type the Fahrenheit value." }, { title: "Convert", description: "See Celsius equivalent." }], faqs: [] },
  { slug: "sqft-to-sqm", name: "Square Feet to Square Meter", tagline: "Convert sq ft to sq m", description: "Convert square feet to square meters and other area units.", category: "unit-converters", icon: "Square", tags: ["square feet", "square meters", "area", "convert"], relatedTools: ["area-converter", "acres-to-hectare"], howTo: [{ title: "Enter sq ft", description: "Type the square feet value." }, { title: "Convert", description: "See square meter equivalent." }], faqs: [] },
  { slug: "acre-to-hectare", name: "Acre to Hectare", tagline: "Convert acres to hectares", description: "Convert acres to hectares and all land area units instantly.", category: "unit-converters", icon: "Square", tags: ["acre", "hectare", "area", "land", "convert"], relatedTools: ["sqft-to-sqm", "area-converter"], howTo: [{ title: "Enter acres", description: "Type the acre value." }, { title: "Convert", description: "See hectare equivalent." }], faqs: [{ question: "How many hectares in an acre?", answer: "1 acre = 0.404686 hectares." }] },

  // ===========================
  // FINANCE CALCULATORS
  // ===========================
  { slug: "gst-calculator", name: "GST Calculator", tagline: "Calculate GST / tax on prices", description: "Add or remove GST (Goods and Services Tax) from prices. Supports multiple tax rates and reverse GST calculation.", category: "calculators", icon: "Receipt", tags: ["gst", "tax", "calculator", "price"], isPopular: true, relatedTools: ["percentage-calculator", "loan-calculator"], howTo: [{ title: "Enter price", description: "Type the original price." }, { title: "Set GST rate", description: "Enter the tax rate (e.g. 10%, 18%)." }, { title: "Calculate", description: "See price with and without GST." }], faqs: [{ question: "How is GST calculated?", answer: "GST = (Price × GST Rate) / 100. Total = Price + GST." }] },
  { slug: "cagr-calculator", name: "CAGR Calculator", tagline: "Calculate Compound Annual Growth Rate", description: "Calculate the Compound Annual Growth Rate (CAGR) of an investment. Find future value or growth rate.", category: "calculators", icon: "TrendingUp", tags: ["cagr", "growth", "investment", "calculator"], relatedTools: ["compound-interest-calculator", "sip-calculator"], howTo: [{ title: "Enter values", description: "Provide initial value, final value, and years." }, { title: "Calculate CAGR", description: "See the annualized growth rate." }], faqs: [{ question: "What is CAGR?", answer: "CAGR represents the rate at which an investment would have grown if it grew at a steady annual rate." }] },
  { slug: "sip-calculator", name: "SIP Calculator", tagline: "Calculate returns on SIP investments", description: "Calculate the future value of Systematic Investment Plan (SIP) contributions with compound growth.", category: "calculators", icon: "PiggyBank", tags: ["sip", "investment", "returns", "calculator"], relatedTools: ["compound-interest-calculator", "cagr-calculator"], howTo: [{ title: "Enter monthly amount", description: "Set your monthly SIP amount." }, { title: "Set rate & period", description: "Enter expected return and years." }, { title: "Calculate", description: "See total corpus and returns." }], faqs: [{ question: "What is SIP?", answer: "SIP (Systematic Investment Plan) lets you invest a fixed amount in mutual funds every month." }] },
  { slug: "qr-code-generator", name: "QR Code Generator", tagline: "Generate QR codes for text, URLs, and data", description: "Create QR codes instantly for URLs, text, phone numbers, emails, and more. Download as PNG or SVG.", category: "developer-tools", icon: "QrCode", tags: ["qr code", "generate", "url", "barcode"], isPopular: true, isFeatured: true, relatedTools: ["url-encoder", "url-parser"], howTo: [{ title: "Enter content", description: "Type a URL, text, or data." }, { title: "Customize", description: "Set size, error correction, and colors." }, { title: "Download", description: "Save as PNG or SVG." }], faqs: [{ question: "What can QR codes store?", answer: "URLs, text, phone numbers, SMS messages, emails, WiFi credentials, and more." }] },

  // ===========================
  // AI / CONTENT GENERATOR TOOLS
  // ===========================
  { slug: "blog-outline-generator", name: "Blog Outline Generator", tagline: "Generate structured blog post outlines", description: "Generate complete blog post outlines with sections, subheadings, and talking points from a topic.", category: "ai-tools", icon: "FileText", tags: ["ai", "blog", "outline", "content", "writing"], isNew: true, relatedTools: ["headline-generator", "faq-generator"], howTo: [{ title: "Enter topic", description: "Type your blog post topic." }, { title: "Select style", description: "Choose listicle, guide, comparison, etc." }, { title: "Generate", description: "Get a complete outline." }], faqs: [] },
  { slug: "faq-generator", name: "FAQ Generator", tagline: "Generate FAQs for any topic", description: "Generate frequently asked questions (FAQs) with answers for any topic or product.", category: "ai-tools", icon: "HelpCircle", tags: ["ai", "faq", "questions", "content"], relatedTools: ["blog-outline-generator", "product-description-generator"], howTo: [{ title: "Enter topic", description: "Type your topic or product name." }, { title: "Set count", description: "Choose number of FAQ items." }, { title: "Generate", description: "Get questions and answers." }], faqs: [] },
  { slug: "product-description-generator", name: "Product Description Generator", tagline: "Write compelling product descriptions", description: "Generate persuasive product descriptions for e-commerce from product name and features.", category: "ai-tools", icon: "ShoppingBag", tags: ["ai", "product", "description", "ecommerce", "writing"], relatedTools: ["blog-outline-generator", "headline-generator"], howTo: [{ title: "Enter product name", description: "Type the product name." }, { title: "Add features", description: "List key features and benefits." }, { title: "Generate", description: "Get multiple description variations." }], faqs: [] },
  { slug: "social-post-generator", name: "Social Post Generator", tagline: "Generate social media posts in seconds", description: "Generate engaging social media posts for Twitter/X, LinkedIn, Instagram, and Facebook from a topic.", category: "ai-tools", icon: "MessageSquare", tags: ["ai", "social media", "post", "twitter", "linkedin"], relatedTools: ["blog-outline-generator", "headline-generator"], howTo: [{ title: "Enter topic", description: "Describe what to post about." }, { title: "Choose platform", description: "Select the social network." }, { title: "Generate", description: "Get post variations to choose from." }], faqs: [] },
  { slug: "email-generator", name: "Email Generator", tagline: "Generate professional emails for any purpose", description: "Generate professional email drafts for sales outreach, follow-ups, complaints, requests, and more.", category: "ai-tools", icon: "Mail", tags: ["ai", "email", "writing", "professional"], relatedTools: ["subject-line-generator", "social-post-generator"], howTo: [{ title: "Choose email type", description: "Select category (outreach, follow-up, etc.)." }, { title: "Enter context", description: "Add recipient name and key details." }, { title: "Generate", description: "Get a professional email draft." }], faqs: [] },
  { slug: "subject-line-generator", name: "Subject Line Generator", tagline: "Generate high-converting email subject lines", description: "Generate compelling email subject lines that improve open rates. A/B test different options.", category: "ai-tools", icon: "AtSign", tags: ["ai", "email", "subject line", "marketing"], relatedTools: ["email-generator", "headline-generator"], howTo: [{ title: "Enter topic", description: "Describe your email's purpose." }, { title: "Choose tone", description: "Select curiosity, urgency, value, etc." }, { title: "Generate", description: "Get multiple subject line options." }], faqs: [] },
  { slug: "headline-generator", name: "Headline Generator", tagline: "Generate catchy headlines and titles", description: "Generate attention-grabbing headlines for blog posts, ads, landing pages, and social media.", category: "ai-tools", icon: "Type", tags: ["ai", "headline", "title", "copywriting"], relatedTools: ["blog-outline-generator", "subject-line-generator"], howTo: [{ title: "Enter topic", description: "Describe your content." }, { title: "Select style", description: "Choose listicle, question, how-to, etc." }, { title: "Generate", description: "Get multiple headline options." }], faqs: [] },
  { slug: "rewrite-tool", name: "Rewrite Tool", tagline: "Rephrase and rewrite any text", description: "Rewrite text in different tones (formal, casual, persuasive, simple). Paraphrase while preserving meaning.", category: "ai-tools", icon: "RefreshCw", tags: ["ai", "rewrite", "paraphrase", "rephrase", "writing"], relatedTools: ["grammar-checker", "text-summarizer"], howTo: [{ title: "Paste text", description: "Enter the text to rewrite." }, { title: "Choose tone", description: "Select formal, casual, or persuasive." }, { title: "Rewrite", description: "Get the rephrased version." }], faqs: [] },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getPopularTools(limit = 12): Tool[] {
  return tools.filter((t) => t.isPopular).slice(0, limit);
}

export function getTrendingTools(limit = 8): Tool[] {
  return tools.filter((t) => t.isTrending).slice(0, limit);
}

export function getFeaturedTools(limit = 6): Tool[] {
  return tools.filter((t) => t.isFeatured).slice(0, limit);
}

export function getNewTools(limit = 6): Tool[] {
  return tools.filter((t) => t.isNew).slice(0, limit);
}

export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  if (!tool.relatedTools?.length) {
    return getToolsByCategory(tool.category)
      .filter((t) => t.slug !== tool.slug)
      .slice(0, limit);
  }
  return tool.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is Tool => !!t && t.slug !== tool.slug)
    .slice(0, limit);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)) ||
      t.category.includes(q)
  );
}

export function getAllSlugs(): string[] {
  return tools.map((t) => t.slug);
}
