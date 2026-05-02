import { NextResponse, type NextRequest } from "next/server";
import { lookupDomain } from "@/lib/lookup";
import {
  ensureWatchlistAudience,
  listWatchlistContacts,
  sendEmail,
} from "@/lib/resend";
import { expiryAlertHtml } from "@/lib/watchlist-emails";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Days-remaining buckets that trigger an alert. The Resend audience has no
// per-contact metadata about which alerts already fired, so we exploit
// these specific bucket boundaries — by checking only on these days, we
// won't double-send within the same bucket. Daily cadence + this bucket
// list = exactly 3 alerts per domain over its expiry approach (30, 14, 7).
const ALERT_DAYS = [30, 14, 7];

type Result = {
  contact: string;
  domain: string;
  daysRemaining: number | null;
  alerted: boolean;
  reason?: string;
};

function authorised(req: NextRequest): boolean {
  const expected = process.env.WATCHLIST_CHECK_TOKEN;
  if (!expected) return false;
  const got = req.headers.get("authorization");
  return got === `Bearer ${expected}`;
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

async function check(): Promise<Result[]> {
  const audienceId = await ensureWatchlistAudience();
  const contacts = await listWatchlistContacts(audienceId);
  const out: Result[] = [];

  for (const c of contacts) {
    const domain = c.first_name?.toLowerCase().trim();
    if (!domain || c.unsubscribed) {
      out.push({
        contact: c.email,
        domain: domain ?? "(none)",
        daysRemaining: null,
        alerted: false,
        reason: c.unsubscribed ? "unsubscribed" : "no-domain",
      });
      continue;
    }

    let snapshot;
    try {
      snapshot = await lookupDomain(domain);
    } catch {
      out.push({
        contact: c.email,
        domain,
        daysRemaining: null,
        alerted: false,
        reason: "lookup-failed",
      });
      continue;
    }

    const expiry = snapshot.info.expirationDate;
    const days = daysUntil(expiry);

    if (days == null || !expiry) {
      out.push({
        contact: c.email,
        domain,
        daysRemaining: null,
        alerted: false,
        reason: "no-expiry-date",
      });
      continue;
    }

    if (!ALERT_DAYS.includes(days)) {
      out.push({
        contact: c.email,
        domain,
        daysRemaining: days,
        alerted: false,
        reason: "outside-alert-window",
      });
      continue;
    }

    try {
      await sendEmail({
        to: c.email,
        subject: `${domain} expires in ${days} days`,
        html: expiryAlertHtml({
          domain,
          expirationDate: expiry,
          daysRemaining: days,
        }),
        text: `${domain} expires in ${days} days (on ${expiry}). Renew through your registrar to keep ownership.`,
      });
      out.push({
        contact: c.email,
        domain,
        daysRemaining: days,
        alerted: true,
      });
    } catch (err) {
      out.push({
        contact: c.email,
        domain,
        daysRemaining: days,
        alerted: false,
        reason: err instanceof Error ? err.message : "send-failed",
      });
    }
  }

  return out;
}

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY not set" },
      { status: 503 },
    );
  }
  if (!authorised(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorised" },
      { status: 401 },
    );
  }
  const results = await check();
  return NextResponse.json({
    ok: true,
    checked: results.length,
    alerted: results.filter((r) => r.alerted).length,
    results,
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
