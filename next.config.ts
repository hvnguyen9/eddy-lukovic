import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity image CDN — used once the CMS is connected
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      // Pre-2026-08 structure: split resumes, gallery pages, media page
      { source: "/resume/:discipline(acting|directing)", destination: "/resume", permanent: false },
      { source: "/gallery", destination: "/actor", permanent: false },
      { source: "/gallery/acting", destination: "/actor", permanent: false },
      { source: "/gallery/directing", destination: "/director", permanent: false },
      { source: "/gallery/directing/:slug", destination: "/director", permanent: false },
      { source: "/media", destination: "/actor", permanent: false },
    ];
  },
};

export default nextConfig;
