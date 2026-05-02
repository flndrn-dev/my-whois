import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "my whois — domain lookup with live age & health score";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
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
        <div style={{ display: "flex", alignItems: "center", fontSize: 32 }}>
          <span style={{ color: "#f5c842", marginRight: 12 }}>◆</span>
          <span style={{ fontWeight: 700 }}>my whois</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 86,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            Look up any domain&rsquo;s
            <br />
            <span style={{ color: "#f5c842" }}>
              age, health, and tech stack.
            </span>
          </div>
          <div style={{ fontSize: 28, color: "#b7b7b7", marginTop: 28 }}>
            Free · unlimited · works for .com, .io, .sh, .ai &amp; 1,000+ TLDs
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#b7b7b7" }}>
          <span>my-whois.com</span>
          <span>by flndrn</span>
        </div>
      </div>
    ),
    size,
  );
}
