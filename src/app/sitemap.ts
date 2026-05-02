import type { MetadataRoute } from "next";
import { POPULAR_DOMAINS } from "@/lib/data/popular-domains";
import { COMPARISON_PAIRS, pairSlug } from "@/lib/data/comparison-pairs";
import { TLDS } from "@/lib/data/tlds";
import { getAllPosts } from "@/lib/blog";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-whois.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/watchlist`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/bulk`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const popularEntries: MetadataRoute.Sitemap = POPULAR_DOMAINS.map((d) => ({
    url: `${SITE_URL}/${d}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const compareEntries: MetadataRoute.Sitemap = COMPARISON_PAIRS.map(([a, b]) => ({
    url: `${SITE_URL}/compare/${pairSlug(a, b)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const tldEntries: MetadataRoute.Sitemap = TLDS.map((t) => ({
    url: `${SITE_URL}/tld/${t.tld}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const posts = await getAllPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...popularEntries,
    ...compareEntries,
    ...tldEntries,
    ...blogEntries,
  ];
}
