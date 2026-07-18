# Shift Cockpit

Local-first **hotel shift handover** notes for one trainee / front-desk shift.

Phone-first checklist: open points, room notes, guest issues, Hotelfach-style checklist, tip split, Markdown export. Data stays in the browser (`localStorage`). No login, no backend.

**UI languages:** DE · EN · ID  
**Version:** 0.7.0

## Quick start

```bash
npm install
npm run dev
```

Dev server defaults to **port 8781**.

```bash
npm run build         # production build (base /)
npm run build:pages   # GitHub Pages build (base /shift-cockpit/ + 404.html)
npm run preview       # serve dist
```

Optional base path for project pages:

```bash
VITE_BASE=/shift-cockpit/ npm run build
```

## Features (v0.7)

- **Finish shift wizard** — 3-step end-of-shift ritual: open checklist → pin active → export / share / print
- **Incomplete filter** — list chip for handovers with open checklist items (AND with history + search)
- **Continue last shift** — opens pinned handover, else most recently updated
- **Print profile** — Settings normal / compact density on PrintSheet
- **Full backup** — export AppData JSON (`shift-cockpit-YYYY-MM-DD.json`), optional import with confirm replace; soft nudge if never or older than 7 days

## Features (v0.6)

- **Undo toast** — reverse delete, wipe older, and mark-ready (~5s)
- **Haptics** — optional short vibrate on save, pin, copy (Settings)
- **Richer empty states** — none / filter / search with clear CTAs
- **Keyboard** — `n` new shift, `/` focus search, `Esc` close/back (ignored while typing)
- **Compact export** — open points + rooms + guests only (persisted)
- **Drucken upgrade** — A4 print sheet, header/footer, checkbox list, no chrome

## Features (v0.5)

- **List search** — filter handovers by label, notes, checklist (with date filter)
- **Incomplete badge** — `2/6` open vs muted complete check on cards
- **Handover ready** — one tap: all checklist done + timestamped bullet on open points
- **Template chips** — Früh / Spät / Nacht curated quick phrases + More
- **Compact mode** — denser phone layout in Settings
- **Confirm dialog** — in-app modal for delete, wipe older, dirty leave (no `window.confirm`)
- **Page transitions** — short fade/slide; respects `prefers-reduced-motion`
- **List skeleton** — brief pulse cards on first boot

## Features (v0.4)

- **Room helper** — Zi. / Rm. / Km. + number → bullet line on room notes
- **Pin active** — one pinned handover sticky at top with Active badge
- **Copy section** — copy open points, rooms, guests, or checklist alone
- **Dirty leave guard** — confirm before leaving editor with unsaved changes
- **i18n export headers** — Markdown section titles follow DE / EN / ID
- **Shift templates** — Früh / Spät / Nacht (+ blank) with specialized checklists
- **Quick chips** — one-tap handover phrases on open points & guest notes
- **History filter** — Today · Last 7 days · All
- **Share** — `navigator.share` on export, copy fallback
- **Safe wipe** — delete handovers older than N days (confirm with count)
- Create / edit / list / **duplicate** shift handovers
- Persist under key `shift-cockpit-v1` (additive settings only)
- Tip split calculator (total ÷ people)
- Export Markdown: share, copy, download `handover-YYYY-MM-DD.md`, or **print**
- Settings: **default shift** label for new handovers
- Optional **Load sample** handover (not auto-loaded)
- **PWA lite** — installable, offline app shell (service worker, prod only)
- Dark hotel-desk theme, large tap targets, print-friendly handover sheet

## Privacy

Single-device, local only. No personal name in the product chrome.

## Stack

Vite · React · TypeScript — zero runtime deps beyond React. No workbox / extra PWA packages.
