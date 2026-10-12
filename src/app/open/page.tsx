import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo-utils";
import { OpenFileClient } from "./OpenFileClient";

export const metadata: Metadata = {
  title: "Open a File",
  description: "Pick a PDF, image or audio file and choose what to do with it. Files stay on your device.",
  alternates: { canonical: `${siteConfig.url}/open/` },
  // A utility entry point for the installed app, not a content page.
  robots: { index: false, follow: true },
};

export default function OpenPage() {
  return <OpenFileClient />;
}
