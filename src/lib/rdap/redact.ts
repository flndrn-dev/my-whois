const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const IPV4_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
const IPV6_RE = /\b[0-9a-fA-F:]{2,}:[0-9a-fA-F:]+\b/g;

const HIDDEN = "(hidden)";

export function redactString(input: string): string {
  return input
    .replace(EMAIL_RE, HIDDEN)
    .replace(IPV4_RE, HIDDEN)
    .replace(IPV6_RE, (m) => (m.includes(":") && m.split(":").length >= 3 ? HIDDEN : m));
}

export function redactDeep<T>(value: T): T {
  if (value == null) return value;
  if (typeof value === "string") return redactString(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => redactDeep(v)) as unknown as T;
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      // strip known IP fields entirely on nameserver objects
      if (k === "ipAddresses") continue;
      out[k] = redactDeep(v);
    }
    return out as T;
  }
  return value;
}
