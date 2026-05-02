const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-whois.com";

export function siteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "my whois",
      url: SITE_URL,
      description:
        "Look up any domain. See its live age, health score, registrar, DNS records, SSL info, and tech stack.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser-based)",
      offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "my whois",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/{domain}`,
        "query-input": "required name=domain",
      },
    },
  ];
}

export function domainPageJsonLd(domain: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${domain} — WHOIS, DNS, SSL, tech stack`,
    url: `${SITE_URL}/${domain}`,
    description: `WHOIS lookup, DNS records, SSL certificate status, and tech-stack detection for ${domain}.`,
    isPartOf: { "@type": "WebSite", name: "my whois", url: SITE_URL },
  };
}

export function comparisonPageJsonLd(a: string, b: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${a} vs ${b} — domain comparison`,
    url: `${SITE_URL}/compare/${a}-vs-${b}`,
    description: `Side-by-side comparison of ${a} and ${b}: age, registrar, DNS, SSL, and tech stack.`,
    author: { "@type": "Organization", name: "my whois" },
  };
}
