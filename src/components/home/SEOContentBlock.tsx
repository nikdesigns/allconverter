import Link from "next/link";

export function SEOContentBlock() {
  return (
    <section className="py-16 border-t border-[var(--border-default)]">
      <div className="container-xl">
        <div className="max-w-4xl mx-auto prose-tool">

          <h2>250+ Free Online Tools — All in One Place</h2>
          <p>
            AllConverter.tools is a comprehensive browser-based utility platform with over 250 free tools
            across 12 categories — built for developers, designers, writers, marketers, business owners,
            students, and anyone who needs to get things done without installing software or creating
            an account. Every tool runs directly in your browser, so your files stay on your device
            and results are instant.
          </p>

          <h2>PDF Tools — Convert, Compress, Edit, and Extract</h2>
          <p>
            Our{" "}
            <Link href="/pdf-tools/" className="text-[var(--fg-brand)] hover:underline">
              PDF tools
            </Link>{" "}
            cover every common document task.{" "}
            <Link href="/tools/pdf-compressor/" className="text-[var(--fg-brand)] hover:underline">
              Compress PDFs
            </Link>{" "}
            to reduce file size for email, merge multiple files with the{" "}
            <Link href="/tools/pdf-merger/" className="text-[var(--fg-brand)] hover:underline">
              PDF Merger
            </Link>
            , split large documents, reorder pages, add watermarks, remove passwords, and convert
            between PDF and Word, Excel, PowerPoint, and images. Our{" "}
            <Link href="/tools/ocr-pdf/" className="text-[var(--fg-brand)] hover:underline">
              OCR PDF tool
            </Link>{" "}
            extracts text from scanned documents using on-device optical character recognition.
            All PDF processing is client-side — your documents never leave your browser.
          </p>

          <h2>Image Tools — Resize, Convert, Compress, and Optimise</h2>
          <p>
            The{" "}
            <Link href="/image-tools/" className="text-[var(--fg-brand)] hover:underline">
              image tools
            </Link>{" "}
            section handles every format and operation. Convert between JPG, PNG, WebP, AVIF, SVG,
            and HEIC. Resize and crop for any platform with our{" "}
            <Link href="/tools/social-image-resizer/" className="text-[var(--fg-brand)] hover:underline">
              social media image resizer
            </Link>
            , optimise file sizes with the{" "}
            <Link href="/tools/image-compressor/" className="text-[var(--fg-brand)] hover:underline">
              image compressor
            </Link>
            , remove backgrounds, strip EXIF metadata, and generate favicons — all without uploading
            to a cloud service.
          </p>

          <h2>AI Tools — Content Generation Without an API Key</h2>
          <p>
            Our{" "}
            <Link href="/ai-tools/" className="text-[var(--fg-brand)] hover:underline">
              AI tools
            </Link>{" "}
            help you produce professional written content in seconds. Generate{" "}
            <Link href="/tools/ai-cover-letter/" className="text-[var(--fg-brand)] hover:underline">
              cover letters
            </Link>
            , optimise your{" "}
            <Link href="/tools/ai-linkedin-optimizer/" className="text-[var(--fg-brand)] hover:underline">
              LinkedIn profile
            </Link>
            , write cold emails, blog outlines, product descriptions, social posts, and YouTube titles.
            Developer-focused tools include an{" "}
            <Link href="/tools/ai-sql-generator/" className="text-[var(--fg-brand)] hover:underline">
              AI SQL generator
            </Link>
            , code explainer, and regex generator. No API key required — all tools run in your browser.
          </p>

          <h2>Business Tools — Invoices, Documents, and Financial Calculators</h2>
          <p>
            The{" "}
            <Link href="/business-tools/" className="text-[var(--fg-brand)] hover:underline">
              business tools
            </Link>{" "}
            section covers the full document stack for freelancers, startups, and small businesses.
            Create{" "}
            <Link href="/tools/invoice-generator/" className="text-[var(--fg-brand)] hover:underline">
              GST invoices
            </Link>
            , proforma invoices, purchase orders, delivery challans, quotations, salary slips, and
            NDAs — all printable directly from the browser. Generate a{" "}
            <Link href="/tools/upi-qr-generator/" className="text-fg-brand hover:underline">
              UPI QR code
            </Link>
            {" "}for Google Pay, PhonePe, Paytm, and BHIM — with logo overlay and brand colors. Financial tools include a{" "}
            <Link href="/tools/profit-margin-calculator/" className="text-[var(--fg-brand)] hover:underline">
              profit margin calculator
            </Link>
            , ROI calculator, SaaS MRR and CAC calculators, and an expense tracker.
          </p>

          <h2>Financial Calculators — EMI, SIP, GST, CAGR, and More</h2>
          <p>
            Our{" "}
            <Link href="/calculators/" className="text-[var(--fg-brand)] hover:underline">
              financial calculators
            </Link>{" "}
            help you make informed estimates before important decisions. The{" "}
            <Link href="/tools/loan-calculator/" className="text-[var(--fg-brand)] hover:underline">
              EMI calculator
            </Link>{" "}
            breaks down monthly repayments on any loan.{" "}
            <Link href="/tools/sip-calculator/" className="text-[var(--fg-brand)] hover:underline">
              SIP
            </Link>{" "}
            and{" "}
            <Link href="/tools/cagr-calculator/" className="text-[var(--fg-brand)] hover:underline">
              CAGR calculators
            </Link>{" "}
            help plan long-term investments. The{" "}
            <Link href="/tools/gst-calculator/" className="text-[var(--fg-brand)] hover:underline">
              GST calculator
            </Link>{" "}
            handles both inclusive and exclusive tax calculations instantly. All calculator results
            are estimates and should not substitute professional financial advice.
          </p>

          <h2>Developer Tools — Format, Encode, Hash, and Validate</h2>
          <p>
            Developers rely on our{" "}
            <Link href="/developer-tools/" className="text-[var(--fg-brand)] hover:underline">
              developer tools
            </Link>{" "}
            for fast, no-friction utility tasks.{" "}
            <Link href="/tools/json-formatter/" className="text-[var(--fg-brand)] hover:underline">
              Format and validate JSON
            </Link>
            , diff two JSON objects, convert between XML, YAML, and CSV, encode Base64, decode JWTs,
            test regular expressions, generate hash values with MD5, SHA-256, and bcrypt, and
            format SQL queries. The{" "}
            <Link href="/tools/cron-generator/" className="text-[var(--fg-brand)] hover:underline">
              cron expression generator
            </Link>{" "}
            and{" "}
            <Link href="/tools/cidr-calculator/" className="text-[var(--fg-brand)] hover:underline">
              CIDR calculator
            </Link>{" "}
            cover network and scheduling needs.
          </p>

          <h2>SEO Tools — Meta Tags, Schema, and Technical Audits</h2>
          <p>
            Our{" "}
            <Link href="/seo-tools/" className="text-[var(--fg-brand)] hover:underline">
              SEO tools
            </Link>{" "}
            help you optimise pages and diagnose technical issues without expensive subscriptions.
            Generate{" "}
            <Link href="/tools/meta-tag-generator/" className="text-[var(--fg-brand)] hover:underline">
              meta tags
            </Link>
            , preview your{" "}
            <Link href="/tools/serp-snippet-preview/" className="text-[var(--fg-brand)] hover:underline">
              SERP snippet
            </Link>
            , validate schema markup, generate FAQ and Article JSON-LD, build hreflang tags, check
            redirect chains, verify canonical tags, create robots.txt files, and analyse keyword
            density — all from a single platform.
          </p>

          <h2>Audio Tools — Convert, Cut, Normalise, and Clean</h2>
          <p>
            The{" "}
            <Link href="/audio-tools/" className="text-[var(--fg-brand)] hover:underline">
              audio tools
            </Link>{" "}
            handle common audio tasks entirely in your browser using the Web Audio API. Cut and
            trim MP3s, convert between WAV, MP3, AAC, FLAC, and M4A formats, join multiple clips,
            boost audio volume, change playback speed, normalise loudness levels, and reduce
            background noise. No software installation required.
          </p>

          <h2>Text, Unit Converters, and Colour &amp; CSS Tools</h2>
          <p>
            Rounding out the platform are three more categories built for writers, designers, and
            everyday users.{" "}
            <Link href="/text-tools/" className="text-[var(--fg-brand)] hover:underline">
              Text tools
            </Link>{" "}
            include a word counter, case converter, lorem ipsum generator, duplicate line remover,
            slug generator, and text encryptor.{" "}
            <Link href="/unit-converters/" className="text-[var(--fg-brand)] hover:underline">
              Unit converters
            </Link>{" "}
            handle length, weight, temperature, area, speed, and storage units.{" "}
            <Link href="/color-tools/" className="text-[var(--fg-brand)] hover:underline">
              Colour and CSS tools
            </Link>{" "}
            include a CSS grid generator, flexbox builder, gradient generator, Tailwind colour
            picker, contrast checker, and REM/PX converter — essential utilities for front-end
            developers and designers.
          </p>

        </div>
      </div>
    </section>
  );
}
