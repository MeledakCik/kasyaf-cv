// proxy.ts - FIXED v9.5 (Root Matcher & Auto Session Issuance)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  verifySessionWithDevice,
  signSessionWithDevice,
  signInternalToken,
  hmacIdentifier
} from '@/lib/auth';
import { validateOrigin } from '@/lib/origin-guard';
import { getClientIp, capMap } from '@/lib/client-ip';

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
};

function getRateLimitConfig(pathname: string) {
  for (const [prefix, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(prefix)) return config;
  }
  // Pages are keyed per IP (see compositeId): leave room for shared NAT/campus IPs.
  return { window: 60_000, max: 300 };
}

interface RateEntry { count: number; lastReset: number; lastSeen: number; }
const rateLimitMap = new Map<string, RateEntry>();
let lastCleanup = Date.now();


// HONEYPOT: path yang cuma dicari hacker/bot eksploit (.env, .git, WordPress,
// phpMyAdmin, panel admin palsu, file backup...). Situs ini Next.js murni dan
// tidak punya halaman-halaman ini, jadi pengunjung asli tidak akan pernah kena.
// Dijawab paling awal (tanpa crypto/HMAC) supaya tetap murah saat dibanjiri.
const HONEYPOT = /^\/(?:\.env|\.git|\.svn|\.hg|\.aws|\.ssh|\.docker|\.vscode|\.idea|\.ds_store|\.htaccess|\.htpasswd|wp-|wordpress|xmlrpc|phpmyadmin|pma|adminer|admin|administrator|dashboard-admin|cpanel|webmail|cgi-bin|vendor\/|actuator|server-status|server-info|owa\/|boaform|hnap1|telescope|_ignition|solr\/|jenkins|console\/|config\.(?:json|ya?ml|php)|backup|dump\.sql|database\.sql|secret|private|api\/(?:admin|internal|v1\/users|debug))|\.(?:php\d?|asp|aspx|jsp|cgi|sql|bak|old|swp|ini|log|zip|tar|gz|rar)$/i;

const HONEYPOT_TEXT = 'yahahahha kamu kena prank';

function logSecurityEvent(type: string, req: NextRequest, extra: { pathname?: string } = {}) {
  const ip = getClientIp(req);
  console.warn(`[SECURITY] ${type} | ip=${ip} | path=${extra.pathname || req.nextUrl.pathname}`);
}


interface RateResult { ok: boolean; limit: number; remaining: number; resetSec: number; windowSec: number }

function getRateLimitConfigAndCheck(compositeId: string, pathname: string): RateResult {
  const now = Date.now();
  const config = getRateLimitConfig(pathname);
  capMap(rateLimitMap, 10000);
  let entry = rateLimitMap.get(compositeId);
  let ok = true;
  if (!entry || now - entry.lastReset > config.window) {
    entry = { count: 1, lastReset: now, lastSeen: now };
    rateLimitMap.set(compositeId, entry);
  } else if (now - entry.lastSeen < 10 && entry.count > 5) {
    ok = false; // burst: >5 requests within 10 ms
  } else {
    entry.count += 1;
    entry.lastSeen = now;
    ok = entry.count <= config.max;
  }
  return {
    ok,
    limit: config.max,
    remaining: Math.max(0, config.max - entry.count),
    resetSec: Math.max(1, Math.ceil((entry.lastReset + config.window - now) / 1000)),
    windowSec: Math.round(config.window / 1000),
  };
}

/** IETF RateLimit header fields (draft-ietf-httpapi-ratelimit-headers) + legacy X-RateLimit-*. */
function setRateLimitHeaders(res: NextResponse, rl: RateResult) {
  res.headers.set('RateLimit-Policy', `${rl.limit};w=${rl.windowSec}`);
  res.headers.set('RateLimit', `limit=${rl.limit}, remaining=${rl.remaining}, reset=${rl.resetSec}`);
  res.headers.set('X-RateLimit-Limit', String(rl.limit));
  res.headers.set('X-RateLimit-Remaining', String(rl.remaining));
  res.headers.set('X-RateLimit-Reset', String(rl.resetSec));
}

function isBot(req: NextRequest): boolean {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  // Bare 'google' was a free pass for any UA containing that word.
  const allowedCrawlers = [
    'googlebot', 'google-inspectiontool', 'googleother', 'adsbot-google', 'mediapartners-google',
    'apis-google', 'google-structured-data', 'storebot-google', 'bingbot', 'yandexbot', 'duckduckbot',
    'facebookexternalhit', 'twitterbot', 'linkedinbot', 'slackbot', 'discordbot', 'telegrambot', 'whatsapp',
  ];
  if (allowedCrawlers.some(b => ua.includes(b))) {
    return false;
  }
  if (!ua || ua.length < 8) return true;
  const knownScrapers = ['curl', 'wget', 'python', 'urllib', 'postman', 'insomnia', 'axios', 'node-fetch', 'scrapy', 'httpclient', 'go-http-client', 'java', 'libwww-perl', 'zgrab'];
  if (knownScrapers.some(bot => ua.includes(bot))) return true;
  const headlessSignatures = ['headlesschrome', 'phantomjs', 'selenium', 'puppeteer', 'playwright', 'rhino', 'electron', 'cypress', 'webdriver'];
  if (headlessSignatures.some(sig => ua.includes(sig))) return true;
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

function base64urlDecodeToJson(b64url: string): { iat?: number } | null {
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
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com`;
  const devConnect = isDev ? ' ws://localhost:* wss://localhost:* http://localhost:*' : '';
  return [
    `base-uri 'self'`, `default-src 'self'`, scriptSrc,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com`,
    `font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net https://unpkg.com`,
    `img-src 'self' data: blob: https:`,
    `connect-src 'self' https://kasyaf-ai-agent.my.id https://www.kasyaf-ai-agent.my.id https://*.githack.com https://*.githubusercontent.com https://api.groq.com https://cdn.jsdelivr.net https://unpkg.com https://lottie.host https://*.lottiefiles.com wss://*.sylvorlabs.com${devConnect}`,
    `media-src 'self' blob:`, `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'`, `worker-src 'self' blob: https://cdn.jsdelivr.net https://unpkg.com`,
    `manifest-src 'self'`,
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

const INTERNAL_HEADERS = ['x-internal-auth', 'x-session-id', 'x-nonce', 'content-security-policy'];

/**
 * Copy of the incoming request headers that is safe to forward:
 * - strips any client-supplied internal headers (only the proxy may set them)
 * - adds the CSP on the *request* too: Next.js reads the nonce from the request
 *   CSP header and stamps it on its own <script> tags. Without this, framework
 *   scripts carry no nonce and 'strict-dynamic' blocks them.
 */
function buildRequestHeaders(request: NextRequest, nonce: string): Headers {
  const headers = new Headers(request.headers);
  for (const h of INTERNAL_HEADERS) headers.delete(h);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', buildCsp(nonce));
  return headers;
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
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (pathname.startsWith('/api/')) {
    res.headers.set('Cache-Control', 'no-store');
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // BYPASS SEO
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt' || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  if (HONEYPOT.test(pathname)) {
    console.warn(`[SECURITY] HONEYPOT | ip=${getClientIp(request)} | ${request.method} ${pathname} | ua=${request.headers.get('user-agent') || '-'}`);
    return new NextResponse(HONEYPOT_TEXT, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  const nonce = generateNonce();
  const ua = request.headers.get('user-agent') || '';
  const ip = getClientIp(request);
  const isProd = process.env.NODE_ENV === 'production';
  const SECRET_KEY = process.env.COOKIE_SECRET || (isProd ? '' : 'dev-only-insecure-secret-change-me');
  // Fail closed: a missing/short secret in production would make every signed
  // cookie and internal token forgeable.
  if (!SECRET_KEY || (isProd && SECRET_KEY.length < 32)) {
    console.error('[SECURITY] COOKIE_SECRET missing or shorter than 32 chars');
    return new NextResponse('Service unavailable', { status: 503 });
  }

  const originErrorResponse = validateOrigin(request);
  if (originErrorResponse) {
    logSecurityEvent('ORIGIN_CSRF_BLOCKED', request, { pathname });
    setSecurityHeaders(originErrorResponse, nonce, pathname);
    return originErrorResponse;
  }

  if (Date.now() - lastCleanup > 60_000) {
    for (const [k, v] of rateLimitMap) {
      if (Date.now() - v.lastSeen > 5 * 60_000) rateLimitMap.delete(k);
    }
    lastCleanup = Date.now();
  }

  // FIX 1: kembalikan JSON untuk penolakan Bot
  if (isBot(request)) {
    logSecurityEvent('BOT_CRAWLER_BLOCKED', request, { pathname });
    const res = NextResponse.json({ error: 'Access Denied' }, { status: 403 });
    setSecurityHeaders(res, nonce, pathname);
    return res;
  }

  // Rate-limit key = IP (+ API route). It must NOT include the session cookie
  // or the User-Agent: visiting any page hands out a fresh session for free and
  // the UA is client-controlled, so either one let a single IP bypass the limit
  // on /api/chat-ai (unlimited paid LLM calls).
  const rlBucket = pathname.startsWith('/api/') ? pathname.split('/').slice(0, 3).join('/') : 'page';
  const compositeId = await hmacIdentifier(SECRET_KEY, `${ip}:${rlBucket}`);

  const rl = getRateLimitConfigAndCheck(compositeId, pathname);
  const isApi = pathname.startsWith('/api/');
  if (!rl.ok) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', request, { pathname });
    const res = NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    setSecurityHeaders(res, nonce, pathname);
    setRateLimitHeaders(res, rl);
    res.headers.set('Retry-After', String(rl.resetSec));
    return res;
  }

  const isPublicApi = PUBLIC_API_PREFIXES.some(p => pathname.startsWith(p));
  if (isPublicApi) {
    const reqHeaders = buildRequestHeaders(request, nonce);
    const res = NextResponse.next({ request: { headers: reqHeaders } });
    setSecurityHeaders(res, nonce, pathname);
    setRateLimitHeaders(res, rl);
    return res;
  }

  const isStaticAsset = pathname.startsWith('/_next') || pathname.startsWith('/images') || pathname === '/favicon.ico' || pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?)$/i);
  if (pathname.startsWith(VERIFY_PATH) || isStaticAsset) {
    const reqHeaders = buildRequestHeaders(request, nonce);
    const res = NextResponse.next({ request: { headers: reqHeaders } });
    setSecurityHeaders(res, nonce, pathname);
    return res;
  }

  // Pengecekan Endpoint API
  if (pathname.startsWith(API_PATH)) {
    const sessionId = request.cookies.get('__Host-session_id')?.value || request.cookies.get('session_id')?.value;
    const deviceId = request.cookies.get('__Host-device_id')?.value || request.cookies.get('device_id')?.value;
    const verifiedSid = await verifySessionWithDevice(sessionId, deviceId, ua);

    // FIX 2: kembalikan JSON jika Unauthorized
    if (!verifiedSid) {
      const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      setSecurityHeaders(res, nonce, pathname);
      setRateLimitHeaders(res, rl);
      return res;
    }
    const headers = buildRequestHeaders(request, nonce);
    headers.set('x-session-id', verifiedSid);
    headers.set('x-internal-auth', await signInternalToken(verifiedSid, pathname));
    const res = NextResponse.next({ request: { headers } });
    setSecurityHeaders(res, nonce, pathname);
    if (isApi) setRateLimitHeaders(res, rl);
    return res;
  }

  // Pengecekan Halaman Biasa (Landing Page)
  const deviceId = request.cookies.get('__Host-device_id')?.value || request.cookies.get('device_id')?.value;
  const sessionId = request.cookies.get('__Host-session_id')?.value || request.cookies.get('session_id')?.value;
  let rawSessionId = await verifySessionWithDevice(sessionId, deviceId, ua);

  const requestHeaders = buildRequestHeaders(request, nonce);

  // FIX 3: Auto-issue session jika belum ada, daripada langsung menendang visitor ke VERIFY_PATH
  let response: NextResponse;
  if (!rawSessionId) {
    const newRawSid = crypto.randomUUID().replace(/-/g, '');
    const newDeviceId = deviceId || crypto.randomUUID().replace(/-/g, '');
    const newSignedSession = await signSessionWithDevice(newRawSid, newDeviceId, ua);

    rawSessionId = newRawSid;
    requestHeaders.set('x-session-id', rawSessionId);
    requestHeaders.set('x-internal-auth', await signInternalToken(rawSessionId, pathname));
    response = NextResponse.next({ request: { headers: requestHeaders } });

    const cookieOptions = {
      path: '/',
      sameSite: 'strict' as const,
      httpOnly: true,
      maxAge: SESSION_MAX_AGE,
      secure: isProd,
    };

    if (isProd) {
      response.cookies.set('__Host-session_id', newSignedSession, cookieOptions);
      response.cookies.set('__Host-device_id', newDeviceId, cookieOptions);
    } else {
      response.cookies.set('session_id', newSignedSession, cookieOptions);
      response.cookies.set('device_id', newDeviceId, cookieOptions);
    }
  } else {
    let issuedAt = 0;
    if (sessionId) {
      const payload = base64urlDecodeToJson(sessionId.split('.')[0]);
      if (payload?.iat) issuedAt = payload.iat;
    }

    requestHeaders.set('x-session-id', rawSessionId);
    requestHeaders.set('x-internal-auth', await signInternalToken(rawSessionId, pathname));
    response = NextResponse.next({ request: { headers: requestHeaders } });

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
  }

  setSecurityHeaders(response, nonce, pathname);
  return response;
}

// FIX 4: Perluas matcher agar menangkap Halaman Utama & API
export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};