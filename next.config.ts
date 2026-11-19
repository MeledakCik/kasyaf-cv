import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "s0.wp.com",
      },
      {
        protocol: "https",
        hostname: "s.wordpress.com",
      },
    ],
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  turbopack: {},

  webpack: (config, { dev }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }
    return config;
  },

    async headers() {
    return [
      // 1. BYPASS KHUSUS SEO - HARUS PALING ATAS!
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml" },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Type", value: "text/plain" },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // 2. BARU WAF UNTUK SISANYA
      {
        source: "/((?!sitemap.xml|robots.txt|favicon.ico|_next/static|_next/image).*)",
        headers: [
          // (Fingerprint headers like "X-Protected-By: Vercel-Custom-WAF" removed:
          //  advertising the stack only helps attackers pick their tools.)

          // --- HEADER KEAMANAN STANDAR ---
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Download-Options", value: "noopen" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), bluetooth=(), serial=(), hid=(), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            // A CORS header holds exactly ONE origin; `a || b || c` only ever used the first.
            value: process.env.NEXT_PUBLIC_APP_URL || "https://kasyaf.id",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,OPTIONS",
          },
          { key: "Vary", value: "Origin" },
          {
            key: "Access-Control-Allow-Headers",
            // Internal headers are set by proxy.ts only; browsers never need to send them.
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;