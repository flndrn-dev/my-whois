# my-whois.com — WHOIS lookup with the agecheckup.com experience

## Your Mission

You are Claude Code. Build a new English-only WHOIS lookup site at `my-whois.com` that mirrors **the functionality and user experience of the live agecheckup.com site** (live ticking counters, content depth, popular searches, comparison routes, sitemap quality), applied to the WHOIS / domain-intelligence problem space.

This is a **new build from scratch** — there is no existing codebase to modify. Initialize a new Next.js 16 project, scaffold the architecture below, and ship to Dokploy auto-deploy on push to `main`. Your work isn't done when code compiles — it's done when the live site at `https://my-whois.com` is feature-complete, indexed by Google + Bing + Yandex, and starting to receive organic traffic.

The site will earn money via **Google AdSense exclusively** (no Adsterra, no other networks). Ad slots are placed but render as empty placeholders until AdSense approval comes through and slot IDs are configured. Your goal is to maximize organic traffic with **zero ad spend** — pure SEO and outreach.

## Reference Site — Match This Experience

Before scaffolding, fetch and study `https://agecheckup.com` and its homepage in particular. Key UX patterns to replicate:

- **A hero tool that gives an instant live-ticking result** — agecheckup ticks age in seconds; my-whois will tick **domain age in seconds** the same way
- **A long content section below the tool** with H2/H3 structure, ~500 words of real content explaining what the tool does and why
- **A "Popular searches" section** — agecheckup links to 15 hardcoded celebrities; my-whois links to 15 hardcoded popular domains
- **A "More ways to explore" section** with sub-headings — agecheckup has Comparisons, Born in…, Reading. my-whois will have Comparisons (`/compare/[a]-vs-[b]`), Top TLDs (`/tld/[tld]`), and Reading (`/blog`, Phase 2)
- **A clean footer** — `© 2026 my-whois.com by [icon] flndrn` on the left, `Privacy Policy | Terms of Service` on the right
- **Dark mode default** with a clean light alternative
- **Generous spacing**, large typography, no clutter, no scary-WHOIS-tool aesthetic

When implementing UI, fetch `https://agecheckup.com` for visual reference. Replicate the **rhythm, density, and section structure** — but use the my-whois brand palette below (NOT agecheckup's blue accent — my-whois uses its own aubergine identity established by the logo).

## Site Identity

- **Domain:** `my-whois.com` (already registered, behind Cloudflare)
- **Header logo:** uses `/public/logo.svg` (dark theme) and `/public/logo_light.svg` (light theme), rendered as theme-aware `<Image>` — this is a real visual logo, NOT text-based. The wordmark "my whois" is part of the SVG.
- **Compact logo:** `/public/icon.svg` (dark theme) and `/public/icon_light.svg` (light theme) for spaces where the full wordmark won't fit (mobile header, collapsed states)
- **Favicon:** `/public/favicon.svg` (single file, theme-agnostic — browser tabs ignore CSS)
- **Footer attribution:** see Footer specification below — uses `/public/flndrn-icon.svg` in flndrn yellow
- **Language:** English-only. **No i18n, no locale routing, no middleware language detection.** Single language site.

## What Makes This More Than a Plain WHOIS

Generic WHOIS sites (who.is, whois.com) all show the same bare data. Yours adds four differentiators:

1. **Live Domain Age Counter** — flndrn signature feature mirroring agecheckup. The domain's age in years, months, days, hours, minutes, seconds, all updating every second via a single RAF tick manager. Tabular numerals, no jitter.

2. **Domain Health Score (0-100)** — one number computed from SSL validity + days remaining, DNSSEC enabled, SPF record present, DMARC record present, nameserver redundancy, and expiry urgency. Display as a circular progress ring (SVG, ~120px) with the number centered, color-coded (green ≥80, amber 60-79, red <60). Hover shows the breakdown. Users will share scores on social — viral SEO hook.

3. **Domain Comparison routes** (`/compare/[a]-vs-[b]`) — same pattern as agecheckup's `/compare/lionel-messi-vs-cristiano-ronaldo`. Two domains side-by-side: age, registrar, SSL, DNS health score, tech stack. Pre-generate static pages for top 100 popular pairs (google.com vs bing.com, twitter.com vs x.com, microsoft.com vs apple.com, openai.com vs anthropic.com, etc.).

4. **Tech Stack Detector** — server header analysis (Cloudflare? Vercel? AWS?), DNS-based email provider hints (Google Workspace? Microsoft 365? Zoho?), CDN detection. All from public data, no fingerprinting. Display as small icon chips with vendor names (5-8 chips max).

Standard WHOIS data (registrar, dates, status, nameservers, DNSSEC, raw RDAP) is also rendered, but in a clean horizontal-band layout, not a wall of text.

## Hard Rules — never violate

- **No email addresses** in UI, logs, or public-facing pages. WHOIS responses with emails must be **redacted server-side** before reaching the client. Display `(hidden)` placeholder.
- **No IP addresses** in UI, logs, or public-facing pages — with one **owner-approved exception for this project**: the visitor's *own* IP MAY be shown back to that visitor in the hero (server-fetched per request from `x-forwarded-for` / `x-real-ip`, never logged or persisted). Third-party IPs from registry data (registrant, nameservers, A/AAAA resolved targets) are still stripped server-side. Nameserver hostnames are fine; their resolved IPs are not.
- **GDPR-aware presentation** — most EU TLDs return masked registrant data. Show `(hidden)` and explain politely with a small note that GDPR redacts personal data — never imply the tool is broken.
- **Cookieless analytics** — Umami self-hosted, no cookie banners.
- **Zero PII storage** — no Postgres, no session linkage. In-memory cache by domain key only (or Convex if needed for compounding popular-lookups data).
- **No abuse vector** — rate limit per anonymous session token, deny private IP ranges and localhost as inputs, only `http`/`https` schemes resolved, hard 8s timeout on every fetch.
- **No premium tier, no subscription, no Stripe/Polar.sh** — site is fully free, monetized only via ad slots.
- **No FAQ section** — the homepage content depth comes from the About/How/What/Why narrative blocks, not Q&A accordion.

## Stack

Standard flndrn conventions:

- **Next.js 16** (App Router, `output: 'standalone'`)
- **React 19**
- **Tailwind v4**
- **shadcn/ui**
- **lucide-animated** (UI icons — from lucide-animated.com, NOT plain lucide-react)
- **react-icons/ri** (social/brand/vendor icons)
- **Framer Motion** (subtle entrance animations only — NEVER on the live counter)
- **Resend** (sender domain `flndrn.com` already verified at flndrn org level; only used if a contact form is added — not in MVP)
- **Convex** (only if popular-lookups frequency tracking or similar persistent need emerges — start without it; add later if scope grows)
- **No Postgres, no Drizzle, no Prisma** — keep it stateless
- **No Better Auth** — no accounts, no logins
- **No i18n, no next-intl, no middleware locale detection**
- **MDX** for blog posts (Phase 2)

## Hosting & Deployment

**Dokploy** on flndrn's Hostinger VPS. Cloudflare in front (DNS + proxy on, "Full strict" SSL). GitHub auto-deploy on push to `main`. SSL via Traefik + Let's Encrypt automatic.

**Dockerfile** (multi-stage, Next.js standalone output):

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
```

`next.config.ts` must include `output: 'standalone'`.

## Email Configuration

Two flndrn aliases are used by this project. Both live ONLY in env vars and email headers — NEVER rendered in UI, logs, or any user-facing surface (the no-email-addresses-in-UI rule applies).

### `admin@flndrn.com` — operations

Used for:
- Cloudflare account (DNS, security, 2FA)
- Domain registrar (Porkbun) renewal reminders
- Resend sender domain verification + Reply-To header
- GitHub organization (`flndrn-dev` or `flndrnai` — confirm exact org name)
- Google Search Console verified email
- Bing Webmaster Tools account
- Yandex Webmaster account
- Google AdSense publisher account contact

### `haro@flndrn.com` — SEO outreach + journalism

Used for:
- HARO (Help A Reporter Out) signup and queries
- Help A B2B Writer signup
- Qwoted signup
- Journalist outreach when pitching the site as a quote source
- Directory and tool-list submissions

This separation matters: HARO and outreach generate a lot of inbound emails; keeping them out of the operational inbox prevents missing critical service alerts.

### Resend setup (one-time, shared with other flndrn ad-revenue sites)

- `flndrn.com` is verified as a sending domain in Resend (SPF, DKIM, DMARC records in Cloudflare DNS)
- Sender for transactional: `noreply@flndrn.com`, Reply-To: `admin@flndrn.com`
- Resend is **not used in MVP** for this project — listed for future contact form or expiry watchlist features

## Analytics

**Umami self-hosted** — shared instance across flndrn sites, separate website ID for this project. Custom events:

- `lookup_domain` (with property: `tld`)
- `compare_domains`
- `view_health_score`
- `view_tech_stack`
- `share_score` (when user clicks the score share button)

Tracking script in `app/layout.tsx` with `data-website-id` env var. Gated on `NEXT_PUBLIC_UMAMI_WEBSITE_ID` being set.

## Brand & Visual Tokens

The brand identity comes from the supplied logo (the M-shape with padlock, "my whois" wordmark). Use these tokens — NOT generic GitHub-dark or agecheckup blue.

### Color tokens — dark (default theme)

- Background: `#2B283A` (aubergine — the brand color from the logo)
- Foreground: `#F7F7F7` (off-white — matches logo light variant background)
- Surface raised: `#373449` (slightly lighter aubergine, for cards)
- Muted text: `#B7B7B7` (mid-grey — matches the diagonal stripes in the logo)
- Border: `#3F3D52`
- Accent primary: `#F5C842` (flndrn yellow — only on key CTAs and active states, sparingly)
- Accent success: `#3FB950` (health score green, valid SSL, DNSSEC enabled)
- Accent warning: `#D29922` (expiring soon, partial DNS records)
- Accent danger: `#F85149` (expired, no SSL, severe issues)

### Color tokens — light theme

- Background: `#FFFFFF` (matches logo light variant)
- Foreground: `#2B283A` (aubergine, inverted from dark mode)
- Surface raised: `#F7F7F7`
- Muted text: `#6B6B7B`
- Border: `#E3E3E3`
- Accent primary: `#F5C842` (same flndrn yellow, used sparingly)
- Status colors slightly desaturated

### Typography

- UI body: **Inter** (regular weights)
- Big numbers (live age counter, health score): **Inter Tight Variable**, weight 700, `clamp()`-scaled, `font-variant-numeric: tabular-nums`
- Data displays (registrar, dates, nameservers, raw RDAP, DNS records): **JetBrains Mono Variable**, weight 400-500
- Headings: Inter Tight or Inter, weight 700, slightly tight tracking

### Component direction

- The lookup input is the hero — large, centered, prominent
- Result cards use clean horizontal bands, NOT a wall of text. Each band: registrar / dates / nameservers / DNS / SSL / tech stack
- Health Score is a circular SVG ring (~120px), number centered, tier-colored (green/amber/red — NOT brand aubergine)
- Live Age counter sits next to (desktop) or above (mobile) the Health Score, same scale, same prominence
- Comparison page uses a two-column mirrored layout with diff highlights
- Tech stack as inline icon chips with vendor names
- Subtle Framer Motion entrances — never on the counter
- Mobile-first; desktop is the showcase
- Generous vertical breathing room, max content width ~1200px

## Public Assets — User-Provided

The user has placed these files into `/public/` ready for use. **Do not generate, modify, or replace them.** Reference them by path only.

- `/public/logo.svg` — full my-whois wordmark logo (M-shape + padlock icon + "my whois" text). **For dark theme** — uses light foreground tones so it's visible on the dark aubergine background.
- `/public/logo_light.svg` — same wordmark logo. **For light theme** — uses dark foreground tones so it's visible on the white background.
- `/public/icon.svg` — compact icon-only version (M + padlock, no wordmark). **For dark theme**.
- `/public/icon_light.svg` — same compact icon. **For light theme**.
- `/public/favicon.svg` — favicon for browser tab. Single file, theme-agnostic (browser tabs don't respect site theme).
- `/public/flndrn-icon.svg` — flndrn brand icon in **flndrn yellow** `#F5C842` (used in footer attribution). Single file, never recolored regardless of theme.

### Why two variants per logo

Browser tabs and theme-aware UIs need different luminance for the logo:
- Dark theme: logo uses light fills (white-ish) → use `logo.svg` / `icon.svg`
- Light theme: logo uses dark fills (aubergine `#2B283A`) → use `logo_light.svg` / `icon_light.svg`

This is NOT done via CSS filters or `currentColor` — it's two separate SVG files with hand-tuned colors per theme. CSS filters degrade SVG quality; per-theme files keep crisp vector edges.

### Theme switching pattern

The Header component must render the correct logo based on current theme. Use the resolved theme from your theme provider (e.g., `next-themes` `useTheme().resolvedTheme`). Render BOTH variants and toggle visibility via Tailwind `dark:` classes — this avoids hydration mismatches and SSR flashes:

```tsx
// Pattern — both variants rendered, one hidden per theme
<>
  <Image
    src="/logo.svg"
    alt="my whois"
    width={140}
    height={40}
    className="hidden dark:block h-8 md:h-10 w-auto"
    priority
  />
  <Image
    src="/logo_light.svg"
    alt="my whois"
    width={140}
    height={40}
    className="block dark:hidden h-8 md:h-10 w-auto"
    priority
  />
</>
```

Same pattern for `icon.svg` / `icon_light.svg` on mobile-collapsed header states. This works whether `dark:` is driven by `class` strategy (recommended for Tailwind v4 + `next-themes`) or media query strategy.

## Header Specification

The header renders the correct logo variant per theme. Both variants are rendered side-by-side; Tailwind `dark:` classes toggle visibility. This pattern is SSR-safe (no client-side hydration flash) and crisp on retina (no CSS filter degradation).

```tsx
// components/layout/Header.tsx
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="my whois — home">
          {/* Desktop: full wordmark logo, theme-aware */}
          <span className="hidden sm:block">
            <Image
              src="/logo.svg"
              alt="my whois"
              width={140}
              height={40}
              className="hidden dark:block h-8 md:h-10 w-auto"
              priority
            />
            <Image
              src="/logo_light.svg"
              alt="my whois"
              width={140}
              height={40}
              className="block dark:hidden h-8 md:h-10 w-auto"
              priority
            />
          </span>
          {/* Mobile: compact icon only, theme-aware */}
          <span className="sm:hidden">
            <Image
              src="/icon.svg"
              alt="my whois"
              width={40}
              height={40}
              className="hidden dark:block h-8 w-auto"
              priority
            />
            <Image
              src="/icon_light.svg"
              alt="my whois"
              width={40}
              height={40}
              className="block dark:hidden h-8 w-auto"
              priority
            />
          </span>
        </Link>
        {/* nav, theme switcher, etc. on the right */}
      </div>
    </header>
  );
}
```

**Critical rules:**
- The logo SVG already includes the "my whois" wordmark — no separate text component needed
- All four logo files have a single `alt="my whois"` value (no per-theme alt — accessibility doesn't care about the visual variant)
- `priority` flag is set so the logo loads in the first paint (LCP element on most pages)
- On mobile (`<sm`), the icon-only variant shows; on `sm:` and above, the full wordmark shows
- Theme switching: dark variant (`logo.svg` / `icon.svg`) shows when `dark:` class is active, light variant (`*_light.svg`) shows otherwise
- This is a standard `next-themes` + Tailwind v4 pattern — no custom theme detection logic in the component

## Footer Specification

Exact format the user requires:

**Left side:** `© {auto-current-year} my-whois.com by [flndrn-icon.svg size-6] flndrn`

**Right side:** `Privacy Policy | Terms of Service`

Implementation:

```tsx
// components/layout/Footer.tsx
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span>© {year} my-whois.com by</span>
          <Image
            src="/flndrn-icon.svg"
            alt="flndrn"
            width={24}
            height={24}
            className="size-6 inline-block align-middle"
            // do NOT pass any tint/filter — keep native flndrn yellow in both themes
          />
          <span>flndrn</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <span className="text-border">|</span>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

**Critical rules:**
- Year is auto-updating via `new Date().getFullYear()` — never hardcoded
- `flndrn-icon.svg` is rendered at `size-6` (24×24px Tailwind) inline between "by" and "flndrn"
- Icon stays flndrn yellow `#F5C842` in both light and dark themes — NO CSS filters, NO `currentColor`, NO theme-based recoloring
- `"by flndrn"` and `"my-whois.com"` are NOT translatable (site is English-only anyway)
- Privacy Policy and Terms links use sentence case as shown
- Layout: stacked on mobile (`flex-col`), side-by-side on `sm:` breakpoint

## Build Approach — Use Skills, Sub-Agents, and Specialized Modes

This project benefits from Claude Code's full toolkit. Use them deliberately:

### Skills (`/skills`)

Load skills at the start of relevant tasks. Specifically:

- **`/frontend-design`** when implementing the UI — invoke when starting on the homepage, result page, or comparison view. The skill enforces design rhythm, component patterns, and styling conventions.
- Any other relevant skills surfaced via `/skills` listing.

### Sub-agents — parallelize the work

Spawn specialized sub-agents in parallel for independent work streams:

- **Agent A — Data engine**: implement RDAP query + IANA bootstrap + WHOIS port-43 fallback + redaction pipeline + DNS resolver + SSL cert info. Pure server-side library code in `src/lib/rdap`, `src/lib/whois`, `src/lib/dns`, `src/lib/ssl`. No UI.
- **Agent B — UI shell**: scaffold Next.js + Tailwind + shadcn, build the layout, header (using `/logo.svg` + `/logo_light.svg` + `/icon.svg` + `/icon_light.svg` with theme-aware switching pattern in Header Specification), footer (per Footer Specification above), theme switcher, ad slot components, route structure. Stub data, no live integration yet.
- **Agent C — Featured logic**: implement health-score algorithm, live age counter (RAF tick manager), tech-stack detector, comparison view component. Pure logic + presentation, consume Agent A's data via stubbed types.
- **Agent D — SEO + indexing infrastructure**: sitemap generator, robots.txt, IndexNow integration, schema.org JSON-LD helpers, Search Console / Bing / Yandex preparation files, OG image generator (Phase 2).

After all four agents finish their parallel scopes, **integrate** in a single coordinated pass. The integration step must be done in the main session, not in a sub-agent — sub-agents don't share context.

### Thinking modes

- **`ultrathink`** — invoke at the start before any code, to deliberate on user flow questions: where does the health score sit relative to the live counter, how does the result page handle progressive disclosure of raw RDAP, what's the minimum information density that doesn't feel sparse but doesn't feel crowded. Output a brief decision log (5-8 bullet points) then proceed.
- **`/superpowers`** — invoke before scaffolding, to produce a concrete file-by-file build plan that maps to the sub-agent split above.
- **`/frontend-design`** — invoke when entering UI implementation phase.

### Recommended workflow order

1. Fetch `https://agecheckup.com` once for visual reference
2. `ultrathink` to lock UX decisions (5 min)
3. `/superpowers` to produce build plan (5 min)
4. `/frontend-design` invoked for UI tasks
5. Spawn sub-agents A, B, C, D in parallel
6. Integrate in main session
7. Deploy to Dokploy
8. SEO registration phase (separate playbook below)
9. Verify live, monitor, iterate

## Architecture & Routes

```
src/
  app/
    layout.tsx                    (theme provider, Umami, schema.org WebApplication)
    page.tsx                      (homepage: lookup + 500-word content + popular + more-ways)
    [domain]/page.tsx             (lookup result, dynamic, deep-linkable, SEO target)
    compare/
      [slug]/page.tsx             (e.g. /compare/google.com-vs-bing.com)
    tld/
      [tld]/page.tsx              (Phase 2: per-TLD info pages)
    blog/
      page.tsx                    (Phase 2: blog index)
      [slug]/page.tsx             (Phase 2: MDX blog post)
    about/page.tsx
    privacy/page.tsx
    terms/page.tsx
    api/
      lookup/[domain]/route.ts    (server-side RDAP/WHOIS query, returns redacted JSON)
      sitemap/route.ts            (all routes + popular domains in cache)
    robots.ts                     (Next.js 15+ metadata route)
    sitemap.ts                    (or use api/sitemap/route.ts — pick one)
  components/
    lookup/
      DomainInput.tsx             (debounced, validates, normalizes)
      ResultBanner.tsx            (top of result: domain name + age counter + health score)
      LiveAgeCounter.tsx          (RAF-driven, single tick manager)
      HealthScoreRing.tsx         (SVG circular ring, animated number, hover for breakdown)
      RegistrarBand.tsx
      DatesBand.tsx               (created, updated, expires + days-until-expiry countdown)
      NameserversBand.tsx
      DnsRecordsTabs.tsx          (A, AAAA, MX, TXT, CNAME, NS, DNSSEC)
      SslInfoBand.tsx
      TechStackBand.tsx           (icon chips with vendor names)
      RawRdapDrawer.tsx           (collapsible JSON for power users)
      RedactionNotice.tsx
      ShareScoreButton.tsx        (X/Twitter share intent with score + domain)
    compare/
      ComparisonView.tsx          (two-column mirrored layout)
      DiffBadge.tsx               (chip showing which side wins on a metric)
    content/
      AboutSection.tsx            (~500-word homepage content)
      PopularDomains.tsx          (15 hardcoded popular lookups linking to /[domain])
      ComparisonShowcase.tsx      (4-6 featured /compare/ pages on homepage)
      TopTlds.tsx                 (Phase 2)
    layout/
      Header.tsx                  (uses /logo.svg desktop, /icon.svg mobile)
      Footer.tsx                  (per Footer Specification — left attribution, right legal links)
      AdSlot.tsx                  (env-gated; renders empty container with reserved height when env vars unset)
      ThemeSwitcher.tsx
  lib/
    rdap/
      bootstrap.ts                (IANA registry, TLD → RDAP server map)
      query.ts                    (RDAP fetcher with timeout + retry)
      parse.ts                    (normalize different RDAP responses)
      redact.ts                   (strip emails + IPs server-side)
    whois/
      legacyQuery.ts              (port 43 fallback for non-RDAP TLDs)
    dns/
      resolve.ts                  (Node DNS module, server-only)
    ssl/
      certInfo.ts                 (TLS cert fetch via Node tls)
    techstack/
      detect.ts                   (server header + DNS-based provider detection)
      providers.ts                (registry of recognized providers with icons + names)
    health/
      score.ts                    (pure function: inputs → 0-100 score + breakdown)
      thresholds.ts               (tier definitions)
    age/
      domainAge.ts                (compute years/months/days/hours/min/sec from creation date)
      tick.ts                     (single RAF tick manager)
    cache.ts                      (in-memory Map with 1h TTL)
    indexnow.ts                   (push new /[domain] URLs to Bing/Yandex)
    seo.ts                        (JSON-LD + canonical helpers)
public/
  logo.svg                        (USER-PROVIDED — full wordmark, dark theme)
  logo_light.svg                  (USER-PROVIDED — full wordmark, light theme)
  icon.svg                        (USER-PROVIDED — compact icon, dark theme)
  icon_light.svg                  (USER-PROVIDED — compact icon, light theme)
  favicon.svg                     (USER-PROVIDED — browser tab favicon, theme-agnostic)
  flndrn-icon.svg                 (USER-PROVIDED — must use #F5C842 fill, never recolored)
  ads.txt                         (added post-AdSense-approval with publisher line)
  [INDEXNOW_KEY].txt              (IndexNow ownership file, generated)
content/
  blog/                           (Phase 2 MDX posts)
```

## Domain Health Score Algorithm

Pure function in `lib/health/score.ts`:

```typescript
// Pseudocode — implement properly
function calculateHealthScore(input: {
  ssl: { valid: boolean; daysRemaining: number };
  dnssec: boolean;
  spf: boolean;
  dmarc: boolean;
  nameservers: string[];
  expiryDays: number;
}): { score: number; breakdown: Array<{ label: string; points: number; max: number }> } {
  // SSL valid + 60+ days remaining: 25 pts
  // DNSSEC enabled: 15 pts
  // SPF record present: 10 pts
  // DMARC record present: 10 pts
  // Nameservers >= 2 distinct authoritative: 15 pts
  // Domain not expiring within 90 days: 25 pts
  // Total max: 100
  // Return score + per-criterion breakdown for the UI to show on hover/expand
}
```

The breakdown is shown in a tooltip when hovering the health ring — transparency builds trust.

## Live Domain Age Counter

Computed from RDAP `events.registration` date. Display:

> This domain is **15 years, 3 months, 12 days, 7 hours, 23 minutes, 41 seconds** old.

Seconds tick up live via the same RAF tick manager pattern as agecheckup. Single tick, single setState, all sub-displays derive from it. Tabular numerals mandatory. Reserved width on each digit slot to prevent layout shift.

## Tech Stack Detector

Server-side analysis on every lookup:

- **Web server**: parse `Server` header (nginx, Apache, Caddy, Cloudflare-proxied, etc.)
- **CDN/proxy**: detect Cloudflare (`cf-ray` header), Fastly, Akamai, Vercel, Netlify, AWS CloudFront
- **Email**: parse MX records — Google Workspace (`*.aspmx.l.google.com`), Microsoft 365 (`*.mail.protection.outlook.com`), Zoho, Fastmail, self-hosted (other)
- **DNS provider**: parse NS records — Cloudflare (`*.ns.cloudflare.com`), AWS Route 53 (`*.awsdns-*`), Google Cloud DNS, GoDaddy, self-hosted (other)

Display as horizontal chips with tiny vendor icons (use react-icons/ri or lucide-animated equivalents). 5-8 chips max.

## Homepage Content Plan (~500 words)

Match the depth of agecheckup.com's homepage. After the lookup hero + result area, include:

### About this domain inspector (~200 words)

What the tool does. Why it goes beyond standard WHOIS (live age, health score, comparisons, tech stack). What's free and unlimited.

### How the Domain Health Score works (~150 words)

Explain the 6 criteria and how points add up. Transparency builds trust. Include the score tiers (green ≥80, amber 60-79, red <60).

### What you can do (~100 words)

Feature list: live age counter, health score, side-by-side comparison, tech stack detection, raw RDAP for power users.

### Why this matters (~50 words)

For domain owners checking their own setup. For investors verifying a brand's domain hygiene. For developers debugging DNS. For anyone curious how old a domain actually is.

## Popular Searches Section

Hardcoded list of 15 well-known domains with lookup URLs. Mirrors agecheckup's "Popular searches" pattern. Examples:

- google.com, microsoft.com, apple.com, amazon.com
- twitter.com, x.com, facebook.com, instagram.com
- github.com, vercel.com, cloudflare.com
- wikipedia.org, openai.com, anthropic.com, claude.ai

## More Ways to Explore Section

Mirror the agecheckup pattern with three sub-sections:

### Domain comparisons

4-6 featured comparison links pre-generated:
- `/compare/google.com-vs-bing.com`
- `/compare/twitter.com-vs-x.com`
- `/compare/microsoft.com-vs-apple.com`
- `/compare/openai.com-vs-anthropic.com`

### Top TLDs (Phase 2 if time permits)

- `/tld/com`, `/tld/io`, `/tld/app`, `/tld/dev`, `/tld/ai`

### Reading (Phase 2)

- Blog posts on domain hygiene, DNS, SSL — out of scope for MVP launch

## Google AdSense — Implementation

The site is monetized exclusively via **Google AdSense**. No Adsterra, no PropellerAds, no other networks. Single network keeps approval simpler and policy compliance cleaner.

### Approval prerequisites (must be live before applying)

AdSense rejects sites with thin content, deceptive layouts, or missing legal pages. Before submitting the AdSense application, the live site MUST have:

- **20+ indexable pages of substantive content** — the homepage + 100 pre-generated `/compare/[a]-vs-[b]` pages + 15 popular `/[domain]` lookups satisfies this comfortably
- **`/privacy` page** with substantive content covering cookies, analytics, and ad disclosure (~200 words minimum)
- **`/terms` page** (~200 words minimum)
- **`/about` page** describing the tool, what data it shows, who runs it (anonymous "by flndrn" is acceptable; do not list a name or email)
- **No copyrighted content** scraped from third parties
- **Working tool** — broken core functionality is automatic rejection
- **Mobile responsive** — AdSense reviewers test on phones; broken mobile = rejection
- **HTTPS only** — Cloudflare + Traefik already covers this
- **`ads.txt` file** at `/public/ads.txt` with the AdSense publisher line (added once publisher ID is known):

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

The publisher ID `pub-XXXXXXXXXXXXXXXX` comes from the AdSense dashboard. Until approval, leave `ads.txt` absent or with a comment-only placeholder.

### AdSense script registration in `app/layout.tsx`

The AdSense library script must load globally for ads to work. Use Next.js `<Script>` with `strategy="afterInteractive"` so it doesn't block the main content paint. Gate on the publisher ID env var being set so dev environments stay clean:

```tsx
// app/layout.tsx (excerpt)
import Script from "next/script";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {ADSENSE_CLIENT_ID && (
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### `<AdSlot />` component — full implementation

The component renders an empty placeholder with reserved height when env vars are unset (dev or pre-approval), and a real AdSense unit when activated. Lazy-load via `IntersectionObserver` so the main content paints first.

```tsx
// components/layout/AdSlot.tsx
"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdSlotProps = {
  slotId: string;        // AdSense ad unit ID, e.g., "1234567890"
  format: "banner" | "rectangle" | "native";
  className?: string;
  reservedHeight: number; // px — prevents CLS when ad loads
};

const FORMAT_CONFIG = {
  banner: { adFormat: "horizontal", responsive: true },
  rectangle: { adFormat: "rectangle", responsive: false },
  native: { adFormat: "fluid", responsive: true, layoutKey: "-fb+5w+4e-db+86" },
};

export function AdSlot({ slotId, format, className = "", reservedHeight }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const enabled = !!clientId && !!slotId;

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            // AdSense push errors are common during navigation; silently ignore
          }
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled]);

  // Pre-approval / dev: empty placeholder with reserved height
  if (!enabled) {
    return (
      <div
        className={`ad-slot-placeholder ${className}`}
        style={{ minHeight: reservedHeight }}
        aria-hidden="true"
      />
    );
  }

  const config = FORMAT_CONFIG[format];

  return (
    <div className={`ad-slot ${className}`} style={{ minHeight: reservedHeight }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={config.adFormat}
        data-full-width-responsive={config.responsive ? "true" : "false"}
        {...("layoutKey" in config ? { "data-ad-layout-key": config.layoutKey } : {})}
      />
    </div>
  );
}
```

### Per-slot ad unit IDs

Each AdSense ad unit has its own ID created in the AdSense dashboard. Define them as env vars so they can be swapped without redeploy:

```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_HEADER=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_ABOVE_RESULT=2345678901
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=3456789012
NEXT_PUBLIC_ADSENSE_SLOT_MID_RESULT=4567890123
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=5678901234
```

Usage example:

```tsx
<AdSlot
  slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER ?? ""}
  format="banner"
  reservedHeight={90}
  className="my-4"
/>
```

If `slotId` resolves to empty string, the component renders the placeholder instead of a broken `<ins>` — same as when the global client ID is unset.

### Slot placements

- **Header banner** — below navigation, above lookup input. Format: `banner` (728×90 desktop / 320×50 mobile). Reserved height 90px desktop, 50px mobile. Slot env: `NEXT_PUBLIC_ADSENSE_SLOT_HEADER`.
- **Above-result banner** — between lookup input and result banner on `/[domain]`. Format: `banner`. Reserved height 90px. Slot env: `NEXT_PUBLIC_ADSENSE_SLOT_ABOVE_RESULT`.
- **Sidebar rectangle on result pages** — right column of `/[domain]`. Format: `rectangle` (300×250). Hidden on viewports <1024px via Tailwind `hidden lg:block` wrapper. Slot env: `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`.
- **Mid-result native ad** — between DNS records tabs and SSL info section on `/[domain]`. Format: `native`. Reserved height 250px. Slot env: `NEXT_PUBLIC_ADSENSE_SLOT_MID_RESULT`.
- **Footer banner** — above the footer attribution on every page. Format: `banner`. Reserved height 90px. Slot env: `NEXT_PUBLIC_ADSENSE_SLOT_FOOTER`.

### CLS prevention

Every `AdSlot` MUST receive a `reservedHeight` prop. The placeholder div uses this as `min-height` BEFORE the AdSense iframe loads, preventing the live tool's layout (especially the live age counter) from jumping when an ad expands. Test in PageSpeed Insights — CLS must stay <0.1 with ads enabled.

### Lazy loading

The `IntersectionObserver` in `AdSlot` only triggers `adsbygoogle.push({})` once the slot enters viewport (with 200px rootMargin so it pre-loads slightly before becoming visible). This means:
- Above-fold ads (header banner) load almost immediately
- Below-fold ads (sidebar, mid-result, footer) load only when scrolled near
- Off-screen ads on long pages don't waste bandwidth
- LCP metrics stay clean — the ad doesn't compete with the main content for first paint

### Policy compliance reminders

Google AdSense policies that affect this project's design:

- **No ads on `/privacy`, `/terms`, `/about`** unless these pages have substantive content (~300+ words). MVP versions at ~200 words are borderline; either skip ads on these pages or extend the content.
- **No ads on error or 404 pages** — Next.js's default 404 should NOT include AdSlot components.
- **No deceptive layout** — never place ads where users could mistake them for the lookup input or result data. The reserved-height placeholder approach naturally separates ads visually.
- **No invalid traffic** — never click your own ads, never instruct users to click them. Cloudflare bot protection helps filter automated traffic.
- **Privacy disclosure required** — `/privacy` must mention "third-party ad networks may set cookies" even though our analytics is cookieless. AdSense itself uses cookies for ad personalization (unless served as NPA).
- **Honor user consent** — for EU visitors, consider adding a Google-certified CMP (Consent Management Platform) to handle GDPR consent signals to AdSense. **Out of scope for MVP** but flagged here. Without a CMP, AdSense serves Non-Personalized Ads (NPA) to EU traffic, which has lower RPM but is still compliant.

### Activation timeline

- **Day of launch:** site is live without AdSense. `<AdSlot />` components render empty placeholders. SEO + content + outreach can begin.
- **Apply for AdSense:** sign in to https://adsense.google.com with `admin@flndrn.com`, add `my-whois.com`, complete the application. Add the AdSense script to the site (already in `app/layout.tsx` once `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set in Dokploy env vars).
- **Wait for approval:** typically 1–3 weeks. Site must continue running normally during this period.
- **Post-approval:** create ad units in AdSense dashboard for each placement (header, above-result, sidebar, mid-result, footer). Copy each slot ID into the corresponding `NEXT_PUBLIC_ADSENSE_SLOT_*` env var in Dokploy. Redeploy. Ads start serving.
- **Add `ads.txt`:** drop the publisher line into `/public/ads.txt`. Verify by visiting `https://my-whois.com/ads.txt` and confirming AdSense dashboard shows it as detected.

### Verification after activation

After ads go live, verify:

1. View source on homepage — `<script src="...adsbygoogle.js?client=ca-pub-...">` is present in `<head>`
2. Each `AdSlot` renders an `<ins class="adsbygoogle">` with the correct `data-ad-slot` value
3. Ads actually display (may take ~30 minutes for AdSense to start serving on a new site)
4. PageSpeed Insights CLS still <0.1 with ads loaded
5. `https://my-whois.com/ads.txt` returns the publisher line
6. AdSense dashboard "Sites" tab shows my-whois.com as "Ready"



## SEO Registration & Free-Traffic Playbook

**Scope, not a nice-to-have.** The site is incomplete until it's registered with the major search engines and has indexing + outreach infrastructure in place. No paid ads, no paid backlinks. Pure organic + outreach.

### Search engine registrations (manual user actions, code-supported)

After deploying the site, the user (with Claude Code's guidance) must register the site with:

#### 1. Google Search Console

- Sign in with `admin@flndrn.com`
- Add property: Domain (`my-whois.com`)
- Verify via Cloudflare TXT record
- Submit `https://my-whois.com/sitemap.xml`
- Enable email notifications

#### 2. Bing Webmaster Tools

- Sign in with `admin@flndrn.com`
- Import from Search Console (saves re-verification)
- Or manually verify via TXT
- Submit `https://my-whois.com/sitemap.xml`

#### 3. Yandex Webmaster

- Sign in with `admin@flndrn.com`
- Add site, verify via DNS TXT record
- Submit sitemap

#### 4. IndexNow protocol (CODE work)

Implement:

- Generate a 32-char hex API key, store in `INDEXNOW_KEY` env var
- Public ownership file at `/public/[INDEXNOW_KEY].txt` containing only the key
- `lib/indexnow.ts` exports `notify(urls: string[])` that POSTs to `https://api.indexnow.org/indexnow` with body:
  ```json
  {
    "host": "my-whois.com",
    "key": "[INDEXNOW_KEY]",
    "keyLocation": "https://my-whois.com/[INDEXNOW_KEY].txt",
    "urlList": ["https://my-whois.com/some-domain.com"]
  }
  ```
- Hook: every time a new `/[domain]` page is rendered (first lookup of that domain), trigger `indexnow.notify([url])` async
- IndexNow pushes to Bing + Yandex + DuckDuckGo + Seznam in one call

#### 5. DuckDuckGo

- Uses Bing's index, no separate registration needed. IndexNow covers it.

#### 6. Brave Search

- Submit URL via `https://search.brave.com/help/webmaster-tools` (free)

### Sitemap.xml requirements

Must include:
- `/` (homepage)
- All hardcoded popular domain lookups (the 15 in Popular Searches)
- All pre-generated comparison pages (top 100 pairs)
- All `/tld/[tld]` pages when Phase 2 ships
- All `/blog/[slug]` pages when Phase 2 ships
- `/about`, `/privacy`, `/terms`
- `lastmod` per entry, `changefreq` weekly for popular domains, monthly for static pages

Plus dynamic entries: log every unique `/[domain]` lookup; the sitemap includes the top 500 most-looked-up domains by frequency.

### Robots.txt

- Allow all crawlers
- Disallow `/api/*`
- Sitemap reference: `Sitemap: https://my-whois.com/sitemap.xml`

### Schema.org JSON-LD per route

- Homepage: `WebApplication` + `WebSite` with `SearchAction` (so Google shows a sitelinks search box)
- `/[domain]`: `WebPage` with `mainEntity` describing the domain
- `/compare/[slug]`: `Article` with description "Domain comparison between [A] and [B]"
- `/blog/[slug]` (Phase 2): `Article` with author, datePublished, etc.

### Outreach via `haro@flndrn.com`

After the site is live and indexed, the user does the following:

#### HARO (Help A Reporter Out)

- Sign up at https://www.helpareporter.com using `haro@flndrn.com`
- Subscribe to "Tech" and "Business and Finance" categories
- Reply 3x/week to relevant queries with substantive expert quotes mentioning the tool only when genuinely useful
- Each placement = backlink from a major publication

#### Help A B2B Writer + Qwoted

- Sign up at both, same value-first quote pattern

#### Reddit + Quora seeding

- Identify subreddits where domain/SSL/DNS questions appear: r/webdev, r/sysadmin, r/HostingHosting, r/domains, r/programming, r/sideproject
- Identify Quora topics: WHOIS, DNS, SSL Certificates, Domain Registration
- Comment with substantive value first, link to relevant `/[domain]` or `/compare/` pages only when truly helpful
- Limit: 2 quality comments/day, 5 subreddits/week
- Track inbound clicks via UTM: `?utm_source=reddit&utm_medium=comment&utm_campaign=[topic]`

#### Tool directories (free dofollow backlinks)

- Product Hunt — submit launch on a Tuesday for max visibility
- BetaList
- AlternativeTo (alternative to who.is, whois.com)
- StartupStash
- Awesome lists on GitHub: search "awesome devops", "awesome sysadmin tools", "awesome dns", submit PRs

### Realistic timeline expectations

- **Week 1-2:** zero traffic. Google sandbox + indexing delay for new domains.
- **Week 3:** first impressions in Search Console. Maybe 5-20 clicks total.
- **Week 4-6:** 50-200 clicks/week if execution good.
- **Week 8-12:** 500-2000 clicks/week if outreach + content sustained.
- **Month 6+:** organic plateau, time to expand with TLD pages, blog, more comparisons.

If by week 8 traffic is still zero: structural problem (deindexed, technical issue). Diagnose with Search Console errors.

## Privacy & Terms

Minimal pages:

- `/privacy` (~200 words) — no personal data collected beyond cookieless analytics, no tracking cookies, EU GDPR compliant. Lookup queries cached in-memory for 1 hour by domain key only (no IP, no session linkage).
- `/terms` (~200 words) — tool provided as-is, WHOIS data shown as returned by registries (may be redacted under GDPR), no warranties, EU jurisdiction.

## Repo & Deployment

- GitHub repo: `github.com/flndrn-dev/my-whois`
- Dokploy auto-deploy from `main` via GitHub webhook
- Cloudflare proxy in front
- Custom domain via Dokploy
- SSL automatic via Traefik + Let's Encrypt
- Production: `my-whois.com`

## Environment Variables

```
NEXT_PUBLIC_UMAMI_WEBSITE_ID=...
NEXT_PUBLIC_UMAMI_HOST=https://umami.[your-vps-domain]
NEXT_PUBLIC_SITE_URL=https://my-whois.com

# Google AdSense — set after AdSense approval
NEXT_PUBLIC_ADSENSE_CLIENT_ID=              (e.g. ca-pub-1234567890123456 — empty = ad slots render nothing)
NEXT_PUBLIC_ADSENSE_SLOT_HEADER=            (slot ID from AdSense dashboard for header banner)
NEXT_PUBLIC_ADSENSE_SLOT_ABOVE_RESULT=      (slot ID for above-result banner on /[domain])
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=           (slot ID for sidebar rectangle on /[domain], desktop only)
NEXT_PUBLIC_ADSENSE_SLOT_MID_RESULT=        (slot ID for mid-result native ad on /[domain])
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=            (slot ID for footer banner)

ADMIN_EMAIL=admin@flndrn.com
HARO_EMAIL=haro@flndrn.com
INDEXNOW_KEY=                               (32-char hex for Bing/Yandex/DuckDuckGo push)
RESEND_API_KEY=                             (only when contact form added — not in MVP)
RESEND_FROM=noreply@flndrn.com
RESEND_REPLY_TO=admin@flndrn.com
```

## Theme Provider & Favicon Setup

### Theme provider

Use `next-themes` with `class` strategy (Tailwind v4 default) and `defaultTheme="dark"` matching the brand identity (the aubergine background is the primary visual). Allow system preference override and manual toggle via the theme switcher.

```tsx
// app/providers.tsx
"use client";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
```

Wrap `<Providers>` around `{children}` in `app/layout.tsx`. Add `suppressHydrationWarning` on the `<html>` element (next-themes requires this).

### Favicon registration

Next.js 15+ auto-detects `app/favicon.ico` but for SVG favicons in `/public/`, register explicitly via Metadata API:

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "my whois — domain lookup with live age & health score", template: "%s | my whois" },
  description: "Look up any domain. See its live age, health score, registrar, DNS records, SSL info, and tech stack — all on one page.",
  metadataBase: new URL("https://my-whois.com"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg", // SVG works for modern iOS; consider adding /apple-touch-icon.png if iOS coverage matters
  },
  openGraph: {
    type: "website",
    url: "https://my-whois.com",
    siteName: "my whois",
    title: "my whois — domain lookup with live age & health score",
    description: "Look up any domain. See its live age, health score, registrar, DNS records, SSL info, and tech stack — all on one page.",
    images: [{ url: "/og.png", width: 1200, height: 630 }], // generate or static OG image; can be Phase 2
  },
  twitter: {
    card: "summary_large_image",
    title: "my whois — domain lookup with live age & health score",
    description: "Look up any domain. See its live age, health score, registrar, DNS records, SSL info, and tech stack — all on one page.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};
```

The `/favicon.svg` registration uses the user-provided file directly. No conversion to .ico needed for modern browsers; if older browser support matters later, add a fallback `/favicon.ico`.



After every code change that should affect the live site:

1. Wait for Dokploy auto-deploy to complete
2. Fetch the relevant URL and verify the change is live
3. For SEO changes: check view-source for JSON-LD, canonical, meta description
4. For new routes: confirm 200 response, server-side rendered HTML, presence in sitemap
5. Validate schema with https://search.google.com/test/rich-results
6. After SEO infrastructure is live, run a final pass:
   - Fetch `https://my-whois.com/sitemap.xml` — valid XML, includes all expected URLs
   - Fetch `https://my-whois.com/robots.txt` — references sitemap
   - Fetch `https://my-whois.com/[INDEXNOW_KEY].txt` — returns the key
   - Trigger a sample IndexNow push as a sanity test
7. Footer renders correctly on all pages, both themes:
   - Auto-current-year displayed
   - flndrn-icon at `size-6` between "by" and "flndrn", flndrn yellow `#F5C842` in both themes
   - Privacy Policy and Terms of Service links on right side
   - Stacks vertically on mobile, side-by-side on `sm:` and up
8. Header renders correct logo per theme:
   - Dark theme: `logo.svg` desktop, `icon.svg` mobile (`<sm`)
   - Light theme: `logo_light.svg` desktop, `icon_light.svg` mobile (`<sm`)
   - Switching between themes via the theme toggle does NOT cause a flash of wrong logo (SSR-safe)
   - Both variants are visually crisp on retina (no pixelation, no CSS filter artifacts)
9. Favicon shows correctly in browser tab:
   - `/favicon.svg` registered via Metadata API in `app/layout.tsx`
   - Tab shows the my whois icon, not Next.js default favicon
   - Works in Chrome, Firefox, Safari (SVG favicons are universally supported in 2026)
10. AdSense integration verified:
    - Pre-approval / before slot IDs are set: `<AdSlot />` placeholders render as empty divs with reserved height; no broken iframes, no console errors, no layout shift
    - Post-approval / with `NEXT_PUBLIC_ADSENSE_CLIENT_ID` set: AdSense library script appears in `<head>` via Next.js `<Script>` (visible in view-source)
    - Post-approval / with each `NEXT_PUBLIC_ADSENSE_SLOT_*` set: corresponding `<ins class="adsbygoogle">` elements appear in DOM with correct `data-ad-slot` and `data-ad-client` attributes
    - `https://my-whois.com/ads.txt` returns the publisher line in plain text once added
    - PageSpeed Insights CLS stays <0.1 with ads loaded (test on `/[domain]` result page since it has the most slots)
    - No ads render on `/privacy`, `/terms`, `/about` pages (until/unless those pages reach 300+ words of content)
    - No ads render on 404 / error pages

Don't mark anything "done" until the live site reflects the change.

## Begin

In order:

1. Fetch `https://agecheckup.com` once to study the live UX as visual reference
2. `ultrathink` to lock UX decisions, output a brief decision log
3. `/superpowers` to produce the file-by-file build plan mapped to the sub-agent split
4. Spawn sub-agents A, B, C, D in parallel
5. Integrate in main session
6. Deploy to Dokploy via push to `main`
7. Verify live site, fix anything broken
8. Implement the SEO Registration & Free-Traffic Playbook code portions (sitemap, robots.txt, IndexNow, schema)
9. Surface to the user: "Site is live and indexable. Here's your manual checklist for Google Search Console, Bing, Yandex, IndexNow ownership file, HARO/Qwoted signups, and Reddit/Quora seeding."

Do not ask for approval between phases. Execute the full plan.