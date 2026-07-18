import type { Lang } from '../types'
import { t } from '../i18n'
import { QUICK_CHIPS } from '../data/chips'

interface QuickChipsProps {
  lang: Lang
  onPick: (phrase: string) => void
}

export function QuickChips({ lang, onPick }: QuickChipsProps) {
  return (
    <div className="chip-row no-print" role="group" aria-label={t(lang, 'quickChips')}>
      {QUICK_CHIPS.map((chip) => {
        const label = chip.labels[lang] ?? chip.labels.de
        return (
          <button
            key={chip.id}
            type="button"
            className="chip"
            onClick={() => onPick(label)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
