# Shift Cockpit v0.4 — “Desk ready”

**Base:** v0.3.0 · **Approved:** Abel ikut saran sensei · gas v0.4  
**Implementer:** Grok Build CLI · Verify: Hermes  
**Quality:** design / implement / check-work · zero new deps

## Goal
Operational desk UX: room prefixes, pin active handover, copy sections, dirty-leave guard, DE-friendly export header. Local-first, brand **Shift Cockpit**, DE/EN/ID.

## Ship (all five)

### 1. Room / ticket line helper
- On **roomNotes** (and optionally openPoints): compact control:
  - Number input or text for room (e.g. `204`)
  - Button **“Zi. +”** / i18n that appends a bullet line: `- Zi. 204 — ` (cursor-friendly; empty note after dash OK)
  - Use existing `asBulletLine` / append helpers; DE prefix `Zi.`, EN `Rm.`, ID `Km.` (or keep `Zi.` in all langs for hotel DE practice — prefer **lang-aware**: de=`Zi.`, en=`Rm.`, id=`Km.`)
- If room empty, no-op or focus the room field.

### 2. Pin / “active now”
- Settings or list: `settings.pinnedId?: string | null`
- List: pinned handover (if still exists) sticky top with badge “Active” / i18n
- Actions: Pin / Unpin on card or editor
- Only one pin; pinning another replaces.

### 3. Copy section
- Editor and/or Export: buttons to copy **only**:
  - openPoints
  - roomNotes
  - guestNotes
  - checklist as markdown `- [ ]` lines
- Toast/message on success (reuse existing flash patterns if any).

### 4. Dirty leave confirm
- Track dirty: draft differs from last saved snapshot (or from stored handover).
- On Back / navigate away from editor while dirty: `window.confirm` with i18n string.
- Save clears dirty. New blank starts clean after first load.

### 5. Export DE header option
- Settings toggle: `exportStyle: 'en' | 'de'` (default `de` if lang is de else match lang — or simply **follow UI lang** for section headers).
- `handoverToMarkdown(h, style)`:
  - **de:** `# Übergabe — {date} — {shiftLabel}`, sections `Offene Punkte`, `Zimmer`, `Gäste`, `Checkliste`, `Trinkgeld`
  - **en:** existing English headers
  - **id:** Indonesian headers
- Prefer: headers follow `settings.lang` (or handover.lang). Upgrade export to full i18n headers (cleaner than only DE).

### 6. Version
- package **0.4.0**, README Features v0.4
- storage key `shift-cockpit-v1` additive fields only
- `npm run build` + `build:pages` green
- Keep port 8781, Pages base `/shift-cockpit/`

## Out
Cloud, multi-user, PDF lib, new deps, PMS.

## Verify
- Zi. append works with bullets  
- Pin sorts top + persists  
- Copy section copies correct text  
- Dirty back confirms  
- Export headers match language  
