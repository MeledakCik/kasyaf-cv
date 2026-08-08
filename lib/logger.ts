// lib/logger.ts

interface RequestLike {
  headers?: {
    get?(key: string): string | null;
  };
}

/**
 * Log kejadian keamanan dengan IP dan User-Agent dari request
 * @param type - Jenis kejadian (misal: 'bruteforce', 'invalid_token')
 * @param req - Request object (Next.js atau standard)
 * @param extra - Data tambahan (optional)
 */
export function logSecurityEvent(
  type: string,
  req: RequestLike,
  extra: Record<string, unknown> = {}
): void {
  const ip =
    req.headers?.get?.("x-forwarded-for")?.split(",")[0] ||
    req.headers?.get?.("x-real-ip") ||
    "unknown";
  const ua =
    req.headers?.get?.("user-agent")?.substring(0, 80) || "no-ua";

  const log = {
    time: new Date().toISOString(),
    type,
    ip,
    ua,
    ...extra,
  };
  console.warn(`[SECURITY] ${type}`, JSON.stringify(log));
}