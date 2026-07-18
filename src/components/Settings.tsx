import { useMemo, useState } from 'react'
import type { Lang, ShiftHandover } from '../types'
import { t, tf } from '../i18n'
import { countOlderThan } from '../lib/storage'

interface SettingsProps {
  lang: Lang
  defaultShift: string
  onDefaultShiftChange: (value: string) => void
  handovers: ShiftHandover[]
  onWipeOlder: (days: number) => number
}

const MIN_DAYS = 7
const MAX_DAYS = 365
const DEFAULT_DAYS = 30

function clampDays(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_DAYS
  return Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.round(n)))
}

export function Settings({
  lang,
  defaultShift,
  onDefaultShiftChange,
  handovers,
  onWipeOlder,
}: SettingsProps) {
  const [days, setDays] = useState(DEFAULT_DAYS)
  const [status, setStatus] = useState<string | null>(null)

  const safeDays = clampDays(days)
  const olderCount = useMemo(
    () => countOlderThan(handovers, safeDays),
    [handovers, safeDays],
  )

  function handleWipe() {
    const n = countOlderThan(handovers, safeDays)
    if (n === 0) {
      setStatus(t(lang, 'wipeNone'))
      return
    }
    const ok = window.confirm(tf(lang, 'wipeConfirm', { n, d: safeDays }))
    if (!ok) return
    const removed = onWipeOlder(safeDays)
    setStatus(tf(lang, 'wipeDone', { n: removed }))
  }

  return (
    <section className="settings-panel" aria-labelledby="settings-heading">
      <h2 id="settings-heading" className="panel-title">
        {t(lang, 'settings')}
      </h2>
      <label className="field">
        <span className="field-label">{t(lang, 'defaultShift')}</span>
        <input
          type="text"
          className="input"
          value={defaultShift}
          placeholder={t(lang, 'defaultShiftPh')}
          onChange={(e) => onDefaultShiftChange(e.target.value)}
          autoComplete="off"
        />
      </label>

      <div className="settings-wipe">
        <h3 className="settings-subhead">{t(lang, 'wipeOlder')}</h3>
        <label className="field">
          <span className="field-label">{t(lang, 'wipeDays')}</span>
          <input
            type="number"
            className="input"
            min={MIN_DAYS}
            max={MAX_DAYS}
            step={1}
            value={days}
            onChange={(e) => setDays(clampDays(Number(e.target.value)))}
          />
        </label>
        <p className="settings-hint" role="status">
          {olderCount === 0
            ? t(lang, 'wipeNone')
            : tf(lang, 'wipePreview', { n: olderCount, d: safeDays })}
        </p>
        <button
          type="button"
          className="btn btn-danger-outline"
          onClick={handleWipe}
          disabled={olderCount === 0}
        >
          {t(lang, 'wipeOlder')}
        </button>
        {status && (
          <p className="settings-status" role="status">
            {status}
          </p>
        )}
      </div>
    </section>
  )
}
