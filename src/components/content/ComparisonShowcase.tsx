import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COMPARISON_PAIRS, pairSlug } from "@/lib/data/comparison-pairs";

const FEATURED_INDEXES = [0, 1, 2, 3, 6, 8];

export function ComparisonShowcase() {
  const featured = FEATURED_INDEXES.map((i) => COMPARISON_PAIRS[i]).filter(
    Boolean,
  ) as [string, string][];
  return (
    <section className="py-12 border-t border-[var(--color-border)]">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            More ways to explore
          </h2>
          <p className="mt-2 text-[var(--color-muted)]">
            Compare any two domains at once, or jump into a curated head-to-head.
          </p>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-10">
        <div>
          <h3 className="text-sm uppercase tracking-wide text-[var(--color-muted)]">
            Domain comparisons
          </h3>
          <ul className="mt-3 space-y-2">
            {featured.map(([a, b]) => (
              <li key={`${a}-${b}`}>
                <Link
                  href={`/compare/${pairSlug(a, b)}`}
                  className="font-mono text-sm hover:text-[var(--color-accent)] inline-flex items-center gap-2"
                >
                  {a} <span className="text-[var(--color-muted)]">vs</span> {b}
                  <ArrowRight className="size-3" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-wide text-[var(--color-muted)]">
            Top TLDs
          </h3>
          <ul className="mt-3 space-y-2 text-[var(--color-muted)] text-sm">
            <li>.com — the legacy default</li>
            <li>.io — startups and devtools</li>
            <li>.ai — anything with a model attached</li>
            <li>.sh — shell-flavoured side-projects</li>
            <li>.dev — Google&rsquo;s HTTPS-only namespace</li>
          </ul>
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            Per-TLD pages with stats and renewal economics ship in Phase 2.
          </p>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-wide text-[var(--color-muted)]">
            Reading
          </h3>
          <ul className="mt-3 space-y-2 text-[var(--color-muted)] text-sm">
            <li>What goes into a healthy DNS setup</li>
            <li>Reading an RDAP response, line by line</li>
            <li>Why GDPR redacts most EU registrant data</li>
          </ul>
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            Long-form posts arrive once the indexer has settled in.
          </p>
        </div>
      </div>
    </section>
  );
}
