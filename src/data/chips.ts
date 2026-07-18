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

/** Append phrase as a new line if it is not already the last non-empty line. */
export function appendChipLine(current: string, phrase: string): string {
  const trimmedPhrase = phrase.trim()
  if (!trimmedPhrase) return current

  const lines = current.replace(/\s+$/, '').split('\n')
  const last = lines[lines.length - 1]?.trim() ?? ''
  if (last === trimmedPhrase) return current.replace(/\s+$/, '')

  if (!current.trim()) return trimmedPhrase
  return `${current.replace(/\s+$/, '')}\n${trimmedPhrase}`
}
