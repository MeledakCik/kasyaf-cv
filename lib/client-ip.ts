// Order matters: headers set by the hosting edge first; cf-connecting-ip last
// because any client can send it when the site is not behind Cloudflare.
export function getClientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get('x-vercel-forwarded-for')?.split(',')[0].trim() ||
    h.get('x-real-ip')?.trim() ||
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    h.get('cf-connecting-ip')?.trim() ||
    (req as Request & { ip?: string }).ip ||
    '127.0.0.1'
  );
}

/**
 * Bound a Map used as an in-memory limiter. Evicts the OLDEST entries instead of
 * clear(): clearing lets an attacker reset everyone's counters just by
 * flooding enough unique keys.
 */
export function capMap<K, V>(map: Map<K, V>, max: number): void {
  if (map.size <= max) return;
  let excess = map.size - Math.floor(max * 0.9);
  for (const k of map.keys()) {
    if (excess-- <= 0) break;
    map.delete(k);
  }
}
