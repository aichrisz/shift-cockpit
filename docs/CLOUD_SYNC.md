# Cloud sync (optional) — Supabase

Shift Cockpit stays **local-first**. Cloud is optional: without env keys the app works exactly like offline mode. With keys + magic-link sign-in you get multi-device sync via Postgres (last-write-wins).

## 1. Create a Supabase project

1. Open [https://supabase.com](https://supabase.com) and create a free project.
2. Wait until the database is ready.

## 2. Run the schema

1. Dashboard → **SQL Editor** → New query.
2. Paste the contents of [`supabase/schema.sql`](../supabase/schema.sql).
3. Run. You should see tables `handovers` and `settings` with RLS enabled.

## 3. Enable email (magic link) auth

1. Dashboard → **Authentication** → **Providers** → **Email**.
2. Enable Email. Magic link (OTP) is enough; password optional.
3. Under **URL configuration**, set **Site URL** to your app origin, e.g.:
   - Local: `http://localhost:8781`
   - GitHub Pages: `https://YOUR_USER.github.io/shift-cockpit/`
4. Add the same origin to **Redirect URLs**.

## 4. Copy API keys into `.env`

1. Dashboard → **Project Settings** → **API**.
2. Copy **Project URL** and the **anon public** key (not the service role).
3. In the repo root:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

`.env` is gitignored. Never commit real keys. Never put the **service_role** key in the client.

## 5. Rebuild / run

```bash
npm install
npm run dev          # local with .env
# or production:
npm run build
# GitHub Pages:
npm run build:pages
```

Vite inlines `VITE_*` at **build** time. After changing `.env`, restart dev server or rebuild for Pages/CI.

For GitHub Pages, set repository secrets / Actions env for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` on the build step (do not commit them).

## 6. Use in the app

1. Open **Settings** → **Cloud**.
2. Enter email → **Send magic link**.
3. Open the link from your inbox (same browser/device profile is fine).
4. After sign-in the app **pulls**, merges (LWW by `updated_at`), and **pushes**.
5. Further local saves **debounce-push** (~1.5s) while signed in.
6. **Sync now** forces pull + merge + push.

## Conflict model

- **Handovers:** last-write-wins per row id by ISO `updated_at`.
- **Settings:** last-write-wins by `settings.updated_at` vs a local stamp.
- Soft-delete: removing a handover locally sets `deleted_at` on the remote row on next push.

## Out of scope (v0.10)

- Realtime websockets
- Multi-user share of the same handovers
- End-to-end encryption
- Service role in the browser

## Troubleshooting

| Symptom | Check |
|--------|--------|
| Settings shows setup hint | `.env` missing or empty; rebuild after setting keys |
| Magic link does nothing | Site URL / redirect URLs; spam folder |
| Sync errors / RLS | Re-run `schema.sql`; confirm policies use `auth.uid()` |
| Build fails without keys | Should not — keys are optional; report a bug if it does |
