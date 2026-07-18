import type { Lang, ShiftHandover } from '../types'
import { t } from '../i18n'
import { EmptyState } from '../components/EmptyState'
import { Settings } from '../components/Settings'

interface ListProps {
  lang: Lang
  handovers: ShiftHandover[]
  defaultShift: string
  onDefaultShiftChange: (value: string) => void
  onNew: () => void
  onOpen: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onLoadSample: () => void
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
  onDefaultShiftChange,
  onNew,
  onOpen,
  onDelete,
  onDuplicate,
  onLoadSample,
}: ListProps) {
  const sorted = [...handovers].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return (
    <div className="list-page">
      {sorted.length === 0 ? (
        <EmptyState lang={lang} onNew={onNew} onLoadSample={onLoadSample} />
      ) : (
        <>
          <div className="list-toolbar no-print">
            <button type="button" className="btn btn-primary" onClick={onNew}>
              {t(lang, 'newShift')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onLoadSample}>
              {t(lang, 'loadSample')}
            </button>
          </div>

          <ul className="handover-list" role="list">
            {sorted.map((h) => {
              const done = h.checklist.filter((c) => c.done).length
              const total = h.checklist.length
              return (
                <li key={h.id} className="handover-card">
                  <button
                    type="button"
                    className="handover-main"
                    onClick={() => onOpen(h.id)}
                  >
                    <span className="handover-title">
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
        </>
      )}

      <Settings
        lang={lang}
        defaultShift={defaultShift}
        onDefaultShiftChange={onDefaultShiftChange}
      />
    </div>
  )
}
