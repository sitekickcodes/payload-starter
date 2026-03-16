const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY ?? "";
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerifyResult {
  success: boolean;
  "error-codes"?: string[];
}

/**
 * Verify a Turnstile token server-side.
 * Returns true if valid, false otherwise.
 * If no secret key is configured, skips verification (dev mode).
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip?: string | null,
): Promise<boolean> {
  // Skip verification if not configured (local dev)
  if (!SECRET_KEY) return true;

  if (!token) return false;

  const res = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: SECRET_KEY,
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    }),
  });

  const data = (await res.json()) as TurnstileVerifyResult;
  return data.success;
}
