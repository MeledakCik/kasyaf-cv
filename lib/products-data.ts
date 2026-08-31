export const PRODUCT_CATEGORIES = [
  "Web App",
  "Security Tool",
  "Landing Page",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;
  title: string;
  category: string;
  image: string; // auto screenshot (mshots) — ganti manual kalau mau pakai gambar sendiri
  description: string;
  link: string;
}

/* -------------------------------------------------------------------------- */
/*  Screenshot otomatis (WordPress mshots) — tidak perlu upload gambar.       */
/*  Kalau mau ganti manual, taruh file di public/images/products/ lalu ganti  */
/*  value `image` jadi "/images/products/nama-file.png".                     */
/* -------------------------------------------------------------------------- */
const shot = (url: string) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=900`;

export const PRODUCTS: Product[] = [
  {
    id: "kasyaf-cloud",
    title: "Kasyaf Cloud",
    category: "Web App",
    image: shot("https://www.kasyaf.id/"),
    description:
      "Managed Redis & Vector Database (Qdrant) yang ringan — alternatif Upstash, cepat dan terjangkau, jalan di Local maupun VPS.",
    link: "https://www.kasyaf.id/",
  },
  {
    id: "sentinel-id",
    title: "Sentinel-ID",
    category: "Security Tool",
    image: shot("https://www.sentinel-id.net/"),
    description:
      "Platform audit keamanan website secara pasif (GET-only) — cek header, kerentanan, exposure, dan tech stack domain secara instan tanpa risiko merusak server.",
    link: "https://www.sentinel-id.net/",
  },
  {
    id: "report-phising",
    title: "Report Phishing",
    category: "Security Tool",
    image: shot("https://report-phising-fe.vercel.app/"),
    description:
      "Tools pelaporan otomatis URL phishing ke provider keamanan (Cloudflare, Google Safe Browsing, dll).",
    link: "https://report-phising-fe.vercel.app/",
  },
  {
    id: "ciklabs",
    title: "CIK Labs",
    category: "Web App",
    image: shot("https://www.ciklabs.web.id/"),
    description: "Website studio/produk CIK Labs.",
    link: "https://www.ciklabs.web.id/",
  },
  {
    id: "sylvor-labs",
    title: "PT Sylvor Labs",
    category: "Web App",
    image: shot("https://syvor-labs.vercel.app/"),
    description:
      "Studio rekayasa digital yang merancang, membangun, dan mengamankan produk teknologi premium — website, penetration testing, dan keamanan aplikasi.",
    link: "https://syvor-labs.vercel.app/",
  },
  {
    id: "sylvorlabs-phishing-reporter",
    title: "Phishing Auto-Reporter",
    category: "Security Tool",
    image: shot("https://sylvorlabs.web.id/"),
    description:
      "Multi-provider automated threat mitigation tool untuk melaporkan URL phishing secara otomatis ke Cloudflare dan Google.",
    link: "https://sylvorlabs.web.id/",
  },
  {
    id: "kala-koffie",
    title: "Kala Koffie",
    category: "Landing Page",
    image: shot("https://kala-coffie-template.vercel.app/"),
    description:
      "Template landing page coffee shop modern — menu, lokasi, dan storytelling brand, dibangun dengan Next.js.",
    link: "https://kala-coffie-template.vercel.app/",
  },
  {
    id: "belajar-net",
    title: "Belajar Net",
    category: "Web App",
    image: shot("https://www.belajarnet.biz.id/"),
    description:
      "Platform gamifikasi belajar pemrograman gratis — Python, Next.js, React, hingga jalur karir front-end/back-end.",
    link: "https://www.belajarnet.biz.id/",
  },
  {
    id: "watcheros-monitor",
    title: "WatcherOS",
    category: "Security Tool",
    image: shot("https://monitor-id.vercel.app/"),
    description: "Dashboard monitoring / surveillance system real-time.",
    link: "https://monitor-id.vercel.app/",
  },
  {
    id: "cikawan-gb",
    title: "Cikawan GB",
    category: "Landing Page",
    image: shot("https://cikawan-gb.lovable.app/"),
    description: "Landing page produk Cikawan GB.",
    link: "https://cikawan-gb.lovable.app/",
  },
  {
    id: "ramadhan-sahur",
    title: "Ramadhan Sahur",
    category: "Landing Page",
    image: shot("https://ramadhansahur.lovable.app/"),
    description: "Aplikasi pengingat jadwal sahur & imsakiyah selama Ramadhan.",
    link: "https://ramadhansahur.lovable.app/",
  },
];
