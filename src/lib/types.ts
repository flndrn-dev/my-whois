export type RdapEvent = {
  action: string;
  date: string;
};

export type DnsRecords = {
  a: string[];
  aaaa: string[];
  mx: { exchange: string; priority: number }[];
  ns: string[];
  txt: string[];
  cname: string[];
  soa: { primary: string; serial: number } | null;
  spf: string | null;
  dmarc: string | null;
  dnssec: boolean;
};

export type SslInfo = {
  valid: boolean;
  issuer: string | null;
  subject: string | null;
  validFrom: string | null;
  validTo: string | null;
  daysRemaining: number | null;
  protocol: string | null;
} | null;

export type TechStackChip = {
  category: "cdn" | "dns" | "email" | "server" | "registrar";
  vendor: string;
  icon?: string;
};

export type DomainInfo = {
  domain: string;
  registrar: string | null;
  registrarUrl: string | null;
  registrarIanaId: string | null;
  abuseUrl: string | null;
  whoisServer: string | null;
  rdapServer: string | null;
  status: string[];
  registrationDate: string | null;
  expirationDate: string | null;
  lastChangedDate: string | null;
  nameservers: string[];
  dnssecEnabled: boolean;
  redacted: {
    registrant: boolean;
    admin: boolean;
    tech: boolean;
  };
  source: "rdap" | "whois43" | "unknown";
  raw: unknown;
};

export type HealthBreakdownItem = {
  label: string;
  points: number;
  max: number;
  status: "ok" | "warn" | "fail";
  detail: string;
};

export type HealthScore = {
  score: number;
  tier: "green" | "amber" | "red";
  breakdown: HealthBreakdownItem[];
};

export type DomainSnapshot = {
  domain: string;
  fetchedAt: string;
  info: DomainInfo;
  dns: DnsRecords;
  ssl: SslInfo;
  tech: TechStackChip[];
  health: HealthScore;
  notes: string[];
};
