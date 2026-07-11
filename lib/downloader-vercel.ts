// lib/downloader-vercel.ts
// Versi untuk Vercel - tanpa fs, tanpa child_process

interface DownloadResult {
  title: string;
  uploader: string;
  media_url: string;
  file_path: string;
  direct_stream: boolean;
}

// Ekstrak video ID dari URL YouTube
function extractVideoId(url: string): string {
  const patterns = [
    /(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\?|&|$)/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  throw new Error('Invalid YouTube URL');
}

// Fungsi untuk mendapatkan streaming URL dari YouTube
export async function downloadMedia(url: string): Promise<DownloadResult> {
  try {
    const videoId = extractVideoId(url);
    
    // Gunakan API YouTube oEmbed untuk mendapatkan info
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedResponse = await fetch(oembedUrl);
    const oembedData = await oembedResponse.json();
    
    // Gunakan ytdl-core jika tersedia, atau fallback ke API
    let audioUrl = '';
    let title = oembedData.title || 'Tidak diketahui';
    let uploader = oembedData.author_name || 'Tidak diketahui';
    
    try {
      // Coba gunakan ytdl-core (harus diinstall)
      const ytdl = await import('ytdl-core');
      const info = await ytdl.default.getInfo(videoId);
      
      // Cari format audio terbaik
      const audioFormat = ytdl.default.chooseFormat(info.formats, {
        quality: 'highestaudio',
        filter: 'audioonly'
      });
      
      if (audioFormat) {
        audioUrl = audioFormat.url;
        title = info.videoDetails.title;
        uploader = info.videoDetails.author.name;
      }
    } catch (ytdlError) {
      console.warn('ytdl-core error, using fallback:', ytdlError);
      
      // Fallback: gunakan URL streaming langsung dari YouTube
      audioUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    
    if (!audioUrl) {
      // Fallback terakhir
      audioUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    
    return {
      title: title,
      uploader: uploader,
      media_url: audioUrl,
      file_path: audioUrl,
      direct_stream: true,
    };
  } catch (error) {
    console.error('Download error:', error);
    throw new Error(`Gagal mendapatkan media: ${(error as Error).message}`);
  }
}