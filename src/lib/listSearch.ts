import type { ShiftHandover } from '../types'

/** Case-insensitive search across handover text fields + checklist labels. */
export function matchesListSearch(h: ShiftHandover, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  if (h.shiftLabel.toLowerCase().includes(q)) return true
  if (h.openPoints.toLowerCase().includes(q)) return true
  if (h.roomNotes.toLowerCase().includes(q)) return true
  if (h.guestNotes.toLowerCase().includes(q)) return true
  if (h.date.toLowerCase().includes(q)) return true
  return h.checklist.some((c) => c.label.toLowerCase().includes(q))
}

export function filterHandoversBySearch(
  handovers: ShiftHandover[],
  query: string,
): ShiftHandover[] {
  const q = query.trim()
  if (!q) return handovers
  return handovers.filter((h) => matchesListSearch(h, q))
}
