# Pages — dependency trees

## Main List (`src/pages/List.tsx`)
Entry: src/pages/List.tsx
Dependencies:
- src/components/Header.tsx
- src/components/Checklist.tsx
- src/components/FinishShiftWizard.tsx
- src/components/ConfirmDialog.tsx
- src/components/EmptyState.tsx
- src/components/ListSkeleton.tsx
- src/components/QuickChips.tsx
- src/components/TemplatePicker.tsx
- src/lib/storage.ts
- src/lib/sync.ts
- src/lib/dates.ts
- src/lib/historyFilter.ts
- src/lib/markReady.ts
- src/lib/incomplete.ts
- src/lib/dirty.ts

## Editor (`src/pages/Editor.tsx`)
Entry: src/pages/Editor.tsx
Dependencies:
- src/components/Header.tsx
- src/components/ConfirmDialog.tsx
- src/components/UndoToast.tsx
- src/lib/storage.ts
- src/lib/id.ts
- src/lib/dates.ts
- src/lib/roomHelper.ts
- src/lib/haptics.ts

## Export (`src/pages/Export.tsx`)
Entry: src/pages/Export.tsx
Dependencies:
- src/components/Header.tsx
- src/components/PrintSheet.tsx
- src/components/TipSplit.tsx
- src/lib/exportMd.ts
- src/lib/backup.ts

## Settings (`src/pages/SettingsPage.tsx`)
Entry: src/pages/SettingsPage.tsx
Dependencies:
- src/components/Settings.tsx
- src/components/Header.tsx
- src/lib/storage.ts
- src/i18n.ts
