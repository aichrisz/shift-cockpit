import { useEffect } from 'react'
import type {
  AppData,
  DefaultTemplateId,
  Lang,
  PrintProfile,
  ShiftHandover,
} from '../types'
import { t } from '../i18n'
import { Settings } from '../components/Settings'

interface SettingsPageProps {
  lang: Lang
  defaultShift: string
  defaultTemplateId: DefaultTemplateId | null
  printHotelLine: string
  compactUi: boolean
  haptics: boolean
  printProfile: PrintProfile
  lastBackupAt: string | null
  appData: AppData
  handovers: ShiftHandover[]
  onDefaultShiftChange: (value: string) => void
  onDefaultTemplateIdChange: (value: DefaultTemplateId | null) => void
  onPrintHotelLineChange: (value: string) => void
  onCompactUiChange: (value: boolean) => void
  onHapticsChange: (value: boolean) => void
  onPrintProfileChange: (value: PrintProfile) => void
  onBackupExported: () => void
  onImportBackup: (data: AppData) => void
  onWipeOlder: (days: number) => number
  onBack: () => void
  cloudEmail: string | null
  lastSyncedAt: string | null
  cloudBusy: boolean
  cloudMessage: string | null
  onCloudSignIn: (email: string) => Promise<void>
  onCloudSignOut: () => Promise<void>
  onCloudSyncNow: () => Promise<void>
}

export function SettingsPage({
  lang,
  defaultShift,
  defaultTemplateId,
  printHotelLine,
  compactUi,
  haptics,
  printProfile,
  lastBackupAt,
  appData,
  handovers,
  onDefaultShiftChange,
  onDefaultTemplateIdChange,
  onPrintHotelLineChange,
  onCompactUiChange,
  onHapticsChange,
  onPrintProfileChange,
  onBackupExported,
  onImportBackup,
  onWipeOlder,
  onBack,
  cloudEmail,
  lastSyncedAt,
  cloudBusy,
  cloudMessage,
  onCloudSignIn,
  onCloudSignOut,
  onCloudSyncNow,
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
        defaultTemplateId={defaultTemplateId}
        printHotelLine={printHotelLine}
        compactUi={compactUi}
        haptics={haptics}
        printProfile={printProfile}
        lastBackupAt={lastBackupAt}
        appData={appData}
        onDefaultShiftChange={onDefaultShiftChange}
        onDefaultTemplateIdChange={onDefaultTemplateIdChange}
        onPrintHotelLineChange={onPrintHotelLineChange}
        onCompactUiChange={onCompactUiChange}
        onHapticsChange={onHapticsChange}
        onPrintProfileChange={onPrintProfileChange}
        onBackupExported={onBackupExported}
        onImportBackup={onImportBackup}
        handovers={handovers}
        onWipeOlder={onWipeOlder}
        cloudEmail={cloudEmail}
        lastSyncedAt={lastSyncedAt}
        cloudBusy={cloudBusy}
        cloudMessage={cloudMessage}
        onCloudSignIn={onCloudSignIn}
        onCloudSignOut={onCloudSignOut}
        onCloudSyncNow={onCloudSyncNow}
      />
    </div>
  )
}
