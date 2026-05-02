import { ArrowLeftRight, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import Link from "next/link";
import type { DomainSnapshot } from "@/lib/types";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toUTCString().replace(/^\w+, /, "").replace(" GMT", "");
}

function ageYears(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor(
    (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  );
}

function Cell({
  value,
  win,
}: {
  value: React.ReactNode;
  win?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3 text-sm font-mono ${
        win
          ? "text-success font-medium"
          : "text-foreground"
      }`}
    >
      {value}
    </td>
  );
}

function Row({
  label,
  cells,
}: {
  label: string;
  cells: { value: React.ReactNode; win?: boolean }[];
}) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <th
        scope="row"
        className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted font-medium align-top w-44"
      >
        {label}
      </th>
      {cells.map((c, i) => (
        <Cell key={i} value={c.value} win={c.win} />
      ))}
    </tr>
  );
}

function sslIcon(ssl: DomainSnapshot["ssl"]) {
  if (!ssl) return <ShieldX className="size-4 text-danger" />;
  if (ssl.valid && (ssl.daysRemaining ?? 0) >= 30)
    return <ShieldCheck className="size-4 text-success" />;
  if (ssl.valid)
    return <ShieldAlert className="size-4 text-warning" />;
  return <ShieldX className="size-4 text-danger" />;
}

export function ComparisonView({
  a,
  b,
}: {
  a: DomainSnapshot;
  b: DomainSnapshot;
}) {
  const aAge = ageYears(a.info.registrationDate);
  const bAge = ageYears(b.info.registrationDate);

  const aOlder = aAge !== null && bAge !== null && aAge > bAge;
  const bOlder = aAge !== null && bAge !== null && bAge > aAge;
  const aHealthier = a.health.score > b.health.score;
  const bHealthier = b.health.score > a.health.score;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface/40">
      <div className="grid grid-cols-2 border-b border-border">
        <div className="px-4 py-5 text-center">
          <Link
            href={`/${a.domain}`}
            className="text-xl sm:text-2xl font-display font-bold hover:underline break-all"
          >
            {a.domain}
          </Link>
        </div>
        <div className="px-4 py-5 text-center border-l border-border">
          <Link
            href={`/${b.domain}`}
            className="text-xl sm:text-2xl font-display font-bold hover:underline break-all"
          >
            {b.domain}
          </Link>
        </div>
      </div>
      <table className="w-full">
        <tbody>
          <Row
            label="Health score"
            cells={[
              { value: a.health.score, win: aHealthier },
              { value: b.health.score, win: bHealthier },
            ]}
          />
          <Row
            label="Age"
            cells={[
              {
                value: aAge !== null ? `${aAge} years` : "—",
                win: aOlder,
              },
              {
                value: bAge !== null ? `${bAge} years` : "—",
                win: bOlder,
              },
            ]}
          />
          <Row
            label="Registered"
            cells={[
              { value: fmtDate(a.info.registrationDate) },
              { value: fmtDate(b.info.registrationDate) },
            ]}
          />
          <Row
            label="Expires"
            cells={[
              { value: fmtDate(a.info.expirationDate) },
              { value: fmtDate(b.info.expirationDate) },
            ]}
          />
          <Row
            label="Registrar"
            cells={[
              { value: a.info.registrar ?? "(hidden)" },
              { value: b.info.registrar ?? "(hidden)" },
            ]}
          />
          <Row
            label="DNSSEC"
            cells={[
              {
                value: a.info.dnssecEnabled ? "enabled" : "off",
                win: a.info.dnssecEnabled && !b.info.dnssecEnabled,
              },
              {
                value: b.info.dnssecEnabled ? "enabled" : "off",
                win: b.info.dnssecEnabled && !a.info.dnssecEnabled,
              },
            ]}
          />
          <Row
            label="SSL"
            cells={[
              {
                value: (
                  <span className="inline-flex items-center gap-1.5">
                    {sslIcon(a.ssl)}
                    {a.ssl?.issuer ?? "—"}
                  </span>
                ),
              },
              {
                value: (
                  <span className="inline-flex items-center gap-1.5">
                    {sslIcon(b.ssl)}
                    {b.ssl?.issuer ?? "—"}
                  </span>
                ),
              },
            ]}
          />
          <Row
            label="Tech vendors"
            cells={[
              { value: a.tech.map((t) => t.vendor).join(", ") || "—" },
              { value: b.tech.map((t) => t.vendor).join(", ") || "—" },
            ]}
          />
        </tbody>
      </table>
      <div className="px-4 py-3 text-xs text-muted flex items-center justify-center gap-2 border-t border-border">
        <ArrowLeftRight className="size-3.5" />
        Wins shown in green where directly comparable
      </div>
    </div>
  );
}
