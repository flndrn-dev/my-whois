"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

// MonitoringBand — A/B-tested cross-promo, redesigned to ALWAYS render so
// the band reads as permanent metadata that belongs on the page. Only the
// VALUE cell varies between two states:
//
//   1. Link state (~40% of pageviews) — "Track {domain} uptime at
//      web-down.com →" — drives traffic to web-down.com when ready.
//
//   2. Neutral state (~60% of pageviews) — green pulsing dot + "Live ·
//      reachable just now" — looks like a healthy live status field,
//      truthful since the page only renders if the lookup succeeded.
//
// Distribution (with cohort + session randomness preserved for clean A/B
// data):
//   - 50% Cohort A (localStorage) → always neutral
//   - 50% Cohort B (localStorage)
//       - 80% of sessions (sessionStorage) → link state
//       - 20% of sessions → neutral state
//
// Net: 40% link, 60% neutral.
//
// PREVIEW MODE: append `?preview=monitoring` to any /[domain] URL to
// force-render the link branch (bypasses cohort + session + kill-switch).
// Preview mode does NOT fire Umami events so it doesn't pollute A/B data.
//
// KILL-SWITCH: NEXT_PUBLIC_WEBDOWN_LIVE !== "true" suppresses the link
// branch entirely — band still renders, but everyone sees the neutral
// state. Lets us ship the band before web-down.com is live without ever
// surfacing a dead link to a real visitor.

export function MonitoringBand({ domain }: Props) {
  const params = useSearchParams();
  const previewMode = params.get("preview") === "monitoring";

  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [sessionDecision, setSessionDecision] =
    useState<SessionRenderDecision | null>(null);

  useEffect(() => {
    if (previewMode) return; // No tracking in preview mode

    const c = getMonitoringBandCohort();
    setCohort(c);

    // Pageview-with-cohort fires for every visit; A is the baseline
    // denominator for behavioural-comparison metrics.
    trackEvent("result_page_view", { domain, cohort: c ?? "unknown" });

    if (c === "B") {
      const decision = shouldRenderInThisSession();
      setSessionDecision(decision);
    }
  }, [domain, previewMode]);

  // Compute whether to show the link state for this render.
  const linkActive = process.env.NEXT_PUBLIC_WEBDOWN_LIVE === "true";
  const showLink = previewMode
    ? true
    : cohort === "B" && sessionDecision === "show" && linkActive;

  // Fire the rendered-state event once cohort resolves (real visits only).
  useEffect(() => {
    if (previewMode) return;
    if (cohort === null) return; // Not yet resolved client-side
    if (cohort === "B" && linkActive) {
      trackEvent("monitoring_band_eligible", {
        domain,
        decision: sessionDecision ?? "unknown",
      });
    }
    if (showLink) {
      trackEvent("monitoring_band_link_rendered", { domain });
    } else {
      trackEvent("monitoring_band_neutral_rendered", { domain });
    }
  }, [cohort, sessionDecision, showLink, domain, previewMode, linkActive]);

  const handleClick = () => {
    if (!previewMode) {
      trackEvent("monitoring_band_link_clicked", { domain });
    }
  };

  // SSR & hydration guard: don't render the band on the server (cohort
  // resolves client-side from localStorage). Returning null during SSR
  // keeps the prerender deterministic.
  if (!previewMode && cohort === null) return null;

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
          {showLink ? (
            <>
              <span className="text-sm">
                Track <span className="font-mono">{domain}</span> uptime at
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
              {previewMode ? (
                <span className="text-[10px] uppercase tracking-[0.18em] text-success border border-success/40 bg-success/10 rounded px-1.5 py-0.5 font-mono">
                  preview
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
