// Pure gig-date logic (framework-free so it can be unit-tested).
// Dates are strings in DD.MM.YYYY (Austrian format), shows at 19:00 local.

export const allGigs = [
  { date:'07.08.2025', place:'Kirchdorfer Stadtspektakel', city:'Kirchdorf', note:'Stagetime 19:00 — Ein MIRACLE Classic', link:'https://www.instagram.com/miracleechoes/reel/DbtYTr4umA3/' },
  { date:'01.02.2026', place:'Bar-Café Hildegard', city:'Scharnstein', note:'tagging @miracleechoes', link:'https://www.instagram.com/hildegard__bar/p/DUNaCaADzgc/' },

  { date:'23.08.2026', place:'Schlossgartenfest', city:'Kremsmünster', note:'Open Air • Stagetime 19:00', link:'https://www.instagram.com/miracleechoes/' },
  { date:'07.08.2026', place:'Kirchdorfer Stadtspektakel', city:'Kirchdorf', note:'Offene Bühne — Session Opener Throwback', link:'https://www.instagram.com/miracleechoes/reel/DYCn-9rIgqN/' },
]

export function parseDate(s){
  const m = String(s).match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if(!m) return null
  return new Date(`${m[3]}-${m[2]}-${m[1]}T19:00:00`)
}

export function startOfDay(d){
  const c = new Date(d)
  c.setHours(0,0,0,0)
  return c
}

/** Split gigs into upcoming (>= now) ascending and past (< now) descending. */
export function splitGigs(gigs, now = new Date()){
  const day = startOfDay(now)
  const withDates = gigs
    .map(g => ({ ...g, d: parseDate(g.date) }))
    .filter(g => g.d)
  return {
    upcoming: withDates.filter(g => g.d >= day).sort((a,b)=> a.d - b.d),
    past: withDates.filter(g => g.d < day).sort((a,b)=> b.d - a.d),
  }
}

/** Next gig = soonest upcoming, else latest overall, else undefined. */
export function pickNextGig(gigs, now = new Date()){
  const { upcoming } = splitGigs(gigs, now)
  if (upcoming.length) return upcoming[0]
  const dated = gigs.map(g => ({ ...g, d: parseDate(g.date) })).filter(g => g.d)
  if (!dated.length) return undefined
  return dated.sort((a,b)=> b.d - a.d)[0]
}

/** Short badge label for the hero ticket. */
export function gigLabel(g){
  if (g.date === '07.08.2026' && g.place === 'Kirchdorfer Stadtspektakel') return '07.08. • 19:00'
  return g.date
}
