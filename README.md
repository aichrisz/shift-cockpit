# Shift Cockpit

Local-first **hotel shift handover** notes for one trainee / front-desk shift.

Phone-first checklist: open points, room notes, guest issues, Hotelfach-style checklist, tip split, Markdown export. Data stays in the browser (`localStorage`). No login, no backend.

**UI languages:** DE · EN · ID  
**Version:** 0.3.0

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

## Features (v0.3)

- **Shift templates** — Früh / Abend / Spät (+ blank) with specialized checklists
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
