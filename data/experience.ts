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
    period: "2023 — Present",
    role: "Full Stack & Mobile Developer / Cyber Security & Designer",
    org: "Freelance / Professional",
    desc: "Building cross-platform mobile apps and full-stack solutions with embedded cyber security protocols, UI/UX design, and end-to-end deployment.",
  },
  {
    period: "2020 — 2023",
    role: "Full Stack Web Developer & Cyber Security / Ethical Hacking",
    org: "Freelance / Contract",
    desc: "Developed robust full-stack web applications while performing active ethical hacking, vulnerability assessments, and web application security auditing.",
  },
  {
    period: "2017 — 2020",
    role: "Cyber Security Specialist & Ethical Hacker",
    org: "Self-Directed / CTF & Security Research",
    desc: "Focused on penetration testing, ethical hacking techniques, CTF competitions, network defense, and identifying security vulnerabilities.",
  },
];
