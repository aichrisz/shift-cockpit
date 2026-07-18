# Implementation Plan — Shift Cockpit MVP v0.1

**Base:** greenfield Vite React-TS scaffold at `/root/projects/hotel-shift-cockpit`  
**Authority:** `docs/PRD.md`  
**Implementer:** Grok Build CLI · Verify: Hermes  

## Goal
Ship a phone-first **shift handover** app: list + editor + checklist + tip split + Markdown export, localStorage only.

## Ship
1. Replace default Vite demo with app shell: header “Shift Cockpit”, lang toggle DE/EN/ID, main routes or single-page with views.
2. Types + storage (`shift-cockpit-v1`) load/save/migrate safe.
3. List view: handovers sorted by updatedAt desc; New; delete with confirm; open editor.
4. Editor: shift label, date, open points, room notes, guest notes; checklist toggles + add custom item; tip total/people + computed per-person; Save / Export / Back.
5. i18n strings map for chrome + field labels + empty states (de/en/id).
6. Export: build Markdown; Copy to clipboard; download `handover-YYYY-MM-DD.md`.
7. CSS: dark hotel-desk aesthetic, mobile-first, 44px targets, no heavy deps.
8. vite `allowedHosts: true` for tunnel; version **0.1.0**; README product-focused.
9. Seed optional: 1 demo handover (button “Load sample”, not auto).

## File sketch
```
src/
  App.tsx
  types.ts
  i18n.ts
  lib/storage.ts
  lib/exportMd.ts
  lib/id.ts
  data/presets.ts
  components/Header.tsx, Checklist.tsx, TipSplit.tsx, EmptyState.tsx
  pages/List.tsx, Editor.tsx
  index.css
```

## Out
Backend, multi-user, Pages deploy, charts libs, router if single-view is cleaner (either OK).

## Verify
`npm run build` exit 0; manual: create → reload → export.
