import type { DnsRecords, TechStackChip } from "../types";
import { HEADER_RULES, MX_RULES, NS_RULES } from "./providers";

const TIMEOUT_MS = 6000;

async function fetchHeaders(domain: string): Promise<Headers | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    // HEAD requests sometimes get blocked or 405 — fall back to GET range.
    const tryHead = await fetch(`https://${domain}`, {
      method: "HEAD",
      redirect: "follow",
      signal: ctrl.signal,
    }).catch(() => null);
    if (tryHead) return tryHead.headers;
    const get = await fetch(`https://${domain}`, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { Range: "bytes=0-0" },
    }).catch(() => null);
    return get?.headers ?? null;
  } finally {
    clearTimeout(timer);
  }
}

function dedupe(chips: TechStackChip[]) {
  const seen = new Set<string>();
  const out: TechStackChip[] = [];
  for (const chip of chips) {
    const key = `${chip.category}::${chip.vendor}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(chip);
  }
  return out;
}

export async function detectTechStack(
  domain: string,
  dns: DnsRecords,
): Promise<TechStackChip[]> {
  const chips: TechStackChip[] = [];

  for (const ns of dns.ns) {
    for (const rule of NS_RULES) {
      if (rule.pattern.test(ns)) {
        chips.push({ category: rule.category, vendor: rule.vendor });
      }
    }
  }

  for (const m of dns.mx) {
    for (const rule of MX_RULES) {
      if (rule.pattern.test(m.exchange)) {
        chips.push({ category: rule.category, vendor: rule.vendor });
      }
    }
  }

  const headers = await fetchHeaders(domain);
  if (headers) {
    for (const rule of HEADER_RULES) {
      const value = headers.get(rule.header);
      if (value && rule.pattern.test(value)) {
        chips.push({ category: rule.category, vendor: rule.vendor });
      }
    }
  }

  return dedupe(chips).slice(0, 8);
}
