import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/my_portfolio_static",
  reactStrictMode: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
