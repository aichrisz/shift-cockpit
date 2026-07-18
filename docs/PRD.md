# PRD — Hotel Shift Cockpit

**Product name (UI):** Shift Cockpit *(generic — no personal name)*  
**Owner:** Private single-user (Azubi Hotelfach / front-desk practice)  
**Stack:** Vite + React + TypeScript  
**Status:** MVP v0.1 plan approved (Abel · gas #1 · 2026-07-18)  
**Implement:** Grok Build CLI · **Plan/verify:** Hermes/Roxy  

---

## 1. Problem

At the front desk / during Ausbildung, shift handovers get lost in paper scraps, WhatsApp, or memory:
- What was open when I left?
- Which rooms need follow-up?
- Pending guest issues (complaint, late arrival, VIP)?
- Simple tip split for the shift?

There is no **fast, phone-friendly, offline-first** checklist for one person.

## 2. Goals (MVP)

1. Create / edit / list **shift handover notes** in under 60 seconds on mobile.
2. Persist locally (`localStorage`) — no login, no backend.
3. Export a handover as **Markdown** (copy or download) for chat / vault.
4. Optional light **shift checklist** (preset Hotelfach tasks).
5. Optional **tip split** calculator (total tips ÷ people).
6. UI language toggle: **DE / EN / ID** (short labels only; MVP can ship with all three inline).

## 3. Non-goals (MVP)

- Multi-user / cloud sync / PMS integration  
- Real hotel data APIs  
- Full inventory (that is Project Board)  
- Game / Lobby Chaos embedding  
- GitHub Pages unless Abel asks later  

## 4. Users & context

- Primary: Azubi / front-desk trainee on break or end of shift (phone).
- Secondary: portfolio demo (English screenshots OK).

## 5. Data model

### ShiftHandover
| Field | Type | Notes |
|-------|------|--------|
| id | string | |
| createdAt | ISO | |
| updatedAt | ISO | |
| shiftLabel | string | e.g. Frühschicht / Spät / Nacht |
| date | YYYY-MM-DD | default today |
| openPoints | string | free text (bullet-friendly) |
| roomNotes | string | Zimmer-Hinweise |
| guestNotes | string | pending guests / complaints |
| checklist | { id, label, done }[] | preset + custom |
| tipTotal | number \| null | |
| tipPeople | number \| null | |
| tipNote | string | optional |
| lang | 'de' \| 'en' \| 'id' | UI language preference can be global |

### Settings
| Field | Notes |
|-------|--------|
| lang | de \| en \| id |
| defaultShift | string |

Storage key: `shift-cockpit-v1`

## 6. Screens (MVP)

1. **Home / list** — recent handovers, “New shift”, language toggle  
2. **Editor** — form fields + checklist + tip split + Save  
3. **Export** — preview Markdown + Copy + Download `.md`  
4. Empty state — first run CTA  

Mobile-first layout; large tap targets.

## 7. Checklist presets (DE labels, show in UI with i18n)

Examples:
- Kasse / Kassenabschluss  
- Schlüssel / Key control  
- Gäste offen / Open guest issues  
- Frühstück vorbereitet (if relevant)  
- Lobby tidy  
- Handover an nächsten Dienst  

## 8. Markdown export template

```markdown
# Shift handover — {date} — {shiftLabel}
Updated: {updatedAt}

## Open points
...

## Room notes
...

## Guest notes
...

## Checklist
- [x] ...
- [ ] ...

## Tips
Total: … / People: … → per person: …
```

## 9. Success criteria

- [ ] `npm run build` green  
- [ ] Create handover → reload → still there  
- [ ] Export MD copy works  
- [ ] Usable on narrow phone viewport  
- [ ] No personal name in chrome  
- [ ] Version 0.1.0 in package.json  

## 10. Preview

Port **8781** (8780 reserved for Project Board).
