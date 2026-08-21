# Extractable Components

## NavBar/Header
- Source: `src/components/Header.tsx`
- Category: layout
- Description: Top header with title, undo, add buttons
- Extractable props: title (string), onUndo (fn), onAdd (fn), onPrint (fn)
- Hardcoded: icon SVGs, text labels

## Checklist (List item card)
- Source: `src/components/Checklist.tsx`
- Category: basic
- Description: Checklist card with checkbox, notes, category badge
- Extractable props: items (array), onToggle (fn), onEdit (fn)
- Hardcoded: category labels, icon names

## ConfirmDialog
- Source: `src/components/ConfirmDialog.tsx`
- Category: basic
- Description: Confirmation modal
- Extractable props: open (bool), title, message, onConfirm, onCancel
- Hardcoded: button text

## EmptyState
- Source: `src/components/EmptyState.tsx`
- Category: basic
- Description: Empty state placeholder with icon and CTA
- Extractable props: title, description, onAction, actionLabel
- Hardcoded: icon SVG

## Settings (modal)
- Source: `src/components/Settings.tsx`
- Category: basic
- Description: Settings panel (locale, backup, data)
- Extractable props: settings (object), onChange (fn)
- Hardcoded: label text, section titles
