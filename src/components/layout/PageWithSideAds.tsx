import type { ReactNode } from "react";
import { AdSlot } from "./AdSlot";

// Single source of truth for the always-on bottom ad. The second ad is
// placed inline at a content break — see <ContentBreakAd /> and the
// page-level usages in app/page.tsx, app/[domain]/page.tsx,
// app/compare/[slug]/page.tsx.
//
// We pass BOTH slotId (read at server-render time, works on dynamic pages)
// AND slot="footer" (runtime fetch fallback for static-prerendered pages).
// AdSlot prefers slotId when non-empty.

const FOOTER_SLOT_ID = process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? "";

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
        slotId={FOOTER_SLOT_ID}
        slot="footer"
        format="banner"
        label="Footer banner"
        reservedHeight={120}
        className="mt-12"
      />
    </div>
  );
}
