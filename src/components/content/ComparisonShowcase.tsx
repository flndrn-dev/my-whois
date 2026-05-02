import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COMPARISON_PAIRS, pairSlug } from "@/lib/data/comparison-pairs";
import { POPULAR_TLDS_FOR_HOMEPAGE, getTld } from "@/lib/data/tlds";

const FEATURED_INDEXES = [0, 1, 2, 3, 6, 8];

export function ComparisonShowcase() {
  const featured = FEATURED_INDEXES.map((i) => COMPARISON_PAIRS[i]).filter(
    Boolean,
  ) as [string, string][];
  return (
    <section className="py-12 border-t border-border">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            More ways to explore
          </h2>
          <p className="mt-2 text-muted">
            Compare any two domains at once, or jump into a curated head-to-head.
          </p>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-10">
        <div>
          <h3 className="text-sm uppercase tracking-wide text-muted">
            Domain comparisons
          </h3>
          <ul className="mt-3 space-y-2">
            {featured.map(([a, b]) => (
              <li key={`${a}-${b}`}>
                <Link
                  href={`/compare/${pairSlug(a, b)}`}
                  className="font-mono text-sm hover:text-accent inline-flex items-center gap-2"
                >
                  {a} <span className="text-muted">vs</span> {b}
                  <ArrowRight className="size-3" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-wide text-muted">
            Top TLDs
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {POPULAR_TLDS_FOR_HOMEPAGE.map((slug) => {
              const t = getTld(slug);
              if (!t) return null;
              return (
                <li key={slug}>
                  <Link
                    href={`/tld/${slug}`}
                    className="hover:text-accent inline-flex items-baseline gap-2"
                  >
                    <span className="font-mono">.{slug}</span>
                    <span className="text-muted">— {t.tagline}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-wide text-muted">
            Reading
          </h3>
          <ul className="mt-3 space-y-2 text-muted text-sm">
            <li>What goes into a healthy DNS setup</li>
            <li>Reading an RDAP response, line by line</li>
            <li>Why GDPR redacts most EU registrant data</li>
          </ul>
          <p className="mt-3 text-xs text-muted">
            Long-form posts arrive once the indexer has settled in.
          </p>
        </div>
      </div>
    </section>
  );
}
