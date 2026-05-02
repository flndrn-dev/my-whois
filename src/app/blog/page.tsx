import type { Metadata } from "next";
import Link from "next/link";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";
import { ContentBreakAd } from "@/components/layout/ContentBreakAd";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — domain hygiene, DNS, SSL, and the WHOIS world",
  description:
    "Long-form posts on DNSSEC, GDPR-redacted WHOIS, SSL certificate chains, domain age, and how to read the data behind any domain.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/feed.xml" },
  },
  openGraph: {
    type: "website",
    title: "my whois — blog",
    description:
      "Long-form posts on DNSSEC, GDPR-redacted WHOIS, SSL certificate chains, domain age, and how to read the data behind any domain.",
    url: "/blog",
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  return (
    <PageWithSideAds wide>
      <article className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          reading
        </p>
        <div className="mt-2 flex items-baseline justify-between gap-6 flex-wrap">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Blog
          </h1>
          <a
            href="/blog/feed.xml"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.18em] text-muted hover:text-accent transition-colors border border-border rounded px-2.5 py-1.5"
            aria-label="RSS feed"
          >
            RSS
          </a>
        </div>
        <p className="mt-4 text-lg text-muted">
          Original writing on domain hygiene, the protocols behind WHOIS and
          DNS, and what the data on every result page actually means.
        </p>

        <ul className="mt-12 space-y-10">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <article>
                <div className="text-xs uppercase tracking-[0.18em] text-muted">
                  {formatDate(post.publishedAt)} · {post.readingMinutes} min
                  read
                </div>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 text-base text-muted leading-relaxed">
                  {post.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono uppercase tracking-wide text-muted bg-surface/60 border border-border rounded px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
                >
                  Read more →
                </Link>
              </article>
              {i === 1 ? <ContentBreakAd className="mt-10" /> : null}
            </li>
          ))}
        </ul>

        {posts.length === 0 ? (
          <p className="mt-10 text-muted">No posts yet — check back soon.</p>
        ) : null}
      </article>
    </PageWithSideAds>
  );
}
