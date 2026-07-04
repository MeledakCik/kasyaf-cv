import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const SECRET_KEY = process.env.COOKIE_SECRET;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function verifySignedData(signedValue: string | undefined): string | null {
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY tidak tersedia");
  }
  if (!signedValue || !signedValue.includes('.')) return null;
  const [data, signatureHex] = signedValue.split('.');
  const expectedHash = createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  const sigBuffer = Buffer.from(signatureHex, 'hex');
  const expBuffer = Buffer.from(expectedHash, 'hex');
  if (sigBuffer.length !== expBuffer.length) {
    return null;
  }
  return timingSafeEqual(sigBuffer, expBuffer) ? data : null;
}

function generateCompositeIdentifier(request: NextRequest): string {
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY tidak tersedia");
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const ua = request.headers.get('user-agent') || 'default';
  const sessionId = request.cookies.get('session_id')?.value || 'no-session';
  return createHmac('sha256', SECRET_KEY)
    .update(`${ip}:${ua}:${sessionId}`)
    .digest('hex');
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent') || '';
  if ([/curl/i, /wget/i, /python/i, /headless/i, /bot/i].some(p => p.test(ua))) {
    return new NextResponse('Access Denied', { status: 403 });
  }
  const compositeId = generateCompositeIdentifier(request);
  const now = Date.now();
  const limitData = rateLimitMap.get(compositeId) || { count: 0, lastReset: now };
  if (now - limitData.lastReset > 60000) {
    limitData.count = 1;
    limitData.lastReset = now;
  } else {
    limitData.count += 1;
  }
  rateLimitMap.set(compositeId, limitData);
  if (limitData.count > 100) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  if (
    pathname.startsWith('/v2/shield-verify') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  const sessionId = request.cookies.get('session_id')?.value;
  const timestamp = request.cookies.get('__cik_ts')?.value;
  const savedFingerprint = request.cookies.get('__cik_fp')?.value;
  
  const isValidSession = sessionId && verifySignedData(sessionId) !== null;
  const isFingerprintValid = savedFingerprint === Buffer.from(ua).toString('base64').substring(0, 16);
  const isExpired = timestamp ? (Date.now() - parseInt(timestamp) > 86400000) : true;
  if (!isValidSession || !isFingerprintValid || isExpired) {
    const response = NextResponse.redirect(new URL('/v2/shield-verify', request.url));
    ['__cik_clearance', 'session_id', 'datr', 'mid', 'dpr', 'csrftoken', '__cik_fp', '__cik_ts']
      .forEach(c => response.cookies.delete(c));
    return response;
  }
  const requestHeaders = new Headers(request.headers);
  if (!INTERNAL_API_SECRET) {
    throw new Error("FATAL ERROR: INTERNAL_API_SECRET tidak ditemukan di environment variables.");
  }
  requestHeaders.set('x-internal-auth', INTERNAL_API_SECRET);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}