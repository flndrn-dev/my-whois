import { NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/cache";
import { checkRateLimit, fingerprint } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Proxies a real-time "is this domain on web-down.com?" check.
//
// Single source of truth: the upstream /api/check endpoint on
// web-down.com. If WEBDOWN_CHECK_URL is unset, every response is
// monitored=false with source=fallback (lets the A/B band fall
// through). Anything else is forwarded as-is, with short TTLs so a
// newly-monitored domain shows up within minutes.
//
// Configure via env on Dokploy:
//   WEBDOWN_CHECK_URL=https://web-down.com/api/check?domain={domain}
//   WEBDOWN_API_KEY=<shared secret matching MYWHOIS_API_KEY on web-down>
//
// The {domain} placeholder is replaced with the URL-encoded apex.
// Expected upstream response: 200 with JSON `{ monitored: boolean }`.
// Any other status, parse error, or timeout is treated as not monitored.

const REMOTE_TIMEOUT_MS = 2500;
const TTL_MONITORED_MS = 60 * 60 * 1000; // 1h
const TTL_NOT_MONITORED_MS = 5 * 60 * 1000; // 5m — short so newly-added domains pick up fast
const API_LIMIT = 120;
const API_WINDOW_MS = 60 * 1000;

const DOMAIN_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

type CheckResult = {
  monitored: boolean;
  source: "remote" | "fallback";
};

async function remoteCheck(domain: string): Promise<boolean | null> {
  const template = process.env.WEBDOWN_CHECK_URL;
  if (!template) return null;

  const url = template.replace("{domain}", encodeURIComponent(domain));
  const apiKey = process.env.WEBDOWN_API_KEY;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS);

  const headers: Record<string, string> = { Accept: "application/json" };
  if (apiKey) headers["X-Api-Key"] = apiKey;

  try {
    const res = await fetch(url, { signal: controller.signal, headers });
    if (!res.ok) return false;
    const data = (await res.json()) as { monitored?: unknown };
    return data.monitored === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ domain: string }> },
) {
  const fp = fingerprint(req.headers);
  const limit = checkRateLimit(`api:is-monitored:${fp}`, {
    limit: API_LIMIT,
    windowMs: API_WINDOW_MS,
  });
  if (!limit.allowed) {
    const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "rate_limited", retryAfterSeconds: retryAfter },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(API_LIMIT),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(limit.resetAt / 1000)),
        },
      },
    );
  }

  const { domain: raw } = await params;
  const domain = decodeURIComponent(raw).toLowerCase().trim();

  if (!DOMAIN_RE.test(domain)) {
    return NextResponse.json(
      { error: "invalid_domain", domain: raw },
      { status: 400 },
    );
  }

  const cached = cacheGet<CheckResult>("is-monitored", domain);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  }

  const remote = await remoteCheck(domain);
  const result: CheckResult =
    remote === null
      ? { monitored: false, source: "fallback" }
      : { monitored: remote, source: "remote" };

  cacheSet(
    "is-monitored",
    domain,
    result,
    result.monitored ? TTL_MONITORED_MS : TTL_NOT_MONITORED_MS,
  );

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}
