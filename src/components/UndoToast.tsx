import type { Lang } from '../types'
import { t } from '../i18n'

interface UndoToastProps {
  lang: Lang
  message: string
  onUndo: () => void
  onDismiss: () => void
}

/** Transient undo affordance (~5s). No-print. */
export function UndoToast({ lang, message, onUndo, onDismiss }: UndoToastProps) {
  return (
    <div className="undo-toast no-print" role="status" aria-live="polite">
      <span className="undo-toast-msg">{message}</span>
      <div className="undo-toast-actions">
        <button type="button" className="btn btn-secondary btn-compact" onClick={onUndo}>
          {t(lang, 'undo')}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-compact"
          onClick={onDismiss}
          aria-label={t(lang, 'dismiss')}
        >
          ×
        </button>
      </div>
    </div>
  )
}
