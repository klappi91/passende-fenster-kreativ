import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "passende-fenster.de",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "admin.passende-fenster.de",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "admin.passende-fenster.de",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
