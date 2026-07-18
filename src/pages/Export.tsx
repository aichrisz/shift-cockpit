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
  const markdown = useMemo(() => handoverToMarkdown(handover, lang), [handover, lang])
  const [copied, setCopied] = useState(false)
  const [shareMsg, setShareMsg] = useState<string | null>(null)

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
    if (ok) flashCopied()
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
        return
      } catch (err) {
        // User cancelled share sheet — do not treat as error
        if (err instanceof DOMException && err.name === 'AbortError') return
      }
    }

    const ok = await copyToClipboard(markdown)
    if (ok) flashCopied(t(lang, 'shareUnavailable'))
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
