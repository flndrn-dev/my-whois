// Registrar referral configuration. Affiliate codes come from env vars so
// they can be rotated without redeploying. Cloudflare Registrar has no
// affiliate program — listed for credibility / "honest baseline".

export type Registrar = {
  id: "hostinger" | "porkbun" | "cloudflare" | "namecheap";
  name: string;
  blurb: string;
  hasAffiliate: boolean;
  buildSearchUrl: (domain: string) => string;
};

const HOSTINGER_REF = process.env.NEXT_PUBLIC_HOSTINGER_REF ?? "";
const PORKBUN_REF = process.env.NEXT_PUBLIC_PORKBUN_REF ?? "";
const NAMECHEAP_AFF = process.env.NEXT_PUBLIC_NAMECHEAP_AFF ?? "";

export const REGISTRARS: Registrar[] = [
  {
    id: "hostinger",
    name: "Hostinger",
    blurb: "Lowest first-year prices, free WHOIS privacy, EU support",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL("https://www.hostinger.com/domain-checker");
      u.searchParams.set("domain", domain);
      if (HOSTINGER_REF) u.searchParams.set("REFERRALCODE", HOSTINGER_REF);
      return u.toString();
    },
  },
  {
    id: "porkbun",
    name: "Porkbun",
    blurb: "Cheap renewals, no upsells, free WHOIS privacy + URL forwarding",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL("https://porkbun.com/checkout/search");
      u.searchParams.set("q", domain);
      if (PORKBUN_REF) u.searchParams.set("via", PORKBUN_REF);
      return u.toString();
    },
  },
  {
    id: "cloudflare",
    name: "Cloudflare Registrar",
    blurb: "At-cost renewals, no markup, no commissions to anyone",
    hasAffiliate: false,
    buildSearchUrl: () => "https://www.cloudflare.com/products/registrar/",
  },
  {
    id: "namecheap",
    name: "Namecheap",
    blurb: "Largest catalogue, well-known, free WHOIS privacy",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL(
        "https://www.namecheap.com/domains/registration/results/",
      );
      u.searchParams.set("domain", domain);
      if (NAMECHEAP_AFF) u.searchParams.set("affId", NAMECHEAP_AFF);
      return u.toString();
    },
  },
];

// Top alternative TLDs we suggest for any input domain.
export const SUGGEST_TLDS = [
  "com",
  "io",
  "ai",
  "sh",
  "dev",
  "app",
  "co",
  "net",
] as const;

export function rootName(domain: string): string {
  // Strip the public suffix down to the leftmost label.
  // For "example.co.uk" → "example", for "openai.com" → "openai".
  const labels = domain.split(".");
  return labels[0] ?? domain;
}

export function suggestSimilarDomains(
  domain: string,
  excludeTld?: string,
): string[] {
  const root = rootName(domain);
  const skip = excludeTld?.toLowerCase();
  return SUGGEST_TLDS.filter((t) => t !== skip).map((t) => `${root}.${t}`);
}
