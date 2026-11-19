import { PROJECTS } from "@/data/projects";

export const SITE_URL = "https://kasyaf.id";
export const NAME = "Muhammad Kasyaf Anugrah";
export const SHORT_NAME = "Kasyaf";
export const JOB_TITLE = "Full Stack Developer & Cyber Security";

export const DEFAULT_DESCRIPTION =
  "Muhammad Kasyaf Anugrah is a Full Stack Developer and cyber security enthusiast from Bandung, Indonesia, who builds secure web, mobile (Android/iOS) and Windows products such as DepUp Office and depup.cloud. Open to remote work.";

export const DESCRIPTION_ID =
  "Portofolio Muhammad Kasyaf Anugrah, Full Stack Developer & Cyber Security dari Bandung, Indonesia. Pembuat DepUp Office, depup.cloud, dan Depup Code.";

export const SAME_AS = [
  "https://github.com/MeledakCik",
  "https://github.com/K4K4NG",
  "https://www.linkedin.com/in/muhammad-kasyaf-anugrah/",
  "https://instagram.com/kkngksyf__",
  "https://kasyaf-cv.my.id",
];

export const KEYWORDS = [
  "Muhammad Kasyaf Anugrah",
  "Muhammad Kasyaf",
  "Kasyaf",
  "Kasyaf portfolio",
  "Full Stack Developer Indonesia",
  "Full Stack Developer Bandung",
  "Next.js developer Indonesia",
  "Kotlin Android developer Indonesia",
  "C# .NET developer",
  "cyber security Indonesia",
  "remote full stack developer",
  "DepUp Office",
  "depup.cloud",
  "Depup Code",
  "web developer Bandung",
  "jasa pembuatan website Bandung",
  "programmer Bandung",
  "developer aplikasi Android Indonesia",
];

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: NAME,
    alternateName: ["Kasyaf", "Muhammad Kasyaf", "MeledakCik"],
    url: SITE_URL,
    image: `${SITE_URL}/images/profile.png`,
    jobTitle: "Full Stack Developer",
    description: DEFAULT_DESCRIPTION,
    email: "mailto:kakangkasyaf@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bandung",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
    nationality: { "@type": "Country", name: "Indonesia" },
    knowsLanguage: ["id", "en"],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universitas Komputer Indonesia",
      url: "https://unikom.ac.id",
    },
    knowsAbout: [
      "Full Stack Development",
      "Next.js",
      "TypeScript",
      "React",
      "Kotlin",
      "Android Development",
      "Swift",
      "C# .NET",
      "Cloud Deployment",
      "DevOps",
      "Cyber Security",
      "Application Security",
    ],
    sameAs: SAME_AS,
  };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: `${NAME} | Portfolio`,
        alternateName: "Kasyaf",
        inLanguage: ["en", "id"],
        publisher: { "@id": PERSON_ID },
      },
      personJsonLd(),
    ],
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/profile#page`,
        url: `${SITE_URL}/profile`,
        name: `${NAME}: Projects, Skills & Experience`,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
        hasPart: { "@id": `${SITE_URL}/profile#projects` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/profile#projects`,
        name: "Featured projects",
        itemListElement: PROJECTS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareApplication",
            name: p.name,
            description: p.description,
            applicationCategory: p.schemaCategory,
            operatingSystem: p.platforms.filter((x) => x !== "Cloud").join(", "),
            ...(p.liveUrl ? { url: p.liveUrl } : p.repoUrl ? { url: p.repoUrl } : {}),
            ...(p.repoUrl ? { codeRepository: p.repoUrl } : {}),
            author: { "@id": PERSON_ID },
            creator: { "@id": PERSON_ID },
          },
        })),
      },
    ],
  };
}

/** Serialize JSON-LD safely for a <script> tag. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
