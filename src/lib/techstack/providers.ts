import type { TechStackChip } from "../types";

type DetectorRule = {
  pattern: RegExp;
  vendor: string;
  category: TechStackChip["category"];
};

export const NS_RULES: DetectorRule[] = [
  { pattern: /\.ns\.cloudflare\.com$/, vendor: "Cloudflare", category: "dns" },
  { pattern: /awsdns-/, vendor: "AWS Route 53", category: "dns" },
  { pattern: /\.googledomains\.com$/, vendor: "Google Cloud DNS", category: "dns" },
  { pattern: /\.googleusercontent\.com$/, vendor: "Google Cloud DNS", category: "dns" },
  { pattern: /\.azure-dns\./, vendor: "Azure DNS", category: "dns" },
  { pattern: /\.domaincontrol\.com$/, vendor: "GoDaddy", category: "dns" },
  { pattern: /\.dnsimple\.com$/, vendor: "DNSimple", category: "dns" },
  { pattern: /\.nsone\.net$/, vendor: "NS1", category: "dns" },
  { pattern: /\.dnsmadeeasy\.com$/, vendor: "DNS Made Easy", category: "dns" },
  { pattern: /\.dynect\.net$/, vendor: "Dyn", category: "dns" },
  { pattern: /\.vercel-dns\.com$/, vendor: "Vercel", category: "dns" },
  { pattern: /\.netlify\.com$/, vendor: "Netlify", category: "dns" },
  { pattern: /\.fastly\.net$/, vendor: "Fastly", category: "dns" },
  { pattern: /\.akam\.net$/, vendor: "Akamai", category: "dns" },
  { pattern: /\.markmonitor\.com$/, vendor: "MarkMonitor", category: "dns" },
];

export const MX_RULES: DetectorRule[] = [
  { pattern: /aspmx\.l\.google\.com$/, vendor: "Google Workspace", category: "email" },
  { pattern: /\.googlemail\.com$/, vendor: "Google Workspace", category: "email" },
  { pattern: /\.mail\.protection\.outlook\.com$/, vendor: "Microsoft 365", category: "email" },
  { pattern: /\.zoho\.com$/, vendor: "Zoho Mail", category: "email" },
  { pattern: /\.zohomail\.com$/, vendor: "Zoho Mail", category: "email" },
  { pattern: /\.fastmail\.com$/, vendor: "Fastmail", category: "email" },
  { pattern: /\.messagingengine\.com$/, vendor: "Fastmail", category: "email" },
  { pattern: /\.protonmail\.ch$/, vendor: "Proton Mail", category: "email" },
  { pattern: /\.iphmx\.com$/, vendor: "Cisco Email Security", category: "email" },
  { pattern: /\.mailgun\.org$/, vendor: "Mailgun", category: "email" },
  { pattern: /\.sendgrid\.net$/, vendor: "SendGrid", category: "email" },
  { pattern: /\.amazonses\.com$/, vendor: "Amazon SES", category: "email" },
  { pattern: /\.improvmx\.com$/, vendor: "ImprovMX", category: "email" },
];

export const HEADER_RULES: { header: string; pattern: RegExp; vendor: string; category: TechStackChip["category"] }[] = [
  { header: "server", pattern: /cloudflare/i, vendor: "Cloudflare", category: "cdn" },
  { header: "cf-ray", pattern: /./, vendor: "Cloudflare", category: "cdn" },
  { header: "x-vercel-cache", pattern: /./, vendor: "Vercel", category: "cdn" },
  { header: "x-vercel-id", pattern: /./, vendor: "Vercel", category: "cdn" },
  { header: "x-served-by", pattern: /cache-/i, vendor: "Fastly", category: "cdn" },
  { header: "x-fastly-request-id", pattern: /./, vendor: "Fastly", category: "cdn" },
  { header: "x-akamai-request-id", pattern: /./, vendor: "Akamai", category: "cdn" },
  { header: "x-amz-cf-id", pattern: /./, vendor: "AWS CloudFront", category: "cdn" },
  { header: "x-azure-ref", pattern: /./, vendor: "Azure CDN", category: "cdn" },
  { header: "x-bunny-request-id", pattern: /./, vendor: "BunnyCDN", category: "cdn" },
  { header: "x-nf-request-id", pattern: /./, vendor: "Netlify", category: "cdn" },
  { header: "server", pattern: /nginx/i, vendor: "nginx", category: "server" },
  { header: "server", pattern: /apache/i, vendor: "Apache", category: "server" },
  { header: "server", pattern: /caddy/i, vendor: "Caddy", category: "server" },
  { header: "server", pattern: /litespeed/i, vendor: "LiteSpeed", category: "server" },
  { header: "x-powered-by", pattern: /express/i, vendor: "Express", category: "server" },
  { header: "x-powered-by", pattern: /next\.js/i, vendor: "Next.js", category: "server" },
];
