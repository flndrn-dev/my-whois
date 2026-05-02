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
  /** Position label shown in the pre-approval placeholder (e.g., "Header", "Sidebar"). */
  label?: string;
  className?: string;
  reservedHeight: number;
};

const FORMAT_CONFIG = {
  banner: { adFormat: "horizontal", responsive: true, sizeHint: "728×90 desktop · 320×50 mobile" },
  rectangle: { adFormat: "rectangle", responsive: false, sizeHint: "300×250" },
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
      className={`ad-slot-placeholder rounded-lg border-2 border-dashed border-border/70 bg-surface/40 flex flex-col items-center justify-center gap-1 text-muted px-4 ${className}`}
      style={{ minHeight: reservedHeight }}
      role="complementary"
      aria-label="Advertising placement"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent/80">
        Google AdSense
      </span>
      <span className="text-xs font-medium text-foreground/70">
        {label ?? "Ad placement"}
      </span>
      <span className="text-[11px] opacity-70">
        {format} · {config.sizeHint}
      </span>
      <span className="text-[10px] opacity-50 italic">
        {status === "pending-slot"
          ? "Slot ID pending"
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

  // Pre-approval (no client ID) — show a visible labelled placeholder so
  // both we and the AdSense reviewer can see where ads will land.
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

  // AdSense configured but this specific slot ID isn't yet — same visible
  // placeholder, different status caption.
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
