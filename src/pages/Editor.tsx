import { useEffect, useRef, useState } from 'react'
import type { Lang, PrintProfile, ShiftHandover } from '../types'
import { t } from '../i18n'
import { Checklist } from '../components/Checklist'
import { TipSplit } from '../components/TipSplit'
import { QuickChips } from '../components/QuickChips'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PrintSheet } from '../components/PrintSheet'
import { FinishShiftWizard } from '../components/FinishShiftWizard'
import { appendChipLine } from '../data/chips'
import { appendRoomLine } from '../lib/roomHelper'
import {
  checklistToMarkdown,
  copyToClipboard,
  handoverToMarkdown,
} from '../lib/exportMd'
import { applyHandoverReady } from '../lib/markReady'
import { hapticPulse } from '../lib/haptics'

interface EditorProps {
  lang: Lang
  draft: ShiftHandover
  dirty: boolean
  pinned: boolean
  /** Handover already in storage — pin + finish wizard allowed. */
  canPin: boolean
  haptics: boolean
  exportCompact: boolean
  printProfile: PrintProfile
  onChange: (next: ShiftHandover) => void
  onSave: () => void
  onExport: () => void
  onDuplicate?: () => void
  onPinToggle?: () => void
  onMarkReadyUndo?: (previous: ShiftHandover) => void
  onBack: () => void
}

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  return false
}

function cloneDraft(h: ShiftHandover): ShiftHandover {
  return { ...h, checklist: h.checklist.map((c) => ({ ...c })) }
}

export function Editor({
  lang,
  draft,
  dirty,
  pinned,
  canPin,
  haptics,
  exportCompact,
  printProfile,
  onChange,
  onSave,
  onExport,
  onDuplicate,
  onPinToggle,
  onMarkReadyUndo,
  onBack,
}: EditorProps) {
  const [roomInput, setRoomInput] = useState('')
  const [copyFlash, setCopyFlash] = useState<string | null>(null)
  /** Full status line (share fallback etc.) — not prefixed with “Copied:”. */
  const [statusFlash, setStatusFlash] = useState<string | null>(null)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const hasExistingTips =
    draft.tipTotal !== null ||
    draft.tipPeople !== null ||
    draft.tipNote.trim().length > 0
  const [tipsOpen, setTipsOpen] = useState(hasExistingTips)
  const [roomOpen, setRoomOpen] = useState(draft.roomNotes.trim().length > 0)
  const [guestOpen, setGuestOpen] = useState(draft.guestNotes.trim().length > 0)
  const roomFieldRef = useRef<HTMLInputElement>(null)

  function patch(partial: Partial<ShiftHandover>) {
    onChange({ ...draft, ...partial })
  }

  function handleBack() {
    if (dirty) {
      setLeaveOpen(true)
      return
    }
    onBack()
  }

  function handleMarkReady() {
    const previous = cloneDraft(draft)
    onChange(applyHandoverReady(draft, lang))
    hapticPulse(haptics)
    onMarkReadyUndo?.(previous)
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

  async function copySection(
    text: string,
    labelKey: 'copyOpen' | 'copyRoom' | 'copyGuest' | 'copyChecklist',
  ) {
    const ok = await copyToClipboard(text)
    if (ok) {
      hapticPulse(haptics)
      setCopyFlash(t(lang, labelKey))
      window.setTimeout(() => setCopyFlash(null), 1800)
    }
  }

  async function handleWizardShare() {
    const markdown = handoverToMarkdown(draft, lang, { compact: exportCompact })
    const title = `${draft.shiftLabel || t(lang, 'shiftLabel')} · ${draft.date}`
    const canShare =
      typeof navigator.share === 'function' &&
      (typeof navigator.canShare !== 'function' ||
        navigator.canShare({ title, text: markdown }))

    if (canShare) {
      try {
        await navigator.share({ title, text: markdown })
        hapticPulse(haptics)
        return
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
      }
    }

    const ok = await copyToClipboard(markdown)
    if (ok) {
      hapticPulse(haptics)
      setStatusFlash(t(lang, 'shareUnavailable'))
      window.setTimeout(() => setStatusFlash(null), 2200)
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (wizardOpen) return // wizard handles Esc
      if (isTypingTarget(e.target)) {
        return
      }
      if (leaveOpen) {
        e.preventDefault()
        setLeaveOpen(false)
        return
      }
      e.preventDefault()
      if (dirty) {
        setLeaveOpen(true)
      } else {
        onBack()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [leaveOpen, dirty, onBack, wizardOpen])

  return (
    <div className="editor-page">
      <ConfirmDialog
        lang={lang}
        open={leaveOpen}
        title={t(lang, 'leaveTitle')}
        body={t(lang, 'dirtyLeaveConfirm')}
        confirmLabel={t(lang, 'confirm')}
        destructive
        onCancel={() => setLeaveOpen(false)}
        onConfirm={() => {
          setLeaveOpen(false)
          onBack()
        }}
      />

      {wizardOpen && (
        <FinishShiftWizard
          lang={lang}
          draft={draft}
          pinned={pinned}
          canPin={canPin}
          onMarkReady={handleMarkReady}
          onPin={() => {
            if (onPinToggle && !pinned) onPinToggle()
          }}
          onExport={() => {
            setWizardOpen(false)
            onExport()
          }}
          onShare={() => {
            void handleWizardShare()
          }}
          onPrint={() => {
            window.print()
          }}
          onClose={() => setWizardOpen(false)}
        />
      )}

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

      <div className="ready-row no-print">
        <button type="button" className="btn btn-ready" onClick={handleMarkReady}>
          {t(lang, 'markReady')}
        </button>
        <button
          type="button"
          className="btn btn-finish"
          onClick={() => setWizardOpen(true)}
        >
          {t(lang, 'finishShift')}
        </button>
      </div>

      {copyFlash && (
        <p className="toast-msg no-print" role="status">
          {t(lang, 'copied')}: {copyFlash}
        </p>
      )}
      {statusFlash && (
        <p className="toast-msg no-print" role="status">
          {statusFlash}
        </p>
      )}

      <div className="editor-screen">
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
            templateId={draft.templateId}
            onPick={(phrase) =>
              patch({ openPoints: appendChipLine(draft.openPoints, phrase) })
            }
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

        <section className="panel notes-optional no-print" aria-labelledby="room-notes-label">
          <div className="panel-head">
            <h2 id="room-notes-label" className="panel-title">
              {t(lang, 'roomNotes')} <span className="optional-tag">({t(lang, 'optional')})</span>
            </h2>
            <button
              type="button"
              className="btn btn-ghost"
              aria-expanded={roomOpen}
              onClick={() => setRoomOpen((o) => !o)}
            >
              {roomOpen ? t(lang, 'tipsHide') : t(lang, 'tipsShow')}
            </button>
          </div>
          {roomOpen ? (
            <div className="field optional-field-body">
              <div className="field-label-row">
                <span className="sr-only">{t(lang, 'roomNotes')}</span>
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
                onChange={(e) => patch({ roomNotes: e.target.value })}
              />
            </div>
          ) : null}
        </section>

        <section className="panel notes-optional no-print" aria-labelledby="guest-notes-label">
          <div className="panel-head">
            <h2 id="guest-notes-label" className="panel-title">
              {t(lang, 'guestNotes')} <span className="optional-tag">({t(lang, 'optional')})</span>
            </h2>
            <button
              type="button"
              className="btn btn-ghost"
              aria-expanded={guestOpen}
              onClick={() => setGuestOpen((o) => !o)}
            >
              {guestOpen ? t(lang, 'tipsHide') : t(lang, 'tipsShow')}
            </button>
          </div>
          {guestOpen ? (
            <div className="field optional-field-body">
              <div className="field-label-row">
                <span className="sr-only">{t(lang, 'guestNotes')}</span>
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
                templateId={draft.templateId}
                onPick={(phrase) =>
                  patch({ guestNotes: appendChipLine(draft.guestNotes, phrase) })
                }
              />
              <textarea
                className="input textarea"
                rows={3}
                value={draft.guestNotes}
                placeholder={t(lang, 'guestNotesPh')}
                onChange={(e) => patch({ guestNotes: e.target.value })}
              />
            </div>
          ) : null}
        </section>

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

      <PrintSheet
        lang={lang}
        handover={draft}
        compact={exportCompact}
        printProfile={printProfile}
      />
    </div>
  )
}
