import { useEffect } from 'react'
import type { AppData, Lang, PrintProfile, ShiftHandover } from '../types'
import { t } from '../i18n'
import { Settings } from '../components/Settings'

interface SettingsPageProps {
  lang: Lang
  defaultShift: string
  compactUi: boolean
  haptics: boolean
  printProfile: PrintProfile
  lastBackupAt: string | null
  appData: AppData
  handovers: ShiftHandover[]
  onDefaultShiftChange: (value: string) => void
  onCompactUiChange: (value: boolean) => void
  onHapticsChange: (value: boolean) => void
  onPrintProfileChange: (value: PrintProfile) => void
  onBackupExported: () => void
  onImportBackup: (data: AppData) => void
  onWipeOlder: (days: number) => number
  onBack: () => void
}

export function SettingsPage({
  lang,
  defaultShift,
  compactUi,
  haptics,
  printProfile,
  lastBackupAt,
  appData,
  handovers,
  onDefaultShiftChange,
  onCompactUiChange,
  onHapticsChange,
  onPrintProfileChange,
  onBackupExported,
  onImportBackup,
  onWipeOlder,
  onBack,
}: SettingsPageProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      const el = e.target
      if (el instanceof HTMLElement) {
        const tag = el.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
        if (el.isContentEditable) return
      }
      e.preventDefault()
      onBack()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onBack])

  return (
    <div className="settings-page">
      <div className="settings-page-toolbar no-print">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          {t(lang, 'back')}
        </button>
        <h2 className="settings-page-title">{t(lang, 'settings')}</h2>
        <span className="settings-page-spacer" aria-hidden="true" />
      </div>

      <Settings
        lang={lang}
        defaultShift={defaultShift}
        compactUi={compactUi}
        haptics={haptics}
        printProfile={printProfile}
        lastBackupAt={lastBackupAt}
        appData={appData}
        onDefaultShiftChange={onDefaultShiftChange}
        onCompactUiChange={onCompactUiChange}
        onHapticsChange={onHapticsChange}
        onPrintProfileChange={onPrintProfileChange}
        onBackupExported={onBackupExported}
        onImportBackup={onImportBackup}
        handovers={handovers}
        onWipeOlder={onWipeOlder}
      />
    </div>
  )
}
