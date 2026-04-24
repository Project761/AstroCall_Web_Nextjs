import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.astrocall.live",
      },
      {
        protocol: "https",
        hostname: "liveapi.astrocall.live",
      },
    ],
  },
};

module.exports = nextConfig;
