import { useEffect, useMemo, useRef, useState } from 'react'
import type { AppData, Lang, PrintProfile, ShiftHandover } from '../types'
import { t, tf } from '../i18n'
import { EmptyState } from '../components/EmptyState'
import { Settings } from '../components/Settings'
import { TemplatePicker, type CreateChoice } from '../components/TemplatePicker'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ListSkeleton } from '../components/ListSkeleton'
import {
  defaultHistoryFilter,
  filterHandoversByDate,
  type HistoryFilter,
} from '../lib/historyFilter'
import { filterHandoversBySearch } from '../lib/listSearch'
import {
  filterIncompleteOnly,
  resolveContinueLastId,
} from '../lib/incomplete'
import {
  downloadBackupJson,
  formatBackupAt,
  shouldNudgeBackup,
} from '../lib/backup'

interface ListProps {
  lang: Lang
  handovers: ShiftHandover[]
  defaultShift: string
  lastTemplateId?: string
  pinnedId?: string | null
  compactUi: boolean
  haptics: boolean
  printProfile: PrintProfile
  lastBackupAt: string | null
  appData: AppData
  /** True while first paint hydrates from storage. */
  booting?: boolean
  onDefaultShiftChange: (value: string) => void
  onCompactUiChange: (value: boolean) => void
  onHapticsChange: (value: boolean) => void
  onPrintProfileChange: (value: PrintProfile) => void
  onBackupExported: () => void
  onImportBackup: (data: AppData) => void
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

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  return false
}

function ChecklistBadge({
  lang,
  done,
  total,
}: {
  lang: Lang
  done: number
  total: number
}) {
  if (total <= 0) return null
  const complete = done >= total
  return (
    <span
      className={`checklist-badge${complete ? ' is-complete' : ' is-open'}`}
      title={complete ? t(lang, 'checklistComplete') : t(lang, 'checklistOpen')}
    >
      {complete ? (
        <>
          <span className="checklist-badge-check" aria-hidden="true">
            ✓
          </span>
          {done}/{total}
        </>
      ) : (
        <>
          {done}/{total}
          <span className="checklist-badge-label">{t(lang, 'checklistOpen')}</span>
        </>
      )}
    </span>
  )
}

export function List({
  lang,
  handovers,
  defaultShift,
  lastTemplateId,
  pinnedId,
  compactUi,
  haptics,
  printProfile,
  lastBackupAt,
  appData,
  booting = false,
  onDefaultShiftChange,
  onCompactUiChange,
  onHapticsChange,
  onPrintProfileChange,
  onBackupExported,
  onImportBackup,
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
  const [incompleteOnly, setIncompleteOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const continueId = useMemo(
    () => resolveContinueLastId(handovers, pinnedId),
    [handovers, pinnedId],
  )

  const filtered = useMemo(() => {
    let list = filterHandoversByDate(handovers, filter)
    list = filterHandoversBySearch(list, search)
    if (incompleteOnly) list = filterIncompleteOnly(list)
    return list
  }, [handovers, filter, search, incompleteOnly])

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isTypingTarget(e.target)) return

      if (e.key === 'Escape') {
        if (deleteId !== null) {
          e.preventDefault()
          setDeleteId(null)
          return
        }
        if (picking) {
          e.preventDefault()
          setPicking(false)
        }
        return
      }

      if (picking || deleteId !== null) return

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        startNew()
        return
      }
      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [picking, deleteId])

  if (booting) {
    return (
      <div className="list-page">
        <ListSkeleton />
      </div>
    )
  }

  const searchActive = search.trim().length > 0
  const filterActive = filter !== 'all'
  const showBackupNudge = shouldNudgeBackup(lastBackupAt)
  const backupWhen = formatBackupAt(lastBackupAt, lang)

  function emptyKind(): 'search' | 'incomplete' | 'filter' {
    if (searchActive) return 'search'
    if (incompleteOnly) return 'incomplete'
    return 'filter'
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

      <ConfirmDialog
        lang={lang}
        open={deleteId !== null}
        title={t(lang, 'confirmDelete')}
        body={t(lang, 'deleteConfirm')}
        confirmLabel={t(lang, 'delete')}
        destructive
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId)
          setDeleteId(null)
        }}
      />

      {handovers.length === 0 ? (
        <EmptyState lang={lang} kind="none" onNew={startNew} onLoadSample={onLoadSample} />
      ) : (
        <>
          <div className="list-toolbar no-print">
            <button type="button" className="btn btn-primary" onClick={startNew}>
              {t(lang, 'newShift')}
            </button>
            {continueId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onOpen(continueId)}
              >
                {t(lang, 'continueLast')}
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={onLoadSample}>
              {t(lang, 'loadSample')}
            </button>
          </div>

          {showBackupNudge && (
            <div className="backup-nudge no-print" role="status">
              <p className="backup-nudge-text">
                {t(lang, 'backupNudge')}
                {backupWhen
                  ? ` · ${tf(lang, 'backupLast', { when: backupWhen })}`
                  : ` · ${t(lang, 'backupNever')}`}
              </p>
              <button
                type="button"
                className="btn btn-ghost btn-compact"
                onClick={() => {
                  downloadBackupJson(appData)
                  onBackupExported()
                }}
              >
                {t(lang, 'backupExport')}
              </button>
            </div>
          )}

          <label className="search-field no-print">
            <span className="visually-hidden">{t(lang, 'search')}</span>
            <input
              ref={searchRef}
              type="search"
              className="input search-input"
              value={search}
              placeholder={t(lang, 'searchPh')}
              autoComplete="off"
              enterKeyHint="search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

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
            <button
              type="button"
              className={`filter-chip filter-chip-incomplete${
                incompleteOnly ? ' is-active' : ''
              }`}
              aria-pressed={incompleteOnly}
              onClick={() => setIncompleteOnly((v) => !v)}
            >
              {t(lang, 'filterIncomplete')}
            </button>
          </div>

          {sorted.length === 0 ? (
            <EmptyState
              lang={lang}
              kind={emptyKind()}
              onNew={startNew}
              onClearSearch={
                searchActive
                  ? () => {
                      setSearch('')
                      searchRef.current?.focus()
                    }
                  : undefined
              }
              onClearIncomplete={
                !searchActive && incompleteOnly
                  ? () => setIncompleteOnly(false)
                  : undefined
              }
              onShowAll={
                !searchActive && !incompleteOnly && filterActive
                  ? () => setFilter('all')
                  : !searchActive && !incompleteOnly
                    ? () => setFilter('all')
                    : undefined
              }
            />
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
                      <span className="handover-title-row">
                        <span className="handover-title">
                          {isPinned && (
                            <span className="active-badge">
                              {t(lang, 'activeBadge')}
                            </span>
                          )}
                          {h.shiftLabel || t(lang, 'shiftLabel')} · {h.date}
                        </span>
                        <ChecklistBadge lang={lang} done={done} total={total} />
                      </span>
                      <span className="handover-meta">
                        {t(lang, 'updated')}: {formatUpdated(h.updatedAt, lang)}
                        {total > 0
                          ? ` · ${done}/${total} ${t(lang, 'doneCount')}`
                          : ''}
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
                        onClick={() => setDeleteId(h.id)}
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
        compactUi={compactUi}
        haptics={haptics}
        printProfile={printProfile}
        lastBackupAt={lastBackupAt}
        appData={appData}
        onDefaultShiftChange={onDefaultShiftChange}
        onCompactUiChange={onCompactUiChange}
        onHapticsChange={onHapticsChange}
        onPrintProfileChange={onPrintProfileChange}
        onBackupExported={onBackupExported}
        onImportBackup={onImportBackup}
        handovers={handovers}
        onWipeOlder={onWipeOlder}
      />
    </div>
  )
}
