import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.bypixel.dev',
        pathname: '/raw/**',
      }
    ],
  },
};

export default nextConfig;