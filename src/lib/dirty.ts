import type { ShiftHandover } from '../types'

/** Stable JSON snapshot for dirty comparison (ignores updatedAt noise on save path). */
export function handoverSnapshot(h: ShiftHandover): string {
  return JSON.stringify({
    id: h.id,
    shiftLabel: h.shiftLabel,
    date: h.date,
    openPoints: h.openPoints,
    roomNotes: h.roomNotes,
    guestNotes: h.guestNotes,
    checklist: h.checklist,
    tipTotal: h.tipTotal,
    tipPeople: h.tipPeople,
    tipNote: h.tipNote,
    lang: h.lang,
  })
}

export function isHandoverDirty(
  draft: ShiftHandover,
  baseline: ShiftHandover | null,
): boolean {
  if (!baseline) return false
  return handoverSnapshot(draft) !== handoverSnapshot(baseline)
}
