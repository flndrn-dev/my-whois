import { NextResponse, type NextRequest } from "next/server";
import { lookupDomain, DomainNotFoundError } from "@/lib/lookup";
import { normalizeDomain } from "@/lib/validate-domain";
import { checkRateLimit, fingerprint } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_DOMAINS = 100;
const CONCURRENCY = 8;

export type BulkRow = {
  input: string;
  domain: string | null;
  ageYears: number | null;
  registrar: string | null;
  expirationDate: string | null;
  daysToExpiry: number | null;
  health: number | null;
  tier: "green" | "amber" | "red" | null;
  ssl: "valid" | "expired" | "missing" | null;
  dnssec: boolean | null;
  error: string | null;
};

function parseInput(input: string | undefined): string[] {
  if (!input) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of input.split(/[\s,;]+/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const lc = trimmed.toLowerCase();
    if (seen.has(lc)) continue;
    seen.add(lc);
    out.push(trimmed);
  }
  return out;
}

function ageYearsFromIso(iso: string | null): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms) || ms < 0) return null;
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25));
}

function daysFromIso(iso: string | null): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

async function runOne(input: string): Promise<BulkRow> {
  const domain = normalizeDomain(input);
  if (!domain) {
    return {
      input,
      domain: null,
      ageYears: null,
      registrar: null,
      expirationDate: null,
      daysToExpiry: null,
      health: null,
      tier: null,
      ssl: null,
      dnssec: null,
      error: "invalid domain",
    };
  }
  try {
    const snap = await lookupDomain(domain);
    return {
      input,
      domain,
      ageYears: ageYearsFromIso(snap.info.registrationDate),
      registrar: snap.info.registrar,
      expirationDate: snap.info.expirationDate,
      daysToExpiry: daysFromIso(snap.info.expirationDate),
      health: snap.health.score,
      tier: snap.health.tier,
      ssl: snap.ssl?.valid
        ? "valid"
        : snap.ssl?.daysRemaining != null
          ? "expired"
          : "missing",
      dnssec: snap.info.dnssecEnabled,
      error: null,
    };
  } catch (err) {
    return {
      input,
      domain,
      ageYears: null,
      registrar: null,
      expirationDate: null,
      daysToExpiry: null,
      health: null,
      tier: null,
      ssl: null,
      dnssec: null,
      error: err instanceof DomainNotFoundError ? "not registered" : "lookup failed",
    };
  }
}

async function pool<T, R>(
  items: T[],
  worker: (t: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  async function next(): Promise<void> {
    const i = cursor++;
    if (i >= items.length) return;
    out[i] = await worker(items[i]);
    await next();
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => next()),
  );
  return out;
}

export async function POST(req: NextRequest) {
  const fp = fingerprint(req.headers);
  const rl = checkRateLimit(`bulk:${fp}`, {
    limit: 6, // 6 bulk lookups per hour per fingerprint
    windowMs: 60 * 60 * 1000,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many bulk lookups from this device. Try again later." },
      { status: 429 },
    );
  }

  let body: { input?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const inputs = parseInput(body.input);
  if (inputs.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Paste at least one domain." },
      { status: 400 },
    );
  }
  if (inputs.length > MAX_DOMAINS) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many domains. Limit is ${MAX_DOMAINS} per request.`,
      },
      { status: 400 },
    );
  }

  const rows = await pool(inputs, runOne, CONCURRENCY);
  return NextResponse.json({ ok: true, count: rows.length, rows });
}
