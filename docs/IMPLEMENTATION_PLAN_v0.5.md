# Shift Cockpit v0.5 — “Handover clean” + interaction polish

**Base:** v0.4.0 · **Approved:** Abel ikut saran sensei + request interaktivitas  
**Implementer:** Grok Build CLI · Verify: Hermes  
**Quality:** design / implement / check-work · zero new deps

## Goal
Faster end-of-shift flow + feel more “app-like”: search, incomplete signals, one-tap ready, template-aware chips, compact UI, and micro-interactions (confirm modal, page transitions, skeleton loading).

## Ship A — Handover clean (5)

### 1. List search
- Search input filters by `shiftLabel`, `openPoints`, `roomNotes`, `guestNotes`, checklist labels (case-insensitive).
- Combines with existing history filter (today / 7d / all).

### 2. Incomplete badge
- On list cards: if checklist length > 0 and not all done → badge e.g. `2/6` or “Open” (i18n).
- Optional subtle style for complete (muted check).

### 3. One-tap “Serah terima siap”
- Editor primary-ish action: mark **all checklist done** + append a bullet line to openPoints with local timestamp, e.g. `- Übergabe bereit · 2026-07-18 14:30` (i18n phrase).
- Idempotent-ish: don’t spam duplicate ready lines if last openPoints line already matches ready marker.

### 4. Template-aware quick chips
- Map chip subsets per template id (`frueh` / `spaet` / `nacht`) + default set for blank.
- Früh: breakfast, wake-up, late checkout vibes  
- Spät: arrivals, no-show, key  
- Nacht: quiet hours, night audit, late arrival, security  
- Still allow full set via “More” expand if easy; otherwise just show curated 6–8.

### 5. Compact mode
- Settings toggle `settings.compactUi` (default false) → `data-compact` on root/`documentElement` or app shell.
- CSS reduces padding, font gaps, card density for phone.

## Ship B — Interaction polish (Abel request)

### 6. In-app confirm modal (replace raw `window.confirm` where used)
- Lightweight `ConfirmDialog` component: title, body, Cancel / Confirm (destructive style for delete/wipe).
- Use for: delete handover, wipe older, dirty leave, optional “mark ready” if needed.
- Focus trap light: focus confirm button; Escape = cancel.

### 7. Page transitions
- CSS class on view root: fade/slide short (150–220ms) when `view.name` changes.
- `prefers-reduced-motion: reduce` → no motion.

### 8. Skeleton loading
- On first mount while hydrating from localStorage (brief state `ready=false` for 1 paint or until load completes): show list skeleton (2–3 pulse cards).
- Not a fake long delay — max ~100–200ms optional shimmer; if load is sync, still show skeleton for one animation frame then content (or skip if too janky — prefer: `booting` true until after first `useEffect`).

## Version / constraints
- package **0.5.0**, README Features v0.5
- storage key `shift-cockpit-v1` additive only
- zero new deps; port 8781; Pages base `/shift-cockpit/`
- Brand **Shift Cockpit**; DE/EN/ID for all new chrome

## Out
Cloud, multi-user, heavy animation libs, framer-motion, real network loading spinners for APIs.

## Verify
- Search filters correctly  
- Incomplete badge accurate  
- Mark ready checks all + timestamp bullet  
- Chips differ by template (or blank)  
- Compact densifies layout  
- Confirm modal used instead of window.confirm for main destructive/dirty flows  
- Transition + skeleton don’t break a11y (reduced motion)  
- `npm run build` + `build:pages` green  
