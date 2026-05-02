import { ImageResponse } from "next/og";
import { normalizeDomain } from "@/lib/validate-domain";

export const runtime = "edge";
export const alt = "Domain lookup on my whois";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function DomainOGImage({
  params,
}: {
  params: { domain: string };
}) {
  const raw = decodeURIComponent(params.domain);
  const domain = normalizeDomain(raw) ?? raw;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#2b283a",
          color: "#f7f7f7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 28 }}>
          <span style={{ color: "#f5c842", marginRight: 12 }}>◆</span>
          <span style={{ fontWeight: 700 }}>my whois</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, color: "#b7b7b7", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            domain
          </div>
          <div
            style={{
              fontSize: 110,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              marginTop: 12,
              wordBreak: "break-all",
            }}
          >
            {domain}
          </div>
          <div style={{ fontSize: 32, color: "#b7b7b7", marginTop: 32, maxWidth: "1000px" }}>
            Live age counter, health score, registrar, DNS, SSL &amp; tech stack — all on one page.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#b7b7b7" }}>
          <span>my-whois.com/{domain}</span>
          <span>by flndrn</span>
        </div>
      </div>
    ),
    size,
  );
}
