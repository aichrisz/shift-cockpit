import { useMemo, useState } from 'react'
import type { Lang, ShiftHandover } from '../types'
import { t } from '../i18n'
import {
  copyToClipboard,
  downloadMarkdown,
  exportFilename,
  handoverToMarkdown,
} from '../lib/exportMd'

interface ExportProps {
  lang: Lang
  handover: ShiftHandover
  onBack: () => void
}

export function Export({ lang, handover, onBack }: ExportProps) {
  const markdown = useMemo(() => handoverToMarkdown(handover), [handover])
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const ok = await copyToClipboard(markdown)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleDownload() {
    downloadMarkdown(exportFilename(handover), markdown)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="export-page">
      <div className="editor-toolbar no-print">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          {t(lang, 'back')}
        </button>
        <div className="toolbar-actions">
          <button type="button" className="btn btn-ghost" onClick={handlePrint}>
            {t(lang, 'print')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCopy}>
            {copied ? t(lang, 'copied') : t(lang, 'copy')}
          </button>
          <button type="button" className="btn btn-primary" onClick={handleDownload}>
            {t(lang, 'download')}
          </button>
        </div>
      </div>

      <h2 className="panel-title no-print">{t(lang, 'exportPreview')}</h2>
      <div className="print-only print-heading">
        <h1>{t(lang, 'appTitle')}</h1>
        <p>
          {handover.shiftLabel || t(lang, 'shiftLabel')} · {handover.date}
        </p>
      </div>
      <pre className="md-preview handover-print-body" tabIndex={0}>
        {markdown}
      </pre>
    </div>
  )
}
