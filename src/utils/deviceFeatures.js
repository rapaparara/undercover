/**
 * Screen Wake Lock API wrapper
 * Keeps the screen awake during active gameplay to prevent auto-lock interruptions.
 * Gracefully returns null if unsupported or fails.
 */
export async function requestWakeLock() {
  if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
    try {
      const lock = await navigator.wakeLock.request('screen');
      return lock;
    } catch (err) {
      console.warn('Wake Lock request failed:', err);
      return null;
    }
  }
  return null;
}

/**
 * Releases an acquired wake lock cleanly.
 */
export async function releaseWakeLock(lock) {
  if (lock && typeof lock.release === 'function') {
    try {
      await lock.release();
    } catch (err) {
      console.warn('Wake Lock release failed:', err);
    }
  }
}

/**
 * Trigger haptic vibration feedback for silent physical confirmation.
 * @param {number} durationMs - Vibration duration in milliseconds (default 40ms)
 */
export function hapticPulse(durationMs = 40) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(durationMs);
    } catch {
      // Ignore unsupported or user preference errors
    }
  }
}
