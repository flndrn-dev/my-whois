const ENDPOINT = "https://api.indexnow.org/indexnow";

export async function indexnowNotify(urls: string[]): Promise<boolean> {
  const key = process.env.INDEXNOW_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-whois.com";
  if (!key || urls.length === 0) return false;
  const host = new URL(siteUrl).host;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${siteUrl.replace(/\/$/, "")}/${key}.txt`,
        urlList: urls,
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}
