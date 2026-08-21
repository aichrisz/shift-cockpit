# Components

Shared UI primitives (full source):


## ConfirmDialog
- Source: `src/components/ConfirmDialog.tsx`
- Purpose: shared UI primitive

```tsx
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

```

## Checklist
- Source: `src/components/Checklist.tsx`
- Purpose: shared UI primitive

```tsx
import { useState } from 'react'
import type { ChecklistItem, Lang } from '../types'
import { t } from '../i18n'
import { createId } from '../lib/id'
import { ConfirmDialog } from './ConfirmDialog'

interface ChecklistProps {
  lang: Lang
  items: ChecklistItem[]
  onChange: (items: ChecklistItem[]) => void
  onCopy?: () => void
}

export function Checklist({ lang, items, onChange, onCopy }: ChecklistProps) {
  const [draft, setDraft] = useState('')
  const [resetOpen, setResetOpen] = useState(false)

  function toggle(id: string) {
    onChange(items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  function remove(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  function addCustom() {
    const label = draft.trim()
    if (!label) return
    onChange([...items, { id: createId(), label, done: false }])
    setDraft('')
  }

  function resetChecks() {
    onChange(items.map((item) => ({ ...item, done: false })))
    setResetOpen(false)
  }

  const done = items.filter((i) => i.done).length
  const canReset = items.length > 0 && done > 0

  return (
    <section className="panel" aria-labelledby="checklist-heading">
      <ConfirmDialog
        lang={lang}
        open={resetOpen}
        title={t(lang, 'resetChecksTitle')}
        body={t(lang, 'resetChecksConfirm')}
        confirmLabel={t(lang, 'resetChecks')}
        destructive
        onCancel={() => setResetOpen(false)}
        onConfirm={resetChecks}
      />

      <div className="panel-head">
        <h2 id="checklist-heading" className="panel-title">
          {t(lang, 'checklist')}
        </h2>
        <div className="panel-head-actions">
          {onCopy && (
            <button
              type="button"
              className="btn btn-ghost btn-compact no-print"
              onClick={onCopy}
            >
              {t(lang, 'copy')}
            </button>
          )}
          {canReset && (
            <button
              type="button"
              className="btn btn-ghost btn-compact no-print"
              onClick={() => setResetOpen(true)}
            >
              {t(lang, 'resetChecks')}
            </button>
          )}
          <span className="panel-meta">
            {done}/{items.length} {t(lang, 'doneCount')}
          </span>
        </div>
      </div>

      <ul className="checklist" role="list">
        {items.map((item) => (
          <li key={item.id} className="checklist-item">
            <label className="check-row">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggle(item.id)}
              />
              <span className={item.done ? 'is-done' : undefined}>{item.label}</span>
            </label>
            <button
              type="button"
              className="btn-icon"
              aria-label={t(lang, 'delete')}
              onClick={() => remove(item.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="inline-add">
        <input
          type="text"
          className="input"
          value={draft}
          placeholder={t(lang, 'customPlaceholder')}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addCustom()
            }
          }}
        />
        <button type="button" className="btn btn-secondary" onClick={addCustom}>
          {t(lang, 'addCustom')}
        </button>
      </div>
    </section>
  )
}

```

## EmptyState
- Source: `src/components/EmptyState.tsx`
- Purpose: shared UI primitive

```tsx
import type { Lang } from '../types'
import { t } from '../i18n'

export type EmptyKind = 'none' | 'filter' | 'search' | 'incomplete'

interface EmptyStateProps {
  lang: Lang
  kind?: EmptyKind
  onNew?: () => void
  /** Always open full template picker (even when default template is set). */
  onChooseTemplates?: () => void
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
  onChooseTemplates,
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
        {kind === 'none' && onChooseTemplates && (
          <button type="button" className="btn btn-ghost" onClick={onChooseTemplates}>
            {t(lang, 'chooseTemplates')}
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

```

## TemplatePicker
- Source: `src/components/TemplatePicker.tsx`
- Purpose: shared UI primitive

```tsx
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

```

## TipSplit
- Source: `src/components/TipSplit.tsx`
- Purpose: shared UI primitive

```tsx
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

/** Tip fields only — parent provides optional panel chrome. */
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
    <div className="tips-body">
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
    </div>
  )
}

```

## QuickChips
- Source: `src/components/QuickChips.tsx`
- Purpose: shared UI primitive

```tsx
import { useState } from 'react'
import type { Lang } from '../types'
import { t } from '../i18n'
import { chipsForTemplate, chipsMoreThan } from '../data/chips'

interface QuickChipsProps {
  lang: Lang
  /** Template id for curated chip set (`frueh` / `spaet` / `nacht` / blank). */
  templateId?: string | null
  onPick: (phrase: string) => void
}

export function QuickChips({ lang, templateId, onPick }: QuickChipsProps) {
  const [expanded, setExpanded] = useState(false)
  const primary = chipsForTemplate(templateId)
  const more = chipsMoreThan(templateId)
  const chips = expanded ? [...primary, ...more] : primary

  return (
    <div className="chip-row no-print" role="group" aria-label={t(lang, 'quickChips')}>
      {chips.map((chip) => {
        const label = chip.labels[lang] ?? chip.labels.de
        return (
          <button
            key={chip.id}
            type="button"
            className="chip"
            onClick={() => onPick(label)}
          >
            {label}
          </button>
        )
      })}
      {more.length > 0 && (
        <button
          type="button"
          className="chip chip-more"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? t(lang, 'chipsLess') : t(lang, 'chipsMore')}
        </button>
      )}
    </div>
  )
}

```

## UndoToast
- Source: `src/components/UndoToast.tsx`
- Purpose: shared UI primitive

```tsx
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

```

## ListSkeleton
- Source: `src/components/ListSkeleton.tsx`
- Purpose: shared UI primitive

```tsx
/** Pulse placeholder cards shown while list boots from storage. */
export function ListSkeleton() {
  return (
    <div className="list-skeleton" aria-busy="true" aria-live="polite">
      <div className="skeleton-toolbar">
        <div className="skeleton-bar skeleton-bar-btn" />
        <div className="skeleton-bar skeleton-bar-btn-sm" />
      </div>
      <div className="skeleton-filter">
        <div className="skeleton-bar skeleton-chip" />
        <div className="skeleton-bar skeleton-chip" />
        <div className="skeleton-bar skeleton-chip" />
      </div>
      <ul className="handover-list" role="presentation">
        {[0, 1, 2].map((i) => (
          <li key={i} className="handover-card skeleton-card">
            <div className="skeleton-card-body">
              <div className="skeleton-bar skeleton-title" />
              <div className="skeleton-bar skeleton-meta" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

```