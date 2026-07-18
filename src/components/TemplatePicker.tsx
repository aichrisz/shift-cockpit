import type { Lang } from '../types'
import type { TemplateId } from '../data/templates'
import { t } from '../i18n'

export type CreateChoice = TemplateId | 'blank'

interface TemplatePickerProps {
  lang: Lang
  lastTemplateId?: string
  onChoose: (choice: CreateChoice) => void
  onCancel: () => void
}

const OPTIONS: { id: CreateChoice; labelKey: 'templateFrueh' | 'templateAbend' | 'templateSpaet' | 'templateBlank' }[] =
  [
    { id: 'frueh', labelKey: 'templateFrueh' },
    { id: 'abend', labelKey: 'templateAbend' },
    { id: 'spaet', labelKey: 'templateSpaet' },
    { id: 'blank', labelKey: 'templateBlank' },
  ]

export function TemplatePicker({
  lang,
  lastTemplateId,
  onChoose,
  onCancel,
}: TemplatePickerProps) {
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
          {OPTIONS.map((opt) => {
            const isLast = opt.id !== 'blank' && opt.id === lastTemplateId
            return (
              <button
                key={opt.id}
                type="button"
                className={`btn template-btn ${opt.id === 'blank' ? 'btn-ghost' : 'btn-secondary'}${
                  isLast ? ' is-last' : ''
                }`}
                onClick={() => onChoose(opt.id)}
              >
                {t(lang, opt.labelKey)}
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
