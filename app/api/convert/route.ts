import { NextRequest, NextResponse } from 'next/server';
import { sealMediaPath } from '@/lib/media-token';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const TIMEOUT = 120000;
const MAX_URL_LENGTH = 2048;

const PRIVATE_V4 = [
  /^0\./, /^10\./, /^127\./, /^169\.254\./, /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, /^198\.1[89]\./, /^2(2[4-9]|[3-5]\d)\./,
];

function validatePublicUrl(raw: string): string | null {
  if (raw.length > MAX_URL_LENGTH) return 'URL terlalu panjang';
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return 'Format URL salah';
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return 'Protokol URL tidak didukung';
  if (u.username || u.password) return 'URL tidak boleh berisi kredensial';
  if (u.port && u.port !== '80' && u.port !== '443') return 'Port tidak diizinkan';

  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  if (!host.includes('.')) return 'Akses ke domain internal dilarang';
  if (/^\[|:/.test(host)) return 'Alamat IP tidak diizinkan'; // any IPv6 literal
  if (/^\d+$/.test(host) || /^0x/i.test(host)) return 'Alamat IP tidak diizinkan'; // decimal/hex IP tricks
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) && PRIVATE_V4.some((re) => re.test(host))) {
    return 'Akses ke domain internal dilarang';
  }
  if (/(^|\.)(localhost|local|internal|intranet|lan|home|corp|localdomain)$/.test(host)) {
    return 'Akses ke domain internal dilarang';
  }
  if (host === 'metadata.google.internal' || host.endsWith('.nip.io') || host.endsWith('.sslip.io')) {
    return 'Akses ke domain internal dilarang';
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Validasi Cookie Session Internal
    const sessionId = request.cookies.get('__Host-session_id')?.value || request.cookies.get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const { url } = await request.json().catch(() => ({}));
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL tidak valid atau kosong' },
        { status: 400 }
      );
    }

    // === SSRF guard: only public http(s) URLs on default ports ===
    const urlError = validatePublicUrl(url);
    if (urlError) {
      return NextResponse.json({ success: false, error: urlError }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(
      `${BACKEND_URL}/convert?url=${encodeURIComponent(url)}`,
      {
        signal: controller.signal,
        // Opsional: backend bisa menolak semua request tanpa kunci ini.
        headers: process.env.BACKEND_SHARED_SECRET ? { 'x-backend-key': process.env.BACKEND_SHARED_SECRET } : {},
      }
    );
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Backend error' },
        { status: response.ok ? 502 : response.status }
      );
    }

    let audioUrl: string | undefined = data.audio_url || data.download_url;

    if (audioUrl) {
      const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//;
      if (localhostPattern.test(audioUrl)) {
        const base = BACKEND_URL.replace(/\/$/, '');
        const path = audioUrl.replace(/^https?:\/\/[^\/]+/, '');
        audioUrl = `${base}${path}`;
      }
    }

    if (audioUrl && !/^https?:\/\//i.test(audioUrl)) {
      audioUrl = undefined; // never hand javascript:/data: URLs back to the client
    }

    // Sembunyikan host backend: file yang ada di backend sendiri diganti
    // token terenkripsi (AES-GCM) yang di-stream lewat /api/media/<token>.
    if (audioUrl) {
      try {
        const u = new URL(audioUrl);
        if (u.origin === new URL(BACKEND_URL).origin) {
          audioUrl = `/api/media/${await sealMediaPath(u.pathname + u.search)}`;
        }
      } catch {
        audioUrl = undefined;
      }
    }

    if (!audioUrl) {
      return NextResponse.json(
        { success: false, error: 'Backend tidak mengembalikan audio_url' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      title: data.title,
      uploader: data.uploader,
      audio_url: audioUrl,
    });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    const message = (error as Error)?.message || '';
    if ((error as Error)?.name === 'AbortError' || message.includes('abort')) {
      return NextResponse.json(
        { success: false, error: 'Request timeout' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      // Don't leak internal error details (backend host, stack info) to clients.
      { success: false, error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}