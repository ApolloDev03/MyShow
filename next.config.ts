// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output:"export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
