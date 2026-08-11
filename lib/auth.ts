// lib/auth.ts - FINAL v5 FIX 3 ARGS + BACKWARD COMPAT (EDGE & NODE COMPATIBLE)
const SECRET_KEY = process.env.COOKIE_SECRET;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || process.env.COOKIE_SECRET;
export const DEVICE_ID_COOKIE = 'device_id';

const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || '3600');

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  try {
    const a = fromHex(aHex);
    const b = fromHex(bHex);
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  } catch {
    return false;
  }
}

async function hmacSha256Hex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return toHex(sig);
}

function base64urlEncode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64, 'base64').toString('utf8');
  }
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function generateDeviceId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toHex(bytes.buffer);
}

interface SessionPayload {
  sid: string;
  did: string;
  iat: number;
  exp: number;
  fp: string;
}

export async function signSessionWithDevice(
  rawSessionId: string,
  deviceId: string,
  userAgent: string = ''
): Promise<string> {
  if (!SECRET_KEY) throw new Error('COOKIE_SECRET tidak tersedia');
  const now = Date.now();
  const payload: SessionPayload = {
    sid: rawSessionId,
    did: (await hmacSha256Hex(SECRET_KEY, deviceId)).slice(0, 16),
    iat: now,
    exp: now + SESSION_MAX_AGE * 1000,
    fp: (await hmacSha256Hex(SECRET_KEY, userAgent)).slice(0, 16),
  };
  const encoded = base64urlEncode(JSON.stringify(payload));
  const sig = await hmacSha256Hex(SECRET_KEY, encoded);
  return `${encoded}.${sig}`;
}

export async function verifySessionWithDevice(
  signedValue: string | undefined,
  deviceId: string | undefined,
  userAgent: string = ''
): Promise<string | null> {
  if (!SECRET_KEY) throw new Error('COOKIE_SECRET tidak tersedia');
  if (!signedValue || !signedValue.includes('.') || !deviceId) return null;
  const [encoded, signature] = signedValue.split('.');
  if (!encoded || !signature) return null;

  const expectedSig = await hmacSha256Hex(SECRET_KEY, encoded);
  if (!timingSafeEqualHex(signature, expectedSig)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(base64urlDecode(encoded));
  } catch {
    return null;
  }

  if (Date.now() > payload.exp) return null;

  const expectedDid = (await hmacSha256Hex(SECRET_KEY, deviceId)).slice(0, 16);
  if (!timingSafeEqualHex(payload.did, expectedDid)) return null;

  if (userAgent) {
    const expectedFp = (await hmacSha256Hex(SECRET_KEY, userAgent)).slice(0, 16);
    if (!timingSafeEqualHex(payload.fp, expectedFp)) return null;
  }

  return payload.sid;
}

export async function verifySignedData(signedValue: string | undefined): Promise<string | null> {
  if (!SECRET_KEY) throw new Error('COOKIE_SECRET tidak tersedia');
  if (!signedValue || !signedValue.includes('.')) return null;

  try {
    const [encoded] = signedValue.split('.');
    const payload = JSON.parse(base64urlDecode(encoded));
    if (payload.sid && payload.exp) return payload.sid;
  } catch {}

  const [data, sig] = signedValue.split('.');
  const expected = await hmacSha256Hex(SECRET_KEY, data);
  return timingSafeEqualHex(sig, expected) ? data : null;
}

interface InternalTokenPayload {
  sid: string;
  path: string;
  exp: number;
}

export async function signInternalToken(sessionId: string, pathname: string): Promise<string> {
  const secret = INTERNAL_API_SECRET || SECRET_KEY;
  if (!secret) throw new Error('INTERNAL_API_SECRET atau COOKIE_SECRET tidak tersedia');

  const sid = (await hmacSha256Hex(secret, sessionId)).slice(0, 16);
  const payload: InternalTokenPayload = { sid, path: pathname, exp: Date.now() + 30_000 };
  const encoded = base64urlEncode(JSON.stringify(payload));
  const sig = await hmacSha256Hex(secret, encoded);
  return `${encoded}.${sig}`;
}

export async function verifyInternalToken(
  token: string | null,
  sessionIdOrPathname: string | null,
  pathnameOptional?: string | null
): Promise<InternalTokenPayload | null> {
  const secret = INTERNAL_API_SECRET || SECRET_KEY;
  if (!secret || !token || !token.includes('.')) return null;

  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return null;

  const expected = await hmacSha256Hex(secret, encoded);
  if (!timingSafeEqualHex(sig, expected)) return null;

  try {
    const payload: InternalTokenPayload = JSON.parse(base64urlDecode(encoded));
    if (Date.now() > payload.exp) return null;

    // MODE BARU: verifyInternalToken(token, sessionId, pathname)
    if (pathnameOptional) {
      const sessionId = sessionIdOrPathname!;
      const expectedSid = (await hmacSha256Hex(secret, sessionId)).slice(0, 16);
      if (!timingSafeEqualHex(payload.sid, expectedSid)) return null;
      if (payload.path !== pathnameOptional) return null;
      return payload;
    }

    // MODE LAMA: verifyInternalToken(token, pathname)
    if (sessionIdOrPathname?.startsWith('/')) {
      if (payload.path !== sessionIdOrPathname) return null;
      return payload;
    }

    // Fallback dipanggil dengan sessionId saja
    return payload;
  } catch {
    return null;
  }
}

export async function hmacIdentifier(secret: string, data: string): Promise<string> {
  return hmacSha256Hex(secret, data);
}