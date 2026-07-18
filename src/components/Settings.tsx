import { useMemo, useRef, useState } from 'react'
import type { AppData, Lang, PrintProfile, ShiftHandover } from '../types'
import { t, tf } from '../i18n'
import { countOlderThan } from '../lib/storage'
import {
  downloadBackupJson,
  formatBackupAt,
  parseBackupJson,
  shouldNudgeBackup,
} from '../lib/backup'
import { APP_VERSION, WHATS_NEW_KEYS } from '../version'
import { ConfirmDialog } from './ConfirmDialog'

interface SettingsProps {
  lang: Lang
  defaultShift: string
  compactUi: boolean
  haptics: boolean
  printProfile: PrintProfile
  lastBackupAt: string | null
  /** Full app data for backup export. */
  appData: AppData
  onDefaultShiftChange: (value: string) => void
  onCompactUiChange: (value: boolean) => void
  onHapticsChange: (value: boolean) => void
  onPrintProfileChange: (value: PrintProfile) => void
  onBackupExported: () => void
  onImportBackup: (data: AppData) => void
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
  compactUi,
  haptics,
  printProfile,
  lastBackupAt,
  appData,
  onDefaultShiftChange,
  onCompactUiChange,
  onHapticsChange,
  onPrintProfileChange,
  onBackupExported,
  onImportBackup,
  handovers,
  onWipeOlder,
}: SettingsProps) {
  const [days, setDays] = useState(DEFAULT_DAYS)
  const [status, setStatus] = useState<string | null>(null)
  const [wipeOpen, setWipeOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [pendingImport, setPendingImport] = useState<AppData | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const safeDays = clampDays(days)
  const olderCount = useMemo(
    () => countOlderThan(handovers, safeDays),
    [handovers, safeDays],
  )

  const backupLabel = formatBackupAt(lastBackupAt, lang)
  const showNudge = shouldNudgeBackup(lastBackupAt)

  function handleWipeClick() {
    const n = countOlderThan(handovers, safeDays)
    if (n === 0) {
      setStatus(t(lang, 'wipeNone'))
      return
    }
    setWipeOpen(true)
  }

  function confirmWipe() {
    const removed = onWipeOlder(safeDays)
    setStatus(tf(lang, 'wipeDone', { n: removed }))
    setWipeOpen(false)
  }

  function handleExportBackup() {
    downloadBackupJson(appData)
    onBackupExported()
    setStatus(t(lang, 'backupDone'))
  }

  function handleImportPick(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      const parsed = parseBackupJson(text)
      if (!parsed) {
        setStatus(t(lang, 'backupImportInvalid'))
        return
      }
      setPendingImport(parsed)
      setImportOpen(true)
    }
    reader.onerror = () => {
      setStatus(t(lang, 'backupImportInvalid'))
    }
    reader.readAsText(file)
  }

  function confirmImport() {
    if (!pendingImport) return
    onImportBackup(pendingImport)
    setPendingImport(null)
    setImportOpen(false)
    setStatus(t(lang, 'backupImportDone'))
    if (fileRef.current) fileRef.current.value = ''
  }

  function cancelImport() {
    setPendingImport(null)
    setImportOpen(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <section className="settings-panel no-print" aria-labelledby="settings-heading">
      <ConfirmDialog
        lang={lang}
        open={wipeOpen}
        title={t(lang, 'wipeTitle')}
        body={tf(lang, 'wipeConfirm', { n: olderCount, d: safeDays })}
        confirmLabel={t(lang, 'delete')}
        destructive
        onCancel={() => setWipeOpen(false)}
        onConfirm={confirmWipe}
      />

      <ConfirmDialog
        lang={lang}
        open={importOpen}
        title={t(lang, 'backupImportTitle')}
        body={t(lang, 'backupImportConfirm')}
        confirmLabel={t(lang, 'backupImport')}
        destructive
        onCancel={cancelImport}
        onConfirm={confirmImport}
      />

      <h2 id="settings-heading" className="visually-hidden">
        {t(lang, 'settings')}
      </h2>

      <div className="settings-about">
        <p className="settings-version" role="status">
          {tf(lang, 'appVersion', { v: APP_VERSION })}
        </p>
        <h3 className="settings-subhead settings-subhead-first">{t(lang, 'whatsNew')}</h3>
        <ul className="settings-whats-new">
          {WHATS_NEW_KEYS.map((key) => (
            <li key={key}>{t(lang, key)}</li>
          ))}
        </ul>
      </div>

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

      <label className="settings-toggle">
        <input
          type="checkbox"
          checked={compactUi}
          onChange={(e) => onCompactUiChange(e.target.checked)}
        />
        <span>
          <span className="settings-toggle-label">{t(lang, 'compactUi')}</span>
          <span className="settings-hint settings-toggle-hint">
            {t(lang, 'compactUiHint')}
          </span>
        </span>
      </label>

      <label className="settings-toggle">
        <input
          type="checkbox"
          checked={haptics}
          onChange={(e) => onHapticsChange(e.target.checked)}
        />
        <span>
          <span className="settings-toggle-label">{t(lang, 'haptics')}</span>
          <span className="settings-hint settings-toggle-hint">
            {t(lang, 'hapticsHint')}
          </span>
        </span>
      </label>

      <div className="settings-print-profile" role="group" aria-labelledby="print-profile-label">
        <span id="print-profile-label" className="field-label">
          {t(lang, 'printProfile')}
        </span>
        <p className="settings-hint">{t(lang, 'printProfileHint')}</p>
        <div className="filter-row settings-profile-row">
          <button
            type="button"
            className={`filter-chip${printProfile === 'normal' ? ' is-active' : ''}`}
            aria-pressed={printProfile === 'normal'}
            onClick={() => onPrintProfileChange('normal')}
          >
            {t(lang, 'printProfileNormal')}
          </button>
          <button
            type="button"
            className={`filter-chip${printProfile === 'compact' ? ' is-active' : ''}`}
            aria-pressed={printProfile === 'compact'}
            onClick={() => onPrintProfileChange('compact')}
          >
            {t(lang, 'printProfileCompact')}
          </button>
        </div>
      </div>

      <div className="settings-backup">
        <h3 className="settings-subhead">{t(lang, 'backup')}</h3>
        <p className="settings-hint" role="status">
          {backupLabel
            ? tf(lang, 'backupLast', { when: backupLabel })
            : t(lang, 'backupNever')}
        </p>
        {showNudge && (
          <p className="settings-nudge" role="status">
            {t(lang, 'backupNudge')}
          </p>
        )}
        <div className="settings-backup-actions">
          <button type="button" className="btn btn-secondary" onClick={handleExportBackup}>
            {t(lang, 'backupExport')}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => fileRef.current?.click()}
          >
            {t(lang, 'backupImport')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            tabIndex={-1}
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null
              handleImportPick(f)
            }}
          />
        </div>
      </div>

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
          onClick={handleWipeClick}
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
