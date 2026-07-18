/** Local calendar date as YYYY-MM-DD (hotel shift day, not UTC). */
export function localIsoDate(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Subtract whole calendar days from a date, return local YYYY-MM-DD. */
export function localDaysAgoIso(days: number, now = new Date()): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days)
  return localIsoDate(d)
}
