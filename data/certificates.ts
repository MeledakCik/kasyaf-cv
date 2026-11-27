/* -------------------------------------------------------------------------- */
/*  CERTIFICATES — source files: Documents/Sertifikat (rendered to WebP in     */
/*  public/images/certificates). Kept free of client-only imports so it can   */
/*  be used by lib/seo.ts (JSON-LD) and llms.txt on the server.               */
/* -------------------------------------------------------------------------- */

export type CertificateKind = "course" | "event";

export interface CertificateItem {
  /** ISO date (YYYY-MM-DD) the certificate was issued. */
  date: string;
  title: string;
  issuer: string;
  /** Issuer's site, used for the JSON-LD `recognizedBy` organization. */
  issuerUrl?: string;
  /** "course" = passed a course/class, "event" = attended a webinar/talk. */
  kind: CertificateKind;
  image: string; // path in /public, shown in the modal
  imageWidth: number;
  imageHeight: number;
  /** Public verification page, if the issuer provides one. */
  verifyUrl?: string;
  /** Short context for screen readers, search engines and the modal. */
  note?: string;
}

const IMG = "/images/certificates";

/** Newest first. */
export const certificates: CertificateItem[] = [
  {
    date: "2026-04-20",
    title: "Belajar Dasar Pemrograman Web",
    issuer: "Dicoding Indonesia",
    issuerUrl: "https://www.dicoding.com",
    kind: "course",
    image: `${IMG}/dicoding-dasar-pemrograman-web.webp`,
    imageWidth: 1400,
    imageHeight: 990,
    verifyUrl: "https://www.dicoding.com/certificates/NVP7N45KVZR0",
    note: "Lulus kelas HTML & CSS dasar untuk pengembangan website.",
  },
  {
    date: "2026-04-13",
    title: "Introduction to Financial Literacy",
    issuer: "Dicoding Indonesia × DBS Foundation Coding Camp 2026",
    issuerUrl: "https://www.dicoding.com",
    kind: "course",
    image: `${IMG}/dicoding-financial-literacy.webp`,
    imageWidth: 1400,
    imageHeight: 990,
    verifyUrl: "https://www.dicoding.com/certificates/6RPN719N8X2M",
    note: "Lulus kelas literasi finansial, Coding Camp powered by DBS Foundation 2026.",
  },
  {
    date: "2026-04-02",
    title: "Stop Desain Ngasal! Standar Interface Website",
    issuer: "IDwebhost — IDwebtalks",
    issuerUrl: "https://idwebhost.com",
    kind: "event",
    image: `${IMG}/idwebhost-standar-interface-website.webp`,
    imageWidth: 1400,
    imageHeight: 990,
    note: "Webinar standar UI/UX antarmuka website.",
  },
  {
    date: "2025-12-31",
    title: "Python — International Scientific Virtual Talk #12",
    issuer: "CV. Semiotika",
    kind: "event",
    image: `${IMG}/python-participant.webp`,
    imageWidth: 1280,
    imageHeight: 904,
  },
  {
    date: "2025-10-14",
    title: "AI-Based Research for Student Journal Publication",
    issuer: "CV. Semiotika — Virtual Talk #10 (Indonesia–Pakistan)",
    kind: "event",
    image: `${IMG}/semiotika-ai-research.webp`,
    imageWidth: 1400,
    imageHeight: 990,
  },
  {
    date: "2025-10-02",
    title: "Cyber Security — International Scientific Virtual Talk",
    issuer: "CV. Semiotika — Virtual Talk #9 (India–Indonesia)",
    kind: "event",
    image: `${IMG}/semiotika-cyber-security.webp`,
    imageWidth: 1400,
    imageHeight: 990,
  },
  {
    date: "2023-08-12",
    title: "Java Fundamentals",
    issuer: "Oracle Academy",
    issuerUrl: "https://academy.oracle.com",
    kind: "course",
    image: `${IMG}/oracle-java-fundamentals.webp`,
    imageWidth: 1400,
    imageHeight: 1082,
    note: "Award of Course Completion — menyelesaikan seluruh coursework Java Fundamentals.",
  },
  {
    date: "2023-03-31",
    title: "Developer Coaching #84: DevOps — Dasar-Dasar Jaringan Komputer",
    issuer: "Dicoding Event",
    issuerUrl: "https://www.dicoding.com",
    kind: "event",
    image: `${IMG}/dicoding-devops-jaringan-komputer.webp`,
    imageWidth: 1400,
    imageHeight: 990,
  },
  {
    date: "2022-11-17",
    title: "Karir di Dunia Cybersecurity — EC-Council Academia",
    issuer: "EC-Council × Synergy Academy",
    issuerUrl: "https://www.eccouncil.org",
    kind: "event",
    image: `${IMG}/ec-council-karir-cybersecurity.webp`,
    imageWidth: 1400,
    imageHeight: 788,
  },
  {
    date: "2022-09-20",
    title: "Bincang Karier dengan Pusat Karier Oracle Academy",
    issuer: "Oracle Academy",
    issuerUrl: "https://academy.oracle.com",
    kind: "event",
    image: `${IMG}/oracle-academy.webp`,
    imageWidth: 1400,
    imageHeight: 788,
  },
];

export const certificateYear = (c: CertificateItem) => c.date.slice(0, 4);
