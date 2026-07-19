import type { ChecklistItem, Lang } from '../types'
import { createId } from '../lib/id'
import { createPresetChecklist } from './presets'

/** Stable template ids. Legacy `abend` migrates to `nacht` in storage. */
export type TemplateId = 'frueh' | 'nacht' | 'spaet'

export interface ShiftTemplate {
  id: TemplateId
  labels: Record<Lang, string>
  checklist: Record<Lang, string[]>
}

/** Specialized per-shift checklists (not the generic v0.1 list). */
export const SHIFT_TEMPLATES: ShiftTemplate[] = [
  {
    id: 'frueh',
    labels: {
      de: 'Frühschicht',
      en: 'Morning shift',
      id: 'Shift pagi',
    },
    checklist: {
      de: [
        'Kasse öffnen / Wechselgeld prüfen',
        'Frühstück vorbereitet / Buffet check',
        'Late-Check-outs notiert',
        'Wake-up Calls erledigt',
        'Zimmerstatus aktualisiert',
        'Handover an nächsten Dienst',
      ],
      en: [
        'Open cash / float check',
        'Breakfast prepared / buffet check',
        'Late check-outs noted',
        'Wake-up calls done',
        'Room status updated',
        'Handover to next shift',
      ],
      id: [
        'Buka kas / cek uang kecil',
        'Sarapan disiapkan / cek buffet',
        'Late check-out dicatat',
        'Wake-up call selesai',
        'Status kamar diperbarui',
        'Serah terima ke shift berikutnya',
      ],
    },
  },
  {
    id: 'nacht',
    labels: {
      de: 'Nachtschicht',
      en: 'Night shift',
      id: 'Shift malam',
    },
    checklist: {
      de: [
        'Kasse / Night audit',
        'Late Arrivals / Walk-ins',
        'Sicherheit / Türen / Außenlicht',
        'Ruhezeiten / Lärm-Beschwerden',
        'Gäste offen dokumentiert',
        'Handover an Frühschicht',
      ],
      en: [
        'Cash / night audit',
        'Late arrivals / walk-ins',
        'Security / doors / exterior lights',
        'Quiet hours / noise complaints',
        'Open guest issues logged',
        'Handover to morning shift',
      ],
      id: [
        'Kas / night audit',
        'Late arrival / walk-in',
        'Keamanan / pintu / lampu luar',
        'Jam tenang / keluhan bising',
        'Masalah tamu didokumentasikan',
        'Serah terima ke shift pagi',
      ],
    },
  },
  {
    id: 'spaet',
    labels: {
      de: 'Spätschicht',
      en: 'Late shift',
      id: 'Shift sore',
    },
    checklist: {
      de: [
        'Kasse / Zwischenabschluss',
        'Anreisen & No-Shows geprüft',
        'Schlüssel / Key control',
        'Gäste offen / Beschwerden',
        'Lobby tidy / Light check',
        'Handover an Nachtschicht',
      ],
      en: [
        'Cash / mid-shift count',
        'Arrivals & no-shows checked',
        'Key control',
        'Open guests / complaints',
        'Lobby tidy / lights',
        'Handover to night shift',
      ],
      id: [
        'Kas / hitung mid-shift',
        'Kedatangan & no-show dicek',
        'Kontrol kunci',
        'Tamu terbuka / keluhan',
        'Lobi rapi / cek lampu',
        'Serah terima ke shift malam',
      ],
    },
  },
]

export function getTemplate(id: TemplateId): ShiftTemplate | undefined {
  return SHIFT_TEMPLATES.find((t) => t.id === id)
}

export function createTemplateChecklist(id: TemplateId, lang: Lang): ChecklistItem[] {
  const tpl = getTemplate(id)
  const labels = tpl?.checklist[lang] ?? tpl?.checklist.de
  if (!labels) return createPresetChecklist(lang)
  return labels.map((label) => ({
    id: createId(),
    label,
    done: false,
  }))
}

export function templateShiftLabel(id: TemplateId, lang: Lang): string {
  const tpl = getTemplate(id)
  if (!tpl) return ''
  return tpl.labels[lang] ?? tpl.labels.de
}

/** Map legacy template ids (v0.3 used `abend`). */
export function normalizeTemplateId(raw: unknown): TemplateId | undefined {
  if (raw === 'abend') return 'nacht'
  if (raw === 'frueh' || raw === 'nacht' || raw === 'spaet') return raw
  return undefined
}

/** Settings default: template id, blank, or null (always open picker). */
export function normalizeDefaultTemplateId(
  raw: unknown,
): 'frueh' | 'nacht' | 'spaet' | 'blank' | null {
  if (raw === null) return null
  if (raw === 'blank') return 'blank'
  const id = normalizeTemplateId(raw)
  return id ?? null
}
