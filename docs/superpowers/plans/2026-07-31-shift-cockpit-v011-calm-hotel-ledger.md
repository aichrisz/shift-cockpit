# Shift Cockpit v0.11 Calm Hotel Ledger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for task-by-task execution. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a mobile-first Calm Hotel Ledger visual redesign while preserving every existing Shift Cockpit workflow, local data shape, language, sync, export, and print behavior.

**Architecture:** Keep the current React view hierarchy and all domain/sync libraries intact. Apply a semantic CSS token layer and narrowly adjust presentational markup only where structure is required for responsive hierarchy. Use browser QA as the visual regression boundary because this repository currently has no automated test runner and the approved scope adds no domain behavior.

**Tech Stack:** React 19, TypeScript, Vite 8, CSS custom properties, oxlint, static GitHub Pages.

## Global Constraints

- Implement in an isolated worktree branch; never work directly on `main`.
- Use OpenCode model `tokenrouter/moonshotai/kimi-k3-free` for implementation requests. Give every invocation a static `--title`.
- Preserve AppData shape, `shift-cockpit-v1`, optional Supabase magic-link/sync/RLS behavior, DE / EN / ID strings, print flow, export flow, and keyboard behavior.
- Add no runtime dependency, external font, CDN, analytics, backend, route, or data migration.
- Use warm ivory canvas, parchment surfaces, charcoal text, restrained brass accent, service green completion, and muted terracotta attention status.
- Maintain a minimum 44×44 px touch target in standard density; retain visible focus and `prefers-reduced-motion` behavior.
- Test 320×568, 390×844, 768×1024, 1024×768, and 1440×900. No horizontal viewport overflow at 320 or 390 px.
- Run `npm run lint`, `npm run build`, and `npm run build:pages` before merge. Do not deploy before browser QA passes.

---

## File map

| File | Responsibility |
|---|---|
| `src/index.css` | Calm Hotel Ledger semantic tokens, responsive shell, controls, surfaces, list/editor/settings/export presentation, print safeguards. |
| `src/components/Header.tsx` | Semantic header grouping only if required to retain accessible compact mobile chrome. |
| `src/pages/List.tsx` | List-only visual hierarchy wrappers/classes; no sorting/filter/action semantics change. |
| `src/pages/Editor.tsx` | Editor-only presentation grouping/classes; no draft patch/save/export/wizard behavior change. |
| `src/components/Settings.tsx` | Existing settings groups receive ledger presentation hooks only if necessary. |
| `src/pages/Export.tsx` | Export preview/toolbar visual hooks only if necessary. |
| `docs/PROJECT_BOARD_FEATURE_SPEC.md` | Not touched; belongs to another project. |
| `README.md`, `CHANGELOG.md`, `src/version.ts`, `package.json` | Release wording/version only after implementation is verified. |

## Task 1: Create an isolated implementation baseline

**Files:**
- Modify: `.gitignore` only if the selected project-local worktree directory is not ignored.
- No runtime source changes.

**Interfaces:**
- Consumes: clean `main` at commit containing the approved v0.11 spec.
- Produces: linked worktree branch `feat/shift-cockpit-v011-calm-ledger` with a verified baseline.

- [ ] **Step 1: Detect existing isolation and select the worktree location**

Run:
```bash
cd /root/projects/hotel-shift-cockpit
git rev-parse --git-dir
git rev-parse --git-common-dir
git rev-parse --show-superproject-working-tree
git check-ignore -q .worktrees || true
```

Expected: this checkout is the main worktree, not a submodule. If `.worktrees/` is not ignored, add exactly `.worktrees/` to `.gitignore`, commit it separately, and re-run `git check-ignore -q .worktrees`.

- [ ] **Step 2: Create the linked worktree**

Run:
```bash
git worktree add .worktrees/shift-cockpit-v011 -b feat/shift-cockpit-v011-calm-ledger
cd .worktrees/shift-cockpit-v011
npm ci
```

Expected: dependencies install without changing the lockfile.

- [ ] **Step 3: Establish a clean functional baseline**

Run:
```bash
npm run lint
npm run build
npm run build:pages
git status --short
```

Expected: lint/build/pages build exit 0 and worktree is clean. If any baseline command fails, stop and diagnose before source work.

- [ ] **Step 4: Capture read-only visual baseline**

Start `npm run dev -- --host 127.0.0.1` in a managed background process and use a real browser to capture List empty/populated, Editor, Settings, and Export at 390×844 and 1440×900. Do not alter localStorage schema or committed source while collecting the baseline.

- [ ] **Step 5: Commit only an ignore-rule prerequisite if it was needed**

Run only if `.gitignore` changed:
```bash
git add .gitignore
git commit -m "chore: ignore local worktrees"
```

Expected: no source behavior commits occur in this task.

## Task 2: Install the Calm Hotel Ledger token and shell layer

**Files:**
- Modify: `src/index.css:1-356`
- Modify only if needed for semantic grouping: `src/components/Header.tsx:24-66`

**Interfaces:**
- Consumes: existing class names (`app-shell`, `app-header`, `app-main`, `btn`, `input`, `lang-toggle`).
- Produces: stable semantic tokens reused by every existing component; header remains a `header` with `h1`, labelled language group, and labelled Settings button.

- [ ] **Step 1: Record the expected visual contract before CSS changes**

Create a written QA assertion in the implementation notes:
```text
At 390 px, the header remains one line, Settings has an accessible name,
all language controls remain individually focusable, and page canvas does not
scroll horizontally. At 1440 px, the application is centered as one ledger column.
```

No source code is changed in this step. This replaces a fake unit test: this task is CSS-only and has no new deterministic domain function.

- [ ] **Step 2: Replace root token values minimally**

In `src/index.css`, retain existing token names so all components continue to resolve them. Use values in this range:
```css
:root {
  color-scheme: light;
  --bg: #f3ede1;
  --bg-elevated: #fbf7ef;
  --bg-panel: #fffdf8;
  --bg-input: #fffdf8;
  --border: #d7cdbb;
  --border-strong: #a99b83;
  --text: #27241f;
  --text-muted: #665f53;
  --text-faint: #857b6b;
  --accent: #a87932;
  --accent-hover: #8d6326;
  --accent-dim: rgba(168, 121, 50, 0.13);
  --success: #356b49;
  --danger: #a85444;
  --focus: #80551b;
}
```

Keep spacing variables and `--tap` at 44px for normal density. Replace dark radial background with a subtle flat/paper treatment; do not load remote images or fonts.

- [ ] **Step 3: Implement shell and control hierarchy**

Update `.app-shell`, `.app-header`, `.app-main`, `.btn-*`, `.input`, `.lang-toggle`, and focus states so that:

```css
.app-shell { max-width: 44rem; }
.app-header { background: color-mix(in srgb, var(--bg) 94%, transparent); }
.btn-primary { background: var(--accent); color: #fffdf8; }
.btn:focus-visible, .input:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
```

Use feature-safe fallbacks where `color-mix` is used. Preserve header sticky behavior, safe-area padding, semantic elements, button labels, and existing compact mode semantics.

- [ ] **Step 4: Verify GREEN with static and browser checks**

Run:
```bash
npm run lint
npm run build
```

Then browser-check at 320×568, 390×844, and 1440×900:
- focus each header control using Tab;
- verify brass focus is visible on ivory;
- verify no horizontal viewport overflow;
- verify reduced-motion media preference does not produce a blocking animation.

Expected: commands exit 0 and all four observations hold.

- [ ] **Step 5: Commit the token/shell deliverable**

```bash
git add src/index.css src/components/Header.tsx
git commit -m "feat: establish Calm Hotel Ledger visual foundation"
```

Only include `Header.tsx` if it changed.

## Task 3: Redesign the list as an operational ledger

**Files:**
- Modify: `src/pages/List.tsx:233-423`
- Modify: `src/index.css` list, empty-state, filter, card, badge, and action-row selectors.

**Interfaces:**
- Consumes: `ListProps` exactly as currently defined, `resolveContinueLastId`, filters, callbacks, and i18n `t`/`tf`.
- Produces: the same buttons/callbacks and `<ul role="list">`; no change to filtering, sorting, pinning, delete confirmation, or keyboard shortcuts.

- [ ] **Step 1: Record the expected list behavior before markup changes**

Write the following browser assertions before implementation:
```text
Continue last opens the same resolved handover. New and Templates keep their
current callbacks. Search and all filter chips retain aria-pressed behavior.
Open, Pin/Unpin, Duplicate, and Delete call the existing callbacks; Delete still
opens ConfirmDialog and Escape closes it.
```

- [ ] **Step 2: Apply minimal presentational markup/classes**

Keep existing callbacks and text. Add only descriptive wrappers/classes needed for hierarchy, for example:
```tsx
<div className="ledger-actions list-toolbar no-print">…</div>
<div className="ledger-filter-bar no-print">…</div>
<span className="handover-entry-kicker">…existing active/checklist status…</span>
```

Do not replace `<button>` elements with clickable `<div>`, remove role attributes, modify callback parameters, or change list sorting.

- [ ] **Step 3: Implement list CSS**

Update card and list rules so that the card uses a ledger divider/border, active state uses brass plus the existing `Active` text, checklist uses existing counts plus text, and action controls form a predictable grid:
```css
.handover-actions { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); }
@media (min-width: 480px) { .handover-actions { grid-template-columns:repeat(4, minmax(0, 1fr)); } }
.handover-actions .btn { min-height:var(--tap); min-width:0; }
```

At desktop, preserve the centered ledger reading width rather than creating a card grid.

- [ ] **Step 4: Verify GREEN**

Run:
```bash
npm run lint
npm run build
```

Browser-check a populated sample and an empty list at 320×568, 390×844, 768×1024, and 1440×900:
- Continue/new/template actions are reachable;
- search/filter works and focus is visible;
- action row has no clipping or page overflow;
- card title truncation still preserves card opening;
- empty CTA is visible and usable.

Expected: commands exit 0; all existing callbacks continue to work.

- [ ] **Step 5: Commit the list deliverable**

```bash
git add src/pages/List.tsx src/index.css
git commit -m "feat: redesign handover list as Calm Hotel Ledger"
```

## Task 4: Redesign editor, settings, export, and print-safe surfaces

**Files:**
- Modify: `src/pages/Editor.tsx:239-515`
- Modify: `src/pages/SettingsPage.tsx:87-125` only if a presentational group is required
- Modify: `src/components/Settings.tsx` only if existing semantic sections need a class hook
- Modify: `src/pages/Export.tsx:98-157`
- Modify: `src/index.css` editor, panel, checklist, settings, export, dialog, and print selectors.

**Interfaces:**
- Consumes: current props and callbacks in `EditorProps`, `SettingsPageProps`, `Settings`, and `ExportProps`.
- Produces: exactly the same save/export/print/copy/share/backup/sync calls, dialogs, and print DOM; visible grouping and CSS only.

- [ ] **Step 1: Record expected editor flow before implementation**

Write these acceptance checks before editing:
```text
Back preserves the dirty-leave dialog. Save updates the same draft. Export opens
Export. Mark ready and Finish shift keep their existing separate actions. Optional
Room, Guest, and Tips disclosures preserve aria-expanded. Print stays print-only
where current no-print/print-sheet classes require it.
```

- [ ] **Step 2: Apply minimal presentation hierarchy**

Add classes only to existing structural containers, such as:
```tsx
<div className="editor-command-bar no-print">…existing editor toolbar…</div>
<section className="ledger-core-section">…existing shift identity/open points…</section>
<section className="ledger-optional-section panel notes-optional no-print">…</section>
```

Keep each existing button, handler, label, `aria-expanded`, form value, and `onChange` expression unchanged.

- [ ] **Step 3: Implement responsive CSS**

Apply ledger separators and restrained panel hierarchy. Ensure the toolbar may wrap on 320px without hiding Save or Export; optional sections remain visually quieter; checkbox/checklist controls keep standard touch targets; Settings cloud status remains readable; export markdown retains keyboard focus; and `@media print` preserves print sheet behavior.

Use existing `no-print`, `print-sheet`, and `data-print-profile` conventions. Do not put parchment backgrounds into printed handover sheets unless existing print rules explicitly support them.

- [ ] **Step 4: Verify GREEN**

Run:
```bash
npm run lint
npm run build
npm run build:pages
```

Browser-check at 320×568, 390×844, 768×1024, 1024×768, and 1440×900:
- create/edit/save a sample handover;
- toggle Room, Guest, and Tips sections;
- use checklist and Mark ready;
- open/close Finish shift and dirty-leave dialogs with Escape;
- open Settings and Export, test Copy/Share fallback only where browser permits;
- inspect print preview and confirm application chrome remains excluded.

Expected: three commands exit 0; no horizontal overflow; all current flows remain reachable.

- [ ] **Step 5: Commit the editor/surface deliverable**

```bash
git add src/pages/Editor.tsx src/pages/SettingsPage.tsx src/components/Settings.tsx src/pages/Export.tsx src/index.css
git commit -m "feat: apply Calm Hotel Ledger to handover workflow"
```

Stage only files actually changed.

## Task 5: Release evidence, documentation, and Pages deployment

**Files:**
- Modify: `package.json`, `package-lock.json`, `src/version.ts`, `README.md`, `CHANGELOG.md`, and project feature documentation only if current release convention requires a v0.11 version/release note.
- Do not change Supabase schema, `.env.example`, secrets, or another project’s documentation.

**Interfaces:**
- Consumes: completed visual branch and Pages command `npm run build:pages`.
- Produces: a clean `main`, published `gh-pages` artifact, verified mobile-accessible production URL.

- [ ] **Step 1: Review before release**

Run:
```bash
git diff main...HEAD --check
npm run lint
npm run build
npm run build:pages
```

Expected: no whitespace errors and all commands exit 0.

- [ ] **Step 2: Run independent review**

Review changed files for:
- accidental state/sync/data-model changes;
- localStorage key changes;
- lost aria labels, focus styles, button semantics, or print selectors;
- added dependency/external resource;
- secret leakage;
- mobile overflow and unsafe fixed-width CSS.

Fix findings and rerun Step 1 before proceeding.

- [ ] **Step 3: Final browser evidence**

Use a clean browser profile or cleared localStorage, then seed/load only the app sample. Capture screenshots for empty/list-populated/editor/settings/export at 390×844 and the populated list/editor at 1440×900. Confirm the published candidate preserves `VITE_BASE=/shift-cockpit/` asset URLs.

- [ ] **Step 4: Release source**

Fast-forward merge only after all gates pass:
```bash
cd /root/projects/hotel-shift-cockpit
git merge --ff-only feat/shift-cockpit-v011-calm-ledger
git push origin main
```

Then build Pages from the merged source:
```bash
npm run build:pages
```

- [ ] **Step 5: Publish Pages artifact and verify production**

Publish the full `dist/` contents to the root of `gh-pages`, including `404.html`; do not use a GitHub Actions workflow. Push `gh-pages`, then verify:
```bash
curl -fsSI https://aichrisz.github.io/shift-cockpit/
curl -fsSL https://aichrisz.github.io/shift-cockpit/ > /tmp/shift-cockpit.html
```

Expected: root HTTP 200, referenced JS/CSS assets HTTP 200, released version marker present, and `/shift-cockpit/` opens successfully from a mobile viewport.

- [ ] **Step 6: Commit documentation and report evidence**

Commit version/documentation changes with:
```bash
git add package.json package-lock.json src/version.ts README.md CHANGELOG.md
git commit -m "docs: record Shift Cockpit v0.11 redesign"
```

Only stage files that changed. Update the Shift Cockpit vault project note after verified production deploy, run `backup-roxy-vault.sh`, and report source SHA, Pages SHA, command output, browser widths, and production evidence.
