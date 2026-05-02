import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "my whois" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "my whois — domain lookup with live age & health score",
    description:
      "Look up any domain. See its live age, health score, registrar, DNS records, SSL info, and tech stack — all on one page.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#2b283a" },
  ],
};

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <head>
        {ADSENSE_CLIENT_ID ? (
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
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
      <body className="min-h-dvh flex flex-col antialiased">
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
