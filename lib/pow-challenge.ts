// lib/pow-challenge.ts - FINAL SECURED + IP/UA BINDING
import { createHmac, createHash, randomBytes, timingSafeEqual } from 'crypto';

const CHALLENGE_SECRET = process.env.CHALLENGE_SECRET;
const CHALLENGE_TTL_MS = 60_000;   // 60 detik
const DIFFICULTY = 4;

interface ChallengePayload {
  seed: string;
  exp: number;
  difficulty: number;
  ip: string;
  ua: string; // hash UA, bukan UA full biar gak panjang
}

function base64url(input: string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function base64urlDecode(input: string): string {
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

function hashUA(ua: string): string {
  // hash UA biar gak bocorin UA asli di JWT, cukup 16 char
  return createHash('sha256').update(ua || '').digest('hex').substring(0, 16);
}

function getClientIp(req?: Request): string {
  if (!req) return '127.0.0.1';
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export function generateChallenge(req?: Request): { challenge: string; seed: string; difficulty: number } {
  if (!CHALLENGE_SECRET) throw new Error('CHALLENGE_SECRET tidak tersedia');

  const ip = getClientIp(req);
  const uaRaw = req?.headers.get('user-agent') || '';
  const ua = hashUA(uaRaw);

  const seed = randomBytes(16).toString('hex');
  const payload: ChallengePayload = { 
    seed, 
    exp: Date.now() + CHALLENGE_TTL_MS, 
    difficulty: DIFFICULTY,
    ip,
    ua
  };
  
  const payloadEncoded = base64url(JSON.stringify(payload));
  const signature = createHmac('sha256', CHALLENGE_SECRET).update(payloadEncoded).digest('hex');

  return { challenge: `${payloadEncoded}.${signature}`, seed, difficulty: DIFFICULTY };
}

const usedChallenges = new Map<string, number>();
const USED_TTL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function cleanupUsed(now: number) {
  for (const [key, usedAt] of usedChallenges) {
    if (now - usedAt > USED_TTL_MS) usedChallenges.delete(key);
  }
}

export function verifyChallengeSolution(challenge: string, nonce: string, req?: Request): boolean {
  if (!CHALLENGE_SECRET || !challenge || !challenge.includes('.')) return false;

  const [payloadEncoded, signature] = challenge.split('.');
  if (!payloadEncoded || !signature) return false;

  // 1. Verify HMAC signature
  const expectedSig = createHmac('sha256', CHALLENGE_SECRET).update(payloadEncoded).digest('hex');
  const sigBuf = Buffer.from(signature, 'hex');
  const expBuf = Buffer.from(expectedSig, 'hex');
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;

  const now = Date.now();
  if (now - lastCleanup > 60_000) {
    cleanupUsed(now);
    lastCleanup = now;
  }

  // 2. Anti replay - challenge cuma bisa dipake 1x
  if (usedChallenges.has(signature)) return false;

  let payload: ChallengePayload;
  try {
    payload = JSON.parse(base64urlDecode(payloadEncoded));
  } catch {
    return false;
  }

  // 3. Cek expired
  if (now > payload.exp) return false;

  // 4. BINDING IP + UA - INI KUNCINYA
  if (req) {
    const currentIp = getClientIp(req);
    const currentUa = hashUA(req.headers.get('user-agent') || '');

    // IP harus sama (anti solver pihak ketiga)
    if (payload.ip !== currentIp) {
      console.log(`[PoW] IP MISMATCH: expected ${payload.ip} got ${currentIp}`);
      return false;
    }
    // UA harus sama (anti curl/postman reuse challenge dari browser)
    if (payload.ua !== currentUa) {
      console.log(`[PoW] UA MISMATCH`);
      return false;
    }
  }

  // 5. Cek PoW hash
  const hash = createHash('sha256').update(payload.seed + nonce).digest('hex');
  const isValid = hash.startsWith('0'.repeat(payload.difficulty));

  // 6. Kalau valid baru tandain used (biar brute force bisa coba lagi kalau salah nonce)
  if (isValid) {
    usedChallenges.set(signature, now);
  }

  return isValid;
}