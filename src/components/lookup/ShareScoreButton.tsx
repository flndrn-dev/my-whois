"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/umami";

export function ShareScoreButton({
  domain,
  score,
}: {
  domain: string;
  score: number;
}) {
  const text = `${domain} scored ${score}/100 on my whois — domain age, DNS, SSL & tech stack in one view`;
  const url = `https://my-whois.com/${domain}`;
  const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  return (
    <Button asChild variant="outline" size="sm">
      <a
        href={intent}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("share_score", { domain, score })}
      >
        <Share2 className="size-4" />
        Share score
      </a>
    </Button>
  );
}
