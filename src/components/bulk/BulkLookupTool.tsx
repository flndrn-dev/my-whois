"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, AlertCircle, Loader2, Play } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

type Row = {
  input: string;
  domain: string | null;
  ageYears: number | null;
  registrar: string | null;
  expirationDate: string | null;
  daysToExpiry: number | null;
  health: number | null;
  tier: "green" | "amber" | "red" | null;
  ssl: "valid" | "expired" | "missing" | null;
  dnssec: boolean | null;
  error: string | null;
};

type State =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "done"; rows: Row[] }
  | { kind: "error"; message: string };

const TIER_CLASS: Record<NonNullable<Row["tier"]>, string> = {
  green: "text-success",
  amber: "text-warning",
  red: "text-danger",
};

function fmtDateShort(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().split("T")[0];
}

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function rowsToCsv(rows: Row[]): string {
  const header = [
    "input",
    "domain",
    "age_years",
    "registrar",
    "expiration_date",
    "days_to_expiry",
    "health_score",
    "tier",
    "ssl",
    "dnssec",
    "error",
  ];
  const lines = rows.map((r) =>
    [
      csvCell(r.input),
      csvCell(r.domain),
      csvCell(r.ageYears),
      csvCell(r.registrar),
      csvCell(r.expirationDate),
      csvCell(r.daysToExpiry),
      csvCell(r.health),
      csvCell(r.tier),
      csvCell(r.ssl),
      csvCell(r.dnssec === null ? "" : r.dnssec ? "yes" : "no"),
      csvCell(r.error),
    ].join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export function BulkLookupTool() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const lineCount = useMemo(
    () => input.split(/[\s,;]+/).filter((s) => s.trim().length > 0).length,
    [input],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lineCount === 0) return;
    setState({ kind: "running" });
    try {
      const res = await fetch("/api/bulk-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState({
          kind: "error",
          message: data.error ?? `Request failed (${res.status})`,
        });
        return;
      }
      setState({ kind: "done", rows: data.rows as Row[] });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  function downloadCsv() {
    if (state.kind !== "done") return;
    const csv = rowsToCsv(state.rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `my-whois-bulk-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-border bg-surface/40 p-6"
      >
        <label
          htmlFor="bulk-input"
          className="block text-xs uppercase tracking-[0.18em] text-muted mb-2"
        >
          Domains ({lineCount}/100)
        </label>
        <textarea
          id="bulk-input"
          rows={8}
          placeholder={"google.com\nmicrosoft.com\napple.com\n..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={state.kind === "running"}
          className="w-full font-mono text-sm bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-y"
        />
        {state.kind === "error" ? (
          <div className="mt-3 flex items-start gap-2 text-sm text-danger">
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            <span>{state.message}</span>
          </div>
        ) : null}
        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-muted">
            One per line, comma-, or space-separated. Up to 100 per run.
          </p>
          <Button
            type="submit"
            disabled={state.kind === "running" || lineCount === 0 || lineCount > 100}
          >
            {state.kind === "running" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Looking up {lineCount} domains...
              </>
            ) : (
              <>
                <Play className="size-4" />
                Run bulk lookup
              </>
            )}
          </Button>
        </div>
      </form>

      {state.kind === "done" ? (
        <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
          <div className="flex items-center justify-between gap-4 p-4 border-b border-border flex-wrap">
            <p className="text-sm text-muted">
              <span className="text-foreground font-semibold">
                {state.rows.length}
              </span>{" "}
              {state.rows.length === 1 ? "result" : "results"}
            </p>
            <Button onClick={downloadCsv} variant="outline" size="sm">
              <Download className="size-4" />
              Download CSV
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Domain</th>
                  <th className="text-right font-medium px-4 py-3">Age</th>
                  <th className="text-left font-medium px-4 py-3">Registrar</th>
                  <th className="text-right font-medium px-4 py-3">Expires</th>
                  <th className="text-right font-medium px-4 py-3">Health</th>
                  <th className="text-left font-medium px-4 py-3">SSL</th>
                  <th className="text-left font-medium px-4 py-3">DNSSEC</th>
                </tr>
              </thead>
              <tbody>
                {state.rows.map((r, i) => (
                  <tr
                    key={`${r.input}-${i}`}
                    className="border-t border-border hover:bg-background/30"
                  >
                    <td className="px-4 py-3 font-mono">
                      {r.domain ? (
                        <Link
                          href={`/${r.domain}`}
                          className="hover:text-accent transition-colors"
                        >
                          {r.domain}
                        </Link>
                      ) : (
                        <span className="text-muted">{r.input}</span>
                      )}
                      {r.error ? (
                        <span className="block text-xs text-danger mt-0.5">
                          {r.error}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {r.ageYears != null ? `${r.ageYears}y` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {r.registrar ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      {r.expirationDate ? (
                        <>
                          {fmtDateShort(r.expirationDate)}
                          {r.daysToExpiry != null ? (
                            <span
                              className={`block ${
                                r.daysToExpiry < 0
                                  ? "text-danger"
                                  : r.daysToExpiry < 30
                                    ? "text-warning"
                                    : "text-muted"
                              }`}
                            >
                              {r.daysToExpiry < 0
                                ? `${Math.abs(r.daysToExpiry)}d ago`
                                : `${r.daysToExpiry}d`}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {r.health != null ? (
                        <span className={r.tier ? TIER_CLASS[r.tier] : ""}>
                          {r.health}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.ssl ? (
                        <span
                          className={
                            r.ssl === "valid"
                              ? "text-success"
                              : r.ssl === "expired"
                                ? "text-warning"
                                : "text-danger"
                          }
                        >
                          {r.ssl}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.dnssec === null ? (
                        "—"
                      ) : r.dnssec ? (
                        <span className="text-success">yes</span>
                      ) : (
                        <span className="text-muted">no</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
