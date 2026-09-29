import type { NextConfig } from "next";
import { legacyRedirects, legacyRewrites } from "./src/content/routing";

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects.map((route) => ({ ...route, permanent: true }));
  },
  async rewrites() {
    return legacyRewrites.map((route) => ({ ...route }));
  },
};

export default nextConfig;
