import { useEffect, useId, useState } from 'react'
import type { Lang, ShiftHandover } from '../types'
import { t, tf } from '../i18n'
import { openChecklistItems } from '../lib/incomplete'

type Step = 0 | 1 | 2

interface FinishShiftWizardProps {
  lang: Lang
  draft: ShiftHandover
  pinned: boolean
  /** True when handover exists in storage (can pin without orphan id). */
  canPin: boolean
  onMarkReady: () => void
  onPin: () => void
  onExport: () => void
  onShare: () => void
  onPrint: () => void
  onClose: () => void
}

const STEP_KEYS = [
  'finishStepIncomplete',
  'finishStepPin',
  'finishStepDone',
] as const

/**
 * Lightweight 3-step end-of-shift ritual: incomplete → pin → export/share/print.
 */
export function FinishShiftWizard({
  lang,
  draft,
  pinned,
  canPin,
  onMarkReady,
  onPin,
  onExport,
  onShare,
  onPrint,
  onClose,
}: FinishShiftWizardProps) {
  const [step, setStep] = useState<Step>(0)
  const titleId = useId()
  const openItems = openChecklistItems(draft)
  const openCount = openItems.length

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [onClose])

  function goNext() {
    if (step < 2) setStep((s) => (s + 1) as Step)
  }

  function goBack() {
    if (step > 0) setStep((s) => (s - 1) as Step)
    else onClose()
  }

  return (
    <div
      className="finish-wizard-backdrop no-print"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="finish-wizard"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="finish-wizard-header">
          <h2 id={titleId} className="finish-wizard-title">
            {t(lang, 'finishWizardTitle')}
          </h2>
          <ol className="finish-wizard-steps" aria-label={t(lang, 'finishWizardTitle')}>
            {STEP_KEYS.map((key, i) => (
              <li
                key={key}
                className={`finish-wizard-step${step === i ? ' is-current' : ''}${
                  step > i ? ' is-done' : ''
                }`}
                aria-current={step === i ? 'step' : undefined}
              >
                <span className="finish-wizard-step-num">{i + 1}</span>
                <span className="finish-wizard-step-label">{t(lang, key)}</span>
              </li>
            ))}
          </ol>
        </header>

        <div className="finish-wizard-body">
          {step === 0 && (
            <section className="finish-wizard-panel" aria-labelledby="finish-step-0">
              <h3 id="finish-step-0" className="finish-wizard-panel-title">
                {t(lang, 'finishStepIncomplete')}
              </h3>
              {openCount === 0 ? (
                <p className="finish-wizard-copy">{t(lang, 'finishNoOpen')}</p>
              ) : (
                <>
                  <p className="finish-wizard-copy">
                    {tf(lang, 'finishOpenCount', { n: openCount })}
                  </p>
                  <ul className="finish-wizard-open-list">
                    {openItems.slice(0, 8).map((item) => (
                      <li key={item.id}>{item.label || '—'}</li>
                    ))}
                    {openCount > 8 && (
                      <li className="finish-wizard-more">+{openCount - 8}</li>
                    )}
                  </ul>
                  <button
                    type="button"
                    className="btn btn-secondary finish-wizard-action"
                    onClick={onMarkReady}
                  >
                    {t(lang, 'finishMarkAllReady')}
                  </button>
                </>
              )}
            </section>
          )}

          {step === 1 && (
            <section className="finish-wizard-panel" aria-labelledby="finish-step-1">
              <h3 id="finish-step-1" className="finish-wizard-panel-title">
                {t(lang, 'finishStepPin')}
              </h3>
              {pinned ? (
                <p className="finish-wizard-copy">{t(lang, 'finishAlreadyPinned')}</p>
              ) : canPin ? (
                <>
                  <p className="finish-wizard-copy muted">
                    {t(lang, 'finishKeepPin')}
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary finish-wizard-action"
                    onClick={onPin}
                  >
                    {t(lang, 'finishPinAsActive')}
                  </button>
                </>
              ) : (
                <p className="finish-wizard-copy muted">
                  {t(lang, 'unsaved')} — {t(lang, 'save')}
                </p>
              )}
            </section>
          )}

          {step === 2 && (
            <section className="finish-wizard-panel" aria-labelledby="finish-step-2">
              <h3 id="finish-step-2" className="finish-wizard-panel-title">
                {t(lang, 'finishStepDone')}
              </h3>
              <p className="finish-wizard-copy muted">
                {t(lang, 'exportPreview')}
              </p>
              <div className="finish-wizard-actions-grid">
                <button type="button" className="btn btn-secondary" onClick={onExport}>
                  {t(lang, 'finishExport')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onShare}>
                  {t(lang, 'share')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onPrint}>
                  {t(lang, 'print')}
                </button>
              </div>
            </section>
          )}
        </div>

        <footer className="finish-wizard-footer">
          <button type="button" className="btn btn-ghost" onClick={goBack}>
            {step === 0 ? t(lang, 'cancel') : t(lang, 'finishBack')}
          </button>
          {step < 2 ? (
            <button type="button" className="btn btn-primary" onClick={goNext}>
              {t(lang, 'finishNext')}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onClose}>
              {t(lang, 'finishDone')}
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
