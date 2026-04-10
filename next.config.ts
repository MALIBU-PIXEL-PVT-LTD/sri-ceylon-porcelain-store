import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sriceylonporcelain.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
