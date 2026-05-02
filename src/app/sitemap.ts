import type { MetadataRoute } from "next";
import { POPULAR_DOMAINS } from "@/lib/data/popular-domains";
import { COMPARISON_PAIRS, pairSlug } from "@/lib/data/comparison-pairs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-whois.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
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

  return [...staticEntries, ...popularEntries, ...compareEntries];
}
