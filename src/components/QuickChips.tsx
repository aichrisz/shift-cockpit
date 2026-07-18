import { useState } from 'react'
import type { Lang } from '../types'
import { t } from '../i18n'
import { chipsForTemplate, chipsMoreThan } from '../data/chips'

interface QuickChipsProps {
  lang: Lang
  /** Template id for curated chip set (`frueh` / `spaet` / `nacht` / blank). */
  templateId?: string | null
  onPick: (phrase: string) => void
}

export function QuickChips({ lang, templateId, onPick }: QuickChipsProps) {
  const [expanded, setExpanded] = useState(false)
  const primary = chipsForTemplate(templateId)
  const more = chipsMoreThan(templateId)
  const chips = expanded ? [...primary, ...more] : primary

  return (
    <div className="chip-row no-print" role="group" aria-label={t(lang, 'quickChips')}>
      {chips.map((chip) => {
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
      {more.length > 0 && (
        <button
          type="button"
          className="chip chip-more"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? t(lang, 'chipsLess') : t(lang, 'chipsMore')}
        </button>
      )}
    </div>
  )
}
