"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type SlotKey = "mid" | "footer";

type AdSlotProps = {
  /** Either pass an explicit slot ID OR set `slot` and let the component fetch
   *  the live ID from /api/config/ads at runtime. The latter lets statically
   *  prerendered pages pick up env values from the runtime container instead
   *  of being baked at build time. */
  slotId?: string;
  slot?: SlotKey;
  format: "banner" | "rectangle" | "skyscraper" | "native";
  /** Position label shown in the placeholder. */
  label?: string;
  className?: string;
  reservedHeight: number;
};

const FORMAT_CONFIG = {
  banner: { adFormat: "horizontal", responsive: true, sizeHint: "728×90 / 320×50" },
  rectangle: { adFormat: "rectangle", responsive: false, sizeHint: "300×250" },
  skyscraper: { adFormat: "vertical", responsive: false, sizeHint: "300×600 half-page" },
  native: {
    adFormat: "fluid",
    responsive: true,
    layoutKey: "-fb+5w+4e-db+86",
    sizeHint: "responsive native",
  },
} as const;

const DEFAULT_CLIENT_ID = "ca-pub-3928224800312187";

// Module-level cache so multiple AdSlot mounts share one fetch per page load.
let configCache: Promise<{
  clientId: string;
  slots: { mid: string; footer: string };
}> | null = null;

function fetchAdsConfig() {
  if (configCache) return configCache;
  configCache = fetch("/api/config/ads", { cache: "force-cache" })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (
        j &&
        typeof j.clientId === "string" &&
        j.slots &&
        typeof j.slots.mid === "string" &&
        typeof j.slots.footer === "string"
      ) {
        return j;
      }
      return {
        clientId: DEFAULT_CLIENT_ID,
        slots: { mid: "", footer: "" },
      };
    })
    .catch(() => ({
      clientId: DEFAULT_CLIENT_ID,
      slots: { mid: "", footer: "" },
    }));
  return configCache;
}

function Placeholder({
  className,
  reservedHeight,
  format,
  label,
  status,
}: {
  className: string;
  reservedHeight: number;
  format: AdSlotProps["format"];
  label?: string;
  status: "pre-approval" | "pending-slot" | "loading";
}) {
  const config = FORMAT_CONFIG[format];
  return (
    <div
      className={`ad-slot-placeholder relative rounded-lg border-2 border-dashed border-accent/70 bg-accent/10 flex flex-col items-center justify-center gap-1.5 px-4 text-center ${className}`}
      style={{ minHeight: reservedHeight }}
      role="complementary"
      aria-label="Advertising placement"
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
        Google AdSense
      </span>
      <span className="text-sm font-semibold text-foreground">
        {label ?? "Ad placement"}
      </span>
      <span className="text-xs text-muted">
        {format} · {config.sizeHint}
      </span>
      <span className="text-[10px] text-muted/80 italic mt-1">
        {status === "loading"
          ? "Loading ad config…"
          : status === "pending-slot"
            ? "Slot ID pending in env"
            : "Reserved for advertising"}
      </span>
    </div>
  );
}

export function AdSlot({
  slotId: slotIdProp,
  slot,
  format,
  label,
  className = "",
  reservedHeight,
}: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);

  // If the caller passed a non-empty slotIdProp at SSR time, use it
  // directly — we never want to flash a loading placeholder when we
  // already know the ID. Empty prop means we either need to fetch
  // (slot key was passed) or there's nothing to render.
  const hasInitialSlotId = !!slotIdProp;

  const [resolvedSlotId, setResolvedSlotId] = useState<string>(
    slotIdProp ?? "",
  );
  const [resolvedClientId, setResolvedClientId] =
    useState<string>(DEFAULT_CLIENT_ID);
  const [loading, setLoading] = useState<boolean>(
    !hasInitialSlotId && slot != null,
  );

  // Only fetch when we don't already have a slotId AND a slot key was
  // provided. If neither, render the pending-slot placeholder (or
  // nothing-renderable state).
  useEffect(() => {
    if (hasInitialSlotId) return;
    if (!slot) return;
    let cancelled = false;
    fetchAdsConfig().then((cfg) => {
      if (cancelled) return;
      setResolvedClientId(cfg.clientId);
      setResolvedSlotId(cfg.slots[slot] || "");
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [hasInitialSlotId, slot]);

  const enabled = !!resolvedClientId && !!resolvedSlotId;

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch {
            // AdSense push errors are common during navigation; silently ignore
          }
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled]);

  if (loading) {
    return (
      <Placeholder
        className={className}
        reservedHeight={reservedHeight}
        format={format}
        label={label}
        status="loading"
      />
    );
  }

  if (!resolvedClientId) {
    return (
      <Placeholder
        className={className}
        reservedHeight={reservedHeight}
        format={format}
        label={label}
        status="pre-approval"
      />
    );
  }

  if (!resolvedSlotId) {
    return (
      <Placeholder
        className={className}
        reservedHeight={reservedHeight}
        format={format}
        label={label}
        status="pending-slot"
      />
    );
  }

  const config = FORMAT_CONFIG[format];

  return (
    <div className={`ad-slot ${className}`} style={{ minHeight: reservedHeight }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={resolvedClientId}
        data-ad-slot={resolvedSlotId}
        data-ad-format={config.adFormat}
        data-full-width-responsive={config.responsive ? "true" : "false"}
        {...("layoutKey" in config
          ? { "data-ad-layout-key": config.layoutKey }
          : {})}
      />
    </div>
  );
}
