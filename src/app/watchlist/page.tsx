import type { Metadata } from "next";
import { Suspense } from "react";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";
import { ContentBreakAd } from "@/components/layout/ContentBreakAd";
import { WatchlistForm } from "@/components/watchlist/WatchlistForm";

export const metadata: Metadata = {
  title: "Domain expiry watchlist — get an email before any domain expires",
  description:
    "Add a domain and your email. We'll send you an alert 30, 14, and 7 days before the registration expires. Free, no account, unsubscribe with a reply.",
  alternates: { canonical: "/watchlist" },
  openGraph: {
    type: "website",
    url: "/watchlist",
    title: "Domain expiry watchlist",
    description:
      "Add a domain. Get an email 30, 14, and 7 days before it expires.",
  },
};

export default function WatchlistPage() {
  return (
    <PageWithSideAds wide>
      <article className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          watchlist
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Get an email before any domain expires.
        </h1>
        <p className="mt-5 text-lg text-muted leading-relaxed">
          Add a domain and your email. We send a heads-up 30, 14, and 7 days
          before the registration runs out. Free, no account, no marketing
          drip. Reply to any email to unsubscribe.
        </p>

        <div className="mt-10">
          <Suspense fallback={<div className="rounded-xl border border-border bg-surface/40 p-6 h-64" />}>
            <WatchlistForm />
          </Suspense>
        </div>

        <ContentBreakAd className="my-12" />

        <section className="mt-12 space-y-5 text-base leading-relaxed text-foreground">
          <h2 className="font-display text-2xl font-semibold">
            How it works
          </h2>
          <p>
            We pull the domain&rsquo;s registration record from the registry
            using RDAP (the modern WHOIS replacement) and read the
            <span className="font-mono text-sm"> expirationDate</span> field.
            The same daily check runs on every watched domain, and when the
            remaining days hits 30, 14, or 7 we send you a single email.
          </p>
          <p>
            If a domain renews early or transfers, the next daily check sees
            the new expiry date and the alert sequence pauses automatically.
            We never sell, share, or repurpose your email — see the
            {" "}
            <a className="text-accent underline" href="/privacy">
              privacy policy
            </a>
            {" "}for the full details.
          </p>
          <p>
            We don&rsquo;t store passwords, sessions, or analytics tied to your
            address. Subscriptions live in a Resend audience and contain only
            the email + domain you submitted; no IP, no fingerprint, no
            tracking pixels.
          </p>
        </section>
      </article>
    </PageWithSideAds>
  );
}
