export const POPULAR_DOMAINS = [
  "google.com",
  "microsoft.com",
  "apple.com",
  "amazon.com",
  "twitter.com",
  "x.com",
  "facebook.com",
  "instagram.com",
  "github.com",
  "vercel.com",
  "cloudflare.com",
  "wikipedia.org",
  "openai.com",
  "anthropic.com",
  "claude.ai",
] as const;

export type PopularDomain = (typeof POPULAR_DOMAINS)[number];
