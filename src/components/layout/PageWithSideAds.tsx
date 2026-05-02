import type { ReactNode } from "react";
import { AdSlot } from "./AdSlot";

// Single source of truth for ad placement across every page.
// Two sidebars (left + right), each with a 300×250 rectangle on top and a
// 300×600 half-page below it. Sidebars are hidden under lg breakpoint —
// content gets the full width on tablet/mobile.

type Props = {
  children: ReactNode;
  /** When false, content gets max-w-3xl for narrow text pages (about / privacy / terms). */
  wide?: boolean;
};

function SideRail({ side }: { side: "left" | "right" }) {
  return (
    <aside
      className="hidden lg:flex flex-col gap-6 sticky top-24 self-start"
      aria-label={`${side} sidebar advertisements`}
    >
      <AdSlot
        slotId={
          side === "left"
            ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_LEFT_TOP ?? ""
            : process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_RIGHT_TOP ?? ""
        }
        format="rectangle"
        label={`${side === "left" ? "Left" : "Right"} sidebar — square`}
        reservedHeight={250}
      />
      <AdSlot
        slotId={
          side === "left"
            ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_LEFT_BOTTOM ?? ""
            : process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_RIGHT_BOTTOM ?? ""
        }
        format="skyscraper"
        label={`${side === "left" ? "Left" : "Right"} sidebar — vertical`}
        reservedHeight={600}
      />
    </aside>
  );
}

export function PageWithSideAds({ children, wide = false }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 py-8 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_300px] gap-8 items-start">
        <SideRail side="left" />
        <main className={`min-w-0 ${wide ? "" : "max-w-3xl mx-auto w-full"}`}>
          {children}
        </main>
        <SideRail side="right" />
      </div>
    </div>
  );
}
