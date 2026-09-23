import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { jobs } from "@/content/jobs";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/services",
    "/about",
    "/careers",
    "/contact",
    ...services.map((s) => `/services/${s.slug}`),
    ...jobs.map((j) => `/careers/${j.slug}`),
  ];
  return paths.map((path) => ({ url: `${site.url}${path === "/" ? "" : path}` }));
}
