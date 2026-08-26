import { useId, useState } from 'react'
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
  const headingId = useId()

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

  // ponytail: hide legacy blank-label rows without mutating saved data;
  // upgrade path: one-time migration in storage layer
  const visible = items.filter((item) => item.label.trim() !== '')
  const done = visible.filter((i) => i.done).length
  const canReset = visible.length > 0 && done > 0

  return (
    <section className="panel" aria-labelledby={headingId}>
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
        <h2 id={headingId} className="panel-title">
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
          <span className="panel-meta" aria-live="polite">
            {done}/{visible.length} {t(lang, 'doneCount')}
          </span>
        </div>
      </div>

      <ul className="checklist" role="list">
        {visible.map((item) => (
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
              aria-label={`${t(lang, 'delete')}: ${item.label}`}
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
          aria-label={t(lang, 'addCustom')}
          placeholder={t(lang, 'customPlaceholder')}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
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
