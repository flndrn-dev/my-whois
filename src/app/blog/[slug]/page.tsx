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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-12 mb-4"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="font-display text-xl font-semibold tracking-tight mt-8 mb-3"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="my-5 text-base leading-relaxed" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="my-5 list-disc list-outside pl-6 space-y-2" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="my-5 list-decimal list-outside pl-6 space-y-2" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-accent underline underline-offset-2 hover:no-underline"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="my-6 border-l-2 border-accent/60 pl-4 text-muted italic"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="font-mono text-[0.9em] bg-surface/80 border border-border rounded px-1.5 py-0.5"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-border bg-surface/60 p-4 text-sm font-mono leading-relaxed"
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  void indexnowNotify([siteAbsoluteUrl(`/blog/${post.slug}`)]);

  // Pull two adjacent posts for the "more reading" rail at the foot.
  const all = await getAllPosts();
  const others = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <PageWithSideAds wide>
      <article className="max-w-3xl">
        <div className="mb-2">
          <Link
            href="/blog"
            className="text-xs uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors"
          >
            ← back to blog
          </Link>
        </div>

        <header className="mt-2">
          <div className="text-xs uppercase tracking-[0.18em] text-muted">
            {formatDate(post.publishedAt)} · {post.readingMinutes} min read
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono uppercase tracking-wide text-muted bg-surface/60 border border-border rounded px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-10 prose-invert">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        <ContentBreakAd className="mt-12" />

        {others.length > 0 ? (
          <section className="mt-12 border-t border-border pt-10">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              More reading
            </h2>
            <ul className="mt-4 space-y-4">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block group"
                  >
                    <div className="text-xs uppercase tracking-[0.18em] text-muted">
                      {formatDate(p.publishedAt)} · {p.readingMinutes} min
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold group-hover:text-accent transition-colors">
                      {p.title}
                    </div>
                    <div className="mt-1 text-sm text-muted">
                      {p.description}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
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
