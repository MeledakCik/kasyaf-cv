import type { Metadata } from "next";
import { headers } from "next/headers";
import { NAME, jsonLdString, profilePageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Profile: Projects, Skills & Experience",
  description:
    "Projects, skills and experience of Muhammad Kasyaf Anugrah: DepUp Office (Android, iOS, Windows), depup.cloud one-click deployment, Depup Code IDE, Kasyaf Cloud and Sentinel-ID. Full Stack Developer from Bandung, Indonesia.",
  alternates: { canonical: "/profile" },
  openGraph: {
    title: `${NAME}: Projects, Skills & Experience`,
    url: "/profile",
    type: "profile",
    // A segment-level openGraph replaces the parent's, so re-attach the
    // generated image (app/opengraph-image.tsx) explicitly.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${NAME}, Full Stack Developer` }],
  },
};

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(profilePageJsonLd()) }}
      />
      {children}
    </>
  );
}
