import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_DOMAIN: 'https://sondages-repas.vercel.app',
  },
};

export default nextConfig;
