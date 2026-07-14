const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Enkripsi payload (digunakan di client-side)
 * Menggunakan Web Crypto API
 */
export async function encryptPayload(
  payload: object,
  keyString: string,
): Promise<string> {
  if (!keyString) {
    throw new Error(
      "Kunci enkripsi client tidak valid.",
    );
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(keyString),
    "AES-GCM",
    false,
    ["encrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12)); // IV 12-byte untuk AES-GCM
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(payload)),
  );

  // Gabungkan IV dan data terenkripsi, lalu encode ke Base64
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);

  return Buffer.from(combined).toString("base64");
}

/**
 * Dekripsi payload (digunakan di server-side)
 * Menggunakan Node.js Crypto
 */
export async function decryptPayload<T>(encryptedBase64: string): Promise<T> {
  const keyString = process.env.ENCRYPTION_KEY;
  if (!keyString) {
    throw new Error(
      "ENCRYPTION_KEY tidak valid.",
    );
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(keyString),
    "AES-GCM",
    false,
    ["decrypt"],
  );

  const encryptedBuffer = Buffer.from(encryptedBase64, "base64");
  const iv = encryptedBuffer.slice(0, 12);
  const encryptedData = encryptedBuffer.slice(12);

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedData,
  );

  return JSON.parse(new TextDecoder().decode(decryptedData)) as T;
}