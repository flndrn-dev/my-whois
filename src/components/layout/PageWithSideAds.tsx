import type { ReactNode } from "react";
import { AdSlot } from "./AdSlot";

// Single source of truth for ad placement across every page.
// 2 horizontal responsive banner ads: one above content, one below.
// Banners are full-width (responsive) and adapt their height — no
// sidebar rail. Component name is preserved to avoid churn across
// every page that imports it.

type Props = {
  children: ReactNode;
  /** When false, content is centered with max-w-3xl (about / privacy / terms). */
  wide?: boolean;
};

export function PageWithSideAds({ children, wide = false }: Props) {
  return (
    <div className="container-content py-8 sm:py-10">
      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_TOP ?? ""}
        format="banner"
        label="Top banner"
        reservedHeight={120}
        className="mb-8"
      />

      <main className={`min-w-0 ${wide ? "" : "max-w-3xl mx-auto w-full"}`}>
        {children}
      </main>

      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_BOTTOM ?? ""}
        format="banner"
        label="Bottom banner"
        reservedHeight={120}
        className="mt-10"
      />
    </div>
  );
}
