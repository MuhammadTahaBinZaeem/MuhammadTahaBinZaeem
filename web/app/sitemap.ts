import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/projects", "/certifications", "/achievements", "/education"];
  const lastModified = new Date("2026-08-11T00:00:00.000Z");

  return routes.map((route, index) => ({
    url: `${SITE_ORIGIN}${route}`,
    lastModified,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.85,
  }));
}
