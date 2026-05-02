// IndexNow distribution endpoint — fans out to Bing, Yandex, DuckDuckGo,
// Seznam, and any other participant in one call.
const ENDPOINT = "https://api.indexnow.org/indexnow";

// Default key matches /public/d2f1ce1be913e14b18a411ad07dd05f6.txt so
// notifications work without env config. Override INDEXNOW_KEY only if you
// regenerate the public ownership file too.
const DEFAULT_INDEXNOW_KEY = "d2f1ce1be913e14b18a411ad07dd05f6";

// Spec: up to 10 000 URLs per POST.
const MAX_URLS_PER_REQUEST = 10_000;

// In-memory dedupe so the same URL isn't submitted more than once per hour
// even if its page is rendered repeatedly. Prevents 429 (rate-limit) errors.
const DEDUPE_TTL_MS = 60 * 60 * 1000;
const recentSubmissions = new Map<string, number>();

function pruneRecent(now: number) {
  for (const [url, ts] of recentSubmissions) {
    if (now - ts > DEDUPE_TTL_MS) recentSubmissions.delete(url);
  }
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-whois.com";
}

export type IndexNowResult =
  | { ok: true; submitted: number; status: number }
  | { ok: false; reason: string; status?: number };

export async function indexnowNotify(urls: string[]): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY ?? DEFAULT_INDEXNOW_KEY;
  if (!key) return { ok: false, reason: "no-key" };

  const base = siteUrl().replace(/\/$/, "");
  const host = new URL(base).host;
  const now = Date.now();
  pruneRecent(now);

  const fresh = urls.filter((u) => {
    const last = recentSubmissions.get(u);
    return last == null || now - last > DEDUPE_TTL_MS;
  });
  if (fresh.length === 0) return { ok: false, reason: "all-deduped" };

  const batch = fresh.slice(0, MAX_URLS_PER_REQUEST);

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${base}/${key}.txt`,
        urlList: batch,
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    if (res.ok || res.status === 202) {
      for (const u of batch) recentSubmissions.set(u, now);
      return { ok: true, submitted: batch.length, status: res.status };
    }
    return { ok: false, reason: `http-${res.status}`, status: res.status };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "unknown",
    };
  }
}

export function siteAbsoluteUrl(path: string): string {
  const base = siteUrl().replace(/\/$/, "");
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
