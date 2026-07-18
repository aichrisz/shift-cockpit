import type { Lang, ShiftHandover } from '../types'
import { t } from '../i18n'
import { asBulletLine } from '../data/chips'

/** Local `YYYY-MM-DD HH:mm` for ready bullet timestamps. */
export function formatReadyTimestamp(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}

function stripBullet(line: string): string {
  return line.trim().replace(/^[-*•]\s+/, '').trim()
}

/** True if text starts with the i18n ready phrase (ignore bullet + trailing time). */
export function isReadyMarkerLine(line: string, readyPhrase: string): boolean {
  const body = stripBullet(line)
  if (!body || !readyPhrase) return false
  return body === readyPhrase || body.startsWith(`${readyPhrase} ·`) || body.startsWith(`${readyPhrase}·`)
}

function lastNonEmptyLine(text: string): string {
  const lines = text.split('\n')
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i]!.trim()) return lines[i]!
  }
  return ''
}

/**
 * Mark all checklist items done and append a timestamped ready bullet
 * to openPoints (idempotent if last line is already a ready marker).
 */
export function applyHandoverReady(
  draft: ShiftHandover,
  lang: Lang,
  now = new Date(),
): ShiftHandover {
  const phrase = t(lang, 'readyPhrase')
  const bullet = asBulletLine(`${phrase} · ${formatReadyTimestamp(now)}`)
  const checklist = draft.checklist.map((c) => ({ ...c, done: true }))

  let openPoints = draft.openPoints
  const last = lastNonEmptyLine(openPoints)
  if (!isReadyMarkerLine(last, phrase)) {
    const body = openPoints.replace(/\s+$/, '')
    openPoints = body.trim() ? `${body}\n${bullet}` : bullet
  }

  return { ...draft, checklist, openPoints }
}
