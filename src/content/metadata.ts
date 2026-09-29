import type { Metadata } from "next";
import { site } from "./site";

type PageMetaInput = { path: string; title?: string; description?: string };

/**
 * Per-page metadata. Next.js replaces `openGraph` wholesale when a page sets it,
 * so canonical and og:url are always derived together from the same path.
 */
export function pageMetadata({ path, title, description = site.description }: PageMetaInput): Metadata {
  const ogTitle = title ? `${title} | ${site.name}` : `${site.name}: ${site.tagline}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: ogTitle,
      description,
      url: path,
    },
  };
}
