import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null | undefined

/** True when both Vite env vars are non-empty. App works offline without them. */
export function isCloudConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return typeof url === 'string' && url.trim().length > 0
    && typeof key === 'string' && key.trim().length > 0
}

/** Lazy singleton; null when cloud is not configured. Safe without .env. */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client
  if (!isCloudConfigured()) {
    client = null
    return null
  }
  const url = import.meta.env.VITE_SUPABASE_URL!.trim()
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY!.trim()
  client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  return client
}
