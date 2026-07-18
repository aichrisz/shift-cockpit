import type { ChecklistItem, Lang } from '../types'
import { createId } from '../lib/id'

/** Preset checklist labels keyed by language (Hotelfach-ish front desk). */
export const PRESET_LABELS: Record<Lang, string[]> = {
  de: [
    'Kasse / Kassenabschluss',
    'Schlüssel / Key control',
    'Gäste offen / Open guest issues',
    'Frühstück vorbereitet',
    'Lobby tidy',
    'Handover an nächsten Dienst',
  ],
  en: [
    'Cash desk / close-out',
    'Key control',
    'Open guest issues',
    'Breakfast prepared',
    'Lobby tidy',
    'Handover to next shift',
  ],
  id: [
    'Kasir / tutup kas',
    'Kontrol kunci',
    'Masalah tamu terbuka',
    'Sarapan disiapkan',
    'Lobi rapi',
    'Serah terima ke shift berikutnya',
  ],
}

export function createPresetChecklist(lang: Lang = 'de'): ChecklistItem[] {
  return PRESET_LABELS[lang].map((label) => ({
    id: createId(),
    label,
    done: false,
  }))
}
