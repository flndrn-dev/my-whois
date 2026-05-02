"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdSlotProps = {
  slotId: string;
  format: "banner" | "rectangle" | "skyscraper" | "native";
  /** Position label shown in the placeholder (e.g., "Sidebar — top"). */
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
  status: "pre-approval" | "pending-slot";
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
        {status === "pending-slot"
          ? "Slot ID pending in env"
          : "Reserved for advertising"}
      </span>
    </div>
  );
}

export function AdSlot({
  slotId,
  format,
  label,
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

  if (!clientId) {
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

  if (!slotId) {
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
