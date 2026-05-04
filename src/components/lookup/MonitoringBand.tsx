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

const WEBDOWN_URL_AB =
  "https://web-down.com?utm_source=my-whois&utm_medium=monitoring-band&utm_campaign=ab-test";
const WEBDOWN_URL_MONITORED =
  "https://web-down.com?utm_source=my-whois&utm_medium=monitoring-band&utm_campaign=monitored";

type Props = {
  domain: string;
};

// MonitoringBand — three rendering modes:
//
// 1. MONITORED MODE
//    Green pulsing dot + "Monitored" label + button-styled "View
//    dashboard ↗" CTA linking to web-down.com. Triggered by the
//    real-time check at /api/is-monitored/[domain] returning true.
//    The server proxies to web-down.com so newly-added customer
//    domains light up without a code redeploy on this side. The link
//    is factually true here, so the band bypasses the A/B test.
//
// 2. STANDARD A/B MODE  (every other domain)
//    Same 40/60 link/neutral split as before:
//      - Cohort A: always neutral
//      - Cohort B: 80% sessions show link, 20% show neutral
//      - Net: 40% link, 60% neutral
//
// 3. NEUTRAL STATE  (Cohort A, OR Cohort B with session "hide")
//    Green pulsing dot + "Live · reachable just now". Truthful since
//    the page only renders if the domain lookup succeeded.
//
// PREVIEW QUERY PARAMS:
//   ?preview=monitoring  → force STANDARD link branch (current copy)
//   ?preview=monitored   → force MONITORED variant (green-pulse copy)
// Both bypass cohort + session + real-time check. Neither fires Umami
// events so preview doesn't pollute A/B data.

type RealTimeCheck = "unknown" | "monitored" | "not-monitored";

export function MonitoringBand({ domain }: Props) {
  const params = useSearchParams();
  const previewStandard = params.get("preview") === "monitoring";
  const previewMonitored = params.get("preview") === "monitored";

  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [sessionDecision, setSessionDecision] =
    useState<SessionRenderDecision | null>(null);
  const [realTimeCheck, setRealTimeCheck] = useState<RealTimeCheck>("unknown");

  const isMonitored = realTimeCheck === "monitored";

  // Determine which variant to render this paint.
  let mode: "monitored" | "link" | "neutral";
  if (previewMonitored) {
    mode = "monitored";
  } else if (previewStandard) {
    mode = "link";
  } else if (isMonitored) {
    mode = "monitored";
  } else if (cohort === "B" && sessionDecision === "show") {
    mode = "link";
  } else {
    mode = "neutral";
  }

  // Cohort + session resolution. Always runs for real visits — the band
  // mode upgrades to "monitored" if the parallel real-time fetch comes
  // back true, which sidesteps the A/B branch in the rendered output.
  useEffect(() => {
    if (previewStandard || previewMonitored) return;

    const c = getMonitoringBandCohort();
    setCohort(c);

    trackEvent("result_page_view", { domain, cohort: c ?? "unknown" });

    if (c === "B") {
      const decision = shouldRenderInThisSession();
      setSessionDecision(decision);
    }
  }, [domain, previewStandard, previewMonitored]);

  // Real-time check against /api/is-monitored. Aborts after 2.5s; on
  // any failure we mark "not-monitored" so the band doesn't stall
  // waiting forever.
  useEffect(() => {
    if (previewStandard || previewMonitored) return;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    fetch(`/api/is-monitored/${encodeURIComponent(domain)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((res) => (res.ok ? res.json() : { monitored: false }))
      .then((data: { monitored?: unknown }) => {
        setRealTimeCheck(data.monitored === true ? "monitored" : "not-monitored");
      })
      .catch(() => {
        setRealTimeCheck("not-monitored");
      })
      .finally(() => clearTimeout(timer));

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [domain, previewStandard, previewMonitored]);

  // Render-state events (real visits only).
  useEffect(() => {
    if (previewStandard || previewMonitored) return;

    if (mode === "monitored") {
      trackEvent("monitoring_band_monitored_rendered", { domain });
      return;
    }

    if (cohort === null) return; // Wait for client-side cohort resolution

    if (cohort === "B") {
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
  ]);

  const handleClick = () => {
    if (previewStandard || previewMonitored) return;
    if (isMonitored) {
      trackEvent("monitoring_band_monitored_clicked", { domain });
    } else {
      trackEvent("monitoring_band_link_clicked", { domain });
    }
  };

  // SSR / hydration guard: preview renders immediately. Other lookups
  // wait until BOTH the cohort and the real-time check have resolved —
  // otherwise a remotely-monitored domain would briefly flash the
  // neutral or link variant before upgrading.
  if (
    !previewStandard &&
    !previewMonitored &&
    (cohort === null || realTimeCheck === "unknown")
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
                <span>Monitored by</span>
                <a
                  href={WEBDOWN_URL_MONITORED}
                  onClick={handleClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:text-accent transition-colors"
                >
                  web-down.com
                </a>
              </span>
              <a
                href={WEBDOWN_URL_MONITORED}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-mono rounded border border-success/40 bg-success/10 px-2.5 py-1 text-success hover:bg-success/20 hover:border-success/60 transition-colors"
              >
                View dashboard
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
