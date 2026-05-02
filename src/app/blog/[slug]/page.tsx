import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";
import { ContentBreakAd } from "@/components/layout/ContentBreakAd";
import { getAllPosts, getAllSlugs, getPost } from "@/lib/blog";
import { indexnowNotify, siteAbsoluteUrl } from "@/lib/indexnow";

type Params = { slug: string };

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const month = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  return `${month} ${d.getDate()}, ${d.getFullYear()}`;
};

const num = (n: number) => n.toString().padStart(2, "0");

// Empty MDX components object — all styling lives in the .editorial-prose
// class on the wrapper, so the underlying HTML elements pick up cohesive
// editorial typography without per-element overrides.
const mdxComponents = {};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  void indexnowNotify([siteAbsoluteUrl(`/blog/${post.slug}`)]);

  const all = await getAllPosts();
  const others = all.filter((p) => p.slug !== post.slug).slice(0, 2);
  const issueNumber = all.length - all.findIndex((p) => p.slug === post.slug);

  return (
    <PageWithSideAds wide>
      <article className="max-w-2xl mx-auto">
        {/* Top tag-line — issue number + back link */}
        <div className="flex items-baseline justify-between gap-6 pb-8 border-b border-border">
          <Link
            href="/blog"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted hover:text-accent transition-colors"
          >
            ← Field notes
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            No.&nbsp;{num(issueNumber)}
          </span>
        </div>

        {/* Header — date eyebrow, big editorial title, italic description */}
        <header className="pt-12 pb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            {formatDate(post.publishedAt)}
            <span className="mx-2 text-border">/</span>
            {post.readingMinutes} min read
          </div>

          <h1 className="mt-6 font-editorial text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98] tracking-[-0.015em]">
            {post.title}
          </h1>

          <p className="mt-8 font-prose italic text-xl sm:text-2xl text-muted leading-[1.45] max-w-xl">
            {post.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            <span>Filed under</span>
            {post.tags.map((tag, i) => (
              <span key={tag} className="flex items-center">
                <span className="text-accent">{tag}</span>
                {i < post.tags.length - 1 ? (
                  <span className="ml-3 text-border">·</span>
                ) : null}
              </span>
            ))}
          </div>
        </header>

        {/* Decorative rule before body */}
        <div className="editorial-rule" aria-hidden="true">
          <span className="ornament">✦</span>
        </div>

        {/* Body prose */}
        <div className="editorial-prose">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* Closing decorative rule */}
        <div className="editorial-rule mt-16" aria-hidden="true">
          <span className="ornament">∎</span>
        </div>

        <ContentBreakAd className="my-12" />

        {/* "Continue reading" — editorial 2-up */}
        {others.length > 0 ? (
          <section className="mt-12 pt-10 border-t border-border">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
              Continue reading
            </div>
            <div className="grid sm:grid-cols-2 gap-10">
              {others.map((p, i) => {
                const orderNum =
                  all.length - all.findIndex((x) => x.slug === p.slug);
                return (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group block"
                  >
                    <div className="flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                      <span className="text-accent">No.&nbsp;{num(orderNum)}</span>
                      <span className="text-border">/</span>
                      <span>{formatDate(p.publishedAt)}</span>
                    </div>
                    <h3 className="mt-3 font-editorial text-[clamp(1.35rem,2.5vw,1.75rem)] leading-[1.1] tracking-tight group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-3 font-prose italic text-sm text-muted leading-relaxed">
                      {p.description}
                    </p>
                    {i < others.length - 1 ? null : null}
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </article>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            mainEntityOfPage: siteAbsoluteUrl(`/blog/${post.slug}`),
            keywords: post.tags.join(", "),
            author: { "@type": "Organization", name: "my whois" },
            publisher: {
              "@type": "Organization",
              name: "my whois",
              logo: {
                "@type": "ImageObject",
                url: siteAbsoluteUrl("/logo.svg"),
              },
            },
          }),
        }}
      />
    </PageWithSideAds>
  );
}
