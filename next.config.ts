import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  ...(isProd && { basePath: "/my_portfolio_static" }),
  reactStrictMode: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
