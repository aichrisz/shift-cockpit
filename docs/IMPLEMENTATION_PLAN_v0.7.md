# Shift Cockpit v0.7 — “Shift ritual”

**Base:** v0.6.0 · **Approved:** Abel gas full paket  
**Implementer:** Grok Build CLI · Verify: Hermes  
**Quality:** design / implement / check-work · zero new deps

## Goal
Ritual end-of-shift: guided finish, incomplete filter, reopen last, print profiles, local full-backup export. Local-first, brand **Shift Cockpit**, DE/EN/ID.

## Ship (all five)

### 1. End-of-shift wizard (3 steps)
- Entry: Editor button **“Finish shift”** / i18n (when handover saved or draft).
- Step 1: Incomplete checklist summary (count open items) + optional “Mark all ready” reuse mark-ready helper.
- Step 2: Confirm pin as active (or keep current pin) — short copy.
- Step 3: Actions: Export view · Share · Print (call existing flows).
- Lightweight modal/panel, not full router. Esc / Cancel exits wizard.
- ConfirmDialog style consistent with v0.5+.

### 2. “Incomplete only” filter
- List filter chip: **Incomplete** (checklist has items and not all done).
- Combines with history filter + search (AND logic).
- Empty state when no incomplete matches.

### 3. Quick reopen last
- Home/list: button **“Continue last shift”** when `handovers.length > 0`.
- Opens most recently **updatedAt** handover in editor (prefer pinned if set and still exists — plan: **pinned first, else latest updatedAt**).

### 4. Print profile
- Settings: `settings.printProfile: 'normal' | 'compact'`
- Apply to `PrintSheet` + `@media print` / data attribute on print root:
  - **normal**: default A4 14mm, comfortable type
  - **compact**: tighter margins (~10mm), slightly smaller type, denser sections
- Persist setting; Export print uses it.

### 5. Backup nudge (local full export)
- Settings (and optional soft banner on list if never exported):
  - `settings.lastBackupAt: string | null`
  - Button **Export backup JSON** → download `shift-cockpit-YYYY-MM-DD.json` with full `AppData` (version, settings, handovers).
  - On success set `lastBackupAt`.
  - Soft text: last backup relative/absolute or “Never”; if never or >7 days show muted nudge (no hard block).
- Import backup optional (nice): file input restore with ConfirmDialog — **include if clean**; otherwise export-only is enough for MVP of this item. Prefer **export + optional import with confirm replace**.

## Version / constraints
- package **0.7.0**, README Features v0.7
- storage `shift-cockpit-v1` additive fields only
- zero new deps; port 8781; Pages `/shift-cockpit/`
- DE/EN/ID all new chrome; brand Shift Cockpit only

## Out
Cloud, multi-user, PMS, PDF libs, heavy animation libs.

## Verify
- Wizard 3 steps + cancel  
- Incomplete filter works with search/history  
- Continue last opens correct handover  
- Print normal vs compact visibly denser  
- Backup JSON round-trip if import implemented; export always works  
- `npm run build` + `build:pages` green  
