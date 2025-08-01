import type { NextConfig } from "next";
import { withPlausibleProxy } from "next-plausible";

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

export default withPlausibleProxy()(nextConfig);