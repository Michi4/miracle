import { describe, it, expect } from 'vitest'
import { parseDate, splitGigs, pickNextGig, gigLabel, allGigs } from './gigs.js'

const gig = (date, place = 'X') => ({ date, place, city: 'Y', note: '', link: '' })

describe('parseDate', ()=>{
  it('parses DD.MM.YYYY as 19:00 local showtime', ()=>{
    const d = parseDate('23.08.2026')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(7)
    expect(d.getDate()).toBe(23)
    expect(d.getHours()).toBe(19)
  })
  it('returns null for garbage', ()=>{
    expect(parseDate('nope')).toBeNull()
    expect(parseDate('')).toBeNull()
    expect(parseDate('2026-08-23')).toBeNull()
  })
})

describe('splitGigs', ()=>{
  const now = new Date('2026-06-01T12:00:00')
  const gigs = [gig('01.01.2026'), gig('01.08.2026'), gig('bad-date'), gig('01.06.2026')]
  it('puts today-or-later in upcoming ascending, drops unparseable', ()=>{
    const { upcoming, past } = splitGigs(gigs, now)
    expect(upcoming.map(g=>g.date)).toEqual(['01.06.2026', '01.08.2026'])
    expect(past.map(g=>g.date)).toEqual(['01.01.2026'])
  })
})

describe('pickNextGig', ()=>{
  it('picks the soonest upcoming gig', ()=>{
    const gigs = [gig('01.08.2026', 'Far'), gig('01.07.2026', 'Near')]
    expect(pickNextGig(gigs, new Date('2026-06-01')).place).toBe('Near')
  })
  it('falls back to the latest gig when everything is past', ()=>{
    const gigs = [gig('01.01.2025', 'Old'), gig('01.03.2025', 'Newer')]
    expect(pickNextGig(gigs, new Date('2026-06-01')).place).toBe('Newer')
  })
  it('returns undefined for empty/unparseable lists', ()=>{
    expect(pickNextGig([], new Date())).toBeUndefined()
    expect(pickNextGig([gig('xx')], new Date())).toBeUndefined()
  })
})

describe('gigLabel', ()=>{
  it('keeps the special Kirchdorf short label', ()=>{
    expect(gigLabel(gig('07.08.2026', 'Kirchdorfer Stadtspektakel'))).toBe('07.08. • 19:00')
  })
  it('defaults to the plain date', ()=>{
    expect(gigLabel(gig('23.08.2026', 'Schlossgartenfest'))).toBe('23.08.2026')
  })
})

describe('real gig data', ()=>{
  it('every entry has a parseable date and an https link', ()=>{
    for (const g of allGigs){
      expect(parseDate(g.date), g.place).not.toBeNull()
      expect(g.link.startsWith('https://')).toBe(true)
    }
  })
})
