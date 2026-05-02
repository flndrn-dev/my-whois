import { ShieldCheck, ShieldAlert, ShieldX, Calendar, Server, Globe, Building2 } from "lucide-react";
import type { DomainSnapshot } from "@/lib/types";

function Band({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 py-5 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-2 sm:w-44 shrink-0 text-[var(--color-muted)]">
        <span className="size-5 shrink-0">{icon}</span>
        <span className="uppercase text-xs tracking-wide font-medium">
          {label}
        </span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function fmtDate(iso: string | null) {
  if (!iso) return "(unknown)";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toUTCString().replace(/^\w+, /, "");
}

function daysFromNow(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function RegistrarBand({ info }: { info: DomainSnapshot["info"] }) {
  return (
    <Band icon={<Building2 />} label="Registrar">
      <div className="font-mono text-sm">{info.registrar ?? "(hidden)"}</div>
      {info.status.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {info.status.map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)] font-mono"
            >
              {s}
            </span>
          ))}
        </div>
      ) : null}
    </Band>
  );
}

export function DatesBand({ info }: { info: DomainSnapshot["info"] }) {
  const expiryDays = daysFromNow(info.expirationDate);
  const expiryColor =
    expiryDays === null
      ? "text-[var(--color-muted)]"
      : expiryDays < 0
        ? "text-[var(--color-danger)]"
        : expiryDays < 30
          ? "text-[var(--color-warning)]"
          : "text-[var(--color-success)]";
  return (
    <Band icon={<Calendar />} label="Dates">
      <dl className="grid sm:grid-cols-3 gap-3 sm:gap-6 text-sm">
        <div>
          <dt className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
            Created
          </dt>
          <dd className="font-mono">{fmtDate(info.registrationDate)}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
            Updated
          </dt>
          <dd className="font-mono">{fmtDate(info.lastChangedDate)}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
            Expires
          </dt>
          <dd className="font-mono">
            {fmtDate(info.expirationDate)}
            {expiryDays !== null ? (
              <span className={`block text-xs mt-0.5 ${expiryColor}`}>
                {expiryDays < 0
                  ? `expired ${Math.abs(expiryDays)} days ago`
                  : `${expiryDays} days remaining`}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>
    </Band>
  );
}

export function NameserversBand({ info }: { info: DomainSnapshot["info"] }) {
  return (
    <Band icon={<Server />} label="Nameservers">
      {info.nameservers.length === 0 ? (
        <span className="text-[var(--color-muted)]">(none reported)</span>
      ) : (
        <ul className="font-mono text-sm space-y-0.5">
          {info.nameservers.map((ns) => (
            <li key={ns}>{ns}</li>
          ))}
        </ul>
      )}
      <p className="text-xs text-[var(--color-muted)] mt-2">
        DNSSEC:{" "}
        {info.dnssecEnabled ? (
          <span className="text-[var(--color-success)]">enabled</span>
        ) : (
          <span className="text-[var(--color-warning)]">not enabled</span>
        )}
      </p>
    </Band>
  );
}

export function SslInfoBand({ ssl }: { ssl: DomainSnapshot["ssl"] }) {
  if (!ssl) {
    return (
      <Band icon={<ShieldX className="text-[var(--color-danger)]" />} label="SSL">
        <span className="text-[var(--color-muted)]">
          No SSL certificate detected.
        </span>
      </Band>
    );
  }
  const Icon = ssl.valid
    ? ShieldCheck
    : (ssl.daysRemaining ?? 0) <= 0
      ? ShieldX
      : ShieldAlert;
  const color = ssl.valid
    ? "text-[var(--color-success)]"
    : "text-[var(--color-danger)]";
  return (
    <Band icon={<Icon className={color} />} label="SSL certificate">
      <dl className="grid sm:grid-cols-2 gap-3 sm:gap-6 text-sm">
        <div>
          <dt className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
            Issuer
          </dt>
          <dd className="font-mono">{ssl.issuer ?? "(unknown)"}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
            Valid until
          </dt>
          <dd className="font-mono">
            {fmtDate(ssl.validTo)}
            {ssl.daysRemaining !== null ? (
              <span className="block text-xs mt-0.5 text-[var(--color-muted)]">
                {ssl.daysRemaining} days remaining
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
            Subject
          </dt>
          <dd className="font-mono break-all">{ssl.subject ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
            Protocol
          </dt>
          <dd className="font-mono">{ssl.protocol ?? "—"}</dd>
        </div>
      </dl>
    </Band>
  );
}

export function TechStackBand({ tech }: { tech: DomainSnapshot["tech"] }) {
  if (tech.length === 0) {
    return (
      <Band icon={<Globe />} label="Tech stack">
        <span className="text-[var(--color-muted)]">
          No vendors detected from public signals.
        </span>
      </Band>
    );
  }
  return (
    <Band icon={<Globe />} label="Tech stack">
      <div className="flex flex-wrap gap-2">
        {tech.map((chip) => (
          <span
            key={`${chip.category}-${chip.vendor}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs"
          >
            <span className="text-[var(--color-muted)] uppercase tracking-wide text-[10px]">
              {chip.category}
            </span>
            <span className="font-medium">{chip.vendor}</span>
          </span>
        ))}
      </div>
    </Band>
  );
}
