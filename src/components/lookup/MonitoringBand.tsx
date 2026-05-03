"use client";

import { useEffect, useState } from "react";
import { Activity, ExternalLink } from "@/components/ui/icons";
import {
  getMonitoringBandCohort,
  shouldRenderInThisSession,
  type Cohort,
  type SessionRenderDecision,
} from "@/lib/ab-test";
import { trackEvent } from "@/lib/umami";

const WEBDOWN_URL =
  "https://web-down.com?utm_source=my-whois&utm_medium=monitoring-band&utm_campaign=ab-test";

type Props = {
  domain: string;
};

// MonitoringBand — A/B-tested cross-promo to web-down.com that visually
// mimics the existing data-band rows (RegistrarBand, NameserversBand, …).
//
// Renders only when ALL of the following are true:
//   1. Visitor is in Cohort B (persistent localStorage assignment)
//   2. Current session got a "show" coin flip (sessionStorage decision)
//   3. NEXT_PUBLIC_WEBDOWN_LIVE === "true" (kill-switch)
//
// SSR-safe — returns null until the client useEffect resolves cohort and
// session state. The reserved-height behaviour is implicit in the band
// styling (no card, no shadow), so a "now you see it / now you don't"
// hydration is acceptable here.

export function MonitoringBand({ domain }: Props) {
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [sessionDecision, setSessionDecision] =
    useState<SessionRenderDecision | null>(null);

  useEffect(() => {
    const c = getMonitoringBandCohort();
    setCohort(c);

    // Pageview-with-cohort fires for both groups; A is the baseline
    // denominator for behavioural-comparison metrics.
    trackEvent("result_page_view", { domain, cohort: c ?? "unknown" });

    if (c === "B") {
      const decision = shouldRenderInThisSession();
      setSessionDecision(decision);

      if (process.env.NEXT_PUBLIC_WEBDOWN_LIVE === "true") {
        // Eligibility = "Cohort B + kill-switch on" — the right denominator
        // for measuring per-render CTR vs per-eligibility CTR.
        trackEvent("monitoring_band_eligible", {
          domain,
          decision: decision ?? "unknown",
        });

        if (decision === "show") {
          trackEvent("monitoring_band_seen", { domain });
        }
      }
    }
  }, [domain]);

  // SSR & hydration guard
  if (cohort === null) return null;
  // Cohort A: never render
  if (cohort === "A") return null;
  // Kill-switch off: never render
  if (process.env.NEXT_PUBLIC_WEBDOWN_LIVE !== "true") return null;
  // Cohort B but session decided "hide": don't render this session
  if (sessionDecision !== "show") return null;

  const handleClick = () => {
    trackEvent("monitoring_band_clicked", { domain });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 py-5 border-b border-border">
      <div className="flex items-center gap-2 sm:w-44 shrink-0 text-muted">
        <span className="size-5 shrink-0">
          <Activity />
        </span>
        <span className="uppercase text-xs tracking-wide font-medium">
          Monitoring
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-sm">
            Track{" "}
            <span className="font-mono">{domain}</span>{" "}
            uptime at
          </span>
          <a
            href={WEBDOWN_URL}
            onClick={handleClick}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-mono hover:text-accent transition-colors"
          >
            web-down.com
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
