// app/api/repos/route.ts
import { NextResponse } from 'next/server';

const GITHUB_USERNAMES = ['MeledakCik', 'K4K4NG'];

interface GitHubRepo {
  id: number;
  name: string;
  fork: boolean;
  description: string | null;
  html_url: string;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  owner: { login: string };
}

function summarizeReadme(readmeText: string, maxLength = 160): string {
  if (!readmeText) return '';
  const clean = readmeText
    .replace(/<(script|style|svg)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/[#*`_~>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > maxLength ? clean.slice(0, maxLength) + '...' : clean;
}

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const results = await Promise.all(
      GITHUB_USERNAMES.map(async (username) => {
        try {
          const res = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=15&type=all`,
            { headers, next: { revalidate: 3600 } }
          );
          if (!res.ok) {
            console.error(`GitHub API error for ${username}: ${res.status}`);
            return [];
          }
          const repos = (await res.json()) as GitHubRepo[];
          if (!Array.isArray(repos)) return [];

          const processed = await Promise.all(
            repos.map(async (repo) => {
              if (repo.fork) return null;
              let description = '';

              // Try README
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
                  const raw = await readmeRes.text();
                  description = summarizeReadme(raw);
                }
              } catch (e) {
                console.warn(`README fetch failed for ${repo.name}:`, e);
              }

              if (!description && repo.description) {
                description = summarizeReadme(repo.description);
              }

              return {
                id: repo.id,
                name: repo.name,
                description: description || 'Tidak ada deskripsi atau README.',
                html_url: repo.html_url,
                language: repo.language,
                topics: repo.topics || [],
                owner: repo.owner.login,
                stargazers_count: repo.stargazers_count,
              };
            })
          );

          return processed.filter(Boolean);
        } catch (err) {
          console.error(`Error fetching ${username}:`, err);
          return [];
        }
      })
    );

    const combined = results.flat();
    console.log(`✅ Returning ${combined.length} repos`);
    return NextResponse.json(combined);
  } catch (error) {
    console.error('Fatal error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}