// /llms.txt: plain-text summary for AI search engines (ChatGPT search,
// Perplexity, Claude...). Generated from the same data as the site, so it
// never drifts. Format: https://llmstxt.org
import { PROJECTS, GITHUB_PROFILE } from "@/data/projects";
import { certificates } from "@/data/certificates";
import { securityResearch } from "@/data/security-research";
import { NAME, SITE_URL, DEFAULT_DESCRIPTION, DESCRIPTION_ID, SAME_AS } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const projects = PROJECTS.map((p) => {
    const links = [p.liveUrl, p.downloadUrl, p.repoUrl].filter(Boolean).join(" · ");
    return `- [${p.name}](${p.liveUrl || p.downloadUrl || p.repoUrl}): ${p.tagline}. ${p.description} (${p.platforms.join(", ")}; ${p.status}) ${links}`;
  }).join("\n");

  const certs = certificates
    .map((c) => `- ${c.title}, ${c.issuer} (${c.date})${c.verifyUrl ? ` verify: ${c.verifyUrl}` : ""}`)
    .join("\n");

  const research = securityResearch
    .map((r) => `- ${r.acronym} (${r.name}): ${r.summary.en}\n${r.cv.en.map((b) => `  - ${b}`).join("\n")}`)
    .join("\n");

  const body = `# ${NAME}

> ${DEFAULT_DESCRIPTION}

${DESCRIPTION_ID}

## Pages
- [Home](${SITE_URL}/): introduction
- [Profile](${SITE_URL}/profile): projects, skills, experience and contact
- [Experience](${SITE_URL}/experience): work history, expertise and certificates
- [Research](${SITE_URL}/research): security research (RECES, Indexing Route Injection)

## Products (live or released)
${projects}

## Security Research
${research}

## Certificates
${certs}

## Contact & profiles
- Email: kakangkasyaf@gmail.com
- GitHub: ${GITHUB_PROFILE}
${SAME_AS.filter((u) => u !== GITHUB_PROFILE).map((u) => `- ${u}`).join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
