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
