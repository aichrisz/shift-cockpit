import type { ShiftHandover } from '../types'

function perPerson(total: number | null, people: number | null): string {
  if (total === null || people === null || people <= 0) return '—'
  const value = total / people
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

function section(body: string): string {
  const trimmed = body.trim()
  return trimmed.length > 0 ? trimmed : '—'
}

export function handoverToMarkdown(h: ShiftHandover): string {
  const checklistLines =
    h.checklist.length === 0
      ? '- (none)'
      : h.checklist
          .map((item) => `- [${item.done ? 'x' : ' '}] ${item.label}`)
          .join('\n')

  const tipTotal = h.tipTotal === null ? '—' : String(h.tipTotal)
  const tipPeople = h.tipPeople === null ? '—' : String(h.tipPeople)
  const tipPer = perPerson(h.tipTotal, h.tipPeople)
  const tipNote = h.tipNote.trim() ? `\nNote: ${h.tipNote.trim()}` : ''

  return [
    `# Shift handover — ${h.date} — ${h.shiftLabel || '—'}`,
    `Updated: ${h.updatedAt}`,
    '',
    '## Open points',
    section(h.openPoints),
    '',
    '## Room notes',
    section(h.roomNotes),
    '',
    '## Guest notes',
    section(h.guestNotes),
    '',
    '## Checklist',
    checklistLines,
    '',
    '## Tips',
    `Total: ${tipTotal} / People: ${tipPeople} → per person: ${tipPer}${tipNote}`,
    '',
  ].join('\n')
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
