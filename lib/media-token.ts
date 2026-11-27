// lib/media-token.ts - Enkripsi alamat backend (AES-256-GCM)
//
// Browser tidak pernah melihat host backend (Railway). Yang dikirim ke client
// hanya token buram: base64url(iv || ciphertext+tag). Isinya { p: path, e: expiry }.
// Token dipalsukan / diubah 1 bit pun -> dekripsi gagal (GCM auth tag).

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 jam
const IV_LEN = 12;

let keyPromise: Promise<CryptoKey> | null = null;

function getKey(): Promise<CryptoKey> {
  if (!keyPromise) {
    const secret = process.env.MEDIA_TOKEN_SECRET || process.env.COOKIE_SECRET;
    if (!secret) throw new Error('MEDIA_TOKEN_SECRET/COOKIE_SECRET belum di-set');
    // Domain-separated: kunci ini berbeda dari kunci HMAC cookie walau secret sama.
    keyPromise = crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(`media-token:v1:${secret}`))
      .then((raw) => crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']));
  }
  return keyPromise;
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/** Enkripsi path backend (mis. "/downloads/abc.mp3") menjadi token buram. */
export async function sealMediaPath(path: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const data = new TextEncoder().encode(JSON.stringify({ p: path, e: Date.now() + TOKEN_TTL_MS }));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await getKey(), data));
  const out = new Uint8Array(IV_LEN + ct.length);
  out.set(iv);
  out.set(ct, IV_LEN);
  return b64urlEncode(out);
}

/** Buka token. null kalau palsu, rusak, kedaluwarsa, atau path tidak wajar. */
export async function openMediaToken(token: string): Promise<string | null> {
  if (!token || token.length > 2048 || !/^[A-Za-z0-9_-]+$/.test(token)) return null;
  try {
    const raw = b64urlDecode(token);
    if (raw.length <= IV_LEN + 16) return null;
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: raw.slice(0, IV_LEN) },
      await getKey(),
      raw.slice(IV_LEN),
    );
    const { p, e } = JSON.parse(new TextDecoder().decode(plain)) as { p?: unknown; e?: unknown };
    if (typeof p !== 'string' || typeof e !== 'number' || Date.now() > e) return null;
    // Hanya path relatif biasa: tidak boleh pindah host atau naik direktori.
    if (!p.startsWith('/') || p.startsWith('//') || p.includes('..') || p.includes('\\')) return null;
    return p;
  } catch {
    return null;
  }
}
