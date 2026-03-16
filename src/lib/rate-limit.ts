/**
 * Simple in-memory rate limiter for serverless.
 * Each instance tracks requests per IP within a sliding window.
 * State resets on cold starts — that's fine for form spam prevention.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically to avoid memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 min
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

/**
 * Check if a request should be rate-limited.
 * @param key - Unique identifier (typically IP address)
 * @param limit - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds (default 60s)
 * @returns { limited: boolean, remaining: number }
 */
export function rateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60_000,
): { limited: boolean; remaining: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1 };
  }

  entry.count++;

  if (entry.count > limit) {
    return { limited: true, remaining: 0 };
  }

  return { limited: false, remaining: limit - entry.count };
}
