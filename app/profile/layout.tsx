import type { Metadata } from "next";
import { headers } from "next/headers";
import { NAME, jsonLdString, profilePageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Profile: Projects, Skills & Experience",
  description:
    "Projects, skills & experience of Muhammad Kasyaf Anugrah, Full Stack Developer from Bandung: DepUp Office, depup.cloud, Depup Code, Sentinel-ID & MotionKu.",
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
