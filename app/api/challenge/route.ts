import { NextRequest, NextResponse } from 'next/server';
import { generateChallenge } from '@/lib/pow-challenge';

const challengeHits = new Map<string, { count: number, reset: number }>();
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kasyaf-cv.my.id';

function applySylvorHeaders(res: NextResponse): NextResponse {
  res.headers.set('Accept-CH', 'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform');
  res.headers.set('Critical-CH', 'Sec-CH-UA, Sec-CH-UA-Mobile');
  res.headers.set('Accept-CH-Lifetime', '86400');
  res.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'same-origin');
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

    const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';
    const secFetchMode = req.headers.get('sec-fetch-mode');
    const accept = req.headers.get('accept') || '';

    // === FIX 1: WHITELIST BOT - JANGAN DI-BLOCK ===
    const isBot = userAgent.includes('googlebot') ||
                  userAgent.includes('google-inspectiontool') ||
                  userAgent.includes('bingbot') ||
                  userAgent.includes('chrome-lighthouse') ||
                  userAgent.includes('gtmetrix');

    if (isBot) {
      // Kasih challenge dummy biar gak error tapi gak usah POW
      const res = NextResponse.json(
        { challenge: 'bot-bypass', seed: 'bot', difficulty: 0, bot: true },
        { headers: { 'Cache-Control': 'no-store' } }
      );
      return applySylvorHeaders(res);
    }

    // === FIX 2: ANTI DIRECT ACCESS - TAPI IZININ NAVIGATE KALAU BUKAN FETCH API ===
    // Yang diblock cuma kalau buka /api/challenge langsung di browser
    const isDirectApiAccess = req.nextUrl.pathname === '/api/challenge' &&
                              secFetchMode === 'navigate' &&
                              accept.includes('text/html');

    if (isDirectApiAccess) {
      const res = NextResponse.json({ error: 'Direct access not allowed - fetch only' }, { status: 403 });
      return applySylvorHeaders(res);
    }

    // Rate limit tetep jalan
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const now = Date.now();
    const entry = challengeHits.get(ip);

    if (!entry || now - entry.reset > 60_000) {
      challengeHits.set(ip, { count: 1, reset: now });
    } else {
      entry.count++;
      if (entry.count > 20) {
        const res = NextResponse.json({ error: 'Too many requests' }, { status: 429 });
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