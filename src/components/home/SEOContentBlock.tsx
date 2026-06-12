import Link from "next/link";

export function SEOContentBlock() {
  return (
    <section className="py-16 border-t border-[var(--border-default)]">
      <div className="container-xl">
        <div className="max-w-4xl mx-auto prose-tool">
          <h2>The Most Complete Free Online Tools Platform</h2>
          <p>
            AllConverter.tools is a comprehensive collection of over 100 free online tools designed for
            developers, designers, writers, marketers, students, and everyday users. Whether you
            need to{" "}
            <Link href="/tools/pdf-compressor/" className="text-[var(--fg-brand)] hover:underline">
              compress a PDF
            </Link>
            ,{" "}
            <Link href="/tools/image-compressor/" className="text-[var(--fg-brand)] hover:underline">
              optimize an image
            </Link>
            , or{" "}
            <Link href="/tools/json-formatter/" className="text-[var(--fg-brand)] hover:underline">
              format JSON data
            </Link>
            , AllConverter.tools has you covered with professional-quality tools that run entirely in your
            browser.
          </p>

          <h2>PDF Tools for Every Document Need</h2>
          <p>
            Our{" "}
            <Link href="/pdf-tools/" className="text-[var(--fg-brand)] hover:underline">
              PDF tools
            </Link>{" "}
            cover the complete range of document operations. Compress PDFs to reduce file size for
            email, merge multiple documents into one, split large PDFs into smaller files, and
            convert between PDF and formats like Word, Excel, and images. All PDF processing
            happens client-side, ensuring your sensitive documents never leave your device.
          </p>

          <h2>Image Optimization and Conversion</h2>
          <p>
            The{" "}
            <Link href="/image-tools/" className="text-[var(--fg-brand)] hover:underline">
              image tools
            </Link>{" "}
            section features everything from basic resizing and cropping to format conversion and
            background removal. Our image compressor uses smart algorithms to reduce file sizes by
            up to 80% without noticeable quality loss — essential for web performance optimization.
            Convert between JPG, PNG, WebP, SVG, and more.
          </p>

          <h2>Developer Utilities and Code Formatters</h2>
          <p>
            Developers will find our{" "}
            <Link href="/developer-tools/" className="text-[var(--fg-brand)] hover:underline">
              developer tools
            </Link>{" "}
            indispensable. Format and validate JSON, encode and decode Base64 strings, generate
            UUIDs, test regular expressions, convert colors between formats, and minify CSS and
            JavaScript. These tools are built with the precision and reliability that developers
            expect.
          </p>
        </div>
      </div>
    </section>
  );
}
