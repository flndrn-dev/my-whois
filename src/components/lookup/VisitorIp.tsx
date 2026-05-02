import { headers } from "next/headers";
import { Globe2 } from "lucide-react";

// Server component: reads the requester's IP from forwarded headers.
// IP is rendered to the visitor only; it is never logged, persisted, or
// forwarded anywhere. Owner-approved exception to the no-IP rule
// (see CLAUDE.md → Hard Rules).
export async function VisitorIp() {
  const h = await headers();
  const candidates = [
    h.get("cf-connecting-ip"),
    h.get("x-real-ip"),
    h.get("x-forwarded-for")?.split(",")[0]?.trim(),
  ].filter((v): v is string => Boolean(v));

  const ip = candidates[0];
  if (!ip) return null;

  return (
    <div
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted"
      aria-label="Your public IP address"
    >
      <Globe2 className="size-3.5" />
      <span>your IP:</span>
      <span className="font-mono text-foreground tabular-nums">{ip}</span>
    </div>
  );
}
