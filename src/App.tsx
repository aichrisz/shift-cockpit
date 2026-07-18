import { useCallback, useEffect, useState } from 'react'
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

export default function App() {
  const [data, setData] = useState<AppData>(() => loadAppData())
  const [view, setView] = useState<View>({ name: 'list' })
  const [draft, setDraft] = useState<ShiftHandover | null>(null)

  useEffect(() => {
    saveAppData(data)
  }, [data])

  const lang = data.settings.lang

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

  const openEditor = useCallback(
    (id: string) => {
      const existing = data.handovers.find((h) => h.id === id)
      if (!existing) {
        setView({ name: 'list' })
        return
      }
      setDraft({ ...existing, checklist: existing.checklist.map((c) => ({ ...c })) })
      setView({ name: 'editor', id })
    },
    [data.handovers],
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
      setView({ name: 'editor', id: null })
    },
    [data.settings.defaultShift, lang],
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
    setView({ name: 'editor', id: saved.id })
  }, [draft, lang])

  const handleDelete = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      handovers: prev.handovers.filter((h) => h.id !== id),
    }))
    setView({ name: 'list' })
    setDraft(null)
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
      setDraft({ ...copy, checklist: copy.checklist.map((c) => ({ ...c })) })
      setView({ name: 'editor', id: copy.id })
    },
    [data.handovers],
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
    setView({ name: 'editor', id: copy.id })
  }, [data.handovers, draft])

  const handleLoadSample = useCallback(() => {
    const sample = createSampleHandover(lang)
    setData((prev) => ({
      ...prev,
      handovers: [sample, ...prev.handovers],
    }))
  }, [lang])

  const handleWipeOlder = useCallback((days: number): number => {
    const removed = countOlderThan(data.handovers, days)
    if (removed === 0) return 0
    setData((prev) => ({
      ...prev,
      handovers: filterKeepRecent(prev.handovers, days),
    }))
    return removed
  }, [data.handovers])

  const handleExport = useCallback(() => {
    if (!draft) return
    setView({ name: 'export', id: draft.id })
  }, [draft])

  const exportHandover: ShiftHandover | null =
    view.name === 'export'
      ? draft && draft.id === view.id
        ? draft
        : data.handovers.find((h) => h.id === view.id) ?? null
      : null

  return (
    <div className="app-shell">
      <Header lang={lang} onLangChange={setLang} />
      <main className="app-main">
        {view.name === 'list' && (
          <List
            lang={lang}
            handovers={data.handovers}
            defaultShift={data.settings.defaultShift}
            lastTemplateId={data.settings.lastTemplateId}
            onDefaultShiftChange={setDefaultShift}
            onNew={handleNew}
            onOpen={(id) => openEditor(id)}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onLoadSample={handleLoadSample}
            onWipeOlder={handleWipeOlder}
          />
        )}

        {view.name === 'editor' && draft && (
          <Editor
            lang={lang}
            draft={draft}
            onChange={setDraft}
            onSave={handleSave}
            onExport={handleExport}
            onDuplicate={handleDuplicateDraft}
            onBack={() => {
              setDraft(null)
              setView({ name: 'list' })
            }}
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
      </main>
    </div>
  )
}
