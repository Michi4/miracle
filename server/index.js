// MIRACLE API: public gigs + live IG data, admin auth + gig management.
// Security: bcrypt passwords (never plaintext), opaque sessions (only hashes stored),
// httpOnly+Secure+SameSite cookies, per-session CSRF tokens, rate-limited login,
// strict zod validation on every write. No CSP (app uses inline styles) — see ADMIN.md.
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { getUserById, listGigs, insertGig, updateGig, deleteGig, seedGigsIfEmpty, countUsers, createUser, setUserPass, purgeExpiredSessions } from './store.js'
import { gigSchema, loginSchema, passwordSchema } from './validate.js'
import { verifyLogin, openSession, readSession, closeSession, checkCsrf, hashPassword, checkPassword } from './auth.js'
import { readCache, syncLive, startSyncLoop } from './live.js'
import { extractShortcode, fetchPostMeta, listCustomReels, findCustomReel, addCustomReel, removeCustomReel } from './reels.js'

// Seed gigs: repo layout (../src/gigs.js) in dev, ./seed-gigs.js in the container.
let allGigs = [
  { date: '23.08.2026', place: 'Schlossgartenfest', city: 'Kremsmünster', note: 'Open Air • Stagetime 19:00', link: 'https://www.instagram.com/miracleechoes/' },
]
try {
  const m = await import('../src/gigs.js').catch(() => import('./seed-gigs.js'))
  if (Array.isArray(m.allGigs) && m.allGigs.length) allGigs = m.allGigs
} catch { /* baked fallback above */ }

const COOKIE = 'mira_sid'
const secureCookies = process.env.COOKIE_SECURE !== '0'

function parseCookies(req) {
  const out = {}
  const h = req.headers.cookie
  if (!h) return out
  for (const part of h.split(';')) {
    const i = part.indexOf('=')
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim())
  }
  return out
}

function setSessionCookie(res, token) {
  const parts = [`${COOKIE}=${token}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${12 * 60 * 60}`]
  if (secureCookies) parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))
}
function clearSessionCookie(res) {
  const parts = [`${COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0']
  if (secureCookies) parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))
}

function validId(p) {
  const n = Number(p)
  return Number.isInteger(n) && n > 0 ? n : null
}

export function createApp() {
  const app = express()
  app.set('trust proxy', 1)
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))
  app.use(express.json({ limit: '50kb' }))
  app.use((req, _res, next) => { req.cookies = parseCookies(req); next() })
  if (process.env.ACCESS_LOG !== '0') {
    app.use((req, res, next) => {
      const t = Date.now()
      res.on('finish', () => {
        if (req.path === '/api/health') return
        console.log(`[api] ${req.method} ${req.path} -> ${res.statusCode} (${Date.now() - t}ms)`)
      })
      next()
    })
  }

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, max: 10,
    standardHeaders: 'draft-7', legacyHeaders: false,
    message: { error: 'Zu viele Versuche — bitte 15 Minuten warten.' },
  })
  const writeLimiter = rateLimit({
    windowMs: 60 * 1000, max: 60,
    standardHeaders: 'draft-7', legacyHeaders: false,
    message: { error: 'Zu viele Anfragen — kurz warten.' },
  })
  function needAuth(req, res, next) {
    const s = readSession(req)
    if (!s) return res.status(401).json({ error: 'Nicht eingeloggt.' })
    req.session = s
    next()
  }
  function needCsrf(req, res, next) {
    if (!checkCsrf(req, req.session)) return res.status(403).json({ error: 'Sicherheits-Token ungültig — Seite neu laden.' })
    next()
  }

  // ---- public ----
  app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }))

  app.get('/api/gigs', (_req, res) => {
    res.set('Cache-Control', 'public, max-age=300')
    res.json({ gigs: listGigs() })
  })

  app.get('/api/live', (_req, res) => {
    res.set('Cache-Control', 'public, max-age=300')
    const c = readCache()
    const custom = listCustomReels()
    if (c) return res.json({ ...c, media: [...custom, ...(c.media || [])], syncedAt: c.syncedAt || custom[0]?.addedAt || null })
    res.json({ accounts: { band: null, hannah: null, sophie: null }, media: custom, graph: false, syncedAt: custom[0]?.addedAt || null, checkedAt: null })
  })

  // ---- auth ----
  app.post('/api/auth/login', loginLimiter, async (req, res) => {
    const p = loginSchema.safeParse(req.body)
    if (!p.success) return res.status(400).json({ error: 'Benutzername und Passwort eingeben.' })
    const user = await verifyLogin(p.data.username, p.data.password)
    if (!user) return res.status(401).json({ error: 'Benutzername oder Passwort falsch.' })
    const s = openSession(user.id)
    setSessionCookie(res, s.token)
    res.json({ ok: true, user: { username: user.username }, csrf: s.csrf })
  })

  app.post('/api/auth/logout', (req, res) => {
    closeSession(req)
    clearSessionCookie(res)
    res.json({ ok: true })
  })

  app.get('/api/auth/me', needAuth, (req, res) => {
    res.json({ user: { username: req.session.username }, csrf: req.session.csrf })
  })

  app.post('/api/auth/password', needAuth, needCsrf, async (req, res) => {
    const p = passwordSchema.safeParse(req.body)
    if (!p.success) return res.status(400).json({ error: p.error.issues[0]?.message || 'Ungültig.' })
    const row = getUserById(req.session.user_id)
    if (!row || !(await checkPassword(p.data.current, row.pass_hash))) {
      return res.status(401).json({ error: 'Aktuelles Passwort falsch.' })
    }
    setUserPass(req.session.user_id, await hashPassword(p.data.next))
    res.json({ ok: true })
  })

  // ---- admin gigs ----
  app.post('/api/admin/gigs', needAuth, needCsrf, writeLimiter, (req, res) => {
    const p = gigSchema.safeParse(req.body)
    if (!p.success) return res.status(400).json({ error: p.error.issues[0]?.message || 'Ungültig.' })
    res.status(201).json({ gig: { id: insertGig(p.data), ...p.data } })
  })

  app.put('/api/admin/gigs/:id', needAuth, needCsrf, writeLimiter, (req, res) => {
    const id = validId(req.params.id)
    if (!id) return res.status(400).json({ error: 'Ungültige ID.' })
    const p = gigSchema.safeParse(req.body)
    if (!p.success) return res.status(400).json({ error: p.error.issues[0]?.message || 'Ungültig.' })
    if (!updateGig(id, p.data)) return res.status(404).json({ error: 'Gig nicht gefunden.' })
    res.json({ gig: { id, ...p.data } })
  })

  app.delete('/api/admin/gigs/:id', needAuth, needCsrf, writeLimiter, (req, res) => {
    const id = validId(req.params.id)
    if (!id) return res.status(400).json({ error: 'Ungültige ID.' })
    if (!deleteGig(id)) return res.status(404).json({ error: 'Gig nicht gefunden.' })
    res.json({ ok: true })
  })

  app.post('/api/admin/reels', needAuth, needCsrf, writeLimiter, async (req, res) => {
    const url = String(req.body?.url || '').trim().slice(0, 500)
    const id = extractShortcode(url)
    if (!id) return res.status(400).json({ error: 'Das ist kein Instagram Post-/Reel-Link.' })
    if (findCustomReel(id)) return res.status(409).json({ error: 'Dieser Post ist schon auf der Seite.' })
    let meta = null
    try { meta = await fetchPostMeta(url) } catch { meta = null }
    if (!meta) return res.status(502).json({ error: 'Instagram liefert gerade keine Daten — später nochmal versuchen.' })
    res.status(201).json({ reel: addCustomReel(meta) })
  })

  app.delete('/api/admin/reels/:id', needAuth, needCsrf, writeLimiter, (req, res) => {
    const id = String(req.params.id || '')
    if (!/^[A-Za-z0-9_-]{5,30}$/.test(id)) return res.status(400).json({ error: 'Ungültige ID.' })
    if (!removeCustomReel(id)) return res.status(404).json({ error: 'Nicht gefunden.' })
    res.json({ ok: true })
  })

  app.post('/api/admin/sync', needAuth, needCsrf, writeLimiter, async (_req, res) => {
    try {
      const c = await syncLive()
      res.json({ ok: true, syncedAt: c.syncedAt, graph: c.graph })
    } catch {
      res.status(502).json({ error: 'Sync fehlgeschlagen — Instagram blockt gerade.' })
    }
  })

  app.use('/api', (_req, res) => res.status(404).json({ error: 'not found' }))
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Ungültiges JSON.' })
    res.status(500).json({ error: 'Serverfehler.' })
  })

  return app
}

async function seedAdmin() {
  if (countUsers() > 0) return
  const user = (process.env.ADMIN_USER || '').trim().toLowerCase()
  const hash = (process.env.ADMIN_PASSWORD_HASH || '').trim()
  if (!user || !/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash)) {
    console.warn('[api] Kein Admin angelegt: ADMIN_USER / ADMIN_PASSWORD_HASH fehlt oder ist kein bcrypt-Hash. Siehe ADMIN.md.')
    return
  }
  createUser(user, hash)
  console.log(`[api] Admin "${user}" angelegt.`)
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (isMain) {
  const seeded = seedGigsIfEmpty(allGigs)
  if (seeded) console.log(`[api] ${seeded} Gigs aus gigs.js übernommen.`)
  await seedAdmin()
  purgeExpiredSessions()
  setInterval(purgeExpiredSessions, 60 * 60 * 1000)
  startSyncLoop()
  const port = Number(process.env.PORT || 3000)
  createApp().listen(port, () => console.log(`[api] listening on :${port}`))
}

export { store } from './store.js'
