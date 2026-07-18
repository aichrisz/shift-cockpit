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
  /** Template used at create (`frueh` | `nacht` | `spaet`); blank/legacy omit. */
  templateId?: string
}

export interface Settings {
  lang: Lang
  defaultShift: string
  /** Last used shift template id (`frueh` | `nacht` | `spaet`; legacy `abend` → nacht). */
  lastTemplateId?: string
  /** Single pinned “active now” handover id, if still present. */
  pinnedId?: string | null
  /** Denser phone layout (padding/gaps). Default false. */
  compactUi?: boolean
  /** Short vibrate on key actions when supported. Default true. */
  haptics?: boolean
  /** Compact export: open points + room + guest notes only. Default false. */
  exportCompact?: boolean
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
