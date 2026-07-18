import type { Lang } from '../types'
import { t } from '../i18n'

interface EmptyStateProps {
  lang: Lang
  onNew: () => void
  onLoadSample: () => void
}

export function EmptyState({ lang, onNew, onLoadSample }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-icon" aria-hidden="true">
        ⌂
      </div>
      <h2 className="empty-title">{t(lang, 'emptyTitle')}</h2>
      <p className="empty-body">{t(lang, 'emptyBody')}</p>
      <div className="empty-actions">
        <button type="button" className="btn btn-primary" onClick={onNew}>
          {t(lang, 'newShift')}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onLoadSample}>
          {t(lang, 'loadSample')}
        </button>
      </div>
    </div>
  )
}
