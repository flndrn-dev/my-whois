import { ExternalLink, Plus } from "lucide-react";
import {
  REGISTRARS,
  suggestSimilarDomains,
} from "@/lib/data/registrars";
import { getTld } from "@/lib/validate-domain";

type Props = {
  domain: string;
  // When showing on a result page, we already know the tld and skip it.
  // When showing on the homepage with no domain context, leave undefined.
};

export function AlternativesSection({ domain }: Props) {
  const tld = getTld(domain);
  const candidates = suggestSimilarDomains(domain, tld);
  return (
    <section
      aria-labelledby="alt-domains-heading"
      className="py-10 border-t border-border"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
        <div>
          <h2
            id="alt-domains-heading"
            className="font-display text-xl sm:text-2xl font-bold tracking-tight"
          >
            Get this name on another extension
          </h2>
          <p className="mt-1 text-sm text-muted">
            Same root, different TLDs. Click a registrar to check availability
            and pricing — they handle WHOIS privacy by default.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {candidates.map((alt) => (
          <li
            key={alt}
            className="rounded-lg border border-border bg-surface/40 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <div className="flex items-center gap-2 sm:w-48 shrink-0">
              <Plus className="size-4 text-muted" />
              <span className="font-mono text-sm">{alt}</span>
            </div>
            <div className="flex flex-wrap gap-2 flex-1">
              {REGISTRARS.map((r) => (
                <a
                  key={r.id}
                  href={r.buildSearchUrl(alt)}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background hover:bg-surface px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  {r.name}
                  <ExternalLink className="size-3" />
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <details className="mt-5 text-xs text-muted">
        <summary className="cursor-pointer hover:text-foreground transition-colors">
          About these registrars
        </summary>
        <ul className="mt-2 space-y-1 pl-4 list-disc">
          {REGISTRARS.map((r) => (
            <li key={r.id}>
              <span className="font-medium text-foreground">{r.name}</span> —{" "}
              {r.blurb}
              {r.hasAffiliate ? (
                <span className="ml-2 text-[10px] uppercase tracking-wide opacity-60">
                  affiliate
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="mt-2">
          Affiliate links earn this site a small commission on completed sign-ups
          at no extra cost to you. Cloudflare Registrar has no affiliate
          program; we list it because it&rsquo;s the cheapest option in the
          long run.
        </p>
      </details>
    </section>
  );
}
