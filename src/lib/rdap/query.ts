import { getRdapServersForTld } from "./bootstrap";
import { getTld } from "../validate-domain";

const TIMEOUT_MS = 8000;

export class RdapNotFoundError extends Error {
  constructor(domain: string) {
    super(`RDAP: domain not found: ${domain}`);
    this.name = "RdapNotFoundError";
  }
}

export class RdapUnavailableError extends Error {
  constructor(tld: string) {
    super(`RDAP: no server registered for TLD: .${tld}`);
    this.name = "RdapUnavailableError";
  }
}

async function fetchOne(server: string, domain: string): Promise<unknown> {
  const base = server.replace(/\/$/, "");
  const url = `${base}/domain/${encodeURIComponent(domain)}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/rdap+json, application/json",
        "User-Agent": "my-whois.com/1.0 (+https://my-whois.com)",
      },
      next: { revalidate: 3600 },
    });
    if (res.status === 404) throw new RdapNotFoundError(domain);
    if (!res.ok) throw new Error(`RDAP HTTP ${res.status} from ${base}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function queryRdap(domain: string): Promise<unknown> {
  const tld = getTld(domain);
  const servers = await getRdapServersForTld(tld);
  if (servers.length === 0) throw new RdapUnavailableError(tld);

  let lastError: unknown = null;
  for (const server of servers) {
    try {
      return await fetchOne(server, domain);
    } catch (err) {
      if (err instanceof RdapNotFoundError) throw err;
      lastError = err;
    }
  }
  throw lastError ?? new Error("RDAP: all servers failed");
}
