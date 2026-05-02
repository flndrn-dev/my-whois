# Loowii — Deployment Server (Dokploy on Hostinger VPS)

> Drop this file into any project repo (e.g. as `LOOWII-DOKPLOY.md` or inline inside `CLAUDE.md`).
> When this file is in context, Claude Code already knows where the project deploys, how, and under what conventions. No need to re-explain per project.

---

## TL;DR for Claude Code

- This project deploys to **Loowii** — J's self-hosted **Dokploy** PaaS on a Hostinger VPS.
- **Panel:** https://admin.loowii.com — the Dokploy dashboard. The only subdomain on `loowii.com`. Projects do **not** live under `loowii.com`.
- **Server IP:** `187.124.209.17` (single-node Dokploy).
- **Project URLs:** **every project runs on its own domain** (e.g. `briven.sh`, `mavifinans.sh`, `ghostbot.dev`). The only subdomain on `loowii.com` is `admin.loowii.com` (the panel). No app uses a `*.loowii.com` URL.
- **Domain flow:** add the project's domain(s) in Dokploy → point DNS at `187.124.209.17` → Traefik issues a Let's Encrypt cert automatically.
- **Auto-deploy:** push to `main` on the linked GitHub repo → webhook → Dokploy builds → live.
- **Coolify is OUT.** Dokploy is the only platform on Loowii. Any Coolify references are stale.
- **Ownership model:** **Claude Code does the work. J oversees.** Claude handles SSH, Dokploy panel/API calls, project creation, domain wiring, env-var setup, and deploy verification. J approves scope and reviews results.
- **Hard global rules** (apply to every project deployed here):
  - No email addresses in any UI, log, or public page.
  - No IP addresses in any UI, log, or public page.

---

## Server

| | |
|---|---|
| Provider | Hostinger VPS |
| OS | Ubuntu LTS (verify with recon) |
| Public IP | `187.124.209.17` |
| Panel URL | `https://admin.loowii.com` (Dokploy dashboard — the only subdomain in use) |
| Reverse proxy | Traefik v3 (managed by Dokploy) |
| SSL | Let's Encrypt (auto, per-project domain) |
| Container runtime | Docker + Docker Compose |
| Orchestrator | Dokploy (single-node) |

### SSH

```bash
ssh root@187.124.209.17
```

> Claude Code uses this SSH access to do the operational work — provision Dokploy projects via the API, wire domains, set env vars, troubleshoot deploys. **J oversees rather than executes.** When Claude SSHes, it stays scoped to the project at hand and never touches other projects' containers, configs, or volumes on the box. Routine deploys still flow through `git push main` → GitHub webhook → Dokploy build.

---

## What runs on the box

Confirm exact list with `loowii-recon.sh`. Expected baseline:

- **`dokploy`** — main control plane (web UI on `admin.loowii.com`).
- **`dokploy-postgres`** — Dokploy's own metadata DB.
- **`dokploy-redis`** — Dokploy queue / cache.
- **`dokploy-traefik`** — ingress for every app on the box. Reads its dynamic config from `/etc/dokploy/traefik/dynamic/`.
- **One container per deployed project** — built by Dokploy from the linked GitHub repo using the configured build pack (Dockerfile / Nixpacks / Buildpacks / Static).

All app containers join the `dokploy-network` Docker network so Traefik can route to them by service name.

---

## Deploy flow (what Claude Code should assume on every push)

1. **Repo is linked to Dokploy** via the Dokploy GitHub App. Claude Code wires this once per new project (via Dokploy API or panel automation, then J reviews).
2. **Push to `main`** → GitHub webhook → Dokploy.
3. Dokploy clones the new commit, builds with the configured **build pack**:
   - **Dockerfile** (preferred when present at repo root).
   - **Nixpacks** (default fallback for most Next.js / Node apps).
   - **Static** (for plain HTML/CSS/JS bundles).
4. Dokploy stops the old container, starts the new one, and updates the Traefik router.
5. App is live at the project's own domain(s) (e.g. `briven.sh`, `mavifinans.sh`) — whichever domains are configured in Dokploy → project → Domains.

> If the build fails, Dokploy keeps the previous container running. Build logs are visible in the Dokploy panel under the project → Deployments tab.

### What this means for code in the repo

- A `Dockerfile` at the repo root is the most predictable build. Use one when the stack needs anything beyond what Nixpacks autodetects.
- The app must **listen on a port exposed via `EXPOSE` in the Dockerfile** (or detected by Nixpacks). Dokploy assigns the internal port; Traefik fronts it on 443.
- Never hardcode the public URL in source. Read it from an env var (`NEXT_PUBLIC_APP_URL`, `PUBLIC_BASE_URL`, etc.) set in the Dokploy panel.
- Health checks: if the app has a `/api/health` (or similar) route, configure it in the Dokploy panel under the project → Advanced → Health Check.

---

## Domains

Every project on Loowii runs on **its own real domain**. The only subdomain on `loowii.com` is `admin.loowii.com`, which serves the Dokploy dashboard. No project app is ever reachable on `loowii.com` or any of its subdomains.

### Adding a domain to a project

1. In Dokploy: **Project → Domains → Add Domain** → enter the domain (e.g. `mavifinans.sh`, `app.example.com`).
2. Set DNS at the registrar — both apex and subdomains point to the server IP:
   - **Apex (`example.com`)** → `A` record → `187.124.209.17`
   - **Subdomain (`app.example.com`)** → `A` record → `187.124.209.17` (or `AAAA` if IPv6 is enabled)
3. Dokploy + Traefik issue a Let's Encrypt cert within ~30s of DNS propagation.
4. Multiple domains per project are supported (e.g. `mavifinans.sh` primary + `mavifinans.eu` alias — both point to the same container).

---

## Conventions Claude Code should respect

These match J's cross-project standards and apply to anything deployed on Loowii:

- **Stack:** Next.js 16 + React 19 + Tailwind v4 + shadcn/ui + Convex + Framer Motion + Better Auth + Resend.
- **Database:** Convex. Never Drizzle, never Prisma.
- **Billing:** Mavi Pay (J's self-hosted Polar.sh fork) — env vars are `MAVI_*`, not `POLAR_*`.
- **Icons:** `lucide-animated` for UI, `react-icons/ri` for social/brand. Never plain `lucide-react`.
- **Language:** All shipped UI is English-only unless the project's own `CLAUDE.md` overrides (e.g. cyclingtravel ships EN/NL).
- **Build before code:** No code is written until a formatted build plan is approved.
- **Hard privacy rules** (server-wide): no email addresses or IP addresses in any UI, log, or public-facing page — ever.

---

## Currently deployed projects

> Verify with recon; this is the working list from project history.

| Project | Domain(s) | Notes |
|---|---|---|
| Briven | `briven.sh` | AI platform |
| waypoints | `waypoints.tech` (primary), `waypoints.sh` (SDK/docs) | Unified API |
| mavi finans | `mavifinans.sh` (primary), `mavifinans.eu` (alias) | Fintech |
| GhostBot | `ghostbot.dev` | Self-hosted AI agent |
| djstudio | `videodj.studio` | Video DJ deck |
| cyclingtravel | `cyclingtravel.cc` | Cycling holidays |
| handlr | `handlr.sh` | Influencer-account marketplace |

> The **ICQ-style messenger** does **not** run on Loowii. It has its own dedicated Hostinger KVM4 VPS with a separate Dokploy install. If a project repo is for that messenger, ignore this file and refer to its own server doc.

---

## Operational basics

### Where things live on the host

- Dokploy state: `/etc/dokploy/` and `/var/lib/dokploy/`
- Traefik dynamic config: `/etc/dokploy/traefik/dynamic/`
- Per-app build context: `/etc/dokploy/applications/<app-id>/` (or `/var/lib/dokploy/...`)
- Docker data: `/var/lib/docker/`

### Common operations

| Task | Where |
|---|---|
| Trigger redeploy | Dokploy panel → project → Deploy. Or push to `main`. |
| Edit env vars | Dokploy panel → project → Environment. |
| Add a domain | Dokploy panel → project → Domains. |
| View logs | Dokploy panel → project → Logs (live tail). |
| Roll back | Dokploy panel → project → Deployments → pick a previous build → Redeploy. |
| Open a shell into a container | Dokploy panel → project → Terminal. |

### Disaster recovery

- Dokploy supports built-in backups (panel → Settings → Backups). Configure to push to S3-compatible storage.
- Convex is hosted (Convex Cloud), not on this VPS — no DB backup needed for app data, only for Dokploy's own metadata DB.
- Traefik certs auto-renew. If Let's Encrypt rate-limits a domain, use a `dns-01` challenge in the Traefik config.

---

## Recon

A read-only recon script is checked in next to this file (`loowii-recon.sh`). Run it on the server when this doc needs updating:

```bash
ssh root@187.124.209.17
bash loowii-recon.sh > loowii-recon.txt 2>&1
# then paste loowii-recon.txt to Claude
```

It prints hardware, containers, networks, Traefik routes, Dokploy app dirs, firewall, and disk usage — with passwords / tokens / keys filtered out.

---

## Quick prompts for Claude Code

When working in any project repo that includes this file, common asks become one-liners:

- _"Add the domain `app.example.com` to this project"_ → Claude Code knows the steps above (Dokploy panel + DNS A record to `187.124.209.17`) and produces a checklist.
- _"Add a Dockerfile that builds cleanly on Loowii"_ → Claude Code knows it must `EXPOSE` a port and avoid hardcoding URLs.
- _"Wire env vars for production"_ → Claude Code knows env values live in the Dokploy panel, not in the repo, and uses `MAVI_*` (not `POLAR_*`) for billing.
- _"Set up a health check"_ → Claude Code adds the route in code and notes the Dokploy panel field to set.

---

_Last updated: 2026-05-01 — based on project history; verify infra details with `loowii-recon.sh`._
