import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AppData, Lang, PrintProfile, ShiftHandover, View } from './types'
import type { CreateChoice } from './components/TemplatePicker'
import type { TemplateId } from './data/templates'
import { Header } from './components/Header'
import { UndoToast } from './components/UndoToast'
import { List } from './pages/List'
import { Editor } from './pages/Editor'
import { Export } from './pages/Export'
import { SettingsPage } from './pages/SettingsPage'
import { loadAppData, saveAppData, filterKeepRecent, countOlderThan } from './lib/storage'
import { createId } from './lib/id'
import { createPresetChecklist } from './data/presets'
import { createSampleHandover } from './data/sample'
import { createTemplateChecklist, templateShiftLabel } from './data/templates'
import { localIsoDate } from './lib/dates'
import { handoverSnapshot, isHandoverDirty } from './lib/dirty'
import { hapticPulse } from './lib/haptics'
import { t, tf } from './i18n'

const UNDO_MS = 5000

type UndoState =
  | {
      kind: 'handovers'
      message: string
      handovers: ShiftHandover[]
      pinnedId: string | null | undefined
    }
  | {
      kind: 'markReady'
      message: string
      previous: ShiftHandover
    }

function todayIsoDate(): string {
  return localIsoDate()
}

function createBlankHandover(lang: Lang, defaultShift: string): ShiftHandover {
  const now = new Date().toISOString()
  return {
    id: createId(),
    createdAt: now,
    updatedAt: now,
    shiftLabel: defaultShift,
    date: todayIsoDate(),
    openPoints: '',
    roomNotes: '',
    guestNotes: '',
    checklist: createPresetChecklist(lang),
    tipTotal: null,
    tipPeople: null,
    tipNote: '',
    lang,
  }
}

function createFromTemplate(
  templateId: TemplateId,
  lang: Lang,
  defaultShift: string,
): ShiftHandover {
  const now = new Date().toISOString()
  const label = templateShiftLabel(templateId, lang) || defaultShift
  return {
    id: createId(),
    createdAt: now,
    updatedAt: now,
    shiftLabel: label,
    date: todayIsoDate(),
    openPoints: '',
    roomNotes: '',
    guestNotes: '',
    checklist: createTemplateChecklist(templateId, lang),
    tipTotal: null,
    tipPeople: null,
    tipNote: '',
    lang,
    templateId,
  }
}

function cloneHandover(source: ShiftHandover): ShiftHandover {
  const now = new Date().toISOString()
  const label = source.shiftLabel.trim()
  return {
    ...source,
    id: createId(),
    createdAt: now,
    updatedAt: now,
    date: todayIsoDate(),
    shiftLabel: label ? `${label} (copy)` : '(copy)',
    checklist: source.checklist.map((c) => ({
      ...c,
      id: createId(),
    })),
  }
}

function cloneDraft(h: ShiftHandover): ShiftHandover {
  return { ...h, checklist: h.checklist.map((c) => ({ ...c })) }
}

function deepCloneHandovers(list: ShiftHandover[]): ShiftHandover[] {
  return list.map((h) => cloneDraft(h))
}

export default function App() {
  const [data, setData] = useState<AppData>(() => loadAppData())
  const [view, setView] = useState<View>({ name: 'list' })
  const [draft, setDraft] = useState<ShiftHandover | null>(null)
  /** Baseline for dirty detection — set when draft is loaded/created/saved. */
  const baselineRef = useRef<ShiftHandover | null>(null)
  const [baselineKey, setBaselineKey] = useState('')
  /** Brief boot so list can show skeleton for one paint after hydrate. */
  const [booting, setBooting] = useState(true)
  const [undo, setUndo] = useState<UndoState | null>(null)
  const undoTimerRef = useRef<number | null>(null)

  useEffect(() => {
    saveAppData(data)
  }, [data])

  useEffect(() => {
    // Prefer one paint of skeleton even when load is sync.
    const id = window.requestAnimationFrame(() => {
      setBooting(false)
    })
    return () => window.cancelAnimationFrame(id)
  }, [])

  const clearUndoTimer = useCallback(() => {
    if (undoTimerRef.current != null) {
      window.clearTimeout(undoTimerRef.current)
      undoTimerRef.current = null
    }
  }, [])

  const dismissUndo = useCallback(() => {
    clearUndoTimer()
    setUndo(null)
  }, [clearUndoTimer])

  const offerUndo = useCallback(
    (next: UndoState) => {
      clearUndoTimer()
      setUndo(next)
      undoTimerRef.current = window.setTimeout(() => {
        setUndo(null)
        undoTimerRef.current = null
      }, UNDO_MS)
    },
    [clearUndoTimer],
  )

  useEffect(() => () => clearUndoTimer(), [clearUndoTimer])

  const lang = data.settings.lang
  const pinnedId = data.settings.pinnedId ?? null
  const compactUi = data.settings.compactUi === true
  const haptics = data.settings.haptics !== false
  const exportCompact = data.settings.exportCompact === true
  const printProfile: PrintProfile =
    data.settings.printProfile === 'compact' ? 'compact' : 'normal'
  const lastBackupAt = data.settings.lastBackupAt ?? null

  useEffect(() => {
    const root = document.documentElement
    if (compactUi) {
      root.setAttribute('data-compact', 'true')
    } else {
      root.removeAttribute('data-compact')
    }
  }, [compactUi])

  useEffect(() => {
    document.documentElement.setAttribute('data-print-profile', printProfile)
  }, [printProfile])

  const setBaseline = useCallback((h: ShiftHandover | null) => {
    baselineRef.current = h ? cloneDraft(h) : null
    setBaselineKey(h ? handoverSnapshot(h) : '')
  }, [])

  const dirty = useMemo(() => {
    void baselineKey
    if (!draft || !baselineRef.current) return false
    return isHandoverDirty(draft, baselineRef.current)
  }, [draft, baselineKey])

  const setLang = useCallback((next: Lang) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, lang: next },
    }))
  }, [])

  const setDefaultShift = useCallback((defaultShift: string) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, defaultShift },
    }))
  }, [])

  const setCompactUi = useCallback((value: boolean) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, compactUi: value },
    }))
  }, [])

  const setHaptics = useCallback((value: boolean) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, haptics: value },
    }))
  }, [])

  const setExportCompact = useCallback((value: boolean) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, exportCompact: value },
    }))
  }, [])

  const setPrintProfile = useCallback((value: PrintProfile) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, printProfile: value },
    }))
  }, [])

  const handleBackupExported = useCallback(() => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, lastBackupAt: new Date().toISOString() },
    }))
  }, [])

  const handleImportBackup = useCallback((next: AppData) => {
    setData(next)
    setView({ name: 'list' })
    setDraft(null)
    baselineRef.current = null
    setBaselineKey('')
    clearUndoTimer()
    setUndo(null)
  }, [clearUndoTimer])

  const handlePinToggle = useCallback(
    (id: string) => {
      hapticPulse(haptics)
      setData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          pinnedId: prev.settings.pinnedId === id ? null : id,
        },
      }))
    },
    [haptics],
  )

  const openEditor = useCallback(
    (id: string) => {
      const existing = data.handovers.find((h) => h.id === id)
      if (!existing) {
        setView({ name: 'list' })
        return
      }
      const next = cloneDraft(existing)
      setDraft(next)
      setBaseline(next)
      setView({ name: 'editor', id })
    },
    [data.handovers, setBaseline],
  )

  const handleNew = useCallback(
    (choice: CreateChoice) => {
      let handover: ShiftHandover
      if (choice === 'blank') {
        handover = createBlankHandover(lang, data.settings.defaultShift)
      } else {
        handover = createFromTemplate(choice, lang, data.settings.defaultShift)
        setData((prev) => ({
          ...prev,
          settings: { ...prev.settings, lastTemplateId: choice },
        }))
      }
      setDraft(handover)
      setBaseline(handover)
      setView({ name: 'editor', id: null })
    },
    [data.settings.defaultShift, lang, setBaseline],
  )

  const handleSave = useCallback(() => {
    if (!draft) return
    const now = new Date().toISOString()
    const saved: ShiftHandover = {
      ...draft,
      updatedAt: now,
      lang,
    }
    setData((prev) => {
      const idx = prev.handovers.findIndex((h) => h.id === saved.id)
      const handovers =
        idx >= 0
          ? prev.handovers.map((h, i) => (i === idx ? saved : h))
          : [saved, ...prev.handovers]
      return { ...prev, handovers }
    })
    setDraft(saved)
    setBaseline(saved)
    setView({ name: 'editor', id: saved.id })
    hapticPulse(haptics)
  }, [draft, lang, setBaseline, haptics])

  const handleDelete = useCallback(
    (id: string) => {
      const snapshot = deepCloneHandovers(data.handovers)
      const pinSnap = data.settings.pinnedId
      setData((prev) => ({
        ...prev,
        handovers: prev.handovers.filter((h) => h.id !== id),
        settings: {
          ...prev.settings,
          pinnedId: prev.settings.pinnedId === id ? null : prev.settings.pinnedId,
        },
      }))
      setView({ name: 'list' })
      setDraft(null)
      baselineRef.current = null
      setBaselineKey('')
      offerUndo({
        kind: 'handovers',
        message: t(lang, 'undoDeleted'),
        handovers: snapshot,
        pinnedId: pinSnap,
      })
    },
    [data.handovers, data.settings.pinnedId, lang, offerUndo],
  )

  const handleDuplicate = useCallback(
    (id: string) => {
      const source = data.handovers.find((h) => h.id === id)
      if (!source) return
      const copy = cloneHandover(source)
      setData((prev) => ({
        ...prev,
        handovers: [copy, ...prev.handovers],
      }))
      const next = cloneDraft(copy)
      setDraft(next)
      setBaseline(next)
      setView({ name: 'editor', id: copy.id })
    },
    [data.handovers, setBaseline],
  )

  const handleDuplicateDraft = useCallback(() => {
    if (!draft) return
    const source = data.handovers.find((h) => h.id === draft.id) ?? draft
    const copy = cloneHandover({
      ...source,
      ...draft,
      checklist: draft.checklist.map((c) => ({ ...c })),
    })
    setData((prev) => ({
      ...prev,
      handovers: [copy, ...prev.handovers],
    }))
    setDraft(copy)
    setBaseline(copy)
    setView({ name: 'editor', id: copy.id })
  }, [data.handovers, draft, setBaseline])

  const handleLoadSample = useCallback(() => {
    const sample = createSampleHandover(lang)
    setData((prev) => ({
      ...prev,
      handovers: [sample, ...prev.handovers],
    }))
  }, [lang])

  const handleWipeOlder = useCallback(
    (days: number): number => {
      const removed = countOlderThan(data.handovers, days)
      if (removed === 0) return 0
      const snapshot = deepCloneHandovers(data.handovers)
      const pinSnap = data.settings.pinnedId
      setData((prev) => {
        const kept = filterKeepRecent(prev.handovers, days)
        const pin = prev.settings.pinnedId
        const pinStill = pin && kept.some((h) => h.id === pin) ? pin : null
        return {
          ...prev,
          handovers: kept,
          settings: { ...prev.settings, pinnedId: pinStill },
        }
      })
      offerUndo({
        kind: 'handovers',
        message: tf(lang, 'undoWiped', { n: removed }),
        handovers: snapshot,
        pinnedId: pinSnap,
      })
      return removed
    },
    [data.handovers, data.settings.pinnedId, lang, offerUndo],
  )

  const handleMarkReadyUndo = useCallback(
    (previous: ShiftHandover) => {
      offerUndo({
        kind: 'markReady',
        message: t(lang, 'undoMarkReady'),
        previous,
      })
    },
    [lang, offerUndo],
  )

  const handleUndo = useCallback(() => {
    if (!undo) return
    if (undo.kind === 'handovers') {
      setData((prev) => ({
        ...prev,
        handovers: deepCloneHandovers(undo.handovers),
        settings: { ...prev.settings, pinnedId: undo.pinnedId ?? null },
      }))
    } else if (undo.kind === 'markReady') {
      const restored = cloneDraft(undo.previous)
      setDraft(restored)
      // Keep baseline so dirty reflects undo of ready mark
      setView({ name: 'editor', id: restored.id })
    }
    dismissUndo()
  }, [undo, dismissUndo])

  const handleExport = useCallback(() => {
    if (!draft) return
    setView({ name: 'export', id: draft.id })
  }, [draft])

  const handleEditorBack = useCallback(() => {
    setDraft(null)
    baselineRef.current = null
    setBaselineKey('')
    setView({ name: 'list' })
  }, [])

  const handlePinFromEditor = useCallback(() => {
    if (!draft) return
    handlePinToggle(draft.id)
  }, [draft, handlePinToggle])

  const exportHandover: ShiftHandover | null =
    view.name === 'export'
      ? draft && draft.id === view.id
        ? draft
        : data.handovers.find((h) => h.id === view.id) ?? null
      : null

  const viewKey =
    view.name === 'list'
      ? 'list'
      : view.name === 'settings'
        ? 'settings'
        : view.name === 'editor'
          ? `editor-${view.id ?? 'new'}`
          : `export-${view.id}`

  return (
    <div className={`app-shell${compactUi ? ' is-compact' : ''}`} data-compact={compactUi || undefined}>
      <Header
        lang={lang}
        view={view}
        onLangChange={setLang}
        onOpenSettings={() => setView({ name: 'settings' })}
        onBackFromSettings={() => setView({ name: 'list' })}
      />
      <main className="app-main">
        <div key={viewKey} className="view-root">
          {view.name === 'list' && (
            <List
              lang={lang}
              handovers={data.handovers}
              lastTemplateId={data.settings.lastTemplateId}
              pinnedId={pinnedId}
              booting={booting}
              onNew={handleNew}
              onOpen={(id) => openEditor(id)}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onPinToggle={handlePinToggle}
              onLoadSample={handleLoadSample}
            />
          )}

          {view.name === 'settings' && (
            <SettingsPage
              lang={lang}
              defaultShift={data.settings.defaultShift}
              compactUi={compactUi}
              haptics={haptics}
              printProfile={printProfile}
              lastBackupAt={lastBackupAt}
              appData={data}
              handovers={data.handovers}
              onDefaultShiftChange={setDefaultShift}
              onCompactUiChange={setCompactUi}
              onHapticsChange={setHaptics}
              onPrintProfileChange={setPrintProfile}
              onBackupExported={handleBackupExported}
              onImportBackup={handleImportBackup}
              onWipeOlder={handleWipeOlder}
              onBack={() => setView({ name: 'list' })}
            />
          )}

          {view.name === 'editor' && draft && (
            <Editor
              lang={lang}
              draft={draft}
              dirty={dirty}
              pinned={pinnedId === draft.id}
              canPin={data.handovers.some((h) => h.id === draft.id)}
              haptics={haptics}
              exportCompact={exportCompact}
              printProfile={printProfile}
              onChange={setDraft}
              onSave={handleSave}
              onExport={handleExport}
              onDuplicate={handleDuplicateDraft}
              onPinToggle={
                // Only pin handovers already in storage (avoid orphan pinnedId).
                data.handovers.some((h) => h.id === draft.id)
                  ? handlePinFromEditor
                  : undefined
              }
              onMarkReadyUndo={handleMarkReadyUndo}
              onBack={handleEditorBack}
            />
          )}

          {view.name === 'export' && exportHandover && (
            <Export
              lang={lang}
              handover={exportHandover}
              exportCompact={exportCompact}
              printProfile={printProfile}
              haptics={haptics}
              onExportCompactChange={setExportCompact}
              onBack={() => {
                if (draft) {
                  setView({ name: 'editor', id: draft.id })
                } else {
                  setView({ name: 'list' })
                }
              }}
            />
          )}
        </div>
      </main>

      {undo && (
        <UndoToast
          lang={lang}
          message={undo.message}
          onUndo={handleUndo}
          onDismiss={dismissUndo}
        />
      )}
    </div>
  )
}
