import type { Lang } from '../types'

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

export interface QuickChip {
  id: ChipId
  labels: Record<Lang, string>
}

/** ~10 DE-primary handover phrases with EN/ID labels. */
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
]

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
