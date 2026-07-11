// app/api/convert/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
// 🔥 Perpanjang timeout menjadi 120 detik
const TIMEOUT = 120000; // 2 menit

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL diperlukan' },
        { status: 400 }
      );
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
        console.log('✅ URL lokal diganti menjadi:', audioUrl);
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