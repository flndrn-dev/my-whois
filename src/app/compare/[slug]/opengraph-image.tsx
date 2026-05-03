import { ImageResponse } from "next/og";
import { parsePairSlug } from "@/lib/data/comparison-pairs";

// nodejs runtime — Dokploy's Node container doesn't run Vercel edge.
export const runtime = "nodejs";
export const alt = "Domain comparison on my whois";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CompareOGImage({
  params,
}: {
  params: { slug: string };
}) {
  const pair = parsePairSlug(params.slug);
  const a = pair?.[0] ?? "domain a";
  const b = pair?.[1] ?? "domain b";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          background: "#2b283a",
          color: "#f7f7f7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 28 }}>
          <span style={{ display: "flex", width: 28, height: 28, background: "#f5c842", borderRadius: 5, marginRight: 12 }} />
          <span style={{ fontWeight: 700 }}>my whois</span>
          <span style={{ marginLeft: 24, fontSize: 22, color: "#b7b7b7", textTransform: "uppercase", letterSpacing: "0.18em" }}>
            domain comparison
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flex: 1 }}>
          <div style={{ display: "flex", flex: 1, justifyContent: "flex-end", fontSize: 76, fontWeight: 800, letterSpacing: "-0.02em", textAlign: "right", wordBreak: "break-all" }}>
            {a}
          </div>
          <div style={{ display: "flex", fontSize: 56, color: "#b7b7b7", padding: "0 12px" }}>vs</div>
          <div style={{ display: "flex", flex: 1, justifyContent: "flex-start", fontSize: 76, fontWeight: 800, letterSpacing: "-0.02em", wordBreak: "break-all" }}>
            {b}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#b7b7b7" }}>
          <span>age · registrar · DNS · SSL · tech stack — side by side</span>
          <span>my-whois.com</span>
        </div>
      </div>
    ),
    size,
  );
}
