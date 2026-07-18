import { useMemo, useState } from 'react'
import type { Lang, ShiftHandover } from '../types'
import { t } from '../i18n'
import { EmptyState } from '../components/EmptyState'
import { Settings } from '../components/Settings'
import { TemplatePicker, type CreateChoice } from '../components/TemplatePicker'
import {
  defaultHistoryFilter,
  filterHandoversByDate,
  type HistoryFilter,
} from '../lib/historyFilter'

interface ListProps {
  lang: Lang
  handovers: ShiftHandover[]
  defaultShift: string
  lastTemplateId?: string
  pinnedId?: string | null
  onDefaultShiftChange: (value: string) => void
  onNew: (choice: CreateChoice) => void
  onOpen: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onPinToggle: (id: string) => void
  onLoadSample: () => void
  onWipeOlder: (days: number) => number
}

function formatUpdated(iso: string, lang: Lang): string {
  try {
    const locale = lang === 'de' ? 'de-DE' : lang === 'id' ? 'id-ID' : 'en-GB'
    return new Date(iso).toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export function List({
  lang,
  handovers,
  defaultShift,
  lastTemplateId,
  pinnedId,
  onDefaultShiftChange,
  onNew,
  onOpen,
  onDelete,
  onDuplicate,
  onPinToggle,
  onLoadSample,
  onWipeOlder,
}: ListProps) {
  const [picking, setPicking] = useState(false)
  const [filter, setFilter] = useState<HistoryFilter>(() =>
    defaultHistoryFilter(handovers),
  )

  const filtered = useMemo(
    () => filterHandoversByDate(handovers, filter),
    [handovers, filter],
  )

  const sorted = useMemo(() => {
    const list = [...filtered].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    if (!pinnedId) return list
    const pinIdx = list.findIndex((h) => h.id === pinnedId)
    if (pinIdx <= 0) return list
    const [pinned] = list.splice(pinIdx, 1)
    return [pinned, ...list]
  }, [filtered, pinnedId])

  function startNew() {
    setPicking(true)
  }

  function handleChoose(choice: CreateChoice) {
    setPicking(false)
    onNew(choice)
  }

  return (
    <div className="list-page">
      {picking && (
        <TemplatePicker
          lang={lang}
          lastTemplateId={lastTemplateId}
          onChoose={handleChoose}
          onCancel={() => setPicking(false)}
        />
      )}

      {handovers.length === 0 ? (
        <EmptyState lang={lang} onNew={startNew} onLoadSample={onLoadSample} />
      ) : (
        <>
          <div className="list-toolbar no-print">
            <button type="button" className="btn btn-primary" onClick={startNew}>
              {t(lang, 'newShift')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onLoadSample}>
              {t(lang, 'loadSample')}
            </button>
          </div>

          <div
            className="filter-row no-print"
            role="group"
            aria-label={t(lang, 'filterAll')}
          >
            {(
              [
                ['today', 'filterToday'],
                ['7d', 'filter7d'],
                ['all', 'filterAll'],
              ] as const
            ).map(([id, key]) => (
              <button
                key={id}
                type="button"
                className={`filter-chip${filter === id ? ' is-active' : ''}`}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >
                {t(lang, key)}
              </button>
            ))}
          </div>

          {sorted.length === 0 ? (
            <div className="filter-empty" role="status">
              <p>{t(lang, 'filterEmpty')}</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFilter('all')}
              >
                {t(lang, 'filterShowAll')}
              </button>
            </div>
          ) : (
            <ul className="handover-list" role="list">
              {sorted.map((h) => {
                const done = h.checklist.filter((c) => c.done).length
                const total = h.checklist.length
                const isPinned = pinnedId === h.id
                return (
                  <li
                    key={h.id}
                    className={`handover-card${isPinned ? ' is-pinned' : ''}`}
                  >
                    <button
                      type="button"
                      className="handover-main"
                      onClick={() => onOpen(h.id)}
                    >
                      <span className="handover-title">
                        {isPinned && (
                          <span className="active-badge">{t(lang, 'activeBadge')}</span>
                        )}
                        {h.shiftLabel || t(lang, 'shiftLabel')} · {h.date}
                      </span>
                      <span className="handover-meta">
                        {t(lang, 'updated')}: {formatUpdated(h.updatedAt, lang)}
                        {total > 0 ? ` · ${done}/${total} ${t(lang, 'doneCount')}` : ''}
                      </span>
                    </button>
                    <div className="handover-actions no-print">
                      <button
                        type="button"
                        className="btn btn-ghost btn-compact"
                        onClick={() => onPinToggle(h.id)}
                      >
                        {isPinned ? t(lang, 'unpin') : t(lang, 'pin')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-compact"
                        onClick={() => onDuplicate(h.id)}
                      >
                        {t(lang, 'duplicate')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger-ghost"
                        onClick={() => {
                          if (window.confirm(t(lang, 'deleteConfirm'))) {
                            onDelete(h.id)
                          }
                        }}
                      >
                        {t(lang, 'delete')}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}

      <Settings
        lang={lang}
        defaultShift={defaultShift}
        onDefaultShiftChange={onDefaultShiftChange}
        handovers={handovers}
        onWipeOlder={onWipeOlder}
      />
    </div>
  )
}
