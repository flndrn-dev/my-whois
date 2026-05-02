import type { ReactNode } from "react";
import { AdSlot } from "./AdSlot";

// Single source of truth for ad placement across every page.
// One sidebar (right), with a 300×250 square on top and a 300×600 vertical
// below it. Hidden under lg breakpoint — content gets full width on
// tablet/mobile.

type Props = {
  children: ReactNode;
  /** When false, content is centered with max-w-3xl (about / privacy / terms). */
  wide?: boolean;
};

function RightRail() {
  return (
    <aside
      className="hidden lg:flex flex-col gap-6 sticky top-24 self-start"
      aria-label="Sidebar advertisements"
    >
      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_TOP ?? ""}
        format="rectangle"
        label="Sidebar — square"
        reservedHeight={250}
      />
      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_BOTTOM ?? ""}
        format="skyscraper"
        label="Sidebar — vertical"
        reservedHeight={600}
      />
    </aside>
  );
}

export function PageWithSideAds({ children, wide = false }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-8 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 items-start">
        <main className={`min-w-0 ${wide ? "" : "max-w-3xl mx-auto w-full"}`}>
          {children}
        </main>
        <RightRail />
      </div>
    </div>
  );
}
