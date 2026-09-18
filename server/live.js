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
const SYNC_EVERY_MS = 45 * 60 * 1000

/** "301 Followers, 95 Following, 28 Posts" -> {followers:301, following:95, posts:28} */
export function parseCounts(html) {
  const m = String(html).match(/<meta property="og:description" content="([^"]+)/)
  if (!m) return null
  const nums = m[1].match(/([\d.,\s]+)\s*Followers?,?\s*([\d.,\s]+)\s*Following,?\s*([\d.,\s]+)\s*Posts?/)
  if (!nums) return null
  const n = (s) => Number(String(s).replace(/[^\d]/g, '')) || 0
  return { followers: n(nums[1]), following: n(nums[2]), posts: n(nums[3]) }
}

async function fetchProfile(user) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), 15000)
  try {
    const r = await fetch(`https://www.instagram.com/${user}/`, {
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      signal: ctl.signal,
    })
    if (!r.ok) return null
    const text = await r.text()
    if (text.length > 3_000_000) return null
    return parseCounts(text)
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
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

export function readCache() {
  try {
    const raw = kvGet('live_cache')
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
  kvSet('live_cache', JSON.stringify(cache))
  return cache
}

export function startSyncLoop() {
  setTimeout(() => { syncLive().catch(() => {}) }, 5000)
  setInterval(() => { syncLive().catch(() => {}) }, SYNC_EVERY_MS)
}
