import { AdSlot } from "./AdSlot";

// Inline horizontal banner placed between content sections — used at the
// natural reading break on /, /[domain], /compare/[slug] so the ad reads
// as a section divider after the user has gotten value, not as a barrier
// before the tool. Reuses NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_TOP so no new
// env var is needed in Dokploy.

type Props = {
  className?: string;
};

export function ContentBreakAd({ className = "my-12" }: Props) {
  return (
    <AdSlot
      slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_TOP ?? ""}
      format="banner"
      label="Mid-content break"
      reservedHeight={120}
      className={className}
    />
  );
}
