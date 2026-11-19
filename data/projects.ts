/**
 * Curated portfolio projects (hand-picked from github.com/MeledakCik).
 * Single source of truth: used by the Projects section, the AI assistant's
 * context (app/api/chat-ai) and the JSON-LD structured data for SEO.
 */

export type ProjectPlatform = "Android" | "iOS" | "Windows" | "Web" | "Cloud";

export interface PortfolioProject {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  platforms: ProjectPlatform[];
  category: string;
  /** schema.org applicationCategory */
  schemaCategory: string;
  liveUrl?: string;
  repoUrl?: string;
  extraRepos?: { label: string; url: string }[];
  status: string;
  featured?: boolean;
  accent: string;
}

const GH = "https://github.com/MeledakCik";

export const PROJECTS: PortfolioProject[] = [
  {
    slug: "depup-office",
    name: "DepUp Office",
    tagline: "Offline-first office suite for Android, iOS & Windows",
    description:
      "A privacy-first productivity suite that reads, edits and creates Word, Excel and PDF documents with on-device OCR, a document scanner and an encrypted vault. Everything runs locally, with no cloud upload.",
    highlights: [
      "DOCX/XLSX/PDF writers and readers built from scratch (no third-party document libraries)",
      "AES-256-GCM vault, anti-tamper & anti-prompt-injection hardening (v4.1)",
      "Same feature set ported to iOS (Swift) and Windows (C# .NET 8 WinForms + GDI+, zero NuGet dependencies)",
    ],
    stack: ["Kotlin", "Swift", "C# .NET 8 WinForms", "OCR", "AES-256-GCM"],
    platforms: ["Android", "iOS", "Windows"],
    category: "Mobile & Desktop",
    schemaCategory: "BusinessApplication",
    repoUrl: `${GH}/DepupOffice`,
    extraRepos: [{ label: "Windows", url: `${GH}/DepupOffice-Dekstop` }],
    status: "v4.1",
    featured: true,
    accent: "#39e6b5",
  },
  {
    slug: "depup-cloud",
    name: "depup.cloud (DeployOne)",
    tagline: "One-click deployment platform",
    description:
      "Deploy a GitHub repo or an uploaded zip/folder to Vercel, Cloudflare Pages or Railway in one flow, with live progress, deploy history, custom domains, encrypted environment variables and a built-in assistant that diagnoses failed deploys.",
    highlights: [
      "Multi-provider deploy orchestration (Vercel · Cloudflare Pages · Railway)",
      "Repo analysis before deploy (static, Node.js, Next.js, Docker)",
      "Guided custom-domain DNS setup and secret management",
    ],
    stack: ["Next.js", "TypeScript", "OAuth", "REST APIs"],
    platforms: ["Web", "Cloud"],
    category: "Developer Platform",
    schemaCategory: "DeveloperApplication",
    liveUrl: "https://depup.cloud",
    repoUrl: `${GH}/deployone`,
    status: "Live",
    featured: true,
    accent: "#38bdf8",
  },
  {
    slug: "depup-code",
    name: "Depup Code",
    tagline: "AI-assisted desktop IDE for Windows",
    description:
      "A WPF/.NET 8 IDE with editor, integrated terminal, Git, an AI chat/agent with user-approved file operations, managed PHP/Laravel runtime, Open VSX extensions and one-click deploy to Depup Cloud, Vercel, Cloudflare and Railway.",
    highlights: [
      "Ask / Plan / Agent AI modes with workspace context",
      "Built-in Apache + PHP runtime with Laravel detection",
      "Released installer (v2.5.4) with MIT license",
    ],
    stack: ["C#", "WPF", ".NET 8", "WebView2", "Git"],
    platforms: ["Windows"],
    category: "Developer Tools",
    schemaCategory: "DeveloperApplication",
    repoUrl: `${GH}/DepupCode`,
    status: "v2.5.4 release",
    accent: "#8b5cf6",
  },
  {
    slug: "kasyaf-cloud",
    name: "Kasyaf Cloud",
    tagline: "Serverless Redis & Vector DB for developers",
    description:
      "A self-hosted data platform offering Redis and vector databases behind a REST API that is compatible with the Upstash SDK, with provisioning in seconds from a web console.",
    highlights: [
      "Upstash-compatible REST interface",
      "Instant database provisioning from console.kasyaf.id",
      "Dockerized deployment",
    ],
    stack: ["Next.js", "Redis", "Vector DB", "Docker"],
    platforms: ["Web", "Cloud"],
    category: "Infrastructure",
    schemaCategory: "DeveloperApplication",
    liveUrl: "https://console.kasyaf.id",
    repoUrl: `${GH}/redis-mini`,
    status: "Live",
    accent: "#f97316",
  },
  {
    slug: "sentinel-id",
    name: "Sentinel-ID",
    tagline: "Passive-only website security auditor",
    description:
      "An ethical, GET-only security scanner for site owners: BFS crawl, JavaScript endpoint extraction, leaked-secret and vulnerable-library fingerprinting and potential-issue detection, all within a strict request budget and without payloads or WAF bypass.",
    highlights: [
      "Modular pipeline: discovery → parsers → fingerprint → vuln → fuzzer",
      "Same-origin only, 100-request budget, Cloudflare-aware",
      "Bilingual (EN/ID) reports",
    ],
    stack: ["Next.js", "TypeScript", "Security", "Crawling"],
    platforms: ["Web"],
    category: "Cyber Security",
    schemaCategory: "SecurityApplication",
    liveUrl: "https://www.sentinel-id.net",
    repoUrl: `${GH}/audit-otomatis`,
    status: "Live",
    accent: "#ef4444",
  },
  {
    slug: "motionku",
    name: "MotionKu",
    tagline: "Motion-graphic video generator without external AI APIs",
    description:
      "Creates short TikTok/Reels/Shorts videos from a topic using a rule-based template engine, multi-image scenes and in-browser MP4 export via Canvas + MediaRecorder, backed by Supabase with row-level security.",
    highlights: [
      "60+ hooks, 70+ scene variations, 35+ CTA templates",
      "Client-side MP4 export with audio",
      "Supabase RLS and an admin training console",
    ],
    stack: ["Next.js", "Supabase", "Framer Motion", "Canvas API"],
    platforms: ["Web"],
    category: "Creative Tools",
    schemaCategory: "MultimediaApplication",
    liveUrl: "https://motionid.vercel.app",
    repoUrl: `${GH}/motionid`,
    status: "Live",
    accent: "#eab308",
  },
];

export const GITHUB_PROFILE = GH;
