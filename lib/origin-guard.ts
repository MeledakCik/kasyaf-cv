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

  // Validasi apakah Origin berada di daftar Whitelist
  const isAllowed = allowedOrigins.some((allowed) => allowed === effectiveOrigin);

  if (!isAllowed) {
    console.warn(`[CSRF Guard] Blocked Request from Origin: ${effectiveOrigin} | Allowed:`, allowedOrigins);
    return NextResponse.json(
      { error: 'Origin not allowed' },
      { status: 403 }
    );
  }

  return null;
}