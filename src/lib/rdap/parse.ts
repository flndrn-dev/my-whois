import type { DomainInfo } from "../types";

type RdapEntity = {
  roles?: string[];
  vcardArray?: unknown[];
  entities?: RdapEntity[];
  publicIds?: { type?: string; identifier?: string }[];
};

type RdapNameserver = {
  ldhName?: string;
  unicodeName?: string;
};

type RdapEvent = {
  eventAction?: string;
  eventDate?: string;
};

type RdapResponse = {
  ldhName?: string;
  unicodeName?: string;
  status?: string[];
  events?: RdapEvent[];
  entities?: RdapEntity[];
  nameservers?: RdapNameserver[];
  secureDNS?: { delegationSigned?: boolean };
  notices?: { title?: string; description?: string[] }[];
};

function findEvent(events: RdapEvent[] | undefined, action: string) {
  return events?.find((e) => e.eventAction === action)?.eventDate ?? null;
}

function vcardField(vcard: unknown[] | undefined, key: string): string | null {
  if (!vcard || !Array.isArray(vcard) || vcard.length < 2) return null;
  const props = vcard[1];
  if (!Array.isArray(props)) return null;
  for (const prop of props) {
    if (Array.isArray(prop) && prop[0] === key) {
      const value = prop[3];
      if (typeof value === "string") return value;
      if (Array.isArray(value)) return value.filter(Boolean).join(", ");
    }
  }
  return null;
}

function findRegistrarName(entities: RdapEntity[] | undefined): string | null {
  if (!entities) return null;
  for (const e of entities) {
    if (e.roles?.includes("registrar")) {
      const name = vcardField(e.vcardArray, "fn");
      if (name) return name;
      const id = e.publicIds?.find((p) => p.type === "IANA Registrar ID")
        ?.identifier;
      if (id) return `Registrar IANA #${id}`;
    }
    const nested = findRegistrarName(e.entities);
    if (nested) return nested;
  }
  return null;
}

function entityHasRole(entities: RdapEntity[] | undefined, role: string) {
  if (!entities) return false;
  for (const e of entities) {
    if (e.roles?.includes(role)) return true;
    if (entityHasRole(e.entities, role)) return true;
  }
  return false;
}

export function parseRdap(raw: unknown): Omit<DomainInfo, "source"> {
  const r = (raw ?? {}) as RdapResponse;
  const domain = (r.unicodeName ?? r.ldhName ?? "").toLowerCase();
  const nameservers = (r.nameservers ?? [])
    .map((n) => (n.unicodeName ?? n.ldhName ?? "").toLowerCase())
    .filter(Boolean);
  return {
    domain,
    registrar: findRegistrarName(r.entities),
    status: r.status ?? [],
    registrationDate: findEvent(r.events, "registration"),
    expirationDate: findEvent(r.events, "expiration"),
    lastChangedDate:
      findEvent(r.events, "last changed") ??
      findEvent(r.events, "last update of RDAP database"),
    nameservers,
    dnssecEnabled: !!r.secureDNS?.delegationSigned,
    redacted: {
      registrant: !entityHasRole(r.entities, "registrant"),
      admin: !entityHasRole(r.entities, "administrative"),
      tech: !entityHasRole(r.entities, "technical"),
    },
    raw,
  };
}
