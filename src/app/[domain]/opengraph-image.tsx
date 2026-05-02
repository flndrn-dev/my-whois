import { ImageResponse } from "next/og";
import { lookupDomain } from "@/lib/lookup";
import type { DomainSnapshot } from "@/lib/types";
import { normalizeDomain } from "@/lib/validate-domain";

// Switched off the edge runtime so the cached Node-only lookup (RDAP +
// DNS + SSL via node:tls) is reachable. Social-bot fetches are sporadic
// and the underlying snapshot is cached for an hour, so cost is trivial.
export const runtime = "nodejs";
export const alt = "Domain lookup on my whois";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TIER_COLOR = {
  green: "#3FB950",
  amber: "#D29922",
  red: "#F85149",
} as const;

async function trySnapshot(domain: string): Promise<DomainSnapshot | null> {
  try {
    const snapshot = await Promise.race([
      lookupDomain(domain),
      new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error("og-timeout")), 3500),
      ),
    ]);
    return snapshot;
  } catch {
    return null;
  }
}

function ageYears(snap: DomainSnapshot): number | null {
  const created = snap.info.registrationDate;
  if (!created) return null;
  const ms = Date.now() - new Date(created).getTime();
  if (Number.isNaN(ms) || ms < 0) return null;
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25));
}

export default async function DomainOGImage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: rawParam } = await params;
  const raw = decodeURIComponent(rawParam);
  const domain = normalizeDomain(raw) ?? raw;
  const snap = await trySnapshot(domain);

  const score = snap?.health.score ?? null;
  const tier = snap?.health.tier ?? "amber";
  const ringColor = TIER_COLOR[tier];
  const age = snap ? ageYears(snap) : null;
  const registrar = snap?.info.registrar ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#2b283a",
          color: "#f7f7f7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
          }}
        >
          <span style={{ color: "#f5c842", marginRight: 12, fontSize: 36 }}>
            ◆
          </span>
          <span style={{ fontWeight: 700 }}>my whois</span>
        </div>

        {/* Body — score ring + domain stack */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 64,
          }}
        >
          {score != null ? (
            <div
              style={{
                width: 280,
                height: 280,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `conic-gradient(${ringColor} ${score * 3.6}deg, #3F3D52 0)`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 232,
                  height: 232,
                  borderRadius: "50%",
                  background: "#2b283a",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 96,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: ringColor,
                  }}
                >
                  {score}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    color: "#b7b7b7",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    marginTop: 8,
                  }}
                >
                  health · /100
                </div>
              </div>
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: "#b7b7b7",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              domain
            </div>
            <div
              style={{
                fontSize: score != null ? 88 : 110,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginTop: 12,
                wordBreak: "break-all",
              }}
            >
              {domain}
            </div>

            {snap ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 28,
                  fontSize: 26,
                  color: "#d6d6d6",
                }}
              >
                {age != null ? (
                  <div style={{ display: "flex" }}>
                    <span style={{ color: "#b7b7b7", marginRight: 12 }}>
                      age
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {age} {age === 1 ? "year" : "years"}
                    </span>
                  </div>
                ) : null}
                {registrar ? (
                  <div style={{ display: "flex" }}>
                    <span style={{ color: "#b7b7b7", marginRight: 12 }}>
                      registrar
                    </span>
                    <span style={{ fontWeight: 600 }}>{registrar}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div
                style={{
                  fontSize: 30,
                  color: "#b7b7b7",
                  marginTop: 32,
                  maxWidth: 800,
                }}
              >
                Live age counter, health score, registrar, DNS, SSL &amp; tech
                stack — all on one page.
              </div>
            )}
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#b7b7b7",
          }}
        >
          <span>my-whois.com/{domain}</span>
          <span>by flndrn</span>
        </div>
      </div>
    ),
    size,
  );
}
