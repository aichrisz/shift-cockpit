# Shift Cockpit v0.8 — “Field harden” + Settings page

**Base:** v0.7.x · **Approved:** Abel gas Field harden + dedicated settings menu for clean home  
**Implementer:** Grok Build CLI · Verify: Hermes  
**Quality:** design / implement / check-work · zero new deps

## Goal
Field hardening + cleaner home: settings move off the list page into a dedicated view; duplicate room soft-warn; shift label chips; print signature lines; version + what’s new.

## Ship

### 0. Dedicated Settings view (Abel request) — **priority**
- New view: `{ name: 'settings' }` (alongside list / editor / export).
- **List/home** removes inline Settings panel and wipe UI; keep only:
  - Header: title, lang switcher, **Settings** button (icon/text)
  - Continue last, New, filters, search, cards
  - Soft backup nudge can stay as slim banner OR move to settings — prefer **slim one-line** on home OR only in settings. Keep home clean: **move backup nudge to settings only**.
- Settings page: all existing settings (default shift, compact UI, haptics, export compact, print profile, wipe, backup export/import) + new items below.
- Back from settings → list.
- Header: when on settings, show Back or hide New as appropriate.

### 1. Duplicate room guard
- When appending room via Zi./Rm. helper or detecting duplicate `Zi. 204` / `Rm. 204` patterns in roomNotes:
  - Soft warning toast (not block): “Zimmer 204 already listed” (i18n).
- Parse existing lines for room numbers after common prefixes.

### 2. Shift label chips
- On editor (near shiftLabel field): chips **Früh / Spät / Nacht** (lang labels) that set `shiftLabel` quickly.
- Does not change templateId unless already set; optional light set of label only.

### 3. Print signature lines
- PrintSheet footer area:
  - `Übergeben von: _______________` / `Übernommen von: _______________` (i18n DE/EN/ID)
  - Always on full print; on compact print still include (useful for paper handover).

### 4. Version + What’s new
- Settings section: **Version 0.8.0** + short “What’s new” bullets (3–5 lines) for v0.8.
- Read version from a small `src/version.ts` constant matching package.json.

### 5. Version bump
- package **0.8.0**, README Features v0.8
- storage additive only if needed (no required new fields)
- zero new deps; DE/EN/ID; brand Shift Cockpit; build + build:pages green

## Out
Cloud DB, multi-user, heavy libs.

## Verify
- Home has no full settings dump; Settings opens as own page  
- Duplicate room warns once soft  
- Chips set shift label  
- Print shows signature lines  
- Version visible in settings  
- builds green  
