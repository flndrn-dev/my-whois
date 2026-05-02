"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | {
      kind: "success";
      domain: string;
      expirationDate: string | null;
      daysRemaining: number | null;
    }
  | { kind: "error"; message: string };

export function WatchlistForm() {
  const params = useSearchParams();
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    const seed = params.get("domain");
    if (seed && !domain) setDomain(seed.toLowerCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/watchlist/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, domain }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState({
          kind: "error",
          message: data.error ?? `Request failed (${res.status})`,
        });
        return;
      }
      setState({
        kind: "success",
        domain: data.domain,
        expirationDate: data.expirationDate,
        daysRemaining: data.daysRemaining,
      });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <div className="rounded-xl border border-accent/40 bg-accent/10 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="size-5 mt-0.5 text-accent shrink-0" />
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold">
              You&rsquo;re on the list for {state.domain}.
            </h3>
            {state.expirationDate && state.daysRemaining != null ? (
              <p className="mt-2 text-sm text-muted">
                Current expiry:{" "}
                <span className="font-mono text-foreground">
                  {new Date(state.expirationDate)
                    .toUTCString()
                    .split(" ")
                    .slice(0, 4)
                    .join(" ")}
                </span>{" "}
                ({state.daysRemaining} days from now).
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted">
                The expiry date wasn&rsquo;t in the public record yet — we&rsquo;ll keep
                checking and email you once it surfaces.
              </p>
            )}
            <p className="mt-3 text-sm text-muted">
              Confirmation email is on its way. We&rsquo;ll send the next alert
              30 days before expiry.
            </p>
            <button
              type="button"
              onClick={() => {
                setDomain("");
                setEmail("");
                setState({ kind: "idle" });
              }}
              className="mt-4 text-sm text-accent hover:underline"
            >
              Add another domain →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-surface/40 p-6 space-y-4"
    >
      <div>
        <label
          htmlFor="watchlist-domain"
          className="block text-xs uppercase tracking-[0.18em] text-muted mb-2"
        >
          Domain
        </label>
        <input
          id="watchlist-domain"
          type="text"
          placeholder="example.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          disabled={state.kind === "submitting"}
          className="w-full font-mono text-base bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="watchlist-email"
          className="block text-xs uppercase tracking-[0.18em] text-muted mb-2"
        >
          Email
        </label>
        <input
          id="watchlist-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoCapitalize="off"
          autoComplete="email"
          spellCheck={false}
          disabled={state.kind === "submitting"}
          className="w-full text-base bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {state.kind === "error" ? (
        <div className="flex items-start gap-2 text-sm text-[#F85149]">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full sm:w-auto"
      >
        <Bell className="size-4" />
        {state.kind === "submitting" ? "Adding..." : "Watch this domain"}
      </Button>

      <p className="text-xs text-muted">
        We email you 30, 14, and 7 days before the registration expires. No
        marketing, no list-sharing. Reply to any email to unsubscribe.
      </p>
    </form>
  );
}
