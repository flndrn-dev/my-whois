import type { ReactNode } from "react";
import { AdSlot } from "./AdSlot";

// Single source of truth for the always-on bottom ad. The second ad on
// each page is placed inline at a natural content break — see
// <ContentBreakAd /> and the page-level usages in app/page.tsx,
// app/[domain]/page.tsx, app/compare/[slug]/page.tsx.
//
// Slot ID resolves at runtime via /api/config/ads so static-prerendered
// pages still pick up the live slot from the runtime container.

type Props = {
  children: ReactNode;
  /** When false, content is centered with max-w-3xl (about / privacy / terms). */
  wide?: boolean;
};

export function PageWithSideAds({ children, wide = false }: Props) {
  return (
    <div className="container-content py-8 sm:py-10">
      <main className={`min-w-0 ${wide ? "" : "max-w-3xl mx-auto w-full"}`}>
        {children}
      </main>

      <AdSlot
        slot="footer"
        format="banner"
        label="Footer banner"
        reservedHeight={120}
        className="mt-12"
      />
    </div>
  );
}
