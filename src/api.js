// Backend client: public gigs + live IG data, admin auth + gig CRUD.
// Session cookie is httpOnly (browser sends it automatically); JS only holds the CSRF token.
let csrf = ''
export function setCsrf(t) { csrf = t || '' }

async function req(method, path, body, withCsrf = false) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (withCsrf) headers['x-csrf-token'] = csrf
  const r = await fetch(path, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  let j = null
  try { j = await r.json() } catch { /* ignore */ }
  if (!r.ok) {
    const err = new Error((j && j.error) || ('Fehler ' + r.status))
    err.status = r.status
    throw err
  }
  return j
}

const num = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0)

export async function fetchGigs(fresh = false) {
  return req('GET', '/api/gigs' + (fresh ? '?t=' + Date.now() : ''))
}

// IG thumbnail via same-origin CDN proxy (avoids cross-origin blocking).
export function thumb(u) {
  if (!u || typeof u !== 'string') return u
  const m = u.match(/^https:\/\/([^/]+)\/(.+)$/)
  if (!m) return u
  return '/ig/' + m[1] + '/' + m[2]
}

export async function fetchLive(fresh = false) {
  const j = await req('GET', '/api/live' + (fresh ? '?t=' + Date.now() : ''))
  const acc = (key, fb) => {
    const a = (j.accounts && j.accounts[key]) || {}
    return {
      posts: num(a.posts) || fb.posts,
      followers: num(a.followers) || fb.followers,
      following: num(a.following) || fb.following || 0,
      manual: !!a.manual,
    }
  }
  const rawLive = ['band', 'hannah', 'sophie'].some((k) => {
    const a = (j.accounts && j.accounts[k]) || {}
    return (Number(a.posts) || 0) > 0 || (Number(a.followers) || 0) > 0
  }) || (Array.isArray(j.media) && j.media.length > 0)
  return {
    band: acc('band', { posts: 28, followers: 300, following: 95 }),
    hannah: acc('hannah', { posts: 14, followers: 306, following: 788 }),
    sophie: acc('sophie', { posts: 19, followers: 757, following: 626 }),
    media: Array.isArray(j.media) ? j.media.map((m) => ({
      id: m.id || m.url,
      display_url: thumb(m.image),
      caption: m.caption || '',
      url: m.url,
      date: m.date || '',
      type: m.type === 'PHOTO' ? 'PHOTO' : 'REEL',
      addedAt: m.addedAt || null,
    })).filter((m) => m.display_url && m.url) : [],
    graph: !!j.graph,
    // LIVE badge only with genuinely fresh data, never on fallbacks
    syncedAt: rawLive ? (j.syncedAt || null) : null,
    checkedAt: j.checkedAt || null,
    hidden: Array.isArray(j.hidden) ? j.hidden : [],
  }
}

// ---- auth / admin ----
export async function apiLogin(username, password) {
  const j = await req('POST', '/api/auth/login', { username, password })
  setCsrf(j.csrf)
  return j
}
export async function apiLogout() {
  setCsrf('')
  try { await req('POST', '/api/auth/logout') } catch { /* ignore */ }
}
export async function apiMe() {
  const j = await req('GET', '/api/auth/me')
  setCsrf(j.csrf)
  return j
}
export async function apiChangePassword(current, next) {
  return req('POST', '/api/auth/password', { current, next }, true)
}
export async function apiCreateGig(g) {
  return req('POST', '/api/admin/gigs', g, true)
}
export async function apiUpdateGig(id, g) {
  return req('PUT', '/api/admin/gigs/' + id, g, true)
}
export async function apiDeleteGig(id) {
  return req('DELETE', '/api/admin/gigs/' + id, undefined, true)
}
export async function apiTriggerSync() {
  return req('POST', '/api/admin/sync', {}, true)
}
export async function apiAddReel(url) {
  return req('POST', '/api/admin/reels', { url }, true)
}
export async function apiDeleteReel(id) {
  return req('DELETE', '/api/admin/reels/' + encodeURIComponent(id), undefined, true)
}
export async function apiEditReel(id, patch) {
  return req('PUT', '/api/admin/reels/' + encodeURIComponent(id), patch, true)
}
export async function apiSaveStats(stats) {
  return req('PUT', '/api/admin/stats', stats, true)
}
export async function apiClearStats() {
  return req('DELETE', '/api/admin/stats', undefined, true)
}
export async function apiSetHidden(hidden) {
  return req('PUT', '/api/admin/hidden', { hidden }, true)
}
