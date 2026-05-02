import type { Metadata, Viewport } from "next";
import {
  Inter,
  Inter_Tight,
  JetBrains_Mono,
  Instrument_Serif,
  Newsreader,
} from "next/font/google";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsScript } from "@/components/layout/AnalyticsScript";
import { siteJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Editorial display face — high-contrast serif used for blog post titles,
// drop caps, italic accents on key marketing pages. Instrument Serif has a
// distinctive italic that drives the "Field Notes" magazine identity.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif-display",
  display: "swap",
});

// Long-form reading face — variable optical-sizing serif. Used for blog
// post body prose so the reading-mode UI is typographically distinct from
// the lookup tool's UI typography.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-prose",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "my whois — domain lookup with live age & health score",
    template: "%s | my whois",
  },
  description:
    "Look up any domain. See its live age, health score, registrar, DNS records, SSL info, and tech stack — all on one page.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-whois.com"),
  applicationName: "my whois",
  keywords: [
    "whois",
    "domain lookup",
    "domain age",
    "domain health",
    "rdap",
    "dns lookup",
    "ssl checker",
    "tech stack detector",
  ],
  authors: [{ name: "flndrn" }],
  creator: "flndrn",
  publisher: "flndrn",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: "https://my-whois.com",
    siteName: "my whois",
    title: "my whois — domain lookup with live age & health score",
    description:
      "Look up any domain. See its live age, health score, registrar, DNS records, SSL info, and tech stack — all on one page.",
  },
  twitter: {
    card: "summary_large_image",
    title: "my whois — domain lookup with live age & health score",
    description:
      "Look up any domain. See its live age, health score, registrar, DNS records, SSL info, and tech stack — all on one page.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  verification: {
    yandex: "b7d65637565b339f",
    other: {
      "msvalidate.01": "BDE68623F518ADD3CC5723A942105E1C",
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#2b283a" },
  ],
};

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "ca-pub-3928224800312187";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable} ${jetbrains.variable} ${instrumentSerif.variable} ${newsreader.variable}`}
    >
      <head>
        {ADSENSE_CLIENT_ID ? (
          // Raw <script> tag (NOT next/script) so the AdSense crawler sees it
          // in the server-rendered HTML during site verification. next/script
          // with afterInteractive only emits a <link rel="preload">, which
          // AdSense does not accept.
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        ) : null}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
      </head>
      <body className="min-h-dvh flex flex-col antialiased grain-overlay">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AnalyticsScript />
        </Providers>
      </body>
    </html>
  );
}
