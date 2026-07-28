// app/api/session/route.ts - FINAL v5 FIX LOOP LOCALHOST + __Host- PROD ONLY + LOGGER
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { verifyChallengeSolution } from '@/lib/pow-challenge';
import { validateOrigin } from '@/lib/origin-guard';
import { signSessionWithDevice } from '@/lib/auth';

const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || '3600');

function randomHex(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function applySylvorHeaders(res: NextResponse): NextResponse {
  res.headers.set('Accept-CH', 'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Arch, Viewport-Width, Width, DPR');
  res.headers.set('Critical-CH', 'Sec-CH-UA, Sec-CH-UA-Mobile');
  res.headers.set('X-Cik-Guard', 'active');
  res.headers.delete('x-powered-by');
  return res;
}

function logSecurityEvent(type: string, req: NextRequest, extra: any = {}) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
  const ua = (req.headers.get('user-agent') || '').substring(0, 80);
  console.warn(`[SECURITY] ${type} | ip=${ip} | ua=${ua} |`, JSON.stringify(extra));
}

export async function POST(request: NextRequest) {
  const originError = validateOrigin(request);
  if (originError) {
    logSecurityEvent('ORIGIN_FAIL', request, { origin: request.headers.get('origin') });
    return applySylvorHeaders(originError as NextResponse);
  }

  if (!process.env.COOKIE_SECRET) {
    const res = NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    return applySylvorHeaders(res);
  }

  const body = await request.json().catch(() => ({}));
  const { dpr, challenge, nonce, solveTimeMs, automationFlags } = body;

  const powValid = verifyChallengeSolution(challenge, nonce, request as any);
  if (!powValid) {
    logSecurityEvent('POW_FAIL', request, { challenge: challenge?.substring(0, 30)+'...' });
    const res = NextResponse.json({ error: 'Challenge verification failed' }, { status: 403 });
    return applySylvorHeaders(res);
  }

  if (typeof solveTimeMs === 'number' && solveTimeMs < 50) {
    logSecurityEvent('BOT_FAST_SOLVE', request, { solveTimeMs });
    const res = NextResponse.json({ error: 'Suspicious solve timing' }, { status: 403 });
    return applySylvorHeaders(res);
  }

  const suspiciousFlags: string[] = Array.isArray(automationFlags)? automationFlags : [];
  if (suspiciousFlags.includes('webdriver') && suspiciousFlags.length >= 2) {
    logSecurityEvent('AUTOMATION_DETECTED', request, { flags: suspiciousFlags });
    const res = NextResponse.json({ error: 'Automation detected' }, { status: 403 });
    return applySylvorHeaders(res);
  }

  const ua = request.headers.get('user-agent') || '';
  // baca dua-duanya biar support migrasi
  const existingDeviceId = request.cookies.get('__Host-device_id')?.value || request.cookies.get('device_id')?.value;
  const deviceId = existingDeviceId || randomBytes(32).toString('hex');
  const rawSessionId = randomHex(32);
  const signedSessionId = await signSessionWithDevice(rawSessionId, deviceId, ua);

  const res = NextResponse.json({ ok: true });
  const isProd = process.env.NODE_ENV === 'production';

  const publicOpts = {
    path: '/',
    sameSite: 'strict' as const,
    secure: isProd,
    httpOnly: false,
    maxAge: SESSION_MAX_AGE,
  };

  res.cookies.set('dpr', String(dpr || 1), publicOpts);
  res.cookies.delete('surt');
  res.cookies.delete('did');
  res.cookies.delete('ckstoken');

  // === FIX PALING PENTING BIAR GAK LOOP ===
  if (isProd) {
    // PRODUCTION (Vercel): WAJIB __Host- + Secure true = paling aman anti subdomain hijack
    res.cookies.delete('device_id');
    res.cookies.delete('session_id');
    res.cookies.set('__Host-device_id', deviceId, { path:'/', sameSite:'strict', secure:true, httpOnly:true, maxAge: 30*86400 });
    res.cookies.set('__Host-session_id', signedSessionId, { path:'/', sameSite:'strict', secure:true, httpOnly:true, maxAge: SESSION_MAX_AGE });
    console.log(`[SESSION] OK PROD | ip=${request.headers.get('x-forwarded-for')?.split(',')[0]} | device=${deviceId.substring(0,8)}...`);
  } else {
    // DEV LOCALHOST: JANGAN pakai __Host- karena Chrome bakal drop kalau secure:false
    res.cookies.delete('__Host-device_id');
    res.cookies.delete('__Host-session_id');
    res.cookies.set('device_id', deviceId, { path:'/', sameSite:'strict', secure:false, httpOnly:true, maxAge: 30*86400 });
    res.cookies.set('session_id', signedSessionId, { path:'/', sameSite:'strict', secure:false, httpOnly:true, maxAge: SESSION_MAX_AGE });
    console.log(`[SESSION] OK DEV | ip=127.0.0.1 | device=${deviceId.substring(0,8)}...`);
  }

  return applySylvorHeaders(res);
}