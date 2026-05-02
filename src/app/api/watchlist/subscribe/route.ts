import { NextResponse, type NextRequest } from "next/server";
import { lookupDomain, DomainNotFoundError } from "@/lib/lookup";
import { normalizeDomain } from "@/lib/validate-domain";
import { checkRateLimit, fingerprint } from "@/lib/rate-limit";
import {
  addWatchlistContact,
  ensureWatchlistAudience,
  sendEmail,
} from "@/lib/resend";
import { confirmationEmailHtml } from "@/lib/watchlist-emails";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Watchlist is not currently accepting signups." },
      { status: 503 },
    );
  }

  const fp = fingerprint(req.headers);
  const rl = checkRateLimit(`watchlist:${fp}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000, // 5 signups per hour per fingerprint
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many signups from this device. Try again later." },
      { status: 429 },
    );
  }

  let body: { email?: string; domain?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const domainInput = (body.domain ?? "").trim();
  const domain = normalizeDomain(domainInput);

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (!domain) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid domain (e.g. example.com)." },
      { status: 400 },
    );
  }

  let snapshot;
  try {
    snapshot = await lookupDomain(domain);
  } catch (err) {
    if (err instanceof DomainNotFoundError) {
      return NextResponse.json(
        {
          ok: false,
          error: `${domain} doesn't appear to be registered. Nothing to watch.`,
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't reach the registry to verify this domain right now. Try again in a minute.",
      },
      { status: 502 },
    );
  }

  try {
    const audienceId = await ensureWatchlistAudience();
    await addWatchlistContact(audienceId, { email, domain });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { ok: false, error: `Couldn't save the subscription: ${msg}` },
      { status: 502 },
    );
  }

  const expirationDate = snapshot.info.expirationDate;
  const daysRemaining = daysUntil(expirationDate);

  try {
    await sendEmail({
      to: email,
      subject: `You're watching ${domain}`,
      html: confirmationEmailHtml({
        domain,
        expirationDate,
        daysRemaining,
      }),
      text: `You're on the watchlist for ${domain}. We'll email you 30, 14, and 7 days before it expires. ${
        expirationDate
          ? `Current expiry: ${expirationDate}.`
          : "Expiry date wasn't in the public record yet, we'll keep checking."
      }`,
    });
  } catch {
    // Subscription saved even if confirmation email fails. Log and proceed.
  }

  return NextResponse.json({
    ok: true,
    domain,
    expirationDate,
    daysRemaining,
  });
}
