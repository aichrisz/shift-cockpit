---
date: 2026-07-31
type: design-spec
status: approved-design-direction-awaiting-spec-review
tags: [shift-cockpit, v0.11, redesign, mobile-first, accessibility, calm-hotel-ledger]
---

# Shift Cockpit v0.11 — Calm Hotel Ledger Redesign

## Goal

Redesign the visual presentation and responsive interaction layer of Shift Cockpit into **Calm Hotel Ledger**: a focused, professional handover workspace that resembles a carefully maintained hospitality ledger rather than a generic SaaS dashboard.

The redesign serves one trainee/front-desk user during real shifts. It must make the next useful action obvious, retain current functionality, and remain pleasant to read under time pressure on a phone.

## Fixed decisions

- **Visual direction:** Calm Hotel Ledger (approved by Abel, 2026-07-31).
- **Primary device:** phone widths 320–430 px; desktop is an enhancement, not a separate product.
- **Distribution:** static GitHub Pages deployment remains at `/shift-cockpit/` and must work from a phone browser.
- **Implementation lane:** OpenCode with `tokenrouter/moonshotai/kimi-k3-free` when available; Hermes/Roxy reviews scope, security, tests, and release evidence.
- **No new runtime dependency.** No external font, icon, analytics, or UI library is added.

## Product invariants

The following must remain behaviorally compatible:

1. Local-first storage key and stored AppData shape.
2. Optional env-gated Supabase magic-link synchronization, LWW merge, and RLS architecture.
3. DE / EN / ID language selection and existing translations.
4. Create, template selection, duplicate, pin, filters, search, editor, checklist, tips, export, print, backup/import, undo, and finish-shift wizard flows.
5. Existing keyboard shortcuts, dialog behavior, reduced-motion respect, and no-secret policy.

The redesign does **not** introduce a new backend, schema migration, account requirement, routing change, or data collection.

## Visual language

### Tokens

| Role | Direction |
|---|---|
| Page canvas | warm ivory / paper-like neutral |
| Surface | near-white parchment with a restrained border |
| Primary ink | deep charcoal for readable long handover text |
| Secondary ink | muted olive-grey for metadata and labels |
| Primary action / focus | restrained brass / caramel |
| Complete status | deep service green plus explicit progress text |
| Needs attention | muted terracotta plus explicit open-item text |
| Border | warm graphite/linen line, not shadow-led separation |

- Buttons and panels use a small, consistent radius scale.
- Shadows are subtle and functional only (sticky chrome, modal elevation).
- Typography stays system-native for speed, offline resilience, and native text rendering in German/Indonesian/English.
- Color is never the only carrier of a status; existing text/number labels remain visible.

### Accessibility

- Normal text and controls target WCAG 2.1 AA contrast.
- Keyboard focus uses a distinct brass outline with adequate offset.
- Touch targets remain at least 44×44 CSS px in standard density.
- `prefers-reduced-motion` continues to suppress non-essential animation.
- No interaction is made hover-only or icon-only without an accessible name.

## Information architecture and screen behavior

### Shared shell

The app shell becomes a narrow, ledger-like working column on large displays while using the full safe viewport width on phones.

- Header stays sticky, but has less visual weight.
- The application title, language switcher, and Settings entry remain available.
- Safe-area padding remains present at top/bottom.
- On 320 px, labels may visually compact only when their accessible names remain intact.

### List — the shift desk

The list is the primary landing workspace.

1. If a current/pinned handover exists, **Continue last shift** is visually primary.
2. New shift and Templates remain explicit creation paths without competing with Continue.
3. Search and filters read as a compact ledger toolbar.
4. Each handover card presents, in this order:
   - pinned/active or checklist state;
   - shift label and date;
   - update time and checklist completion evidence;
   - an action row (open, pin, duplicate, delete).
5. Action rows wrap predictably and preserve ≥44 px touch height; destructive action remains visually distinct but not dominant.
6. Empty, filter-empty, and skeleton states retain their real CTAs and become visually aligned with the ledger language.

### Editor — the handover page

The editor prioritizes preparing a correct handover, not decoration.

1. Sticky toolbar: Back, visible unsaved state, Export, and Save; secondary actions remain discoverable without crowding 320 px.
2. Shift identity and Open points are first, as the operational core.
3. Room and guest notes remain optional disclosure sections and preserve their helper/copy behavior.
4. Checklist gets a clear progress treatment, readable completion state, and large check controls.
5. Mark ready and Finish shift remain distinct operational actions, with Finish shift still opening the existing wizard.
6. Tips remain optional and visually quieter.

### Settings, Export, print, dialogs

- Settings and Export use the same paper/surface hierarchy and preserve cloud status semantics.
- Existing dialogs retain accessible labels, Escape behavior, and their current functional controls.
- Print styles remain purpose-built for handover sheets and are not replaced with screen styles.

## Responsive rules

| Width | Expected behavior |
|---|---|
| 320 px | no horizontal viewport overflow; controls remain operable; header labels may compact visually |
| 390–430 px | one-column thumb-friendly flow; primary CTA is visible without ambiguous scrolling |
| 768 px | comfortable reading width; two-column field grid may activate where it already exists |
| 1024–1440 px | ledger remains centered and intentionally bounded, with no oversized empty dashboard grid |

## Implementation boundaries

Likely touched files are the presentation components (`Header`, `List`, `Editor`, `SettingsPage`, `Export`, related presentational components) and `src/index.css`. Exact extraction is allowed only when it reduces complexity; functional domain libraries and sync code remain unchanged unless a test proves a presentation boundary needs a narrow helper.

No production code is written before a relevant failing test. Pure UI-layout-only CSS changes are verified by build, lint, and browser QA; behavior changes require RED → GREEN regression coverage.

## Acceptance criteria

### Functional preservation

- Existing local data loads unchanged before and after the redesign.
- New/edit/save/export/print, template choice, search/filter, pin/duplicate/delete/undo, backup/import, and optional cloud settings remain reachable and work.
- No Supabase URL, anon key, TokenRouter key, or other secret enters git, build output documentation, or UI.

### Mobile and accessibility

- Tested at 320×568, 390×844, 768×1024, 1024×768, and 1440×900.
- No horizontal page overflow at 320 and 390 px.
- Standard tap targets are ≥44 px; compact mode behavior remains intentional and documented.
- Keyboard can reach all non-disabled controls; focus is always visible.
- Dialogs can close using Escape and preserve existing focus behavior.

### Engineering/release

- `npm run lint`, `npm run build`, and `npm run build:pages` pass.
- Existing tests pass; new behavior has tests that were observed failing before the minimal implementation.
- Browser QA covers List populated/empty/filter states, Editor, Finish shift wizard, Settings, Export, and responsive widths.
- `dist/index.html`, `dist/404.html`, and Pages base path remain valid.
- `main` and `gh-pages` are pushed only after all gates pass; production is checked for HTTP success and the released version marker.

## Explicit non-goals

- Dark-mode toggle or a second visual theme.
- New navigation paradigm, dashboard analytics, calendar, notifications, or team collaboration.
- Changing or expanding Supabase data synchronization.
- Replacing the application with a component/UI framework.
- External font/CDN adoption.
