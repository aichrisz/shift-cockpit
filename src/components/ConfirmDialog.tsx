import { useEffect, useId, useRef } from 'react'
import type { Lang } from '../types'
import { t } from '../i18n'

export interface ConfirmDialogProps {
  lang: Lang
  open: boolean
  title: string
  body: string
  /** Confirm button label; defaults to title-ish action. */
  confirmLabel?: string
  cancelLabel?: string
  /** Destructive styling for delete/wipe. */
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Lightweight in-app confirm. Focuses confirm on open; Escape cancels.
 * No portal deps — fixed overlay in the tree.
 */
export function ConfirmDialog({
  lang,
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()
  const bodyId = useId()
  const confirmRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const tId = window.setTimeout(() => {
      confirmRef.current?.focus()
    }, 0)
    return () => window.clearTimeout(tId)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = [cancelRef.current, confirmRef.current].filter(
        (el): el is HTMLButtonElement => el != null,
      )
      if (focusables.length < 2) return
      const first = focusables[0]!
      const last = focusables[focusables.length - 1]!
      const active = document.activeElement
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="confirm-dialog-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
      >
        <h2 id={titleId} className="confirm-dialog-title">
          {title}
        </h2>
        <p id={bodyId} className="confirm-dialog-body">
          {body}
        </p>
        <div className="confirm-dialog-actions">
          <button
            ref={cancelRef}
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
          >
            {cancelLabel ?? t(lang, 'cancel')}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={destructive ? 'btn btn-danger-outline' : 'btn btn-primary'}
            onClick={onConfirm}
          >
            {confirmLabel ?? t(lang, 'confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
