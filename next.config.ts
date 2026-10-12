import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {},
  experimental: {
    // Put the (small, Tailwind-generated) CSS straight into each page instead of
    // a render-blocking stylesheet request. PageSpeed measured ~1.3 s saved on mobile;
    // most visitors arrive from search on their first visit, so there is no cache to lose.
    inlineCss: true,
  },
};

export default nextConfig;
