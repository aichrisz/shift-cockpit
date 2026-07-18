import type { Lang } from '../types'
import { t } from '../i18n'

export type EmptyKind = 'none' | 'filter' | 'search' | 'incomplete'

interface EmptyStateProps {
  lang: Lang
  kind?: EmptyKind
  onNew?: () => void
  onLoadSample?: () => void
  onClearSearch?: () => void
  onShowAll?: () => void
  onClearIncomplete?: () => void
}

function EmptyIllustration({ kind }: { kind: EmptyKind }) {
  if (kind === 'search') {
    return (
      <div className="empty-illo empty-illo-search" aria-hidden="true">
        <span className="empty-illo-ring" />
        <span className="empty-illo-handle" />
      </div>
    )
  }
  if (kind === 'filter' || kind === 'incomplete') {
    return (
      <div className="empty-illo empty-illo-filter" aria-hidden="true">
        <span className="empty-illo-bar" />
        <span className="empty-illo-bar short" />
        <span className="empty-illo-bar mid" />
      </div>
    )
  }
  return (
    <div className="empty-illo empty-illo-none" aria-hidden="true">
      <span className="empty-illo-card" />
      <span className="empty-illo-plus">+</span>
    </div>
  )
}

export function EmptyState({
  lang,
  kind = 'none',
  onNew,
  onLoadSample,
  onClearSearch,
  onShowAll,
  onClearIncomplete,
}: EmptyStateProps) {
  const titleKey =
    kind === 'search'
      ? 'emptySearchTitle'
      : kind === 'incomplete'
        ? 'emptyIncompleteTitle'
        : kind === 'filter'
          ? 'emptyFilterTitle'
          : 'emptyNoneTitle'
  const bodyKey =
    kind === 'search'
      ? 'emptySearchBody'
      : kind === 'incomplete'
        ? 'emptyIncompleteBody'
        : kind === 'filter'
          ? 'emptyFilterBody'
          : 'emptyNoneBody'

  return (
    <div className={`empty-state empty-state-${kind}`} role="status">
      <EmptyIllustration kind={kind} />
      <h2 className="empty-title">{t(lang, titleKey)}</h2>
      <p className="empty-body">{t(lang, bodyKey)}</p>
      <div className="empty-actions">
        {kind === 'none' && onNew && (
          <button type="button" className="btn btn-primary" onClick={onNew}>
            {t(lang, 'newShift')}
          </button>
        )}
        {kind === 'none' && onLoadSample && (
          <button type="button" className="btn btn-ghost" onClick={onLoadSample}>
            {t(lang, 'loadSample')}
          </button>
        )}
        {kind === 'search' && onClearSearch && (
          <button type="button" className="btn btn-primary" onClick={onClearSearch}>
            {t(lang, 'clearSearch')}
          </button>
        )}
        {kind === 'filter' && onShowAll && (
          <button type="button" className="btn btn-primary" onClick={onShowAll}>
            {t(lang, 'filterShowAll')}
          </button>
        )}
        {kind === 'incomplete' && onClearIncomplete && (
          <button type="button" className="btn btn-primary" onClick={onClearIncomplete}>
            {t(lang, 'clearIncompleteFilter')}
          </button>
        )}
        {(kind === 'filter' || kind === 'search' || kind === 'incomplete') && onNew && (
          <button type="button" className="btn btn-ghost" onClick={onNew}>
            {t(lang, 'newShift')}
          </button>
        )}
      </div>
    </div>
  )
}
