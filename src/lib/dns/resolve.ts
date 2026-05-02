import dns from "node:dns/promises";
import type { DnsRecords } from "../types";

const TIMEOUT_MS = 8000;

async function withTimeout<T>(p: Promise<T>, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout | null = null;
  try {
    const winner = await Promise.race([
      p.catch(() => fallback),
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), TIMEOUT_MS);
      }),
    ]);
    return winner;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function resolveAll(domain: string): Promise<DnsRecords> {
  const [a, aaaa, mxRaw, ns, txtRaw, cname, soa, dmarcRaw] = await Promise.all([
    withTimeout(dns.resolve4(domain).catch(() => []), [] as string[]),
    withTimeout(dns.resolve6(domain).catch(() => []), [] as string[]),
    withTimeout(
      dns.resolveMx(domain).catch(() => []),
      [] as { exchange: string; priority: number }[],
    ),
    withTimeout(dns.resolveNs(domain).catch(() => []), [] as string[]),
    withTimeout(dns.resolveTxt(domain).catch(() => []), [] as string[][]),
    withTimeout(dns.resolveCname(domain).catch(() => []), [] as string[]),
    withTimeout(
      dns.resolveSoa(domain).catch(() => null),
      null as null | { nsname: string; serial: number },
    ),
    withTimeout(
      dns.resolveTxt(`_dmarc.${domain}`).catch(() => []),
      [] as string[][],
    ),
  ]);

  const txtFlat = txtRaw.map((row) => row.join(""));
  const dmarcFlat = dmarcRaw.map((row) => row.join(""));
  const spf =
    txtFlat.find((row) => /^v=spf1/i.test(row.trim())) ?? null;
  const dmarc =
    dmarcFlat.find((row) => /^v=dmarc1/i.test(row.trim())) ?? null;

  return {
    a,
    aaaa,
    mx: mxRaw.map((m) => ({ exchange: m.exchange.toLowerCase(), priority: m.priority })),
    ns: ns.map((n) => n.toLowerCase()),
    txt: txtFlat,
    cname,
    soa: soa ? { primary: soa.nsname, serial: soa.serial } : null,
    spf,
    dmarc,
    dnssec: false, // RDAP secureDNS is the source of truth — overridden later
  };
}
