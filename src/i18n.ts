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
  guestNotes: 'Gäste / Beschwerden',
  checklist: 'Checkliste',
  addCustom: 'Hinzufügen',
  customPlaceholder: 'Eigener Punkt…',
  tips: 'Trinkgeld',
  tipsOptional: 'Trinkgeld (optional)',
  tipsOptionalHint: 'Nur bei Bedarf — standardmäßig ausgeblendet.',
  tipsShow: 'Anzeigen',
  tipsHide: 'Ausblenden',
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
  guestNotesPh: 'VIP, Late Arrival, Beschwerden…',
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
  copyGuest: 'Gäste',
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
  exportCompactHint: 'Nur offene Punkte, Zimmer und Gäste — ohne Checkliste und Trinkgeld.',
  emptyNoneTitle: 'Noch keine Übergaben',
  emptyNoneBody: 'Lege deine erste Schicht-Übergabe an — offline, auf dem Handy.',
  emptyFilterTitle: 'Nichts in diesem Zeitraum',
  emptyFilterBody: 'In diesem Filter gibt es keine Übergaben. Zeige alle oder lege eine neue an.',
  emptySearchTitle: 'Keine Treffer',
  emptySearchBody: 'Keine Übergabe passt zu dieser Suche. Suchbegriff löschen oder neu formulieren.',
  clearSearch: 'Suche löschen',
  printedAt: 'Gedruckt',
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
  guestNotes: 'Guest notes',
  checklist: 'Checklist',
  addCustom: 'Add',
  customPlaceholder: 'Custom item…',
  tips: 'Tips',
  tipsOptional: 'Tips (optional)',
  tipsOptionalHint: 'Only if needed — hidden by default.',
  tipsShow: 'Show',
  tipsHide: 'Hide',
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
  guestNotesPh: 'VIP, late arrival, complaints…',
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
  copyGuest: 'Guests',
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
  exportCompactHint: 'Open points, rooms, and guests only — no checklist or tips.',
  emptyNoneTitle: 'No handovers yet',
  emptyNoneBody: 'Create your first shift handover — offline, phone-first.',
  emptyFilterTitle: 'Nothing in this range',
  emptyFilterBody: 'No handovers match this filter. Show all or create a new one.',
  emptySearchTitle: 'No matches',
  emptySearchBody: 'No handover matches this search. Clear the query or try different words.',
  clearSearch: 'Clear search',
  printedAt: 'Printed',
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
  guestNotes: 'Catatan tamu',
  checklist: 'Checklist',
  addCustom: 'Tambah',
  customPlaceholder: 'Item kustom…',
  tips: 'Tip',
  tipsOptional: 'Tip (opsional)',
  tipsOptionalHint: 'Hanya jika perlu — default disembunyikan.',
  tipsShow: 'Tampilkan',
  tipsHide: 'Sembunyikan',
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
  guestNotesPh: 'VIP, late arrival, keluhan…',
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
  copyGuest: 'Tamu',
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
  exportCompactHint: 'Hanya poin terbuka, kamar, dan tamu — tanpa checklist atau tip.',
  emptyNoneTitle: 'Belum ada serah terima',
  emptyNoneBody: 'Buat serah terima shift pertama — offline, di HP.',
  emptyFilterTitle: 'Kosong di rentang ini',
  emptyFilterBody: 'Tidak ada serah terima di filter ini. Tampilkan semua atau buat baru.',
  emptySearchTitle: 'Tidak ada hasil',
  emptySearchBody: 'Tidak ada yang cocok dengan pencarian. Hapus kata kunci atau coba lagi.',
  clearSearch: 'Hapus pencarian',
  printedAt: 'Dicetak',
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
