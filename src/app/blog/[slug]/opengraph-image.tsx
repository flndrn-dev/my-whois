import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";

export const runtime = "nodejs";
export const alt = "Blog post on my whois";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default async function BlogPostOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = post?.title ?? "my whois — blog";
  const description =
    post?.description ??
    "Long-form posts on DNSSEC, GDPR-redacted WHOIS, SSL certificate chains, and how to read the data behind any domain.";
  const meta = post
    ? `${formatDate(post.publishedAt)}  ·  ${post.readingMinutes} min read`
    : "blog · my whois";

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
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", fontSize: 28 }}>
            <span style={{ color: "#f5c842", marginRight: 12, fontSize: 36 }}>
              ◆
            </span>
            <span style={{ fontWeight: 700 }}>my whois</span>
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#f5c842",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              fontWeight: 600,
            }}
          >
            blog
          </div>
        </div>

        {/* Body — title + description stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            paddingTop: 24,
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#f7f7f7",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: "#d6d6d6",
              maxWidth: 1000,
            }}
          >
            {description}
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#b7b7b7",
          }}
        >
          <span style={{ fontFamily: "monospace" }}>{meta}</span>
          <span>my-whois.com/blog</span>
        </div>
      </div>
    ),
    size,
  );
}
