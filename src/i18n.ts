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
  shiftPlaceholder: 'z. B. Frühschicht / Abend',
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
  sampleLabel: 'Beispiel-Abendschicht',
  duplicate: 'Duplizieren',
  settings: 'Einstellungen',
  defaultShift: 'Standard-Schicht',
  defaultShiftPh: 'z. B. Frühschicht',
  print: 'Drucken',
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
  shiftPlaceholder: 'e.g. Morning / Evening',
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
}

const catalogs: Record<Lang, Record<MessageKey, string>> = { de, en, id }

export function t(lang: Lang, key: MessageKey): string {
  return catalogs[lang][key] ?? catalogs.en[key] ?? key
}
