export function AboutSection() {
  return (
    <section className="mt-10 py-12 border-t border-border">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            More than a plain WHOIS
          </h2>
          <p className="mt-3 text-muted">
            One look-up, four signals: live age, health score, side-by-side
            comparison, tech-stack detection.
          </p>
        </div>
        <div className="lg:col-span-8 space-y-8">
          <article className="prose-base max-w-none">
            <h3 className="font-display text-lg font-semibold">
              About this domain inspector
            </h3>
            <p className="mt-2 text-muted leading-relaxed">
              my whois turns a flat WHOIS dump into something you can read in
              ten seconds. Look up any domain — gTLDs like <code>.com</code>{" "}
              and <code>.dev</code>, ccTLDs like <code>.io</code>,{" "}
              <code>.sh</code>, <code>.de</code>, and a long tail of newer
              extensions — and we&rsquo;ll show its registrar, dates,
              nameservers, DNS records, SSL certificate, and the vendors it
              relies on, all on one page. The lookup is unlimited and free,
              and we never log your queries against an IP address.
            </p>
            <p className="mt-3 text-muted leading-relaxed">
              Where most WHOIS tools stop at static text, my whois adds a live
              age counter, a transparent health score, and pre-built domain
              comparisons so you can drop in two names and see who&rsquo;s
              older, who&rsquo;s healthier, and who runs what.
            </p>
          </article>
          <article>
            <h3 className="font-display text-lg font-semibold">
              How the Domain Health Score works
            </h3>
            <p className="mt-2 text-muted leading-relaxed">
              The score is a single 0–100 number based on six public signals:
              SSL validity and runway (25 points), DNSSEC delegation (15),
              SPF record (10), DMARC policy (10), nameserver redundancy (15),
              and expiry runway (25). 80+ is green, 60–79 is amber, below 60
              is red. Hover the ring to see the per-criterion breakdown —
              transparency is part of the point.
            </p>
          </article>
          <article>
            <h3 className="font-display text-lg font-semibold">
              What you can do
            </h3>
            <ul className="mt-2 space-y-1 text-muted leading-relaxed list-disc pl-5">
              <li>Watch a domain&rsquo;s age tick up live, second by second.</li>
              <li>See its health score and the six checks behind it.</li>
              <li>Compare any two domains side-by-side at <code>/compare/a-vs-b</code>.</li>
              <li>Spot the CDN, DNS provider, and email vendor in use.</li>
              <li>Open the raw RDAP / WHOIS response when you need details.</li>
            </ul>
          </article>
          <article>
            <h3 className="font-display text-lg font-semibold">
              Why this matters
            </h3>
            <p className="mt-2 text-muted leading-relaxed">
              For owners auditing their own setup. For investors checking a
              brand&rsquo;s domain hygiene. For developers debugging DNS or
              picking a registrar. For anyone curious how old a domain
              actually is — down to the second.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
