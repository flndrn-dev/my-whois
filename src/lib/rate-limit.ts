import { createHash } from "node:crypto";

// Simple in-memory sliding-window rate limiter.
// We never persist or log the IP itself — only a short hash (16 hex chars)
// of IP + UA + a per-process salt, which can't be reversed to the original
// IP without the salt + a brute-force pass.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const SALT = createHash("sha256")
  .update(`${process.pid}-${Date.now()}-${Math.random()}`)
  .digest("hex")
  .slice(0, 32);

const DEFAULT_LIMIT = 60;
const DEFAULT_WINDOW_MS = 60 * 1000;

export function fingerprint(headers: Headers): string {
  const ip =
    headers.get("cf-connecting-ip") ??
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anon";
  const ua = headers.get("user-agent") ?? "unknown";
  return createHash("sha256")
    .update(`${SALT}|${ip}|${ua}`)
    .digest("hex")
    .slice(0, 16);
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(
  key: string,
  opts: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const limit = opts.limit ?? DEFAULT_LIMIT;
  const windowMs = opts.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || b.resetAt <= now) {
    const reset = now + windowMs;
    buckets.set(key, { count: 1, resetAt: reset });
    return { allowed: true, remaining: limit - 1, resetAt: reset };
  }

  b.count += 1;
  return {
    allowed: b.count <= limit,
    remaining: Math.max(0, limit - b.count),
    resetAt: b.resetAt,
  };
}

// Periodic cleanup so buckets don't grow unbounded under abuse.
const CLEANUP_INTERVAL = 5 * 60 * 1000;
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets) {
      if (v.resetAt < now) buckets.delete(k);
    }
  }, CLEANUP_INTERVAL).unref?.();
}
