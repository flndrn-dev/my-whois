import { cached } from "./cache";
import { resolveAll } from "./dns/resolve";
import { calculateHealthScore } from "./health/score";
import { parseRdap } from "./rdap/parse";
import { queryRdap, RdapNotFoundError } from "./rdap/query";
import { redactDeep } from "./rdap/redact";
import { getCertInfo } from "./ssl/certInfo";
import { detectTechStack } from "./techstack/detect";
import type { DomainInfo, DomainSnapshot } from "./types";
import { normalizeDomain } from "./validate-domain";
import { parseWhoisText, whoisLegacyQuery } from "./whois/legacyQuery";

const SNAPSHOT_TTL = 60 * 60 * 1000; // 1h

export class DomainNotFoundError extends Error {
  constructor(domain: string) {
    super(`Domain not found: ${domain}`);
    this.name = "DomainNotFoundError";
  }
}

export class DomainLookupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainLookupError";
  }
}

function daysBetween(iso: string | null, ref = new Date()) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((d.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
}

async function fetchRegistrationViaRdap(
  domain: string,
): Promise<DomainInfo | null> {
  try {
    const raw = await queryRdap(domain);
    const redacted = redactDeep(raw);
    const parsed = parseRdap(redacted);
    return { ...parsed, source: "rdap" };
  } catch (err) {
    if (err instanceof RdapNotFoundError) throw new DomainNotFoundError(domain);
    return null;
  }
}

async function fetchRegistrationViaWhois43(
  domain: string,
): Promise<DomainInfo | null> {
  try {
    const text = await whoisLegacyQuery(domain);
    if (
      /no match|not found|no entries found|status: free/i.test(text) &&
      !/registrar:/i.test(text)
    ) {
      throw new DomainNotFoundError(domain);
    }
    const parsed = parseWhoisText(text);
    return {
      domain,
      registrar: parsed.registrar,
      status: parsed.status,
      registrationDate: parsed.created,
      expirationDate: parsed.expires,
      lastChangedDate: parsed.updated,
      nameservers: parsed.nameservers,
      dnssecEnabled: /signedDelegation|DNSSEC: yes/i.test(text),
      redacted: { registrant: true, admin: true, tech: true },
      raw: { whoisText: text },
      source: "whois43",
    };
  } catch (err) {
    if (err instanceof DomainNotFoundError) throw err;
    return null;
  }
}

async function fetchRegistration(domain: string): Promise<DomainInfo> {
  const rdap = await fetchRegistrationViaRdap(domain);
  if (rdap) return rdap;
  const legacy = await fetchRegistrationViaWhois43(domain);
  if (legacy) return legacy;
  return {
    domain,
    registrar: null,
    status: [],
    registrationDate: null,
    expirationDate: null,
    lastChangedDate: null,
    nameservers: [],
    dnssecEnabled: false,
    redacted: { registrant: true, admin: true, tech: true },
    raw: null,
    source: "unknown",
  };
}

async function buildSnapshot(domain: string): Promise<DomainSnapshot> {
  const [info, dns, ssl] = await Promise.all([
    fetchRegistration(domain),
    resolveAll(domain),
    getCertInfo(domain),
  ]);

  // Authoritative DNSSEC signal comes from RDAP secureDNS; reflect it on DNS too.
  const mergedDns = { ...dns, dnssec: info.dnssecEnabled };

  // If RDAP didn't return nameservers, fall back to DNS NS records
  const nameservers =
    info.nameservers.length > 0 ? info.nameservers : mergedDns.ns;

  const tech = await detectTechStack(domain, mergedDns);

  const health = calculateHealthScore({
    ssl: ssl ? { valid: ssl.valid, daysRemaining: ssl.daysRemaining } : null,
    dnssec: info.dnssecEnabled,
    spf: !!mergedDns.spf,
    dmarc: !!mergedDns.dmarc,
    nameservers,
    expiryDays: daysBetween(info.expirationDate),
  });

  const notes: string[] = [];
  if (info.source === "whois43") {
    notes.push(
      "Data sourced via legacy WHOIS — some fields may be limited compared to RDAP.",
    );
  }
  if (info.source === "unknown") {
    notes.push(
      "We couldn't reach an authoritative source for this TLD. DNS and SSL details are still shown below.",
    );
  }
  if (info.redacted.registrant) {
    notes.push(
      "Registrant contact data is redacted by the registry (typically GDPR or privacy-by-default).",
    );
  }

  return {
    domain,
    fetchedAt: new Date().toISOString(),
    info: { ...info, nameservers },
    dns: mergedDns,
    ssl,
    tech,
    health,
    notes,
  };
}

export async function lookupDomain(input: string): Promise<DomainSnapshot> {
  const domain = normalizeDomain(input);
  if (!domain) throw new DomainLookupError("Invalid domain name");
  return cached("snapshot", domain, SNAPSHOT_TTL, () => buildSnapshot(domain));
}
