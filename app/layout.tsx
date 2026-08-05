import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://kasyaf-cv.my.id";
const NAME = "Muhammad Kasyaf Anugrah";

export const viewport: Viewport = {
  themeColor: "#0b0f1a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${NAME} - Full Stack Developer & Cyber Security`,
    template: `%s | ${NAME}`,
  },
  description:
    "Portofolio Muhammad Kasyaf Anugrah, Full Stack Developer yang fokus di front end, back end, dan cyber security. Lihat proyek, pengalaman, dan keahlian teknis di sini.",
  keywords: [
    "Muhammad Kasyaf Anugrah",
    "kasyaf cv",
    "kasyaf portfolio",
    "full stack developer indonesia",
    "cyber security",
    "web developer portfolio",
  ],
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  applicationName: `${NAME} Portfolio`,
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: `${NAME} - Full Stack Developer & Cyber Security`,
    description:
      "Portofolio Muhammad Kasyaf Anugrah, Full Stack Developer yang fokus di front end, back end, dan cyber security.",
    url: SITE_URL,
    siteName: `${NAME} Portfolio`,
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: `Preview Portofolio ${NAME}`,
      },
    ],
    locale: "id_ID",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAME} - Full Stack Developer & Cyber Security`,
    description:
      "Portofolio Muhammad Kasyaf Anugrah, Full Stack Developer yang fokus di front end, back end, dan cyber security.",
    images: [`${SITE_URL}/images/logo.png`],
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  verification: {
    google: "yImAoad-DsRa1AEEZYEVhFLn2-ODwo8vwm3Gyy7e-SU",
  },
};
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: NAME,
  url: SITE_URL,
  image: `${SITE_URL}/images/logo.png`,
  jobTitle: "Full Stack Developer",
  description:
    "Full Stack Developer yang fokus di front end, back end, dan cyber security.",
  knowsAbout: [
    "Full Stack Development",
    "Front End Development",
    "Back End Development",
    "Cyber Security",
  ],
  sameAs: [
    "https://github.com/K4K4NG",
    "https://linkedin.com/in/muhammad-kasyaf-anugrah",
    "https://instagram.com/kkngksyf__",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? "";
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-black antialiased`}
    >
      <head>
        <Script
          nonce={nonce}
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black antialiased">
        {children}
      </body>
    </html>
  );
}
