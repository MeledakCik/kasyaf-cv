// app/api/challenge/route.ts - FINAL v3 FIXED + SYLVOR HEADERS + ANTI DIRECT ACCESS
import { NextRequest, NextResponse } from 'next/server';
import { generateChallenge } from '@/lib/pow-challenge';

const challengeHits = new Map<string, { count: number, reset: number }>();
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function applySylvorHeaders(res: NextResponse): NextResponse {
  res.headers.set('Accept-CH', 'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Arch, Viewport-Width, Width, DPR');
  res.headers.set('Critical-CH', 'Sec-CH-UA, Sec-CH-UA-Mobile');
  res.headers.set('Accept-CH-Lifetime', '86400');
  res.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  res.headers.set('Origin-Agent-Cluster', '?1');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'same-origin');
  res.headers.set('X-Cik-Guard', 'active');
  res.headers.set('X-Cik-Version', '2.1-secure');
  res.headers.delete('x-powered-by');
  return res;
}

function cleanup() {
  if (challengeHits.size > 5000) {
    const now = Date.now();
    for (const [k, v] of challengeHits) {
      if (now - v.reset > 120_000) challengeHits.delete(k);
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    cleanup();

    // === FIX ANTI DIRECT ACCESS - CHROME BARU ===
    const secFetchMode = req.headers.get('sec-fetch-mode');
    const secFetchSite = req.headers.get('sec-fetch-site');
    const accept = req.headers.get('accept') || '';

    // Address bar: sec-fetch-mode=navigate + sec-fetch-site=none + accept=text/html
    // Fetch dari JS: sec-fetch-mode=cors + sec-fetch-site=same-origin
    const isDirectNavigation =
      secFetchMode === 'navigate' ||
      (accept.includes('text/html') && (secFetchSite === 'none' ||!secFetchSite));

    if (isDirectNavigation) {
      const res = NextResponse.json({ error: 'Direct access not allowed - fetch only' }, { status: 403 });
      return applySylvorHeaders(res);
    }

    // === RATE LIMIT 20/menit per IP ===
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               req.headers.get('x-real-ip') ||
               '127.0.0.1';
    const now = Date.now();
    const entry = challengeHits.get(ip);

    if (!entry || now - entry.reset > 60_000) {
      challengeHits.set(ip, { count: 1, reset: now });
    } else {
      entry.count++;
      if (entry.count > 20) {
        const res = NextResponse.json({ error: 'Too many requests - slow down' }, { status: 429 });
        res.headers.set('Retry-After', '60');
        return applySylvorHeaders(res);
      }
    }

    const { challenge, seed, difficulty } = generateChallenge(req);

    const res = NextResponse.json(
      { challenge, seed, difficulty },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Access-Control-Allow-Origin': APP_URL,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
        }
      }
    );

    return applySylvorHeaders(res);

  } catch (e) {
    console.error('[Challenge Error]', e);
    const res = NextResponse.json({ error: 'Failed generate challenge' }, { status: 500 });
    return applySylvorHeaders(res);
  }
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', APP_URL);
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return applySylvorHeaders(res);
}