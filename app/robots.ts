import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /admin, /backup, /secret = umpan honeypot. Crawler baik patuh dan tidak
        // masuk; bot jahat justru sengaja membuka path "rahasia" di robots.txt.
        disallow: ["/api/", "/v2/", "/admin", "/backup", "/secret"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
