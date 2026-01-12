import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;