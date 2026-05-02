import type { Metadata } from "next";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";
import { ContentBreakAd } from "@/components/layout/ContentBreakAd";
import { BulkLookupTool } from "@/components/bulk/BulkLookupTool";

export const metadata: Metadata = {
  title: "Bulk domain lookup — paste up to 100 domains, get a CSV",
  description:
    "Paste a list of domains (one per line). Get registrar, age, expiry, health score, SSL, and DNSSEC status for all of them — exportable to CSV. Free, no account.",
  alternates: { canonical: "/bulk" },
  openGraph: {
    type: "website",
    url: "/bulk",
    title: "Bulk domain lookup",
    description:
      "Paste up to 100 domains, get registrar, age, expiry, health score and SSL status for each in a single CSV-ready table.",
  },
};

export default function BulkPage() {
  return (
    <PageWithSideAds wide>
      <article className="max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          <span className="text-accent">●</span> Bulk lookup
        </p>
        <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-[4.5rem] font-bold tracking-tight leading-[1.02]">
          A hundred domains,{" "}
          <span className="font-editorial italic font-normal text-accent">
            one paste.
          </span>
        </h1>
        <p className="mt-6 font-prose text-lg sm:text-xl text-muted leading-relaxed max-w-2xl">
          Paste up to 100 domains — one per line, comma-separated, or
          whitespace-separated. We&rsquo;ll return registrar, age, expiry,
          health score, SSL status, and DNSSEC for each in one go. Export the
          result as CSV.
        </p>

        <div className="mt-10">
          <BulkLookupTool />
        </div>

        <ContentBreakAd className="my-12" />

        <section className="mt-12 space-y-5 text-base leading-relaxed text-foreground max-w-3xl">
          <h2 className="font-display text-2xl font-semibold">When this is useful</h2>
          <ul className="list-disc list-outside pl-6 space-y-2 text-foreground">
            <li>
              <strong>SEO audits.</strong> Compare 50 candidate domains by age and
              registrar in one paste, instead of running 50 individual lookups.
            </li>
            <li>
              <strong>M&amp;A due diligence.</strong> Pull a CSV of every domain
              an acquisition target owns, with current expiry status and SSL
              health.
            </li>
            <li>
              <strong>Brand monitoring.</strong> Drop in a list of typo-squat
              variants of your brand and see which ones are registered, by
              whom, and when they expire.
            </li>
            <li>
              <strong>Portfolio management.</strong> If you own a domain
              portfolio, paste them all in to see at a glance which renewals
              are overdue.
            </li>
          </ul>

          <h2 className="font-display text-2xl font-semibold mt-10">
            Limits and fairness
          </h2>
          <p>
            Each request is capped at 100 domains and 6 requests per hour
            per device. Runs are rate-limited so we don&rsquo;t hammer the
            registries — we lean on the same RDAP cache the rest of the site
            uses, so subsequent runs of the same domain are essentially
            free. No accounts, no API keys, no email required.
          </p>
        </section>
      </article>
    </PageWithSideAds>
  );
}
