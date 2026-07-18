import type { AppData, Settings, ShiftHandover } from '../types'
import { normalizeTemplateId } from '../data/templates'
import { localDaysAgoIso, localIsoDate } from './dates'

export const STORAGE_KEY = 'shift-cockpit-v1'

const DEFAULT_SETTINGS: Settings = {
  lang: 'de',
  defaultShift: '',
}

export function defaultAppData(): AppData {
  return {
    version: 1,
    settings: { ...DEFAULT_SETTINGS },
    handovers: [],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeHandover(raw: unknown): ShiftHandover | null {
  if (!isRecord(raw) || typeof raw.id !== 'string') return null

  const checklist = Array.isArray(raw.checklist)
    ? raw.checklist
        .filter(isRecord)
        .map((item) => ({
          id: typeof item.id === 'string' ? item.id : String(Math.random()),
          label: typeof item.label === 'string' ? item.label : '',
          done: Boolean(item.done),
        }))
    : []

  const tipTotal =
    typeof raw.tipTotal === 'number' && Number.isFinite(raw.tipTotal)
      ? raw.tipTotal
      : null
  const tipPeople =
    typeof raw.tipPeople === 'number' && Number.isFinite(raw.tipPeople)
      ? raw.tipPeople
      : null

  const lang =
    raw.lang === 'en' || raw.lang === 'id' || raw.lang === 'de' ? raw.lang : 'de'

  return {
    id: raw.id,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
    shiftLabel: typeof raw.shiftLabel === 'string' ? raw.shiftLabel : '',
    date: typeof raw.date === 'string' ? raw.date : localIsoDate(),
    openPoints: typeof raw.openPoints === 'string' ? raw.openPoints : '',
    roomNotes: typeof raw.roomNotes === 'string' ? raw.roomNotes : '',
    guestNotes: typeof raw.guestNotes === 'string' ? raw.guestNotes : '',
    checklist,
    tipTotal,
    tipPeople,
    tipNote: typeof raw.tipNote === 'string' ? raw.tipNote : '',
    lang,
  }
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultAppData()

    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return defaultAppData()

    const settingsRaw = isRecord(parsed.settings) ? parsed.settings : {}
    const lang =
      settingsRaw.lang === 'en' || settingsRaw.lang === 'id' || settingsRaw.lang === 'de'
        ? settingsRaw.lang
        : DEFAULT_SETTINGS.lang

    const handovers = Array.isArray(parsed.handovers)
      ? parsed.handovers.map(sanitizeHandover).filter((h): h is ShiftHandover => h !== null)
      : []

    const lastTemplateId = normalizeTemplateId(settingsRaw.lastTemplateId)

    return {
      version: 1,
      settings: {
        lang,
        defaultShift:
          typeof settingsRaw.defaultShift === 'string'
            ? settingsRaw.defaultShift
            : DEFAULT_SETTINGS.defaultShift,
        ...(lastTemplateId ? { lastTemplateId } : {}),
      },
      handovers,
    }
  } catch {
    return defaultAppData()
  }
}

export function saveAppData(data: AppData): void {
  try {
    const payload: AppData = {
      version: 1,
      settings: data.settings,
      handovers: data.handovers,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Quota or private mode — fail silently for MVP
  }
}

/** Count handovers whose `date` (YYYY-MM-DD) is strictly older than cutoff. */
export function countOlderThan(handovers: ShiftHandover[], olderThanDays: number): number {
  const cutoff = cutoffDateIso(olderThanDays)
  return handovers.filter((h) => h.date < cutoff).length
}

/** Delete handovers older than N days (by `date` field). */
export function filterKeepRecent(
  handovers: ShiftHandover[],
  olderThanDays: number,
): ShiftHandover[] {
  const cutoff = cutoffDateIso(olderThanDays)
  return handovers.filter((h) => h.date >= cutoff)
}

function cutoffDateIso(olderThanDays: number): string {
  // Keep rows with date >= today - N days (local calendar).
  return localDaysAgoIso(olderThanDays)
}
