export type Lang = 'de' | 'en' | 'id'

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

export interface ShiftHandover {
  id: string
  createdAt: string
  updatedAt: string
  shiftLabel: string
  date: string
  openPoints: string
  roomNotes: string
  guestNotes: string
  checklist: ChecklistItem[]
  tipTotal: number | null
  tipPeople: number | null
  tipNote: string
  lang: Lang
}

export interface Settings {
  lang: Lang
  defaultShift: string
}

export interface AppData {
  version: 1
  settings: Settings
  handovers: ShiftHandover[]
}

export type View =
  | { name: 'list' }
  | { name: 'editor'; id: string | null }
  | { name: 'export'; id: string }
