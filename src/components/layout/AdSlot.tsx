"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdSlotProps = {
  slotId: string;
  format: "banner" | "rectangle" | "native";
  className?: string;
  reservedHeight: number;
};

const FORMAT_CONFIG = {
  banner: { adFormat: "horizontal", responsive: true },
  rectangle: { adFormat: "rectangle", responsive: false },
  native: {
    adFormat: "fluid",
    responsive: true,
    layoutKey: "-fb+5w+4e-db+86",
  },
} as const;

export function AdSlot({
  slotId,
  format,
  className = "",
  reservedHeight,
}: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const enabled = !!clientId && !!slotId;

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

  if (!enabled) {
    return (
      <div
        className={`ad-slot-placeholder ${className}`}
        style={{ minHeight: reservedHeight }}
        aria-hidden="true"
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
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={config.adFormat}
        data-full-width-responsive={config.responsive ? "true" : "false"}
        {...("layoutKey" in config
          ? { "data-ad-layout-key": config.layoutKey }
          : {})}
      />
    </div>
  );
}
