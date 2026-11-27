// app/api/media/[token]/route.ts - Proxy streaming audio dari backend.
// Browser hanya bicara dengan domain ini; host backend tetap rahasia.
import { NextRequest } from 'next/server';
import { openMediaToken } from '@/lib/media-token';

export const runtime = 'nodejs';
export const maxDuration = 60;

const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');

// Header dari backend yang aman diteruskan (tanpa server/x-powered-by/via dll).
const PASS_HEADERS = [
  'content-type',
  'content-length',
  'content-range',
  'accept-ranges',
  'last-modified',
  'etag',
];

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const path = await openMediaToken(token);
  if (!path) return new Response('Not found', { status: 404 });

  const upstreamHeaders: Record<string, string> = {};
  const range = request.headers.get('range');
  if (range && /^bytes=\d*-\d*$/.test(range)) upstreamHeaders.range = range; // seek audio
  if (process.env.BACKEND_SHARED_SECRET) upstreamHeaders['x-backend-key'] = process.env.BACKEND_SHARED_SECRET;

  let upstream: Response;
  try {
    upstream = await fetch(`${BACKEND_URL}${path}`, {
      headers: upstreamHeaders,
      redirect: 'error', // jangan ikuti redirect ke host lain
      signal: request.signal,
    });
  } catch {
    return new Response('Bad gateway', { status: 502 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new Response('Not found', { status: upstream.status === 416 ? 416 : 404 });
  }

  const type = upstream.headers.get('content-type') || '';
  if (type && !/^(audio|video)\/|^application\/octet-stream/i.test(type)) {
    return new Response('Unsupported media', { status: 415 });
  }

  const headers = new Headers();
  for (const h of PASS_HEADERS) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }
  headers.set('Cache-Control', 'private, max-age=3600');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Content-Disposition', 'inline');

  return new Response(upstream.body, { status: upstream.status, headers });
}
