// Domains actively monitored by web-down.com.
//
// When a visitor looks up any of these (or any of their subdomains), the
// MonitoringBand on /[domain] always renders the **monitored variant** —
// green pulsing dot + "Monitored · view dashboard at web-down.com →".
// The cross-promo becomes factual rather than aspirational, so the band
// is always visible and the link is always shown for these domains.
//
// Adding a domain
// ---------------
// 1. Add the apex domain (no protocol, no subdomain) on its own line in
//    the array below. Use lowercase.
//    Example:
//        "yourdomain.com",
// 2. Subdomains match automatically — adding "example.com" makes
//    "www.example.com", "api.example.com", "anything.example.com"
//    all render the monitored variant. You don't need to list each
//    subdomain individually.
// 3. Commit + push. The change ships on the next Dokploy redeploy.
//    Domains take effect immediately for new pageviews; cached pages
//    refresh on their next revalidation cycle (1 h max).
//
// Removing a domain
// -----------------
// Delete the line, push. The domain falls back to the standard A/B-test
// behaviour (40/60 random link/neutral) on the next deploy.

export const MONITORED_DOMAINS: readonly string[] = [
  // Name.com
  "pandit.sh",

  // Namecheap
  "cyberbear.sh",
  "handlr.sh",
  "mavifinans.sh",
  "waypoints.sh",

  // Hostinger
  "web-down.com",
  "my-whois.com",
  "agecheckup.com",
  "typer.tech",
  "briven.tech",
  "briven.cloud",
  "ghostbot.dev",
  "dealdroppr.com",
  "videodj.studio",
  "flndrnwear.com",
  "waypoints.tech",
  "cyclingtravel.cc",
  "murphus.eu",
  "flndrn.com",
  "askklara.com",
  "loowii.com",
  "mavifinans.eu",
  "krypco.eu",
];

/**
 * Returns true if the given domain (or any of its parent zones) is in
 * the monitored list.
 *
 * Match semantics:
 *   - Exact apex match: `example.com` in list → `example.com` matches
 *   - Subdomain match:  `example.com` in list → `www.example.com`,
 *                        `api.example.com`, `deep.sub.example.com` all match
 *   - Non-match:         `notexample.com` ≠ `example.com`
 *
 * Server-safe and synchronous — pure string comparison against a static
 * array, no I/O.
 */
export function isDomainMonitored(domain: string): boolean {
  if (!domain) return false;
  const normalized = domain.toLowerCase().trim();
  return MONITORED_DOMAINS.some((apex) => {
    const a = apex.toLowerCase();
    return normalized === a || normalized.endsWith(`.${a}`);
  });
}
