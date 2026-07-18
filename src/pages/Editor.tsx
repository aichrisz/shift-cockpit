import { useRef, useState } from 'react'
import type { Lang, ShiftHandover } from '../types'
import { t } from '../i18n'
import { Checklist } from '../components/Checklist'
import { TipSplit } from '../components/TipSplit'
import { QuickChips } from '../components/QuickChips'
import { appendChipLine } from '../data/chips'
import { appendRoomLine } from '../lib/roomHelper'
import { checklistToMarkdown, copyToClipboard } from '../lib/exportMd'

interface EditorProps {
  lang: Lang
  draft: ShiftHandover
  dirty: boolean
  pinned: boolean
  onChange: (next: ShiftHandover) => void
  onSave: () => void
  onExport: () => void
  onDuplicate?: () => void
  onPinToggle?: () => void
  onBack: () => void
}

export function Editor({
  lang,
  draft,
  dirty,
  pinned,
  onChange,
  onSave,
  onExport,
  onDuplicate,
  onPinToggle,
  onBack,
}: EditorProps) {
  const [roomInput, setRoomInput] = useState('')
  const [copyFlash, setCopyFlash] = useState<string | null>(null)
  const hasExistingTips =
    draft.tipTotal !== null ||
    draft.tipPeople !== null ||
    draft.tipNote.trim().length > 0
  const [tipsOpen, setTipsOpen] = useState(hasExistingTips)
  const roomFieldRef = useRef<HTMLInputElement>(null)

  function patch(partial: Partial<ShiftHandover>) {
    onChange({ ...draft, ...partial })
  }

  function handleBack() {
    if (dirty) {
      if (!window.confirm(t(lang, 'dirtyLeaveConfirm'))) return
    }
    onBack()
  }

  function handleRoomAdd() {
    const num = roomInput.trim()
    if (!num) {
      roomFieldRef.current?.focus()
      return
    }
    patch({ roomNotes: appendRoomLine(draft.roomNotes, num, lang) })
    setRoomInput('')
  }

  async function copySection(text: string, labelKey: 'copyOpen' | 'copyRoom' | 'copyGuest' | 'copyChecklist') {
    const body = text.trim()
    if (!body) {
      // Still allow copy of empty → user gets empty clipboard less useful; copy as-is
    }
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopyFlash(t(lang, labelKey))
      window.setTimeout(() => setCopyFlash(null), 1800)
    }
  }

  return (
    <div className="editor-page">
      <div className="editor-toolbar no-print">
        <button type="button" className="btn btn-ghost" onClick={handleBack}>
          {t(lang, 'back')}
        </button>
        <div className="toolbar-actions">
          {dirty && (
            <span className="dirty-badge" title={t(lang, 'unsaved')}>
              {t(lang, 'unsaved')}
            </span>
          )}
          {onPinToggle && (
            <button type="button" className="btn btn-ghost" onClick={onPinToggle}>
              {pinned ? t(lang, 'unpin') : t(lang, 'pin')}
            </button>
          )}
          {onDuplicate && (
            <button type="button" className="btn btn-ghost" onClick={onDuplicate}>
              {t(lang, 'duplicate')}
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={onExport}>
            {t(lang, 'export')}
          </button>
          <button type="button" className="btn btn-primary" onClick={onSave}>
            {t(lang, 'save')}
          </button>
        </div>
      </div>

      {copyFlash && (
        <p className="toast-msg no-print" role="status">
          {t(lang, 'copied')}: {copyFlash}
        </p>
      )}

      <div className="print-only print-heading">
        <h1>{t(lang, 'appTitle')}</h1>
        <p>
          {draft.shiftLabel || t(lang, 'shiftLabel')} · {draft.date}
        </p>
      </div>

      <div className="field-grid">
        <label className="field">
          <span className="field-label">{t(lang, 'shiftLabel')}</span>
          <input
            type="text"
            className="input"
            value={draft.shiftLabel}
            placeholder={t(lang, 'shiftPlaceholder')}
            onChange={(e) => patch({ shiftLabel: e.target.value })}
          />
        </label>
        <label className="field">
          <span className="field-label">{t(lang, 'date')}</span>
          <input
            type="date"
            className="input"
            value={draft.date}
            onChange={(e) => patch({ date: e.target.value })}
          />
        </label>
      </div>

      <div className="field">
        <div className="field-label-row">
          <span className="field-label" id="open-points-label">
            {t(lang, 'openPoints')}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-compact no-print"
            onClick={() => copySection(draft.openPoints, 'copyOpen')}
          >
            {t(lang, 'copy')}
          </button>
        </div>
        <QuickChips
          lang={lang}
          onPick={(phrase) => patch({ openPoints: appendChipLine(draft.openPoints, phrase) })}
        />
        <textarea
          className="input textarea"
          rows={4}
          value={draft.openPoints}
          placeholder={t(lang, 'openPointsPh')}
          aria-labelledby="open-points-label"
          onChange={(e) => patch({ openPoints: e.target.value })}
        />
      </div>

      <div className="field">
        <div className="field-label-row">
          <span className="field-label" id="room-notes-label">
            {t(lang, 'roomNotes')}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-compact no-print"
            onClick={() => copySection(draft.roomNotes, 'copyRoom')}
          >
            {t(lang, 'copy')}
          </button>
        </div>
        <div className="room-helper no-print" role="group" aria-label={t(lang, 'roomAdd')}>
          <input
            ref={roomFieldRef}
            type="text"
            className="input room-helper-input"
            inputMode="numeric"
            autoComplete="off"
            placeholder={t(lang, 'roomNumberPh')}
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleRoomAdd()
              }
            }}
            aria-labelledby="room-notes-label"
          />
          <button type="button" className="btn btn-secondary btn-compact" onClick={handleRoomAdd}>
            {t(lang, 'roomAdd')}
          </button>
        </div>
        <textarea
          className="input textarea"
          rows={3}
          value={draft.roomNotes}
          placeholder={t(lang, 'roomNotesPh')}
          aria-labelledby="room-notes-label"
          onChange={(e) => patch({ roomNotes: e.target.value })}
        />
      </div>

      <div className="field">
        <div className="field-label-row">
          <span className="field-label" id="guest-notes-label">
            {t(lang, 'guestNotes')}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-compact no-print"
            onClick={() => copySection(draft.guestNotes, 'copyGuest')}
          >
            {t(lang, 'copy')}
          </button>
        </div>
        <QuickChips
          lang={lang}
          onPick={(phrase) => patch({ guestNotes: appendChipLine(draft.guestNotes, phrase) })}
        />
        <textarea
          className="input textarea"
          rows={3}
          value={draft.guestNotes}
          placeholder={t(lang, 'guestNotesPh')}
          aria-labelledby="guest-notes-label"
          onChange={(e) => patch({ guestNotes: e.target.value })}
        />
      </div>

      <Checklist
        lang={lang}
        items={draft.checklist}
        onChange={(checklist) => patch({ checklist })}
        onCopy={() => copySection(checklistToMarkdown(draft), 'copyChecklist')}
      />

      <section className="panel tips-optional no-print" aria-labelledby="tips-optional-heading">
        <div className="panel-head">
          <h2 id="tips-optional-heading" className="panel-title">
            {t(lang, 'tipsOptional')}
          </h2>
          <button
            type="button"
            className="btn btn-ghost"
            aria-expanded={tipsOpen}
            onClick={() => setTipsOpen((o) => !o)}
          >
            {tipsOpen ? t(lang, 'tipsHide') : t(lang, 'tipsShow')}
          </button>
        </div>
        <p className="muted tips-optional-hint">{t(lang, 'tipsOptionalHint')}</p>
        {tipsOpen ? (
          <TipSplit
            lang={lang}
            tipTotal={draft.tipTotal}
            tipPeople={draft.tipPeople}
            tipNote={draft.tipNote}
            onTotalChange={(tipTotal) => patch({ tipTotal })}
            onPeopleChange={(tipPeople) => patch({ tipPeople })}
            onNoteChange={(tipNote) => patch({ tipNote })}
          />
        ) : null}
      </section>
    </div>
  )
}
