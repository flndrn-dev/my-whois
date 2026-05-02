import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-whois.com";
const SITE_TITLE = "my whois — blog";
const SITE_DESCRIPTION =
  "Long-form posts on DNSSEC, GDPR-redacted WHOIS, SSL certificate chains, domain age, and how to read the data behind any domain.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string): string {
  const d = new Date(iso);
  return d.toUTCString();
}

export async function GET() {
  const posts = await getAllPosts();
  const lastBuild = posts[0]?.publishedAt ?? new Date().toISOString();

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${rfc822(p.publishedAt)}</pubDate>
      <description>${escapeXml(p.description)}</description>
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
