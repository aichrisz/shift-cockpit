import type { Lang } from '../types'

/** Hotel room prefix by UI language: DE Zi., EN Rm., ID Km. */
export function roomPrefix(lang: Lang): string {
  if (lang === 'en') return 'Rm.'
  if (lang === 'id') return 'Km.'
  return 'Zi.'
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
