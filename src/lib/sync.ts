import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { AppData, Settings, ShiftHandover } from '../types'
import { loadAppDataFromUnknown } from './storage'
import { getSupabase } from './supabase'

const SYNC_META_KEY = 'shift-cockpit-sync-meta-v1'
const PUSH_DEBOUNCE_MS = 1500

export interface SyncMeta {
  lastSyncedAt: string | null
  settingsUpdatedAt: string
}

export interface SyncResult {
  data: AppData
  lastSyncedAt: string
}

export interface PullResult {
  handovers: ShiftHandover[]
  settings: Settings | null
  settingsUpdatedAt: string | null
}

interface HandoverRow {
  id: string
  payload: unknown
  updated_at: string
  deleted_at: string | null
}

interface SettingsRow {
  user_id: string
  payload: unknown
  updated_at: string
}

// ── Sync meta (local only) ──────────────────────────────────────────

export function defaultSyncMeta(): SyncMeta {
  return {
    lastSyncedAt: null,
    settingsUpdatedAt: new Date(0).toISOString(),
  }
}

export function loadSyncMeta(): SyncMeta {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY)
    if (!raw) return defaultSyncMeta()
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return defaultSyncMeta()
    const rec = parsed as Record<string, unknown>
    return {
      lastSyncedAt:
        typeof rec.lastSyncedAt === 'string' ? rec.lastSyncedAt : null,
      settingsUpdatedAt:
        typeof rec.settingsUpdatedAt === 'string'
          ? rec.settingsUpdatedAt
          : new Date(0).toISOString(),
    }
  } catch {
    return defaultSyncMeta()
  }
}

export function saveSyncMeta(meta: SyncMeta): void {
  try {
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta))
  } catch {
    // quota / private mode
  }
}

export function bumpSettingsUpdatedAt(): string {
  const meta = loadSyncMeta()
  const next = new Date().toISOString()
  saveSyncMeta({ ...meta, settingsUpdatedAt: next })
  return next
}

// ── Pure merge (LWW by updated_at ISO) ──────────────────────────────

/**
 * Last-write-wins per handover id by `updatedAt` ISO string.
 * Remote soft-deleted ids are omitted from remote list before merge.
 * If only local has a row, keep it. If only remote has it, add it.
 */
export function mergeLwwHandovers(
  local: ShiftHandover[],
  remote: ShiftHandover[],
): ShiftHandover[] {
  const map = new Map<string, ShiftHandover>()
  for (const h of local) {
    map.set(h.id, h)
  }
  for (const r of remote) {
    const existing = map.get(r.id)
    if (!existing) {
      map.set(r.id, r)
      continue
    }
    // ISO timestamps sort lexicographically when same precision.
    if (r.updatedAt > existing.updatedAt) {
      map.set(r.id, r)
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )
}

/**
 * Last-write-wins for settings by explicit updated_at stamps.
 */
export function mergeLwwSettings(
  local: Settings,
  remote: Settings | null,
  localUpdatedAt: string,
  remoteUpdatedAt: string | null,
): Settings {
  if (!remote || !remoteUpdatedAt) return local
  if (remoteUpdatedAt > localUpdatedAt) return remote
  return local
}

/**
 * Merge full AppData: handovers LWW + settings LWW.
 * Returns merged data and the effective settingsUpdatedAt to persist.
 */
export function mergeAppData(
  local: AppData,
  pull: PullResult,
  localSettingsUpdatedAt: string,
): { data: AppData; settingsUpdatedAt: string } {
  const handovers = mergeLwwHandovers(local.handovers, pull.handovers)
  const settings = mergeLwwSettings(
    local.settings,
    pull.settings,
    localSettingsUpdatedAt,
    pull.settingsUpdatedAt,
  )
  const settingsUpdatedAt =
    pull.settings &&
    pull.settingsUpdatedAt &&
    pull.settingsUpdatedAt > localSettingsUpdatedAt
      ? pull.settingsUpdatedAt
      : localSettingsUpdatedAt

  // Drop pin if handover vanished after merge
  const pin = settings.pinnedId
  const pinnedId =
    pin && handovers.some((h) => h.id === pin) ? pin : null

  return {
    data: {
      version: 1,
      settings: { ...settings, pinnedId },
      handovers,
    },
    settingsUpdatedAt,
  }
}

// ── Remote I/O ──────────────────────────────────────────────────────

function rowToHandover(row: HandoverRow): ShiftHandover | null {
  // Prefer nested payload; fall back if payload is the object itself.
  const raw = row.payload
  const sanitized = loadAppDataFromUnknown({
    version: 1,
    settings: {},
    handovers: [raw],
  })
  const h = sanitized?.handovers[0]
  if (!h) return null
  // Prefer row.updated_at if payload is older/missing
  if (row.updated_at && row.updated_at > h.updatedAt) {
    return { ...h, updatedAt: row.updated_at, id: row.id }
  }
  return { ...h, id: row.id }
}

function settingsFromPayload(raw: unknown): Settings | null {
  const sanitized = loadAppDataFromUnknown({
    version: 1,
    settings: raw,
    handovers: [],
  })
  return sanitized?.settings ?? null
}

async function requireUser(client: SupabaseClient): Promise<User> {
  const { data, error } = await client.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Not signed in')
  return data.user
}

export async function pullAll(client: SupabaseClient): Promise<PullResult> {
  const user = await requireUser(client)

  const { data: rows, error: hErr } = await client
    .from('handovers')
    .select('id, payload, updated_at, deleted_at')
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (hErr) throw hErr

  const handovers: ShiftHandover[] = []
  for (const row of (rows ?? []) as HandoverRow[]) {
    const h = rowToHandover(row)
    if (h) handovers.push(h)
  }

  const { data: settingsRows, error: sErr } = await client
    .from('settings')
    .select('user_id, payload, updated_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (sErr) throw sErr

  const sRow = settingsRows as SettingsRow | null
  const settings = sRow ? settingsFromPayload(sRow.payload) : null
  const settingsUpdatedAt = sRow?.updated_at ?? null

  return { handovers, settings, settingsUpdatedAt }
}

export async function pushAll(
  client: SupabaseClient,
  data: AppData,
  settingsUpdatedAt: string,
): Promise<void> {
  const user = await requireUser(client)
  const now = new Date().toISOString()

  // Upsert live handovers
  if (data.handovers.length > 0) {
    const upserts = data.handovers.map((h) => ({
      id: h.id,
      user_id: user.id,
      payload: h,
      updated_at: h.updatedAt || now,
      deleted_at: null as string | null,
    }))
    const { error } = await client.from('handovers').upsert(upserts, {
      onConflict: 'id',
    })
    if (error) throw error
  }

  // Soft-delete remote rows missing locally
  const { data: remoteRows, error: listErr } = await client
    .from('handovers')
    .select('id')
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (listErr) throw listErr

  const localIds = new Set(data.handovers.map((h) => h.id))
  const toDelete = ((remoteRows ?? []) as { id: string }[])
    .map((r) => r.id)
    .filter((id) => !localIds.has(id))

  if (toDelete.length > 0) {
    const { error: delErr } = await client
      .from('handovers')
      .update({ deleted_at: now, updated_at: now })
      .eq('user_id', user.id)
      .in('id', toDelete)
    if (delErr) throw delErr
  }

  // Upsert settings
  const { error: sErr } = await client.from('settings').upsert(
    {
      user_id: user.id,
      payload: data.settings,
      updated_at: settingsUpdatedAt || now,
    },
    { onConflict: 'user_id' },
  )
  if (sErr) throw sErr
}

/** Pull → LWW merge → push. Returns merged AppData for local apply. */
export async function syncNow(
  client: SupabaseClient,
  local: AppData,
): Promise<SyncResult> {
  const meta = loadSyncMeta()
  const pull = await pullAll(client)
  const { data: merged, settingsUpdatedAt } = mergeAppData(
    local,
    pull,
    meta.settingsUpdatedAt,
  )
  await pushAll(client, merged, settingsUpdatedAt)
  const lastSyncedAt = new Date().toISOString()
  saveSyncMeta({ lastSyncedAt, settingsUpdatedAt })
  return { data: merged, lastSyncedAt }
}

/** Push-only (debounced save path). */
export async function pushNow(
  client: SupabaseClient,
  local: AppData,
): Promise<string> {
  const meta = loadSyncMeta()
  await pushAll(client, local, meta.settingsUpdatedAt)
  const lastSyncedAt = new Date().toISOString()
  saveSyncMeta({ ...meta, lastSyncedAt })
  return lastSyncedAt
}

// ── Auth helpers ────────────────────────────────────────────────────

export async function signInWithMagicLink(email: string): Promise<void> {
  const client = getSupabase()
  if (!client) throw new Error('Cloud not configured')
  const redirectTo =
    typeof window !== 'undefined' ? window.location.origin + window.location.pathname : undefined
  const { error } = await client.auth.signInWithOtp({
    email: email.trim(),
    options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
  })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const client = getSupabase()
  if (!client) return
  const { error } = await client.auth.signOut()
  if (error) throw error
}

export async function getSessionUser(): Promise<User | null> {
  const client = getSupabase()
  if (!client) return null
  const { data } = await client.auth.getSession()
  return data.session?.user ?? null
}

// ── Debounced push ──────────────────────────────────────────────────

let pushTimer: number | null = null
let pushInFlight = false
let pendingData: AppData | null = null

export function scheduleDebouncedPush(
  data: AppData,
  onDone?: (lastSyncedAt: string) => void,
  onError?: (err: unknown) => void,
): void {
  const client = getSupabase()
  if (!client) return
  pendingData = data
  if (pushTimer != null) {
    window.clearTimeout(pushTimer)
  }
  pushTimer = window.setTimeout(() => {
    pushTimer = null
    void flushDebouncedPush(onDone, onError)
  }, PUSH_DEBOUNCE_MS)
}

export function cancelDebouncedPush(): void {
  if (pushTimer != null) {
    window.clearTimeout(pushTimer)
    pushTimer = null
  }
  pendingData = null
}

async function flushDebouncedPush(
  onDone?: (lastSyncedAt: string) => void,
  onError?: (err: unknown) => void,
): Promise<void> {
  const client = getSupabase()
  const data = pendingData
  if (!client || !data || pushInFlight) return
  pushInFlight = true
  pendingData = null
  try {
    const user = await getSessionUser()
    if (!user) return
    const at = await pushNow(client, data)
    onDone?.(at)
  } catch (err) {
    onError?.(err)
  } finally {
    pushInFlight = false
    // If more data arrived while pushing, schedule again
    if (pendingData) {
      scheduleDebouncedPush(pendingData, onDone, onError)
    }
  }
}

export { PUSH_DEBOUNCE_MS }
