import { useState } from 'react'
import type { ChecklistItem, Lang } from '../types'
import { t } from '../i18n'
import { createId } from '../lib/id'

interface ChecklistProps {
  lang: Lang
  items: ChecklistItem[]
  onChange: (items: ChecklistItem[]) => void
}

export function Checklist({ lang, items, onChange }: ChecklistProps) {
  const [draft, setDraft] = useState('')

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

  const done = items.filter((i) => i.done).length

  return (
    <section className="panel" aria-labelledby="checklist-heading">
      <div className="panel-head">
        <h2 id="checklist-heading" className="panel-title">
          {t(lang, 'checklist')}
        </h2>
        <span className="panel-meta">
          {done}/{items.length} {t(lang, 'doneCount')}
        </span>
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
