import { createHmac, createHash, randomBytes, timingSafeEqual } from 'crypto';

const CHALLENGE_SECRET = process.env.CHALLENGE_SECRET;
const CHALLENGE_TTL_MS = 60_000;   
const DIFFICULTY = 4;             

interface ChallengePayload {
  seed: string;
  exp: number;
  difficulty: number;
}

function base64url(input: string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function base64urlDecode(input: string): string {
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

export function generateChallenge(): { challenge: string; seed: string; difficulty: number } {
  if (!CHALLENGE_SECRET) throw new Error('CHALLENGE_SECRET tidak tersedia');

  const seed = randomBytes(16).toString('hex');
  const payload: ChallengePayload = { seed, exp: Date.now() + CHALLENGE_TTL_MS, difficulty: DIFFICULTY };
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

export function verifyChallengeSolution(challenge: string, nonce: string): boolean {
  if (!CHALLENGE_SECRET || !challenge || !challenge.includes('.')) return false;

  const [payloadEncoded, signature] = challenge.split('.');
  if (!payloadEncoded || !signature) return false;

  const expectedSig = createHmac('sha256', CHALLENGE_SECRET).update(payloadEncoded).digest('hex');
  const sigBuf = Buffer.from(signature, 'hex');
  const expBuf = Buffer.from(expectedSig, 'hex');
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;

  const now = Date.now();
  if (now - lastCleanup > 60_000) {
    cleanupUsed(now);
    lastCleanup = now;
  }

  if (usedChallenges.has(signature)) return false;
  usedChallenges.set(signature, now);

  let payload: ChallengePayload;
  try {
    payload = JSON.parse(base64urlDecode(payloadEncoded));
  } catch {
    return false;
  }

  if (now > payload.exp) return false;

  const hash = createHash('sha256').update(payload.seed + nonce).digest('hex');
  return hash.startsWith('0'.repeat(payload.difficulty));
}