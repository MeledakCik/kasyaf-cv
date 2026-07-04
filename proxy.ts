import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionWithDevice, signSessionWithDevice, signInternalToken, hmacIdentifier } from '@/lib/auth';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 100;
const ENTRY_TTL_MS = 5 * 60_000;
const CLEANUP_INTERVAL_MS = 60_000;
const MAX_MAP_SIZE = 50_000;
const SESSION_ROTATE_AFTER_MS = 15 * 60_000; 

interface RateEntry {
  count: number;
  lastReset: number;
  lastSeen: number;
}

const rateLimitMap = new Map<string, RateEntry>();
let lastCleanup = Date.now();

function cleanupRateLimitMap(now: number) {
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.lastSeen > ENTRY_TTL_MS) rateLimitMap.delete(key);
  }
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    const entries = Array.from(rateLimitMap.entries()).sort((a, b) => a[1].lastSeen - b[1].lastSeen);
    for (const [key] of entries.slice(0, rateLimitMap.size - MAX_MAP_SIZE)) rateLimitMap.delete(key);
  }
}

function checkRateLimit(compositeId: string): boolean {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    cleanupRateLimitMap(now);
    lastCleanup = now;
  }

  const entry = rateLimitMap.get(compositeId);
  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(compositeId, { count: 1, lastReset: now, lastSeen: now });
    return true;
  }

  entry.count += 1;
  entry.lastSeen = now;
  rateLimitMap.set(compositeId, entry);
  return entry.count <= RATE_LIMIT_MAX;
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== 'production';

  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval'`;

  return [
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline'`, // dilonggarkan khusus style, bukan script
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `connect-src 'self' https://lottie.host https://cdn.jsdelivr.net https://unpkg.com`,
    `worker-src 'self' blob:`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

export async function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  const withCsp = (res: NextResponse) => {
    res.headers.set('Content-Security-Policy', csp);
    res.headers.set('x-nonce', nonce);
    return res;
  };

  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent') || '';
  const SECRET_KEY = process.env.COOKIE_SECRET;
  if (!SECRET_KEY) throw new Error('COOKIE_SECRET tidak tersedia');

  if ([/curl/i, /wget/i, /python/i, /headless/i, /bot/i].some((p) => p.test(ua))) {
    return withCsp(new NextResponse('Access Denied', { status: 403 }));
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const sessionIdRaw = request.cookies.get('session_id')?.value || 'no-session';
  const compositeId = await hmacIdentifier(SECRET_KEY, `${ip}:${ua}:${sessionIdRaw}`);

  if (!checkRateLimit(compositeId)) {
    return withCsp(new NextResponse('Too Many Requests', { status: 429 }));
  }

  if (
    pathname.startsWith('/v2/shield-verify') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    // teruskan nonce lewat request header, supaya layout.tsx bisa membacanya
    const headers = new Headers(request.headers);
    headers.set('x-nonce', nonce);
    return withCsp(NextResponse.next({ request: { headers } }));
  }

  const sessionId = request.cookies.get('session_id')?.value;
  const deviceId = request.cookies.get('device_id')?.value;
  const timestamp = request.cookies.get('__cik_ts')?.value;
  const savedFingerprint = request.cookies.get('__cik_fp')?.value;

  const rawSessionId = await verifySessionWithDevice(sessionId, deviceId);
  const isValidSession = rawSessionId !== null;
  const isFingerprintValid = savedFingerprint === btoa(ua).substring(0, 16);
  const isExpired = timestamp ? Date.now() - parseInt(timestamp) > 86400000 : true;

  if (!isValidSession || !isFingerprintValid || isExpired) {
    const response = NextResponse.redirect(new URL('/v2/shield-verify', request.url));
    ['__cik_clearance', 'session_id', 'device_id', 'datr', 'mid', 'dpr', 'csrftoken', '__cik_fp', '__cik_ts'].forEach(
      (c) => response.cookies.delete(c)
    );
    return withCsp(response);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-internal-auth', await signInternalToken(sessionId as string, pathname));
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  const sessionIssuedAt = parseInt(timestamp || '0');
  if (Date.now() - sessionIssuedAt > SESSION_ROTATE_AFTER_MS) {
    const newRawSessionId = crypto.randomUUID().replace(/-/g, '');
    const newSignedSession = await signSessionWithDevice(newRawSessionId, deviceId as string);

    response.cookies.set('session_id', newSignedSession, {
      path: '/', sameSite: 'strict', secure: true, httpOnly: true, maxAge: 3600,
    });
    response.cookies.set('__cik_ts', Date.now().toString(), {
      path: '/', sameSite: 'strict', secure: true, maxAge: 86400,
    });
  }

  return withCsp(response);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};