import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're Offline",
  description: "This page has not been saved for offline use yet.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container-lg max-w-xl text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">You&apos;re offline</h1>
        <p className="text-muted-foreground mb-6">
          This page has not been saved on this device yet. Tools you have opened before keep working without a
          connection, because your files are processed in the browser. Open a tool once while online and it will be
          available offline afterwards.
        </p>
        <Link href="/" className="text-(--fg-brand) font-medium hover:underline">Go to the home page</Link>
      </div>
    </div>
  );
}
