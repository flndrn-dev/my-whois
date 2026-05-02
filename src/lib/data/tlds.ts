// TLD reference data for /tld/[tld] SEO pages. Hand-curated, English-only.
// Counts are rounded "ballpark" figures from publicly available registry
// reports — directional, not authoritative. Renewal costs are mid-2026
// observable street prices in USD across the 13 registrars wired up
// elsewhere in the project; treat as a guide, not a quote.

export type TldType =
  | "legacy-gtld" // .com, .net, .org, .info, .biz
  | "new-gtld" // .app, .dev, .xyz, .blog, .tech ...
  | "country-code"; // .io, .me, .co, .ai, .sh ...

export type TldEntry = {
  /** Lowercase, no leading dot. */
  tld: string;
  /** "the .com namespace" / "Anguilla's country code repurposed for AI" — short headline. */
  tagline: string;
  type: TldType;
  registry: string;
  /** Year the TLD was first delegated in the root zone. */
  introduced: number;
  /** Approximate registered-domain count, rough order of magnitude. */
  approxDomains: string;
  /** Typical USD renewal price street average. */
  renewalUsd: string;
  /** Two paragraph original commentary. ~120-180 words combined. */
  body: string[];
  /** 3 best-fit registrar IDs from src/lib/data/registrars.ts. */
  recommendedRegistrars: string[];
  /** Single-sentence "best for" line. */
  bestFor: string;
};

export const TLDS: TldEntry[] = [
  {
    tld: "com",
    tagline: "the default namespace of the commercial internet",
    type: "legacy-gtld",
    registry: "Verisign",
    introduced: 1985,
    approxDomains: "160 million+",
    renewalUsd: "$11–$15",
    bestFor: "anything you want people to remember without thinking about it",
    body: [
      ".com is still the trust default. Forty years after delegation it carries more brand weight than any newer extension, especially with non-technical users — when someone hears a brand and types it without thinking, they type .com. That trust premium is why secondary-market .com prices stay an order of magnitude higher than every other TLD.",
      "The downside: short, memorable .com names are gone or expensive. Most modern startups end up with a longer phrase, a hyphenation, or accept a non-.com. Verisign's wholesale renewal price is regulated and rises a few percent yearly under contract with ICANN; expect $11–$15 retail for years to come.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "hostinger"],
  },
  {
    tld: "net",
    tagline: "the original network-infrastructure TLD turned generic backup",
    type: "legacy-gtld",
    registry: "Verisign",
    introduced: 1985,
    approxDomains: "13 million+",
    renewalUsd: "$13–$18",
    bestFor: "ISPs, network tooling, and brand-protection registrations alongside .com",
    body: [
      ".net was originally intended for network providers — ISPs, hosting, infrastructure. That signal still carries faintly: a B2B network-tools brand on .net reads naturally. For consumer brands it now reads as 'they couldn't get .com', so most owners use it defensively rather than as a primary.",
      "Renewal cost is slightly above .com because Verisign sets it slightly higher and registrars don't compete as hard. Useful as a brand-protection registration to prevent typo-squatting if your primary is the .com.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "namesilo"],
  },
  {
    tld: "org",
    tagline: "non-profits, open source, and trust signaling",
    type: "legacy-gtld",
    registry: "Public Interest Registry",
    introduced: 1985,
    approxDomains: "10 million+",
    renewalUsd: "$13–$20",
    bestFor: "non-profits, foundations, communities, open-source projects",
    body: [
      ".org reads as 'organisation, probably non-profit'. It's the default choice for charities, standards bodies, foundations, Wikipedia, and most open-source projects. The Public Interest Registry runs it as a non-profit itself, which has translated into relatively stable pricing and policy over decades.",
      "There is no enforcement that you actually be a non-profit — anyone can register. But the connotation is strong, so a commercial business on .org without an obvious mission focus reads as slightly off. Use it deliberately, not as a fallback.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "namesilo"],
  },
  {
    tld: "io",
    tagline: "British Indian Ocean Territory ccTLD adopted by tech",
    type: "country-code",
    registry: "Internet Computer Bureau (ICB) / Identity Digital",
    introduced: 1997,
    approxDomains: "1.4 million+",
    renewalUsd: "$40–$60",
    bestFor: "developer tools, APIs, infrastructure brands, indie SaaS",
    body: [
      ".io was meant for the British Indian Ocean Territory but the 'I/O' coincidence pulled it into the dev tooling world around 2010. Today most VC-funded developer brands use it (GitHub.io, Sentry.io, Vercel.io once existed) and renewal prices reflect that demand — three to five times .com territory.",
      "Concerns about the territory's contested governance occasionally resurface, but Identity Digital's operational stability and ICANN backing have kept .io safe in practice. The premium price is the real friction point, not legal risk.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "spaceship"],
  },
  {
    tld: "ai",
    tagline: "Anguilla's country code, now the AI-startup default",
    type: "country-code",
    registry: "Government of Anguilla",
    introduced: 1995,
    approxDomains: "850,000+",
    renewalUsd: "$80–$140",
    bestFor: "AI products, ML companies, model APIs",
    body: [
      ".ai exploded post-2022 as AI startup branding. Anguilla's tiny government is now collecting tens of millions in registry fees — a staggering windfall for a 15,000-person territory. The price reflects that demand: $80–$140/year is normal, sometimes locked into 2-year minimum registrations.",
      "Renewals can be confusing because Anguilla's registry has historically required 2-year purchases at registration. Most registrars handle the abstraction transparently but watch for surprise long-term commitments. For an AI product launching today, .ai is still the sharpest signal you can fly.",
    ],
    recommendedRegistrars: ["porkbun", "spaceship", "namecheap"],
  },
  {
    tld: "dev",
    tagline: "Google's HTTPS-only TLD for developers",
    type: "new-gtld",
    registry: "Google Registry",
    introduced: 2014,
    approxDomains: "400,000+",
    renewalUsd: "$15–$22",
    bestFor: "personal developer sites, project subdomains, and dev-tool brands",
    body: [
      ".dev is unusual: every domain is HSTS-preloaded by Chrome, meaning you cannot serve plain HTTP under .dev — only HTTPS. This was a deliberate Google choice and it keeps the namespace clean. There is no malware-friendly subset.",
      "Pricing is reasonable, registrar support is universal, and the meaning is unambiguous. Excellent for a personal portfolio (yourname.dev), an internal tools subdomain, or a developer-product brand. The HSTS rule means you must have a valid TLS certificate from day one — Let's Encrypt makes that trivial in 2026.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "spaceship"],
  },
  {
    tld: "app",
    tagline: "another Google HTTPS-only TLD for apps and product sites",
    type: "new-gtld",
    registry: "Google Registry",
    introduced: 2018,
    approxDomains: "650,000+",
    renewalUsd: "$15–$22",
    bestFor: "consumer apps, product landing pages, mobile-first brands",
    body: [
      ".app inherits .dev's HSTS-preload posture — HTTPS is mandatory and there is no fallback. The semantic 'this is a product, not just a homepage' fits well for B2C and B2B SaaS landing pages.",
      "Adoption is strong: Slack used app.slack.com long before web apps were universal, and many post-2020 mobile-first brands lead with .app rather than .com when the .com is unavailable or expensive. Renewal prices stayed sensible in 2026 thanks to broad registrar competition.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "spaceship"],
  },
  {
    tld: "co",
    tagline: "Colombia's ccTLD repositioned as a global startup TLD",
    type: "country-code",
    registry: ".CO Internet S.A.S.",
    introduced: 1991,
    approxDomains: "3 million+",
    renewalUsd: "$25–$35",
    bestFor: "shorter alternative when the .com is taken, startup brands",
    body: [
      ".co was opened to global registrations in 2010 and quickly positioned as a 'shorter than .com, sounds like company' alternative. It still trades at a meaningful premium over .com but well below .io or .ai.",
      "The colour reading is closer to 'startup' than 'developer' — Angel.co, About.me-style B2C brands, and one-page launches. For B2B technical audiences .io or .dev signals fit better; for consumer brands and quick startups .co works.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "namesilo"],
  },
  {
    tld: "sh",
    tagline: "Saint Helena ccTLD, naturally fitting shell-flavored projects",
    type: "country-code",
    registry: "ICB Information Services",
    introduced: 1997,
    approxDomains: "200,000+",
    renewalUsd: "$60–$90",
    bestFor: "shell scripting tools, CLI projects, devops side-projects",
    body: [
      ".sh was issued for Saint Helena, a remote South Atlantic island. Its accidental match with the Unix shell extension pulled it into devops side-projects (curl-pipe-bash one-liners, install scripts) and eventually small CLI tooling brands.",
      "The price is on par with .io's premium and the supply of short names is decent because mainstream consumers don't compete here. If your brand explicitly is shell-flavoured (a bash linter, an oh-my-zsh plugin manager, a deploy CLI), .sh still reads great. Otherwise .dev is more universal.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "spaceship"],
  },
  {
    tld: "me",
    tagline: "Montenegro's ccTLD, popular for personal sites",
    type: "country-code",
    registry: "doMEn",
    introduced: 2008,
    approxDomains: "1.3 million+",
    renewalUsd: "$18–$28",
    bestFor: "personal portfolios, link-in-bio pages, individual brands",
    body: [
      ".me reads as 'about me', which is exactly how it caught on after Montenegro opened it globally in 2008. Personal portfolios, About-me-style pages, link-in-bio sites, and individual consultant brands fill the namespace.",
      "Pricing is reasonable, almost every registrar supports it, and short single-word .me names are still findable. Less suitable for B2B unless your brand specifically reads as personal-flavoured.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "namesilo"],
  },
  {
    tld: "info",
    tagline: "the legacy 'information' gTLD, often discounted heavily",
    type: "legacy-gtld",
    registry: "Identity Digital",
    introduced: 2001,
    approxDomains: "3 million+",
    renewalUsd: "$15–$30",
    bestFor: "content sites, documentation hubs, defensive registrations",
    body: [
      ".info launched in 2001 as one of the first non-com gTLDs. It never reached .com or .net status and is now mostly used either for content-heavy sites where the meaning fits or as a defensive registration around a primary brand.",
      "First-year prices are often heavily discounted (sometimes under $2) but renewals normalise to $15–$30. Spam reputation is mixed — Gmail and most filters don't auto-suspect .info but some corporate firewalls remain skeptical.",
    ],
    recommendedRegistrars: ["namecheap", "namesilo", "porkbun"],
  },
  {
    tld: "biz",
    tagline: "the 'business' gTLD that never quite stuck",
    type: "legacy-gtld",
    registry: "GoDaddy Registry",
    introduced: 2001,
    approxDomains: "1.5 million+",
    renewalUsd: "$15–$25",
    bestFor: "small businesses where the .com is unavailable",
    body: [
      ".biz launched alongside .info in 2001 and was meant for businesses that couldn't get the .com they wanted. Adoption was modest and the namespace has a slight 'budget' connotation for some readers — useful where pragmatism beats brand polish.",
      "Pricing is competitive, registrar support is universal, and there's no real downside beyond reader perception. Local services, brick-and-mortar shops, and small B2B firms can use it without raising eyebrows.",
    ],
    recommendedRegistrars: ["namecheap", "namesilo", "godaddy"],
  },
  {
    tld: "xyz",
    tagline: "cheap-to-register new gTLD with a wide range of uses",
    type: "new-gtld",
    registry: "XYZ.COM LLC",
    introduced: 2014,
    approxDomains: "3 million+",
    renewalUsd: "$10–$15",
    bestFor: "experimental projects, generation-Z brands, crypto landing pages",
    body: [
      ".xyz launched in 2014 with aggressive registrar promotions ($1 first year was common) and now sits as one of the largest non-legacy TLDs by registered count. Alphabet famously used abc.xyz for the Google parent-company restructure, which gave it durable credibility.",
      "Registration prices remain low but renewals normalise. There is some spam reputation in certain spam filters; for a customer-facing B2B product you may want to verify deliverability if you'll be sending email from the domain.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "spaceship"],
  },
  {
    tld: "tech",
    tagline: "broad new-gTLD aimed at technology brands",
    type: "new-gtld",
    registry: "Radix Registry",
    introduced: 2015,
    approxDomains: "850,000+",
    renewalUsd: "$45–$70",
    bestFor: "technology companies, gadget reviews, hardware brands",
    body: [
      ".tech is a generic-meaning new gTLD operated by Radix. It reads cleanly as 'technology brand' and works in a wide range of categories from hardware to consumer-electronics review sites to corporate tech subsidiaries.",
      "Renewal pricing is on the higher end of new-gTLD territory. Short single-word names are mostly taken or reserved as premium with steep one-time fees, so plan around two-word combinations.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "godaddy"],
  },
  {
    tld: "blog",
    tagline: "purpose-named TLD for blog brands",
    type: "new-gtld",
    registry: "Knock Knock WHOIS Not There, LLC (Automattic)",
    introduced: 2016,
    approxDomains: "200,000+",
    renewalUsd: "$30–$50",
    bestFor: "newsletter brands, personal blogs that want unambiguous signal",
    body: [
      ".blog was launched and is operated by Automattic (the company behind WordPress.com). The semantic value is direct: a .blog domain reads as 'this is a blog' without any explanation needed.",
      "Pricing is mid-range. Useful as a signal that you take publishing seriously, especially for newsletter writers, personal essayists, or thoughtful technical bloggers. Less suitable for product or company sites where the blog is one section of many.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "godaddy"],
  },
  {
    tld: "site",
    tagline: "generic new-gTLD with low first-year promos",
    type: "new-gtld",
    registry: "Radix Registry",
    introduced: 2015,
    approxDomains: "1.8 million+",
    renewalUsd: "$25–$40",
    bestFor: "stealth project landing pages, temporary microsites, internal tools",
    body: [
      ".site is the most generic of the new gTLDs — it just says 'a website'. Adoption has been driven mostly by aggressive promotional pricing in the first year (often under $2) but renewal cost normalises to $25–$40.",
      "Use cases tend toward microsites and short-lived project pages rather than primary brands. Legitimate but unremarkable; readers won't react either way.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "namesilo"],
  },
  {
    tld: "online",
    tagline: "broad new-gTLD aimed at consumer brands",
    type: "new-gtld",
    registry: "Radix Registry",
    introduced: 2015,
    approxDomains: "1.5 million+",
    renewalUsd: "$30–$45",
    bestFor: "online stores, content hubs, e-commerce subsidiaries",
    body: [
      ".online competes with .site and .store for the broad-meaning new-gTLD slot. It reads slightly more 'business-online' than the others and can suit e-commerce or service-business landing pages.",
      "Pricing follows the typical Radix pattern: heavy first-year discount, mid-range renewal. Short names are taken or premium-priced. Email deliverability is generally fine.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "godaddy"],
  },
  {
    tld: "store",
    tagline: "e-commerce-flavoured new gTLD",
    type: "new-gtld",
    registry: "Radix Registry",
    introduced: 2016,
    approxDomains: "700,000+",
    renewalUsd: "$50–$80",
    bestFor: "online shops, brand stores, ecommerce subsidiaries",
    body: [
      ".store communicates 'we sell things' instantly. Larger brands sometimes use it as the storefront subdomain (brand.store) while keeping the corporate site on .com.",
      "Renewal pricing is on the higher side. Short generic English nouns are often premium-priced — plan a brand-prefixed combination.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "godaddy"],
  },
  {
    tld: "cloud",
    tagline: "infrastructure-flavoured new gTLD",
    type: "new-gtld",
    registry: "Aruba S.p.A.",
    introduced: 2015,
    approxDomains: "350,000+",
    renewalUsd: "$25–$45",
    bestFor: "cloud platforms, hosting services, B2B SaaS infrastructure",
    body: [
      ".cloud reads exactly as it says — useful for infrastructure-flavoured brands, hosting services, and B2B SaaS where the cloud-native positioning matters. Aruba operates the registry from Italy.",
      "Pricing is mid-range. Adoption has been steady rather than explosive. Works well as a B2B subsidiary domain or a stealth product launch. Email reputation is clean in 2026.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "godaddy"],
  },
  {
    tld: "so",
    tagline: "Somalia's ccTLD repositioned as the 'social' TLD",
    type: "country-code",
    registry: "SamNIC",
    introduced: 1997,
    approxDomains: "120,000+",
    renewalUsd: "$25–$45",
    bestFor: "social products, two-letter brands, conjunction-style names",
    body: [
      ".so was issued for Somalia and reopened to global registration in 2010. The 'so' suffix works well in conjunction-style brand names (notion.so, super.so) and as a short two-letter ccTLD.",
      "Pricing is reasonable and short names are still findable. Less colour than .io or .co but specifically appealing for product names where 'so' completes a phrase.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "namesilo"],
  },
  {
    tld: "fm",
    tagline: "Federated States of Micronesia ccTLD adopted by audio brands",
    type: "country-code",
    registry: "FSM Telecommunications",
    introduced: 1995,
    approxDomains: "60,000+",
    renewalUsd: "$80–$140",
    bestFor: "podcasts, music products, audio-first brands",
    body: [
      ".fm was issued for the Federated States of Micronesia. Its accidental match with FM radio pulled it into the audio world: podcasts, music streaming products (last.fm), and radio-flavoured brands. Last.fm cemented the connotation in the late 2000s.",
      "Pricing is steeply premium because audio is a popular brand category. Renewals can also be lumpy — some registrars require two-year purchase. Worth it for an audio brand; otherwise a curiosity.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "spaceship"],
  },
  {
    tld: "tv",
    tagline: "Tuvalu's ccTLD, the de-facto video-content TLD",
    type: "country-code",
    registry: "Verisign (under Tuvalu agreement)",
    introduced: 1995,
    approxDomains: "350,000+",
    renewalUsd: "$30–$50",
    bestFor: "video content brands, streaming services, broadcasters",
    body: [
      ".tv was issued for Tuvalu and the registry agreement now sits with Verisign. The 'tv' meaning is universal — streaming products (twitch.tv), video content sites, and broadcaster subsidiaries fit naturally.",
      "Pricing is mid-premium. Tuvalu reportedly receives a meaningful percentage of the country's national income from .tv registrations. Email deliverability is fine; readers immediately understand the brand category.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "godaddy"],
  },
  {
    tld: "gg",
    tagline: "Guernsey ccTLD adopted by gaming",
    type: "country-code",
    registry: "Channel Islands Registry",
    introduced: 1996,
    approxDomains: "120,000+",
    renewalUsd: "$50–$80",
    bestFor: "gaming products, esports brands, multiplayer platforms",
    body: [
      ".gg was issued for the British Crown dependency of Guernsey. The 'gg' meaning ('good game' in gaming culture) pulled it into the esports and gaming-product world with overwhelming category fit.",
      "Pricing reflects gaming-industry demand. battle.gg, faceit.gg, and most modern esports brands use it. Less colour outside gaming but inside it the signal is strong.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "spaceship"],
  },
  {
    tld: "build",
    tagline: "construction-and-infrastructure flavoured new gTLD",
    type: "new-gtld",
    registry: "Plan Bee LLC",
    introduced: 2014,
    approxDomains: "10,000+",
    renewalUsd: "$70–$100",
    bestFor: "construction firms, infrastructure tooling, build pipelines",
    body: [
      ".build is a niche new gTLD with a literal meaning. Useful both for construction-industry firms and (somewhat ironically) software build tooling, since 'build' is a load-bearing verb in CI/CD culture.",
      "Pricing is steep relative to volume. Niche but unambiguous — readers immediately get the category. Adoption is light, so short names are still available.",
    ],
    recommendedRegistrars: ["namecheap", "godaddy", "namesilo"],
  },
  {
    tld: "new",
    tagline: "Google Registry single-purpose redirector TLD",
    type: "new-gtld",
    registry: "Google Registry",
    introduced: 2015,
    approxDomains: "30,000+",
    renewalUsd: "$60–$80",
    bestFor: "one-click action shortcuts (docs.new, sheets.new, slack.new)",
    body: [
      ".new is unusual: Google Registry restricts it to single-purpose domains that 'create something new' on visit. doc.new opens a fresh Google Doc, slack.new creates a new Slack workspace, etc. Registrations require a use-case approval step.",
      "Pricing is high relative to other new gTLDs because of restricted use. Not for general branding. Worth registering only if you have a real one-click-creates-new-thing use case for your product.",
    ],
    recommendedRegistrars: ["godaddy", "namecheap", "porkbun"],
  },
  {
    tld: "tools",
    tagline: "developer-and-utility flavoured new gTLD",
    type: "new-gtld",
    registry: "Identity Digital",
    introduced: 2014,
    approxDomains: "30,000+",
    renewalUsd: "$30–$50",
    bestFor: "small CLI tools, indie utilities, internal-team toolboxes",
    body: [
      ".tools is direct: a .tools domain reads as 'a collection of utilities or tools'. Suits a personal toolbelt site, a niche utility product, or an internal team's shared bookmark collection.",
      "Pricing is mid-range. Adoption is light, which makes short names still discoverable. Works well as a secondary branded domain for an established product (e.g., yourbrand.tools).",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "namesilo"],
  },
  {
    tld: "software",
    tagline: "self-explanatory new gTLD for software brands",
    type: "new-gtld",
    registry: "Identity Digital",
    introduced: 2014,
    approxDomains: "30,000+",
    renewalUsd: "$30–$50",
    bestFor: "software product brands, SaaS subsidiaries, code-first companies",
    body: [
      ".software reads as exactly that. A clean fit for a software product brand or a SaaS subsidiary domain. Less catchy than shorter alternatives but unambiguous.",
      "Pricing is mid-range. Best used in conjunction with a strong brand prefix — short one-word .software names are mostly taken or premium.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "godaddy"],
  },
  {
    tld: "agency",
    tagline: "service-business flavoured new gTLD",
    type: "new-gtld",
    registry: "Identity Digital",
    introduced: 2014,
    approxDomains: "60,000+",
    renewalUsd: "$25–$40",
    bestFor: "creative agencies, marketing firms, consulting brands",
    body: [
      ".agency communicates service business immediately. Suits creative shops, marketing firms, design studios, or consulting practices where the agency model is part of the positioning.",
      "Pricing is reasonable for a meaningful new gTLD. Email reputation is clean. Short single-word names are gone but two-word combinations (yourname.agency) work well.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "namesilo"],
  },
  {
    tld: "design",
    tagline: "creative-flavoured new gTLD with strong adoption",
    type: "new-gtld",
    registry: "Identity Digital",
    introduced: 2014,
    approxDomains: "200,000+",
    renewalUsd: "$30–$50",
    bestFor: "design studios, individual designer portfolios, design tools",
    body: [
      ".design has earned a strong reputation in the creative community. Designer portfolios, design-tool brands (figma's main was .com but invision.design, etc.), and design studios all use it without explanation.",
      "Pricing is mid-range. Identity Digital operates a clean policy with no surprise restrictions. Short personal names (firstname-lastname.design) are findable for individual designers building a portfolio site.",
    ],
    recommendedRegistrars: ["porkbun", "namecheap", "godaddy"],
  },
  {
    tld: "digital",
    tagline: "broad new-gTLD for technology and consulting",
    type: "new-gtld",
    registry: "Identity Digital",
    introduced: 2014,
    approxDomains: "200,000+",
    renewalUsd: "$30–$50",
    bestFor: "digital consultancies, transformation projects, technology subsidiaries",
    body: [
      ".digital fits broad technology and consulting positioning — digital transformation projects, technology consultancies, agencies in the digital-services space.",
      "Less colour than more specific TLDs (.dev, .agency, .design) but more flexible. Reasonable mid-range pricing. Adoption is steady; readers don't react either way.",
    ],
    recommendedRegistrars: ["namecheap", "porkbun", "godaddy"],
  },
];

export const POPULAR_TLDS_FOR_HOMEPAGE = [
  "com",
  "io",
  "ai",
  "dev",
  "app",
  "co",
  "sh",
  "me",
] as const;

export function getTld(slug: string): TldEntry | null {
  const lc = slug.toLowerCase().replace(/^\./, "");
  return TLDS.find((t) => t.tld === lc) ?? null;
}
