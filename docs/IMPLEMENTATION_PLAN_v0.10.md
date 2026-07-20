# Shift Cockpit v0.10 — Hybrid cloud sync (Supabase)

**Base:** v0.9.0 · **Approved:** Abel “Lanjutin buat integrasi db”  
**Implementer:** Grok Build · Verify: Hermes  
**Stack add:** `@supabase/supabase-js` only new dep

## Goal
Optional **real DB + sync** without breaking offline local-first.
- No env keys → app works exactly as v0.9 (local only); Settings shows setup hint.
- With `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` → Auth (magic link email) + Sync now + auto pull on login + push on save (debounced).

## Architecture
```
UI ↔ AppData state
       ↔ localStorage (always write-through)
       ↔ syncEngine (if configured + signed in)
            ↔ Supabase Postgres (RLS by auth.uid())
```

### Conflict
Last-write-wins per handover row by `updated_at` (ISO). Settings: LWW by `updated_at`.

### Schema (SQL file `supabase/schema.sql`)
```sql
-- handovers: id uuid/text PK, user_id uuid refs auth.users, payload jsonb, updated_at timestamptz, deleted_at timestamptz null
-- settings: user_id PK, payload jsonb, updated_at timestamptz
-- RLS: select/insert/update/delete where user_id = auth.uid()
```
Store full handover object in `payload` JSONB for fast ship (fields already in app types).

## Ship
1. `src/lib/supabase.ts` — client from import.meta.env; `isCloudConfigured()`
2. `src/lib/sync.ts` — pullAll, pushAll, mergeLww(local, remote), syncNow()
3. Auth UI in Settings (or Cloud section): email magic link, sign out, session state
4. Sync status: lastSyncedAt (local settings or separate key), errors, “Sync now” button
5. On successful local save of app data while signed in: debounced push (e.g. 1.5s)
6. On sign-in: pull + merge + save local
7. Soft delete: if local removes handover, set deleted_at remote or delete row
8. `.env.example` with VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
9. `docs/CLOUD_SYNC.md` — create project, run SQL, enable email auth, set env, rebuild Pages
10. i18n DE/EN/ID for all cloud chrome
11. version **0.10.0**, README Features v0.10
12. Never commit real secrets; .gitignore .env

## Out
Realtime websocket phase (optional stub ok), multi-user share, E2E encryption, service role in client.

## Verify
- `npm run build` green without .env
- With mock/no keys: local path unchanged
- Unit-testable mergeLww pure function
- schema.sql present and sensible RLS
