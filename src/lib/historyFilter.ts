import type { ShiftHandover } from '../types'
import { localDaysAgoIso, localIsoDate } from './dates'

export type HistoryFilter = 'today' | '7d' | 'all'

export function todayIsoDate(now = new Date()): string {
  return localIsoDate(now)
}

/** Inclusive window start for last N calendar days (N=7 → today and 6 prior). */
export function daysAgoIso(days: number, now = new Date()): string {
  return localDaysAgoIso(days - 1, now)
}

export function filterHandoversByDate(
  handovers: ShiftHandover[],
  filter: HistoryFilter,
  now = new Date(),
): ShiftHandover[] {
  if (filter === 'all') return handovers
  if (filter === 'today') {
    const today = todayIsoDate(now)
    return handovers.filter((h) => h.date === today)
  }
  const start = daysAgoIso(7, now)
  return handovers.filter((h) => h.date >= start)
}

/**
 * Default filter: Today when any handover has today's date, else All.
 * Mobile-friendly for end-of-shift browsing.
 */
export function defaultHistoryFilter(handovers: ShiftHandover[], now = new Date()): HistoryFilter {
  const today = todayIsoDate(now)
  return handovers.some((h) => h.date === today) ? 'today' : 'all'
}
