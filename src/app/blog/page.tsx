import type { Metadata } from "next";
import Link from "next/link";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";
import { ContentBreakAd } from "@/components/layout/ContentBreakAd";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Field notes — domain hygiene, DNS, SSL, and the WHOIS world",
  description:
    "Long-form posts on DNSSEC, GDPR-redacted WHOIS, SSL certificate chains, domain age, and how to read the data behind any domain.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/feed.xml" },
  },
  openGraph: {
    type: "website",
    title: "my whois — field notes",
    description:
      "Long-form posts on DNSSEC, GDPR-redacted WHOIS, SSL certificate chains, domain age, and how to read the data behind any domain.",
    url: "/blog",
  },
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const month = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  return `${month} ${d.getDate()}, ${d.getFullYear()}`;
};

const num = (n: number) => n.toString().padStart(2, "0");

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <PageWithSideAds wide>
      <div className="max-w-4xl">
        {/* Masthead */}
        <header className="border-b border-border pb-10">
          <div className="flex items-baseline justify-between gap-6 flex-wrap">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                Vol. 01
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                · {posts.length} {posts.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            <a
              href="/blog/feed.xml"
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted hover:text-accent transition-colors border-b border-transparent hover:border-accent pb-0.5"
              aria-label="RSS feed"
            >
              ⌁ RSS
            </a>
          </div>

          <h1 className="mt-8 font-editorial text-[clamp(3rem,9vw,5.75rem)] leading-[0.95] tracking-tight">
            Field
            <span className="italic text-accent"> notes</span>
            <span className="text-muted">.</span>
          </h1>

          <p className="mt-6 font-prose italic text-lg sm:text-xl text-muted leading-relaxed max-w-2xl">
            Original writing on domain hygiene, the protocols behind WHOIS and
            DNS, and what the data on every result page actually means — for
            people who want to understand, not just look up.
          </p>
        </header>

        {/* Featured */}
        {featured ? (
          <article className="py-12 border-b border-border">
            <div className="grid md:grid-cols-[6rem_1fr] gap-6 md:gap-10">
              <div className="md:pt-3">
                <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                  No.&nbsp;{num(posts.length)}
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Latest
                </div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  {formatDate(featured.publishedAt)}
                  <span className="mx-2 text-border">/</span>
                  {featured.readingMinutes} min
                  <span className="mx-2 text-border">/</span>
                  {featured.tags.join(" · ")}
                </div>

                <h2 className="mt-3 font-editorial text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-tight">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group inline hover:text-accent transition-colors"
                  >
                    {featured.title.split(/(\(.*?\))/).map((part, i) =>
                      part.startsWith("(") ? (
                        <em key={i} className="text-muted not-italic group-hover:text-accent transition-colors">
                          {" "}
                          {part}
                        </em>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                  </Link>
                </h2>

                <p className="mt-5 font-prose italic text-lg text-muted leading-relaxed max-w-2xl">
                  {featured.description}
                </p>

                <Link
                  href={`/blog/${featured.slug}`}
                  className="mt-6 inline-flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 hover:border-accent pb-0.5 transition-colors"
                >
                  Read the piece
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </article>
        ) : null}

        {/* Reading list */}
        {rest.length > 0 ? (
          <section className="py-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-6">
              Reading list
            </div>
            <ul className="divide-y divide-border">
              {rest.map((post, i) => {
                const orderNum = posts.length - 1 - i; // descending issue number
                return (
                  <li key={post.slug}>
                    <article className="py-8 group">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="grid md:grid-cols-[6rem_1fr] gap-4 md:gap-10 items-baseline"
                      >
                        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted group-hover:text-accent transition-colors">
                          No.&nbsp;{num(orderNum)}
                        </div>
                        <div>
                          <h3 className="font-editorial text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.1] tracking-tight group-hover:text-accent transition-colors">
                            {post.title}
                          </h3>
                          <p className="mt-3 font-prose italic text-base text-muted leading-relaxed max-w-2xl">
                            {post.description}
                          </p>
                          <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            {formatDate(post.publishedAt)}
                            <span className="mx-2 text-border">/</span>
                            {post.readingMinutes} min
                            <span className="mx-2 text-border">/</span>
                            {post.tags.join(" · ")}
                          </div>
                        </div>
                      </Link>
                      {i === 0 ? <ContentBreakAd className="mt-10" /> : null}
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {posts.length === 0 ? (
          <p className="mt-10 font-prose italic text-muted">
            No notes filed yet — check back soon.
          </p>
        ) : null}

        <footer className="py-12 border-t border-border">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            ✦ end of issue ✦
          </p>
          <p className="mt-3 font-prose italic text-sm text-muted max-w-xl">
            New entries arrive irregularly — usually when something on the
            data side genuinely deserves longer-than-a-tweet treatment.
          </p>
        </footer>
      </div>
    </PageWithSideAds>
  );
}
