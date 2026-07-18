# Shift Cockpit v0.6 — “Polish desk” + Drucken upgrade

**Base:** v0.5.0 · **Approved:** Abel gas v0.6 + improve print mode  
**Implementer:** Grok Build CLI · Verify: Hermes  
**Quality:** design / implement / check-work · zero new deps

## Goal
Premium feel for daily desk use: undo, light haptics, richer empty states, keyboard, clean export options, and a **much better print (Drucken)** layout for physical handover sheets.

## Ship A — Polish desk (5)

### 1. Undo toast
- After **delete handover**, **wipe older**, and optionally **mark ready**: show toast ~5s with **Undo**.
- Keep last action payload in memory (not localStorage history stack).
- Undo restores previous handovers / checklist state.

### 2. Haptic feedback (optional)
- Settings toggle `settings.haptics` default **true** on coarse pointer / mobile if easy, else default true with ability to off.
- Short `navigator.vibrate?.(10–20)` on: save, pin, mark-ready, successful copy (guard if unsupported).

### 3. Empty states
- Distinct empty UI for: no handovers at all · filter empty · search empty.
- Friendly title + short body + primary CTA (New / Clear search / Show all).
- CSS illustration optional (simple shapes, no image deps).

### 4. Keyboard shortcuts
- `n` → new shift (list view, not when typing)
- `/` → focus search (list)
- `Esc` → close ConfirmDialog / template picker if open; else back from editor if not dirty (or open dirty confirm)
- Ignore when focus in input/textarea/select.

### 5. Export “clean” options
- On Export page (or settings): checkboxes:
  - omit empty checklist items that are unchecked? better: **omit tips** (already if empty), **omit empty sections**, **checklist only incomplete** optional
- Minimum: **Compact export**: openPoints + roomNotes + guestNotes only (no checklist/tips) for chat.
- Persist last choice in `settings.exportCompact` boolean.

## Ship B — Drucken / print upgrade (Abel)

### 6. Print stylesheet overhaul
When printing from Export (and Editor if print available):
- Hide chrome, filters, chips, toasts, dialogs (`.no-print`).
- **A4-friendly** page: `@page { size: A4; margin: 14mm; }`
- Clear header block:
  - Product line small: “Shift Cockpit”
  - Big: **Übergabe** / localized title + date + shift label
  - Updated timestamp smaller
- Sections with clear H2, enough spacing, avoid page breaks inside section headers (`break-after: avoid`).
- Checklist as clean printable list with checkbox squares (CSS or unicode ☐/☑).
- Footer line: “Printed {local datetime} · Shift Cockpit” (no personal name).
- High contrast black text on white; links not blue-heavy.
- Optional: if compact export on, print matches compact content.

### 7. Print-only polish extras
- “Print preview ready” body class when export view + media print.
- Ensure tips optional still hidden when empty.
- Room notes / bullets preserve `- ` lines with good wrapping.

## Version / constraints
- package **0.6.0**, README Features v0.6
- storage key `shift-cockpit-v1` additive (`haptics`, `exportCompact`)
- zero new deps; port 8781; Pages `/shift-cockpit/`
- DE/EN/ID for new chrome; brand **Shift Cockpit** only

## Out
PDF libraries, cloud, multi-user, heavy animation libs.

## Verify
- Undo works for delete (and wipe if implemented)
- Haptics no-op safely on desktop without vibrate
- Empty states distinct
- Shortcuts don’t fire while typing
- Compact export + full export both OK
- Print CSS: no nav chrome, A4 margins, readable DE sheet
- `npm run build` + `build:pages` green
