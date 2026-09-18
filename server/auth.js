// Session + password helpers. Raw tokens only ever live in cookies / transit;
// the DB stores SHA-256 hashes. Passwords are bcrypt (cost 12), never plaintext.
import bcrypt from 'bcryptjs'
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto'
import { getUser, createSession, getSession, deleteSession } from './store.js'

export const SESSION_TTL_MS = 12 * 60 * 60 * 1000
const DUMMY_HASH = '$2b$12$KIXxQG7m2Rz8Yv0b8vQeOe9vQeOe9vQeOe9vQeOe9vQeOe9vQeOeK'

export function hashToken(token) {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}
function sameHash(a, b) {
  const ba = Buffer.from(a, 'hex'); const bb = Buffer.from(b, 'hex')
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

export async function verifyLogin(username, password) {
  const user = getUser(username)
  // Always run bcrypt (dummy hash for unknown users) -> uniform timing, no user enumeration.
  const ok = await bcrypt.compare(String(password), user ? user.pass_hash : DUMMY_HASH)
  if (!user || !ok) return null
  return user
}

export function openSession(userId) {
  const token = randomBytes(32).toString('hex')
  const csrf = randomBytes(32).toString('hex')
  const expiresAt = Date.now() + SESSION_TTL_MS
  createSession(hashToken(token), userId, csrf, expiresAt)
  return { token, csrf, expiresAt }
}

export function readSession(req) {
  const token = req.cookies?.mira_sid
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{64}$/.test(token)) return null
  return getSession(hashToken(token))
}

export function closeSession(req) {
  const token = req.cookies?.mira_sid
  if (token && /^[0-9a-f]{64}$/.test(token)) deleteSession(hashToken(token))
}

export function checkCsrf(req, session) {
  const sent = req.get('x-csrf-token')
  return !!session && typeof sent === 'string' && sent.length === 64 && sameHash(
    createHash('sha256').update(sent, 'utf8').digest('hex'),
    createHash('sha256').update(session.csrf, 'utf8').digest('hex')
  )
}

export function hashPassword(pw) {
  return bcrypt.hash(pw, 12)
}
export async function checkPassword(pw, hash) {
  return bcrypt.compare(String(pw), hash)
}
