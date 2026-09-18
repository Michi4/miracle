// File-backed storage (JSON, atomic tmp+rename writes, mode 0600).
// Single Node process => sync read-modify-write is race-free.
// Same API surface a SQLite version would offer; tables: users, sessions, gigs, kv.
import fs from 'node:fs'
import path from 'node:path'

const dbPath = process.env.DB_PATH || './miracle.json'

function empty() {
  return { users: [], sessions: [], gigs: [], kv: {}, seq: { gig: 1 } }
}

function load() {
  try {
    if (!fs.existsSync(dbPath)) return empty()
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    if (!data || !Array.isArray(data.users)) throw new Error('bad shape')
    data.sessions ||= []
    data.gigs ||= []
    data.kv ||= {}
    data.seq ||= { gig: 1 }
    return data
  } catch (e) {
    try {
      if (fs.existsSync(dbPath)) fs.renameSync(dbPath, dbPath + '.corrupt-' + Date.now())
    } catch { /* ignore */ }
    console.warn('[store] starting fresh (previous file missing/corrupt, backed up).')
    return empty()
  }
}

let state = load()

export function save() {
  try {
    fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true })
    const tmp = dbPath + '.tmp-' + process.pid
    fs.writeFileSync(tmp, JSON.stringify(state))
    fs.chmodSync(tmp, 0o600)
    fs.renameSync(tmp, dbPath)
  } catch (e) {
    console.error('[store] save failed:', e.message)
  }
}

// ---- users ----
export function getUser(username) {
  return state.users.find((u) => u.username === String(username).toLowerCase()) || null
}
export function getUserById(id) {
  return state.users.find((u) => u.id === id) || null
}
export function countUsers() {
  return state.users.length
}
export function createUser(username, passHash) {
  const id = state.users.reduce((m, u) => Math.max(m, u.id), 0) + 1
  state.users.push({ id, username: String(username).toLowerCase(), pass_hash: passHash, created_at: new Date().toISOString() })
  save()
  return id
}
export function setUserPass(userId, passHash) {
  const u = getUserById(userId)
  if (!u) return
  u.pass_hash = passHash
  save()
}

// ---- sessions (only SHA-256 hashes stored, never raw tokens) ----
export function createSession(tokenHash, userId, csrf, expiresAt) {
  state.sessions.push({ token_hash: tokenHash, user_id: userId, csrf, expires_at: expiresAt })
  save()
}
export function getSession(tokenHash) {
  const i = state.sessions.findIndex((s) => s.token_hash === tokenHash)
  if (i < 0) return null
  const row = state.sessions[i]
  if (row.expires_at < Date.now()) {
    state.sessions.splice(i, 1)
    save()
    return null
  }
  return { ...row, username: getUserById(row.user_id)?.username || '' }
}
export function deleteSession(tokenHash) {
  const n = state.sessions.length
  state.sessions = state.sessions.filter((s) => s.token_hash !== tokenHash)
  if (state.sessions.length !== n) save()
}
export function purgeExpiredSessions() {
  const n = state.sessions.length
  state.sessions = state.sessions.filter((s) => s.expires_at >= Date.now())
  if (state.sessions.length !== n) save()
}

// ---- gigs ----
export function listGigs() {
  return state.gigs.map(({ id, date, place, city, note, link }) => ({ id, date, place, city, note, link }))
}
export function insertGig(g) {
  const id = state.seq.gig++
  state.gigs.push({ id, date: g.date, place: g.place, city: g.city, note: g.note || '', link: g.link || '', updated_at: new Date().toISOString() })
  save()
  return id
}
export function updateGig(id, g) {
  const row = state.gigs.find((x) => x.id === id)
  if (!row) return false
  Object.assign(row, { date: g.date, place: g.place, city: g.city, note: g.note || '', link: g.link || '', updated_at: new Date().toISOString() })
  save()
  return true
}
export function deleteGig(id) {
  const n = state.gigs.length
  state.gigs = state.gigs.filter((x) => x.id !== id)
  if (state.gigs.length === n) return false
  save()
  return true
}
export function seedGigsIfEmpty(seed) {
  if (state.gigs.length > 0) return 0
  let n = 0
  for (const g of seed) { insertGig(g); n++ }
  return n
}

// ---- kv (live IG cache etc.) ----
export function kvGet(key) {
  return state.kv[key] ?? null
}
export function kvSet(key, value) {
  state.kv[key] = value
  save()
}

export const store = { save }
