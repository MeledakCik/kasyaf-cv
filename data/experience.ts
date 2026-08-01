import type { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiRedis,
  SiVercel,
  SiGit,
  SiFigma,
  SiCheerio,
  SiPagespeedinsights,
  SiReact,
} from "react-icons/si";

/* -------------------------------------------------------------------------- */
/*  TYPES                                                                     */
/* -------------------------------------------------------------------------- */

export type ExpertiseIcon = "shield" | "code" | "bot";

export interface MainExpertiseItem {
  icon: ExpertiseIcon;
  title: string;
  description: string;
  percent: number;
}

export interface FeaturedProjectItem {
  title: string;
  description: string;
  tech: string[];
  gradient: string; // tailwind gradient classes used as thumbnail placeholder
  liveUrl?: string;
  githubUrl?: string;
}

export interface CertificateItem {
  year: string;
  title: string;
  issuer: string;
  image?: string; // path in /public, shown in modal when clicked
}

export interface ToolItem {
  name: string;
  Icon: IconType;
}

export interface ExperienceItem {
  period: string;
  role: string;
  org: string;
  desc: string;
}

/* -------------------------------------------------------------------------- */
/*  DATA — edit these arrays, UI does not need to change                     */
/* -------------------------------------------------------------------------- */

export const mainExpertise: MainExpertiseItem[] = [
  {
    icon: "shield",
    title: "Web Security Audit",
    description: "Passive Crawl, JS AST Analysis, XSS/SQLi detection",
    percent: 90,
  },
  {
    icon: "code",
    title: "Frontend Dev",
    description: "Next.js 14, React, Tailwind, TypeScript",
    percent: 95,
  },
  {
    icon: "bot",
    title: "Automation & Scraping",
    description: "Cheerio, Puppeteer, Upstash Redis",
    percent: 85,
  },
];

export const featuredProjects: FeaturedProjectItem[] = [
  {
    title: "audit-otomatis-phi.vercel.app",
    description: "Passive security + QC Otomatis (100 req limit, Redis)",
    tech: ["Next.js", "Redis"],
    gradient: "from-[#7C3AED] via-[#3B1E6B] to-[#00FF88]",
    liveUrl: "https://audit-otomatis-phi.vercel.app",
    githubUrl: "https://github.com/",
  },
  {
    title: "TROUT Terminal UI",
    description: "Design system black/green mono",
    tech: ["Design System", "Tailwind"],
    gradient: "from-[#00FF88] via-[#0A2E1C] to-[#0A0A0F]",
    liveUrl: undefined,
    githubUrl: "https://github.com/",
  },
  {
    title: "Request Inspector",
    description: "Tech stack detector + HAR export",
    tech: ["Next.js", "TypeScript"],
    gradient: "from-[#7C3AED] via-[#1A1A2E] to-[#00FF88]",
    liveUrl: undefined,
    githubUrl: "https://github.com/",
  },
];

export const certificates: CertificateItem[] = [
  {
    year: "2024",
    title: "Juara Umum IYRC China",
    issuer: "Robotik — International Youth Robot Competition",
    image: "/images/certificates/iyrc-china.jpg",
  },
  {
    year: "2024",
    title: "Champion Creative Design",
    issuer: "MSU-BIT University Shenzhen",
    image: "/images/certificates/msu-bit-design.jpg",
  },
  {
    year: "2023",
    title: "Next.js & Web Security Certification",
    issuer: "Dicoding / BNSP",
    image: "/images/certificates/nextjs-security.jpg",
  },
];

export const tools: ToolItem[] = [
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Tailwind", Icon: SiTailwindcss },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Redis", Icon: SiRedis },
  { name: "Vercel", Icon: SiVercel },
  { name: "Git", Icon: SiGit },
  { name: "Figma", Icon: SiFigma },
  { name: "Cheerio", Icon: SiCheerio },
  { name: "PageSpeed", Icon: SiPagespeedinsights },
  { name: "React", Icon: SiReact },
];

export const experiences: ExperienceItem[] = [
  {
    period: "2024 — Now",
    role: "Indie Developer",
    org: "Self-directed",
    desc: "Build audit tools",
  },
  {
    period: "2023 — 2024",
    role: "Frontend Freelance",
    org: "Client Projects",
    desc: "Membangun antarmuka Next.js + Tailwind untuk berbagai klien",
  },
  {
    period: "2022 — 2023",
    role: "Organisasi Kampus",
    org: "Unikom",
    desc: "Kontribusi pada proyek tim dan pengembangan skill kolaboratif",
  },
];
