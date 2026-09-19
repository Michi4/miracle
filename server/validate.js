// Input validation (zod). Every admin write goes through these schemas.
import { z } from 'zod'

const DATE_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/

function realDate(s) {
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
