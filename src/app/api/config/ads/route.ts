import { NextResponse } from "next/server";

// Returns the AdSense client + slot IDs at runtime so statically prerendered
// pages can pick them up after first paint. The static prerender bakes empty
// strings (build container has no env vars), but the runtime container has
// them — so the client AdSlot fetches this endpoint on mount and renders the
// real <ins class="adsbygoogle"> once the config arrives.
//
// Cached for 5 min on the client + 60s on edge so this isn't hit on every
// page render — the ad config changes once a quarter at most.

export const dynamic = "force-dynamic";

const DEFAULT_CLIENT_ID = "ca-pub-3928224800312187";

export type AdsConfig = {
  clientId: string;
  slots: {
    mid: string;
    footer: string;
  };
};

export async function GET() {
  const body: AdsConfig = {
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? DEFAULT_CLIENT_ID,
    slots: {
      mid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID ?? "",
      footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? "",
    },
  };
  return NextResponse.json(body, {
    headers: {
      "Cache-Control":
        "public, max-age=300, s-maxage=60, stale-while-revalidate=600",
    },
  });
}
