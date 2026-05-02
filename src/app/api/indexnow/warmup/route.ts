import { NextResponse } from "next/server";
import { indexnowNotify, siteAbsoluteUrl } from "@/lib/indexnow";
import { POPULAR_DOMAINS } from "@/lib/data/popular-domains";
import { COMPARISON_PAIRS, pairSlug } from "@/lib/data/comparison-pairs";
import { TLDS } from "@/lib/data/tlds";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

const STATIC_PATHS = ["/", "/blog", "/watchlist", "/about", "/privacy", "/terms"];

// One-shot endpoint that bulk-submits every pre-generated route to IndexNow:
// homepage + popular-domain lookups + all comparison pages + legal pages.
// Call manually after the first deploy:
//   curl -X POST https://my-whois.com/api/indexnow/warmup
// Bing / Yandex / DuckDuckGo / Seznam pick up the URLs from one POST.
export async function POST() {
  const posts = await getAllPosts();
  const urls = [
    ...STATIC_PATHS.map((p) => siteAbsoluteUrl(p)),
    ...POPULAR_DOMAINS.map((d) => siteAbsoluteUrl(`/${d}`)),
    ...COMPARISON_PAIRS.map(([a, b]) =>
      siteAbsoluteUrl(`/compare/${pairSlug(a, b)}`),
    ),
    ...TLDS.map((t) => siteAbsoluteUrl(`/tld/${t.tld}`)),
    ...posts.map((p) => siteAbsoluteUrl(`/blog/${p.slug}`)),
  ];

  const result = await indexnowNotify(urls);
  return NextResponse.json({
    requested: urls.length,
    ...result,
  });
}

// Allow GET as well so the user can warm up from a browser.
export async function GET() {
  return POST();
}
