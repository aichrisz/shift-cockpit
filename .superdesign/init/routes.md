# Routes

App shell: `src/App.tsx` (state-based routing, no router lib). View switching via App state.

| View | Component | File |
|---|---|---|
| Main list | List | `src/pages/List.tsx` |
| Editor | Editor | `src/pages/Editor.tsx` |
| Export | Export | `src/pages/Export.tsx` |
| Settings | SettingsPage | `src/pages/SettingsPage.tsx` |
| Settings modal | Settings | `src/components/Settings.tsx` |
| Finish shift wizard | FinishShiftWizard | `src/components/FinishShiftWizard.tsx` |
| Print sheet | PrintSheet | `src/components/PrintSheet.tsx` |

No router config file (manual view switching in App.tsx).
