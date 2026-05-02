// Thin Resend REST wrapper. Keeps us off the @resend/resend SDK so the
// bundle stays lean and so we can call it freely from API routes.
//
// Resend audience pattern for the watchlist: ONE audience holds every
// watcher; the watched domain is stored in the contact's `first_name`
// field (Resend contacts don't expose a metadata bag). Hacky but works,
// and makes migration to a proper Convex / Postgres store later a clean
// one-time export.

const API = "https://api.resend.com";

export const WATCHLIST_AUDIENCE_NAME = "Domain Watchlist";

export type ResendContact = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  unsubscribed?: boolean;
};

export type ResendAudience = {
  id: string;
  name: string;
  created_at?: string;
};

function key(): string {
  const k = process.env.RESEND_API_KEY;
  if (!k) throw new Error("RESEND_API_KEY not set");
  return k;
}

function from(): string {
  return process.env.RESEND_FROM ?? "noreply@flndrn.com";
}

function replyTo(): string {
  return process.env.RESEND_REPLY_TO ?? "admin@flndrn.com";
}

async function call<T>(
  path: string,
  init: RequestInit & { method: string },
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key()}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${init.method} ${path} -> ${res.status}: ${body}`);
  }
  return (await res.json()) as T;
}

export async function listAudiences(): Promise<ResendAudience[]> {
  const res = await call<{ data: ResendAudience[] }>("/audiences", {
    method: "GET",
  });
  return res.data ?? [];
}

export async function createAudience(name: string): Promise<ResendAudience> {
  return call<ResendAudience>("/audiences", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

/** Returns the watchlist audience id, creating it once if necessary. */
export async function ensureWatchlistAudience(): Promise<string> {
  const existing = await listAudiences();
  const found = existing.find((a) => a.name === WATCHLIST_AUDIENCE_NAME);
  if (found) return found.id;
  const made = await createAudience(WATCHLIST_AUDIENCE_NAME);
  return made.id;
}

export async function listWatchlistContacts(
  audienceId: string,
): Promise<ResendContact[]> {
  const res = await call<{ data: ResendContact[] }>(
    `/audiences/${audienceId}/contacts`,
    { method: "GET" },
  );
  return res.data ?? [];
}

export async function addWatchlistContact(
  audienceId: string,
  params: { email: string; domain: string },
): Promise<ResendContact> {
  return call<ResendContact>(`/audiences/${audienceId}/contacts`, {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      first_name: params.domain,
      last_name: "watchlist",
      unsubscribed: false,
    }),
  });
}

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(params: SendEmailParams): Promise<void> {
  await call<{ id: string }>("/emails", {
    method: "POST",
    body: JSON.stringify({
      from: `my whois <${from()}>`,
      reply_to: replyTo(),
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text ?? params.subject,
    }),
  });
}
