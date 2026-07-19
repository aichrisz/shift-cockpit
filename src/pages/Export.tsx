import { useEffect, useMemo, useState } from 'react'
import type { Lang, PrintProfile, ShiftHandover } from '../types'
import { t } from '../i18n'
import {
  copyToClipboard,
  downloadMarkdown,
  exportFilename,
  handoverToMarkdown,
} from '../lib/exportMd'
import { hapticPulse } from '../lib/haptics'
import { PrintSheet } from '../components/PrintSheet'

interface ExportProps {
  lang: Lang
  handover: ShiftHandover
  exportCompact: boolean
  printProfile: PrintProfile
  printHotelLine?: string
  haptics: boolean
  onExportCompactChange: (value: boolean) => void
  onBack: () => void
}

export function Export({
  lang,
  handover,
  exportCompact,
  printProfile,
  printHotelLine = '',
  haptics,
  onExportCompactChange,
  onBack,
}: ExportProps) {
  const markdown = useMemo(
    () => handoverToMarkdown(handover, lang, { compact: exportCompact }),
    [handover, lang, exportCompact],
  )
  const [copied, setCopied] = useState(false)
  const [shareMsg, setShareMsg] = useState<string | null>(null)

  useEffect(() => {
    document.body.classList.add('print-preview-ready')
    return () => {
      document.body.classList.remove('print-preview-ready')
    }
  }, [])

  function flashCopied(msg?: string) {
    setCopied(true)
    setShareMsg(msg ?? null)
    window.setTimeout(() => {
      setCopied(false)
      setShareMsg(null)
    }, 2200)
  }

  async function handleCopy() {
    const ok = await copyToClipboard(markdown)
    if (ok) {
      hapticPulse(haptics)
      flashCopied()
    }
  }

  async function handleShare() {
    const title = `${handover.shiftLabel || t(lang, 'shiftLabel')} · ${handover.date}`
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
        // User cancelled share sheet — do not treat as error
        if (err instanceof DOMException && err.name === 'AbortError') return
      }
    }

    const ok = await copyToClipboard(markdown)
    if (ok) {
      hapticPulse(haptics)
      flashCopied(t(lang, 'shareUnavailable'))
    }
  }

  function handleDownload() {
    downloadMarkdown(exportFilename(handover), markdown)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className={`export-page${exportCompact ? ' is-export-compact' : ''}`}>
      <div className="editor-toolbar no-print">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          {t(lang, 'back')}
        </button>
        <div className="toolbar-actions">
          <button type="button" className="btn btn-ghost" onClick={handlePrint}>
            {t(lang, 'print')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleShare}>
            {t(lang, 'share')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCopy}>
            {copied && !shareMsg ? t(lang, 'copied') : t(lang, 'copy')}
          </button>
          <button type="button" className="btn btn-primary" onClick={handleDownload}>
            {t(lang, 'download')}
          </button>
        </div>
      </div>

      <label className="settings-toggle export-compact-toggle no-print">
        <input
          type="checkbox"
          checked={exportCompact}
          onChange={(e) => onExportCompactChange(e.target.checked)}
        />
        <span>
          <span className="settings-toggle-label">{t(lang, 'exportCompact')}</span>
          <span className="settings-hint settings-toggle-hint">
            {t(lang, 'exportCompactHint')}
          </span>
        </span>
      </label>

      {shareMsg && (
        <p className="toast-msg no-print" role="status">
          {shareMsg}
        </p>
      )}
      {copied && !shareMsg && (
        <p className="toast-msg no-print" role="status">
          {t(lang, 'copied')}
        </p>
      )}

      <h2 className="panel-title no-print">{t(lang, 'exportPreview')}</h2>
      <pre className="md-preview no-print" tabIndex={0}>
        {markdown}
      </pre>

      <PrintSheet
        lang={lang}
        handover={handover}
        compact={exportCompact}
        printProfile={printProfile}
        printHotelLine={printHotelLine}
      />
    </div>
  )
}
