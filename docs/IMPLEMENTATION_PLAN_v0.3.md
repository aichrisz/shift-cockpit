# Shift Cockpit v0.3 — “Shift day”

**Base:** v0.2.0 · **Approved:** Abel ikut saran sensei · 2026-07-18  
**Implementer:** Grok Build CLI · Verify: Hermes  
**Quality:** design / implement / check-work · zero new deps

## Goal
End-of-shift speed on phone: templates, DE chips, history filters, share, safe wipe. Local-first, brand **Shift Cockpit**, DE/EN/ID chrome.

## Ship (all five)

### 1. Shift templates
- Define templates: `frueh` | `abend` | `spaet` (ids stable).
- Each has: default `shiftLabel` per lang + **checklist preset list** per lang (not identical to generic v0.1 list — specialize lightly).
- New-shift UX: picker (3 template buttons + “Blank”) before/at create; applying template sets label + checklist (all undone).
- Optional: store last used template id in settings (`lastTemplateId?: string`).

### 2. Quick chips (handover phrases)
- On Editor for **openPoints** (and optionally guestNotes): row of chips.
- Tapping a chip **appends** phrase as a new line (if not already last line).
- Phrase catalogs DE primary with EN/ID translations in i18n or data file (~8–12 chips): e.g. cash open, VIP, complaint, late arrival, key missing, maintenance, breakfast, wake-up, taxi, group arrival.
- Chips labeled in current UI lang.

### 3. History filter (list)
- Filter control: **Today** | **Last 7 days** | **All** (default All or Today — pick **Today** on mobile-friendly default if handovers exist today else All).
- Filter by handover `date` field (YYYY-MM-DD), not only updatedAt.
- Empty filter state: short copy + clear to All.

### 4. Share
- On Export page (and optional list card action): **Share** button.
- Prefer `navigator.share({ title, text: markdown })` when available.
- Fallback: copy markdown (existing) + toast/message “Copied”.
- Do not require files permission.

### 5. Safe wipe
- Settings: “Delete handovers older than N days” — N default **30**, input 7–365.
- Confirm dialog with **count** of affected rows.
- Only deletes by `date` older than cutoff (or updatedAt if date missing — use date).
- Optional: wipe all with double confirm — **skip** unless easy; prefer age-based only.

### 6. Version / docs
- `package.json` **0.3.0**, README Features v0.3
- Keep `build:pages`, port 8781, allowedHosts, storage key `shift-cockpit-v1` (additive settings only)
- i18n keys for all new chrome strings (de/en/id)

## Out
Cloud, multi-user, PMS, PDF lib, new npm deps, GitHub Actions workflow (deploy still gh-pages from Hermes).

## Verify
- `npm run build` + `npm run build:pages` green  
- Template new shift applies checklist  
- Chips append lines  
- Filter today/7d/all works  
- Share or copy fallback  
- Wipe deletes only old rows after confirm  
