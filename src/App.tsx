import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AppData, Lang, ShiftHandover, View } from './types'
import type { CreateChoice } from './components/TemplatePicker'
import type { TemplateId } from './data/templates'
import { Header } from './components/Header'
import { List } from './pages/List'
import { Editor } from './pages/Editor'
import { Export } from './pages/Export'
import { loadAppData, saveAppData, filterKeepRecent, countOlderThan } from './lib/storage'
import { createId } from './lib/id'
import { createPresetChecklist } from './data/presets'
import { createSampleHandover } from './data/sample'
import { createTemplateChecklist, templateShiftLabel } from './data/templates'
import { localIsoDate } from './lib/dates'
import { handoverSnapshot, isHandoverDirty } from './lib/dirty'

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

export default function App() {
  const [data, setData] = useState<AppData>(() => loadAppData())
  const [view, setView] = useState<View>({ name: 'list' })
  const [draft, setDraft] = useState<ShiftHandover | null>(null)
  /** Baseline for dirty detection — set when draft is loaded/created/saved. */
  const baselineRef = useRef<ShiftHandover | null>(null)
  const [baselineKey, setBaselineKey] = useState('')
  /** Brief boot so list can show skeleton for one paint after hydrate. */
  const [booting, setBooting] = useState(true)

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

  const lang = data.settings.lang
  const pinnedId = data.settings.pinnedId ?? null
  const compactUi = data.settings.compactUi === true

  useEffect(() => {
    const root = document.documentElement
    if (compactUi) {
      root.setAttribute('data-compact', 'true')
    } else {
      root.removeAttribute('data-compact')
    }
  }, [compactUi])

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

  const handlePinToggle = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        pinnedId: prev.settings.pinnedId === id ? null : id,
      },
    }))
  }, [])

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
  }, [draft, lang, setBaseline])

  const handleDelete = useCallback((id: string) => {
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
  }, [])

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
      return removed
    },
    [data.handovers],
  )

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
      : view.name === 'editor'
        ? `editor-${view.id ?? 'new'}`
        : `export-${view.id}`

  return (
    <div className={`app-shell${compactUi ? ' is-compact' : ''}`} data-compact={compactUi || undefined}>
      <Header lang={lang} onLangChange={setLang} />
      <main className="app-main">
        <div key={viewKey} className="view-root">
          {view.name === 'list' && (
            <List
              lang={lang}
              handovers={data.handovers}
              defaultShift={data.settings.defaultShift}
              lastTemplateId={data.settings.lastTemplateId}
              pinnedId={pinnedId}
              compactUi={compactUi}
              booting={booting}
              onDefaultShiftChange={setDefaultShift}
              onCompactUiChange={setCompactUi}
              onNew={handleNew}
              onOpen={(id) => openEditor(id)}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onPinToggle={handlePinToggle}
              onLoadSample={handleLoadSample}
              onWipeOlder={handleWipeOlder}
            />
          )}

          {view.name === 'editor' && draft && (
            <Editor
              lang={lang}
              draft={draft}
              dirty={dirty}
              pinned={pinnedId === draft.id}
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
              onBack={handleEditorBack}
            />
          )}

          {view.name === 'export' && exportHandover && (
            <Export
              lang={lang}
              handover={exportHandover}
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
    </div>
  )
}
