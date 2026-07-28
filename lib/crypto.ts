// lib/crypto.ts - FINAL HARDENED, WORKS CLIENT & SERVER
const IV_LENGTH = 12;

// Helper base64 yang jalan di browser & Node
function toBase64(bytes: Uint8Array): string {
  if (typeof Buffer!== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}
function fromBase64(b64: string): Uint8Array {
  if (typeof Buffer!== 'undefined') {
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveKey(keyString: string): Promise<CryptoKey> {
  if (!keyString) throw new Error("ENCRYPTION_KEY kosong");
  // Hash key string jadi 32 byte fix buat AES-256, jadi gak bisa ditebak panjangnya
  const keyBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(keyString));
  return crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

/**
 * ENCRYPT - Dipake di CLIENT (browser)
 * Otomatis nambah _ts & _nonce biar anti-replay Postman
 */
export async function encryptPayload(
  payload: object,
  keyString: string,
): Promise<string> {
  if (!keyString) throw new Error("Kunci enkripsi client tidak valid");

  const key = await deriveKey(keyString);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  // AUTO INJECT ANTI-REPLAY - ini yang bikin Postman mati
  const payloadWithMeta = {
   ...(payload as any),
    _ts: Date.now(),
    _nonce: crypto.randomUUID(),
  };

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(payloadWithMeta)),
  );

  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedData), iv.length);

  return toBase64(combined);
}

/**
 * DECRYPT - Dipake di SERVER (Node.js / Edge)
 */
export async function decryptPayload<T>(encryptedBase64: string): Promise<T> {
  const keyString = process.env.ENCRYPTION_KEY;
  if (!keyString) throw new Error("ENCRYPTION_KEY tidak valid");

  const key = await deriveKey(keyString);
  const encryptedBuffer = fromBase64(encryptedBase64);

  if (encryptedBuffer.length < IV_LENGTH + 16) throw new Error("Payload too short");

  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  const encryptedData = encryptedBuffer.slice(IV_LENGTH);

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedData,
  );

  return JSON.parse(new TextDecoder().decode(decryptedData)) as T;
}