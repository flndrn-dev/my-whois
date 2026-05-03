// A/B-test infrastructure for the MonitoringBand cross-promo to web-down.com.
//
// Two-level randomness:
//
// 1. Persistent cohort assignment (localStorage). 50/50 split between
//    Cohort A (control, never sees the band) and Cohort B (treatment,
//    eligible to see the band). Same browser = same cohort forever.
//
// 2. Per-session render decision (sessionStorage). Within Cohort B, each
//    new browser session has a 50/50 chance of "show" vs "hide". Stays
//    consistent within the session, fresh coin flip on next session.
//
// Net effect: ~25% of total pageviews actually render the band, and the
// double randomness makes the appearance feel like organic metadata
// rather than a fixed cross-promo.

const COHORT_KEY = "flndrn_mb_cohort";
const SESSION_RENDER_KEY = "flndrn_mb_session_render";

export type Cohort = "A" | "B";
export type SessionRenderDecision = "show" | "hide";

/**
 * Returns the visitor's cohort assignment for the MonitoringBand A/B test.
 *
 * Cohort A: control — NEVER sees the band, regardless of session.
 * Cohort B: treatment — eligible to see the band, subject to per-session
 * coin flip via {@link shouldRenderInThisSession}.
 *
 * Assignment is randomised on first visit, then stored in localStorage to
 * persist across pages, sessions, and weeks for the same browser.
 *
 * Returns null on the server — components must guard for SSR.
 *
 * If localStorage is blocked (privacy mode, Tor, strict iOS Safari) the
 * function falls back to Cohort A — biasing toward "no band" so blocked
 * users see the cleanest experience.
 */
export function getMonitoringBandCohort(): Cohort | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(COHORT_KEY);
    if (stored === "A" || stored === "B") return stored;

    const cohort: Cohort = Math.random() < 0.5 ? "A" : "B";
    window.localStorage.setItem(COHORT_KEY, cohort);
    return cohort;
  } catch {
    return "A";
  }
}

/**
 * Within Cohort B only, decides whether the band should render in the
 * current browser session.
 *
 * 50% chance of "show", persisted via sessionStorage. The decision stays
 * consistent across page navigations within the session, but resets when
 * the session ends (browser close, sessionStorage expiry).
 *
 * Only call for visitors confirmed to be in Cohort B — calling for Cohort A
 * is a logic error and may pollute the storage with irrelevant entries.
 *
 * Returns null on the server — components must guard for SSR.
 *
 * If sessionStorage is blocked, falls back to "hide".
 */
export function shouldRenderInThisSession(): SessionRenderDecision | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.sessionStorage.getItem(SESSION_RENDER_KEY);
    if (stored === "show" || stored === "hide") return stored;

    // 80% probability of "show" within Cohort B, so the cross-promo link
    // appears in roughly 40% of total pageviews (50% B × 80% show).
    // Lower than 100% so even Cohort B visitors see the band varying
    // between sessions and don't perceive it as a fixed CTA.
    const decision: SessionRenderDecision =
      Math.random() < 0.8 ? "show" : "hide";
    window.sessionStorage.setItem(SESSION_RENDER_KEY, decision);
    return decision;
  } catch {
    return "hide";
  }
}

/**
 * Reset both the persistent cohort and the per-session decision.
 * Debug helper only — never expose this in the UI.
 */
export function resetMonitoringBandState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(COHORT_KEY);
    window.sessionStorage.removeItem(SESSION_RENDER_KEY);
  } catch {
    // ignore
  }
}
