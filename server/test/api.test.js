// API integration tests: validation, auth flow, gig CRUD, live shape.
// Run: npm test  (node --test test/)
import { test, before, after } from 'node:test'
import assert from 'node:assert'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import bcrypt from 'bcryptjs'

process.env.DB_PATH = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mira-')), 't.db')
process.env.COOKIE_SECURE = '0'

const { createApp } = await import('../index.js')
const { gigSchema } = await import('../validate.js')
const { parseCounts } = await import('../live.js')
const { createUser, seedGigsIfEmpty } = await import('../store.js')
const { extractShortcode, parsePostMeta, addCustomReel, removeCustomReel, listCustomReels } = await import('../reels.js')

let base, jar

before(async () => {
  seedGigsIfEmpty([{ date: '23.08.2026', place: 'Schlossgartenfest', city: 'Kremsmünster', note: 'Open Air', link: 'https://www.instagram.com/miracleechoes/' }])
  createUser('sophie', bcrypt.hashSync('geheim-12345-super', 4))
  const app = createApp()
  await new Promise((r) => { const s = app.listen(0, () => { base = `http://127.0.0.1:${s.address().port}`; globalThis.__srv = s; r() }) })
  jar = ''
})

after(() => { globalThis.__srv?.close() })

async function api(method, p, body, csrf) {
  const h = { 'Content-Type': 'application/json', Cookie: jar }
  if (csrf) h['x-csrf-token'] = csrf
  const r = await fetch(base + p, { method, headers: h, body: body ? JSON.stringify(body) : undefined, redirect: 'manual' })
  const set = r.headers.get('set-cookie')
  if (set) jar = set.split(';')[0]
  let j = null
  try { j = await r.json() } catch { /* ignore */ }
  return { status: r.status, json: j }
}

test('gig schema accepts valid, rejects garbage', () => {
  assert.ok(gigSchema.safeParse({ date: '23.08.2026', place: 'Fest', city: 'Linz', note: '', link: 'https://x.at/a' }).success)
  assert.ok(!gigSchema.safeParse({ date: '2026-08-23', place: 'F', city: 'L', note: '', link: 'javascript:alert(1)' }).success)
  assert.ok(!gigSchema.safeParse({ date: '31.02.2026', place: 'Fest', city: 'Linz' }).success)
})

test('parseCounts reads IG og:description', () => {
  const c = parseCounts('<meta property="og:description" content="1,234 Followers, 95 Following, 28 Posts - See ..." />')
  assert.deepEqual(c, { followers: 1234, following: 95, posts: 28 })
  assert.equal(parseCounts('<html></html>'), null)
})

test('public endpoints work', async () => {
  assert.equal((await api('GET', '/api/health')).status, 200)
  const g = await api('GET', '/api/gigs')
  assert.equal(g.status, 200)
  assert.equal(g.json.gigs.length, 1)
  const l = await api('GET', '/api/live')
  assert.equal(l.status, 200)
  assert.ok('media' in l.json && 'syncedAt' in l.json)
})

test('admin without login is rejected', async () => {
  assert.equal((await api('POST', '/api/admin/gigs', { date: '01.01.2027', place: 'Xy', city: 'Yz' })).status, 401)
  assert.equal((await api('GET', '/api/auth/me')).status, 401)
})

test('full auth + gig CRUD + password change', async () => {
  const bad = await api('POST', '/api/auth/login', { username: 'sophie', password: 'falsch' })
  assert.equal(bad.status, 401)
  const login = await api('POST', '/api/auth/login', { username: 'sophie', password: 'geheim-12345-super' })
  assert.equal(login.status, 200)
  assert.match(jar, /mira_sid=/)
  const csrf = login.json.csrf
  assert.match(csrf, /^[0-9a-f]{64}$/)

  // missing csrf -> 403
  assert.equal((await api('POST', '/api/admin/gigs', { date: '01.01.2027', place: 'Fest', city: 'Linz' })).status, 403)

  // create + update + delete roundtrip
  const c = await api('POST', '/api/admin/gigs', { date: '01.01.2027', place: 'Neujahrsfest', city: 'Linz', note: 'Test', link: '' }, csrf)
  assert.equal(c.status, 201)
  const id = c.json.gig.id
  const bad2 = await api('PUT', `/api/admin/gigs/${id}`, { date: 'nix', place: 'F', city: 'L' }, csrf)
  assert.equal(bad2.status, 400)
  const u = await api('PUT', `/api/admin/gigs/${id}`, { date: '02.01.2027', place: 'Neujahrsfest', city: 'Linz', note: '', link: '' }, csrf)
  assert.equal(u.status, 200)
  assert.equal((await api('DELETE', `/api/admin/gigs/${id}`, null, csrf)).status, 200)
  const list = await api('GET', '/api/gigs')
  assert.ok(!list.json.gigs.some((g) => g.id === id))

  // password change: wrong current fails, right one works, old stops working
  assert.equal((await api('POST', '/api/auth/password', { current: 'nope', next: 'neues-geheimes-pw' }, csrf)).status, 401)
  assert.equal((await api('POST', '/api/auth/password', { current: 'geheim-12345-super', next: 'neues-geheimes-pw' }, csrf)).status, 200)
  jar = ''
  assert.equal((await api('POST', '/api/auth/login', { username: 'sophie', password: 'geheim-12345-super' })).status, 401)
  const re = await api('POST', '/api/auth/login', { username: 'sophie', password: 'neues-geheimes-pw' })
  assert.equal(re.status, 200)
})

test('extractShortcode validates reel/post links', async () => {
  const { extractShortcode: ex } = await import('../reels.js')
  assert.equal(ex('https://www.instagram.com/miracleechoes/reel/DMxxV1mIcAT/'), 'DMxxV1mIcAT')
  assert.equal(ex('https://www.instagram.com/p/DVRl4IqCBFo/?img_index=1'), 'DVRl4IqCBFo')
  assert.equal(ex('https://instagram.com/miracleechoes/reels/ABC_def-123/'), 'ABC_def-123')
  assert.equal(ex('https://www.instagram.com/miracleechoes/'), null)
  assert.equal(ex('https://evil.com/p/ABCDEF12345/'), null)
  assert.equal(ex('not a url'), null)
  assert.equal(ex(''), null)
})

test('parsePostMeta reads post og tags', async () => {
  const { parsePostMeta: parse } = await import('../reels.js')
  const html = '<meta property="og:title" content="MIRACLE on Instagram: &quot;WALLS Cover&#x1f49c; &#064;electricleona&quot;" />'
    + '<meta property="og:image" content="https://scontent-fra3-1.cdninstagram.com/v/x.jpg?stp=dst&amp;oh=abc" />'
    + '<meta property="og:url" content="https://www.instagram.com/miracleechoes/reel/DMxxV1mIcAT/" />'
    + '<meta property="og:description" content="62 likes, 4 comments - miracleechoes on July 31, 2025: &quot;WALLS&quot;" />'
  const r = parse(html, 'https://www.instagram.com/miracleechoes/reel/DMxxV1mIcAT/')
  assert.equal(r.id, 'DMxxV1mIcAT')
  assert.equal(r.type, 'REEL')
  assert.equal(r.caption, 'WALLS Cover💜 @electricleona')
  assert.ok(r.image.includes('scontent-fra3-1.cdninstagram.com') && r.image.includes('&oh=abc'))
  assert.equal(r.date, '31.07.2025')
  assert.equal(parse('<html></html>', 'https://www.instagram.com/p/ABCDEF12345/'), null)
  assert.equal(parse(html, 'https://www.instagram.com/miracleechoes/'), null)
})

test('custom reels store roundtrip', async () => {
  const { addCustomReel: add, removeCustomReel: del, listCustomReels: list } = await import('../reels.js')
  add({ id: 'TEST1234567', image: 'https://x.cdninstagram.com/a.jpg', caption: 'Hi', url: 'https://www.instagram.com/p/TEST1234567/', type: 'PHOTO', date: '01.01.2027', addedAt: new Date().toISOString() })
  assert.ok(list().some((r) => r.id === 'TEST1234567'))
  assert.equal(del('TEST1234567'), true)
  assert.equal(del('TEST1234567'), false)
})

test('reels endpoints: auth + validation', async () => {
  jar = ''
  assert.equal((await api('POST', '/api/admin/reels', { url: 'https://www.instagram.com/p/ABCDEF12345/' })).status, 401)
  assert.equal((await api('DELETE', '/api/admin/reels/ABCDEF12345')).status, 401)
  const login = await api('POST', '/api/auth/login', { username: 'sophie', password: 'neues-geheimes-pw' })
  assert.equal(login.status, 200)
  const csrf = login.json.csrf
  assert.equal((await api('POST', '/api/admin/reels', { url: 'https://www.instagram.com/miracleechoes/' }, csrf)).status, 400)
  assert.equal((await api('POST', '/api/admin/reels', { url: 'https://evil.com/p/ABCDEF12345/' }, csrf)).status, 400)
  assert.equal((await api('DELETE', '/api/admin/reels/NOPE-NOT-HERE-1', null, csrf)).status, 404)
})
