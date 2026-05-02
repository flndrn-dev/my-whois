import { Check, ExternalLink, Plus, X, HelpCircle } from "lucide-react";
import {
  REGISTRARS,
  suggestSimilarDomains,
} from "@/lib/data/registrars";
import { getTld } from "@/lib/validate-domain";
import { checkBatch, type Availability } from "@/lib/rdap/availability";

type Props = {
  domain: string;
};

function AvailabilityBadge({ status }: { status: Availability }) {
  if (status === "available") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 text-success px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide">
        <Check className="size-3" />
        available
      </span>
    );
  }
  if (status === "taken") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-danger/15 text-danger px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide">
        <X className="size-3" />
        taken
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted/15 text-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide">
      <HelpCircle className="size-3" />
      unknown
    </span>
  );
}

export async function AlternativesSection({ domain }: Props) {
  const tld = getTld(domain);
  const candidates = suggestSimilarDomains(domain, tld);
  const availability = await checkBatch(candidates);

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
            Same root, different TLDs. Green badges are unregistered right now —
            click a registrar to grab one. Red means taken; click the row title
            to look it up.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {candidates.map((alt) => {
          const status = availability[alt] ?? "unknown";
          const isTaken = status === "taken";
          return (
            <li
              key={alt}
              className="rounded-lg border border-border bg-surface/40 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex items-center gap-2 sm:w-56 shrink-0">
                <Plus className="size-4 text-muted" />
                {isTaken ? (
                  <a
                    href={`/${alt}`}
                    className="font-mono text-sm hover:text-foreground transition-colors"
                  >
                    {alt}
                  </a>
                ) : (
                  <span className="font-mono text-sm">{alt}</span>
                )}
                <AvailabilityBadge status={status} />
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
          );
        })}
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
