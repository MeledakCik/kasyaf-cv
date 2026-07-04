import { NextResponse } from 'next/server';
import { randomBytes, createHmac } from 'crypto';
import { verifyChallengeSolution } from '@/lib/pow-challenge';
import { validateOrigin } from '@/lib/origin-guard';

const SECRET_KEY = process.env.COOKIE_SECRET;

function randomHex(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export async function POST(request: Request) {
  const originError = validateOrigin(request);
  if (originError) return originError;

  if (!SECRET_KEY) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const { dpr, challenge, nonce, solveTimeMs, automationFlags } = body;

  const powValid = verifyChallengeSolution(challenge, nonce);
  if (!powValid) {
    return NextResponse.json({ error: 'Challenge verification failed' }, { status: 403 });
  }
  if (typeof solveTimeMs === 'number' && solveTimeMs < 50) {
    return NextResponse.json({ error: 'Suspicious solve timing' }, { status: 403 });
  }
  const suspiciousFlags: string[] = Array.isArray(automationFlags) ? automationFlags : [];
  if (suspiciousFlags.includes('webdriver') && suspiciousFlags.length >= 2) {
    return NextResponse.json({ error: 'Automation detected' }, { status: 403 });
  }

  const ua = request.headers.get('user-agent') || '';
  const fingerprint = Buffer.from(ua).toString('base64').substring(0, 16);
  const timestamp = Date.now().toString();
  const cookieHeader = request.headers.get('cookie') || '';
  const existingDeviceId = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('device_id='))
    ?.split('=')[1];

  const deviceId = existingDeviceId || randomBytes(32).toString('hex');
  const rawSessionId = randomHex(32);
  const signature = createHmac('sha256', SECRET_KEY).update(`${rawSessionId}:${deviceId}`).digest('hex');
  const signedSessionId = `${rawSessionId}.${signature}`;
  const res = NextResponse.json({ ok: true });
  const opts = { path: '/', sameSite: 'strict' as const, secure: true };
  res.cookies.set('device_id', deviceId, { ...opts, httpOnly: true, maxAge: 30 * 86400 });
  res.cookies.set('session_id', signedSessionId, { ...opts, httpOnly: true, maxAge: 3600 });
  res.cookies.set('__cik_fp', fingerprint, { ...opts, maxAge: 86400 });
  res.cookies.set('__cik_ts', timestamp, { ...opts, maxAge: 86400 });
  res.cookies.set('__cik_clearance', 'true', { ...opts, maxAge: 86400 });
  res.cookies.set('datr', randomHex(24), { ...opts, maxAge: 86400 });
  res.cookies.set('mid', randomHex(16), { ...opts, maxAge: 86400 });
  res.cookies.set('dpr', String(dpr || 1), { ...opts, maxAge: 86400 });
  res.cookies.set('csrftoken', randomHex(48), { ...opts, maxAge: 86400 });

  return res;
}