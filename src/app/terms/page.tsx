import type { Metadata } from "next";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "How to use my whois — the short, plain-English version.",
};

export default function TermsPage() {
  return (
    <PageWithSideAds>
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted">
        Last updated: {new Date().toUTCString().replace(/^\w+, /, "")}
      </p>
      <div className="mt-6 space-y-5 text-muted leading-relaxed">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Use of the service
        </h2>
        <p>
          my whois is provided free of charge for personal and professional
          use. By accessing this site you agree to use it lawfully and not
          to scrape, abuse, or attempt to bypass rate limits or technical
          protections. Excessive automated traffic may be throttled or
          blocked at the edge.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Data sources and accuracy
        </h2>
        <p>
          WHOIS, RDAP, DNS, and TLS data is fetched directly from public
          authoritative sources at lookup time. Records are accurate as of
          the moment they were retrieved. Many EU TLDs redact registrant
          contact details under GDPR; absence of data is not a fault of
          this tool. We make no warranty as to the completeness or
          freshness of any specific field.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          No professional advice
        </h2>
        <p>
          The Domain Health Score is an opinionated summary of public
          signals, not a professional security audit. Do not rely on it
          alone for compliance, legal, or commercial decisions.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Trademarks
        </h2>
        <p>
          Domain names and brand logos referenced on this site belong to
          their respective owners. Display here implies no endorsement or
          affiliation.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Liability
        </h2>
        <p>
          The service is provided &ldquo;as is&rdquo; without warranties of
          any kind. To the maximum extent permitted by law, the operator
          shall not be liable for any indirect, incidental, or consequential
          damages arising from your use of the service.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Jurisdiction
        </h2>
        <p>
          These terms are governed by the laws of the European Union.
          Disputes shall be resolved in the courts of the operator&rsquo;s
          country of residence.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Changes
        </h2>
        <p>
          Updates to these terms will be reflected by an updated revision
          date at the top of this page.
        </p>
      </div>
    </PageWithSideAds>
  );
}
