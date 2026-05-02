import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About my whois — what the tool does, what data it shows, who runs it.",
};

export default function AboutPage() {
  return (
    <div className="container-content py-12 sm:py-16 max-w-3xl">
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
        About my whois
      </h1>
      <div className="mt-6 space-y-5 text-muted leading-relaxed">
        <p>
          my whois is a free domain inspector built and run by flndrn. It
          turns flat WHOIS data into something you can read at a glance: a
          live age counter, a transparent health score, side-by-side
          comparisons, and a tech-stack detector that shows the CDN, DNS
          provider, and email vendor a domain relies on.
        </p>
        <p>
          We pull data from public sources only — RDAP via IANA&rsquo;s
          bootstrap registry, port-43 WHOIS as a fallback for older ccTLDs,
          public DNS records, and the TLS certificate served at port 443.
          Nothing is fingerprinted, scraped, or guessed. We strip emails and
          IP addresses from registry responses before they ever leave our
          server.
        </p>
        <p>
          Our goal is simple: take the dry, fragmented world of WHOIS and
          DNS data and turn it into something anyone can read in ten
          seconds. Whether you&rsquo;re a developer debugging a setup, a
          founder vetting a brand, or just curious about a name you saw,
          you should walk away with a clear answer — not a wall of jargon.
          We focus on speed, clarity, and giving you the full picture
          without the noise.
        </p>
        <p>
          Coverage spans 1,000+ extensions across gTLDs (<code>.com</code>,
          <code> .net</code>, <code>.org</code>, <code>.app</code>,{" "}
          <code>.dev</code>, …) and ccTLDs (<code>.io</code>,{" "}
          <code>.ai</code>, <code>.sh</code>, <code>.de</code>,{" "}
          <code>.uk</code>, <code>.jp</code>, …). EU TLDs typically redact
          registrant data under GDPR — we surface that politely instead of
          showing a broken record.
        </p>
        <p>
          Have a feature request, a TLD that misbehaves, or a clean tech
          chip we should add? The site is intentionally accountless — drop a
          note via your favourite channel and we&rsquo;ll fold it in.
        </p>
      </div>
    </div>
  );
}
