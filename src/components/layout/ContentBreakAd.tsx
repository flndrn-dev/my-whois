import { AdSlot } from "./AdSlot";

// Inline horizontal banner placed between content sections — used at the
// natural reading break on /, /[domain], /compare/[slug] so the ad reads
// as a section divider after the user has gotten value, not as a barrier
// before the tool.
//
// Pass slotId (server-side env read for dynamic pages) AND slot="mid"
// (runtime fetch fallback for static prerenders). AdSlot prefers slotId
// when non-empty.

const MID_SLOT_ID = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID ?? "";

type Props = {
  className?: string;
};

export function ContentBreakAd({ className = "my-12" }: Props) {
  return (
    <AdSlot
      slotId={MID_SLOT_ID}
      slot="mid"
      format="banner"
      label="Mid-content break"
      reservedHeight={120}
      className={className}
    />
  );
}
