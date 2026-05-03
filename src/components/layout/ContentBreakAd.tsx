import { AdSlot } from "./AdSlot";

// Inline horizontal banner placed between content sections — used at the
// natural reading break on /, /[domain], /compare/[slug] so the ad reads
// as a section divider after the user has gotten value, not as a barrier
// before the tool.
//
// Slot ID resolves at runtime via /api/config/ads (see AdSlot) so static
// pages still pick up the live ID from the runtime container without
// needing a Docker build-arg pipeline.

type Props = {
  className?: string;
};

export function ContentBreakAd({ className = "my-12" }: Props) {
  return (
    <AdSlot
      slot="mid"
      format="banner"
      label="Mid-content break"
      reservedHeight={120}
      className={className}
    />
  );
}
