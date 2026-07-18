import type { Lang, ShiftHandover } from '../types'
import { createId } from '../lib/id'
import { createPresetChecklist } from './presets'
import { t } from '../i18n'

export function createSampleHandover(lang: Lang): ShiftHandover {
  const now = new Date().toISOString()
  const today = now.slice(0, 10)
  const checklist = createPresetChecklist(lang).map((item, index) => ({
    ...item,
    done: index < 3,
  }))

  const openByLang: Record<Lang, string> = {
    de: '- Zimmerservice 412 nachliefern\n- Late checkout 308 bis 14:00\n- Toner Kasse bestellen',
    en: '- Restock minibar room 412\n- Late checkout 308 until 14:00\n- Order cash-desk toner',
    id: '- Isi ulang minibar kamar 412\n- Late checkout 308 sampai 14:00\n- Pesan toner kasir',
  }

  const roomByLang: Record<Lang, string> = {
    de: '205: Quiet-Request · 118: Babybed angefordert',
    en: '205: Quiet request · 118: Baby cot requested',
    id: '205: Minta tenang · 118: Minta baby cot',
  }

  const guestByLang: Record<Lang, string> = {
    de: 'VIP Müller Anreise 19:30 · Beschwerde WLAN Flur 2 erledigt',
    en: 'VIP Müller arrival 19:30 · Wi‑Fi complaint floor 2 resolved',
    id: 'VIP Müller check-in 19:30 · Keluhan Wi‑Fi lantai 2 selesai',
  }

  return {
    id: createId(),
    createdAt: now,
    updatedAt: now,
    shiftLabel: t(lang, 'sampleLabel'),
    date: today,
    openPoints: openByLang[lang],
    roomNotes: roomByLang[lang],
    guestNotes: guestByLang[lang],
    checklist,
    tipTotal: 48,
    tipPeople: 3,
    tipNote: lang === 'de' ? 'Bar + Karte' : lang === 'id' ? 'Tunai + kartu' : 'Cash + card',
    lang,
  }
}
