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

      <ul className="space-y-4">
        {candidates.map((alt) => {
          const status = availability[alt] ?? "unknown";
          const isTaken = status === "taken";
          return (
            <li
              key={alt}
              className="rounded-lg border border-border bg-surface/40 p-5"
            >
              {/* Row header — domain label on its own line so the registrar */}
              {/* button grid below has the full width and a consistent rhythm. */}
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border/60">
                <Plus className="size-4 text-muted shrink-0" />
                {isTaken ? (
                  <a
                    href={`/${alt}`}
                    className="font-mono text-sm hover:text-accent transition-colors"
                  >
                    {alt}
                  </a>
                ) : (
                  <span className="font-mono text-sm">{alt}</span>
                )}
                <AvailabilityBadge status={status} />
              </div>

              {/* Registrar grid — explicit columns scale with viewport so */}
              {/* every button is the same width and rows align cleanly. */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                {REGISTRARS.map((r) => (
                  <a
                    key={r.id}
                    href={r.buildSearchUrl(alt)}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="inline-flex items-center justify-between gap-2 rounded-md border border-border bg-background hover:bg-surface hover:border-accent/50 px-3 py-2 text-xs font-medium transition-colors min-w-0"
                  >
                    <span className="truncate">{r.name}</span>
                    <ExternalLink className="size-3 shrink-0 text-muted" />
                  </a>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
