import { ShieldCheck, ShieldAlert, ShieldX, Calendar, Server, Globe, Building2, ExternalLink, Info, Database, Bell } from "@/components/ui/icons";
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
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 py-5 border-b border-border">
      <div className="flex items-center gap-2 sm:w-44 shrink-0 text-muted">
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
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-sm">{info.registrar ?? "(hidden)"}</span>
        {info.registrarUrl ? (
          <a
            href={info.registrarUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
          >
            visit site <ExternalLink className="size-3" />
          </a>
        ) : null}
        {info.registrarIanaId ? (
          <span className="text-xs text-muted font-mono">
            IANA #{info.registrarIanaId}
          </span>
        ) : null}
      </div>
      {info.abuseUrl ? (
        <a
          href={info.abuseUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-1 inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
        >
          report abuse <ExternalLink className="size-3" />
        </a>
      ) : null}
      {info.status.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {info.status.map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-0.5 rounded border border-border text-muted font-mono"
            >
              {s}
            </span>
          ))}
        </div>
      ) : null}
    </Band>
  );
}

function ageText(iso: string | null) {
  if (!iso) return null;
  const start = new Date(iso);
  if (Number.isNaN(start.getTime())) return null;
  const ms = Date.now() - start.getTime();
  if (ms < 0) return null;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365.25);
  const remDays = days - Math.floor(years * 365.25);
  if (years === 0) return `${days} days old`;
  return `${years} year${years === 1 ? "" : "s"}, ${remDays} day${remDays === 1 ? "" : "s"} old`;
}

export function SourceBand({ info }: { info: DomainSnapshot["info"] }) {
  if (!info.rdapServer && !info.whoisServer && info.source === "unknown")
    return null;
  return (
    <Band icon={<Database />} label="Data source">
      <dl className="grid sm:grid-cols-2 gap-3 sm:gap-6 text-sm">
        <div>
          <dt className="text-xs text-muted uppercase tracking-wide">
            Protocol
          </dt>
          <dd className="font-mono uppercase">{info.source}</dd>
        </div>
        {info.rdapServer ? (
          <div>
            <dt className="text-xs text-muted uppercase tracking-wide">
              RDAP server
            </dt>
            <dd className="font-mono break-all">
              <a
                href={info.rdapServer}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="hover:text-foreground transition-colors"
              >
                {info.rdapServer.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          </div>
        ) : null}
        {info.whoisServer ? (
          <div>
            <dt className="text-xs text-muted uppercase tracking-wide">
              WHOIS server
            </dt>
            <dd className="font-mono break-all">{info.whoisServer}</dd>
          </div>
        ) : null}
      </dl>
    </Band>
  );
}

export function DatesBand({
  info,
  domain,
}: {
  info: DomainSnapshot["info"];
  domain: string;
}) {
  const expiryDays = daysFromNow(info.expirationDate);
  const expiryColor =
    expiryDays === null
      ? "text-muted"
      : expiryDays < 0
        ? "text-danger"
        : expiryDays < 30
          ? "text-warning"
          : "text-success";
  const age = ageText(info.registrationDate);
  return (
    <Band icon={<Calendar />} label="Dates">
      {age ? (
        <p className="text-sm text-muted mb-3">
          <Info className="inline size-3.5 mr-1 mb-0.5" />
          {age}
        </p>
      ) : null}
      <dl className="grid sm:grid-cols-3 gap-3 sm:gap-6 text-sm">
        <div>
          <dt className="text-xs text-muted uppercase tracking-wide">
            Created
          </dt>
          <dd className="font-mono">{fmtDate(info.registrationDate)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted uppercase tracking-wide">
            Updated
          </dt>
          <dd className="font-mono">{fmtDate(info.lastChangedDate)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted uppercase tracking-wide">
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
      {info.expirationDate ? (
        <a
          href={`/watchlist?domain=${encodeURIComponent(domain)}`}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors"
        >
          <Bell className="size-3.5" />
          Get an email before this expires
        </a>
      ) : null}
    </Band>
  );
}

export function NameserversBand({ info }: { info: DomainSnapshot["info"] }) {
  return (
    <Band icon={<Server />} label="Nameservers">
      {info.nameservers.length === 0 ? (
        <span className="text-muted">(none reported)</span>
      ) : (
        <ul className="font-mono text-sm space-y-0.5">
          {info.nameservers.map((ns) => (
            <li key={ns}>{ns}</li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted mt-2">
        DNSSEC:{" "}
        {info.dnssecEnabled ? (
          <span className="text-success">enabled</span>
        ) : (
          <span className="text-warning">not enabled</span>
        )}
      </p>
    </Band>
  );
}

export function SslInfoBand({ ssl }: { ssl: DomainSnapshot["ssl"] }) {
  if (!ssl) {
    return (
      <Band icon={<ShieldX className="text-danger" />} label="SSL">
        <span className="text-muted">
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
    ? "text-success"
    : "text-danger";
  return (
    <Band icon={<Icon className={color} />} label="SSL certificate">
      <dl className="grid sm:grid-cols-2 gap-3 sm:gap-6 text-sm">
        <div>
          <dt className="text-xs text-muted uppercase tracking-wide">
            Issuer
          </dt>
          <dd className="font-mono">{ssl.issuer ?? "(unknown)"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted uppercase tracking-wide">
            Valid until
          </dt>
          <dd className="font-mono">
            {fmtDate(ssl.validTo)}
            {ssl.daysRemaining !== null ? (
              <span className="block text-xs mt-0.5 text-muted">
                {ssl.daysRemaining} days remaining
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted uppercase tracking-wide">
            Subject
          </dt>
          <dd className="font-mono break-all">{ssl.subject ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted uppercase tracking-wide">
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
        <span className="text-muted">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs"
          >
            <span className="text-muted uppercase tracking-wide text-[10px]">
              {chip.category}
            </span>
            <span className="font-medium">{chip.vendor}</span>
          </span>
        ))}
      </div>
    </Band>
  );
}
