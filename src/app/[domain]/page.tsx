import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DomainInput } from "@/components/lookup/DomainInput";
import { ResultBanner } from "@/components/lookup/ResultBanner";
import {
  RegistrarBand,
  DatesBand,
  NameserversBand,
  SslInfoBand,
  TechStackBand,
} from "@/components/lookup/Bands";
import { DnsRecordsTabs } from "@/components/lookup/DnsRecordsTabs";
import { RawRdapDrawer } from "@/components/lookup/RawRdapDrawer";
import { RedactionNotice } from "@/components/lookup/RedactionNotice";
import { AdSlot } from "@/components/layout/AdSlot";
import { lookupDomain, DomainNotFoundError } from "@/lib/lookup";
import { normalizeDomain } from "@/lib/validate-domain";
import { domainPageJsonLd } from "@/lib/seo";
import { indexnowNotify } from "@/lib/indexnow";

type Params = { domain: string };

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { domain: raw } = await params;
  const domain = normalizeDomain(decodeURIComponent(raw)) ?? raw;
  const title = `${domain} — domain age, DNS, SSL & tech stack`;
  const description = `Live age counter, health score, registrar, nameservers, DNS records, SSL certificate, and detected tech stack for ${domain}.`;
  return {
    title,
    description,
    alternates: { canonical: `/${domain}` },
    openGraph: {
      title,
      description,
      url: `/${domain}`,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function DomainPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { domain: rawParam } = await params;
  const decoded = decodeURIComponent(rawParam);
  const domain = normalizeDomain(decoded);
  if (!domain) notFound();

  let snapshot;
  try {
    snapshot = await lookupDomain(domain);
  } catch (err) {
    if (err instanceof DomainNotFoundError) notFound();
    throw err;
  }

  // Fire-and-forget IndexNow ping for fresh URLs
  if (process.env.INDEXNOW_KEY) {
    void indexnowNotify([
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-whois.com"}/${domain}`,
    ]);
  }

  return (
    <div className="container-content py-8 sm:py-10">
      <div className="mb-6">
        <DomainInput defaultValue={domain} size="default" />
      </div>

      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ABOVE_RESULT ?? ""}
        format="banner"
        reservedHeight={90}
        className="mb-6"
      />

      <ResultBanner snapshot={snapshot} />

      <div className="grid lg:grid-cols-12 gap-10 mt-8">
        <div className="lg:col-span-8 space-y-2">
          <RedactionNotice notes={snapshot.notes} />
          <RegistrarBand info={snapshot.info} />
          <DatesBand info={snapshot.info} />
          <NameserversBand info={snapshot.info} />
          <DnsRecordsTabs dns={snapshot.dns} />

          <AdSlot
            slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID_RESULT ?? ""}
            format="native"
            reservedHeight={250}
            className="my-6"
          />

          <SslInfoBand ssl={snapshot.ssl} />
          <TechStackBand tech={snapshot.tech} />
          <div className="pt-6">
            <RawRdapDrawer raw={snapshot.info.raw} />
          </div>
        </div>
        <aside className="hidden lg:block lg:col-span-4">
          <AdSlot
            slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? ""}
            format="rectangle"
            reservedHeight={250}
            className="sticky top-24"
          />
          <div className="mt-6 rounded-lg border border-[var(--color-border)] p-4 bg-[var(--color-surface)]/40">
            <h3 className="text-sm uppercase tracking-wide text-[var(--color-muted)]">
              Quick facts
            </h3>
            <dl className="mt-3 text-sm space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-muted)]">Source</dt>
                <dd className="font-mono">{snapshot.info.source}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-muted)]">Tier</dt>
                <dd className="font-mono uppercase">{snapshot.health.tier}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-muted)]">Fetched</dt>
                <dd className="font-mono text-xs">
                  {new Date(snapshot.fetchedAt).toUTCString().replace(/^\w+, /, "")}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(domainPageJsonLd(domain)),
        }}
      />
    </div>
  );
}
