import type { Metadata } from "next";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How my whois treats your data — what we collect, how we use it, and your choices.",
};

export default function PrivacyPage() {
  return (
    <PageWithSideAds>
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">
        Last updated: {new Date().toUTCString().replace(/^\w+, /, "")}
      </p>
      <div className="mt-6 space-y-5 text-muted leading-relaxed">
        <h2 className="font-display text-xl font-semibold text-foreground">
          What we collect
        </h2>
        <p>
          We may collect basic technical information when you visit my whois,
          such as the pages you view and aggregate usage patterns, in order
          to operate and improve the service. We do not require an account
          to use the lookup tool, and we do not ask you to provide personal
          information.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Lookup queries
        </h2>
        <p>
          When you look up a domain, the result may be cached briefly so
          repeated lookups are fast. Lookup queries are not associated with
          any individual visitor profile. Information returned by domain
          registries is shown to you as published; sensitive contact data
          is redacted before it reaches your browser.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Cookies and third-party advertising
        </h2>
        <p>
          This site may display advertisements served by third-party ad
          networks, including Google AdSense. These networks and their
          partners may use cookies or similar technologies to serve ads
          based on your prior visits to this site or other sites on the
          web, in accordance with their own privacy policies.
        </p>
        <p>
          You can opt out of personalized advertising by visiting{" "}
          <a
            href="https://adssettings.google.com"
            className="underline hover:text-foreground"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google&rsquo;s Ads Settings
          </a>{" "}
          or the{" "}
          <a
            href="https://www.aboutads.info/choices/"
            className="underline hover:text-foreground"
            rel="noopener noreferrer"
            target="_blank"
          >
            Digital Advertising Alliance opt-out page
          </a>
          . EU and UK visitors may be served non-personalized ads by default
          where required by local regulations.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Affiliate links
        </h2>
        <p>
          Some outbound links to third-party services (for example, domain
          registrars) are affiliate links. If you sign up through one, we
          may receive a small commission at no additional cost to you. The
          presence of an affiliate link does not influence the order or
          curation of the recommendations we surface.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Children&rsquo;s privacy
        </h2>
        <p>
          my whois is not directed to children under the age of 13 and we
          do not knowingly collect personal information from them.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Domain expiry watchlist
        </h2>
        <p>
          If you opt into the watchlist on{" "}
          <a className="text-accent underline" href="/watchlist">/watchlist</a>,
          we store the email address and the watched domain in a Resend
          audience. The pairing exists only so we can send you the 30/14/7-day
          expiry alerts you asked for. We do not store your IP, browser
          fingerprint, or any session data alongside the subscription.
          Reply to any watchlist email to unsubscribe — replies route to the
          same address managed by the operator and the audience entry is
          removed.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Your rights
        </h2>
        <p>
          Depending on where you live, you may have rights to access,
          correct, or request deletion of personal information. Because we
          do not maintain user profiles, most requests will result in a
          response confirming that no personal record exists.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Changes
        </h2>
        <p>
          We may update this policy from time to time. Material changes will
          be reflected by an updated revision date at the top of this page.
        </p>
      </div>
    </PageWithSideAds>
  );
}
