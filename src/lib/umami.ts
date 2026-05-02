"use client";

// Tiny client-side wrapper for Umami custom events. Safe to call from
// anywhere — no-ops cleanly if Umami isn't loaded (e.g. when
// NEXT_PUBLIC_UMAMI_WEBSITE_ID isn't set).

declare global {
  interface Window {
    umami?: {
      track: (
        event: string,
        properties?: Record<string, string | number | boolean>,
      ) => void;
    };
  }
}

export function trackEvent(
  event: string,
  properties?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event, properties);
  } catch {
    // never let analytics break the app
  }
}
