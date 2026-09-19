// Live Instagram sync. Two providers:
//  - "graph": official Meta Graph API (if IG_ACCESS_TOKEN + IG_USER_ID are set).
//    Full live data: follower counts + newest media (reels/photos) with captions.
//  - "scrape": no setup needed. Parses the public profile page meta tags.
//    Live follower/post counts for all accounts (media list unavailable -> app falls back to built-in posts).
// Runs at boot + every 45 min, keeps last good data on failure (stale-while-revalidate).
import { kvGet, kvSet } from './store.js'

export const ACCOUNTS = [
  { key: 'band', user: 'miracleechoes' },
  { key: 'hannah', user: 'hannah_rumetshofer' },
  { key: 'sophie', user: 'sophie.fsdr' },
]

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

/** "301 Followers, 95 Following, 28 Posts" -> {followers:301, following:95, posts:28} */
export function parseCounts(html) {
  const t = String(html)
  let m = t.match(/<meta property="og:description" content="([^"]+)/)
  if (!m) {
    // attribute order variant: <meta content="..." property="og:description" ...>
    const tag = t.match(/<meta[^>]*property="og:description"[^>]*>/)
    if (tag) m = tag[0].match(/content="([^"]+)/)
  }
  if (!m) return null
  const nums = m[1].match(/([\d.,\s]+)\s*Followers?,?\s*([\d.,\s]+)\s*Following,?\s*([\d.,\s]+)\s*Posts?/)
  if (!nums) return null
  const n = (s) => Number(String(s).replace(/[^\d]/g, '')) || 0
  return { followers: n(nums[1]), following: n(nums[2]), posts: n(nums[3]) }
}

// Instagram blocks datacenter IPs intermittently (data-less shell page).
// Try direct first, then public fetch proxies — first parseable result wins.
const SOURCES = [
  (user) => `https://www.instagram.com/${user}/`,
  (user) => `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.instagram.com/${user}/`)}`,
  (user) => `https://corsproxy.io/?url=${encodeURIComponent(`https://www.instagram.com/${user}/`)}`,
]

async function fetchText(url) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), 15000)
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      signal: ctl.signal,
    })
    if (!r.ok) return null
    const text = await r.text()
    if (!text || text.length > 3_000_000) return null
    return text
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

async function fetchProfile(user) {
  for (const build of SOURCES) {
    const text = await fetchText(build(user))
    if (!text) continue
    const c = parseCounts(text)
    if (c && (c.followers > 0 || c.posts > 0)) return c
  }
  return null
}

async function fetchGraph() {
  const token = process.env.IG_ACCESS_TOKEN
  const uid = process.env.IG_USER_ID
  if (!token || !uid) return null
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), 15000)
  try {
    const q = encodeURIComponent('followers_count,media_count,media.limit(24){id,caption,media_type,media_url,thumbnail_url,permalink,timestamp}')
    const r = await fetch(`https://graph.facebook.com/v21.0/${uid}?fields=${q}&access_token=${encodeURIComponent(token)}`, { signal: ctl.signal })
    if (!r.ok) return null
    const j = await r.json()
    const media = Array.isArray(j.media?.data) ? j.media.data.map((m) => ({
      id: String(m.id || ''),
      caption: String(m.caption || ''),
      type: m.media_type === 'VIDEO' ? 'REEL' : 'PHOTO',
      image: String(m.thumbnail_url || m.media_url || ''),
      url: String(m.permalink || ''),
      date: m.timestamp ? fmtDate(m.timestamp) : '',
    })).filter((m) => m.image && m.url) : []
    return {
      followers: Number(j.followers_count) || 0,
      posts: Number(j.media_count) || 0,
      media,
    }
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

function fmtDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const p = (x) => String(x).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`
}

const CACHE_KEY = 'live_cache_v2'

// ---- manual overrides (admin sets numbers by hand when sync is blocked) ----
export function getOverrides() {
  try {
    const raw = kvGet('stat_overrides')
    if (!raw || raw === 'null') return null
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return null
    for (const k of ['band', 'hannah', 'sophie']) {
      const a = o[k]
      if (!a || !Number.isInteger(a.posts) || !Number.isInteger(a.followers)) return null
      a.following = Number.isInteger(a.following) ? a.following : 0
    }
    return o
  } catch {
    return null
  }
}
export function setOverrides(o) {
  kvSet('stat_overrides', JSON.stringify(o))
}
export function clearOverrides() {
  kvSet('stat_overrides', 'null')
}

/** Merge scrape cache with manual overrides (override wins). Adds manual flags. */
export function mergeAccounts(cached) {
  const ov = getOverrides()
  const out = {}
  for (const k of ['band', 'hannah', 'sophie']) {
    if (ov && ov[k]) {
      out[k] = { posts: ov[k].posts, followers: ov[k].followers, following: ov[k].following, manual: true }
    } else {
      const b = (cached && cached[k]) || {}
      out[k] = {
        posts: Number(b.posts) || 0,
        followers: Number(b.followers) || 0,
        following: Number(b.following) || 0,
        manual: false,
      }
    }
  }
  return out
}

// ---- hidden baked posts ----
export function getHidden() {
  try {
    const raw = kvGet('hidden_urls')
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr.filter((u) => typeof u === 'string') : []
  } catch {
    return []
  }
}
export function setHidden(arr) {
  kvSet('hidden_urls', JSON.stringify(arr))
}

export function readCache() {
  try {
    const raw = kvGet(CACHE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

const ZERO = { followers: 0, following: 0, posts: 0 }

export async function syncLive() {
  const prev = readCache()
  const now = new Date().toISOString()
  const graph = await fetchGraph()
  const accounts = {}
  let ok = 0
  for (const a of ACCOUNTS) {
    const c = await fetchProfile(a.user)
    if (c && (c.followers > 0 || c.posts > 0)) {
      accounts[a.key] = c
      ok++
    } else {
      accounts[a.key] = prev?.accounts?.[a.key] || { ...ZERO }
    }
  }
  if (graph) {
    if (graph.followers) accounts.band.followers = graph.followers
    if (graph.posts) accounts.band.posts = graph.posts
    if (graph.followers || graph.posts) ok++
  }
  const cache = {
    accounts,
    media: graph?.media?.length ? graph.media : (prev?.media || []),
    graph: !!graph,
    // syncedAt = letzter ERFOLGREICHER Sync (nur dann zeigt die Seite ● LIVE)
    syncedAt: ok > 0 ? now : (prev?.syncedAt || null),
    checkedAt: now,
  }
  kvSet(CACHE_KEY, JSON.stringify(cache))
  // ok = ausschließlich FRISCHE Daten (Scrape-Treffer oder Graph), nie alter Cache
  const graphOk = !!(graph && (graph.followers > 0 || graph.posts > 0 || (graph.media || []).length > 0))
  return { ...cache, ok: ok > 0 || graphOk }
}

// Smart backoff, kein stumpfes Retry: 45 Min -> 90 Min -> 3 Std -> 6 Std (Cap).
// Jeder Erfolg setzt zurück. Zähler überlebt Restarts (kv).
const BASE_MS = 45 * 60 * 1000
const MAX_MS = 6 * 60 * 60 * 1000

export function startSyncLoop() {
  let fails = Number(kvGet('sync_fails') || 0) || 0
  const tick = async () => {
    let delay = BASE_MS
    try {
      const r = await syncLive()
      if (r && r.ok) {
        if (fails > 0) { fails = 0; kvSet('sync_fails', '0') }
      } else {
        throw new Error('no data')
      }
    } catch {
      fails += 1
      kvSet('sync_fails', String(fails))
      delay = Math.min(BASE_MS * 2 ** Math.min(fails, 3), MAX_MS)
    }
    setTimeout(tick, delay)
  }
  setTimeout(tick, 5000)
}
