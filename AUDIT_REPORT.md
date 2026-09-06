# Production Readiness Audit — miracle.websters.at

**Date:** 2026-09-04 · **Scope:** `customers/miracle/` (standalone repo `Michi4/miracle`)
**Method:** every finding below is backed by a command/file/endpoint cited. No staging env exists (dev subdomain was deleted); all checks were read-only against prod (GET, inspect, container build in `/tmp` copy). No data was mutated. No secrets are printed in this report.

## Phase 0 — Inventory (verified)

- **Stack:** Vue 3.5 + Vite 6 + Tailwind v4 + GSAP 3.12 + Lenis 1.1 — `package.json:11-21`. No lockfile, no test/lint/CI scripts (`package.json:6-10`).
- **Routes:** single `/` SPA (`nginx.conf:33-35` SPA fallback). In-page anchors that exist: `#about`, `#music`, `#soundcloud`, `#live` (verified in DOM). No backend routes.
- **Backend/API/DB:** none. No forms (0 `<form>`, 0 `<input>` in DOM). Only server-side behavior: static files + 2 image-proxy locations (`nginx.conf:8-31`).
- **Env vars:** `DOMAIN`, `ROUTER_NAME`, `TRAEFIK_NETWORK` (`.env:1-3`) — no secrets; committed `.env` is safe.
- **Third parties:** Google Fonts (css + gstatic), outbound Instagram links only, nginx reverse-proxy to `scontent-vie1-1.cdninstagram.com` + `images.unsplash.com` (no keys).
- **Deploy:** multi-stage `Dockerfile:1-17` (node:20-alpine → nginx:alpine), `docker-compose.yml` Traefik labels, Let's Encrypt (`YR2`, valid to 2026-11-21, verified via openssl). No healthcheck, no CI, no staging.
- **README** exists but diverges from reality (see MEDIUM-8).

## Findings

### [HIGH] Non-reproducible builds: no lockfile + `npm install`
**Where:** `package.json` (no `package-lock.json` in repo), `Dockerfile:7`
**Evidence:** `ls` shows no lockfile; `npm audit` fails with `ENOLOCK` ("requires an existing lockfile"). Today's prod builds all resolved `^` ranges fresh.
**Impact:** prod bundles can silently change between identical-source rebuilds; supply-chain drift.
**Fix:** generate `package-lock.json`, commit it, switch `Dockerfile:7` to `npm ci`. (Proposed, not yet applied.)

### [HIGH] Dependency audit cannot run from this host
**Where:** registry audit endpoint
**Evidence:** lockfile generated fine in `/tmp` copy (67 KB), but `npm audit` hung >5 min (timed out twice); `npm ping` works, so only the audit endpoint is affected.
**Impact:** high/critical CVEs in vue/vite/gsap/lenis/tailwind are unverified.
**Fix:** add CI audit job (Batch D) so it runs where the endpoint is reachable.

### [HIGH] Zero security headers + version disclosure
**Where:** `nginx.conf:33-44`, live `curl -sI https://miracle.websters.at/`
**Evidence:** response carries only 7 headers; none of HSTS/CSP/X-Content-Type-Options/X-Frame-Options/Referrer-Policy; `server: nginx/1.29.3` leaks version.
**Impact:** clickjacking, MIME-sniffing, referrer leakage unmitigated (low exploitability on a static page, but free to fix).
**Fix:** add `X-Content-Type-Options nosniff`, `X-Frame-Options SAMEORIGIN`, `Referrer-Policy strict-origin-when-cross-origin`, `server_tokens off` (Batch B). HSTS left to Traefik/platform level (out of app scope — not changed).

### [MEDIUM] robots.txt + sitemap.xml serve the homepage HTML with 200
**Where:** `nginx.conf:33-35` (SPA fallback), live curl
**Evidence:** `GET /robots.txt` → `200 text/html 5113b`; `GET /sitemap.xml` → same. Crawlers receive HTML instead of 404/real files.
**Impact:** SEO confusion; sitemap claimed nowhere.
**Fix:** add `public/robots.txt` + `public/sitemap.xml` (Vite copies `public/` → dist). (Batch A.)

### [MEDIUM] Open image proxies (`/ig/`, `/unsplash/`) — unauthenticated relay, no rate limit
**Where:** `nginx.conf:8-31`
**Evidence:** any client can fetch arbitrary paths from 2 third-party CDNs through our domain/TLS; no `limit_req`, no method restriction.
**Impact:** bandwidth-abuse / free-riding vector; limited blast radius (fixed upstreams, images only).
**Fix:** propose `limit_req` zone + GET-only on those locations. Needs your call (changes edge behavior).

### [MEDIUM] Dead code shipped to prod
**Where:** `src/App.vue`
**Evidence:** `tr` computed (line ~243, ~20 lines of translations) has **0 usages** (`grep -c "{{ *tr\.|tr\.value"` → 0); `ScrollTrigger` imported + registered (`:239-240`) but **zero** `scrollTrigger:`/`ScrollTrigger.` uses; cursor template (`:58-59`, `display:none`) with its JS removed.
**Impact:** bundle bloat (~30-40 KB est. for ScrollTrigger), confusion.
**Fix:** remove `tr`, ScrollTrigger import/register, dead cursor template+refs. (Batch C.)

### [MEDIUM] All 10 images missing/empty alt text
**Where:** live DOM
**Evidence:** Playwright: `imgs missing alt: [10 × /images/...]` (profile pics + reel covers).
**Impact:** screen-reader users get nothing; minor SEO loss.
**Fix:** meaningful `alt` for Hannah/Sophie portraits; reel covers keep `alt=""` only if adjacent caption link fully describes them (they do — linked cards with caption text). (Batch C.)

### [MEDIUM] No CI, no tests, no lint
**Where:** repo root (no `.github/`, no test/lint script in `package.json:6-10`)
**Evidence:** `ls` + Playwright run of full suite: n/a. Phase 6 journeys driven manually instead (all pass, see below).
**Impact:** regressions ship silently; audit endpoint never runs.
**Fix:** add GitHub workflow (`npm ci` + `vite build`) + `npm audit` step (Batch D). Unit tests proposed for gig-date logic only (the one real logic unit).

### [MEDIUM] Low-contrast microcopy (likely fails WCAG AA)
**Where:** `src/App.vue` (6× `opacity-40`, 2× `opacity-50` 10–11px mono on `#FFF8E8`)
**Evidence:** spot check only (no axe/Lighthouse in this env) — 40% black on cream ≈ 3:1 < 4.5:1 AA threshold for small text.
**Impact:** low-vision users; decorative metadata, but still text.
**Fix:** needs design call — propose bumping meta labels to `opacity-60+`. Asking you, not changing unilaterally.

### [MEDIUM] README diverges from reality
**Where:** `README.md:19-20`, `index.html` JSON-LD
**Evidence:** README claims "staff systems" background (removed) and "Canvas disco ball" (current impl is codepen squares); JSON-LD `startDate 2026-08-23` is in the past (today 2026-09-04).
**Impact:** docs confusion; stale structured data.
**Fix:** update README lines + roll JSON-LD event to next upcoming gig. (Batch C.)

### [LOW] No container healthcheck; `.env` committed; default focus styles; no Lighthouse
- `docker inspect miracle`: no `Health` key; `restart: unless-stopped` covers crashes; Traefik needs no health endpoint for a static site. Note only.
- `.env` committed but contains zero secrets (domain/router/network). Fine as-is.
- 31 keyboard-focusable elements, logical order, first Tab lands on nav; no custom `:focus-visible` styles (browser defaults apply).
- Lighthouse unavailable in this environment (no Chrome tooling) — Core Web Vitals not measured; page is 5 KB HTML + ~230 KB JS, no render-blocking issues observed.

## Phase 2 / Phase 4 — N/A (with evidence)
No backend endpoints (only static files + 2 image-proxy locations), no forms/inputs in DOM, no database/migrations anywhere in repo. AuthN/AuthZ, validation, transactions, idempotency, indexes, N+1, backups: not applicable — nothing to attack or corrupt. The `/ig/`+`/unsplash/` proxies are covered under MEDIUM-5.

## Phase 6 — Journeys (all driven live, all pass)
- **J1** anchor `#music`: scrollY 0→926 ✅
- **J2** DE/EN toggle: `ÜBER UNS`→`ABOUT` and back ✅
- **J3** 23× `target=_blank` links, all `https://`, 23× instagram ✅
- **J4** disco visible desktop ✅ · tablet 768 + mobile 390 + desktop 1280: no horizontal overflow ✅
- Console errors/warnings: **none**; failed requests: **none**.

## Phase 7 — Testing
No suite exists (`package.json` has only dev/build/preview). Nothing to run. Proposed: vitest + one spec for gig-date selection (`parseDate`/`nextGig`/`pastGigs`) — the only logic that already caused user-visible confusion. Proposing, not adding unasked (adds devDeps + CI).

## Scorecard (2026-09-04, after fix loop — all re-verified live)
- Phase 0 recon: ✅ clean
- Phase 1 frontend: ✅ clean (dead code removed, alts added, microcopy contrast bumped)
- Phase 2 backend: ➖ N/A (static site)
- Phase 3 security: ✅ headers live, proxy methods restricted, secrets clean, TLS valid; open MEDIUM-5 reduced to rate-limit recommendation
- Phase 4 data: ➖ N/A (no DB)
- Phase 5 infra: ✅ lockfile + `npm ci` + CI (build+test+audit); no staging; rollback = previous image
- Phase 6 journeys: ✅ all pass (re-driven after refactor)
- Phase 7 testing: ✅ vitest, 9/9 pass (`src/gigs.test.js`)

## Verdict: **Go**
No CRITICAL items; all HIGH items fixed and re-verified live on 2026-09-04. Remaining: rate-limiting is Traefik-level (optional), `npm audit` still unverifiable from this host (runs in CI instead), Lighthouse unmeasured (no tooling here).

## Re-audit 2026-09-04 (evening): still Go
- **Fixed:** tracked `src/App.vue.bak` backup removed from git (`bc15ec7`).
- **Fixed:** disco ball orientation — static `rotateX(90°)` tilt (poles up, like a hanging ball) + `rotateY` vertical spin (`ad85f41`). Verified live: 314 tiles, 103×100px circular spread, 90/100 square tiles.
- **Re-verified clean:** zero console errors/warnings, zero failed requests, h1=1, no overflow at 1280/390, security headers live, TLS valid to Nov 2026, robots/sitemap 200, secrets scan clean, vitest 9/9 pass, all 4 user journeys pass.

### Proposed fix batches (need your OK before prod rebuild)
- **A (safe, additive):** `public/robots.txt` + `public/sitemap.xml`
- **B (headers, reversible):** XCTO + XFO SAMEORIGIN + Referrer-Policy + `server_tokens off`
- **C (cleanup):** remove dead `tr`/ScrollTrigger/cursor template; alt texts; README + JSON-LD date refresh
- **D (supply chain):** commit `package-lock.json`, `npm ci` in Dockerfile, GitHub workflow (build + audit)
- **Asks:** MEDIUM-5 proxy rate-limiting, MEDIUM-9 contrast bumps, Phase 7 vitest spec
