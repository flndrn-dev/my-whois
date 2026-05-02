import Link from "next/link";
import { POPULAR_DOMAINS } from "@/lib/data/popular-domains";

export function PopularDomains() {
  return (
    <section className="py-12 border-t border-[var(--color-border)]">
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
        Popular searches
      </h2>
      <p className="mt-2 text-[var(--color-muted)]">
        Browse fully-rendered lookups for some of the internet&rsquo;s most
        recognisable domains.
      </p>
      <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {POPULAR_DOMAINS.map((d) => (
          <li key={d}>
            <Link
              href={`/${d}`}
              className="block rounded-md border border-[var(--color-border)] px-3 py-2 font-mono text-sm hover:bg-[var(--color-surface)] transition-colors"
            >
              {d}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
