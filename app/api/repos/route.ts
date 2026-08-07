import { NextResponse } from 'next/server';

const GITHUB_USERNAMES = ['MeledakCik', 'K4K4NG'];

// Fungsi pembersih README dari tag HTML, URL, & Markdown
function summarizeReadme(readmeText: string, maxLength: number = 160): string {
  if (!readmeText) return '';

  const cleanText = readmeText
    // 1. Hapus tag HTML beserta isinya jika tag tersebut adalah script/style/svg
    .replace(/<(script|style|svg)[^>]*>[\s\S]*?<\/\1>/gi, '')
    // 2. Hapus semua tag HTML biasa (termasuk <p align="...">, <a href="...">, <img ...>)
    .replace(/<[^>]+>/g, ' ')
    // 3. Hapus markdown image ![alt](url) dan link [text](url)
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // 4. Hapus URL mentah (https://... atau http://...)
    .replace(/https?:\/\/\S+/gi, '')
    // 5. Hapus karakter sintaks Markdown (#, *, `, _, ~, >, -, dll)
    .replace(/[#*`_~>-]/g, ' ')
    // 6. Rapikan spasi berlebih, tab, dan newlines
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return '';

  return cleanText.length > maxLength
    ? cleanText.substring(0, maxLength) + '...'
    : cleanText;
}

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const repoPromises = GITHUB_USERNAMES.map(async (username) => {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=15&type=all`,
        {
          headers,
          next: { revalidate: 3600 },
        }
      );

      if (!res.ok) return [];

      const repos = await res.json();
      if (!Array.isArray(repos)) return [];

      const reposWithReadme = await Promise.all(
        repos.map(async (repo: any) => {
          if (repo.fork) return null;

          let finalDescription = '';

          // 1. Coba ambil dari RAW README
          try {
            const readmeRes = await fetch(
              `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`,
              {
                headers: {
                  ...headers,
                  Accept: 'application/vnd.github.raw+json',
                },
                next: { revalidate: 3600 },
              }
            );

            if (readmeRes.ok) {
              const rawReadme = await readmeRes.text();
              finalDescription = summarizeReadme(rawReadme);
            }
          } catch (e) {
            // Abaikan jika tidak ada README
          }

          // 2. Jika README kosong/gagal, pakai description dari repo
          if (!finalDescription && repo.description) {
            finalDescription = summarizeReadme(repo.description);
          }

          return {
            id: repo.id,
            name: repo.name,
            description: finalDescription || 'Tidak ada deskripsi atau README.',
            html_url: repo.html_url,
            language: repo.language,
            topics: repo.topics || [],
            owner: repo.owner.login,
            stargazers_count: repo.stargazers_count,
          };
        })
      );

      return reposWithReadme.filter(Boolean);
    });

    const results = await Promise.all(repoPromises);
    const combinedRepos = results.flat();

    return NextResponse.json(combinedRepos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}