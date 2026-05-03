import { ImageResponse } from "next/og";

// nodejs runtime so Dokploy's standard Node container can serve this —
// `runtime = "edge"` requires Vercel-style edge infrastructure that the
// Dokploy/Next.js standalone image doesn't provide, which is why the
// previous edge-runtime version was returning 502 on the live site.
export const runtime = "nodejs";
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
        {/* Brand row — wordmark; using a square accent character that is in
            the bundled font, since the previous ◆ glyph caused a font-load
            failure during prerender. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 36,
          }}
        >
          <span
            style={{
              display: "flex",
              width: 32,
              height: 32,
              background: "#f5c842",
              borderRadius: 6,
              marginRight: 16,
            }}
          />
          <span style={{ fontWeight: 700 }}>my whois</span>
        </div>

        {/* Tagline — every element that has multiple children gets an
            explicit display: flex per satori's requirement. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 86,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Look up any domain’s
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 86,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginTop: 4,
            }}
          >
            <span
              style={{
                color: "#f5c842",
                fontStyle: "italic",
                fontWeight: 400,
                marginRight: 12,
              }}
            >
              age
            </span>
            <span>, health &amp; tech stack.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#b7b7b7",
              marginTop: 28,
            }}
          >
            Free · unlimited · works for .com, .io, .sh, .ai &amp; 1,000+ TLDs
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
          <span>my-whois.com</span>
          <span>by flndrn</span>
        </div>
      </div>
    ),
    size,
  );
}
