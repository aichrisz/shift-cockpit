import type { DefaultTemplateId, Lang } from '../types'
import type { TemplateId } from '../data/templates'
import { normalizeTemplateId } from '../data/templates'
import { t } from '../i18n'

export type CreateChoice = TemplateId | 'blank'

interface TemplatePickerProps {
  lang: Lang
  lastTemplateId?: string
  /** Settings default — shows “Default” badge when matching. */
  defaultTemplateId?: DefaultTemplateId | null
  onChoose: (choice: CreateChoice) => void
  onCancel: () => void
}

const OPTIONS: {
  id: CreateChoice
  labelKey: 'templateFrueh' | 'templateNacht' | 'templateSpaet' | 'templateBlank'
}[] = [
  { id: 'frueh', labelKey: 'templateFrueh' },
  { id: 'spaet', labelKey: 'templateSpaet' },
  { id: 'nacht', labelKey: 'templateNacht' },
  { id: 'blank', labelKey: 'templateBlank' },
]

export function TemplatePicker({
  lang,
  lastTemplateId,
  defaultTemplateId,
  onChoose,
  onCancel,
}: TemplatePickerProps) {
  const last = normalizeTemplateId(lastTemplateId)
  const def = defaultTemplateId ?? null

  // Put default first when set so it is visually first/selected.
  const ordered = def
    ? [...OPTIONS].sort((a, b) => {
        if (a.id === def) return -1
        if (b.id === def) return 1
        return 0
      })
    : OPTIONS

  return (
    <div
      className="template-picker"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-picker-title"
    >
      <div className="template-picker-card">
        <h2 id="template-picker-title" className="panel-title">
          {t(lang, 'chooseTemplate')}
        </h2>
        <div className="template-grid">
          {ordered.map((opt) => {
            const isLast = opt.id !== 'blank' && opt.id === last
            const isDefault = def !== null && opt.id === def
            return (
              <button
                key={opt.id}
                type="button"
                className={`btn template-btn ${opt.id === 'blank' ? 'btn-ghost' : 'btn-secondary'}${
                  isLast || isDefault ? ' is-last' : ''
                }${isDefault ? ' is-default' : ''}`}
                onClick={() => onChoose(opt.id)}
              >
                <span className="template-btn-label">{t(lang, opt.labelKey)}</span>
                {isDefault && (
                  <span className="template-default-badge">{t(lang, 'defaultBadge')}</span>
                )}
              </button>
            )
          })}
        </div>
        <button type="button" className="btn btn-ghost template-cancel" onClick={onCancel}>
          {t(lang, 'cancel')}
        </button>
      </div>
    </div>
  )
}
