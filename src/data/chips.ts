import type { Lang } from '../types'
import type { TemplateId } from './templates'

/** Stable chip ids for open-point / guest-note quick phrases. */
export type ChipId =
  | 'cashOpen'
  | 'vip'
  | 'complaint'
  | 'lateArrival'
  | 'keyMissing'
  | 'maintenance'
  | 'breakfast'
  | 'wakeUp'
  | 'taxi'
  | 'groupArrival'
  | 'lateCheckout'
  | 'noShow'
  | 'quietHours'
  | 'nightAudit'
  | 'security'
  | 'arrivals'

export interface QuickChip {
  id: ChipId
  labels: Record<Lang, string>
}

/** Full chip catalog (DE-primary, EN/ID labels). */
export const QUICK_CHIPS: QuickChip[] = [
  {
    id: 'cashOpen',
    labels: {
      de: 'Kasse offen / Nachzählung nötig',
      en: 'Cash open / recount needed',
      id: 'Kas terbuka / perlu hitung ulang',
    },
  },
  {
    id: 'vip',
    labels: {
      de: 'VIP im Haus',
      en: 'VIP in house',
      id: 'VIP di hotel',
    },
  },
  {
    id: 'complaint',
    labels: {
      de: 'Beschwerde offen',
      en: 'Open complaint',
      id: 'Keluhan terbuka',
    },
  },
  {
    id: 'lateArrival',
    labels: {
      de: 'Late Arrival erwartet',
      en: 'Late arrival expected',
      id: 'Late arrival diharapkan',
    },
  },
  {
    id: 'keyMissing',
    labels: {
      de: 'Schlüssel fehlt',
      en: 'Key missing',
      id: 'Kunci hilang',
    },
  },
  {
    id: 'maintenance',
    labels: {
      de: 'Technik / Wartung',
      en: 'Maintenance issue',
      id: 'Perawatan / teknis',
    },
  },
  {
    id: 'breakfast',
    labels: {
      de: 'Frühstück nachtragen',
      en: 'Breakfast follow-up',
      id: 'Follow-up sarapan',
    },
  },
  {
    id: 'wakeUp',
    labels: {
      de: 'Wake-up Call',
      en: 'Wake-up call',
      id: 'Wake-up call',
    },
  },
  {
    id: 'taxi',
    labels: {
      de: 'Taxi bestellt',
      en: 'Taxi ordered',
      id: 'Taksi dipesan',
    },
  },
  {
    id: 'groupArrival',
    labels: {
      de: 'Gruppenanreise',
      en: 'Group arrival',
      id: 'Kedatangan grup',
    },
  },
  {
    id: 'lateCheckout',
    labels: {
      de: 'Late Checkout genehmigt',
      en: 'Late checkout approved',
      id: 'Late checkout disetujui',
    },
  },
  {
    id: 'noShow',
    labels: {
      de: 'No-Show notiert',
      en: 'No-show noted',
      id: 'No-show dicatat',
    },
  },
  {
    id: 'quietHours',
    labels: {
      de: 'Ruhezeiten / Lärm',
      en: 'Quiet hours / noise',
      id: 'Jam tenang / bising',
    },
  },
  {
    id: 'nightAudit',
    labels: {
      de: 'Night Audit erledigt',
      en: 'Night audit done',
      id: 'Night audit selesai',
    },
  },
  {
    id: 'security',
    labels: {
      de: 'Sicherheit / Türen geprüft',
      en: 'Security / doors checked',
      id: 'Keamanan / pintu dicek',
    },
  },
  {
    id: 'arrivals',
    labels: {
      de: 'Anreisen geprüft',
      en: 'Arrivals checked',
      id: 'Kedatangan dicek',
    },
  },
]

/** Curated primary chips per template (6–8); blank uses a general set. */
const TEMPLATE_CHIP_IDS: Record<TemplateId | 'blank', ChipId[]> = {
  blank: [
    'cashOpen',
    'vip',
    'complaint',
    'lateArrival',
    'keyMissing',
    'maintenance',
    'breakfast',
    'wakeUp',
  ],
  frueh: [
    'breakfast',
    'wakeUp',
    'lateCheckout',
    'cashOpen',
    'vip',
    'taxi',
    'maintenance',
    'complaint',
  ],
  spaet: [
    'arrivals',
    'noShow',
    'keyMissing',
    'groupArrival',
    'lateArrival',
    'complaint',
    'cashOpen',
    'vip',
  ],
  nacht: [
    'quietHours',
    'nightAudit',
    'lateArrival',
    'security',
    'cashOpen',
    'complaint',
    'keyMissing',
    'vip',
  ],
}

function chipById(id: ChipId): QuickChip | undefined {
  return QUICK_CHIPS.find((c) => c.id === id)
}

/** Primary chips for a template (or blank). */
export function chipsForTemplate(templateId?: string | null): QuickChip[] {
  const key: TemplateId | 'blank' =
    templateId === 'frueh' || templateId === 'spaet' || templateId === 'nacht'
      ? templateId
      : 'blank'
  return TEMPLATE_CHIP_IDS[key]
    .map(chipById)
    .filter((c): c is QuickChip => c !== undefined)
}

/** Remaining chips not in the primary set (for “More”). */
export function chipsMoreThan(templateId?: string | null): QuickChip[] {
  const primary = new Set(chipsForTemplate(templateId).map((c) => c.id))
  return QUICK_CHIPS.filter((c) => !primary.has(c.id))
}

/** Normalize a phrase to a markdown bullet line (`- text`). */
export function asBulletLine(phrase: string): string {
  const trimmed = phrase.trim()
  if (!trimmed) return ''
  if (/^[-*•]\s+/.test(trimmed)) {
    return trimmed.replace(/^•\s+/, '- ').replace(/^\*\s+/, '- ')
  }
  return `- ${trimmed}`
}

function stripBullet(line: string): string {
  return line.trim().replace(/^[-*•]\s+/, '').trim()
}

/**
 * Append phrase as a new markdown bullet line if it is not already
 * the last non-empty line (bullet prefix ignored for duplicate check).
 */
export function appendChipLine(current: string, phrase: string): string {
  const bullet = asBulletLine(phrase)
  if (!bullet) return current

  const body = current.replace(/\s+$/, '')
  if (!body.trim()) return bullet

  const lines = body.split('\n')
  const last = lines[lines.length - 1] ?? ''
  if (stripBullet(last) === stripBullet(bullet)) return body

  return `${body}\n${bullet}`
}
