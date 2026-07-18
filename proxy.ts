// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionWithDevice, signSessionWithDevice, signInternalToken, hmacIdentifier } from '@/lib/auth';

declare global {
  var __cleanupInterval: NodeJS.Timeout | undefined;
}
const VERIFY_PATH = process.env.VERIFY_PATH || '/v2/shield-verify';
const API_PATH = process.env.API_PATH || '/api/';
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || '3600');
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE * 1000;
const SESSION_ROTATE_AFTER_MS = 15 * 60_000;
const RATE_LIMIT_CONFIG: Record<string, { window: number; max: number }> = {
  '/api/chat-ai': { window: 60_000, max: 20 },
  '/api/': { window: 60_000, max: 100 },
  '/': { window: 60_000, max: 200 },
};

function getRateLimitConfig(pathname: string): { window: number; max: number } {
  for (const [prefix, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(prefix)) return config;
  }
  return { window: 60_000, max: 100 };
}

interface RateEntry {
  count: number;
  lastReset: number;
  lastSeen: number;
}

const rateLimitMap = new Map<string, RateEntry>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 60_000;
const ENTRY_TTL_MS = 5 * 60_000;
const MAX_MAP_SIZE = 50_000;

function cleanupRateLimitMap(now: number) {
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.lastSeen > ENTRY_TTL_MS) rateLimitMap.delete(key);
  }
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    const entries = Array.from(rateLimitMap.entries()).sort((a, b) => a[1].lastSeen - b[1].lastSeen);
    for (const [key] of entries.slice(0, rateLimitMap.size - MAX_MAP_SIZE)) rateLimitMap.delete(key);
  }
}

async function checkRateLimit(compositeId: string, pathname: string): Promise<boolean> {
  try {
    const now = Date.now();
    if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
      cleanupRateLimitMap(now);
      lastCleanup = now;
    }

    const config = getRateLimitConfig(pathname);
    const entry = rateLimitMap.get(compositeId);
    if (!entry || now - entry.lastReset > config.window) {
      rateLimitMap.set(compositeId, { count: 1, lastReset: now, lastSeen: now });
      return true;
    }

    entry.count += 1;
    entry.lastSeen = now;
    rateLimitMap.set(compositeId, entry);
    return entry.count <= config.max;
  } catch (err) {
    console.error('[RateLimit] Error:', err);
    return true; 
  }
}

function isBot(userAgent: string): boolean {
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  const isBrowser = /mozilla/.test(ua) && /(chrome|firefox|safari|edge|opera)/.test(ua);
  if (isBrowser) {
    const botIndicators = ['bot', 'crawler', 'spider', 'scraper', 'headless', 'phantom', 'selenium', 'puppeteer'];
    if (botIndicators.some(b => ua.includes(b))) {
      return true;
    }
    return false; 
  }

  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /headless/i, /phantom/i, /selenium/i, /puppeteer/i,
    /curl/i, /wget/i, /python/i, /java/i, /perl/i,
    /http-client/i, /axios/i, /fetch/i, /node-fetch/i,
    /postman/i, /insomnia/i, /bruno/i,
    /ahrefs/i, /semrush/i, /moz/i, /majestic/i,
    /facebookexternalhit/i, /twitterbot/i,
    /googlebot/i, /bingbot/i, /yandexbot/i,
    /slackbot/i, /telegrambot/i, /discordbot/i,
  ];
  return botPatterns.some(p => p.test(ua));
}

function logSecurityEvent(event: string, details: Record<string, any>) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    environment: process.env.NODE_ENV,
    ...details,
  };
  console.log(JSON.stringify(logEntry));
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== 'production';
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' 'wasm-unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;

  return [
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `media-src 'self' ${backendUrl}`,
    `connect-src 'self' ${backendUrl} https://api.groq.com https://*.huggingface.co https://lottie.host https://cdn.jsdelivr.net https://unpkg.com https://raw.githubusercontent.com https://*.githubusercontent.com https://*.hf.co`,
    `worker-src 'self' blob:`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

function setSecurityHeaders(res: NextResponse, nonce: string) {
  res.headers.set('Content-Security-Policy', buildCsp(nonce));
  res.headers.set('x-nonce', nonce);
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  if (process.env.NODE_ENV === 'production') {
    res.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
}

export async function proxy(request: NextRequest) {
  try {
    const nonce = generateNonce();
    const { pathname } = request.nextUrl;
    const ua = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const SECRET_KEY = process.env.COOKIE_SECRET;

    if (!SECRET_KEY) {
      console.error('[Security] COOKIE_SECRET tidak tersedia');
      const res = new NextResponse('Server configuration error', { status: 500 });
      setSecurityHeaders(res, nonce);
      return res;
    }

    if (isBot(ua)) {
      logSecurityEvent('BOT_BLOCKED', { ip, pathname, ua: ua.substring(0, 100) });
      const res = new NextResponse('Access Denied', { status: 403 });
      setSecurityHeaders(res, nonce);
      return res;
    }

    const sessionIdRaw = request.cookies.get('session_id')?.value || 'no-session';
    const compositeId = await hmacIdentifier(SECRET_KEY, `${ip}:${ua}:${sessionIdRaw}`);
    const isAllowed = await checkRateLimit(compositeId, pathname);

    if (!isAllowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip, pathname, sessionId: sessionIdRaw });
      const res = new NextResponse('Too Many Requests', { status: 429 });
      setSecurityHeaders(res, nonce);
      return res;
    }

    if (pathname.startsWith(API_PATH)) {
      const headers = new Headers(request.headers);
      headers.set('x-nonce', nonce);
      const sessionId = request.cookies.get('session_id')?.value || 'anonymous';
      headers.set('x-session-id', sessionId);
      const res = NextResponse.next({ request: { headers } });
      setSecurityHeaders(res, nonce);
      return res;
    }

    if (
      pathname.startsWith(VERIFY_PATH) ||
      pathname.startsWith('/_next') ||
      pathname.includes('.')
    ) {
      const headers = new Headers(request.headers);
      headers.set('x-nonce', nonce);
      const res = NextResponse.next({ request: { headers } });
      setSecurityHeaders(res, nonce);
      return res;
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
      logSecurityEvent('SESSION_INVALID', {
        ip,
        pathname,
        reason: !isValidSession ? 'invalid' : !isFingerprintValid ? 'fingerprint' : 'expired'
      });
      const response = NextResponse.redirect(new URL(VERIFY_PATH, request.url));
      ['session_id', 'device_id', 'surt', 'did', 'dpr', 'ckstoken', '__cik_fp', '__cik_ts'].forEach(
        (c) => response.cookies.delete(c)
      );
      setSecurityHeaders(response, nonce);
      return response;
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-internal-auth', await signInternalToken(sessionId as string, pathname));
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('x-session-id', sessionId as string);

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
      response.cookies.set('__cik_fp', btoa(ua).substring(0, 16), {
        path: '/', sameSite: 'strict', secure: true,
        maxAge: SESSION_MAX_AGE,
      });
    }

    setSecurityHeaders(response, nonce);
    return response;
  } catch (error) {
    console.error('[Proxy] Unhandled error:', error);
    const nonce = generateNonce();
    const res = new NextResponse('Internal Server Error', { status: 500 });
    setSecurityHeaders(res, nonce);
    return res;
  }
}

if (typeof globalThis.__cleanupInterval === 'undefined') {
  globalThis.__cleanupInterval = setInterval(() => {
    cleanupRateLimitMap(Date.now());
  }, CLEANUP_INTERVAL_MS);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};