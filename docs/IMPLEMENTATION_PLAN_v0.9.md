# Shift Cockpit v0.9 — “Desk lock”

**Base:** v0.8.0 · **Approved:** Abel gas full  
**Implementer:** Grok Build CLI · Verify: Hermes  
**Quality:** design / implement / check-work · zero new deps

## Goal
Lock daily desk UX: faster list actions, predictable New, print hotel line, checklist reset, subtle version on home. Local-first, brand **Shift Cockpit**, DE/EN/ID.

## Ship (all five)

### 1. Quick actions on list cards
- Each handover card: overflow or always-visible compact actions:
  - Pin / Unpin
  - Duplicate
  - Finish (open finish wizard or navigate editor + wizard — prefer open editor then optional; simpler: open editor)
  - Delete (ConfirmDialog)
- Mobile-friendly: action row under card meta, `no-print`, large tap targets.
- Optional light swipe: if swipe is fragile, **action row is enough** (prefer reliable action row over flaky swipe).

### 2. Default template (Settings)
- `settings.defaultTemplateId?: TemplateId | 'blank' | null`
- When user taps **New**, open template picker **pre-highlighted** OR auto-create from default if set and setting `settings.skipTemplatePicker?: boolean` — keep simple:
  - Store `defaultTemplateId`: `'frueh' | 'spaet' | 'nacht' | 'blank' | null`
  - Template picker shows “Default” badge; New still opens picker but default is first/selected.
  - Better UX: Settings choose default; **New** uses default immediately if set, with long-press or secondary “Choose template…” for picker.  
  - Implement: **New** → if `defaultTemplateId` set → create from that template; else open picker. Secondary button or header link “Templates…” always opens picker.

### 3. Print hotel / station line
- `settings.printHotelLine?: string` (optional, max ~80 chars)
- PrintSheet header: if non-empty, show under brand / above title.
- Not personal name required — generic “Front Office · Station 1” etc.

### 4. Checklist reset for next shift
- Editor (and/or checklist panel): button **Reset checks** — all `done: false`, keep labels/ids.
- ConfirmDialog optional (soft confirm once).
- Does not clear notes.

### 5. Version on home
- List footer: muted `Shift Cockpit v{APP_VERSION}` from `src/version.ts`
- Bump **0.9.0** + What’s new bullets in Settings for v0.9

## Constraints
- package 0.9.0, README Features v0.9
- storage `shift-cockpit-v1` additive only
- zero new deps; port 8781; Pages `/shift-cockpit/`
- DE/EN/ID all new chrome

## Out
Cloud, multi-user, PMS, swipe libraries.

## Verify
- Card actions work (pin/dup/delete)
- New respects default template
- Print shows hotel line when set
- Reset checks clears done flags only
- Home shows v0.9.0
- build + build:pages green
