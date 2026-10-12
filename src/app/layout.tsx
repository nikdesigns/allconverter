import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig, defaultOgImages } from "@/lib/seo-utils";
import { AdBlockNotice } from '@/components/ads/AdBlockNotice';
import { MobileAnchorAd } from '@/components/ads/MobileAnchorAd';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { PWAInstallPrompt } from '@/components/layout/PWAInstallPrompt';
import './globals.css';

// Using SF Pro (Apple's system font) via native stack for best performance and native feel on Apple devices.
// Falls back gracefully to other system sans fonts on other platforms. No web font download needed.
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    // Core brand
    'allconverter tools',
    'free online tools',
    'all in one online tools',
    // PDF
    'pdf tools',
    'pdf compressor',
    'pdf merger',
    'pdf splitter',
    'pdf to jpg',
    'jpg to pdf',
    'compress pdf online free',
    'merge pdf online',
    'split pdf online',
    // Image
    'image tools',
    'image compressor',
    'image resizer',
    'compress image online free',
    'jpg to png',
    'png to jpg',
    'png to webp',
    'webp to jpg',
    'background remover',
    'heic to jpg',
    'svg to png',
    'bulk image converter',
    // Audio
    'audio tools',
    'mp3 cutter',
    'audio converter',
    'audio joiner',
    'mp3 to wav',
    // Developer
    'developer tools',
    'json formatter',
    'base64 encoder',
    'url encoder',
    'uuid generator',
    'regex tester',
    'css minifier',
    'json validator',
    'html formatter',
    // Text
    'text tools',
    'word counter',
    'case converter',
    'lorem ipsum generator',
    'character counter',
    // SEO
    'seo tools',
    'meta tag generator',
    'robots txt generator',
    'keyword density checker',
    'sitemap generator',
    'faq schema generator',
    'redirect checker',
    // Calculators
    'calculators',
    'bmi calculator',
    'age calculator',
    'compound interest calculator',
    'loan calculator',
    'date calculator',
    'timezone converter',
    'percentage calculator',
    // AI
    'ai tools',
    'ai content generator',
    'ai cover letter',
    'ai blog writer',
    // Business
    'business tools',
    'invoice generator',
    'gst invoice',
    'expense tracker',
    // Unit converters
    'unit converters',
    'length converter',
    'weight converter',
    'temperature converter',
    // Value props
    'no sign up',
    'no registration',
    'browser based',
    '100% free',
    'no file upload',
    'file converter',
    'online converter',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    other: {
      'msvalidate.01': '17312e26fdd14193a4d15a11856afcb0',
    },
  },
  // No title/description/url here on purpose: Next fills og:title and
  // og:description from each page's own metadata, and twitter:* from its
  // Open Graph block. Setting them here made every page without its own
  // override inherit the homepage's values.
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    images: defaultOgImages,
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitter,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} min-h-screen flex flex-col antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${siteConfig.url}/#organization`,
                  name: siteConfig.name,
                  alternateName: 'AllConverter',
                  url: siteConfig.url,
                  logo: {
                    '@type': 'ImageObject',
                    '@id': `${siteConfig.url}/#logo`,
                    url: `${siteConfig.url}/icon-512.png`,
                    contentUrl: `${siteConfig.url}/icon-512.png`,
                    caption: siteConfig.name,
                  },
                  description: siteConfig.description,
                  email: 'support@allconverter.tools',
                  foundingDate: '2024',
                  founder: {
                    '@type': 'Person',
                    '@id': `${siteConfig.url}/#founder`,
                    name: 'Nitin Kaushik',
                    jobTitle: 'Founder',
                    url: `${siteConfig.url}/about/`,
                  },
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Mumbai',
                    addressRegion: 'Maharashtra',
                    addressCountry: 'IN',
                  },
                  sameAs: [
                    'https://twitter.com/allconvertertools',
                    'https://github.com/allconvertertools',
                  ],
                  knowsAbout: [
                    'PDF conversion tools',
                    'Image editing and compression',
                    'Developer utilities',
                    'SEO tools',
                    'AI content generation',
                    'Online calculators',
                    'Business document tools',
                    'Audio conversion tools',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': `${siteConfig.url}/#website`,
                  url: siteConfig.url,
                  name: siteConfig.name,
                  // How people actually search for the site ("all converter").
                  alternateName: ['All Converter', 'AllConverter'],
                  description: siteConfig.description,
                  inLanguage: 'en',
                  publisher: { '@id': `${siteConfig.url}/#organization` },
                },
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Header />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">{children}</main>
          <Footer />
          <Toaster />
          <AdBlockNotice />
          <MobileAnchorAd />
          <CommandPalette />
          <PWAInstallPrompt />
        </ThemeProvider>

        {/* Ads and analytics load only in production builds, so local development and
            testing never count as visits or ad impressions. */}
        {process.env.NODE_ENV === "production" && (<>
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6648091987919638"
          // After the page has loaded: the ad script was ~300 ms of main-thread work
          // competing with the tool itself during start-up.
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y2VB10R753"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // Only the live site reports: a local production preview stays out of the stats.
            if (location.hostname === 'allconverter.tools') {
              gtag('config', 'G-Y2VB10R753', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            }
          `}
        </Script>
        </>)}
      </body>
    </html>
  );
}
