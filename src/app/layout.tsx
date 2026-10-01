import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { BookingDialog } from "@/components/booking/booking-dialog";
import { SpotlightTracker } from "@/components/motion/spotlight-tracker";
import { site } from "@/content/site";
import { OG_IMAGE } from "@/content/metadata";
import "./globals.css";

const sans = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  // Only the italic is used (the <Accent> in headlines)
  style: "italic",
});
// Mono is only used for small labels, never the headline: don't let it compete
// with the headline's fonts for early bandwidth
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Software engineering, AI & dedicated teams`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    images: [OG_IMAGE],
  },
  // Inherited by every page; the twitter image falls back to the OG image
  twitter: { card: "summary_large_image" },
};

// Only established facts: no postal addresses until confirmed
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon.png`,
  email: site.email,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#1a2136",
};

// Marks the document as JS-enabled before first paint so scroll-reveal
// styles apply without a flash; without JS all content stays visible.
const JS_FLAG = `document.documentElement.classList.add("js")`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-lime px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <RevealObserver />
        <BookingDialog />
        <SpotlightTracker />
        <Analytics />
      </body>
    </html>
  );
}
