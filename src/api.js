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
  if (!r.ok) throw new Error((j && j.error) || ('Fehler ' + r.status))
  return j
}

const num = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0)

export async function fetchGigs() {
  return req('GET', '/api/gigs')
}

// IG thumbnail via same-origin CDN proxy (avoids cross-origin blocking).
export function thumb(u) {
  if (!u || typeof u !== 'string') return u
  const m = u.match(/^https:\/\/([^/]+)\/(.+)$/)
  if (!m) return u
  return '/ig/' + m[1] + '/' + m[2]
}

export async function fetchLive() {
  const j = await req('GET', '/api/live')
  const acc = (key, fb) => {
    const a = (j.accounts && j.accounts[key]) || {}
    return {
      posts: num(a.posts) || fb.posts,
      followers: num(a.followers) || fb.followers,
      following: num(a.following) || fb.following || 0,
    }
  }
  const rawLive = ['band', 'hannah', 'sophie'].some((k) => {
    const a = (j.accounts && j.accounts[k]) || {}
    return (Number(a.posts) || 0) > 0 || (Number(a.followers) || 0) > 0
  }) || (Array.isArray(j.media) && j.media.length > 0)
  return {
    band: acc('band', { posts: 28, followers: 302, following: 95 }),
    hannah: acc('hannah', { posts: 12, followers: 307, following: 0 }),
    sophie: acc('sophie', { posts: 19, followers: 741, following: 0 }),
    media: Array.isArray(j.media) ? j.media.map((m) => ({
      display_url: thumb(m.image),
      caption: m.caption || '',
      url: m.url,
      date: m.date || '',
      type: m.type === 'PHOTO' ? 'PHOTO' : 'REEL',
    })).filter((m) => m.display_url && m.url) : [],
    graph: !!j.graph,
    // LIVE badge only with genuinely fresh data, never on fallbacks
    syncedAt: rawLive ? (j.syncedAt || null) : null,
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
