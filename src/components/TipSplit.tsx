import type { Lang } from '../types'
import { t } from '../i18n'

interface TipSplitProps {
  lang: Lang
  tipTotal: number | null
  tipPeople: number | null
  tipNote: string
  onTotalChange: (value: number | null) => void
  onPeopleChange: (value: number | null) => void
  onNoteChange: (value: string) => void
}

function parseOptionalNumber(raw: string): number | null {
  if (raw.trim() === '') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

function formatPerPerson(total: number | null, people: number | null): string {
  if (total === null || people === null || people <= 0) return '—'
  const value = total / people
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

export function TipSplit({
  lang,
  tipTotal,
  tipPeople,
  tipNote,
  onTotalChange,
  onPeopleChange,
  onNoteChange,
}: TipSplitProps) {
  const per = formatPerPerson(tipTotal, tipPeople)

  return (
    <section className="panel" aria-labelledby="tips-heading">
      <h2 id="tips-heading" className="panel-title">
        {t(lang, 'tips')}
      </h2>

      <div className="field-grid tip-grid">
        <label className="field">
          <span className="field-label">{t(lang, 'tipTotal')}</span>
          <input
            type="number"
            className="input"
            inputMode="decimal"
            min={0}
            step="any"
            value={tipTotal ?? ''}
            onChange={(e) => onTotalChange(parseOptionalNumber(e.target.value))}
          />
        </label>
        <label className="field">
          <span className="field-label">{t(lang, 'tipPeople')}</span>
          <input
            type="number"
            className="input"
            inputMode="numeric"
            min={1}
            step={1}
            value={tipPeople ?? ''}
            onChange={(e) => onPeopleChange(parseOptionalNumber(e.target.value))}
          />
        </label>
      </div>

      <div className="tip-result" aria-live="polite">
        <span className="field-label">{t(lang, 'perPerson')}</span>
        <strong className="tip-amount">{per}</strong>
      </div>

      <label className="field">
        <span className="field-label">{t(lang, 'tipNote')}</span>
        <input
          type="text"
          className="input"
          value={tipNote}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </label>
    </section>
  )
}
