import { NextResponse } from 'next/server';

function normalizeOrigin(url: string | undefined | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function getAllowedOrigins(): string[] {
  const origins = [normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL)].filter(Boolean) as string[];

  if (process.env.VERCEL_URL) {
    const vercelOrigin = normalizeOrigin(`https://${process.env.VERCEL_URL}`);
    if (vercelOrigin) origins.push(vercelOrigin);
  }

  return origins;
}

function extractOrigin(url: string | null): string | null {
  return normalizeOrigin(url);
}

export function validateOrigin(request: Request): NextResponse | null {
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null;
  }

  const allowedOrigins = getAllowedOrigins();
  const originHeader = extractOrigin(request.headers.get('origin'));
  const refererOrigin = extractOrigin(request.headers.get('referer'));
  const effectiveOrigin = originHeader || refererOrigin;

  if (!effectiveOrigin) {
    return NextResponse.json({ error: 'Missing Origin header' }, { status: 403 });
  }

  if (!allowedOrigins.includes(effectiveOrigin)) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 });
  }

  return null;
}