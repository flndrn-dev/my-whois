"use client";

import { useEffect, useState } from "react";
import { computeDomainAge, type AgeFragments } from "@/lib/age/domainAge";
import { subscribeTick } from "@/lib/age/tick";

type Props = {
  registrationISO: string;
};

const FALLBACK: AgeFragments = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalSeconds: 0,
};

function pad(n: number, width = 2) {
  return n.toString().padStart(width, "0");
}

function Slot({ value, width }: { value: string; width: number }) {
  return (
    <span
      className="digit-slot"
      style={{ minWidth: `${width * 0.62}em` }}
    >
      {value}
    </span>
  );
}

export function LiveAgeCounter({ registrationISO }: Props) {
  const [frags, setFrags] = useState<AgeFragments>(
    () => computeDomainAge(registrationISO) ?? FALLBACK,
  );

  useEffect(() => {
    const update = (now: Date) => {
      const next = computeDomainAge(registrationISO, now);
      if (next) setFrags(next);
    };
    update(new Date());
    return subscribeTick(update);
  }, [registrationISO]);

  return (
    <div
      className="font-display tabular-nums leading-tight"
      aria-live="off"
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-2xl sm:text-3xl md:text-4xl font-bold">
        <span><Slot value={frags.years.toString()} width={Math.max(2, frags.years.toString().length)} /> <span className="text-[var(--color-muted)] text-base font-medium">y</span></span>
        <span><Slot value={pad(frags.months)} width={2} /> <span className="text-[var(--color-muted)] text-base font-medium">mo</span></span>
        <span><Slot value={pad(frags.days)} width={2} /> <span className="text-[var(--color-muted)] text-base font-medium">d</span></span>
        <span><Slot value={pad(frags.hours)} width={2} /> <span className="text-[var(--color-muted)] text-base font-medium">h</span></span>
        <span><Slot value={pad(frags.minutes)} width={2} /> <span className="text-[var(--color-muted)] text-base font-medium">m</span></span>
        <span><Slot value={pad(frags.seconds)} width={2} /> <span className="text-[var(--color-muted)] text-base font-medium">s</span></span>
      </div>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        live since {new Date(registrationISO).toUTCString()}
      </p>
    </div>
  );
}
