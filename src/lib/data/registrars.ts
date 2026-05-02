// Registrar referral configuration. Affiliate codes come from env vars so
// they can be rotated without redeploying. Cloudflare Registrar has no
// affiliate program — listed for credibility / "honest baseline".

export type Registrar = {
  id: string;
  name: string;
  blurb: string;
  hasAffiliate: boolean;
  buildSearchUrl: (domain: string) => string;
};

const HOSTINGER_REF = process.env.NEXT_PUBLIC_HOSTINGER_REF ?? "";
const PORKBUN_REF = process.env.NEXT_PUBLIC_PORKBUN_REF ?? "";
const NAMECHEAP_AFF = process.env.NEXT_PUBLIC_NAMECHEAP_AFF ?? "";
const GODADDY_AFF = process.env.NEXT_PUBLIC_GODADDY_AFF ?? "";
const DYNADOT_REF = process.env.NEXT_PUBLIC_DYNADOT_REF ?? "";
const NAMESILO_RID = process.env.NEXT_PUBLIC_NAMESILO_RID ?? "";
const IONOS_AFF = process.env.NEXT_PUBLIC_IONOS_AFF ?? "";
const SPACESHIP_REF = process.env.NEXT_PUBLIC_SPACESHIP_REF ?? "";
const HOSTGATOR_AFF = process.env.NEXT_PUBLIC_HOSTGATOR_AFF ?? "";
const DREAMHOST_REF = process.env.NEXT_PUBLIC_DREAMHOST_REF ?? "";
const NAMECOM_AFF = process.env.NEXT_PUBLIC_NAMECOM_AFF ?? "";
const HOVER_REF = process.env.NEXT_PUBLIC_HOVER_REF ?? "";

export const REGISTRARS: Registrar[] = [
  {
    id: "hostinger",
    name: "Hostinger",
    blurb: "Up to 60%+ commission, free WHOIS privacy, EU support",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL("https://www.hostinger.com/domain-checker");
      u.searchParams.set("domain", domain);
      if (HOSTINGER_REF) u.searchParams.set("REFERRALCODE", HOSTINGER_REF);
      return u.toString();
    },
  },
  {
    id: "namecheap",
    name: "Namecheap",
    blurb: "20% on domains, 35% on hosting plans, large catalogue",
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
    id: "godaddy",
    name: "GoDaddy",
    blurb: "Up to 15% revenue share via CJ, largest catalogue worldwide",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const base = "https://www.godaddy.com/domainsearch/find";
      const u = new URL(base);
      u.searchParams.set("domainToCheck", domain);
      if (GODADDY_AFF) u.searchParams.set("isc", GODADDY_AFF);
      return u.toString();
    },
  },
  {
    id: "dynadot",
    name: "Dynadot",
    blurb: "Lifetime affiliate commissions + $5 refer-a-friend credits",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL("https://www.dynadot.com/domain/search");
      u.searchParams.set("domain", domain);
      if (DYNADOT_REF) u.searchParams.set("s", DYNADOT_REF);
      return u.toString();
    },
  },
  {
    id: "namesilo",
    name: "NameSilo",
    blurb: "1-year cookie, low renewal price, generous affiliate payout",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL("https://www.namesilo.com/domain/search-domains");
      u.searchParams.set("query", domain);
      if (NAMESILO_RID) u.searchParams.set("rid", NAMESILO_RID);
      return u.toString();
    },
  },
  {
    id: "ionos",
    name: "IONOS",
    blurb: "High commissions on domain + hosting bundles, EU-first",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL("https://www.ionos.com/domains/results");
      u.searchParams.set("domain", domain);
      if (IONOS_AFF) u.searchParams.set("ac", IONOS_AFF);
      return u.toString();
    },
  },
  {
    id: "spaceship",
    name: "Spaceship",
    blurb: "Modern Namecheap sibling, ~25–50% affiliate commission",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL("https://www.spaceship.com/domain-search");
      u.searchParams.set("query", domain);
      if (SPACESHIP_REF) u.searchParams.set("ref", SPACESHIP_REF);
      return u.toString();
    },
  },
  {
    id: "namecom",
    name: "Name.com",
    blurb: "Commission on registrations and hosting, clean dashboard",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL(`https://www.name.com/domain/search/${encodeURIComponent(domain)}`);
      if (NAMECOM_AFF) u.searchParams.set("trackingid", NAMECOM_AFF);
      return u.toString();
    },
  },
  {
    id: "hover",
    name: "Hover",
    blurb: "Refer-a-friend $2 credit each, no upsells, clean UI",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL("https://www.hover.com/domains/results");
      u.searchParams.set("q", domain);
      if (HOVER_REF) u.searchParams.set("ref", HOVER_REF);
      return u.toString();
    },
  },
  {
    id: "dreamhost",
    name: "DreamHost",
    blurb: "Commission on hosting + domain bundles, US-focused",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL("https://www.dreamhost.com/domains/");
      u.searchParams.set("domain", domain);
      if (DREAMHOST_REF) u.searchParams.set("rid", DREAMHOST_REF);
      return u.toString();
    },
  },
  {
    id: "hostgator",
    name: "HostGator",
    blurb: "Per-signup commissions usable for domain registration",
    hasAffiliate: true,
    buildSearchUrl: (domain) => {
      const u = new URL("https://www.hostgator.com/domains");
      u.searchParams.set("domain", domain);
      if (HOSTGATOR_AFF) u.searchParams.set("affiliate", HOSTGATOR_AFF);
      return u.toString();
    },
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    blurb: "At-cost renewals, no markup, no commissions to anyone",
    hasAffiliate: false,
    buildSearchUrl: () => "https://www.cloudflare.com/products/registrar/",
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
