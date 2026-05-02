import type { DomainSnapshot } from "@/lib/types";
import { HealthScoreRing } from "./HealthScoreRing";
import { LiveAgeCounter } from "./LiveAgeCounter";
import { ShareScoreButton } from "./ShareScoreButton";

export function ResultBanner({ snapshot }: { snapshot: DomainSnapshot }) {
  const { domain, info, health } = snapshot;
  return (
    <section className="border-b border-[var(--color-border)] py-8 sm:py-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
            Domain
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mt-1 break-all">
            {domain}
          </h1>
          <div className="mt-6">
            {info.registrationDate ? (
              <LiveAgeCounter registrationISO={info.registrationDate} />
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                Registration date is not published for this domain.
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-row lg:flex-col items-center gap-4 lg:items-end">
          <HealthScoreRing health={health} />
          <ShareScoreButton domain={domain} score={health.score} />
        </div>
      </div>
    </section>
  );
}
