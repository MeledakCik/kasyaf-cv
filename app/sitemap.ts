import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { certificates } from "@/data/certificates";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: { en: `${SITE_URL}${path}`, "id-ID": `${SITE_URL}${path}` } },
  });

  return [
    page("", 1, "monthly"),
    page("/profile", 0.9, "weekly"),
    {
      ...page("/experience", 0.8, "monthly"),
      // Image sitemap: lets the certificate scans show up in Google Images.
      images: certificates.map((c) => `${SITE_URL}${c.image}`),
    },
    page("/research", 0.7, "monthly"),
  ];
}
