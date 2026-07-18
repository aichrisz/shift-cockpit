import type { Lang } from '../types'
import { t } from '../i18n'

interface SettingsProps {
  lang: Lang
  defaultShift: string
  onDefaultShiftChange: (value: string) => void
}

export function Settings({ lang, defaultShift, onDefaultShiftChange }: SettingsProps) {
  return (
    <section className="settings-panel" aria-labelledby="settings-heading">
      <h2 id="settings-heading" className="panel-title">
        {t(lang, 'settings')}
      </h2>
      <label className="field" style={{ marginBottom: 0 }}>
        <span className="field-label">{t(lang, 'defaultShift')}</span>
        <input
          type="text"
          className="input"
          value={defaultShift}
          placeholder={t(lang, 'defaultShiftPh')}
          onChange={(e) => onDefaultShiftChange(e.target.value)}
          autoComplete="off"
        />
      </label>
    </section>
  )
}
