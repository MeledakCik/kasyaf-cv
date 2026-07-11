// lib/downloader.ts
interface DownloadResult {
  title: string;
  uploader: string;
  media_url: string;
  audio_url: string;
  direct_stream: boolean;
}

export async function downloadMedia(url: string): Promise<DownloadResult> {
  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.audio_url) {
      throw new Error(data.error || 'Tidak ada audio URL');
    }

    return {
      title: data.title || 'Tidak diketahui',
      uploader: data.uploader || 'Tidak diketahui',
      media_url: data.audio_url,
      audio_url: data.audio_url,
      direct_stream: true,
    };
  } catch (error) {
    console.error('❌ Download error:', error);
    throw new Error(`Gagal mendapatkan audio: ${(error as Error).message}`);
  }
}