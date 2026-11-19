// lib/origin-guard.ts - FINAL SECURED ORIGIN & CSRF GUARD
import { NextResponse } from 'next/server';

function normalizeOrigin(url: string | undefined | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.origin;
  } catch {
    return null;
  }
}

function getAllowedOrigins(): string[] {
  const allowed = new Set<string>();

  // 1. Domain Utama dari Environment Variable
  const siteUrl = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (siteUrl) allowed.add(siteUrl);

  const appUrl = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL);
  if (appUrl) allowed.add(appUrl);

  // Domain produksi (apex + www). Bisa ditambah lewat ALLOWED_ORIGINS="https://a.com,https://b.com"
  for (const o of [
    'https://kasyaf.id',
    'https://www.kasyaf.id',
    'https://kasyaf-cv.my.id',
    'https://www.kasyaf-cv.my.id',
    ...(process.env.ALLOWED_ORIGINS || '').split(','),
  ]) {
    const n = normalizeOrigin(o.trim());
    if (n) allowed.add(n);
  }

  // 2. Vercel System Deployment URL (Preview & Production)
  if (process.env.VERCEL_URL) {
    const vercelOrigin = normalizeOrigin(process.env.VERCEL_URL);
    if (vercelOrigin) allowed.add(vercelOrigin);
  }

  // 3. Fallback Khusus Development (Localhost)
  if (process.env.NODE_ENV !== 'production') {
    allowed.add('http://localhost:3000');
    allowed.add('http://127.0.0.1:3000');
    allowed.add('http://localhost:3001');
  }

  return Array.from(allowed);
}

function extractOrigin(url: string | null): string | null {
  return normalizeOrigin(url);
}

/**
 * Host yang dituju request ini (di Vercel: x-forwarded-host diisi platform).
 * Browser tidak mengizinkan halaman lain memalsukan header Origin, jadi
 * "Origin.host === host tujuan" berarti request datang dari situs ini sendiri.
 */
function requestHost(request: Request): string | null {
  const raw = request.headers.get('x-forwarded-host') || request.headers.get('host');
  return raw ? raw.split(',')[0].trim().toLowerCase() : null;
}

export function validateOrigin(request: Request): NextResponse | null {
  const method = request.method.toUpperCase();
  
  // Method safe (GET, HEAD, OPTIONS) diizinkan tanpa cek CSRF Origin
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null;
  }

  const allowedOrigins = getAllowedOrigins();
  const originHeader = extractOrigin(request.headers.get('origin'));
  const refererOrigin = extractOrigin(request.headers.get('referer'));
  
  // Utamakan Header Origin, jika tidak ada fallback ke Referer
  const effectiveOrigin = originHeader || refererOrigin;

  if (!effectiveOrigin) {
    return NextResponse.json(
      { error: 'Missing Origin/Referer header' },
      { status: 403 }
    );
  }

  // 1) Same-origin: aman di domain/port/IP mana pun (custom domain, www, LAN saat tes di HP)
  const host = requestHost(request);
  const sameOrigin = !!host && new URL(effectiveOrigin).host.toLowerCase() === host;

  // 2) Atau ada di whitelist eksplisit
  const isAllowed = sameOrigin || allowedOrigins.some((allowed) => allowed === effectiveOrigin);

  if (!isAllowed) {
    console.warn(`[CSRF Guard] Blocked Request from Origin: ${effectiveOrigin} | Allowed:`, allowedOrigins);
    return NextResponse.json(
      { error: 'Origin not allowed' },
      { status: 403 }
    );
  }

  return null;
}