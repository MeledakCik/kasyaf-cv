// proxy.ts - FINAL v9.2 (Hardened, Edge-Optimized & Integrated)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  verifySessionWithDevice, 
  signSessionWithDevice, 
  signInternalToken, 
  hmacIdentifier 
} from '@/lib/auth';
import { validateOrigin } from '@/lib/origin-guard';

const VERIFY_PATH = process.env.VERIFY_PATH || '/v2/shield-verify';
const API_PATH = process.env.API_PATH || '/api/';
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || '3600');
const SESSION_ROTATE_AFTER_MS = 15 * 60 * 1000;

const PUBLIC_API_PREFIXES = [
  '/api/health',
  '/api/public',
  '/api/challenge',
  '/api/session',
  '/api/log'
];

const RATE_LIMIT_CONFIG: Record<string, { window: number; max: number }> = {
  '/api/chat-ai': { window: 60_000, max: 20 },
  '/api/log': { window: 60_000, max: 15 },
  '/api/challenge': { window: 60_000, max: 120 },
  '/api/session': { window: 60_000, max: 60 },
  '/api/': { window: 60_000, max: 80 },
  '/': { window: 60_000, max: 150 },
};

function getRateLimitConfig(pathname: string) {
  for (const [prefix, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(prefix)) return config;
  }
  return { window: 60_000, max: 100 };
}

interface RateEntry { count: number; lastReset: number; lastSeen: number; }
const rateLimitMap = new Map<string, RateEntry>();
let lastCleanup = Date.now();

function logSecurityEvent(type: string, req: NextRequest, extra: any = {}) {
  const ip = getClientIp(req);
  console.warn(`[SECURITY] ${type} | ip=${ip} | path=${extra.pathname || req.nextUrl.pathname}`);
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    (req as any).ip ||
    '127.0.0.1'
  );
}

function getRateLimitConfigAndCheck(compositeId: string, pathname: string): boolean {
  const now = Date.now();
  const config = getRateLimitConfig(pathname);

  // Memory safety valve
  if (rateLimitMap.size > 10000) rateLimitMap.clear();

  const entry = rateLimitMap.get(compositeId);

  if (!entry || now - entry.lastReset > config.window) {
    rateLimitMap.set(compositeId, { count: 1, lastReset: now, lastSeen: now });
    return true;
  }

  // L7 Burst Mitigation
  if (now - entry.lastSeen < 10 && entry.count > 5) {
    return false;
  }

  entry.count += 1;
  entry.lastSeen = now;
  return entry.count <= config.max;
}

function isBot(req: NextRequest): boolean {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();

  // 1. Search Engine Bot Resmi
  if (['googlebot', 'bingbot', 'yandexbot', 'duckduckbot'].some(b => ua.includes(b))) {
    return false;
  }

  // 2. UA Kosong / Terlalu Pendek
  if (!ua || ua.length < 8) return true;

  // 3. Known Scrapers & CLI Tools
  const knownScrapers = [
    'curl', 'wget', 'python', 'urllib', 'postman', 'insomnia', 'axios', 'node-fetch',
    'scrapy', 'httpclient', 'go-http-client', 'java', 'libwww-perl', 'zgrab'
  ];
  if (knownScrapers.some(bot => ua.includes(bot))) return true;

  // 4. Headless Automation Tools
  const headlessSignatures = [
    'headlesschrome', 'phantomjs', 'selenium', 'puppeteer', 'playwright',
    'rhino', 'electron', 'cypress', 'webdriver'
  ];
  if (headlessSignatures.some(sig => ua.includes(sig))) return true;

  // 5. Header Integrity Check (Loloskan jika request RSC Next.js / Fetch internal)
  const isRsc = req.headers.has('x-nextjs-data') || req.headers.get('accept')?.includes('text/x-component');
  if (!isRsc) {
    const hasAccept = !!req.headers.get('accept');
    if (!hasAccept) return true;
  }

  return false;
}

function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecodeToJson(b64url: string): any {
  try {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(b64);
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0))));
  } catch {
    return null;
  }
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== 'production';
  const backendUrl = process.env.BACKEND_URL || 'https://melody-be-production.up.railway.app';

  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com`;

  return [
    `base-uri 'self'`,
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com`,
    `font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net https://unpkg.com`,
    `img-src 'self' data: blob: https:`,
    `connect-src 'self' ${backendUrl} https://kasyaf-ai-agent.my.id https://www.kasyaf-ai-agent.my.id https://*.githack.com https://*.githubusercontent.com https://api.groq.com https://cdn.jsdelivr.net https://unpkg.com https://lottie.host https://*.lottiefiles.com wss://*.sylvorlabs.com wss://${backendUrl.replace('https://', '')} ws://localhost:* wss://localhost:* http://localhost:* https://unpkg.com`,
    `media-src 'self' ${backendUrl} blob:`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `worker-src 'self' blob: https://cdn.jsdelivr.net https://unpkg.com`,
  ].join('; ');
}

function setSecurityHeaders(res: NextResponse, nonce: string, pathname: string = '') {
  res.headers.delete('x-powered-by');
  const isImage = pathname.startsWith('/_next/image') || pathname.match(/\.(png|jpg|webp|svg|woff2?)$/);

  res.headers.set('Content-Security-Policy', buildCsp(nonce));
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Cross-Origin-Embedder-Policy', isImage ? 'unsafe-none' : 'credentialless');
  res.headers.set('Cross-Origin-Resource-Policy', isImage ? 'cross-origin' : 'same-site');
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.headers.set('X-Cik-Guard', 'active');

  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
}

export async function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent') || '';
  const ip = getClientIp(request);
  const SECRET_KEY = process.env.COOKIE_SECRET || 'default-fallback-secret-key-32chars';
  const isProd = process.env.NODE_ENV === 'production';

  // ---------------------------------------------------------------------------
  // STEP 0: ORIGIN GUARD (CSRF PREVENTION FOR MUTATING REQUESTS)
  // ---------------------------------------------------------------------------
  const originErrorResponse = validateOrigin(request);
  if (originErrorResponse) {
    logSecurityEvent('ORIGIN_CSRF_BLOCKED', request, { pathname });
    setSecurityHeaders(originErrorResponse, nonce, pathname);
    return originErrorResponse;
  }

  // Cleanup Rate Limit Cache
  if (Date.now() - lastCleanup > 60_000) {
    for (const [k, v] of rateLimitMap) {
      if (Date.now() - v.lastSeen > 5 * 60_000) rateLimitMap.delete(k);
    }
    lastCleanup = Date.now();
  }

  // ---------------------------------------------------------------------------
  // STEP 1: ANTI-BOT & CRAWLER CHECK
  // ---------------------------------------------------------------------------
  if (isBot(request)) {
    logSecurityEvent('BOT_CRAWLER_BLOCKED', request, { pathname });
    const res = new NextResponse('Access Denied', { status: 403 });
    setSecurityHeaders(res, nonce, pathname);
    return res;
  }

  // ---------------------------------------------------------------------------
  // STEP 2: RATE LIMITING CHECK
  // ---------------------------------------------------------------------------
  const isPublicChallenge = pathname.startsWith('/api/challenge') || pathname.startsWith('/api/session');
  const sessionIdRaw = request.cookies.get('__Host-session_id')?.value || request.cookies.get('session_id')?.value || 'no-session';
  const compositeId = await hmacIdentifier(SECRET_KEY, isPublicChallenge ? `${ip}:${pathname}` : `${ip}:${ua}:${sessionIdRaw}`);

  if (!getRateLimitConfigAndCheck(compositeId, pathname)) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', request, { pathname });
    const res = new NextResponse('Too Many Requests', { status: 429 });
    setSecurityHeaders(res, nonce, pathname);
    return res;
  }

  // ---------------------------------------------------------------------------
  // STEP 3: PUBLIC API BYPASS
  // ---------------------------------------------------------------------------
  const isPublicApi = PUBLIC_API_PREFIXES.some(p => pathname.startsWith(p));
  if (isPublicApi) {
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set('x-nonce', nonce);
    const res = NextResponse.next({ request: { headers: reqHeaders } });
    setSecurityHeaders(res, nonce, pathname);
    return res;
  }

  // ---------------------------------------------------------------------------
  // STEP 4: STATIC ASSETS & SHIELD VERIFY BYPASS
  // ---------------------------------------------------------------------------
  const isStaticAsset = pathname.startsWith('/_next') || 
                        pathname.startsWith('/images') || 
                        pathname === '/favicon.ico' || 
                        pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?)$/i);

  if (pathname.startsWith(VERIFY_PATH) || isStaticAsset) {
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set('x-nonce', nonce);
    const res = NextResponse.next({ request: { headers: reqHeaders } });
    setSecurityHeaders(res, nonce, pathname);
    return res;
  }

  // ---------------------------------------------------------------------------
  // STEP 5: PROTECTED API ENDPOINTS
  // ---------------------------------------------------------------------------
  if (pathname.startsWith(API_PATH)) {
    const sessionId = request.cookies.get('__Host-session_id')?.value || request.cookies.get('session_id')?.value;
    const deviceId = request.cookies.get('__Host-device_id')?.value || request.cookies.get('device_id')?.value;
    const verifiedSid = await verifySessionWithDevice(sessionId, deviceId, ua);

    if (!verifiedSid) {
      const res = new NextResponse('Unauthorized', { status: 401 });
      setSecurityHeaders(res, nonce, pathname);
      return res;
    }

    const headers = new Headers(request.headers);
    headers.set('x-nonce', nonce);
    headers.set('x-session-id', verifiedSid);
    headers.set('x-internal-auth', await signInternalToken(verifiedSid, pathname));

    const res = NextResponse.next({ request: { headers } });
    setSecurityHeaders(res, nonce, pathname);
    return res;
  }

  // ---------------------------------------------------------------------------
  // STEP 6: PAGE AUTHENTICATION FLOW
  // ---------------------------------------------------------------------------
  const deviceId = request.cookies.get('__Host-device_id')?.value || request.cookies.get('device_id')?.value;
  const sessionId = request.cookies.get('__Host-session_id')?.value || request.cookies.get('session_id')?.value;
  const rawSessionId = await verifySessionWithDevice(sessionId, deviceId, ua);

  if (!rawSessionId) {
    logSecurityEvent('PAGE_NO_SESSION_REDIRECT', request, { pathname });
    const response = NextResponse.redirect(new URL(VERIFY_PATH, request.url));
    ['session_id', 'device_id', '__Host-session_id', '__Host-device_id'].forEach(c => response.cookies.delete(c));
    setSecurityHeaders(response, nonce, pathname);
    return response;
  }

  let issuedAt = 0;
  if (sessionId) {
    const payload = base64urlDecodeToJson(sessionId.split('.')[0]);
    if (payload?.iat) issuedAt = payload.iat;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('x-session-id', rawSessionId);
  // FIX: Mengirim rawSessionId yang valid ke signInternalToken
  requestHeaders.set('x-internal-auth', await signInternalToken(rawSessionId, pathname));

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Session Rotation
  if (Date.now() - issuedAt > SESSION_ROTATE_AFTER_MS) {
    const newRaw = crypto.randomUUID().replace(/-/g, '');
    const newSigned = await signSessionWithDevice(newRaw, deviceId || '', ua);

    if (isProd) {
      response.cookies.set('__Host-session_id', newSigned, { path: '/', sameSite: 'strict', secure: true, httpOnly: true, maxAge: SESSION_MAX_AGE });
      response.cookies.delete('session_id');
    } else {
      response.cookies.set('session_id', newSigned, { path: '/', sameSite: 'strict', secure: false, httpOnly: true, maxAge: SESSION_MAX_AGE });
    }
  }

  setSecurityHeaders(response, nonce, pathname);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/webpack-hmr).*)',
  ],
};