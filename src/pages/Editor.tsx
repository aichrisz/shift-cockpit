import type { Lang, ShiftHandover } from '../types'
import { t } from '../i18n'
import { Checklist } from '../components/Checklist'
import { TipSplit } from '../components/TipSplit'

interface EditorProps {
  lang: Lang
  draft: ShiftHandover
  onChange: (next: ShiftHandover) => void
  onSave: () => void
  onExport: () => void
  onDuplicate?: () => void
  onBack: () => void
}

export function Editor({
  lang,
  draft,
  onChange,
  onSave,
  onExport,
  onDuplicate,
  onBack,
}: EditorProps) {
  function patch(partial: Partial<ShiftHandover>) {
    onChange({ ...draft, ...partial })
  }

  return (
    <div className="editor-page">
      <div className="editor-toolbar no-print">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          {t(lang, 'back')}
        </button>
        <div className="toolbar-actions">
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

      <label className="field">
        <span className="field-label">{t(lang, 'openPoints')}</span>
        <textarea
          className="input textarea"
          rows={4}
          value={draft.openPoints}
          placeholder={t(lang, 'openPointsPh')}
          onChange={(e) => patch({ openPoints: e.target.value })}
        />
      </label>

      <label className="field">
        <span className="field-label">{t(lang, 'roomNotes')}</span>
        <textarea
          className="input textarea"
          rows={3}
          value={draft.roomNotes}
          placeholder={t(lang, 'roomNotesPh')}
          onChange={(e) => patch({ roomNotes: e.target.value })}
        />
      </label>

      <label className="field">
        <span className="field-label">{t(lang, 'guestNotes')}</span>
        <textarea
          className="input textarea"
          rows={3}
          value={draft.guestNotes}
          placeholder={t(lang, 'guestNotesPh')}
          onChange={(e) => patch({ guestNotes: e.target.value })}
        />
      </label>

      <Checklist
        lang={lang}
        items={draft.checklist}
        onChange={(checklist) => patch({ checklist })}
      />

      <TipSplit
        lang={lang}
        tipTotal={draft.tipTotal}
        tipPeople={draft.tipPeople}
        tipNote={draft.tipNote}
        onTotalChange={(tipTotal) => patch({ tipTotal })}
        onPeopleChange={(tipPeople) => patch({ tipPeople })}
        onNoteChange={(tipNote) => patch({ tipNote })}
      />
    </div>
  )
}
