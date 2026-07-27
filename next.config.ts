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
      { source: "/resume", destination: "/resume/acting", permanent: false },
      { source: "/gallery", destination: "/gallery/acting", permanent: false },
    ];
  },
};

export default nextConfig;
