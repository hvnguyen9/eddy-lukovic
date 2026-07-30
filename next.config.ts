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
      // Resume was briefly split into /resume/acting + /resume/directing
      { source: "/resume/:discipline(acting|directing)", destination: "/resume", permanent: false },
      { source: "/gallery", destination: "/gallery/acting", permanent: false },
    ];
  },
};

export default nextConfig;
