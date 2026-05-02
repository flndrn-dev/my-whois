import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How my whois treats your data — short version: barely.",
};

export default function PrivacyPage() {
  return (
    <div className="container-content py-12 sm:py-16 max-w-3xl">
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
          my whois does not require an account, set tracking cookies of its
          own, or log your IP address. We use Umami, a cookieless,
          self-hosted analytics tool, which stores aggregate counts of page
          views and events (lookup, compare, share) — never anything that
          identifies you personally.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Lookup queries
        </h2>
        <p>
          When you look up a domain, the result is cached server-side for up
          to one hour, keyed by the domain name only. Your IP, session, and
          referrer are never linked to that cache entry. Emails and IP
          addresses are redacted from registry responses before they reach
          your browser.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Advertising
        </h2>
        <p>
          The site is monetised by Google AdSense. AdSense and its partners
          may use cookies or similar technologies to serve ads based on your
          visit to this and other sites. EU/UK visitors are served
          non-personalised ads unless a future consent prompt collects
          explicit consent. You can opt out of personalised advertising via{" "}
          <a
            href="https://adssettings.google.com"
            className="underline hover:text-foreground"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google&rsquo;s Ads Settings
          </a>
          .
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Data we do not store
        </h2>
        <p>
          No accounts, no profiles, no databases of users, no IP logs, no
          email addresses. Lookup history is held only in volatile memory
          and expires within an hour.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Your rights (GDPR / UK GDPR)
        </h2>
        <p>
          Because we do not collect personal data, there is nothing to
          access, correct, or erase on request. If a regulator wishes to
          confirm this, the codebase is open to inspection.
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Changes
        </h2>
        <p>
          Material changes to this policy will be reflected by an updated
          revision date at the top of this page.
        </p>
      </div>
    </div>
  );
}
