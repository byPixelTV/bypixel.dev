import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://cdn.bypixel.dev/raw/**')],
  },
};

export default nextConfig;
