import type { DomainInfo } from "../types";

type RdapEntity = {
  roles?: string[];
  vcardArray?: unknown[];
  entities?: RdapEntity[];
  publicIds?: { type?: string; identifier?: string }[];
  links?: { rel?: string; href?: string; value?: string }[];
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
  notices?: { title?: string; description?: string[]; links?: { href?: string }[] }[];
  links?: { rel?: string; href?: string }[];
  port43?: string;
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

function findRegistrarEntity(
  entities: RdapEntity[] | undefined,
): RdapEntity | null {
  if (!entities) return null;
  for (const e of entities) {
    if (e.roles?.includes("registrar")) return e;
    const nested = findRegistrarEntity(e.entities);
    if (nested) return nested;
  }
  return null;
}

function findAbuseUrl(entities: RdapEntity[] | undefined): string | null {
  if (!entities) return null;
  for (const e of entities) {
    if (e.roles?.includes("abuse")) {
      const url = vcardField(e.vcardArray, "url");
      if (url) return url;
      const link = e.links?.find((l) => l.href)?.href;
      if (link) return link;
    }
    const nested = findAbuseUrl(e.entities);
    if (nested) return nested;
  }
  return null;
}

function findRegistrarUrl(entity: RdapEntity | null): string | null {
  if (!entity) return null;
  // Prefer vCard "url" property — common in modern RDAP
  const vcardUrl = vcardField(entity.vcardArray, "url");
  if (vcardUrl) return vcardUrl;
  // Fall back to entity.links with rel=about / rel=related
  const linkUrl =
    entity.links?.find((l) => l.rel === "about")?.href ??
    entity.links?.find((l) => l.rel === "related")?.href ??
    entity.links?.[0]?.href ??
    null;
  return linkUrl;
}

function findRegistrarIanaId(entity: RdapEntity | null): string | null {
  if (!entity) return null;
  const id = entity.publicIds?.find((p) => p.type === "IANA Registrar ID")
    ?.identifier;
  return id ?? null;
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
  const registrarEntity = findRegistrarEntity(r.entities);
  const registrarName = registrarEntity
    ? vcardField(registrarEntity.vcardArray, "fn")
    : null;
  const registrarIanaId = findRegistrarIanaId(registrarEntity);
  return {
    domain,
    registrar:
      registrarName ??
      (registrarIanaId ? `Registrar IANA #${registrarIanaId}` : null),
    registrarUrl: findRegistrarUrl(registrarEntity),
    registrarIanaId,
    abuseUrl: findAbuseUrl(r.entities),
    whoisServer: r.port43 ?? null,
    rdapServer: null, // filled by query layer
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
