/**
 * URL compatibility with the previous site (alfapoint-v2).
 *
 * The old site answered `/` with a permanent redirect to `/home`, which
 * browsers cache. Redirecting `/home` back to `/` would loop for returning
 * visitors, so `/home` is served via a rewrite instead (canonical is `/`).
 */
export type RouteMapping = { source: string; destination: string };

export const legacyRewrites: readonly RouteMapping[] = [
  { source: "/home", destination: "/" },
];

export const legacyRedirects: readonly RouteMapping[] = [
  { source: "/services/hr-services", destination: "/services/dedicated-teams" },
  { source: "/services/dedicated-teams-model", destination: "/services/dedicated-teams" },
  { source: "/services/data-science", destination: "/services/ai-solutions" },
  { source: "/job", destination: "/careers" },
];
