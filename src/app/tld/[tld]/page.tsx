import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";
import { ContentBreakAd } from "@/components/layout/ContentBreakAd";
import { DomainInput } from "@/components/lookup/DomainInput";
import { getTld, TLDS } from "@/lib/data/tlds";
import { REGISTRARS } from "@/lib/data/registrars";
import { indexnowNotify, siteAbsoluteUrl } from "@/lib/indexnow";

type Params = { tld: string };

export const revalidate = 86400; // 24 h
export const dynamicParams = false; // only the curated set is buildable

export function generateStaticParams(): Params[] {
  return TLDS.map((t) => ({ tld: t.tld }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tld: rawTld } = await params;
  const entry = getTld(rawTld);
  if (!entry) return { title: "TLD" };
  const title = `.${entry.tld} domains — registry, history, best registrars`;
  const description = `${entry.tagline}. Registry: ${entry.registry}. Approx ${entry.approxDomains} registered. Renewals around ${entry.renewalUsd}/year.`;
  return {
    title,
    description,
    alternates: { canonical: `/tld/${entry.tld}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/tld/${entry.tld}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const TYPE_LABEL = {
  "legacy-gtld": "Legacy gTLD",
  "new-gtld": "New gTLD",
  "country-code": "Country code (ccTLD)",
} as const;

export default async function TldPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tld: rawTld } = await params;
  const entry = getTld(rawTld);
  if (!entry) notFound();

  void indexnowNotify([siteAbsoluteUrl(`/tld/${entry.tld}`)]);

  const recommended = entry.recommendedRegistrars
    .map((id) => REGISTRARS.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => r != null);

  return (
    <PageWithSideAds wide>
      <article className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          tld reference
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          .{entry.tld}
        </h1>
        <p className="mt-4 text-lg text-muted">{entry.tagline}.</p>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Type" value={TYPE_LABEL[entry.type]} />
          <Stat label="Registry" value={entry.registry} />
          <Stat label="Introduced" value={String(entry.introduced)} />
          <Stat label="Registered" value={entry.approxDomains} />
        </div>

        <div className="mt-10 space-y-5 text-base leading-relaxed">
          {entry.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">
            Best for
          </h2>
          <p className="mt-2 text-base text-muted">{entry.bestFor}.</p>
          <p className="mt-4 text-sm text-muted">
            Renewal price across registrars{" "}
            <span className="font-mono text-foreground">{entry.renewalUsd}</span>{" "}
            per year. First-year promotional pricing may differ.
          </p>
        </section>

        <ContentBreakAd className="my-12" />

        <section>
          <h2 className="font-display text-2xl font-semibold">
            Best registrars for .{entry.tld}
          </h2>
          <p className="mt-2 text-sm text-muted">
            Three registrars we&rsquo;d use ourselves for a .{entry.tld}{" "}
            registration today, ranked by renewal cost transparency, support
            quality, and namespace availability.
          </p>
          <ul className="mt-5 space-y-3">
            {recommended.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-border bg-surface/40 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display text-lg font-semibold">
                      {r.name}
                    </div>
                    <div className="text-sm text-muted mt-1">{r.blurb}</div>
                  </div>
                  <a
                    href={r.buildSearchUrl(`yourname.${entry.tld}`)}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="shrink-0 rounded-md border border-accent/70 bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                  >
                    Search →
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            Outbound links are affiliate-tagged. They cost you nothing extra
            and help fund this site.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">
            Look up any .{entry.tld} domain
          </h2>
          <p className="mt-2 text-sm text-muted">
            See live age, health score, registrar, DNS, SSL, and tech stack
            for any specific .{entry.tld} domain.
          </p>
          <div className="mt-4">
            <DomainInput size="default" />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">
            Other TLDs we&rsquo;ve covered
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {TLDS.filter((t) => t.tld !== entry.tld)
              .slice(0, 14)
              .map((t) => (
                <li key={t.tld}>
                  <Link
                    href={`/tld/${t.tld}`}
                    className="inline-block rounded-md border border-border bg-surface/40 px-3 py-1.5 text-sm hover:border-accent/60 transition-colors"
                  >
                    .{t.tld}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </article>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `.${entry.tld} domains — registry, history, best registrars`,
            description: entry.tagline,
            mainEntityOfPage: siteAbsoluteUrl(`/tld/${entry.tld}`),
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm">{value}</div>
    </div>
  );
}
