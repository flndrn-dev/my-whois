import net from "node:net";
import { cached } from "../cache";

const WHOIS_PORT = 43;
const TIMEOUT_MS = 8000;

const TLD_TO_SERVER: Record<string, string> = {
  com: "whois.verisign-grs.com",
  net: "whois.verisign-grs.com",
  org: "whois.publicinterestregistry.org",
  io: "whois.nic.io",
  ai: "whois.nic.ai",
  app: "whois.nic.google",
  dev: "whois.nic.google",
  co: "whois.nic.co",
  uk: "whois.nic.uk",
  de: "whois.denic.de",
  fr: "whois.nic.fr",
  nl: "whois.domain-registry.nl",
  sh: "whois.nic.sh",
  ac: "whois.nic.ac",
  me: "whois.nic.me",
  tv: "whois.nic.tv",
  cc: "whois.nic.cc",
  fm: "whois.nic.fm",
  to: "whois.tonic.to",
  ws: "whois.website.ws",
  is: "whois.isnic.is",
  no: "whois.norid.no",
  se: "whois.iis.se",
  fi: "whois.fi",
  dk: "whois.dk-hostmaster.dk",
  it: "whois.nic.it",
  es: "whois.nic.es",
  pl: "whois.dns.pl",
  ch: "whois.nic.ch",
  at: "whois.nic.at",
  be: "whois.dns.be",
  cz: "whois.nic.cz",
  jp: "whois.jprs.jp",
  cn: "whois.cnnic.cn",
  ru: "whois.tcinet.ru",
  br: "whois.registro.br",
  ca: "whois.cira.ca",
  au: "whois.auda.org.au",
  nz: "whois.srs.net.nz",
  za: "whois.registry.net.za",
  in: "whois.registry.in",
  info: "whois.afilias.net",
  biz: "whois.biz",
  xyz: "whois.nic.xyz",
  online: "whois.nic.online",
  site: "whois.nic.site",
  store: "whois.nic.store",
  shop: "whois.nic.shop",
  tech: "whois.nic.tech",
  blog: "whois.nic.blog",
  news: "whois.nic.news",
  page: "whois.nic.google",
  cloud: "whois.nic.cloud",
  pro: "whois.afilias.net",
};

const IANA_WHOIS = "whois.iana.org";
const REFER_RE = /(?:refer|whois):\s*([\w.-]+)/i;

function tldOf(domain: string) {
  return domain.split(".").pop()?.toLowerCase() ?? "";
}

async function rawWhois(server: string, query: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const socket = net.createConnection({ host: server, port: WHOIS_PORT }, () => {
      socket.write(`${query}\r\n`);
    });
    let buf = "";
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error(`whois43: timeout connecting to ${server}`));
    }, TIMEOUT_MS);
    socket.setEncoding("utf8");
    socket.on("data", (chunk) => {
      buf += chunk;
    });
    socket.on("end", () => {
      clearTimeout(timer);
      resolve(buf);
    });
    socket.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function discoverServer(tld: string): Promise<string | null> {
  return cached("whois-iana-discover", tld, 24 * 60 * 60 * 1000, async () => {
    try {
      const text = await rawWhois(IANA_WHOIS, tld);
      const match = text.match(REFER_RE);
      return match?.[1]?.toLowerCase() ?? null;
    } catch {
      return null;
    }
  });
}

export async function whoisLegacyQuery(domain: string): Promise<string> {
  const tld = tldOf(domain);
  let server = TLD_TO_SERVER[tld];
  if (!server) {
    const discovered = await discoverServer(tld);
    if (!discovered) {
      throw new Error(`whois43: no server known for .${tld}`);
    }
    server = discovered;
  }
  return rawWhois(server, domain);
}

const FIELD_PATTERNS: Record<string, RegExp[]> = {
  registrar: [
    /Registrar:\s*([^\n\r]+)/i,
    /Sponsoring Registrar:\s*([^\n\r]+)/i,
  ],
  created: [
    /Creation Date:\s*([^\n\r]+)/i,
    /Created:\s*([^\n\r]+)/i,
    /created:\s*([^\n\r]+)/i,
    /Registered on:\s*([^\n\r]+)/i,
    /Registration Time:\s*([^\n\r]+)/i,
  ],
  updated: [
    /Updated Date:\s*([^\n\r]+)/i,
    /last-update:\s*([^\n\r]+)/i,
    /Last Modified:\s*([^\n\r]+)/i,
  ],
  expires: [
    /Registry Expiry Date:\s*([^\n\r]+)/i,
    /Registrar Registration Expiration Date:\s*([^\n\r]+)/i,
    /Expiration Date:\s*([^\n\r]+)/i,
    /Expiry Date:\s*([^\n\r]+)/i,
    /paid-till:\s*([^\n\r]+)/i,
  ],
};

export function parseWhoisText(text: string) {
  const get = (key: keyof typeof FIELD_PATTERNS) => {
    for (const re of FIELD_PATTERNS[key] ?? []) {
      const m = text.match(re);
      if (m?.[1]) return m[1].trim();
    }
    return null;
  };
  const nameservers = Array.from(text.matchAll(/Name Server:\s*([^\n\r]+)/gi))
    .map((m) => m[1]?.trim().toLowerCase())
    .filter((v): v is string => Boolean(v));
  const status = Array.from(text.matchAll(/Domain Status:\s*([^\n\r]+)/gi))
    .map((m) => m[1]?.trim())
    .filter((v): v is string => Boolean(v));
  return {
    registrar: get("registrar"),
    created: get("created"),
    updated: get("updated"),
    expires: get("expires"),
    nameservers: Array.from(new Set(nameservers)),
    status,
  };
}
