import type { ChecklistItem, Lang } from '../types'
import { createId } from '../lib/id'
import { createPresetChecklist } from './presets'

/** Stable template ids — do not rename. */
export type TemplateId = 'frueh' | 'abend' | 'spaet'

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
    id: 'abend',
    labels: {
      de: 'Abendschicht',
      en: 'Evening shift',
      id: 'Shift sore',
    },
    checklist: {
      de: [
        'Kasse / Zwischenabschluss',
        'Anreisen & No-Shows geprüft',
        'Schlüssel / Key control',
        'Gäste offen / Beschwerden',
        'Lobby tidy / Light check',
        'Handover an Spät / Nacht',
      ],
      en: [
        'Cash / mid-shift count',
        'Arrivals & no-shows checked',
        'Key control',
        'Open guests / complaints',
        'Lobby tidy / lights',
        'Handover to late / night',
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
  {
    id: 'spaet',
    labels: {
      de: 'Spätschicht',
      en: 'Late shift',
      id: 'Shift malam',
    },
    checklist: {
      de: [
        'Kasse / Kassenabschluss',
        'Night audit vorbereitet',
        'Late Arrivals eingecheckt',
        'Sicherheit / Türen / Lights',
        'Gäste offen dokumentiert',
        'Handover an Frühschicht',
      ],
      en: [
        'Cash desk / close-out',
        'Night audit prepared',
        'Late arrivals checked in',
        'Security / doors / lights',
        'Open guest issues logged',
        'Handover to morning shift',
      ],
      id: [
        'Kasir / tutup kas',
        'Night audit disiapkan',
        'Late arrival check-in',
        'Keamanan / pintu / lampu',
        'Masalah tamu didokumentasikan',
        'Serah terima ke shift pagi',
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
