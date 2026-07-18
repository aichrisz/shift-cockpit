/** Short device vibration when haptics enabled and supported. */
export function hapticPulse(enabled: boolean, ms = 14): void {
  if (!enabled) return
  try {
    navigator.vibrate?.(ms)
  } catch {
    // Unsupported or blocked — no-op
  }
}
