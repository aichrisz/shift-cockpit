# Shift Cockpit v0.2 — Polish + PWA lite

**Base:** v0.1.0 · **Approved:** Abel “lanjut next” 2026-07-18  
**Implementer:** Grok Build · Verify: Hermes  

## Goal
Make MVP installable on phone and slightly more “daily shift” ready. Still local-first, DE/EN/ID, brand **Shift Cockpit**.

## Ship
1. **PWA lite** — `public/manifest.webmanifest`, icons (192/512 or SVG maskable), register SW in prod with `import.meta.env.BASE_URL`, minimal offline shell for app shell.
2. **Vite base** — support `VITE_BASE` (default `/`) for GitHub Pages project path `/shift-cockpit/`.
3. **Print CSS** — `@media print` for export/editor: hide chrome, readable black text for handover sheet.
4. **Duplicate handover** — list or editor action: clone as new id, date=today, shift label keep or “ (copy)”.
5. **Default shift in settings** — already in model if present; ensure UI to edit defaultShift + persist.
6. **Version 0.2.0** + README blurb + `build:pages` script (`VITE_BASE=/shift-cockpit/` + 404.html).
7. Keep port 8781, allowedHosts true.

## Out
Cloud, multi-user, full offline sync of all data (shell only), GitHub Actions workflow file (PAT may lack workflow scope — Hermes deploys gh-pages).

## Verify
`npm run build` + `npm run build:pages` green.
