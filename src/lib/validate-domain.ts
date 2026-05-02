const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function normalizeDomain(input: string): string | null {
  if (!input) return null;
  let value = input.trim().toLowerCase();
  // strip protocol
  value = value.replace(/^https?:\/\//, "");
  // strip user info
  value = value.split("@").pop() ?? "";
  // strip path / query / fragment
  value = value.split("/")[0]!.split("?")[0]!.split("#")[0]!;
  // strip port
  value = value.split(":")[0]!;
  // strip trailing dot
  value = value.replace(/\.$/, "");
  // strip leading 'www.' (canonicalize)
  value = value.replace(/^www\./, "");

  if (!DOMAIN_RE.test(value)) return null;
  // reject IP-like strings
  if (/^\d+\.\d+\.\d+\.\d+$/.test(value)) return null;
  // reject localhost-like
  if (value === "localhost") return null;
  if (value.endsWith(".local") || value.endsWith(".internal")) return null;
  return value;
}

export function getTld(domain: string): string {
  const parts = domain.split(".");
  return parts[parts.length - 1] ?? "";
}
