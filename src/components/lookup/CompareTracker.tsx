"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/umami";

export function CompareTracker({ a, b }: { a: string; b: string }) {
  useEffect(() => {
    trackEvent("compare_domains", { a, b });
  }, [a, b]);
  return null;
}
