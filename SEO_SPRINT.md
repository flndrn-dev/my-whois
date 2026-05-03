# my-whois.com — 4-Week SEO Sprint Plan

> **Start date:** 2026-05-03 · **End date:** 2026-05-30
> **Daily commitment:** 30–60 minutes
> **Goal:** Move from zero impressions to consistent organic traffic.
> Establish backlinks, content depth, and signal velocity.

---

## Why a sprint, not a campaign

SEO compounds. The first 4 weeks are about **planting** — submissions,
outreach, content, internal linking, schema. None of it pays back this
month. Most of it pays back month 2–3 onwards.

Skip days will set the curve back; consistency matters more than
intensity. 30 minutes every day beats 4 hours once a week.

---

## Outreach inbox

Use **`haro@flndrn.com`** for every signup, every directory, every
journalist pitch in this sprint. Keeps the noisy inbound out of
`admin@flndrn.com` (operational alerts only).

---

## Pre-sprint setup (do this BEFORE Day 1)

Two essentials need to be in place for Day 1 to actually work:

### 1. Generate and place `og.png` at `/public/og.png`

**The file does not exist yet.** Without it, every share to X / LinkedIn
/ Discord / iMessage / Slack falls back to nothing or to a default —
massive loss of click-through on every shared link. Spec is at the
bottom of this document under **OG Image Specification**.

### 2. Sign up to outreach platforms (one-time, ~30 min total)

Open accounts on these three before Day 1 so you can reply on Day 1:

- **HARO (Help A Reporter Out):** https://www.helpareporter.com →
  signup with `haro@flndrn.com`. Subscribe to "Tech" and "Business
  and Finance". Three queries per day arrive in your inbox.
- **Help A B2B Writer:** https://www.helpab2bwriter.com → signup,
  same email.
- **Qwoted:** https://www.qwoted.com → signup, same email.

---

## Daily rhythm — same shape every weekday

Spend ~30–45 min each weekday in this order:

1. **Search Console + Bing + Yandex check** (2 min) — quick scan
   for new impressions, indexing errors, manual actions.
2. **HARO / B2B Writer / Qwoted reply** (15 min) — 1 substantive
   reply if any query matches our niche. Skip cleanly if none fit.
3. **One Reddit or Quora post** (10 min) — substantive answer in a
   thread where my-whois data is genuinely the best response.
4. **One sprint-day-specific task** (10–15 min) — see the day-by-day
   plan below.

Weekends: directory submissions + content writing only. No outreach
(journalists don't read pitches on weekends).

---

## Week 1 — Indexing infrastructure & first backlinks

### Day 1 (Mon, 2026-05-03)

**Setup**
- [ ] Create `/public/og.png` per spec at end of doc, push to repo
- [ ] Submit homepage to Google Search Console → "URL inspection" →
      "Request indexing" for `https://my-whois.com/`
- [ ] Same for `https://my-whois.com/blog`
- [ ] Same for `https://my-whois.com/watchlist`
- [ ] Same for `https://my-whois.com/bulk`

**Outreach**
- [ ] HARO / B2B Writer / Qwoted: scan inbox, reply to 1 query if relevant

### Day 2 (Tue, 2026-05-04)

**Directory submissions** (each 5 min)
- [ ] Submit to **AlternativeTo**: list as alternative to who.is and
      whois.com → https://alternativeto.net/software/who-is/
- [ ] Submit to **Tools-rs / awesome-cli** GitHub list (PR)
- [ ] Submit to **StartupStash**: https://startupstash.com/submit/

**Outreach**
- [ ] HARO reply (1 if relevant)
- [ ] One substantive Reddit reply in r/webdev or r/sysadmin
      mentioning my-whois.com only if naturally helpful

### Day 3 (Wed, 2026-05-05)

**Backlinks via tool listings**
- [ ] Submit to **BetaList**: https://betalist.com/submit
- [ ] Submit to **SaaSHub**: https://www.saashub.com/contact
- [ ] Submit to **Slant.co**: https://www.slant.co/topics/2540/~best-whois-lookup-tools

**Outreach**
- [ ] HARO reply (1 if relevant)
- [ ] One Quora answer on a WHOIS / DNS / domain-age question

### Day 4 (Thu, 2026-05-06)

**Content depth** — add 1 substantive blog post draft
- [ ] Draft: "How to read a domain's RDAP response (the JSON behind
      every WHOIS lookup)"
      Target ~1200–1500 words. Start the file at
      `content/blog/reading-rdap-responses.mdx`. Don't ship today,
      just draft.

**Outreach**
- [ ] HARO reply (1 if relevant)
- [ ] One Reddit reply

### Day 5 (Fri, 2026-05-07)

**Ship the new post + push to indexers**
- [ ] Polish and publish `reading-rdap-responses.mdx`
- [ ] Trigger IndexNow warmup: `curl -X POST https://my-whois.com/api/indexnow/warmup`
- [ ] Add to Search Console: "Request indexing" for the new URL
- [ ] Tweet/LinkedIn the link from your personal account

**Outreach**
- [ ] HARO reply (1 if relevant)

### Weekend (Sat-Sun, 2026-05-08 / 2026-05-09)

**Directory blast** (no journalist outreach — they don't read on weekends)
- [ ] Submit to **Indie Hackers Products**: https://www.indiehackers.com/products
- [ ] Submit to **Toolify**: https://www.toolify.ai/submit
- [ ] Submit to **TopApps.ai** (free tier): https://topapps.ai/submit
- [ ] Submit to **AI Tool Hunt**: https://www.aitoolhunt.com/submit
      (mention live age + tech stack detection — they accept WHOIS tools)

---

## Week 2 — Reddit/Quora seeding + Product Hunt prep

### Day 6 (Mon, 2026-05-10)

**Reddit value-first comments** (deeper than Week 1)
- [ ] Find 3 active threads in r/webdev, r/sysadmin, r/sideproject
      where someone is asking about WHOIS, DNS, SSL, or domain age
- [ ] Write substantive replies (4+ paragraphs each), include
      my-whois.com link only if genuinely helpful
- [ ] Use UTM: `?utm_source=reddit&utm_medium=comment&utm_campaign=organic`

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 7 (Tue, 2026-05-11)

**Quora value-first answers**
- [ ] Find 3 questions on Quora about: "best WHOIS tool", "how to
      check domain age", "what is RDAP", "how to find a domain's
      registrar"
- [ ] Write substantive answers (200+ words), link only if helpful
- [ ] Don't link-spam — Quora aggressively shadowbans

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 8 (Wed, 2026-05-12)

**Product Hunt preparation** (launch in Week 4)
- [ ] Create account if not already: https://www.producthunt.com
- [ ] Set up Maker profile, link the site
- [ ] Schedule launch for **Tuesday 2026-05-26** (Tuesdays = peak
      visibility on PH)
- [ ] Prepare gallery images: 4–6 screenshots of /, /[domain],
      /compare/, /tld/, /watchlist, /bulk

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 9 (Thu, 2026-05-13)

**Internal linking audit**
- [ ] Walk every blog post: do they link to relevant /[domain]
      lookups, /tld/[tld] pages, and /compare/ pairs where helpful?
      If not, add 2–3 internal links per post.
- [ ] Walk every /tld/[tld] page: does the body link to relevant
      blog posts? Add a "Further reading" section if missing.

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 10 (Fri, 2026-05-14)

**Second blog post**
- [ ] Draft + publish: "What is DNSSEC actually for?" (different
      angle from the existing dnssec-explained post — focus on
      practical use cases, not the protocol)
- [ ] Or: "Why some domains are 4× the price of others" (TLD
      pricing economics)
- [ ] IndexNow warmup
- [ ] Search Console "Request indexing"

**Outreach**
- [ ] HARO reply (1 if relevant)

### Weekend (Sat-Sun, 2026-05-15 / 2026-05-16)

**GitHub awesome-list submissions** (the slowest-burn, longest-tail
backlink type — these stay live for years)
- [ ] **awesome-sysadmin**: https://github.com/awesome-foss/awesome-sysadmin → PR adding my-whois.com
- [ ] **awesome-devops**: https://github.com/wmariuss/awesome-devops → PR
- [ ] **awesome-dns**: https://github.com/Lutty94/awesome-dns → PR
- [ ] **awesome-domains**: search GitHub for any `awesome-domains` list
- [ ] **awesome-self-hosted**: https://github.com/awesome-selfhosted/awesome-selfhosted →
      mention my-whois.com under "Domain Tools"

---

## Week 3 — Content depth + Press outreach

### Day 11 (Mon, 2026-05-17)

**Press / journalist outreach** (proactive — not waiting on HARO)
- [ ] Find 3 tech journalists who have written about DNS, WHOIS,
      privacy, or GDPR in the last 12 months. Use Google search:
      `site:wired.com WHOIS GDPR`, `site:arstechnica.com DNS`,
      `site:theverge.com domain registrar`
- [ ] Email each (cold but value-first):
      "Hi [name], I built a free tool that does X — thought it might
      be useful next time you cover Y. Built it because [origin
      story]. No ask, just leaving it here."
- [ ] Track in this doc which 3 you contacted (add at bottom)

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 12 (Tue, 2026-05-18)

**Tweet / LinkedIn carousel**
- [ ] Create a 6-slide carousel: "How GDPR changed WHOIS forever"
      using content from your existing /blog/whois-gdpr-redaction
      post
- [ ] Tweet the equivalent thread (8 tweets) with link back to the
      blog post
- [ ] Schedule via your normal social-media tool

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 13 (Wed, 2026-05-19)

**Third blog post**
- [ ] Draft + publish: "I made a domain inspector and shipped it
      in 3 days — here's the stack" (meta-post about the build,
      generates dev / IndieHackers traffic)
- [ ] Mention Next.js 16, RDAP, the live age counter, the AdSense
      monetization decision
- [ ] IndexNow warmup
- [ ] Search Console request indexing

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 14 (Thu, 2026-05-20)

**Schema audit**
- [ ] Run https://search.google.com/test/rich-results on:
      / · /google.com · /compare/google.com-vs-bing.com ·
      /tld/com · /blog · /blog/dnssec-explained
- [ ] Fix any errors that show up. Most likely areas: Article
      schema missing `image` field, comparison page missing the
      WebSite/SearchAction.
- [ ] Re-test until all green.

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 15 (Fri, 2026-05-21)

**Heavy promotion of the meta-post from Day 13**
- [ ] Post on **Indie Hackers**: link the post in #building or
      #share-feedback
- [ ] Post on **Hacker News** if you feel the post is HN-quality:
      `Show HN: my-whois.com — domain lookup with live age,
      health score, tech stack`
- [ ] Post on **Lobste.rs** if your invite is active

**Outreach**
- [ ] HARO reply (1 if relevant)

### Weekend (Sat-Sun, 2026-05-22 / 2026-05-23)

**Final Product Hunt prep**
- [ ] Lock down the gallery images
- [ ] Write the launch description (under 260 chars)
- [ ] Draft your hunter outreach email if you don't have a hunter
      yourself: ask 2–3 PH-active makers if they'd hunt the launch
      Tuesday morning
- [ ] Soft-prime your X / LinkedIn audience: "Launching X on PH this Tuesday"

---

## Week 4 — Product Hunt launch + final pushes

### Day 16 (Mon, 2026-05-24)

**Pre-launch day**
- [ ] Confirm hunter
- [ ] Schedule launch for Tuesday 2026-05-26 at 00:01 PT
- [ ] Prepare 3-tweet thread to post the moment the launch goes live
- [ ] Prepare LinkedIn post equivalent
- [ ] Prepare 6 screenshots optimised for the PH gallery

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 17 (Tue, 2026-05-26) — **PRODUCT HUNT LAUNCH DAY**

**The big push — entire day is launch-related**
- [ ] **00:01 PT:** Launch goes live, post prepared tweets and
      LinkedIn
- [ ] **Throughout the day:** reply to every comment within 30 min,
      thank every upvoter
- [ ] **Don't ask family/friends to upvote** — Product Hunt detects
      and demotes vote rings
- [ ] **Do mention the launch** to anyone in your authentic dev /
      IndieHackers network on Discord / Slack

**Goal:** Top 5 of the day (realistic), Top 3 of the day (stretch).

### Day 18 (Wed, 2026-05-27)

**Post-launch debrief + PH follow-ups**
- [ ] Reply to remaining comments
- [ ] Thank top upvoters with a personal DM
- [ ] If there's a "Product of the Day" win — bask, then publish
      a "Lessons from launching on PH" follow-up post within a week
- [ ] Search Console: check for impression spike from PH traffic

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 19 (Thu, 2026-05-28)

**Fourth blog post — capitalise on PH momentum**
- [ ] Draft + publish: "What I learned launching a free tool with
      0 spend on Product Hunt" (or a domain-tech post if PH didn't
      move the needle)
- [ ] IndexNow warmup
- [ ] Search Console request indexing

**Outreach**
- [ ] HARO reply (1 if relevant)

### Day 20 (Fri, 2026-05-29)

**Reddit AMA setup OR analytics review**
- [ ] If audience is large enough: schedule an AMA in r/IAmA or
      r/sideproject for the week after sprint ends
- [ ] Otherwise: deep analytics review — top entry pages, bounce
      rates, dwell time, pages-per-session in Umami

**Outreach**
- [ ] HARO reply (1 if relevant)

### Weekend (Sat-Sun, 2026-05-30 / 2026-05-31) — **End of sprint**

**Retrospective**
- [ ] Snapshot Search Console impression count vs Day 1
- [ ] Snapshot Bing / Yandex impressions vs Day 1
- [ ] Count backlinks gained (use Ahrefs free tier or
      https://www.opensiteexplorer.org)
- [ ] Count organic clicks gained
- [ ] Identify the single highest-leverage activity from the 4 weeks
- [ ] Plan Sprint 2 (next month) around that activity

---

## Targets at Day 28 (end of sprint)

Realistic outcomes to expect by 2026-05-30 with consistent execution:

| Metric | Pessimistic | Realistic | Stretch |
|---|---|---|---|
| Search Console total impressions | 200 | 1500 | 5000+ |
| Search Console total clicks | 5 | 80 | 300+ |
| Backlinks (root domains) | 5 | 25 | 60+ |
| Indexed pages | 30 | 80 | 150+ |
| Bing Webmaster impressions | 100 | 800 | 3000+ |
| Affiliate signups completed | 4 | 10 | 12 |
| Blog posts published | 3 | 6 | 8 |

---

## OG Image Specification

> Read carefully — this is what you need to create before Day 1.

### Dimensions

- **Pixels:** `1200 × 630` (exact). This is the canonical OG /
  Twitter Card / LinkedIn / Discord / iMessage / Facebook size.
- **Aspect ratio:** 1.91:1
- **Resolution:** 72 DPI is fine — these are screen-only images.
- **File format:** PNG (preferred) or JPG. PNG handles flat brand
  graphics better; JPG is smaller for photographic content.
- **File size target:** under **300 KB**, hard max 8 MB. Most
  social platforms compress aggressively above 1 MB.
- **Where to put it:** `/public/og.png` (file path), accessible at
  `https://my-whois.com/og.png` after deploy.

### What the image must contain

1. **The full "my whois" wordmark logo** — use `/public/logo.svg`
   as the source. Render it at 60–80% of the canvas height,
   centered on the left third.
2. **Brand colour background:** `#2B283A` (the aubergine you use
   for dark theme). Edge-to-edge solid, no gradient.
3. **flndrn yellow accent:** `#F5C842`. Use it for ONE element —
   either as a small accent stripe at the bottom (4–6px tall), or
   as the colour of one keyword in the tagline.
4. **One clear tagline.** Suggested:
   `"Look up any domain's age, health & tech stack."`
   Set in the brand display font (Inter Tight or Instrument Serif
   italic, since you've already added Instrument Serif to the
   stack). Size: 64–72px. Colour: `#F7F7F7` off-white.
5. **The URL, small, bottom-right corner:** `my-whois.com`. Set in
   JetBrains Mono or another mono face. Size: 24–28px. Colour:
   `#B7B7B7` muted grey.
6. **Generous padding:** 80px on all sides. Don't crowd the
   canvas. The image will be cropped to a 5:2-ish rectangle in
   some places (especially X / LinkedIn) so keep important
   content within the safe zone (the central 1100 × 580 area).

### Concrete layout sketch

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ◆ my whois                                            │
│                                                         │
│                                                         │
│   Look up any domain's                                  │
│      age, health & tech stack.                          │
│   (italic word in flndrn yellow)                        │
│                                                         │
│                                                         │
│                                                         │
│                                              my-whois.com │
└─────────────────────────────────────────────────────────┘
              1200 × 630, padding 80, bg #2B283A
```

### How to actually create it

Three options, ranked by ease:

1. **Figma** (recommended): create a 1200×630 frame, drop in the
   logo SVG (it'll vectorize perfectly), set background `#2B283A`,
   use Inter Tight 72px for the headline with one italic word in
   `#F5C842`. Export as PNG at 1× (12k → 1200px). 10 minutes total.
2. **Canva**: pick a "Custom Size" 1200×630, do the same. Less
   precise typography control but faster if you don't have Figma.
3. **Existing dynamic OG endpoint**: you already have `/og` and
   `/[domain]/og` endpoints generating dynamic OG images via
   `next/og`. You can use those as a fallback by changing
   `metadataBase.openGraph.images` in `app/layout.tsx` to
   `["/og"]` (already pointing to `/og.png` though). For the
   homepage default OG, /public/og.png is preferred — it's faster
   to fetch and has no runtime cost.

### Verify after deploy

After placing `/public/og.png` and pushing:

1. Visit https://my-whois.com/og.png — image should load.
2. Open https://www.opengraph.xyz/url/https%3A%2F%2Fmy-whois.com
   → preview shows your image in X / Facebook / LinkedIn / Discord
   formats.
3. Open https://cards-dev.twitter.com/validator with the URL → X
   shows the card preview.
4. Open https://www.linkedin.com/post-inspector/ → forces LinkedIn
   to re-fetch the OG image (LinkedIn caches aggressively, so this
   tool is essential).

---

## Notes / log (fill in as you go)

_Add observations here as the sprint progresses. Things that worked
unexpectedly well. Things that flopped. Patterns you notice in
Search Console. People who responded to outreach. Posts that
got traction. Posts that didn't. This becomes the input to
Sprint 2._
