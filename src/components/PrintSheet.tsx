import type { Lang, PrintProfile, ShiftHandover } from '../types'
import { t } from '../i18n'
import {
  exportLabels,
  formatExportUpdated,
  formatPrintStamp,
  tipSummaryLine,
} from '../lib/exportMd'

interface PrintSheetProps {
  lang: Lang
  handover: ShiftHandover
  /** Content compact (hide checklist/tips) — exportCompact setting. */
  compact?: boolean
  /** Layout density for print media. Default normal. */
  printProfile?: PrintProfile
  /** When true, show on screen as well (export preview). Default print-only. */
  visibleOnScreen?: boolean
}

function NoteBody({ text }: { text: string }) {
  const trimmed = text.trim()
  if (!trimmed) {
    return <p className="print-empty">—</p>
  }
  const lines = trimmed.split('\n')
  return (
    <div className="print-notes">
      {lines.map((line, i) => {
        const isBullet = /^\s*[-*•]\s+/.test(line)
        const body = isBullet ? line.replace(/^\s*[-*•]\s+/, '') : line
        if (!line.trim()) {
          return <div key={i} className="print-note-gap" />
        }
        return (
          <p key={i} className={isBullet ? 'print-bullet' : 'print-line'}>
            {isBullet ? <span className="print-bullet-mark">–</span> : null}
            {body || '\u00a0'}
          </p>
        )
      })}
    </div>
  )
}

/**
 * Structured A4 handover sheet for Drucken. Prefer this over raw markdown print.
 */
export function PrintSheet({
  lang,
  handover,
  compact = false,
  printProfile = 'normal',
  visibleOnScreen = false,
}: PrintSheetProps) {
  const L = exportLabels(lang, handover.lang)
  const tipLine = compact ? null : tipSummaryLine(handover, lang)
  const stamp = formatPrintStamp(lang)
  const profile = printProfile === 'compact' ? 'compact' : 'normal'

  return (
    <article
      className={`print-sheet${visibleOnScreen ? '' : ' print-only'}${
        profile === 'compact' ? ' is-print-compact' : ''
      }`}
      data-print-profile={profile}
      aria-label={L.title}
    >
      <header className="print-sheet-header">
        <p className="print-brand">{t(lang, 'appTitle')}</p>
        <h1 className="print-sheet-title">{L.title}</h1>
        <p className="print-sheet-shift">
          <span className="print-date">{handover.date}</span>
          <span className="print-sep" aria-hidden="true">
            ·
          </span>
          <span className="print-shift-label">
            {handover.shiftLabel || t(lang, 'shiftLabel')}
          </span>
        </p>
        <p className="print-sheet-updated">
          {L.updated}: {formatExportUpdated(handover.updatedAt, lang)}
        </p>
      </header>

      <section className="print-section">
        <h2 className="print-h2">{L.openPoints}</h2>
        <NoteBody text={handover.openPoints} />
      </section>

      <section className="print-section">
        <h2 className="print-h2">{L.roomNotes}</h2>
        <NoteBody text={handover.roomNotes} />
      </section>

      <section className="print-section">
        <h2 className="print-h2">{L.guestNotes}</h2>
        <NoteBody text={handover.guestNotes} />
      </section>

      {!compact && (
        <section className="print-section">
          <h2 className="print-h2">{L.checklist}</h2>
          {handover.checklist.length === 0 ? (
            <p className="print-empty">{L.none}</p>
          ) : (
            <ul className="print-checklist">
              {handover.checklist.map((item) => (
                <li key={item.id} className={item.done ? 'is-done' : ''}>
                  <span className="print-box" aria-hidden="true">
                    {item.done ? '☑' : '☐'}
                  </span>
                  <span className="print-check-label">{item.label}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {!compact && tipLine && (
        <section className="print-section">
          <h2 className="print-h2">{L.tips}</h2>
          <p className="print-line">{tipLine}</p>
        </section>
      )}

      <footer className="print-sheet-footer">
        {t(lang, 'printedAt')} {stamp} · {t(lang, 'appTitle')}
      </footer>
    </article>
  )
}
