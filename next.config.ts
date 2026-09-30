import type { NextConfig } from "next";
import { legacyRedirects, legacyRewrites } from "./src/content/routing";

// Only frame-ancestors, not a full CSP: it controls who may embed *this* site
// and doesn't affect the Calendly iframe we embed, or hydration.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Public images have unhashed filenames: keep caching short, so a replaced
// photo or logo is picked up within ~25 hours at worst (1 h fresh + 24 h stale).
const assetCache = [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/clients/:path*", headers: assetCache },
      { source: "/team/:path*", headers: assetCache },
      { source: "/tech/:path*", headers: assetCache },
    ];
  },
  async redirects() {
    return legacyRedirects.map((route) => ({ ...route, permanent: true }));
  },
  async rewrites() {
    return legacyRewrites.map((route) => ({ ...route }));
  },
};

export default nextConfig;
