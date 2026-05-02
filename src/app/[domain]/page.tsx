import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DomainInput } from "@/components/lookup/DomainInput";
import { ResultBanner } from "@/components/lookup/ResultBanner";
import {
  RegistrarBand,
  DatesBand,
  NameserversBand,
  SslInfoBand,
  SourceBand,
  TechStackBand,
} from "@/components/lookup/Bands";
import { AlternativesSection } from "@/components/content/AlternativesSection";
import { DnsRecordsTabs } from "@/components/lookup/DnsRecordsTabs";
import { RawRdapDrawer } from "@/components/lookup/RawRdapDrawer";
import { RedactionNotice } from "@/components/lookup/RedactionNotice";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";
import { ContentBreakAd } from "@/components/layout/ContentBreakAd";
import { lookupDomain, DomainNotFoundError } from "@/lib/lookup";
import { normalizeDomain } from "@/lib/validate-domain";
import { domainPageJsonLd } from "@/lib/seo";
import { indexnowNotify, siteAbsoluteUrl } from "@/lib/indexnow";

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

  void indexnowNotify([siteAbsoluteUrl(`/${domain}`)]);

  return (
    <PageWithSideAds wide>
      <div className="mb-6">
        <DomainInput defaultValue={domain} size="default" />
      </div>

      <ResultBanner snapshot={snapshot} />

      <div className="space-y-2 mt-8">
        <RedactionNotice notes={snapshot.notes} />
        <RegistrarBand info={snapshot.info} />
        <DatesBand info={snapshot.info} domain={domain} />
        <NameserversBand info={snapshot.info} />
        <DnsRecordsTabs dns={snapshot.dns} />
        <SslInfoBand ssl={snapshot.ssl} />
        <TechStackBand tech={snapshot.tech} />
        <SourceBand info={snapshot.info} />
        <div className="pt-6">
          <RawRdapDrawer raw={snapshot.info.raw} />
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border p-4 bg-surface/40 max-w-md">
        <h3 className="text-sm uppercase tracking-wide text-muted">
          Quick facts
        </h3>
        <dl className="mt-3 text-sm space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Source</dt>
            <dd className="font-mono">{snapshot.info.source}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Tier</dt>
            <dd className="font-mono uppercase">{snapshot.health.tier}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Fetched</dt>
            <dd className="font-mono text-xs">
              {new Date(snapshot.fetchedAt).toUTCString().replace(/^\w+, /, "")}
            </dd>
          </div>
        </dl>
      </div>

      <ContentBreakAd />

      <AlternativesSection domain={domain} />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(domainPageJsonLd(domain)),
        }}
      />
    </PageWithSideAds>
  );
}
