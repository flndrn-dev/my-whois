"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Activity, ExternalLink } from "@/components/ui/icons";
import { isDomainMonitored } from "@/lib/data/monitored-domains";
import {
  getMonitoringBandCohort,
  shouldRenderInThisSession,
  type Cohort,
  type SessionRenderDecision,
} from "@/lib/ab-test";
import { trackEvent } from "@/lib/umami";

const WEBDOWN_URL_AB =
  "https://web-down.com?utm_source=my-whois&utm_medium=monitoring-band&utm_campaign=ab-test";
const WEBDOWN_URL_MONITORED =
  "https://web-down.com?utm_source=my-whois&utm_medium=monitoring-band&utm_campaign=monitored";

type Props = {
  domain: string;
};

// MonitoringBand — three rendering modes:
//
// 1. MONITORED MODE  (always when the domain is in MONITORED_DOMAINS)
//    Green pulsing dot + "Monitored · view dashboard at web-down.com →".
//    Promoted out of the A/B test because the link is factually true for
//    these domains. Always shown when kill-switch is on.
//
// 2. STANDARD A/B MODE  (every other domain)
//    Same 40/60 link/neutral split as before:
//      - Cohort A: always neutral
//      - Cohort B: 80% sessions show link, 20% show neutral
//      - Net: 40% link, 60% neutral
//    Only fires when kill-switch is on; otherwise neutral for everyone.
//
// 3. NEUTRAL STATE  (kill-switch off, OR Cohort A, OR Cohort B
//                    with session "hide")
//    Green pulsing dot + "Live · reachable just now". Truthful since
//    the page only renders if the domain lookup succeeded.
//
// PREVIEW QUERY PARAMS:
//   ?preview=monitoring  → force STANDARD link branch (current copy)
//   ?preview=monitored   → force MONITORED variant (green-pulse copy)
// Both bypass cohort + session + kill-switch. Neither fires Umami
// events so preview doesn't pollute the A/B-test data.

export function MonitoringBand({ domain }: Props) {
  const params = useSearchParams();
  const previewStandard = params.get("preview") === "monitoring";
  const previewMonitored = params.get("preview") === "monitored";

  const isMonitored = isDomainMonitored(domain);

  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [sessionDecision, setSessionDecision] =
    useState<SessionRenderDecision | null>(null);

  const linkActive = process.env.NEXT_PUBLIC_WEBDOWN_LIVE === "true";

  // Determine which variant to render this paint.
  let mode: "monitored" | "link" | "neutral";
  if (previewMonitored) {
    mode = "monitored";
  } else if (previewStandard) {
    mode = "link";
  } else if (isMonitored && linkActive) {
    mode = "monitored";
  } else if (
    !isMonitored &&
    cohort === "B" &&
    sessionDecision === "show" &&
    linkActive
  ) {
    mode = "link";
  } else {
    mode = "neutral";
  }

  // Cohort + session resolution (only for non-monitored, non-preview real
  // visits). Monitored-mode renders deterministically without entering
  // the A/B test, so we don't read or write the storage flags.
  useEffect(() => {
    if (previewStandard || previewMonitored) return;
    if (isMonitored) return;

    const c = getMonitoringBandCohort();
    setCohort(c);

    trackEvent("result_page_view", { domain, cohort: c ?? "unknown" });

    if (c === "B") {
      const decision = shouldRenderInThisSession();
      setSessionDecision(decision);
    }
  }, [domain, previewStandard, previewMonitored, isMonitored]);

  // Render-state events (real visits only).
  useEffect(() => {
    if (previewStandard || previewMonitored) return;

    if (isMonitored) {
      // Monitored renders always fire their own event when the band
      // actually displays the monitored variant.
      if (mode === "monitored") {
        trackEvent("monitoring_band_monitored_rendered", { domain });
      }
      return;
    }

    if (cohort === null) return; // Wait for client-side cohort resolution

    if (cohort === "B" && linkActive) {
      trackEvent("monitoring_band_eligible", {
        domain,
        decision: sessionDecision ?? "unknown",
      });
    }
    if (mode === "link") {
      trackEvent("monitoring_band_link_rendered", { domain });
    } else if (mode === "neutral") {
      trackEvent("monitoring_band_neutral_rendered", { domain });
    }
  }, [
    cohort,
    sessionDecision,
    mode,
    domain,
    previewStandard,
    previewMonitored,
    isMonitored,
    linkActive,
  ]);

  const handleClick = () => {
    if (previewStandard || previewMonitored) return;
    if (isMonitored) {
      trackEvent("monitoring_band_monitored_clicked", { domain });
    } else {
      trackEvent("monitoring_band_link_clicked", { domain });
    }
  };

  // SSR / hydration guard: monitored-mode and preview-mode can render
  // immediately. Standard A/B requires the client useEffect to resolve
  // cohort + session, so we delay that branch.
  if (
    !previewStandard &&
    !previewMonitored &&
    !isMonitored &&
    cohort === null
  ) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 py-5 border-b border-border">
      <div className="flex items-center gap-2 sm:w-44 shrink-0 text-muted">
        <span className="size-5 shrink-0 text-success">
          <Activity />
        </span>
        <span className="uppercase text-xs tracking-wide font-medium">
          Monitoring
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {mode === "monitored" ? (
            <>
              <span className="inline-flex items-center gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className="relative inline-flex size-2"
                >
                  <span className="absolute inset-0 rounded-full bg-success/40 animate-ping" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                <span>Monitored</span>
                <span className="text-muted">·</span>
                <span>view dashboard at</span>
              </span>
              <a
                href={WEBDOWN_URL_MONITORED}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-mono hover:text-accent transition-colors"
              >
                web-down.com
                <ExternalLink className="size-3" />
              </a>
              {previewMonitored ? (
                <span className="text-[10px] uppercase tracking-[0.18em] text-success border border-success/40 bg-success/10 rounded px-1.5 py-0.5 font-mono">
                  preview · monitored
                </span>
              ) : null}
            </>
          ) : mode === "link" ? (
            <>
              <span className="text-sm">
                Track <span className="font-mono">{domain}</span> uptime at
              </span>
              <a
                href={WEBDOWN_URL_AB}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-mono hover:text-accent transition-colors"
              >
                web-down.com
                <ExternalLink className="size-3" />
              </a>
              {previewStandard ? (
                <span className="text-[10px] uppercase tracking-[0.18em] text-success border border-success/40 bg-success/10 rounded px-1.5 py-0.5 font-mono">
                  preview · monitoring
                </span>
              ) : null}
            </>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className="relative inline-flex size-2"
              >
                <span className="absolute inset-0 rounded-full bg-success/40 animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              <span>Live</span>
              <span className="text-muted">·</span>
              <span className="text-muted">reachable just now</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
