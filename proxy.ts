import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionWithDevice, signSessionWithDevice, signInternalToken, hmacIdentifier } from '@/lib/auth';
declare global {
  var __cleanupInterval: NodeJS.Timeout | undefined;
}
const VERIFY_PATH = process.env.VERIFY_PATH || '/v2/shield-verify';
const API_PATH = process.env.API_PATH || '/api/';
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || '3600'); // 1 jam
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE * 1000;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100');
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
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
  const mediaSrc = `'self' ${backendUrl} http://localhost:8000`;

  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval'`;

  return [
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `media-src ${mediaSrc}`,
    `connect-src 'self' ${backendUrl} https://lottie.host https://cdn.jsdelivr.net https://unpkg.com https://huggingface.co https://*.huggingface.co https://raw.githubusercontent.com https://*.githubusercontent.com https://*.hf.co`,
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
  if (!SECRET_KEY) {
    console.error('[Security] COOKIE_SECRET tidak tersedia');
    return withCsp(new NextResponse('Server configuration error', { status: 500 }));
  }
  if ([/curl/i, /wget/i, /python/i, /headless/i, /bot/i].some((p) => p.test(ua))) {
    console.warn(`[Security] Bot blocked: ${ua.substring(0, 50)} - ${pathname}`);
    return withCsp(new NextResponse('Access Denied', { status: 403 }));
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const sessionIdRaw = request.cookies.get('session_id')?.value || 'no-session';
  const compositeId = await hmacIdentifier(SECRET_KEY, `${ip}:${ua}:${sessionIdRaw}`);

  if (!checkRateLimit(compositeId)) {
    console.warn(`[Security] Rate limit exceeded: ${ip} - ${pathname}`);
    return withCsp(new NextResponse('Too Many Requests', { status: 429 }));
  }
  if (
    pathname.startsWith(VERIFY_PATH) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith(API_PATH) ||
    pathname.includes('.')
  ) {
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
  const isExpired = timestamp ? Date.now() - parseInt(timestamp) > SESSION_MAX_AGE_MS : true;

  if (!isValidSession || !isFingerprintValid || isExpired) {
    console.info(`[Security] Session invalid/expired: ${ip} - ${pathname}`);
    const response = NextResponse.redirect(new URL(VERIFY_PATH, request.url));
    ['session_id', 'device_id', 'surt', 'did', 'dpr', 'ckstoken', '__cik_fp', '__cik_ts'].forEach(
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
      path: '/', sameSite: 'strict', secure: true, httpOnly: true,
      maxAge: SESSION_MAX_AGE,
    });
    response.cookies.set('__cik_ts', Date.now().toString(), {
      path: '/', sameSite: 'strict', secure: true,
      maxAge: SESSION_MAX_AGE,
    });
  }

  return withCsp(response);
}

if (typeof globalThis.__cleanupInterval === 'undefined') {
  globalThis.__cleanupInterval = setInterval(() => {
    cleanupRateLimitMap(Date.now());
  }, CLEANUP_INTERVAL_MS);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};