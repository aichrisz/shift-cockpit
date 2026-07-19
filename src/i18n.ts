import type { Lang } from './types'

export type MessageKey =
  | 'appTitle'
  | 'newShift'
  | 'loadSample'
  | 'emptyTitle'
  | 'emptyBody'
  | 'delete'
  | 'deleteConfirm'
  | 'save'
  | 'export'
  | 'back'
  | 'shiftLabel'
  | 'date'
  | 'openPoints'
  | 'roomNotes'
  | 'guestNotes'
  | 'checklist'
  | 'addCustom'
  | 'customPlaceholder'
  | 'tips'
  | 'tipsOptional'
  | 'tipsOptionalHint'
  | 'tipsShow'
  | 'tipsHide'
  | 'tipTotal'
  | 'tipPeople'
  | 'tipNote'
  | 'perPerson'
  | 'copy'
  | 'copied'
  | 'download'
  | 'exportPreview'
  | 'noHandovers'
  | 'updated'
  | 'shiftPlaceholder'
  | 'openPointsPh'
  | 'roomNotesPh'
  | 'guestNotesPh'
  | 'langDe'
  | 'langEn'
  | 'langId'
  | 'doneCount'
  | 'cancel'
  | 'confirmDelete'
  | 'unsaved'
  | 'sampleLabel'
  | 'duplicate'
  | 'settings'
  | 'defaultShift'
  | 'defaultShiftPh'
  | 'print'
  | 'chooseTemplate'
  | 'templateBlank'
  | 'templateFrueh'
  | 'templateNacht'
  | 'templateSpaet'
  | 'quickChips'
  | 'filterToday'
  | 'filter7d'
  | 'filterAll'
  | 'filterEmpty'
  | 'filterShowAll'
  | 'share'
  | 'shareUnavailable'
  | 'wipeOlder'
  | 'wipeDays'
  | 'wipePreview'
  | 'wipeConfirm'
  | 'wipeDone'
  | 'wipeNone'
  | 'roomNumberPh'
  | 'roomAdd'
  | 'pin'
  | 'unpin'
  | 'activeBadge'
  | 'copySection'
  | 'copyOpen'
  | 'copyRoom'
  | 'copyGuest'
  | 'copyChecklist'
  | 'dirtyLeaveConfirm'
  | 'optional'
  | 'search'
  | 'searchPh'
  | 'searchEmpty'
  | 'checklistOpen'
  | 'checklistComplete'
  | 'markReady'
  | 'readyPhrase'
  | 'chipsMore'
  | 'chipsLess'
  | 'compactUi'
  | 'compactUiHint'
  | 'confirm'
  | 'confirmTitle'
  | 'wipeTitle'
  | 'leaveTitle'
  | 'undo'
  | 'dismiss'
  | 'undoDeleted'
  | 'undoWiped'
  | 'undoMarkReady'
  | 'haptics'
  | 'hapticsHint'
  | 'exportCompact'
  | 'exportCompactHint'
  | 'emptyNoneTitle'
  | 'emptyNoneBody'
  | 'emptyFilterTitle'
  | 'emptyFilterBody'
  | 'emptySearchTitle'
  | 'emptySearchBody'
  | 'clearSearch'
  | 'printedAt'
  | 'finishShift'
  | 'finishWizardTitle'
  | 'finishStepIncomplete'
  | 'finishStepPin'
  | 'finishStepDone'
  | 'finishOpenCount'
  | 'finishNoOpen'
  | 'finishMarkAllReady'
  | 'finishPinAsActive'
  | 'finishAlreadyPinned'
  | 'finishKeepPin'
  | 'finishNext'
  | 'finishBack'
  | 'finishDone'
  | 'finishExport'
  | 'filterIncomplete'
  | 'continueLast'
  | 'printProfile'
  | 'printProfileNormal'
  | 'printProfileCompact'
  | 'printProfileHint'
  | 'backup'
  | 'backupExport'
  | 'backupImport'
  | 'backupNever'
  | 'backupLast'
  | 'backupNudge'
  | 'backupDone'
  | 'backupImportTitle'
  | 'backupImportConfirm'
  | 'backupImportInvalid'
  | 'backupImportDone'
  | 'emptyIncompleteTitle'
  | 'emptyIncompleteBody'
  | 'clearIncompleteFilter'
  | 'roomDuplicate'
  | 'shiftLabelChips'
  | 'handedOverBy'
  | 'takenOverBy'
  | 'printSignatures'
  | 'appVersion'
  | 'whatsNew'
  | 'whatsNew1'
  | 'whatsNew2'
  | 'whatsNew3'
  | 'whatsNew4'
  | 'whatsNew5'
  | 'open'
  | 'chooseTemplates'
  | 'defaultTemplate'
  | 'defaultTemplateHint'
  | 'defaultTemplateNone'
  | 'defaultBadge'
  | 'printHotelLine'
  | 'printHotelLinePh'
  | 'printHotelLineHint'
  | 'resetChecks'
  | 'resetChecksTitle'
  | 'resetChecksConfirm'

const de: Record<MessageKey, string> = {
  appTitle: 'Shift Cockpit',
  newShift: 'Neue Schicht',
  loadSample: 'Beispiel laden',
  emptyTitle: 'Noch keine Übergaben',
  emptyBody: 'Lege deine erste Schicht-Übergabe an — offline, auf dem Handy.',
  delete: 'Löschen',
  deleteConfirm: 'Diese Übergabe wirklich löschen?',
  save: 'Speichern',
  export: 'Export',
  back: 'Zurück',
  shiftLabel: 'Schicht',
  date: 'Datum',
  openPoints: 'Offene Punkte',
  roomNotes: 'Zimmer-Hinweise',
  guestNotes: 'Beschwerden',
  checklist: 'Checkliste',
  addCustom: 'Hinzufügen',
  customPlaceholder: 'Eigener Punkt…',
  tips: 'Trinkgeld',
  tipsOptional: 'Trinkgeld (optional)',
  tipsOptionalHint: 'Nur bei Bedarf — standardmäßig ausgeblendet.',
  tipsShow: 'Anzeigen',
  tipsHide: 'Ausblenden',
  optional: 'optional',
  tipTotal: 'Gesamt',
  tipPeople: 'Personen',
  tipNote: 'Notiz',
  perPerson: 'Pro Person',
  copy: 'Kopieren',
  copied: 'Kopiert!',
  download: 'Download .md',
  exportPreview: 'Markdown-Vorschau',
  noHandovers: 'Keine Übergaben',
  updated: 'Aktualisiert',
  shiftPlaceholder: 'z. B. Frühschicht / Nacht',
  openPointsPh: 'Was war noch offen beim Gehen?',
  roomNotesPh: 'Zimmer mit Follow-up…',
  guestNotesPh: 'Lärm, Reklamation, offene Beschwerden…',
  langDe: 'DE',
  langEn: 'EN',
  langId: 'ID',
  doneCount: 'erledigt',
  cancel: 'Abbrechen',
  confirmDelete: 'Löschen bestätigen',
  unsaved: 'Nicht gespeichert',
  sampleLabel: 'Beispiel-Nachtschicht',
  duplicate: 'Duplizieren',
  settings: 'Einstellungen',
  defaultShift: 'Standard-Schicht',
  defaultShiftPh: 'z. B. Frühschicht',
  print: 'Drucken',
  chooseTemplate: 'Vorlage wählen',
  templateBlank: 'Leer',
  templateFrueh: 'Früh',
  templateNacht: 'Nacht',
  templateSpaet: 'Spät',
  quickChips: 'Schnelltext',
  filterToday: 'Heute',
  filter7d: '7 Tage',
  filterAll: 'Alle',
  filterEmpty: 'Keine Übergaben in diesem Zeitraum.',
  filterShowAll: 'Alle anzeigen',
  share: 'Teilen',
  shareUnavailable: 'Teilen nicht verfügbar — in Zwischenablage kopiert.',
  wipeOlder: 'Ältere Übergaben löschen',
  wipeDays: 'Älter als (Tage)',
  wipePreview: '{n} Übergabe(n) älter als {d} Tage',
  wipeConfirm: '{n} Übergabe(n) älter als {d} Tage unwiderruflich löschen?',
  wipeDone: '{n} gelöscht',
  wipeNone: 'Keine älteren Übergaben',
  roomNumberPh: 'Zi. Nr.',
  roomAdd: 'Zi. +',
  pin: 'Anheften',
  unpin: 'Lösen',
  activeBadge: 'Aktiv',
  copySection: 'Abschnitt kopieren',
  copyOpen: 'Offene Punkte',
  copyRoom: 'Zimmer',
  copyGuest: 'Beschwerden',
  copyChecklist: 'Checkliste',
  dirtyLeaveConfirm: 'Ungespeicherte Änderungen verwerfen?',
  search: 'Suche',
  searchPh: 'Übergaben durchsuchen…',
  searchEmpty: 'Keine Treffer für diese Suche.',
  checklistOpen: 'Offen',
  checklistComplete: 'Fertig',
  markReady: 'Übergabe bereit',
  readyPhrase: 'Übergabe bereit',
  chipsMore: 'Mehr',
  chipsLess: 'Weniger',
  compactUi: 'Kompakte Ansicht',
  compactUiHint: 'Weniger Abstand und dichtere Karten auf dem Handy.',
  confirm: 'Bestätigen',
  confirmTitle: 'Bestätigen',
  wipeTitle: 'Ältere löschen',
  leaveTitle: 'Verlassen?',
  undo: 'Rückgängig',
  dismiss: 'Schließen',
  undoDeleted: 'Übergabe gelöscht',
  undoWiped: '{n} ältere gelöscht',
  undoMarkReady: 'Als bereit markiert',
  haptics: 'Haptik',
  hapticsHint: 'Kurze Vibration bei Speichern, Anheften und Kopieren (wenn unterstützt).',
  exportCompact: 'Kompakter Export',
  exportCompactHint: 'Nur offene Punkte (+ Zimmer/Beschwerden falls ausgefüllt) — ohne Checkliste und Trinkgeld.',
  emptyNoneTitle: 'Noch keine Übergaben',
  emptyNoneBody: 'Lege deine erste Schicht-Übergabe an — offline, auf dem Handy.',
  emptyFilterTitle: 'Nichts in diesem Zeitraum',
  emptyFilterBody: 'In diesem Filter gibt es keine Übergaben. Zeige alle oder lege eine neue an.',
  emptySearchTitle: 'Keine Treffer',
  emptySearchBody: 'Keine Übergabe passt zu dieser Suche. Suchbegriff löschen oder neu formulieren.',
  clearSearch: 'Suche löschen',
  printedAt: 'Gedruckt',
  finishShift: 'Schicht beenden',
  finishWizardTitle: 'Schicht-Abschluss',
  finishStepIncomplete: 'Offene Punkte',
  finishStepPin: 'Anheften',
  finishStepDone: 'Export & Teilen',
  finishOpenCount: '{n} offene Checklisten-Punkte',
  finishNoOpen: 'Alle Checklisten-Punkte erledigt.',
  finishMarkAllReady: 'Alles als bereit markieren',
  finishPinAsActive: 'Als aktive Schicht anheften',
  finishAlreadyPinned: 'Diese Übergabe ist bereits aktiv angeheftet.',
  finishKeepPin: 'Aktuelle Anheftung behalten',
  finishNext: 'Weiter',
  finishBack: 'Zurück',
  finishDone: 'Fertig',
  finishExport: 'Zur Export-Ansicht',
  filterIncomplete: 'Unvollständig',
  continueLast: 'Letzte Schicht fortsetzen',
  printProfile: 'Druckprofil',
  printProfileNormal: 'Normal',
  printProfileCompact: 'Kompakt',
  printProfileHint: 'Normal: komfortable Ränder. Kompakt: dichter auf A4.',
  backup: 'Backup',
  backupExport: 'Backup JSON exportieren',
  backupImport: 'Backup importieren',
  backupNever: 'Noch kein Backup',
  backupLast: 'Letztes Backup: {when}',
  backupNudge: 'Lokales Backup empfohlen (länger als 7 Tage oder nie).',
  backupDone: 'Backup gespeichert',
  backupImportTitle: 'Backup wiederherstellen?',
  backupImportConfirm:
    'Alle aktuellen Übergaben und Einstellungen durch die Backup-Datei ersetzen? Nicht rückgängig.',
  backupImportInvalid: 'Ungültige Backup-Datei',
  backupImportDone: 'Backup wiederhergestellt',
  emptyIncompleteTitle: 'Keine unvollständigen',
  emptyIncompleteBody:
    'Keine Übergabe mit offenen Checklisten-Punkten. Filter ausschalten oder alle anzeigen.',
  clearIncompleteFilter: 'Filter aus',
  roomDuplicate: 'Zimmer {room} ist bereits gelistet',
  shiftLabelChips: 'Schicht-Schnellwahl',
  handedOverBy: 'Übergeben von:',
  takenOverBy: 'Übernommen von:',
  printSignatures: 'Unterschriften',
  appVersion: 'Version {v}',
  whatsNew: 'Neu in dieser Version',
  whatsNew1: 'Listen-Karten: Anheften, Duplizieren, Öffnen, Löschen mit Bestätigung',
  whatsNew2: 'Standard-Vorlage: Neue Schicht startet direkt; „Vorlagen…“ öffnet den Picker',
  whatsNew3: 'Druck: optionale Hotel-/Stationszeile im Kopf',
  whatsNew4: 'Checkliste zurücksetzen — erledigt-Haken weg, Labels bleiben',
  whatsNew5: 'Home-Fußzeile mit Versionsnummer',
  open: 'Öffnen',
  chooseTemplates: 'Vorlagen…',
  defaultTemplate: 'Standard-Vorlage',
  defaultTemplateHint:
    'Neue Schicht nutzt diese Vorlage sofort. „Vorlagen…“ auf der Liste öffnet immer den Picker.',
  defaultTemplateNone: 'Keine (Picker)',
  defaultBadge: 'Standard',
  printHotelLine: 'Hotel / Station (Druck)',
  printHotelLinePh: 'z. B. Front Office · Station 1',
  printHotelLineHint: 'Optional auf dem Druckbogen unter dem Markennamen (max. 80 Zeichen).',
  resetChecks: 'Checks zurücksetzen',
  resetChecksTitle: 'Checks zurücksetzen?',
  resetChecksConfirm:
    'Alle erledigt-Haken entfernen? Labels und Notizen bleiben erhalten.',
}

const en: Record<MessageKey, string> = {
  appTitle: 'Shift Cockpit',
  newShift: 'New shift',
  loadSample: 'Load sample',
  emptyTitle: 'No handovers yet',
  emptyBody: 'Create your first shift handover — offline, phone-first.',
  delete: 'Delete',
  deleteConfirm: 'Delete this handover?',
  save: 'Save',
  export: 'Export',
  back: 'Back',
  shiftLabel: 'Shift',
  date: 'Date',
  openPoints: 'Open points',
  roomNotes: 'Room notes',
  guestNotes: 'Complaints',
  checklist: 'Checklist',
  addCustom: 'Add',
  customPlaceholder: 'Custom item…',
  tips: 'Tips',
  tipsOptional: 'Tips (optional)',
  tipsOptionalHint: 'Only if needed — hidden by default.',
  tipsShow: 'Show',
  tipsHide: 'Hide',
  optional: 'optional',
  tipTotal: 'Total',
  tipPeople: 'People',
  tipNote: 'Note',
  perPerson: 'Per person',
  copy: 'Copy',
  copied: 'Copied!',
  download: 'Download .md',
  exportPreview: 'Markdown preview',
  noHandovers: 'No handovers',
  updated: 'Updated',
  shiftPlaceholder: 'e.g. Morning / Night',
  openPointsPh: 'What was still open when you left?',
  roomNotesPh: 'Rooms needing follow-up…',
  guestNotesPh: 'Noise, complaints, open issues…',
  langDe: 'DE',
  langEn: 'EN',
  langId: 'ID',
  doneCount: 'done',
  cancel: 'Cancel',
  confirmDelete: 'Confirm delete',
  unsaved: 'Unsaved',
  sampleLabel: 'Sample evening shift',
  duplicate: 'Duplicate',
  settings: 'Settings',
  defaultShift: 'Default shift',
  defaultShiftPh: 'e.g. Morning',
  print: 'Print',
  chooseTemplate: 'Choose template',
  templateBlank: 'Blank',
  templateFrueh: 'Morning',
  templateNacht: 'Night',
  templateSpaet: 'Late',
  quickChips: 'Quick phrases',
  filterToday: 'Today',
  filter7d: '7 days',
  filterAll: 'All',
  filterEmpty: 'No handovers in this range.',
  filterShowAll: 'Show all',
  share: 'Share',
  shareUnavailable: 'Share unavailable — copied to clipboard.',
  wipeOlder: 'Delete older handovers',
  wipeDays: 'Older than (days)',
  wipePreview: '{n} handover(s) older than {d} days',
  wipeConfirm: 'Permanently delete {n} handover(s) older than {d} days?',
  wipeDone: '{n} deleted',
  wipeNone: 'No older handovers',
  roomNumberPh: 'Rm. no.',
  roomAdd: 'Rm. +',
  pin: 'Pin',
  unpin: 'Unpin',
  activeBadge: 'Active',
  copySection: 'Copy section',
  copyOpen: 'Open points',
  copyRoom: 'Rooms',
  copyGuest: 'Complaints',
  copyChecklist: 'Checklist',
  dirtyLeaveConfirm: 'Discard unsaved changes?',
  search: 'Search',
  searchPh: 'Search handovers…',
  searchEmpty: 'No matches for this search.',
  checklistOpen: 'Open',
  checklistComplete: 'Done',
  markReady: 'Handover ready',
  readyPhrase: 'Handover ready',
  chipsMore: 'More',
  chipsLess: 'Less',
  compactUi: 'Compact layout',
  compactUiHint: 'Tighter spacing and denser cards on phone.',
  confirm: 'Confirm',
  confirmTitle: 'Confirm',
  wipeTitle: 'Delete older',
  leaveTitle: 'Leave?',
  undo: 'Undo',
  dismiss: 'Dismiss',
  undoDeleted: 'Handover deleted',
  undoWiped: '{n} older deleted',
  undoMarkReady: 'Marked ready',
  haptics: 'Haptics',
  hapticsHint: 'Short vibrate on save, pin, and copy when supported.',
  exportCompact: 'Compact export',
  exportCompactHint: 'Open points only (+ rooms/complaints if filled) — no checklist or tips.',
  emptyNoneTitle: 'No handovers yet',
  emptyNoneBody: 'Create your first shift handover — offline, phone-first.',
  emptyFilterTitle: 'Nothing in this range',
  emptyFilterBody: 'No handovers match this filter. Show all or create a new one.',
  emptySearchTitle: 'No matches',
  emptySearchBody: 'No handover matches this search. Clear the query or try different words.',
  clearSearch: 'Clear search',
  printedAt: 'Printed',
  finishShift: 'Finish shift',
  finishWizardTitle: 'End of shift',
  finishStepIncomplete: 'Open items',
  finishStepPin: 'Pin',
  finishStepDone: 'Export & share',
  finishOpenCount: '{n} open checklist item(s)',
  finishNoOpen: 'All checklist items are done.',
  finishMarkAllReady: 'Mark all ready',
  finishPinAsActive: 'Pin as active shift',
  finishAlreadyPinned: 'This handover is already pinned as active.',
  finishKeepPin: 'Keep current pin',
  finishNext: 'Next',
  finishBack: 'Back',
  finishDone: 'Done',
  finishExport: 'Open export view',
  filterIncomplete: 'Incomplete',
  continueLast: 'Continue last shift',
  printProfile: 'Print profile',
  printProfileNormal: 'Normal',
  printProfileCompact: 'Compact',
  printProfileHint: 'Normal: comfortable margins. Compact: denser on A4.',
  backup: 'Backup',
  backupExport: 'Export backup JSON',
  backupImport: 'Import backup',
  backupNever: 'Never backed up',
  backupLast: 'Last backup: {when}',
  backupNudge: 'Local backup recommended (never or older than 7 days).',
  backupDone: 'Backup saved',
  backupImportTitle: 'Restore backup?',
  backupImportConfirm:
    'Replace all current handovers and settings with this backup file? This cannot be undone.',
  backupImportInvalid: 'Invalid backup file',
  backupImportDone: 'Backup restored',
  emptyIncompleteTitle: 'No incomplete',
  emptyIncompleteBody:
    'No handover has open checklist items. Turn off the filter or show all.',
  clearIncompleteFilter: 'Clear filter',
  roomDuplicate: 'Room {room} already listed',
  shiftLabelChips: 'Quick shift labels',
  handedOverBy: 'Handed over by:',
  takenOverBy: 'Taken over by:',
  printSignatures: 'Signatures',
  appVersion: 'Version {v}',
  whatsNew: "What's new",
  whatsNew1: 'List cards: pin, duplicate, open, delete with confirm',
  whatsNew2: 'Default template: New starts immediately; “Templates…” always opens the picker',
  whatsNew3: 'Print: optional hotel / station line in the header',
  whatsNew4: 'Reset checks — clear done flags, keep labels',
  whatsNew5: 'Home footer with version number',
  open: 'Open',
  chooseTemplates: 'Templates…',
  defaultTemplate: 'Default template',
  defaultTemplateHint:
    'New shift uses this template immediately. “Templates…” on the list always opens the picker.',
  defaultTemplateNone: 'None (picker)',
  defaultBadge: 'Default',
  printHotelLine: 'Hotel / station (print)',
  printHotelLinePh: 'e.g. Front Office · Station 1',
  printHotelLineHint: 'Optional on the print sheet under the brand (max. 80 characters).',
  resetChecks: 'Reset checks',
  resetChecksTitle: 'Reset checks?',
  resetChecksConfirm: 'Clear all done checkmarks? Labels and notes stay.',
}

const id: Record<MessageKey, string> = {
  appTitle: 'Shift Cockpit',
  newShift: 'Shift baru',
  loadSample: 'Muat contoh',
  emptyTitle: 'Belum ada serah terima',
  emptyBody: 'Buat serah terima shift pertama — offline, di HP.',
  delete: 'Hapus',
  deleteConfirm: 'Hapus serah terima ini?',
  save: 'Simpan',
  export: 'Ekspor',
  back: 'Kembali',
  shiftLabel: 'Shift',
  date: 'Tanggal',
  openPoints: 'Poin terbuka',
  roomNotes: 'Catatan kamar',
  guestNotes: 'Keluhan',
  checklist: 'Checklist',
  addCustom: 'Tambah',
  customPlaceholder: 'Item kustom…',
  tips: 'Tip',
  tipsOptional: 'Tip (opsional)',
  tipsOptionalHint: 'Hanya jika perlu — default disembunyikan.',
  tipsShow: 'Tampilkan',
  tipsHide: 'Sembunyikan',
  optional: 'opsional',
  tipTotal: 'Total',
  tipPeople: 'Orang',
  tipNote: 'Catatan',
  perPerson: 'Per orang',
  copy: 'Salin',
  copied: 'Tersalin!',
  download: 'Unduh .md',
  exportPreview: 'Pratinjau Markdown',
  noHandovers: 'Tidak ada serah terima',
  updated: 'Diperbarui',
  shiftPlaceholder: 'mis. Pagi / Malam',
  openPointsPh: 'Apa yang masih terbuka saat pulang?',
  roomNotesPh: 'Kamar yang perlu follow-up…',
  guestNotesPh: 'Kebisingan, keluhan, isu terbuka…',
  langDe: 'DE',
  langEn: 'EN',
  langId: 'ID',
  doneCount: 'selesai',
  cancel: 'Batal',
  confirmDelete: 'Konfirmasi hapus',
  unsaved: 'Belum disimpan',
  sampleLabel: 'Contoh shift malam',
  duplicate: 'Duplikat',
  settings: 'Pengaturan',
  defaultShift: 'Shift default',
  defaultShiftPh: 'mis. Pagi',
  print: 'Cetak',
  chooseTemplate: 'Pilih template',
  templateBlank: 'Kosong',
  templateFrueh: 'Pagi',
  templateNacht: 'Malam',
  templateSpaet: 'Sore',
  quickChips: 'Frasa cepat',
  filterToday: 'Hari ini',
  filter7d: '7 hari',
  filterAll: 'Semua',
  filterEmpty: 'Tidak ada serah terima di rentang ini.',
  filterShowAll: 'Tampilkan semua',
  share: 'Bagikan',
  shareUnavailable: 'Bagikan tidak tersedia — disalin ke papan klip.',
  wipeOlder: 'Hapus serah terima lama',
  wipeDays: 'Lebih dari (hari)',
  wipePreview: '{n} serah terima lebih dari {d} hari',
  wipeConfirm: 'Hapus permanen {n} serah terima lebih dari {d} hari?',
  wipeDone: '{n} dihapus',
  wipeNone: 'Tidak ada yang lebih lama',
  roomNumberPh: 'No. Km.',
  roomAdd: 'Km. +',
  pin: 'Sematkan',
  unpin: 'Lepas',
  activeBadge: 'Aktif',
  copySection: 'Salin bagian',
  copyOpen: 'Poin terbuka',
  copyRoom: 'Kamar',
  copyGuest: 'Keluhan',
  copyChecklist: 'Checklist',
  dirtyLeaveConfirm: 'Buang perubahan yang belum disimpan?',
  search: 'Cari',
  searchPh: 'Cari serah terima…',
  searchEmpty: 'Tidak ada hasil untuk pencarian ini.',
  checklistOpen: 'Terbuka',
  checklistComplete: 'Selesai',
  markReady: 'Serah terima siap',
  readyPhrase: 'Serah terima siap',
  chipsMore: 'Lainnya',
  chipsLess: 'Sedikit',
  compactUi: 'Tampilan ringkas',
  compactUiHint: 'Jarak lebih rapat dan kartu lebih padat di HP.',
  confirm: 'Konfirmasi',
  confirmTitle: 'Konfirmasi',
  wipeTitle: 'Hapus yang lama',
  leaveTitle: 'Keluar?',
  undo: 'Urungkan',
  dismiss: 'Tutup',
  undoDeleted: 'Serah terima dihapus',
  undoWiped: '{n} yang lama dihapus',
  undoMarkReady: 'Ditandai siap',
  haptics: 'Haptik',
  hapticsHint: 'Getar singkat saat simpan, semat, dan salin jika didukung.',
  exportCompact: 'Ekspor ringkas',
  exportCompactHint: 'Hanya poin terbuka (+ kamar/keluhan jika diisi) — tanpa checklist atau tip.',
  emptyNoneTitle: 'Belum ada serah terima',
  emptyNoneBody: 'Buat serah terima shift pertama — offline, di HP.',
  emptyFilterTitle: 'Kosong di rentang ini',
  emptyFilterBody: 'Tidak ada serah terima di filter ini. Tampilkan semua atau buat baru.',
  emptySearchTitle: 'Tidak ada hasil',
  emptySearchBody: 'Tidak ada yang cocok dengan pencarian. Hapus kata kunci atau coba lagi.',
  clearSearch: 'Hapus pencarian',
  printedAt: 'Dicetak',
  finishShift: 'Akhiri shift',
  finishWizardTitle: 'Akhir shift',
  finishStepIncomplete: 'Item terbuka',
  finishStepPin: 'Sematkan',
  finishStepDone: 'Ekspor & bagikan',
  finishOpenCount: '{n} item checklist terbuka',
  finishNoOpen: 'Semua item checklist selesai.',
  finishMarkAllReady: 'Tandai semua siap',
  finishPinAsActive: 'Sematkan sebagai shift aktif',
  finishAlreadyPinned: 'Serah terima ini sudah disematkan sebagai aktif.',
  finishKeepPin: 'Pertahankan sematan saat ini',
  finishNext: 'Lanjut',
  finishBack: 'Kembali',
  finishDone: 'Selesai',
  finishExport: 'Buka tampilan ekspor',
  filterIncomplete: 'Belum lengkap',
  continueLast: 'Lanjutkan shift terakhir',
  printProfile: 'Profil cetak',
  printProfileNormal: 'Normal',
  printProfileCompact: 'Ringkas',
  printProfileHint: 'Normal: margin nyaman. Ringkas: lebih padat di A4.',
  backup: 'Cadangan',
  backupExport: 'Ekspor cadangan JSON',
  backupImport: 'Impor cadangan',
  backupNever: 'Belum pernah cadangan',
  backupLast: 'Cadangan terakhir: {when}',
  backupNudge: 'Cadangan lokal disarankan (belum pernah atau >7 hari).',
  backupDone: 'Cadangan disimpan',
  backupImportTitle: 'Pulihkan cadangan?',
  backupImportConfirm:
    'Ganti semua serah terima dan pengaturan dengan file cadangan ini? Tidak bisa dibatalkan.',
  backupImportInvalid: 'File cadangan tidak valid',
  backupImportDone: 'Cadangan dipulihkan',
  emptyIncompleteTitle: 'Tidak ada yang belum lengkap',
  emptyIncompleteBody:
    'Tidak ada serah terima dengan checklist terbuka. Matikan filter atau tampilkan semua.',
  clearIncompleteFilter: 'Matikan filter',
  roomDuplicate: 'Kamar {room} sudah tercantum',
  shiftLabelChips: 'Label shift cepat',
  handedOverBy: 'Diserahkan oleh:',
  takenOverBy: 'Diterima oleh:',
  printSignatures: 'Tanda tangan',
  appVersion: 'Versi {v}',
  whatsNew: 'Yang baru',
  whatsNew1: 'Kartu daftar: semat, duplikat, buka, hapus dengan konfirmasi',
  whatsNew2: 'Template default: Shift baru langsung; “Template…” selalu buka pemilih',
  whatsNew3: 'Cetak: baris hotel / stasiun opsional di header',
  whatsNew4: 'Reset checklist — hapus centang, label tetap',
  whatsNew5: 'Footer beranda dengan nomor versi',
  open: 'Buka',
  chooseTemplates: 'Template…',
  defaultTemplate: 'Template default',
  defaultTemplateHint:
    'Shift baru memakai template ini langsung. “Template…” di daftar selalu membuka pemilih.',
  defaultTemplateNone: 'Tidak ada (pemilih)',
  defaultBadge: 'Default',
  printHotelLine: 'Hotel / stasiun (cetak)',
  printHotelLinePh: 'mis. Front Office · Stasiun 1',
  printHotelLineHint: 'Opsional di lembar cetak di bawah merek (maks. 80 karakter).',
  resetChecks: 'Reset checklist',
  resetChecksTitle: 'Reset checklist?',
  resetChecksConfirm: 'Hapus semua centang selesai? Label dan catatan tetap.',
}

const catalogs: Record<Lang, Record<MessageKey, string>> = { de, en, id }

export function t(lang: Lang, key: MessageKey): string {
  return catalogs[lang][key] ?? catalogs.en[key] ?? key
}

/** Simple `{n}` / `{d}` placeholder fill for wipe strings. */
export function tf(
  lang: Lang,
  key: MessageKey,
  vars: Record<string, string | number>,
): string {
  let s = t(lang, key)
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{${k}}`, String(v))
  }
  return s
}
