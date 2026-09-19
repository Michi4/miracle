// Custom reels: Sophie & Hannah fügen per Link neue Posts/Reels hinzu (kein Meta-Setup nötig).
// Die Post-Seite liefert stabile og:-Tags (für Link-Vorschau gedacht): og:image = Thumbnail,
// og:title = Caption. Serverseitig geholt + validiert, im kv-Store (Volume) persistiert.
import { kvGet, kvSet } from './store.js'

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
const MAX_REELS = 24

export function extractShortcode(url) {
  try {
    const u = new URL(String(url || '').trim())
    if (!/^(www\.)?instagram\.com$/i.test(u.hostname)) return null
    const m = u.pathname.match(/^\/(?:[A-Za-z0-9_.]+\/)?(?:p|reel|reels)\/([A-Za-z0-9_-]{5,30})\/?/)
    return m ? m[1] : null
  } catch {
    return null
  }
}

function unescapeHtml(s) {
  return String(s)
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => { try { return String.fromCodePoint(parseInt(h, 16)) } catch { return '' } })
    .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(Number(d)) } catch { return '' } })
    .replace(/&amp;/g, '&')
}

const MONTHS = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 }

function todayDe() {
  const d = new Date()
  const p = (x) => String(x).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`
}

/** Pure parser: post HTML + URL -> reel object or null. */
export function parsePostMeta(html, url) {
  const id = extractShortcode(url)
  if (!id) return null
  const t = String(html || '')
  const get = (prop) => {
    const m = t.match(new RegExp('<meta property="' + prop + '" content="([^"]*)"'))
    return m ? unescapeHtml(m[1]) : ''
  }
  const image = get('og:image')
  if (!/^https:\/\/[a-z0-9-]+\.(cdninstagram\.com|fbcdn\.net)\//i.test(image)) return null
  const title = get('og:title')
  let caption = ''
  const tm = title.match(/^(.+?) on Instagram: "([\s\S]*)"$/)
  if (tm) caption = tm[2].trim()
  else if (title) caption = title.trim()
  if (!caption) return null
  let date = todayDe()
  const dm = get('og:description').match(/on ([A-Z][a-z]+) (\d{1,2}), (\d{4})/)
  if (dm && MONTHS[dm[1]]) {
    const p = (x) => String(x).padStart(2, '0')
    date = `${p(Number(dm[2]))}.${p(MONTHS[dm[1]])}.${dm[3]}`
  }
  const canon = get('og:url')
  return {
    id,
    image, // exact CDN URL, never modified (signature!)
    caption: caption.slice(0, 600),
    url: /^https:\/\/(www\.)?instagram\.com\//i.test(canon) ? canon.split('?')[0] : String(url).split('?')[0],
    type: /\/reels?\-?\//i.test(String(url)) || /\/reel\//i.test(String(url)) ? 'REEL' : 'PHOTO',
    date,
    addedAt: new Date().toISOString(),
  }
}

export async function fetchPostMeta(url) {
  if (!extractShortcode(url)) return null
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), 15000)
  try {
    const r = await fetch(String(url).split('?')[0], {
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      signal: ctl.signal,
    })
    if (!r.ok) return null
    const text = await r.text()
    if (text.length > 3_000_000) return null
    return parsePostMeta(text, url)
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

// ---- store (kv, newest first) ----
export function listCustomReels() {
  try {
    const raw = kvGet('custom_reels')
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}
function saveCustomReels(arr) {
  kvSet('custom_reels', JSON.stringify(arr.slice(0, MAX_REELS)))
}
export function findCustomReel(id) {
  return listCustomReels().find((r) => r.id === id) || null
}
export function addCustomReel(meta) {
  const arr = listCustomReels().filter((r) => r.id !== meta.id)
  arr.unshift(meta)
  saveCustomReels(arr)
  return meta
}
export function removeCustomReel(id) {
  const arr = listCustomReels()
  const next = arr.filter((r) => r.id !== id)
  if (next.length === arr.length) return false
  saveCustomReels(next)
  return true
}
export function editCustomReel(id, patch) {
  const arr = listCustomReels()
  const row = arr.find((r) => r.id === id)
  if (!row) return null
  if (patch.caption !== undefined) row.caption = patch.caption
  if (patch.date !== undefined) row.date = patch.date
  if (patch.type !== undefined) row.type = patch.type
  saveCustomReels(arr)
  return row
}
