import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images.dzcdn.net",
        pathname: "/images/artist/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "cdn.bypixel.dev",
        pathname: "/raw/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
  reactCompiler: true,
  allowedDevOrigins: ["192.168.178.199"],
};

export default nextConfig;
