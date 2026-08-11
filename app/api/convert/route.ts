import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const TIMEOUT = 120000;

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

    // === FIX SSRF: HANYA IZINKAN PROTOKOL HTTP/HTTPS LUAR ===
    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return NextResponse.json({ success: false, error: 'Protokol URL tidak didukung' }, { status: 400 });
      }
      // Blokir jika mencoba menembak IP privat/internal (SSRF Prevention)
      if (['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254'].includes(parsedUrl.hostname)) {
        return NextResponse.json({ success: false, error: 'Akses ke domain internal dilarang' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ success: false, error: 'Format URL salah' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(
      `${BACKEND_URL}/convert?url=${encodeURIComponent(url)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    const data = await response.json();

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
    const message = (error as Error).message;
    if (message.includes('abort')) {
      return NextResponse.json(
        { success: false, error: 'Request timeout' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}