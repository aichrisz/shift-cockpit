import type { Lang } from '../types'
import { t } from '../i18n'

interface HeaderProps {
  lang: Lang
  onLangChange: (lang: Lang) => void
}

const LANGS: Lang[] = ['de', 'en', 'id']

export function Header({ lang, onLangChange }: HeaderProps) {
  return (
    <header className="app-header no-print">
      <h1 className="app-title">{t(lang, 'appTitle')}</h1>
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
    </header>
  )
}
