const SECRET_KEY = process.env.COOKIE_SECRET;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;
const DEVICE_ID_COOKIE = 'device_id';

export function generateDeviceId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  return bytes;
}

function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const a = fromHex(aHex);
  const b = fromHex(bHex);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
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
export async function verifySignedData(signedValue: string | undefined): Promise<string | null> {
  if (!SECRET_KEY) throw new Error('COOKIE_SECRET tidak tersedia');
  if (!signedValue || !signedValue.includes('.')) return null;

  const [data, signatureHex] = signedValue.split('.');
  if (!data || !signatureHex) return null;

  const expectedHex = await hmacSha256Hex(SECRET_KEY, data);
  return timingSafeEqualHex(signatureHex, expectedHex) ? data : null;
}

interface InternalTokenPayload {
  sid: string;
  path: string;
  exp: number;
}

function base64url(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function base64urlDecode(input: string): string {
  return atob(input.replace(/-/g, '+').replace(/_/g, '/'));
}


export async function signSessionWithDevice(rawSessionId: string, deviceId: string): Promise<string> {
  if (!SECRET_KEY) throw new Error('COOKIE_SECRET tidak tersedia');
  const signature = await hmacSha256Hex(SECRET_KEY, `${rawSessionId}:${deviceId}`);
  return `${rawSessionId}.${signature}`;
}

export async function verifySessionWithDevice(
  signedValue: string | undefined,
  deviceId: string | undefined
): Promise<string | null> {
  if (!SECRET_KEY) throw new Error('COOKIE_SECRET tidak tersedia');
  if (!signedValue || !signedValue.includes('.') || !deviceId) return null;

  const [rawSessionId, signatureHex] = signedValue.split('.');
  if (!rawSessionId || !signatureHex) return null;

  const expectedHex = await hmacSha256Hex(SECRET_KEY, `${rawSessionId}:${deviceId}`);
  return timingSafeEqualHex(signatureHex, expectedHex) ? rawSessionId : null;
}

export async function signInternalToken(sessionId: string, pathname: string): Promise<string> {
  if (!INTERNAL_API_SECRET) throw new Error('INTERNAL_API_SECRET tidak tersedia');

  const sid = (await hmacSha256Hex(INTERNAL_API_SECRET, sessionId)).slice(0, 16);
  const payload: InternalTokenPayload = { sid, path: pathname, exp: Date.now() + 30_000 };
  const payloadEncoded = base64url(JSON.stringify(payload));
  const signature = await hmacSha256Hex(INTERNAL_API_SECRET, payloadEncoded);

  return `${payloadEncoded}.${signature}`;
}

export async function verifyInternalToken(token: string | null, pathname: string): Promise<InternalTokenPayload | null> {
  if (!INTERNAL_API_SECRET || !token || !token.includes('.')) return null;

  const [payloadEncoded, signature] = token.split('.');
  if (!payloadEncoded || !signature) return null;

  const expected = await hmacSha256Hex(INTERNAL_API_SECRET, payloadEncoded);
  if (!timingSafeEqualHex(signature, expected)) return null;

  let payload: InternalTokenPayload;
  try {
    payload = JSON.parse(base64urlDecode(payloadEncoded));
  } catch {
    return null;
  }

  if (Date.now() > payload.exp) return null;
  if (payload.path !== pathname) return null;

  return payload;
}

export async function hmacIdentifier(secret: string, data: string): Promise<string> {
  return hmacSha256Hex(secret, data);
}

export { DEVICE_ID_COOKIE };