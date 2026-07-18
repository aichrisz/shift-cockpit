import type { Lang } from '../types'

/** Hotel room prefix by UI language: DE Zi., EN Rm., ID Km. */
export function roomPrefix(lang: Lang): string {
  if (lang === 'en') return 'Rm.'
  if (lang === 'id') return 'Km.'
  return 'Zi.'
}

/**
 * Room numbers already present after common prefixes (Zi. / Rm. / Km.).
 * Matches patterns like `Zi. 204`, `Rm.204`, `Km. 12A`.
 */
export function extractRoomNumbers(roomNotes: string): string[] {
  if (!roomNotes.trim()) return []
  const re = /(?:Zi\.|Rm\.|Km\.)\s*(\d+[A-Za-z]?)/gi
  const found: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(roomNotes)) !== null) {
    const n = m[1]?.trim()
    if (n) found.push(n)
  }
  return found
}

/** True if this room number already appears after a Zi./Rm./Km. prefix. */
export function roomAlreadyListed(roomNotes: string, room: string): boolean {
  const num = room.trim().toLowerCase()
  if (!num) return false
  return extractRoomNumbers(roomNotes).some((n) => n.toLowerCase() === num)
}

/**
 * Append a bullet room line: `- Zi. 204 — ` (trailing space after dash for notes).
 * Returns `current` unchanged when room is empty.
 */
export function appendRoomLine(
  current: string,
  room: string,
  lang: Lang,
): string {
  const num = room.trim()
  if (!num) return current

  // Trailing space after em dash is intentional (cursor-friendly empty note).
  const bullet = `- ${roomPrefix(lang)} ${num} — `

  // Only strip trailing newlines so prior lines keep their trailing spaces.
  const body = current.replace(/\n+$/, '')
  if (!body.trim()) return bullet
  return `${body}\n${bullet}`
}
