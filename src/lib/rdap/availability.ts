import { cached } from "../cache";
import { getRdapServersForTld } from "./bootstrap";
import { RdapNotFoundError } from "./query";

export type Availability = "available" | "taken" | "unknown";

const TIMEOUT_MS = 5000;
const TTL = 60 * 60 * 1000; // 1h

async function probeOne(domain: string): Promise<Availability> {
  const tld = domain.split(".").pop()?.toLowerCase() ?? "";
  const servers = await getRdapServersForTld(tld);
  if (servers.length === 0) return "unknown";

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const url = `${servers[0]!.replace(/\/$/, "")}/domain/${encodeURIComponent(domain)}`;
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/rdap+json, application/json",
        "User-Agent": "my-whois.com/1.0 (+https://my-whois.com)",
      },
      next: { revalidate: 3600 },
    });
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    return "unknown";
  } catch {
    return "unknown";
  } finally {
    clearTimeout(timer);
  }
}

export async function checkAvailability(domain: string): Promise<Availability> {
  return cached("availability", domain, TTL, () => probeOne(domain));
}

export async function checkBatch(
  domains: string[],
): Promise<Record<string, Availability>> {
  const results = await Promise.allSettled(
    domains.map(async (d) => [d, await checkAvailability(d)] as const),
  );
  const out: Record<string, Availability> = {};
  for (const r of results) {
    if (r.status === "fulfilled") {
      const [d, a] = r.value;
      out[d] = a;
    }
  }
  for (const d of domains) {
    if (!(d in out)) out[d] = "unknown";
  }
  return out;
}

// quietly suppress lint about unused import — kept for future use
export type { RdapNotFoundError };
