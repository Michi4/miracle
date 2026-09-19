// Input validation (zod). Every admin write goes through these schemas.
import { z } from 'zod'

const DATE_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/

export function realDate(s) {
  const m = DATE_RE.exec(s || '')
  if (!m) return false
  const d = Number(m[1]); const mo = Number(m[2]); const y = Number(m[3])
  if (y < 2000 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return false
  const dt = new Date(y, mo - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d
}

export const gigSchema = z.object({
  date: z.string().regex(DATE_RE, 'Datum muss DD.MM.YYYY sein').refine(realDate, 'Kein gültiges Datum'),
  place: z.string().trim().min(2, 'Ort zu kurz').max(80),
  city: z.string().trim().min(2, 'Stadt zu kurz').max(80),
  note: z.string().trim().max(160).default(''),
  link: z.string().trim().max(500).default('').refine(
    (s) => s === '' || /^https:\/\/[^\s/$.?#].[^\s]*$/i.test(s),
    'Link muss mit https:// beginnen'
  ),
})

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(200),
})

export const passwordSchema = z.object({
  current: z.string().min(1).max(200),
  next: z.string().min(1, 'Bitte neues Passwort eingeben.').max(200),
})

const statAccount = z.object({
  posts: z.number().int().min(0).max(999999999),
  followers: z.number().int().min(0).max(999999999),
  following: z.number().int().min(0).max(999999999),
})
export const statsSchema = z.object({
  band: statAccount,
  hannah: statAccount,
  sophie: statAccount,
})

export const reelEditSchema = z.object({
  caption: z.string().trim().min(1, 'Text fehlt.').max(600).optional(),
  date: z.string().regex(DATE_RE, 'Datum muss DD.MM.YYYY sein').refine(realDate, 'Kein gültiges Datum').optional(),
  type: z.enum(['REEL', 'PHOTO']).optional(),
}).refine((o) => Object.keys(o).length > 0, 'Nichts zu ändern.')

export const hiddenSchema = z.object({
  hidden: z.array(z.string().trim().min(1).max(500).refine((s) => /^https:\/\/[^\s]+$/i.test(s), 'Nur https-Links.')).max(50).default([]),
})

export const clientErrorSchema = z.object({
  message: z.string().min(1).max(500),
  source: z.string().max(200).default(''),
  href: z.string().max(500).default(''),
  vp: z.string().max(20).default(''),
})
