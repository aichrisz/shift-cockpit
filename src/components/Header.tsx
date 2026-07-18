import type { Lang, View } from '../types'
import { t } from '../i18n'

interface HeaderProps {
  lang: Lang
  view: View
  onLangChange: (lang: Lang) => void
  onOpenSettings: () => void
  onBackFromSettings: () => void
}

const LANGS: Lang[] = ['de', 'en', 'id']

export function Header({
  lang,
  view,
  onLangChange,
  onOpenSettings,
  onBackFromSettings,
}: HeaderProps) {
  const onSettings = view.name === 'settings'
  const onList = view.name === 'list'

  return (
    <header className="app-header no-print">
      <div className="header-start">
        {onSettings ? (
          <button
            type="button"
            className="btn btn-ghost btn-compact header-back"
            onClick={onBackFromSettings}
          >
            {t(lang, 'back')}
          </button>
        ) : null}
        <h1 className="app-title">{t(lang, 'appTitle')}</h1>
      </div>
      <div className="header-end">
        <div className="lang-toggle" role="group" aria-label="Language">
          {LANGS.map((code) => (
            <button
              key={code}
              type="button"
              className={`lang-btn${lang === code ? ' is-active' : ''}`}
              aria-pressed={lang === code}
              onClick={() => onLangChange(code)}
            >
              {t(lang, code === 'de' ? 'langDe' : code === 'en' ? 'langEn' : 'langId')}
            </button>
          ))}
        </div>
        {onList ? (
          <button
            type="button"
            className="btn btn-ghost btn-compact header-settings"
            onClick={onOpenSettings}
            aria-label={t(lang, 'settings')}
          >
            <span className="header-settings-icon" aria-hidden="true">
              ⚙
            </span>
            <span className="header-settings-label">{t(lang, 'settings')}</span>
          </button>
        ) : null}
      </div>
    </header>
  )
}
