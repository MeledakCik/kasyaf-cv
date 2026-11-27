import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import SensorProvider from "@/components/sensor-provider";
import { CvErrorBoundary } from "@/components/error-boundary";
import ClientProviders from "@/components/client-providers";
import {
  SITE_URL,
  NAME,
  SHORT_NAME,
  JOB_TITLE,
  DEFAULT_DESCRIPTION,
  DESCRIPTION_ID,
  KEYWORDS,
  siteJsonLd,
  jsonLdString,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#05070d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${NAME} | ${JOB_TITLE}`,
    template: `%s | ${NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  publisher: NAME,
  applicationName: `${SHORT_NAME} Portfolio`,
  category: "technology",
  alternates: {
    canonical: "/",
    // Single bilingual site: tell search engines it serves both audiences.
    languages: { en: "/", "id-ID": "/", "x-default": "/" },
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
    title: `${NAME} | ${JOB_TITLE}`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: `${NAME} Portfolio`,
    locale: "en_US",
    alternateLocale: ["id_ID"],
    type: "profile",
    firstName: "Muhammad Kasyaf",
    lastName: "Anugrah",
    username: "MeledakCik",
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAME} | ${JOB_TITLE}`,
    description: DESCRIPTION_ID,
  },
  // Icons come from the file conventions app/icon.svg, app/favicon.ico and
  // app/apple-icon.png (the old 940 KB logo.png was used as the favicon).
  verification: {
    google: "BhxoCE5pDRmhMsvBgkRdKyw8dqNYMFc4jvOfFclWLRw",
  },
  other: {
    "geo.region": "ID-JB",
    "geo.placename": "Bandung",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full bg-black antialiased`}
    >
      <head>
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString(siteJsonLd()),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black antialiased">
        <SensorProvider />
        <CvErrorBoundary>
          <ClientProviders>{children}</ClientProviders>
        </CvErrorBoundary>
      </body>
    </html>
  );
}