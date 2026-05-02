import Script from "next/script";

// Umami self-hosted analytics + session recorder. Both gated on env vars so
// dev / preview environments stay clean. The recorder uses moderate input
// masking and a 0.15 sample rate to keep payloads small and PII-safe.
export function AnalyticsScript() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const host = process.env.NEXT_PUBLIC_UMAMI_HOST;
  if (!websiteId || !host) return null;
  const base = host.replace(/\/$/, "");
  return (
    <>
      <Script
        id="umami-analytics"
        src={`${base}/script.js`}
        data-website-id={websiteId}
        strategy="afterInteractive"
        defer
      />
      <Script
        id="umami-recorder"
        src={`${base}/recorder.js`}
        data-website-id={websiteId}
        data-sample-rate="0.15"
        data-mask-level="moderate"
        data-max-duration="300000"
        strategy="afterInteractive"
        defer
      />
    </>
  );
}
