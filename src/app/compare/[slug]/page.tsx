import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DomainInput } from "@/components/lookup/DomainInput";
import { ComparisonView } from "@/components/compare/ComparisonView";
import { AdSlot } from "@/components/layout/AdSlot";
import { lookupDomain, DomainNotFoundError } from "@/lib/lookup";
import type { DomainSnapshot } from "@/lib/types";
import { normalizeDomain } from "@/lib/validate-domain";
import { parsePairSlug } from "@/lib/data/comparison-pairs";
import { comparisonPageJsonLd } from "@/lib/seo";

type Params = { slug: string };

export const revalidate = 3600;
export const dynamicParams = true;

// Pairs are listed in the sitemap so search engines discover them, but we
// render on demand to avoid 100 simultaneous RDAP fetches at build time and
// to stay tolerant of any single pair failing.

async function safeLookup(domain: string): Promise<DomainSnapshot | null> {
  try {
    return await lookupDomain(domain);
  } catch (err) {
    if (err instanceof DomainNotFoundError) return null;
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pair = parsePairSlug(slug);
  if (!pair) return { title: "Comparison" };
  const [a, b] = pair;
  const title = `${a} vs ${b} — domain comparison`;
  const description = `Side-by-side: age, registrar, DNS, SSL, and tech stack for ${a} and ${b}.`;
  return {
    title,
    description,
    alternates: { canonical: `/compare/${slug}` },
    openGraph: { title, description, url: `/compare/${slug}` },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const pair = parsePairSlug(slug);
  if (!pair) notFound();
  const aDomain = normalizeDomain(pair[0]);
  const bDomain = normalizeDomain(pair[1]);
  if (!aDomain || !bDomain) notFound();

  const [a, b] = await Promise.all([
    safeLookup(aDomain),
    safeLookup(bDomain),
  ]);
  if (!a && !b) notFound();

  return (
    <div className="container-content py-8 sm:py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          domain comparison
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          {aDomain}{" "}
          <span className="text-muted font-normal">vs</span>{" "}
          {bDomain}
        </h1>
      </div>

      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ABOVE_RESULT ?? ""}
        format="banner"
        reservedHeight={90}
        className="mb-6"
      />

      {a && b ? (
        <ComparisonView a={a} b={b} />
      ) : (
        <div className="rounded-lg border border-border bg-surface/40 p-6 text-sm text-muted">
          We could only resolve one side of this comparison
          {!a ? ` (${aDomain} did not return a record)` : ` (${bDomain} did not return a record)`}
          . Try the individual lookups below.
        </div>
      )}

      <div className="mt-10 max-w-2xl">
        <h2 className="font-display text-xl font-semibold mb-3">
          Compare another pair
        </h2>
        <DomainInput size="default" />
        <p className="text-xs text-muted mt-2">
          Look up either domain individually for the full record, DNS, SSL,
          and tech stack.
        </p>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(comparisonPageJsonLd(aDomain, bDomain)),
        }}
      />
    </div>
  );
}
