# MIRACLE — Official Website

Website for the Austrian band **MIRACLE** (Hannah & Sophie).

## Stack

- Vue 3 + Vite
- Tailwind CSS v4
- GSAP (ScrollTrigger) + Lenis smooth scroll
- Docker + Nginx
- Traefik (reverse proxy, Let's Encrypt)

## Features

- 🇦🇹 German-first with EN/DE toggle (auto-detect via `navigator.language`)
- Reels from Instagram (@miracleechoes) — images served locally
- SoundCloud "coming soon" section
- Live gigs + past shows
- Playful artsy background (music notes, staff systems, blobs)
- Canvas disco ball (zero flicker, Firefox-safe)
- Full SEO: Open Graph, Twitter, JSON-LD `MusicGroup` schema

## Run locally

```bash
npm install
npm run dev
```

## Deploy (Docker)

```bash
docker compose up -d --build
```

Requires Traefik network `proxy` and env vars (see `.env`):

- `DOMAIN` — miracle.websters.at
- `ROUTER_NAME` — traefik router prefix
- `TRAEFIK_NETWORK` — docker network (proxy)

Live at [https://miracle.websters.at](https://miracle.websters.at)
