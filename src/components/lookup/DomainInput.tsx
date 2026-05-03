"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeDomain, getTld } from "@/lib/validate-domain";
import { trackEvent } from "@/lib/umami";

type Props = {
  defaultValue?: string;
  size?: "default" | "lg";
  autoFocus?: boolean;
};

export function DomainInput({ defaultValue = "", size = "lg", autoFocus }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeDomain(value);
    if (!normalized) {
      setError(
        "Enter a valid domain — e.g. example.com (no protocol, no path).",
      );
      return;
    }
    setError(null);
    trackEvent("lookup_domain", { tld: getTld(normalized) });
    router.push(`/${normalized}`);
  }

  const fieldH = size === "lg" ? "h-14" : "h-10";
  const fieldText = size === "lg" ? "text-lg" : "text-base";

  return (
    <form onSubmit={submit} className="w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${size === "lg" ? "size-5" : "size-4"} text-muted`} />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="example.com"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            autoFocus={autoFocus}
            aria-label="Domain to look up"
            className={`${fieldH} ${fieldText} pl-12 font-mono`}
          />
        </div>
        <Button
          type="submit"
          className={`${fieldH} px-6 ${size === "lg" ? "text-base" : "text-sm"}`}
        >
          Look up
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-danger">{error}</p>
      ) : null}
    </form>
  );
}
