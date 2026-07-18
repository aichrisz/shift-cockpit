import type { Lang, ShiftHandover } from '../types'

function perPerson(total: number | null, people: number | null): string {
  if (total === null || people === null || people <= 0) return '—'
  const value = total / people
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

function section(body: string): string {
  const trimmed = body.trim()
  return trimmed.length > 0 ? trimmed : '—'
}

interface MdLabels {
  title: string
  updated: string
  openPoints: string
  roomNotes: string
  guestNotes: string
  checklist: string
  tips: string
  total: string
  people: string
  perPerson: string
  note: string
  none: string
}

const LABELS: Record<Lang, MdLabels> = {
  de: {
    title: 'Übergabe',
    updated: 'Aktualisiert',
    openPoints: 'Offene Punkte',
    roomNotes: 'Zimmer-Hinweise',
    guestNotes: 'Beschwerden',
    checklist: 'Checkliste',
    tips: 'Trinkgeld',
    total: 'Gesamt',
    people: 'Personen',
    perPerson: 'pro Person',
    note: 'Notiz',
    none: '(keine)',
  },
  en: {
    title: 'Shift handover',
    updated: 'Updated',
    openPoints: 'Open points',
    roomNotes: 'Room notes',
    guestNotes: 'Complaints',
    checklist: 'Checklist',
    tips: 'Tips',
    total: 'Total',
    people: 'People',
    perPerson: 'per person',
    note: 'Note',
    none: '(none)',
  },
  id: {
    title: 'Serah terima shift',
    updated: 'Diperbarui',
    openPoints: 'Poin terbuka',
    roomNotes: 'Catatan kamar',
    guestNotes: 'Keluhan',
    checklist: 'Checklist',
    tips: 'Tip',
    total: 'Total',
    people: 'Orang',
    perPerson: 'per orang',
    note: 'Catatan',
    none: '(tidak ada)',
  },
}

/** Checklist as markdown task lines only (for section copy). */
export function checklistToMarkdown(h: ShiftHandover): string {
  if (h.checklist.length === 0) return ''
  return h.checklist
    .map((item) => `- [${item.done ? 'x' : ' '}] ${item.label}`)
    .join('\n')
}

export interface ExportOptions {
  /** Only open points, room notes, guest notes (no checklist / tips). */
  compact?: boolean
}

/**
 * Full handover markdown. Section headers follow `style` (UI lang preferred).
 * Falls back to handover.lang, then English.
 */
export function handoverToMarkdown(
  h: ShiftHandover,
  style?: Lang,
  options?: ExportOptions,
): string {
  const lang: Lang =
    style === 'de' || style === 'en' || style === 'id'
      ? style
      : h.lang === 'de' || h.lang === 'en' || h.lang === 'id'
        ? h.lang
        : 'en'
  const L = LABELS[lang]
  const compact = options?.compact === true

  const parts = [
    `# ${L.title} — ${h.date} — ${h.shiftLabel || '—'}`,
    `${L.updated}: ${h.updatedAt}`,
    '',
    `## ${L.openPoints}`,
    section(h.openPoints),
    '',
  ]

  if (h.roomNotes.trim()) {
    parts.push(`## ${L.roomNotes}`, h.roomNotes.trim(), '')
  }
  if (h.guestNotes.trim()) {
    parts.push(`## ${L.guestNotes}`, h.guestNotes.trim(), '')
  }

  if (compact) {
    return parts.join('\n')
  }

  const checklistLines =
    h.checklist.length === 0
      ? `- ${L.none}`
      : checklistToMarkdown(h)

  const tipNote = h.tipNote.trim() ? `\n${L.note}: ${h.tipNote.trim()}` : ''
  const hasTips =
    h.tipTotal !== null ||
    h.tipPeople !== null ||
    h.tipNote.trim().length > 0

  parts.push(`## ${L.checklist}`, checklistLines, '')

  if (hasTips) {
    const tipTotal = h.tipTotal === null ? '—' : String(h.tipTotal)
    const tipPeople = h.tipPeople === null ? '—' : String(h.tipPeople)
    const tipPer = perPerson(h.tipTotal, h.tipPeople)
    parts.push(
      `## ${L.tips}`,
      `${L.total}: ${tipTotal} / ${L.people}: ${tipPeople} → ${L.perPerson}: ${tipPer}${tipNote}`,
      '',
    )
  }

  return parts.join('\n')
}

/** Labels used by the structured print sheet (same as markdown). */
export function exportLabels(style?: Lang, handoverLang?: Lang): MdLabels {
  const lang: Lang =
    style === 'de' || style === 'en' || style === 'id'
      ? style
      : handoverLang === 'de' || handoverLang === 'en' || handoverLang === 'id'
        ? handoverLang
        : 'en'
  return LABELS[lang]
}

export function formatExportUpdated(iso: string, lang: Lang): string {
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

export function formatPrintStamp(lang: Lang, d = new Date()): string {
  try {
    const locale = lang === 'de' ? 'de-DE' : lang === 'id' ? 'id-ID' : 'en-GB'
    return d.toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return d.toISOString()
  }
}

export function tipSummaryLine(h: ShiftHandover, lang: Lang): string | null {
  const hasTips =
    h.tipTotal !== null ||
    h.tipPeople !== null ||
    h.tipNote.trim().length > 0
  if (!hasTips) return null
  const L = LABELS[lang]
  const tipTotal = h.tipTotal === null ? '—' : String(h.tipTotal)
  const tipPeople = h.tipPeople === null ? '—' : String(h.tipPeople)
  const tipPer = perPerson(h.tipTotal, h.tipPeople)
  const tipNote = h.tipNote.trim() ? ` · ${L.note}: ${h.tipNote.trim()}` : ''
  return `${L.total}: ${tipTotal} / ${L.people}: ${tipPeople} → ${L.perPerson}: ${tipPer}${tipNote}`
}

export function exportFilename(h: ShiftHandover): string {
  const date = h.date || new Date().toISOString().slice(0, 10)
  return `handover-${date}.md`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
