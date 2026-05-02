import { NextResponse } from "next/server";
import { lookupDomain, DomainNotFoundError, DomainLookupError } from "@/lib/lookup";
import { checkRateLimit, fingerprint } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const revalidate = 3600;

const API_LIMIT = 60; // requests
const API_WINDOW_MS = 60 * 1000; // per minute

export async function GET(
  req: Request,
  { params }: { params: Promise<{ domain: string }> },
) {
  const fp = fingerprint(req.headers);
  const limit = checkRateLimit(`api:lookup:${fp}`, {
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
  try {
    const snapshot = await lookupDomain(decodeURIComponent(raw));
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600",
        "X-RateLimit-Limit": String(API_LIMIT),
        "X-RateLimit-Remaining": String(limit.remaining),
        "X-RateLimit-Reset": String(Math.ceil(limit.resetAt / 1000)),
      },
    });
  } catch (err) {
    if (err instanceof DomainNotFoundError) {
      return NextResponse.json(
        { error: "domain_not_found", domain: raw },
        { status: 404 },
      );
    }
    if (err instanceof DomainLookupError) {
      return NextResponse.json(
        { error: "invalid_domain", domain: raw },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "lookup_failed", message: (err as Error).message },
      { status: 502 },
    );
  }
}
