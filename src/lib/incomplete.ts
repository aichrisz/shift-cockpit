import type { ShiftHandover } from '../types'

/** Checklist has items and at least one is still open. */
export function isIncompleteHandover(h: ShiftHandover): boolean {
  return h.checklist.length > 0 && h.checklist.some((c) => !c.done)
}

export function filterIncompleteOnly(handovers: ShiftHandover[]): ShiftHandover[] {
  return handovers.filter(isIncompleteHandover)
}

/** Open checklist items (not done). */
export function openChecklistItems(h: ShiftHandover) {
  return h.checklist.filter((c) => !c.done)
}

/**
 * Continue-last target: pinned if set and still present, else most recent updatedAt.
 */
export function resolveContinueLastId(
  handovers: ShiftHandover[],
  pinnedId?: string | null,
): string | null {
  if (handovers.length === 0) return null
  if (pinnedId && handovers.some((h) => h.id === pinnedId)) return pinnedId
  let best: ShiftHandover | null = null
  for (const h of handovers) {
    if (!best || h.updatedAt > best.updatedAt) best = h
  }
  return best?.id ?? null
}
