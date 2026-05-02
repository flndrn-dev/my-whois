import { cached } from "../cache";

type IanaBootstrap = {
  services: [string[], string[]][];
  publication: string;
  version: string;
};

const IANA_BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json";
const TTL = 24 * 60 * 60 * 1000; // 24h

let tldMap: Map<string, string[]> | null = null;

async function loadBootstrap(): Promise<IanaBootstrap> {
  return cached("iana-bootstrap", "v1", TTL, async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(IANA_BOOTSTRAP_URL, {
        signal: ctrl.signal,
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 },
      });
      if (!res.ok) throw new Error(`IANA bootstrap HTTP ${res.status}`);
      return (await res.json()) as IanaBootstrap;
    } finally {
      clearTimeout(timer);
    }
  });
}

async function getTldMap(): Promise<Map<string, string[]>> {
  if (tldMap) return tldMap;
  const data = await loadBootstrap();
  const map = new Map<string, string[]>();
  for (const [tlds, servers] of data.services) {
    for (const tld of tlds) {
      map.set(tld.toLowerCase(), servers);
    }
  }
  tldMap = map;
  return map;
}

export async function getRdapServersForTld(tld: string): Promise<string[]> {
  const map = await getTldMap();
  return map.get(tld.toLowerCase()) ?? [];
}
