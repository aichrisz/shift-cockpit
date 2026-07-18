import type { AppData } from '../types'
import { localIsoDate } from './dates'
import { loadAppDataFromUnknown } from './storage'

/** Filename: shift-cockpit-YYYY-MM-DD.json */
export function backupFilename(now = new Date()): string {
  return `shift-cockpit-${localIsoDate(now)}.json`
}

/** Full AppData JSON download (version, settings, handovers). */
export function downloadBackupJson(data: AppData, now = new Date()): void {
  const payload: AppData = {
    version: 1,
    settings: data.settings,
    handovers: data.handovers,
  }
  const text = `${JSON.stringify(payload, null, 2)}\n`
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = backupFilename(now)
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Parse + sanitize backup file text into AppData, or null if invalid. */
export function parseBackupJson(text: string): AppData | null {
  try {
    const parsed: unknown = JSON.parse(text)
    return loadAppDataFromUnknown(parsed)
  } catch {
    return null
  }
}

const DAY_MS = 24 * 60 * 60 * 1000

/** True when never backed up or last backup older than `days` (default 7). */
export function shouldNudgeBackup(
  lastBackupAt: string | null | undefined,
  days = 7,
  now = new Date(),
): boolean {
  if (!lastBackupAt) return true
  const t = Date.parse(lastBackupAt)
  if (!Number.isFinite(t)) return true
  return now.getTime() - t > days * DAY_MS
}

/** Human-readable last-backup label for settings / banner. */
export function formatBackupAt(iso: string | null | undefined, lang: 'de' | 'en' | 'id'): string | null {
  if (!iso) return null
  try {
    const locale = lang === 'de' ? 'de-DE' : lang === 'id' ? 'id-ID' : 'en-GB'
    return new Date(iso).toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}
